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
import { useStore } from '../context/StoreContext';

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
    image: "/assets/studio/mens_black_thobe_studio.jpg"
  },
  {
    id: 'talbina',
    badge: '🥣 Prophetic Sunnah Superfood',
    title: "Arabian's Sprouted Barley Talbeena",
    subtitle: "Stone-ground roasted barley blended with premium California almonds, pistachios, and saffron. Rejuvenates the heart and vitalizes immunity according to authentic Hadith 5417.",
    highlight: "5 High-Repeat Flavors • Lab Certified • 100% Halal",
    price: "From ₹249",
    mrp: "₹270",
    ctaText: "Order Sunnah Talbina",
    ctaLink: "/product/talbina-vanilla",
    image: "/assets/talbina/talbina_banner_43.jpg"
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
    image: "/assets/studio/oud_mabkhara_luxury.jpg"
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
    image: "/assets/studio/nikah_nama_banner_43.jpg"
  },
  {
    id: 'skincare',
    badge: '🌿 Natural & Sunnah Skin Care',
    title: "Kashmiri Ubtan, Herbal Soaps & Night Creams",
    subtitle: "Pure Red Sandalwood, Kashmiri Saffron, and 100% chemical-free herbal formulas to restore radiant glow, fade tanning, and nourish delicate skin with Sunnah purity.",
    highlight: "100% Herbal & Organic • Zero Harsh Chemicals",
    price: "From ₹199",
    mrp: "₹240",
    ctaText: "Shop Skin Care",
    ctaLink: "/shop?category=skincare",
    image: "/assets/categories/skincare_kashmiri_herbs.jpg"
  }
];

export default function Hero() {
  const { reviewStats, heroSlides } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const activeSlides = (Array.isArray(heroSlides) && heroSlides.length > 0) ? heroSlides : HERO_SLIDES;
  const safeIndex = currentSlide % activeSlides.length;
  const slide = activeSlides[safeIndex] || activeSlides[0] || HERO_SLIDES[0];

  // Preload hero slide images safely
  useEffect(() => {
    activeSlides.forEach(s => {
      if (s && s.image) {
        const img = new Image();
        img.src = s.image;
      }
    });
  }, [activeSlides]);

  // Auto rotate slides every 6 seconds (if more than 1 slide)
  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  return (
    <div className="relative overflow-hidden bg-[#faf8f5] pt-2 pb-4 sm:pb-8">
      
      {/* Subtle Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Main Editorial Hero Card */}
        <div className="relative rounded-2xl sm:rounded-3xl bg-white border border-amber-900/15 p-4 sm:p-6 lg:p-10 shadow-lg sm:shadow-xl overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-10 items-center">
            
            {/* Mobile-Only: Large Prominent Product Showcase (Shown first on phone screens!) */}
            <div className="lg:hidden">
              <div className="relative w-full aspect-[4/3] sm:h-80 rounded-2xl bg-gradient-to-tr from-amber-50/90 via-white to-emerald-50/90 border border-amber-900/15 shadow-md flex items-center justify-center overflow-hidden group">
                <img
                  src={slide.image || '/assets/talbina/talbina_banner_43.jpg'}
                  alt={slide.title || 'Arabians Shopping Zone'}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/assets/talbina/talbina_banner_43.jpg";
                  }}
                  className="w-full h-full object-cover filter drop-shadow-md transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Floating Top Badge */}
                {slide.badge && (
                  <div className="absolute top-3 left-3 bg-white/95 border border-amber-500/30 px-3 py-1 rounded-full shadow-sm text-[11px] font-bold text-amber-950 flex items-center gap-1.5 backdrop-blur-xs max-w-[85%] truncate">
                    <span className="truncate">{slide.badge}</span>
                  </div>
                )}

                {/* Floating Bottom Badge */}
                <div className="absolute bottom-3 right-3 bg-white/95 border border-amber-500/40 px-3 py-1 rounded-full shadow text-[10px] font-bold text-[#032219] flex items-center gap-1.5 backdrop-blur-xs">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>100% Authentic Sunnah</span>
                </div>
              </div>
            </div>

            {/* Left / Text Column: Typography & CTAs */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-4 text-center lg:text-left z-10">
              
              {/* Desktop-Only Badge */}
              {slide.badge && (
                <div className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-950 text-xs font-bold shadow-xs">
                  <span>{slide.badge}</span>
                </div>
              )}

              {/* Slide Title */}
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight leading-tight text-[#032219] break-words">
                {slide.title}
              </h1>

              {/* Subtitle */}
              {slide.subtitle && (
                <p className="text-slate-600 text-xs sm:text-sm lg:text-base max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed break-words">
                  {slide.subtitle}
                </p>
              )}

              {/* Pricing & Benefit Bar */}
              {(slide.price || slide.mrp || slide.highlight) && (
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
                  {(slide.price || slide.mrp) && (
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-100/80 border border-amber-300 text-amber-950 text-sm sm:text-base font-bold font-serif shadow-xs">
                      {slide.price && <span>{slide.price}</span>}
                      {slide.mrp && <span className="line-through text-slate-400 font-sans text-xs font-normal ml-0.5">{slide.mrp}</span>}
                    </div>
                  )}
                  {slide.highlight && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold shadow-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{slide.highlight}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2.5 sm:gap-3 pt-2">
                {slide.ctaText && (
                  <Link
                    to={slide.ctaLink || '/shop'}
                    className="px-6 py-3.5 rounded-xl bg-[#032219] text-amber-300 font-bold text-xs sm:text-sm hover:bg-[#063e2e] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 text-center"
                  >
                    <ShoppingBag className="w-4 h-4 text-amber-400" />
                    <span>{slide.ctaText}</span>
                    <ArrowRight className="w-4 h-4 text-amber-300" />
                  </Link>
                )}

                <Link
                  to="/distributor"
                  className="px-5 py-3 rounded-xl bg-amber-50/80 hover:bg-amber-100 text-amber-950 border border-amber-300/80 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 text-center active:scale-95"
                >
                  <span>🤝 Wholesale Dealership</span>
                </Link>
              </div>

            </div>

            {/* Desktop-Only Right Column: Hero Studio Image with Large High-Res Frame */}
            <div className="hidden lg:flex lg:col-span-5 items-center justify-center relative">
              <div className="relative w-full h-[380px] xl:h-[430px] rounded-3xl bg-gradient-to-tr from-amber-50 via-white to-emerald-50 border border-amber-900/15 shadow-xl flex items-center justify-center overflow-hidden group">
                <img
                  src={slide.image || '/assets/talbina/talbina_banner_43.jpg'}
                  alt={slide.title || 'Arabians Shopping Zone'}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/assets/talbina/talbina_banner_43.jpg";
                  }}
                  className="w-full h-full object-cover filter drop-shadow-2xl transition-all duration-700 group-hover:scale-105"
                />

                <div className="absolute bottom-3 right-3 bg-white/95 border border-amber-500/40 px-3.5 py-1.5 rounded-xl shadow-lg backdrop-blur-md text-xs font-bold text-[#032219] flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span>100% Authentic Sunnah</span>
                </div>
              </div>
            </div>

          </div>

          {/* Slider Navigation Arrows & Indicator Dots */}
          {activeSlides.length > 1 && (
            <div className="flex items-center justify-between pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {activeSlides.map((s, idx) => (
                  <button
                    key={s.id || idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      safeIndex === idx 
                        ? 'w-7 sm:w-9 bg-gradient-to-r from-amber-500 to-amber-600 shadow-xs' 
                        : 'w-2 bg-amber-950/15 hover:bg-amber-950/30'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Luxury Navigation Capsule */}
              <div className="flex items-center gap-1.5 bg-amber-50/70 border border-amber-900/15 rounded-full p-1 pl-3 shadow-xs">
                <span className="text-xs font-sans font-semibold tracking-wider text-slate-600 select-none mr-1">
                  <span className="text-[#032219] font-black">0{safeIndex + 1}</span>
                  <span className="text-amber-900/30 mx-1.5 font-normal">/</span>
                  <span className="text-slate-400 font-medium">0{activeSlides.length}</span>
                </span>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-amber-900/15 text-[#032219] hover:bg-[#032219] hover:text-amber-300 hover:border-[#032219] shadow-xs flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % activeSlides.length)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-amber-900/15 text-[#032219] hover:bg-[#032219] hover:text-amber-300 hover:border-[#032219] shadow-xs flex items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          )}

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
              <div className="font-bold text-slate-900">{reviewStats?.average || '4.9'}/5 Verified Ratings</div>
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
