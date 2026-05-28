import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Streamdown } from "streamdown";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// ── Types ─────────────────────────────────────────────────────────────────────

type ArticleRow = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  tags: string[];
  imageUrl: string | null;
  readTime: number;
  featured: "yes" | "no";
  status: "draft" | "published";
  seoKeywords: string | null;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(d: Date | null | undefined): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const CATEGORIES = [
  "Berita VOXA",
  "Tips & Panduan",
  "Teknologi",
  "Gaya Hidup",
  "Bisnis & Industri",
  "Regulasi & Kebijakan",
];

const ARTICLE_TYPES = [
  { value: "educational", label: "Edukatif" },
  { value: "trend", label: "Tren" },
  { value: "soft-sell", label: "Soft Sell" },
  { value: "hard-sell", label: "Hard Sell" },
] as const;

// ── Draft Preview Card ────────────────────────────────────────────────────────

function DraftCard({
  draft,
  onPublish,
  onDelete,
  onEdit,
}: {
  draft: ArticleRow;
  onPublish: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (draft: ArticleRow) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{ background: "rgba(55,197,255,0.12)", color: "#37C5FF" }}
              >
                {draft.category}
              </span>
              <Badge
                variant={draft.status === "published" ? "default" : "secondary"}
                className={
                  draft.status === "published"
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-amber-100 text-amber-700 border-amber-200"
                }
              >
                {draft.status === "published" ? "Terbit" : "Draft"}
              </Badge>
              <span className="text-xs text-gray-400">{draft.readTime} mnt baca</span>
            </div>
            <h3 className="font-bold text-gray-900 leading-snug line-clamp-2">{draft.title}</h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{draft.excerpt}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
          <span>Dibuat {formatDate(draft.createdAt)}</span>
          {draft.publishedAt && (
            <>
              <span>·</span>
              <span>Terbit {formatDate(draft.publishedAt)}</span>
            </>
          )}
        </div>
      </div>

      {/* Preview toggle */}
      <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-semibold flex items-center gap-1.5 transition-colors"
          style={{ color: "#37C5FF" }}
        >
          <svg
            className={`w-3.5 h-3.5 transition-transform ${expanded ? "rotate-90" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {expanded ? "Sembunyikan Konten" : "Lihat Konten Artikel"}
        </button>
      </div>

      {expanded && (
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 max-h-72 overflow-y-auto">
          <div className="prose prose-sm prose-gray max-w-none text-gray-700">
            <Streamdown>{draft.content}</Streamdown>
          </div>
          {draft.seoKeywords && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">SEO Keywords</p>
              <p className="text-xs text-gray-500">{draft.seoKeywords}</p>
            </div>
          )}
          {draft.tags && draft.tags.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-1.5">
                {draft.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-full border"
                    style={{ borderColor: "#37C5FF", color: "#37C5FF" }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="p-4 flex items-center gap-2 flex-wrap">
        {draft.status === "draft" && (
          <Button
            size="sm"
            onClick={() => onPublish(draft.id)}
            className="text-xs font-semibold text-white"
            style={{ background: "#37C5FF", border: "none" }}
          >
            Terbitkan
          </Button>
        )}
        {draft.status === "published" && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPublish(draft.id)}
            className="text-xs font-semibold border-amber-300 text-amber-700 hover:bg-amber-50"
          >
            Jadikan Draft
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(draft)}
          className="text-xs font-semibold"
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDelete(draft.id)}
          className="text-xs font-semibold border-red-200 text-red-600 hover:bg-red-50 ml-auto"
        >
          Hapus
        </Button>
      </div>
    </div>
  );
}

// ── Edit Modal ────────────────────────────────────────────────────────────────

function EditModal({
  article,
  onClose,
  onSaved,
}: {
  article: ArticleRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(article.title);
  const [excerpt, setExcerpt] = useState(article.excerpt);
  const [content, setContent] = useState(article.content);
  const [seoKeywords, setSeoKeywords] = useState(article.seoKeywords ?? "");
  const [category, setCategory] = useState(article.category);
  const [previewMode, setPreviewMode] = useState(false);

  const utils = trpc.useUtils();
  const updateMutation = trpc.articles.update.useMutation({
    onSuccess: () => {
      toast.success("Artikel berhasil disimpan");
      utils.articles.list.invalidate();
      onSaved();
    },
    onError: (err) => toast.error(err.message),
  });

  const handleSave = () => {
    updateMutation.mutate({
      id: article.id,
      title,
      excerpt,
      content,
      seoKeywords,
      category,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Edit Artikel</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:border-[#37C5FF] transition-colors bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              Judul
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:border-[#37C5FF] transition-colors"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              Ringkasan
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:border-[#37C5FF] transition-colors resize-none"
            />
          </div>

          {/* SEO Keywords */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              SEO Keywords
            </label>
            <input
              type="text"
              value={seoKeywords}
              onChange={(e) => setSeoKeywords(e.target.value)}
              placeholder="voxa, sepeda listrik, ..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:border-[#37C5FF] transition-colors"
            />
          </div>

          {/* Content with preview toggle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Konten (Markdown)
              </label>
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="text-xs font-semibold transition-colors"
                style={{ color: "#37C5FF" }}
              >
                {previewMode ? "Edit" : "Preview"}
              </button>
            </div>
            {previewMode ? (
              <div className="prose prose-sm prose-gray max-w-none p-4 rounded-lg border border-gray-200 bg-gray-50 min-h-[200px] max-h-[400px] overflow-y-auto">
                <Streamdown>{content}</Streamdown>
              </div>
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 outline-none focus:border-[#37C5FF] transition-colors resize-y font-mono"
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="text-sm">
            Batal
          </Button>
          <Button
            onClick={handleSave}
            disabled={updateMutation.isPending}
            className="text-sm text-white"
            style={{ background: "#37C5FF", border: "none" }}
          >
            {updateMutation.isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main Admin Page ───────────────────────────────────────────────────────────

export default function AdminArticles() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  // Generator form state
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("Berita VOXA");
  const [articleType, setArticleType] = useState<"educational" | "trend" | "soft-sell" | "hard-sell">("educational");
  const [keywords, setKeywords] = useState("");
  const [count, setCount] = useState<1 | 2 | 3>(1);

  // Edit modal state
  const [editingArticle, setEditingArticle] = useState<ArticleRow | null>(null);

  const utils = trpc.useUtils();

  // Fetch all articles (admin sees all)
  const { data: articlesData, isLoading: articlesLoading } = trpc.articles.list.useQuery({
    status: "all",
    limit: 50,
    offset: 0,
  });

  const generateMutation = trpc.articles.generate.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.drafts.length} draft artikel berhasil dibuat!`);
      utils.articles.list.invalidate();
      setTopic("");
      setKeywords("");
    },
    onError: (err) => toast.error(`Gagal membuat artikel: ${err.message}`),
  });

  const publishMutation = trpc.articles.publish.useMutation({
    onSuccess: (data) => {
      toast.success(
        data.status === "published" ? "Artikel berhasil diterbitkan!" : "Artikel dijadikan draft."
      );
      utils.articles.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const unpublishMutation = trpc.articles.unpublish.useMutation({
    onSuccess: () => {
      toast.success("Artikel dijadikan draft.");
      utils.articles.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = trpc.articles.delete.useMutation({
    onSuccess: () => {
      toast.success("Artikel dihapus.");
      utils.articles.list.invalidate();
    },
    onError: (err) => toast.error(err.message),
  });

  const handlePublishToggle = useCallback(
    (id: number) => {
      const article = articlesData?.articles.find((a) => a.id === id);
      if (!article) return;
      if (article.status === "draft") {
        publishMutation.mutate({ id });
      } else {
        unpublishMutation.mutate({ id });
      }
    },
    [articlesData, publishMutation, unpublishMutation]
  );

  const handleDelete = useCallback(
    (id: number) => {
      if (!window.confirm("Yakin ingin menghapus artikel ini?")) return;
      deleteMutation.mutate({ id });
    },
    [deleteMutation]
  );

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast.error("Masukkan topik artikel terlebih dahulu");
      return;
    }
    generateMutation.mutate({ topic, category, articleType, keywords: keywords || undefined, count });
  };

  // ── Auth guard ──────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: "#37C5FF", borderTopColor: "transparent" }}
          />
          <p className="text-sm text-gray-500">Memuat...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(55,197,255,0.1)" }}
          >
            <svg className="w-8 h-8" style={{ color: "#37C5FF" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-black text-gray-900 mb-2">Login Diperlukan</h1>
          <p className="text-gray-500 text-sm mb-6">Silakan login untuk mengakses halaman admin.</p>
          <Button
            onClick={() => navigate("/")}
            className="text-white"
            style={{ background: "#37C5FF", border: "none" }}
          >
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(239,68,68,0.1)" }}
          >
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h1 className="text-xl font-black text-gray-900 mb-2">Akses Ditolak</h1>
          <p className="text-gray-500 text-sm mb-6">Halaman ini hanya dapat diakses oleh admin.</p>
          <Button
            onClick={() => navigate("/")}
            className="text-white"
            style={{ background: "#37C5FF", border: "none" }}
          >
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  const allArticles = (articlesData?.articles ?? []) as ArticleRow[];
  const drafts = allArticles.filter((a) => a.status === "draft");
  const published = allArticles.filter((a) => a.status === "published");

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div
        className="border-b border-gray-200 bg-white"
        style={{ borderTop: "3px solid #37C5FF" }}
      >
        <div className="max-w-6xl mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Admin Panel</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900">
              Generator Artikel <span style={{ color: "#37C5FF" }}>AI</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:block">
              {allArticles.length} total · {published.length} terbit · {drafts.length} draft
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/artikel")}
              className="text-xs"
            >
              Lihat Artikel Publik →
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* ── Left: Generator Form ─────────────────────────────────────────── */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-24">
            {/* Form header */}
            <div
              className="px-6 py-4 border-b border-gray-100"
              style={{ background: "linear-gradient(135deg, rgba(55,197,255,0.08) 0%, rgba(10,74,99,0.04) 100%)" }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(55,197,255,0.15)" }}
                >
                  <svg className="w-4 h-4" style={{ color: "#37C5FF" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-bold text-gray-900 text-sm">Buat Artikel Baru</h2>
                  <p className="text-xs text-gray-400">Powered by AI</p>
                </div>
              </div>
            </div>

            {/* Form body */}
            <div className="p-6 space-y-5">
              {/* Topic */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Topik Artikel <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Contoh: Manfaat sepeda listrik untuk commuter di Jakarta"
                  rows={3}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border outline-none transition-all resize-none"
                  style={{
                    borderColor: topic ? "#37C5FF" : "#e5e7eb",
                    boxShadow: topic ? "0 0 0 3px rgba(55,197,255,0.12)" : "none",
                  }}
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Kategori
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:border-[#37C5FF] transition-colors bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Article Type */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                  Tipe Artikel
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ARTICLE_TYPES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setArticleType(t.value)}
                      className="px-3 py-2 rounded-xl text-xs font-semibold border transition-all"
                      style={
                        articleType === t.value
                          ? { background: "#37C5FF", color: "#fff", borderColor: "#37C5FF" }
                          : { background: "transparent", color: "#6b7280", borderColor: "#e5e7eb" }
                      }
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Extra Keywords */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
                  Kata Kunci Tambahan
                </label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="baterai, motor listrik, ..."
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:border-[#37C5FF] transition-colors"
                />
              </div>

              {/* Count */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                  Jumlah Draft
                </label>
                <div className="flex gap-2">
                  {([1, 2, 3] as const).map((n) => (
                    <button
                      key={n}
                      onClick={() => setCount(n)}
                      className="flex-1 py-2 rounded-xl text-sm font-bold border transition-all"
                      style={
                        count === n
                          ? { background: "#0A4A63", color: "#fff", borderColor: "#0A4A63" }
                          : { background: "transparent", color: "#6b7280", borderColor: "#e5e7eb" }
                      }
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate button */}
              <Button
                onClick={handleGenerate}
                disabled={generateMutation.isPending || !topic.trim()}
                className="w-full py-3 text-sm font-bold text-white rounded-xl transition-all"
                style={{
                  background: generateMutation.isPending ? "#9ca3af" : "#37C5FF",
                  border: "none",
                  boxShadow: generateMutation.isPending ? "none" : "0 4px 15px rgba(55,197,255,0.4)",
                }}
              >
                {generateMutation.isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin inline-block"
                      style={{ borderColor: "#fff", borderTopColor: "transparent" }}
                    />
                    Membuat {count} artikel...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate {count} Artikel
                  </span>
                )}
              </Button>

              {generateMutation.isPending && (
                <p className="text-xs text-center text-gray-400 animate-pulse">
                  AI sedang menulis artikel... ini mungkin membutuhkan beberapa detik.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Right: Article List ──────────────────────────────────────────── */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="drafts">
            <TabsList className="mb-6 bg-white border border-gray-200 rounded-xl p-1">
              <TabsTrigger value="drafts" className="rounded-lg text-sm font-semibold">
                Draft
                {drafts.length > 0 && (
                  <span
                    className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full text-white"
                    style={{ background: "#37C5FF" }}
                  >
                    {drafts.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="published" className="rounded-lg text-sm font-semibold">
                Terbit
                {published.length > 0 && (
                  <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-green-500 text-white">
                    {published.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="all" className="rounded-lg text-sm font-semibold">
                Semua
              </TabsTrigger>
            </TabsList>

            {articlesLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <div
                  className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: "#37C5FF", borderTopColor: "transparent" }}
                />
                <p className="text-sm text-gray-400">Memuat artikel...</p>
              </div>
            ) : (
              <>
                <TabsContent value="drafts">
                  {drafts.length === 0 ? (
                    <EmptyState message="Belum ada draft artikel." hint="Generate artikel baru menggunakan form di sebelah kiri." />
                  ) : (
                    <div className="space-y-4">
                      {drafts.map((a) => (
                        <DraftCard
                          key={a.id}
                          draft={a as ArticleRow}
                          onPublish={handlePublishToggle}
                          onDelete={handleDelete}
                          onEdit={setEditingArticle}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="published">
                  {published.length === 0 ? (
                    <EmptyState message="Belum ada artikel yang diterbitkan." hint="Terbitkan draft artikel agar tampil di halaman publik." />
                  ) : (
                    <div className="space-y-4">
                      {published.map((a) => (
                        <DraftCard
                          key={a.id}
                          draft={a as ArticleRow}
                          onPublish={handlePublishToggle}
                          onDelete={handleDelete}
                          onEdit={setEditingArticle}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="all">
                  {allArticles.length === 0 ? (
                    <EmptyState message="Belum ada artikel." hint="Generate artikel pertama Anda menggunakan form di sebelah kiri." />
                  ) : (
                    <div className="space-y-4">
                      {allArticles.map((a) => (
                        <DraftCard
                          key={a.id}
                          draft={a as ArticleRow}
                          onPublish={handlePublishToggle}
                          onDelete={handleDelete}
                          onEdit={setEditingArticle}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>

      {/* Edit Modal */}
      {editingArticle && (
        <EditModal
          article={editingArticle}
          onClose={() => setEditingArticle(null)}
          onSaved={() => setEditingArticle(null)}
        />
      )}
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────

function EmptyState({ message, hint }: { message: string; hint: string }) {
  return (
    <div className="text-center py-20">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ background: "rgba(55,197,255,0.1)" }}
      >
        <svg className="w-7 h-7" style={{ color: "#37C5FF" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <p className="font-semibold text-gray-700 mb-1">{message}</p>
      <p className="text-sm text-gray-400">{hint}</p>
    </div>
  );
}
