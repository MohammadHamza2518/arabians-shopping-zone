import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  Star, 
  ShoppingBag,
  Award,
  CheckCircle2
} from 'lucide-react';

const HERO_SLIDES = [
  {
    id: 'thobes',
    badge: '👑 Royal Wardrobe Collection',
    title: "Saudi & Emirati Royal Cut Thobes",
    subtitle: "Engineered with tailored standing collars, concealed snap plackets, and breathable luxury poly-blend fabric for Jummah prayers, Umrah, and auspicious gatherings.",
    highlight: "100% Free Size Replacement • Direct Studio Tailoring",
    price: "From ₹1,499",
    mrp: "₹2,299",
    ctaText: "Shop Men's Thobes",
    ctaLink: "/shop?category=wearing",
    image: "/assets/studio/mens_white_thobe.jpg"
  },
  {
    id: 'talbina',
    badge: '🥣 Prophetic Sunnah Superfood',
    title: "Arabian's Sprouted Barley Talbeena",
    subtitle: "Stone-ground roasted barley blended with premium California almonds, pistachios, and saffron. Rejuvenates the heart and vitalizes immunity according to authentic Hadith 5417.",
    highlight: "5 High-Repeat Flavors • Lab Certified • 100% Halal",
    price: "From ₹349",
    mrp: "₹449",
    ctaText: "Order Sunnah Talbina",
    ctaLink: "/product/talbina-vanilla",
    image: "/assets/talbina/talbina_vanilla_dryfruits.png"
  },
  {
    id: 'oud',
    badge: '✨ Pure Alcohol-Free Perfumery',
    title: "Aged Cambodian Dehnul Oud & Attars",
    subtitle: "Distilled from aged wild Koh Kong and Assamese agarwood forests. 24–48 hours extreme longevity with majestic projection that lingers on clothes for days.",
    highlight: "Zero Alcohol • Pure Concentrated Misce Oil",
    price: "From ₹649",
    mrp: "₹999",
    ctaText: "Discover Pure Oud",
    ctaLink: "/shop?category=fragrance",
    image: "/assets/studio/dehnul_oud_pure.jpg"
  },
  {
    id: 'wedding',
    badge: '💍 Sacred Nikah Traditions',
    title: "Luxury Velvet Gold-Foil Nikah Nama",
    subtitle: "Handcrafted heirloom marriage certificate booklets with Quranic covenants, ostrich feather quill signing pens, and velvet Haq Mehar treasure boxes.",
    highlight: "Sacred Sunnah Keepsakes • Pan-India Courier",
    price: "From ₹899",
    mrp: "₹1,499",
    ctaText: "View Nikah Collection",
    ctaLink: "/shop?category=wedding",
    image: "/assets/studio/nikah_nama_booklet.jpg"
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Preload hero slide images
  useEffect(() => {
    HERO_SLIDES.forEach(s => {
      if (s.image) {
        const img = new Image();
        img.src = s.image;
      }
    });
  }, []);

  // Auto rotate slides every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#fbf9f4] via-[#f7f3e8] to-[#faf8f5] py-6 sm:py-12 border-b border-amber-900/10">
      
      {/* Subtle Islamic Ambient Motif */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#032219_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Editorial Hero Card */}
        <div className="relative rounded-3xl bg-white border border-amber-900/15 p-5 sm:p-10 lg:p-12 shadow-xl overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center">
            
            {/* Left Column: Typography & CTAs */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left z-10">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-950 text-xs font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>{slide.badge}</span>
              </div>

              {/* Slide Title */}
              <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-[#032219]">
                {slide.title}
              </h1>

              {/* Mobile-Only Prominent Product Image (Instantly visible on phone screens!) */}
              <div className="lg:hidden my-3 flex items-center justify-center">
                <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-2xl p-2.5 bg-gradient-to-tr from-amber-50/90 via-white to-emerald-50/90 border border-amber-900/15 shadow-lg flex items-center justify-center">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-contain rounded-xl filter drop-shadow-md"
                  />
                  <div className="absolute -bottom-2.5 bg-white border border-amber-500/40 px-2.5 py-1 rounded-full shadow text-[10px] font-bold text-[#032219] flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-600" />
                    <span>100% Authentic Sunnah</span>
                  </div>
                </div>
              </div>

              {/* Subtitle */}
              <p className="text-slate-600 text-xs sm:text-sm lg:text-base max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed line-clamp-3 sm:line-clamp-none">
                {slide.subtitle}
              </p>

              {/* Highlight Tag & Pricing Pill */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-0.5">
                <span className="py-1 px-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{slide.highlight}</span>
                </span>
                <span className="py-1 px-3 rounded-lg bg-amber-100/70 border border-amber-300 text-amber-950 text-xs font-bold font-serif">
                  {slide.price} <span className="line-through text-slate-400 font-normal ml-1">{slide.mrp}</span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-3 pt-2">
                <Link
                  to={slide.ctaLink}
                  className="w-full sm:w-auto px-6 py-3 sm:py-3.5 rounded-xl bg-[#032219] text-amber-300 font-bold text-xs sm:text-sm hover:bg-[#063e2e] shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>{slide.ctaText}</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </Link>

                <Link
                  to="/distributor"
                  className="w-full sm:w-auto px-5 py-2.5 sm:py-3.5 rounded-xl bg-amber-50 text-amber-950 border border-amber-300 hover:bg-amber-100 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5"
                >
                  <span>🤝 Wholesale Dealership</span>
                </Link>
              </div>

            </div>

            {/* Right Column: Hero Studio Image with 3D Pop Frame (Desktop View) */}
            <div className="hidden lg:flex lg:col-span-5 items-center justify-center relative">
              <div className="relative w-56 h-56 sm:w-76 sm:h-76 lg:w-92 lg:h-92 rounded-3xl p-3 bg-gradient-to-tr from-amber-50 via-white to-emerald-50 border border-amber-900/15 shadow-xl flex items-center justify-center group">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-contain rounded-2xl filter drop-shadow-xl transition-all duration-700 group-hover:scale-105"
                />

                <div className="absolute -bottom-3 -right-2 bg-white/95 border border-amber-500/40 px-3 py-1.5 rounded-xl shadow-lg backdrop-blur-md text-[11px] font-bold text-[#032219] flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>100% Authentic Sunnah</span>
                </div>
              </div>
            </div>

          </div>

          {/* Slider Navigation Arrows & Indicator Dots */}
          <div className="flex items-center justify-between pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              {HERO_SLIDES.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === idx ? 'w-8 bg-amber-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 flex items-center justify-center transition"
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono text-slate-500 font-bold">
                0{currentSlide + 1} / 0{HERO_SLIDES.length}
              </span>
              <button
                onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 flex items-center justify-center transition"
                aria-label="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* 4 Bottom Trust Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 text-xs">
          <div className="bg-white p-3.5 rounded-2xl border border-amber-900/10 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900">100% Halal Lab Tested</div>
              <div className="text-[10px] text-slate-500">Certified Pure Ingredients</div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-amber-900/10 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900">Pan-India Express COD</div>
              <div className="text-[10px] text-slate-500">19,000+ Verified Pincodes</div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-amber-900/10 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <div className="font-bold text-slate-900">4.9/5 Verified Ratings</div>
              <div className="text-[10px] text-slate-500">3,400+ Muslim Families</div>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-amber-900/10 shadow-sm flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-900">Direct Brand Supply</div>
              <div className="text-[10px] text-slate-500">Zero Middlemen Markups</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
