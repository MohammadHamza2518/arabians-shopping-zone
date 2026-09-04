import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Compass, ShieldCheck } from 'lucide-react';

const VAULT_DOORS = [
  {
    id: 'vault-barakah',
    doorNumber: '۞ I',
    arabicTitle: 'بَابُ البَرَكَة',
    englishTitle: 'Bab-ul-Barakah',
    budgetLabel: 'UNDER ₹499',
    priceHint: 'Starting ₹349',
    categorySnippet: 'Pure Attars • Velvet Caps • Miswak',
    link: '/shop?maxPrice=499',
    image: '/assets/studio/dehnul_oud_pure.jpg',
    glowColor: 'from-amber-500/20',
    borderColor: 'group-hover:border-amber-400'
  },
  {
    id: 'vault-shifa',
    doorNumber: '۞ II',
    arabicTitle: 'بَابُ الشِّفَاء',
    englishTitle: 'Bab-ush-Shifa',
    budgetLabel: 'UNDER ₹999',
    priceHint: 'Starting ₹549',
    categorySnippet: 'Sprouted Talbina • Sidr Honey',
    link: '/shop?maxPrice=999',
    image: '/assets/studio/honey_mix_dryfruits.jpg',
    glowColor: 'from-emerald-500/20',
    borderColor: 'group-hover:border-emerald-400'
  },
  {
    id: 'vault-mulk',
    doorNumber: '۞ III',
    arabicTitle: 'بَابُ المُلْك',
    englishTitle: 'Bab-ul-Mulk',
    budgetLabel: 'ROYAL ₹1,499+',
    priceHint: 'From ₹1,499',
    categorySnippet: 'Saudi Thobes • Bisht • Amama',
    link: '/shop?minPrice=1499',
    image: '/assets/studio/mens_white_thobe.jpg',
    glowColor: 'from-amber-400/25',
    borderColor: 'group-hover:border-amber-300'
  },
  {
    id: 'vault-hadiya',
    doorNumber: '۞ IV',
    arabicTitle: 'بَابُ الهَدِيَّة',
    englishTitle: 'Bab-ul-Hadiya',
    budgetLabel: 'GIFT TRUNKS',
    priceHint: 'Save 15% Combo',
    categorySnippet: 'Velvet Nikah Trunks • Keepsakes',
    link: '/hamper',
    image: '/assets/studio/nikah_nama_booklet.jpg',
    glowColor: 'from-rose-500/20',
    borderColor: 'group-hover:border-rose-400'
  }
];

export default function ShopByBudget() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header with Arabic Arch Motif */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/15 via-amber-400/25 to-amber-500/15 border border-amber-500/40 text-amber-950 text-xs font-bold shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span className="tracking-wide">THE 4 SACRED GATES</span>
        </div>
        
        <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#032219] tracking-tight">
          Shop by The Royal Sunnah Vaults
        </h2>
        
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Step through our four curated palace doorways to discover authentic Sunnah essentials calibrated for every blessing and budget.
        </p>
      </div>

      {/* 4 Arched Mihrab Vault Doors Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
        {VAULT_DOORS.map((door) => (
          <Link
            key={door.id}
            to={door.link}
            className={`group relative rounded-t-[60px] sm:rounded-t-[80px] rounded-b-3xl bg-gradient-to-b from-[#083023] via-[#041e16] to-[#02110c] text-white p-3.5 sm:p-5 border-2 border-amber-500/30 ${door.borderColor} shadow-xl hover:shadow-[0_15px_40px_rgba(3,34,25,0.45)] hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between overflow-hidden`}
          >
            {/* Ambient Radial Spotlight Beam at top arch */}
            <div className={`absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 bg-gradient-to-b ${door.glowColor} to-transparent rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-700`}></div>

            {/* Subtle Islamic Arabesque Pattern watermark */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:12px_12px]"></div>

            {/* Arch Top Crown / Door Seal */}
            <div className="relative z-10 text-center pt-1 pb-2">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-amber-400/30 font-mono text-[10px] text-amber-300 font-bold tracking-widest shadow-inner">
                {door.doorNumber}
              </span>
              <div className="font-serif text-xs sm:text-sm text-amber-200/90 font-bold mt-1 tracking-wide">
                {door.arabicTitle}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-emerald-200/60 font-semibold">
                {door.englishTitle}
              </div>
            </div>

            {/* Floating Product Asset inside Arched Window Frame */}
            <div className="relative z-10 my-2 aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-sm border border-amber-500/20 p-2 sm:p-3 flex items-center justify-center group-hover:border-amber-400/50 transition-colors">
              <img
                src={door.image}
                alt={door.englishTitle}
                className="h-full w-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              
              {/* Floating Mini Price Hint Pill */}
              <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-amber-500/30 text-[9px] font-mono font-bold text-amber-300 shadow">
                {door.priceHint}
              </div>
            </div>

            {/* Lower Plaque with Budget Headline & Snippet */}
            <div className="relative z-10 space-y-1.5 pt-2 text-center">
              <div className="font-serif font-black text-base sm:text-xl text-amber-300 tracking-tight leading-tight group-hover:text-amber-200 transition">
                {door.budgetLabel}
              </div>
              
              <p className="text-[10px] sm:text-[11px] text-emerald-100/75 leading-tight line-clamp-1">
                {door.categorySnippet}
              </p>

              {/* Enter Vault Button */}
              <div className="pt-2">
                <div className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 group-hover:from-amber-500 group-hover:to-amber-600 border border-amber-400/40 text-amber-300 group-hover:text-slate-950 text-[11px] sm:text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm">
                  <span>Enter Vault</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

          </Link>
        ))}
      </div>
    </section>
  );
}
