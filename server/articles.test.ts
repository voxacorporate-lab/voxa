import { describe, expect, it, vi, beforeEach } from "vitest";
import { TRPCError } from "@trpc/server";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ── Mocks (hoisted) ───────────────────────────────────────────────────────────

vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [
      {
        message: {
          content: JSON.stringify({
            title: "Manfaat Sepeda Listrik VOXA untuk Commuter",
            excerpt: "Sepeda listrik VOXA hadir sebagai solusi mobilitas modern yang ramah lingkungan.",
            content: "## Pendahuluan\n\nSepeda listrik VOXA adalah pilihan terbaik untuk commuter modern.",
            seoKeywords: "voxa, sepeda listrik, commuter, kendaraan listrik",
            tags: ["voxa", "sepeda listrik", "commuter"],
          }),
        },
      },
    ],
  }),
}));

// ── Sample DB row ─────────────────────────────────────────────────────────────

const sampleRow = {
  id: 1,
  slug: "manfaat-sepeda-listrik-voxa-1234567890-0",
  title: "Manfaat Sepeda Listrik VOXA untuk Commuter",
  excerpt: "Sepeda listrik VOXA hadir sebagai solusi mobilitas modern yang ramah lingkungan.",
  content: "## Pendahuluan\n\nSepeda listrik VOXA adalah pilihan terbaik untuk commuter modern.",
  category: "Berita VOXA",
  author: "Tim Redaksi VOXA",
  tags: JSON.stringify(["voxa", "sepeda listrik", "commuter"]),
  imageUrl: null,
  readTime: 1,
  featured: "no" as const,
  status: "draft" as const,
  seoKeywords: "voxa, sepeda listrik, commuter, kendaraan listrik",
  createdAt: new Date("2025-05-01"),
  updatedAt: new Date("2025-05-01"),
  publishedAt: null,
};

// ── DB mock factory ───────────────────────────────────────────────────────────

function makeSelectChain(rows: unknown[]) {
  // Build a proxy-like chain where every method returns the chain itself,
  // except offset (terminal for paginated queries) and limit (terminal for
  // non-paginated queries like getBySlug) which resolve with rows.
  const chain: Record<string, ReturnType<typeof vi.fn>> = {};
  // Non-terminal methods
  for (const m of ['from', 'where', 'orderBy']) {
    chain[m] = vi.fn().mockReturnValue(chain);
  }
  // limit: returns chain AND resolves (for non-paginated callers)
  chain['limit'] = vi.fn().mockImplementation(() => {
    // Return a thenable chain (has both .then/.offset)
    const limitResult = {
      ...chain,
      offset: vi.fn().mockResolvedValue(rows),
      then: (resolve: (v: unknown[]) => void) => resolve(rows),
    };
    return limitResult;
  });
  chain['offset'] = vi.fn().mockResolvedValue(rows);
  return chain;
}

function makeDb(selectRows: unknown[] = []) {
  return {
    insert: vi.fn().mockReturnValue({ values: vi.fn().mockResolvedValue(undefined) }),
    select: vi.fn().mockReturnValue(makeSelectChain(selectRows)),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }),
    }),
    delete: vi.fn().mockReturnValue({ where: vi.fn().mockResolvedValue(undefined) }),
  };
}

vi.mock("./db", () => ({
  getDb: vi.fn(),
}));

import { getDb } from "./db";

// ── Context helpers ───────────────────────────────────────────────────────────

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminCtx(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@voxa.id",
    name: "Admin VOXA",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createUserCtx(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createGuestCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("articles.generate", () => {
  beforeEach(() => {
    vi.mocked(getDb).mockResolvedValue(makeDb([sampleRow]) as ReturnType<typeof makeDb> as any);
  });

  it("generates a draft article for admin", async () => {
    const caller = appRouter.createCaller(createAdminCtx());
    const result = await caller.articles.generate({
      topic: "Manfaat sepeda listrik untuk commuter",
      category: "Berita VOXA",
      articleType: "educational",
      count: 1,
    });

    expect(result.drafts).toHaveLength(1);
    expect(result.drafts[0]?.title).toBe("Manfaat Sepeda Listrik VOXA untuk Commuter");
    expect(result.drafts[0]?.status).toBe("draft");
  });

  it("throws FORBIDDEN for non-admin users", async () => {
    const caller = appRouter.createCaller(createUserCtx());
    await expect(
      caller.articles.generate({ topic: "Test topic", count: 1 })
    ).rejects.toThrow(TRPCError);
  });

  it("throws UNAUTHORIZED for guests", async () => {
    const caller = appRouter.createCaller(createGuestCtx());
    await expect(
      caller.articles.generate({ topic: "Test topic", count: 1 })
    ).rejects.toThrow();
  });
});

describe("articles.list", () => {
  it("returns published articles for public users", async () => {
    const publishedRow = { ...sampleRow, status: "published" as const, publishedAt: new Date("2025-05-02") };
    vi.mocked(getDb).mockResolvedValue(makeDb([publishedRow]) as any);

    const caller = appRouter.createCaller(createGuestCtx());
    const result = await caller.articles.list({ status: "published" });
    expect(result.articles).toBeDefined();
    expect(Array.isArray(result.articles)).toBe(true);
  });

  it("returns all articles for admin when status=all", async () => {
    vi.mocked(getDb).mockResolvedValue(makeDb([sampleRow]) as any);

    const caller = appRouter.createCaller(createAdminCtx());
    const result = await caller.articles.list({ status: "all" });
    expect(result.articles).toBeDefined();
  });

  it("parses tags from JSON string", async () => {
    const publishedRow = { ...sampleRow, status: "published" as const, publishedAt: new Date("2025-05-02") };
    vi.mocked(getDb).mockResolvedValue(makeDb([publishedRow]) as any);

    const caller = appRouter.createCaller(createGuestCtx());
    const result = await caller.articles.list({ status: "published" });
    if (result.articles.length > 0) {
      expect(Array.isArray(result.articles[0]?.tags)).toBe(true);
    }
  });
});

describe("articles.getBySlug", () => {
  it("returns null when article not found", async () => {
    vi.mocked(getDb).mockResolvedValue(makeDb([]) as any);

    const caller = appRouter.createCaller(createGuestCtx());
    const result = await caller.articles.getBySlug({ slug: "non-existent-slug" });
    expect(result).toBeNull();
  });

  it("returns article with parsed tags when found", async () => {
    vi.mocked(getDb).mockResolvedValue(makeDb([sampleRow]) as any);

    const caller = appRouter.createCaller(createGuestCtx());
    const result = await caller.articles.getBySlug({ slug: sampleRow.slug });
    expect(result).not.toBeNull();
    expect(Array.isArray(result?.tags)).toBe(true);
  });
});

describe("articles.publish", () => {
  it("publishes a draft article for admin", async () => {
    const publishedRow = { ...sampleRow, status: "published" as const, publishedAt: new Date() };
    vi.mocked(getDb).mockResolvedValue(makeDb([publishedRow]) as any);

    const caller = appRouter.createCaller(createAdminCtx());
    const result = await caller.articles.publish({ id: 1 });
    expect(result.status).toBe("published");
  });

  it("throws FORBIDDEN for non-admin", async () => {
    vi.mocked(getDb).mockResolvedValue(makeDb([]) as any);

    const caller = appRouter.createCaller(createUserCtx());
    await expect(caller.articles.publish({ id: 1 })).rejects.toThrow(TRPCError);
  });
});

describe("articles.delete", () => {
  it("deletes an article for admin", async () => {
    vi.mocked(getDb).mockResolvedValue(makeDb([]) as any);

    const caller = appRouter.createCaller(createAdminCtx());
    const result = await caller.articles.delete({ id: 1 });
    expect(result.success).toBe(true);
  });

  it("throws FORBIDDEN for non-admin", async () => {
    vi.mocked(getDb).mockResolvedValue(makeDb([]) as any);

    const caller = appRouter.createCaller(createUserCtx());
    await expect(caller.articles.delete({ id: 1 })).rejects.toThrow(TRPCError);
  });
});
