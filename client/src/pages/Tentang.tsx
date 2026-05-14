import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { ChevronRight, ChevronDown, ArrowRight, Zap, Leaf, Factory, Star, TrendingUp, Shield, Globe, Cpu } from 'lucide-react';

// ─── CDN images ───────────────────────────────────────────────────────────────
const IMG_BANNER = '/manus-storage/banner_8f991ec1.png';   // Assembly & Warehouse collage
const IMG_FACTORY = '/manus-storage/P1014908_5a27f79b.webp'; // wide factory floor

// ─── Scroll-reveal hook ───────────────────────────────────────────────────────
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATS = [
  { value: '2022', label: 'Tahun Berdiri' },
  { value: '13+',  label: 'Model Sepeda Listrik' },
  { value: '5',    label: 'Showroom Aktif' },
  { value: '100%', label: 'Produksi Lokal' },
];

const MISSIONS = [
  {
    letter: 'V', word: 'Value',       color: '#00B4D8',
    icon: <Star size={18} />,
    text: 'Memberikan produk dan layanan terbaik dengan kualitas yang mampu memenuhi kebutuhan masyarakat modern.',
  },
  {
    letter: 'O', word: 'Opportunity', color: '#22d3ee',
    icon: <TrendingUp size={18} />,
    text: 'Membuka peluang pertumbuhan bersama bagi pelanggan, distributor, dan seluruh mitra VOXA di Indonesia.',
  },
  {
    letter: 'X', word: 'eXcellence',  color: '#a3e635',
    icon: <Cpu size={18} />,
    text: 'Berkomitmen menghadirkan inovasi, performa, dan pelayanan terbaik dalam setiap produk yang kami kembangkan.',
  },
  {
    letter: 'A', word: 'Advancement', color: '#4ade80',
    icon: <Globe size={18} />,
    text: 'Terus berkembang melalui teknologi dan inovasi kendaraan listrik untuk mendukung masa depan yang lebih hijau dan berkelanjutan.',
  },
];

const WHY_ITEMS = [
  { icon: <Star size={20} />,    color: '#00B4D8', title: 'Desain Modern & Stylish',           desc: 'Produk VOXA dirancang untuk tampil percaya diri di jalanan Indonesia.' },
  { icon: <Leaf size={20} />,    color: '#4ade80', title: 'Ramah Lingkungan & Hemat Biaya',     desc: 'Zero emisi langsung — hemat biaya operasional dan baik untuk bumi.' },
  { icon: <Factory size={20} />, color: '#a3e635', title: 'Produksi Lokal Indonesia',           desc: 'Pabrik perakitan di Balaraja, Tangerang dengan standar kualitas tinggi.' },
  { icon: <Shield size={20} />,  color: '#22d3ee', title: 'Kualitas & After Sales Terpercaya',  desc: 'Garansi produk dan ketersediaan suku cadang untuk ketenangan pikiran.' },
  { icon: <Zap size={20} />,     color: '#f59e0b', title: 'Mendukung Ekosistem EV Nasional',    desc: 'Mendukung program kendaraan listrik nasional dan masa depan mobilitas.' },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Tentang() {
  const heroReveal    = useReveal(0.05);
  const storyReveal   = useReveal(0.1);
  const missionReveal = useReveal(0.08);
  const whyReveal     = useReveal(0.08);
  const ctaReveal     = useReveal(0.08);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#00B4D8] transition-colors">Beranda</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">Tentang VOXA</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          1. HERO — banner image as cinematic centerpiece
      ══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Banner image */}
        <div className="absolute inset-0">
          <img
            src={IMG_BANNER}
            alt="VOXA Assembly & Warehouse"
            className="w-full h-full object-cover object-center"
          />
          {/* Gradient overlay for readability */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.82) 100%)',
            }}
          />
        </div>

        {/* Subtle ambient glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] rounded-full opacity-10 blur-3xl"
            style={{ background: 'radial-gradient(ellipse, #00B4D8 0%, transparent 70%)' }}
          />
        </div>

        {/* Content */}
        <div
          ref={heroReveal.ref}
          className={`relative container text-center py-28 transition-all duration-1000 ease-out ${
            heroReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Brand pill */}
          <div
            className="inline-flex items-center gap-2 border border-[#00B4D8]/50 text-[#00B4D8] text-xs font-bold px-5 py-2 rounded-full mb-8 tracking-widest backdrop-blur-sm"
            style={{ background: 'rgba(0,180,216,0.08)' }}
          >
            <Zap size={11} /> PT. VOXA INDO NUSA
          </div>

          <h1
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6 tracking-wide"
            style={{ textShadow: '0 2px 40px rgba(0,0,0,0.6)' }}
          >
            Tentang PT.<br />
            <span
              style={{
                color: '#00B4D8',
                textShadow: '0 0 50px rgba(0,180,216,0.7), 0 0 100px rgba(0,180,216,0.3)',
              }}
            >
              Voxa Indo Nusa
            </span>
          </h1>

          <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Mobilitas modern, efisien, dan ramah lingkungan untuk masa depan Indonesia.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/40 animate-bounce">
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <ChevronDown size={18} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          2. COMPANY STORY — editorial split
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-24">
        <div
          ref={storyReveal.ref}
          className={`container transition-all duration-900 ${
            storyReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            {/* Left: label + factory image */}
            <div className="lg:w-5/12 shrink-0">
              <p className="text-xs font-bold tracking-widest uppercase mb-5" style={{ color: '#00B4D8' }}>
                Tentang Kami
              </p>
              <div className="relative overflow-hidden rounded-3xl shadow-xl">
                <img
                  src={IMG_FACTORY}
                  alt="Pabrik VOXA Balaraja"
                  className="w-full object-cover object-center hover:scale-105 transition-transform duration-700"
                  style={{ maxHeight: '420px' }}
                />
                {/* Location badge */}
                <div
                  className="absolute bottom-5 left-5 rounded-2xl px-4 py-3 border"
                  style={{
                    background: 'rgba(0,0,0,0.65)',
                    borderColor: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <p className="text-xs text-gray-400 mb-0.5">Berlokasi di</p>
                  <p className="text-white font-bold text-sm">Balaraja, Tangerang</p>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                {STATS.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl px-5 py-4 border border-gray-100 bg-gray-50 text-center hover:border-[#00B4D8]/30 hover:bg-[#00B4D8]/5 transition-colors duration-300"
                  >
                    <p
                      className="font-display text-2xl font-bold mb-1"
                      style={{ color: '#00B4D8' }}
                    >
                      {s.value}
                    </p>
                    <p className="text-gray-500 text-xs tracking-wide">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: editorial copy */}
            <div className="lg:w-7/12">
              <h2 className="font-display text-3xl md:text-4xl text-gray-900 tracking-wide leading-tight mb-8">
                Kendaraan Listrik<br />
                <span style={{ color: '#00B4D8' }}>Buatan Indonesia</span>
              </h2>

              <div className="space-y-5 text-gray-600 text-base leading-relaxed">
                <p>
                  PT. Voxa Indo Nusa merupakan perusahaan kendaraan listrik Indonesia yang berfokus menghadirkan solusi mobilitas modern, efisien, dan ramah lingkungan untuk masyarakat.
                </p>
                <p>
                  Didirikan pada tahun 2022, VOXA hadir dengan komitmen untuk mendukung perkembangan industri kendaraan listrik di Indonesia melalui produk berkualitas, desain modern, serta teknologi yang terus berkembang.
                </p>
                <p>
                  Berlokasi di Kawasan Industri Benua Permai Lestari, Balaraja – Tangerang, VOXA memiliki fasilitas perakitan dan produksi sendiri untuk memastikan kualitas produk, ketersediaan unit, dan pelayanan terbaik bagi pelanggan serta mitra di seluruh Indonesia.
                </p>
                <p>
                  Hingga saat ini, VOXA telah menghadirkan berbagai model sepeda listrik yang dirancang untuk kebutuhan harian, bisnis, maupun gaya hidup modern, seperti Liberty, Liberty City, Liberty 07, Liberty Xtreme, Eiffel Rider, Eiffel Stylish, dan Eiffel Fantasy.
                </p>
                <p className="font-medium text-gray-800 border-l-4 border-[#00B4D8] pl-5 py-1">
                  Kami percaya kendaraan listrik bukan hanya tentang teknologi, tetapi juga tentang menciptakan masa depan yang lebih hemat energi, lebih efisien, dan lebih baik untuk lingkungan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          3. VISI & MISI — glassmorphism cards on dark bg
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-gray-950 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] opacity-8 blur-3xl"
            style={{ background: 'radial-gradient(ellipse, #00B4D8 0%, transparent 70%)' }}
          />
        </div>

        <div
          ref={missionReveal.ref}
          className={`container relative transition-all duration-700 ${
            missionReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest mb-3 uppercase" style={{ color: '#00B4D8' }}>
              Visi & Misi
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-white tracking-wide mb-10">
              Visi & Misi VOXA
            </h2>

            {/* Vision card */}
            <div
              className="max-w-3xl mx-auto rounded-2xl px-8 py-7 border mb-14"
              style={{
                background: 'rgba(0,180,216,0.06)',
                borderColor: 'rgba(0,180,216,0.25)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 0 40px rgba(0,180,216,0.08)',
              }}
            >
              <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#00B4D8' }}>
                Visi
              </p>
              <p className="text-gray-200 text-base md:text-lg leading-relaxed">
                Menjadi brand kendaraan listrik terpercaya di Indonesia yang menghadirkan mobilitas modern, ramah lingkungan, dan dapat diakses oleh semua kalangan.
              </p>
            </div>

            <p className="text-xs font-bold tracking-widest uppercase mb-8" style={{ color: '#a3e635' }}>
              Misi
            </p>
          </div>

          {/* Mission cards — VOXA acronym */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {MISSIONS.map((m, i) => (
              <div
                key={m.word}
                className="group relative rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-2 cursor-default"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  borderColor: 'rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(12px)',
                  transitionDelay: `${i * 80}ms`,
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.boxShadow = `0 0 40px ${m.color}33`;
                  el.style.borderColor = m.color + '44';
                  el.style.background = m.color + '0a';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.boxShadow = '';
                  el.style.borderColor = 'rgba(255,255,255,0.07)';
                  el.style.background = 'rgba(255,255,255,0.03)';
                }}
              >
                {/* Big letter watermark */}
                <div
                  className="font-display text-7xl font-bold leading-none mb-4 opacity-15 group-hover:opacity-25 transition-opacity duration-300 select-none"
                  style={{ color: m.color }}
                >
                  {m.letter}
                </div>
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: m.color + '18', color: m.color }}
                >
                  {m.icon}
                </div>
                <h3 className="font-bold text-white mb-3 text-base">{m.word}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          4. MENGAPA VOXA — clean trust grid
      ══════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div
          ref={whyReveal.ref}
          className={`container relative transition-all duration-700 ${
            whyReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest mb-3 uppercase" style={{ color: '#00B4D8' }}>
              Keunggulan
            </p>
            <h2 className="font-display text-3xl md:text-5xl text-gray-900 tracking-wide">
              Mengapa VOXA?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_ITEMS.map((item, i) => (
              <div
                key={item.title}
                className="group flex gap-5 rounded-2xl p-6 border border-gray-100 bg-gray-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ transitionDelay: `${i * 60}ms` }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = item.color + '40';
                  el.style.background = item.color + '08';
                  el.style.boxShadow = `0 8px 30px ${item.color}18`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = '';
                  el.style.background = '';
                  el.style.boxShadow = '';
                }}
              >
                <div
                  className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ background: item.color + '18', color: item.color }}
                >
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2 text-sm">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          5. CINEMATIC CLOSING — dark, emotional, minimal
      ══════════════════════════════════════════════════════════ */}
      <section className="relative py-40 overflow-hidden bg-gray-950">
        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] opacity-12 blur-3xl"
            style={{ background: 'radial-gradient(ellipse, #00B4D8 0%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-10 blur-3xl animate-pulse"
            style={{ background: 'radial-gradient(ellipse, #a3e635 0%, transparent 70%)' }}
          />
        </div>

        {/* Subtle grid lines */}
        <div
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />

        <div
          ref={ctaReveal.ref}
          className={`relative container text-center transition-all duration-1000 ${
            ctaReveal.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div
            className="inline-flex items-center gap-2 border border-[#a3e635]/40 text-[#a3e635] text-xs font-bold px-5 py-2 rounded-full mb-8 tracking-widest"
            style={{ background: 'rgba(163,230,53,0.06)' }}
          >
            <Leaf size={11} /> Mobilitas Berkelanjutan
          </div>

          <p className="text-gray-300 text-base md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
            VOXA hadir untuk menjadi bagian dari perubahan menuju masa depan mobilitas Indonesia yang lebih modern dan berkelanjutan.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/catalog/sepeda-listrik"
              className="inline-flex items-center gap-2 font-bold px-8 py-4 rounded-full text-sm transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #00B4D8, #22d3ee)',
                color: '#fff',
                boxShadow: '0 0 30px rgba(0,180,216,0.4)',
              }}
            >
              Jelajahi Produk VOXA <ArrowRight size={16} />
            </Link>
            <Link
              href="/showroom"
              className="inline-flex items-center gap-2 border border-white/20 text-white font-semibold px-8 py-4 rounded-full text-sm hover:border-white/50 hover:bg-white/5 transition-all"
            >
              Kunjungi Showroom
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
