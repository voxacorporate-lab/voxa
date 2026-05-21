import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { Heart, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { sepedaListrik, batre, products } from '@/data/products';

// Curated Produk Unggulan: all 5 Elite series only
const produkUnggulan = (() => {
  const byId = (id: string) => products.find(p => p.id === id);
  return [
    byId('elite-rider-s'),
    byId('elite-fantasi-s'),
    byId('elite-rider'),
    byId('elite-fantasi'),
    byId('elite-city'),
  ].filter((p): p is NonNullable<typeof p> => p != null);
})();

// Curated Sepeda Listrik Terbaru: Liberty + Eiffel series (8 products with new images)
const sepedaListrikTerbaru = (() => {
  const byId = (id: string) => products.find(p => p.id === id);
  return [
    byId('liberty-7'),
    byId('liberty'),
    byId('liberty-star'),
    byId('eiffel-7'),
    byId('liberty-ultimate'),
    byId('liberty-stylish'),
    byId('eiffel-city'),
    byId('eiffel-rider'),
  ].filter((p): p is NonNullable<typeof p> => p != null);
})();

// ─── Image constants ──────────────────────────────────────────────────────────
const HERO_BG = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1800&q=90';

// Campaign banner images (3-panel mosaic)
const BANNER1 = '/manus-storage/campaign1_3919f523.png';
const BANNER2 = '/manus-storage/campaign2_2430bf5c.png';
const BANNER3 = '/manus-storage/campaign3_58add809.png';

// Campaign banner 2 images
const BANNER2A = 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=800&q=80';
const BANNER2B = 'https://images.unsplash.com/photo-1620714223084-8fcacc2dbe4d?w=800&q=80';
const BANNER2C = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80';

// Popular / lifestyle images
const POP_IMG_1 = 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80';
const POP_IMG_2 = 'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=600&q=80';
const POP_IMG_3 = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80';
const POP_IMG_4 = 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=600&q=80';

// Lifestyle collage images
const LIFE1 = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80';
const LIFE2 = 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=600&q=80';
const LIFE3 = 'https://images.unsplash.com/photo-1593764592116-bfb2a97c642a?w=600&q=80';
const LIFE4 = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80';
const LIFE5 = 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=600&q=80';
const LIFE6 = 'https://images.unsplash.com/photo-1620714223084-8fcacc2dbe4d?w=600&q=80';

// Community / customer photos
const COMMUNITY_PHOTOS: string[] = [
  '/manus-storage/p1_ea197215.jpeg',
  '/manus-storage/p2_1d043544.jpeg',
  '/manus-storage/p3_7d54d5c7.jpeg',
  '/manus-storage/p4_a39a5f06.webp',
  '/manus-storage/p5_e82e8225.webp',
  '/manus-storage/p6_d73b34de.jpeg',
  '/manus-storage/p7_77ff902f.jpeg',
  '/manus-storage/p8_e3bb9c56.jpeg',
  '/manus-storage/p9_a21a0dde.jpeg',
  '/manus-storage/p10_bece9069.jpeg',
  '/manus-storage/p11_c9441a58.jpeg',
  '/manus-storage/p12_591a9764.jpeg',
  '/manus-storage/p13_ae54b341.jpeg',
  '/manus-storage/p14_9e05130d.jpeg',
  '/manus-storage/p15_3fc672ab.webp',
  '/manus-storage/p16_767380d5.jpeg',
  '/manus-storage/p17_461886b0.jpeg',
  '/manus-storage/p18_6f004696.webp',
  '/manus-storage/p19_ebdd7cfd.jpeg',
  '/manus-storage/p20_8168671d.webp',
  '/manus-storage/p21_57182216.jpeg',
  '/manus-storage/p23_41a4bd78.jpeg',
  '/manus-storage/p24_c2b9880d.jpeg',
];

// ─── Product Card ───────────────────────────────────────────────────────────────────
function ProductCard({ product, cardWidth }: { product: (typeof sepedaListrik)[0]; cardWidth: string }) {
  const [wishlisted, setWishlisted] = useState(false);
  return (
    <div
      className="group relative flex-shrink-0"
      style={{ width: cardWidth, scrollSnapAlign: 'start' }}
    >
      <Link href={`/product/${product.id}`}>
        {/* Image area — fixed height on desktop, scales down on smaller screens */}
        <div
          className="relative overflow-hidden bg-white"
          style={{ height: 'clamp(200px, 28vw, 480px)' }}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
          />
          {product.badge && (
            <span className="absolute bottom-3 left-3 bg-black text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
              {product.badge}
            </span>
          )}
        </div>
        {/* Text block */}
        <div className="pt-3 pb-2">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-0.5">{product.series}</p>
          <h3 className="text-sm font-semibold text-gray-900 leading-snug mb-1">{product.name}</h3>
          <p className="text-sm font-bold text-gray-900">{product.price}</p>
        </div>
      </Link>
      {/* Wishlist icon */}
      <button
        onClick={() => setWishlisted(w => !w)}
        className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        aria-label="Tambah ke wishlist"
      >
        <Heart size={14} className={wishlisted ? 'fill-[#00B4D8] text-[#00B4D8]' : 'text-gray-400'} />
      </button>
    </div>
  );
}

// ─── Horizontal Product Row ───────────────────────────────────────────────────────
function ProductRow({ title, viewAllHref, products }: { title: string; viewAllHref: string; products: (typeof sepedaListrik) }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobilePage, setMobilePage] = useState(0);

  const GAP = 16;

  // Detect mobile breakpoint
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Desktop scroll
  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === 'right' ? scrollRef.current.offsetWidth : -scrollRef.current.offsetWidth,
      behavior: 'smooth',
    });
  };

  // Mobile: group products into pages of 4 (2×2)
  const MOBILE_PAGE_SIZE = 4;
  const mobilePages = [];
  for (let i = 0; i < products.length; i += MOBILE_PAGE_SIZE) {
    mobilePages.push(products.slice(i, i + MOBILE_PAGE_SIZE));
  }
  const totalMobilePages = mobilePages.length;

  const mobilePrev = () => setMobilePage(p => Math.max(0, p - 1));
  const mobileNext = () => setMobilePage(p => Math.min(totalMobilePages - 1, p + 1));

  return (
    <section className="py-10 md:py-16 bg-white">
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1rem' }} className="md:[padding:0_2rem]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="font-display text-xl md:text-3xl text-gray-900 tracking-wide">{title}</h2>
          <div className="flex items-center gap-3 md:gap-4">
            <Link
              href={viewAllHref}
              className="text-xs md:text-sm font-semibold text-gray-900 underline underline-offset-4 hover:text-[#00B4D8] transition-colors"
            >
              Lihat Semua
            </Link>
            <div className="flex gap-2">
              <button
                onClick={isMobile ? mobilePrev : () => scroll('left')}
                className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-900 transition-colors disabled:opacity-30"
                aria-label="Scroll kiri"
                disabled={isMobile && mobilePage === 0}
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={isMobile ? mobileNext : () => scroll('right')}
                className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-[#00B4D8] transition-colors disabled:opacity-30"
                aria-label="Scroll kanan"
                disabled={isMobile && mobilePage === totalMobilePages - 1}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── MOBILE: 2×2 grid pager ── */}
        {isMobile ? (
          <div>
            <div
              className="grid"
              style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}
            >
              {(mobilePages[mobilePage] ?? []).map(p => (
                <MobileProductCard key={p.id} product={p} />
              ))}
            </div>
            {/* Dot indicators */}
            {totalMobilePages > 1 && (
              <div className="flex justify-center gap-1.5 mt-4">
                {mobilePages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setMobilePage(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      i === mobilePage ? 'bg-gray-900' : 'bg-gray-300'
                    }`}
                    aria-label={`Halaman ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ── DESKTOP / TABLET: horizontal scroll row ── */
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide"
            style={{
              gap: `${GAP}px`,
              scrollSnapType: 'x mandatory',
              overflowY: 'hidden',
            }}
          >
            {products.map(p => {
              const cardWidth = `min(calc((min(100vw, 1440px) - 4rem - ${GAP * 3}px) / 4), 340px)`;
              return (
                <ProductCard key={p.id} product={p} cardWidth={cardWidth} />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Mobile Product Card (2×2 grid item) ─────────────────────────────────────
function MobileProductCard({ product }: { product: (typeof sepedaListrik)[0] }) {
  const [wishlisted, setWishlisted] = useState(false);
  return (
    <div className="group relative">
      <Link href={`/product/${product.id}`}>
        {/* Square image area */}
        <div className="relative overflow-hidden bg-white" style={{ aspectRatio: '1/1' }}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500"
          />
          {product.badge && (
            <span className="absolute bottom-2 left-2 bg-black text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5">
              {product.badge}
            </span>
          )}
        </div>
        {/* Text */}
        <div className="pt-2 pb-1">
          <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-0.5 truncate">{product.series}</p>
          <h3 className="text-xs font-semibold text-gray-900 leading-snug mb-0.5 line-clamp-2">{product.name}</h3>
          <p className="text-xs font-bold text-gray-900">{product.price}</p>
        </div>
      </Link>
      {/* Wishlist */}
      <button
        onClick={() => setWishlisted(w => !w)}
        className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-sm"
        aria-label="Tambah ke wishlist"
      >
        <Heart size={11} className={wishlisted ? 'fill-[#00B4D8] text-[#00B4D8]' : 'text-gray-400'} />
      </button>
    </div>
  );
}

// ─── Campaign Banner (3-panel mosaic on desktop, swipe carousel on mobile) ──────────
function CampaignBanner({
  img1, img2, img3,
  headline, subtext, ctaLabel, ctaHref,
}: {
  img1: string; img2: string; img3: string;
  headline: string; subtext: string; ctaLabel: string; ctaHref: string;
}) {
  const images = [img1, img2, img3];

  return (
    <section className="w-full overflow-hidden">
      {/* ── DESKTOP / TABLET (≥768px): original 3-panel mosaic ── */}
      <div
        className="hidden md:flex"
        style={{ height: 'clamp(320px, 55vh, 620px)' }}
      >
        {/* Panel 1 — text overlay */}
        <div className="relative flex-1 overflow-hidden">
          <img src={img1} alt="" className="w-full h-full object-cover object-center" />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 70%, transparent 100%)' }}
          />
          <div className="absolute bottom-0 left-0 p-8 md:p-12">
            <h2 className="font-display text-white text-2xl md:text-4xl tracking-wide leading-tight mb-2">{headline}</h2>
            <p className="text-gray-200 text-sm mb-4 max-w-xs leading-relaxed">{subtext}</p>
            <Link
              href={ctaHref}
              className="text-white text-sm font-semibold underline underline-offset-4 decoration-white hover:decoration-[#00B4D8] hover:text-[#00B4D8] transition-colors"
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
        {/* Panel 2 */}
        <div className="relative flex-1 overflow-hidden border-l border-white/10">
          <img src={img2} alt="" className="w-full h-full object-cover object-center" />
        </div>
        {/* Panel 3 */}
        <div className="relative flex-1 overflow-hidden border-l border-white/10">
          <img src={img3} alt="" className="w-full h-full object-cover object-center" />
        </div>
      </div>

      {/* ── MOBILE (<768px): horizontal swipe carousel, no text overlays ── */}
      <div className="md:hidden">
        <div
          className="flex overflow-x-auto"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            gap: '12px',
            padding: '0 16px 16px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {images.map((src, i) => (
            <div
              key={i}
              className="flex-shrink-0 overflow-hidden rounded-2xl"
              style={{
                width: '82vw',
                aspectRatio: '4/3',
                scrollSnapAlign: 'start',
              }}
            >
              <img
                src={src}
                alt={`Campaign ${i + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Popular Grid ─────────────────────────────────────────────────────────────
const popularItemsByTab: Record<'HARIAN' | 'BISNIS', typeof useTiles> = {
  HARIAN: [
    { label: 'LIBERTY SERIES', img: POP_IMG_1, href: '/catalog/sepeda-listrik' },
    { label: 'EIFFEL SERIES', img: POP_IMG_2, href: '/catalog/sepeda-listrik' },
    { label: 'ELITE SERIES', img: POP_IMG_3, href: '/catalog/sepeda-listrik' },
    { label: 'VOXA G3', img: POP_IMG_4, href: '/catalog/sepeda-listrik' },
  ],
  BISNIS: [
    { label: 'VOXA KURIR', img: POP_IMG_2, href: '/bisnis' },
    { label: 'FLEET SOLUTION', img: POP_IMG_3, href: '/pemerintah' },
    { label: 'BATRE GREENLIFE', img: POP_IMG_4, href: '/catalog/batre' },
    { label: 'SPAREPART', img: POP_IMG_1, href: '/catalog/sparepart' },
  ],
};

// ─── Lifestyle use tiles ──────────────────────────────────────────────────────
const useTiles = [
  { label: 'HARIAN', img: POP_IMG_1, href: '/catalog/sepeda-listrik?use=harian' },
  { label: 'KURIR', img: POP_IMG_2, href: '/bisnis' },
  { label: 'LIFESTYLE', img: POP_IMG_3, href: '/catalog/sepeda-listrik?use=lifestyle' },
  { label: 'FLEET', img: POP_IMG_4, href: '/pemerintah' },
];

const useTilesByTab: Record<'HARIAN' | 'BISNIS', typeof useTiles> = {
  HARIAN: [
    { label: 'HARIAN', img: POP_IMG_1, href: '/catalog/sepeda-listrik?use=harian' },
    { label: 'LIFESTYLE', img: POP_IMG_2, href: '/catalog/sepeda-listrik?use=lifestyle' },
    { label: 'COMMUTER', img: POP_IMG_3, href: '/catalog/sepeda-listrik' },
    { label: 'PELAJAR', img: POP_IMG_4, href: '/catalog/sepeda-listrik' },
  ],
  BISNIS: [
    { label: 'KURIR', img: POP_IMG_2, href: '/bisnis' },
    { label: 'FLEET', img: POP_IMG_3, href: '/pemerintah' },
    { label: 'LOGISTIK', img: POP_IMG_4, href: '/bisnis' },
    { label: 'PEMERINTAH', img: POP_IMG_1, href: '/pemerintah' },
  ],
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Home() {
  const [popularTab, setPopularTab] = useState<'HARIAN' | 'BISNIS'>('HARIAN');
  const [useTab, setUseTab] = useState<'HARIAN' | 'BISNIS'>('HARIAN');

  return (
    <div className="min-h-screen bg-white">

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3: HERO — 85–90vh, full-width, bottom-left text
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative w-full overflow-hidden bg-black"
        style={{ height: 'clamp(480px, 75vh, 820px)' }}
      >
        <img
          src={HERO_BG}
          alt="VOXA — Kendaraan Listrik untuk Jalanan Indonesia"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ opacity: 0.82 }}
        />
        {/* Bottom gradient for text legibility */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 35%, transparent 65%)' }}
        />
        {/* Left gradient */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.45) 0%, transparent 55%)' }}
        />

        {/* Bottom-left text block */}
        <div className="absolute bottom-0 left-0" style={{ padding: 'clamp(1.5rem, 5vw, 4rem) clamp(1.5rem, 6vw, 5rem)' }}>
          <h1 className="font-display text-white leading-none tracking-wide mb-2" style={{ fontSize: 'clamp(2.625rem, 5vw, 4.5rem)' }}>
            KENDARAAN LISTRIK{' '}
            <span className="text-[#00B4D8]">UNTUK JALANAN</span>{' '}
            INDONESIA.
          </h1>
          <p className="text-gray-200 mb-4 leading-snug" style={{ fontSize: 'clamp(0.8rem, 1.1vw, 1rem)', maxWidth: '30rem' }}>
            Desain modern, performa tangguh, dan hemat energi untuk jalanan Indonesia.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/catalog/sepeda-listrik"
              className="text-white font-semibold underline underline-offset-4 decoration-white hover:decoration-[#00B4D8] hover:text-[#00B4D8] transition-colors"
              style={{ fontSize: 'clamp(0.8rem, 1vw, 0.9rem)' }}
            >
              Temukan Produk
            </Link>
            <Link
              href="/compare"
              className="text-white font-semibold underline underline-offset-4 decoration-white hover:decoration-[#00B4D8] hover:text-[#00B4D8] transition-colors"
              style={{ fontSize: 'clamp(0.8rem, 1vw, 0.9rem)' }}
            >
              Bandingkan Model
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4: PRODUCT ROW — PRODUK UNGGULAN (horizontal scroll)
      ═══════════════════════════════════════════════════════════════ */}
      <ProductRow
        title="PRODUK UNGGULAN"
        viewAllHref="/catalog/sepeda-listrik"
        products={produkUnggulan}
      />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 5: CAMPAIGN BANNER — 3-panel mosaic
      ═══════════════════════════════════════════════════════════════ */}
      <CampaignBanner
        img1={BANNER1}
        img2={BANNER2}
        img3={BANNER3}
        headline="SEPEDA LISTRIK UNTUK BISNIS ANDA"
        subtext="Armada kendaraan listrik yang handal untuk kurir dan operasional bisnis sehari-hari."
        ctaLabel="Lihat Solusi Bisnis"
        ctaHref="/bisnis"
      />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 6: PRODUCT ROW — SEPEDA LISTRIK TERBARU
      ═══════════════════════════════════════════════════════════════ */}
      <ProductRow
        title="SEPEDA LISTRIK TERBARU"
        viewAllHref="/catalog/sepeda-listrik"
        products={sepedaListrikTerbaru}
      />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 7: CARI VOXA ANDA — premium category discovery
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-950">
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          {/* Section header */}
          <div className="mb-12">
            <p className="text-[#37C5FF] text-xs font-bold tracking-[0.25em] uppercase mb-3">Temukan Model Anda</p>
            <h2
              className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-none"
              style={{ letterSpacing: '-0.02em' }}
            >
              Cari VOXA
              <span className="text-[#37C5FF]"> Anda</span>
            </h2>
            <p className="mt-4 text-gray-400 text-sm md:text-base max-w-xl">
              Empat lini produk dirancang untuk setiap gaya hidup — dari mobilitas harian hingga solusi logistik profesional.
            </p>
          </div>

          {/* Premium 4-card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Liberty Series',
                sub: 'Urban Commuter',
                img: 'https://private-us-east-1.manuscdn.com/sessionFile/ITdJsUB3tuXJT4kPnDvUkw/sandbox/M9ZFiXNPv05N1UfZuoMDRb-img-1_1779343126000_na1fn_Y2FyaS12b3hhLWxpYmVydHk.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSVRkSnNVQjN0dVhKVDRrUG5EdlVrdy9zYW5kYm94L005WkZpWE5QdjA1TjFVZlp1b01EUmItaW1nLTFfMTc3OTM0MzEyNjAwMF9uYTFmbl9ZMkZ5YVMxMmIzaGhMV3hwWW1WeWRIay5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Vaznqgp5S2eMX6BgKYEHR41NZNXDjEmnnvdTAM9gNfmpLtln-hbMI0EqFHm5aaO1B2Ev7bMlaEd09cFO38XC6E5BdUG8WxUyfEkMO6N5tV3QI4washd-e-j1clkrrFC1IRWG8JkNnJ3gKUkvfWnKDYzmR~zht2PCEHHV4Ltwa7E0Xbaz3SH8Yzsb09RAlEQ6ZE2KQPSK4w3lWCnvd5jfqWXyjsLwBPXyRZxdszeCAw-1DsszeHvr99s7EbGRANxlu1BQZDkGD7VrT~bD8NyItSNgtp2roRWE6MOQToRycQRQ7BDxq1YC~cY8Mvk66ANK6PXBCacNieS2VEX28Jx6Hw__',
                href: '/catalog/sepeda-listrik',
                desc: 'Praktis, modern, dan hemat energi untuk perjalanan harian.',
              },
              {
                label: 'Eiffel Series',
                sub: 'Elegant Mobility',
                img: 'https://private-us-east-1.manuscdn.com/sessionFile/ITdJsUB3tuXJT4kPnDvUkw/sandbox/M9ZFiXNPv05N1UfZuoMDRb-img-2_1779343144000_na1fn_Y2FyaS12b3hhLWVpZmZlbA.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSVRkSnNVQjN0dVhKVDRrUG5EdlVrdy9zYW5kYm94L005WkZpWE5QdjA1TjFVZlp1b01EUmItaW1nLTJfMTc3OTM0MzE0NDAwMF9uYTFmbl9ZMkZ5YVMxMmIzaGhMV1ZwWm1abGJBLmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=CVO5G2-1GX0fQDf70oAyZSC7mGyoApjMcUoS4k1U68YC4Yn1NPovDPfNtd89qzYG3ZDZjJ7hwH4IqzGZO9kzcyhWajOb7nr3eNtja7ejNoajf4Bha9Rf5FZuH2LWm6bHmKbIXxXCbkFg-Nc4NaEGWJAFGzfygn3nJ8KlzzmwQ-0Rn0h~bt-jmSdX3x3Eifn6td~lPgyhwdwrroVTSekW2Kt7exSj18hq8HunCv7AtbH7dn10mRzVejCkZuaXjRn0LXJ6ENhLL~uP0CJtilLcDuTu43IE8tYoLWUsrmfi3XRXCr~Nabze0ASrW6QFbgOKMEz9dx0PtfgthoF25M2oHA__',
                href: '/catalog/sepeda-listrik',
                desc: 'Desain elegan dengan performa tinggi untuk gaya hidup urban.',
              },
              {
                label: 'Elite Series',
                sub: 'Flagship Performance',
                img: 'https://private-us-east-1.manuscdn.com/sessionFile/ITdJsUB3tuXJT4kPnDvUkw/sandbox/M9ZFiXNPv05N1UfZuoMDRb-img-3_1779343143000_na1fn_Y2FyaS12b3hhLWVsaXRl.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSVRkSnNVQjN0dVhKVDRrUG5EdlVrdy9zYW5kYm94L005WkZpWE5QdjA1TjFVZlp1b01EUmItaW1nLTNfMTc3OTM0MzE0MzAwMF9uYTFmbl9ZMkZ5YVMxMmIzaGhMV1ZzYVhSbC5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=rK2tfqPvhb4Pxcyt~CxECFKlURjNdqNwI00Zk98z~2kSXjoWWu2-4J4VH~02R5WH8an8t-twpnKjAchhPAYyw0OtKj1SxdMggQD6l7mr1yeU3nim8akWWB3GRP06cQEULY0YTL9LJ8N~76FR54dncHfWsc2ftXwJF2Kt1cxflB2vxAslyfNfEtlFoJ~B0biu8x8uDgFWdGBPkpwD0TNTqjPkeTKDXiOQDu1sTNY~60ZAXM73dheqFPoD7vNkUKyoQE9fzDb2YxA3N4JBmoVS4xKngU3atiBZdozrSGqR45ZscHJI9qE5SeFCGq2hlAex7nYXSwOggWSvbQIKGFwgVw__',
                href: '/catalog/sepeda-listrik',
                desc: 'Lini flagship VOXA — performa tertinggi dengan teknologi terdepan.',
              },
              {
                label: 'VOXA G3',
                sub: 'Logistics & Fleet',
                img: 'https://private-us-east-1.manuscdn.com/sessionFile/ITdJsUB3tuXJT4kPnDvUkw/sandbox/M9ZFiXNPv05N1UfZuoMDRb-img-4_1779343128000_na1fn_Y2FyaS12b3hhLWcz.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSVRkSnNVQjN0dVhKVDRrUG5EdlVrdy9zYW5kYm94L005WkZpWE5QdjA1TjFVZlp1b01EUmItaW1nLTRfMTc3OTM0MzEyODAwMF9uYTFmbl9ZMkZ5YVMxMmIzaGhMV2N6LmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=qxuASC0h2HY7iy0r7MZjqRPZc4n1hd1WoYItqQ2p-ZkYpHLNRy~vTd3SG06aEkN~vQP9PkSOs7pPGk32BMiuetnXKRvQLFdQ0BV4s37Tfq9Sn60M4cRUY6awfzphT6mq3BnTVl08MLBOxEYRJXtx1Xl2vzQckmQgvpoheOqnfVFllm~Uax-sYTMeigOk2LqfwpoVT5rSSMuWNbcvJMd29KeMKcQbbNofuez22N8hdZHiprTTu1TYXG820owvDxMGsThSEQzTI98~VGN8tmjUdHHvR-JyVDmwoSpWOd2EDdg~cQPBy8haWsb8x28uQTWOGHwl4jjXV1q64ljMMztKFg__',
                href: '/bisnis',
                desc: 'Solusi armada kendaraan listrik untuk bisnis dan logistik.',
              },
            ].map(item => (
              <Link key={item.label} href={item.href}>
                <div
                  className="group relative overflow-hidden bg-gray-900"
                  style={{ borderRadius: '2px', aspectRatio: '3/4' }}
                >
                  {/* Background image */}
                  <img
                    src={item.img}
                    alt={item.label}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 transition-opacity duration-300 group-hover:from-black/90" />
                  {/* Cyan glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ boxShadow: 'inset 0 0 60px rgba(55,197,255,0.12)' }}
                  />
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                    <p className="text-[#37C5FF] text-[10px] font-bold tracking-[0.2em] uppercase mb-1.5 opacity-90">{item.sub}</p>
                    <h3 className="font-display text-white text-lg md:text-xl tracking-wide leading-tight mb-2">{item.label}</h3>
                    <p className="text-gray-400 text-xs leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.desc}</p>
                    <div className="flex items-center gap-2 text-[#37C5FF] text-xs font-semibold tracking-wider">
                      <span>Jelajahi</span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </div>
                  </div>
                  {/* Top-right cyan accent line */}
                  <div
                    className="absolute top-0 right-0 w-px h-0 group-hover:h-full transition-all duration-500 bg-[#37C5FF]/40"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════════
          SECTION 9: KOMUNITAS VOXA — horizontal scrollable photo strip
      ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-2xl md:text-3xl text-gray-900 tracking-wide">KOMUNITAS VOXA</h2>
          </div>
          {/* Horizontal scrollable strip */}
          <div
            className="flex gap-3 overflow-x-auto pb-4"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#00B4D8 #e5e7eb' }}
          >
            {COMMUNITY_PHOTOS.map((src, i) => (
              <div
                key={i}
                className="flex-none overflow-hidden bg-gray-100"
                style={{ width: '260px', height: '320px', borderRadius: '4px' }}
              >
                <img
                  src={src}
                  alt={`VOXA Customer ${i + 1}`}
                  className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
