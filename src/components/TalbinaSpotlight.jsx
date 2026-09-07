import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  HeartPulse, 
  Sparkles, 
  Check, 
  ShoppingBag, 
  ArrowRight, 
  Star, 
  Flame, 
  Timer, 
  ShieldCheck, 
  Zap,
  Info
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function TalbinaSpotlight() {
  const navigate = useNavigate();
  const { products, addToCart } = useStore();

  const talbinaProducts = products.filter(p => p.category === 'health' && p.id.startsWith('talbina-'));
  const [activeTab, setActiveTab] = useState(0);
  const [qty, setQty] = useState(1);

  const FLAVOR_NAMES = {
    'talbina-vanilla': 'Elaichi Dry Fruits',
    'talbina-milk-mawa': 'Royal Milk Mawa',
    'talbina-chocolate': 'Kids Chocolate (1+ Yrs)',
    'talbina-baby-barley': 'Baby Barley Cereal (3+ Yrs)',
    'talbina-dry-dates': 'Dry Dates (Khajoor)'
  };

  const activeProduct = talbinaProducts[activeTab] || talbinaProducts[0];

  // Preload all 5 flavor images for instantaneous switching
  React.useEffect(() => {
    talbinaProducts.forEach(p => {
      if (p.image) {
        const img = new Image();
        img.src = p.image;
      }
    });
  }, [talbinaProducts]);

  if (!activeProduct) return null;

  const handleBuyNow = () => {
    addToCart(activeProduct, qty);
    navigate('/checkout');
  };

  return (
    <section id="talbina-spotlight" className="py-12 sm:py-16 bg-[#f7f4ed] border-b border-amber-900/10 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <HeartPulse className="w-3.5 h-3.5 text-emerald-600" />
            <span>Our Flagship Sunnah Food</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#032219]">
            Arabian's Talbeena Nutritional Breakfast
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Crafted according to authentic prophetic guidance with stone-ground barley, California almonds, pistachios, and rich natural flavors. Gentle on the stomach, soothing to the heart.
          </p>
        </div>

        {/* Flavour Navigation Tabs - Responsive with zero cutoff */}
        <div 
          className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto px-2 pb-4 no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {talbinaProducts.map((p, index) => {
            const shortName = FLAVOR_NAMES[p.id] || p.name.replace("Arabian's Talbeena ", "").replace("Nutritional Breakfast ", "");
            return (
              <button
                key={p.id}
                onClick={() => { setActiveTab(index); setQty(1); }}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 shrink-0 border ${
                  activeTab === index
                    ? 'bg-[#032219] text-amber-300 border-amber-500 shadow-md scale-102'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400/60'
                }`}
              >
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  activeTab === index ? 'bg-amber-400' : 'bg-slate-300'
                }`}></span>
                <span>{shortName}</span>
              </button>
            );
          })}
        </div>

        {/* Main Interactive Product Card */}
        <div className="mt-4 bg-white rounded-3xl p-6 sm:p-10 border border-amber-500/20 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Official Studio Box Image */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative bg-gradient-to-b from-[#faf8f5] to-[#f4eee1] rounded-3xl p-4 sm:p-6 border border-amber-900/10 shadow-sm">
            <div className="w-full flex items-center justify-between mb-3 px-1">
              <span className="bg-emerald-800 text-white text-[10px] sm:text-[11px] font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{activeProduct.badge || "100% Pure Sunnah Food"}</span>
              </span>
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] sm:text-[11px] font-black px-3 py-1 rounded-full">
                {activeProduct.netWeight || "250 Gram"}
              </span>
            </div>

            <Link
              to={`/product/${activeProduct.id}`}
              className="w-full max-w-[330px] aspect-square rounded-2xl overflow-hidden border border-amber-900/15 shadow-md relative block cursor-pointer group bg-[#f5f1e8]"
            >
              <img 
                key={activeProduct.id}
                src={activeProduct.image} 
                alt={activeProduct.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </Link>

            <Link
              to={`/product/${activeProduct.id}`}
              className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-600/25 text-[#032219] text-[11px] sm:text-xs font-bold transition group/pill"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Authentic Sunnah Recipe • Tap for details</span>
              <ArrowRight className="w-3 h-3 text-amber-800 group-hover/pill:translate-x-0.5 transition-transform shrink-0" />
            </Link>
          </div>

          {/* Right Column: Benefits, Nutritional Specs & Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-700">{activeProduct.rating} / 5.0</span>
                <span className="text-xs text-slate-400">({activeProduct.reviewsCount} verified reviews)</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">
                {activeProduct.name}
              </h3>
              
              <div className="flex items-baseline gap-3 mt-2">
                <span className="text-3xl font-extrabold text-[#064e3b]">
                  ₹{activeProduct.price}
                </span>
                <span className="text-base text-slate-400 line-through">
                  ₹{activeProduct.mrp}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  Save ₹{activeProduct.mrp - activeProduct.price} ({Math.round(((activeProduct.mrp - activeProduct.price) / (activeProduct.mrp || 1)) * 100)}% Off)
                </span>
              </div>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">
              {activeProduct.description}
            </p>

            {/* Core Benefits */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>Why Arabian's Talbina is Essential For You:</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeProduct.benefits && activeProduct.benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-2 bg-[#fdfcf9] p-2.5 rounded-xl border border-amber-900/10 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation in 3 Steps */}
            <div className="bg-[#f2efe9] rounded-xl p-3 border border-amber-900/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-amber-700 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Ready in 5 Mins</div>
                  <div className="text-[11px] text-slate-600">1. Boil Milk/Water ➔ 2. Add 2-3 tbsp ➔ 3. Simmer & Enjoy</div>
                </div>
              </div>
              <div className="bg-emerald-900 text-white font-semibold text-[10px] px-3 py-1 rounded-full whitespace-nowrap">
                Zero Added Preservatives
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              {/* Quantity */}
              <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 p-1 w-full sm:w-auto justify-center">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-800 font-bold hover:bg-slate-100"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-slate-900 text-sm">{qty}</span>
                <button 
                  onClick={() => setQty(qty + 1)}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-800 font-bold hover:bg-slate-100"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={() => addToCart(activeProduct, qty)}
                className="w-full sm:flex-1 py-3.5 rounded-xl bg-[#032219] text-amber-300 font-bold text-xs sm:text-sm hover:bg-[#063e2e] shadow-md transition flex items-center justify-center gap-2 active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart (₹{activeProduct.price * qty})</span>
              </button>

              {/* Buy Now Direct */}
              <button
                onClick={handleBuyNow}
                className="w-full sm:flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs sm:text-sm hover:from-amber-400 hover:to-amber-500 shadow-gold transition flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>Instant Order Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
