import { Link } from 'wouter';
import { ChevronRight, MapPin, Phone, Navigation } from 'lucide-react';

const showrooms = [
  {
    name: 'VOXA PANDEGLANG',
    address: 'Jl. Raya Labuan – Pandeglang No.KM.5, Palurahan, Kec. Kaduhejo, Kabupaten Pandeglang, Banten 42253',
    phone: '081119735865',
    waLink: 'https://wa.me/6281119735865',
    mapsLink: 'https://www.google.com/search?q=voxa+Pandeglang',
    img: '/manus-storage/PANDEGLANG_0c874cf4.png',
  },
  {
    name: 'VOXA CIPONDOH',
    address: 'Jl. KH. Ahmad Dahlan No.8M, RT.004/RW.006, Duri Kosambi, Kecamatan Cengkareng, Kota Jakarta Barat, Banten 15147',
    phone: '08156161071',
    waLink: 'https://wa.me/6208156161071',
    mapsLink: 'https://www.google.com/search?q=voxa+cipondoh',
    img: '/manus-storage/CIPONDOH_4526b1ce.webp',
  },
  {
    name: 'VOXA JATIBENING',
    address: 'Jl Raya Jatibening No. 100, RT 07, RW 03, Kel.Jatibening, Kec. Pondok Gede, Bekasi, Jawa Barat 17412',
    phone: '081119279327',
    waLink: 'https://wa.me/6281119279327',
    mapsLink: 'https://www.google.com/search?q=voxa+jatibening',
    img: '/manus-storage/JATIBENING_27db8262.webp',
  },
  {
    name: 'VOXA PARUNG SERAB',
    address: 'Jl. Raden Patah, RT.003/RW.010, Parung Serab, Kec. Ciledug, Kota Tangerang, Banten 15153',
    phone: '081119279325',
    waLink: 'https://wa.me/6281119279325',
    mapsLink: 'https://www.google.com/search?q=VOXA+Ciledug',
    img: '/manus-storage/VOXAPARUNGSERAB_c28a409c.webp',
  },
  {
    name: 'VOXA MERUYA',
    address: 'Srengseng, Kec. Kembangan, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta 11620',
    phone: '081119279326',
    waLink: 'https://wa.me/6281119279326',
    mapsLink: 'https://www.google.com/search?q=voxa+meruya',
    img: '/manus-storage/MERUYA_035cd224.jpg',
  },
];

export default function Showroom() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#00B4D8]">Beranda</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">Showroom</span>
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gray-950 text-white py-10">
        <div className="container">
          <p className="text-[#00B4D8] text-sm font-bold tracking-widest mb-3">TEMUKAN KAMI</p>
          <h1 className="font-display text-5xl tracking-wide mb-4">SHOWROOM VOXA</h1>
          <p className="text-gray-400 text-lg max-w-xl">Kunjungi showroom terdekat untuk test ride dan konsultasi langsung dengan tim ahli kami.</p>
        </div>
      </div>

      {/* Showroom Cards */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {showrooms.map(s => (
            <div key={s.name} className="rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 group">
              {/* Image */}
              <div className="aspect-video overflow-hidden bg-gray-100">
                <img
                  src={s.img}
                  alt={s.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Info */}
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-lg mb-3">{s.name}</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-gray-500">
                    <MapPin size={14} className="text-[#00B4D8] shrink-0 mt-0.5" />
                    <span>{s.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone size={14} className="text-[#00B4D8] shrink-0" />
                    <a
                      href={s.waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#00B4D8]"
                    >
                      {s.phone}
                    </a>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex items-center gap-4">
                  <a
                    href={s.mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#00B4D8] text-sm font-bold hover:gap-3 transition-all"
                  >
                    <Navigation size={14} />
                    Lihat di Maps
                  </a>
                  <a
                    href={s.waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-green-600 text-sm font-bold hover:text-green-700 transition-colors"
                  >
                    <Phone size={14} />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
