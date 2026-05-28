import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { articlesTable } from "../../drizzle/schema";
import { invokeLLM } from "../_core/llm";

// ── Helpers ──────────────────────────────────────────────────────────────────

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 200);
}

function estimateReadTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

// ── Article Router ────────────────────────────────────────────────────────────

export const articlesRouter = router({
  // Generate a new article draft using AI (admin only)
  generate: protectedProcedure
    .input(
      z.object({
        topic: z.string().min(3).max(300),
        category: z.string().default("Berita VOXA"),
        articleType: z
          .enum(["educational", "trend", "soft-sell", "hard-sell"])
          .default("educational"),
        keywords: z.string().optional(), // comma-separated extra keywords
        count: z.number().min(1).max(3).default(1), // generate 1-3 drafts
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "DB unavailable" });

      const typeDescriptions: Record<string, string> = {
        educational: "artikel edukatif yang menjelaskan konsep, tips, atau panduan praktis",
        trend: "artikel tren yang membahas perkembangan terbaru industri kendaraan listrik",
        "soft-sell": "artikel soft sell yang secara halus mempromosikan produk VOXA dalam konteks informatif",
        "hard-sell": "artikel hard sell yang secara langsung mempromosikan produk VOXA dengan ajakan beli yang kuat",
      };

      const extraKeywords = input.keywords
        ? `, ${input.keywords}`
        : "";

      const systemPrompt = `Kamu adalah penulis konten SEO profesional untuk VOXA, merek sepeda listrik asli Indonesia. 
Tulis artikel dalam Bahasa Indonesia yang berkualitas tinggi, informatif, dan SEO-friendly.
Setiap artikel HARUS menyertakan kata kunci 'voxa' dan kata kunci relevan lainnya secara alami.
Format output HARUS berupa JSON yang valid dengan struktur berikut:
{
  "title": "judul artikel yang menarik dan SEO-friendly",
  "excerpt": "ringkasan 2-3 kalimat yang menarik pembaca",
  "content": "konten artikel lengkap dalam format Markdown (gunakan ## untuk heading, **bold**, *italic*, bullet points dengan -)",
  "seoKeywords": "kata kunci 1, kata kunci 2, kata kunci 3, voxa",
  "tags": ["tag1", "tag2", "tag3"]
}`;

      const userPrompt = `Tulis ${typeDescriptions[input.articleType]} tentang topik: "${input.topic}"
Kategori: ${input.category}
Kata kunci utama: voxa, sepeda listrik, kendaraan listrik Indonesia${extraKeywords}
Panjang artikel: minimal 600 kata, maksimal 1200 kata.
Pastikan artikel relevan dengan produk VOXA dan pasar Indonesia.`;

      const drafts = [];

      for (let i = 0; i < input.count; i++) {
        const variation = i === 0 ? "" : i === 1 ? " (variasi sudut pandang berbeda)" : " (variasi gaya penulisan berbeda)";
        
        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt + variation },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "article_draft",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  excerpt: { type: "string" },
                  content: { type: "string" },
                  seoKeywords: { type: "string" },
                  tags: { type: "array", items: { type: "string" } },
                },
                required: ["title", "excerpt", "content", "seoKeywords", "tags"],
                additionalProperties: false,
              },
            },
          },
        });

        const raw = (response.choices[0]?.message?.content as string) ?? "{}";
        let parsed: { title: string; excerpt: string; content: string; seoKeywords: string; tags: string[] };
        try {
          parsed = JSON.parse(raw);
        } catch {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "AI returned invalid JSON" });
        }

        const baseSlug = slugify(parsed.title);
        const slug = `${baseSlug}-${Date.now()}-${i}`;

        // Save as draft to DB
        await db.insert(articlesTable).values({
          slug,
          title: parsed.title,
          excerpt: parsed.excerpt,
          content: parsed.content,
          category: input.category,
          seoKeywords: parsed.seoKeywords,
          tags: JSON.stringify(parsed.tags),
          readTime: estimateReadTime(parsed.content),
          status: "draft",
          featured: "no",
          author: "Tim Redaksi VOXA",
        });

        const [saved] = await db
          .select()
          .from(articlesTable)
          .where(eq(articlesTable.slug, slug))
          .limit(1);

        drafts.push(saved);
      }

      return { drafts };
    }),

  // List all articles (admin: all, public: published only)
  list: publicProcedure
    .input(
      z.object({
        status: z.enum(["draft", "published", "all"]).default("published"),
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return { articles: [], total: 0 };

      const isAdmin = (ctx as any)?.user?.role === "admin";

      let rows;
      if (input.status === "all" && isAdmin) {
        rows = await db
          .select()
          .from(articlesTable)
          .orderBy(desc(articlesTable.createdAt))
          .limit(input.limit)
          .offset(input.offset);
      } else {
        const statusFilter = input.status === "all" ? "published" : input.status;
        rows = await db
          .select()
          .from(articlesTable)
          .where(eq(articlesTable.status, statusFilter as "draft" | "published"))
          .orderBy(desc(articlesTable.publishedAt))
          .limit(input.limit)
          .offset(input.offset);
      }

      return {
        articles: rows.map((r) => ({
          ...r,
          tags: r.tags ? JSON.parse(r.tags) : [],
        })),
      };
    }),

  // Get single article by slug (public: published only; admin: any status)
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return null;

      const isAdmin = (ctx as any)?.user?.role === "admin";

      const [row] = await db
        .select()
        .from(articlesTable)
        .where(
          isAdmin
            ? eq(articlesTable.slug, input.slug)
            : and(eq(articlesTable.slug, input.slug), eq(articlesTable.status, "published"))
        )
        .limit(1);

      if (!row) return null;
      return { ...row, tags: row.tags ? JSON.parse(row.tags) : [] };
    }),

  // Update article (admin only)
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        category: z.string().optional(),
        seoKeywords: z.string().optional(),
        tags: z.array(z.string()).optional(),
        featured: z.enum(["yes", "no"]).optional(),
        imageUrl: z.string().optional(),
        author: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const { id, tags, ...rest } = input;
      const updateData: Record<string, unknown> = { ...rest };
      if (tags !== undefined) updateData.tags = JSON.stringify(tags);
      if (rest.title) {
        updateData.slug = `${slugify(rest.title)}-${id}`;
        updateData.readTime = rest.content ? estimateReadTime(rest.content) : undefined;
      }

      await db.update(articlesTable).set(updateData).where(eq(articlesTable.id, id));
      const [updated] = await db.select().from(articlesTable).where(eq(articlesTable.id, id)).limit(1);
      return { ...updated, tags: updated.tags ? JSON.parse(updated.tags) : [] };
    }),

  // Publish a draft article (admin only)
  publish: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db
        .update(articlesTable)
        .set({ status: "published", publishedAt: new Date() })
        .where(eq(articlesTable.id, input.id));

      const [row] = await db.select().from(articlesTable).where(eq(articlesTable.id, input.id)).limit(1);
      return { ...row, tags: row.tags ? JSON.parse(row.tags) : [] };
    }),

  // Unpublish (revert to draft) (admin only)
  unpublish: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db
        .update(articlesTable)
        .set({ status: "draft", publishedAt: null })
        .where(eq(articlesTable.id, input.id));

      return { success: true };
    }),

  // Delete article (admin only)
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db.delete(articlesTable).where(eq(articlesTable.id, input.id));
      return { success: true };
    }),
});
