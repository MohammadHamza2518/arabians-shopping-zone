import React, { useState } from 'react';
import { Sparkles, Check, ShoppingBag, PhoneCall, ShieldCheck, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const JUMMAH_BUNDLE_ITEMS = [
  {
    id: 'thobe-saudi-classic-white',
    name: 'Luxury Saudi Cut Pure White Arabian Thobe',
    category: 'wearing',
    price: 1699,
    mrp: 2299,
    image: '/assets/studio/mens_white_thobe.jpg',
    detail: 'Standing stiff collar, straight Saudi fall'
  },
  {
    id: 'islamic-cap-collection',
    name: 'Handcrafted Turkish Velvet & Omani Cap',
    category: 'wearing',
    price: 449,
    mrp: 699,
    image: '/assets/thobes/thobes_al_noor_2_p8_1.png',
    detail: 'Pure velvet with delicate hand embroidery'
  },
  {
    id: 'dehnul-oud-pure',
    name: 'Aged Cambodian Dehnul Oud (Alcohol-Free)',
    category: 'fragrance',
    price: 649,
    mrp: 999,
    image: '/assets/studio/dehnul_oud_pure.jpg',
    detail: '24-48 hours longevity, pure distilled misce'
  }
];

export default function SunnahJummahBundle() {
  const { addToCart, showToast, settings } = useStore();
  const [isAdded, setIsAdded] = useState(false);

  const jummahBundle = settings?.jummahBundle || {};

  // If disabled from Admin panel
  if (jummahBundle.enabled === false) {
    return null;
  }

  const bundleTotal = Number(jummahBundle.originalPrice) || JUMMAH_BUNDLE_ITEMS.reduce((sum, i) => sum + i.price, 0); // 2797
  const comboPrice = Number(jummahBundle.comboPrice) || 2299;
  const savings = Math.max(0, bundleTotal - comboPrice); // 498
  const badge = jummahBundle.badge || 'Jummah Sunnah Mubarak Set • 1-Click Combo';
  const title = jummahBundle.title || 'The Complete Sunnah Jummah Wardrobe Kit';
  const subtitle = jummahBundle.subtitle || 'Revive the pristine Sunnah of Friday prayers in one complete set: a pristine tailored Saudi thobe, handcrafted Turkish velvet cap, and aged alcohol-free Cambodian oud.';

  const handleAddBundleToCart = () => {
    JUMMAH_BUNDLE_ITEMS.forEach((item) => {
      addToCart(item, 1);
    });
    setIsAdded(true);
    showToast(`Complete 3-Piece Sunnah Jummah Kit added to cart! Saved ₹${savings}!`, 'success');
    setTimeout(() => setIsAdded(false), 3000);
  };

  const getWhatsAppBundleUrl = () => {
    const text = encodeURIComponent(
      `Assalam Alaikum! 🌙\n\nI want to order the *Complete Sunnah Jummah Mubarak Kit (3-Piece Combo)*:\n` +
      `1. Luxury Saudi Cut Pure White Thobe\n` +
      `2. Handcrafted Turkish Velvet Cap\n` +
      `3. Aged Cambodian Dehnul Oud\n\n` +
      `Special Combo Price: ₹${comboPrice} (Saved ₹${savings})\n\n` +
      `Please confirm available sizes and guide me on delivery. JazakAllah Khair!`
    );
    return `https://wa.me/${settings.whatsapp}?text=${text}`;
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#021812] via-[#053225] to-[#021812] text-white p-6 sm:p-10 border-2 border-amber-500/40 shadow-2xl">
        
        {/* Subtle Islamic ambient radial illumination */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Details & Pricing */}
          <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{badge}</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl font-black leading-tight text-white">
              {title}
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed max-w-lg mx-auto lg:mx-0">
              {subtitle}
            </p>

            {/* Price block */}
            <div className="flex flex-wrap items-baseline justify-center lg:justify-start gap-3 pt-2">
              <span className="font-serif font-black text-3xl sm:text-4xl text-amber-300">
                ₹{comboPrice}
              </span>
              <span className="text-base text-slate-400 line-through">
                ₹{bundleTotal}
              </span>
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow">
                SAVE ₹{savings} OFF
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-3">
              <button
                type="button"
                onClick={handleAddBundleToCart}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs sm:text-sm hover:from-amber-400 hover:to-amber-500 transition shadow-gold flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                {isAdded ? <Check className="w-4 h-4 text-slate-950 stroke-[3]" /> : <ShoppingBag className="w-4 h-4 text-slate-950" />}
                <span>{isAdded ? 'ALL 3 ITEMS ADDED TO CART!' : 'Add Full Kit to Cart (₹2,299)'}</span>
              </button>

              <a
                href={getWhatsAppBundleUrl()}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow active:scale-95 whitespace-nowrap"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Order via WhatsApp</span>
              </a>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-4 pt-2 text-[11px] text-emerald-200/70">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Free Size Exchange
              </span>
              <span>•</span>
              <span>Pan-India Cash on Delivery</span>
            </div>
          </div>

          {/* Right Column: 3-Item Visual Cards */}
          <div className="lg:col-span-6 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-300 text-center lg:text-left mb-2">
              Everything Included in this Combo:
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              {JUMMAH_BUNDLE_ITEMS.map((item, idx) => (
                <div 
                  key={item.id}
                  className="bg-white/5 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-amber-500/20 hover:border-amber-500/40 transition flex flex-col justify-between"
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-white/10 p-2 mb-2 flex items-center justify-center">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-contain filter drop-shadow" 
                      loading="lazy"
                    />
                    <span className="absolute top-1 left-1 w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] flex items-center justify-center shadow">
                      {idx + 1}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-serif font-bold text-[11px] sm:text-xs text-white line-clamp-2 leading-tight">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-amber-300/80 font-mono font-bold">
                      ₹{item.price} <span className="line-through text-slate-400 text-[9px]">₹{item.mrp}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
