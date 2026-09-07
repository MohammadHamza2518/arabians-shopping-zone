import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import CategoryStories from '../components/CategoryStories';
import Hero from '../components/Hero';
import FlashSaleTimer from '../components/FlashSaleTimer';
import ReelsShowcase from '../components/ReelsShowcase';
import TalbinaSpotlight from '../components/TalbinaSpotlight';
import ReviewsSection from '../components/ReviewsSection';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { getGeneralSupportWhatsAppUrl } from '../utils/whatsapp';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  PackageCheck, 
  HeartHandshake,
  CheckCircle2,
  ExternalLink,
  MapPin,
  PhoneCall,
  Flame,
  TrendingUp,
  Gift,
  ChevronDown,
  HelpCircle
} from 'lucide-react';

const HOME_FAQS = [
  {
    q: "What is Talbina and what are its prophetic health benefits?",
    a: "Talbina is a soothing, nutrient-rich porridge made from finely ground sprouted whole barley (Jau), enriched with roasted dry fruits (almonds, cashews, pistachios, dates, pumpkin seeds) and honey or milk. As recorded in Sahih Bukhari (Hadith 5417), the Prophet Muhammad (ﷺ) recommended Talbina for comforting the heart of the sick and relieving grief, stress, and physical exhaustion. Arabians Shopping Zone prepares 100% natural Talbina free of chemicals, sugar, and preservatives."
  },
  {
    q: "How do I choose the correct Saudi or Emirati Thobe size?",
    a: "Our Thobes follow standard Arab Gulf sizing based on overall height from shoulder to ankle (sizes 52 to 62) and chest fitting (M, L, XL, XXL). We provide an exact size guide on every product page, free measurement guidance via WhatsApp, and 100% Free Size Exchange across India so your fit is always royal and comfortable."
  },
  {
    q: "Are your Attars, Ouds, and Perfumes 100% alcohol-free?",
    a: "Yes, all fragrances at Arabians Shopping Zone are 100% alcohol-free (Halal), pure concentrated perfume oils (Ittar) and aged Dehnul Oud (Assamese, Cambodian, and Taif rose blends). Due to pure non-alcoholic formulation, a single application on cuffs and collar lasts 24 to 48 hours."
  },
  {
    q: "Can I customize bride and groom names on the Nikah Nama certificate?",
    a: "Yes! Our bespoke Nikah Nama certificates, quills, and royal groom presentation hampers include complimentary custom gold-foil personalization for Dulha and Dulhan names, Islamic Hijri wedding dates, and city names. Simply type your details on the product page or connect on WhatsApp."
  },
  {
    q: "Do you offer Pan-India Cash on Delivery (COD) and Free Shipping?",
    a: "Yes, we offer express air shipping with Cash on Delivery (COD) across all 19,000+ pincodes in India via BlueDart, Delhivery, and DTDC. Free express delivery is automatically applied on all orders above ₹999."
  },
  {
    q: "Are Arabians Shopping Zone products available in offline physical stores?",
    a: "Yes, Arabians Shopping Zone is a verified physical brand with our flagship boutique in Kanpur (Chauraha, 88/485, Dalel Purwa, Opposite Shifa Eye Hospital, Becon Ganj, Mulganj, Kanpur, UP 208001) where you can try thobes, sample pure attars, and buy authentic products in person."
  }
];

export default function HomePage() {
  const { products, categories, settings } = useStore();
  const [activeCatalogTab, setActiveCatalogTab] = useState('all');
  const [visibleCount, setVisibleCount] = useState(8);
  const [openFaq, setOpenFaq] = useState(0);

  const handleTabChange = (tabId) => {
    setActiveCatalogTab(tabId);
    setVisibleCount(8);
  };

  // Filter products by selected tab with controlled visible count (Prevents infinite scrolling)
  // Newly uploaded products and featured items are shown immediately at the top
  const currentTabProducts = activeCatalogTab === 'all' 
    ? products
    : products.filter(p => p.category === activeCatalogTab);

  const displayedProducts = currentTabProducts.slice(0, visibleCount);
  const hasMore = visibleCount < currentTabProducts.length;

  return (
    <div className="bg-[#faf8f5] text-slate-800 animate-fadeIn space-y-12 sm:space-y-16">
      
      {/* Universal Dynamic SEO Optimization */}
      <SEO 
        title="Arabians Shopping Zone | Royal Sunnah Lifestyle, Authentic Talbina, Thobes & Pure Dehnul Oud"
        description="Shop India's premier royal Sunnah lifestyle boutique. Authentic Talbina dry fruit nutrition, handcrafted Saudi Arabian thobes, aged Dehnul Oud, 3D Islamic wall decor, and custom bespoke Nikah Nama essentials with Pan-India express delivery & Cash on Delivery."
        keywords="Arabians Shopping Zone, Talbina buy online India, authentic talbina dry fruits, saudi thobe hyderabad, emirati jubba men, madani green amama shareef, aged dehnul oud, pure attar perfume, custom nikah nama certificate, haq mehar box, islamic wall decor 3d acrylic ayatul kursi, halal certified store india, sunnah lifestyle products"
      />

      {/* 1. Category Stories + Luxury Hero Showcase (Unified Seamless Flow) */}
      <div className="space-y-0">
        <CategoryStories />
        <Hero />
      </div>

      {/* 3. Real-Time Flash Deal Countdown Timer (Ends at Midnight) */}
      <FlashSaleTimer />

      {/* 4. Instagram Reels & Video Shopping Showcase (2.8M & 1.1M Views Spotlight) */}
      <ReelsShowcase />


      {/* 6. Curated Sacred Collections (Eliminates Mobile Scroll Fatigue & Talbina Redundancy) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Curated Collections</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#032219]">
            Sacred Sunnah Collections
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Tailored Saudi attire, aged Cambodian oud, heirloom Nikah keepsakes, and 3D calligraphy art.
          </p>
        </div>

        {/* 4 Distinct Collections Grid (2 cols on mobile, 4 cols on desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          
          {/* 1. Men's Royal Attire */}
          <Link 
            to="/shop?category=wearing"
            className="group relative bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-amber-900/15 shadow-sm hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="mb-2">
                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-500/15 border border-amber-500/25 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                  👑 Royal Attire
                </span>
              </div>
              <h3 className="font-serif text-xs sm:text-base font-black text-[#032219] group-hover:text-amber-700 transition leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
                Saudi & Emirati Thobes
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1 mt-0.5">
                Standing collars & snaps
              </p>
            </div>

            <div className="my-2.5 relative aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 shadow-md group-hover:scale-[1.02] transition-transform duration-500">
              <img
                src="/assets/studio/thobe_story_916.jpg"
                alt="Men's Saudi Thobe"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800 group-hover:text-amber-600 transition">
              <div className="flex flex-col">
                <span className="text-[8px] sm:text-[9px] text-slate-400 uppercase font-semibold">Starting</span>
                <span className="font-mono font-black text-xs sm:text-sm text-amber-900">₹1,499</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold">
                <span>Explore</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* 2. Dehnul Oud & Attar */}
          <Link 
            to="/shop?category=fragrance"
            className="group relative bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-amber-900/15 shadow-sm hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="mb-2">
                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-500/15 border border-emerald-500/25 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                  🌿 Alcohol-Free
                </span>
              </div>
              <h3 className="font-serif text-xs sm:text-base font-black text-[#032219] group-hover:text-amber-700 transition leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
                Aged Dehnul Oud & Attar
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1 mt-0.5">
                Wild Cambodian agarwood
              </p>
            </div>

            <div className="my-2.5 relative aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 shadow-md group-hover:scale-[1.02] transition-transform duration-500">
              <img
                src="/assets/studio/oud_story_916.jpg"
                alt="Dehnul Oud"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800 group-hover:text-amber-600 transition">
              <div className="flex flex-col">
                <span className="text-[8px] sm:text-[9px] text-slate-400 uppercase font-semibold">Starting</span>
                <span className="font-mono font-black text-xs sm:text-sm text-amber-900">₹649</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold">
                <span>Explore</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* 3. Islamic Home Decor */}
          <Link 
            to="/shop?category=decor"
            className="group relative bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-amber-900/15 shadow-sm hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="mb-2">
                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-indigo-900 bg-indigo-500/15 border border-indigo-500/25 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                  🕌 Sacred Art
                </span>
              </div>
              <h3 className="font-serif text-xs sm:text-base font-black text-[#032219] group-hover:text-amber-700 transition leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
                3D Ayat-ul-Kursi Frames
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1 mt-0.5">
                Mirror acrylic calligraphy
              </p>
            </div>

            <div className="my-2.5 relative aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 shadow-md group-hover:scale-[1.02] transition-transform duration-500">
              <img
                src="/assets/studio/decor_story_916.jpg"
                alt="Ayat-ul-Kursi Tugra"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800 group-hover:text-amber-600 transition">
              <div className="flex flex-col">
                <span className="text-[8px] sm:text-[9px] text-slate-400 uppercase font-semibold">Starting</span>
                <span className="font-mono font-black text-xs sm:text-sm text-amber-900">₹899</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold">
                <span>Explore</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* 4. Sacred Nikah Keepsakes */}
          <Link 
            to="/shop?category=wedding"
            className="group relative bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-amber-900/15 shadow-sm hover:shadow-xl hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="mb-2">
                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-rose-900 bg-rose-500/15 border border-rose-500/25 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                  💍 Sacred Nikah
                </span>
              </div>
              <h3 className="font-serif text-xs sm:text-base font-black text-[#032219] group-hover:text-amber-700 transition leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
                Velvet Gold Nikah Nama
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1 mt-0.5">
                Marriage booklets & pens
              </p>
            </div>

            <div className="my-2.5 relative aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-950 shadow-md group-hover:scale-[1.02] transition-transform duration-500">
              <img
                src="/assets/studio/nikah_story_916.jpg"
                alt="Nikah Nama Booklet"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800 group-hover:text-amber-600 transition">
              <div className="flex flex-col">
                <span className="text-[8px] sm:text-[9px] text-slate-400 uppercase font-semibold">Starting</span>
                <span className="font-mono font-black text-xs sm:text-sm text-amber-900">₹899</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] sm:text-xs font-bold">
                <span>Explore</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

        </div>
      </section>

      {/* 7. Bespoke Nikah & Gift Hamper Studio Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#032219] via-[#053a2b] to-[#032219] border border-amber-500/40 p-6 sm:p-10 shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-3 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>Bespoke Gifting Studio • 15% Combo Savings</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-black text-white leading-tight">
              Curate a Royal Nikah & Sunnah Gift Hamper
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              Personalize a handcrafted velvet trunk with tailored Saudi thobes, aged Cambodian oud, and heirloom Nikah Nama with custom calligraphy card.
            </p>
            
            {/* 4-step Visual Pills */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-[10px] sm:text-[11px] text-amber-200">
              <span className="bg-white/10 px-2 py-0.5 rounded-md">1. Pick Velvet Trunk</span>
              <span>➔</span>
              <span className="bg-white/10 px-2 py-0.5 rounded-md">2. Select Thobe</span>
              <span>➔</span>
              <span className="bg-white/10 px-2 py-0.5 rounded-md">3. Add Pure Oud</span>
              <span>➔</span>
              <span className="bg-white/10 px-2 py-0.5 rounded-md">4. Gold Card</span>
            </div>
          </div>

          <Link
            to="/hamper"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs sm:text-sm hover:from-amber-400 hover:to-amber-500 transition shadow-gold flex items-center gap-2 shrink-0 active:scale-95"
          >
            <Gift className="w-4 h-4 text-slate-950" />
            <span>Open Hamper Studio →</span>
          </Link>
        </div>
      </section>

      {/* 9. Flagship Product Spotlight: Arabian's Talbeena */}
      <TalbinaSpotlight />

      {/* 10. Live Interactive Catalog Grid with Category Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-widest mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              <span>Direct Store Catalog</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-[#032219]">
              Trending Customer Favorites
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Dispatched with tamper-proof seal and Pan-India Cash on Delivery.
            </p>
          </div>

          <Link
            to="/shop"
            className="px-5 py-2.5 rounded-xl bg-[#032219] text-amber-300 hover:bg-[#063e2e] font-bold text-xs sm:text-sm transition flex items-center gap-2 shadow whitespace-nowrap active:scale-95"
          >
            <span>View All {products.length} Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
          <button
            onClick={() => handleTabChange('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeCatalogTab === 'all'
                ? 'bg-[#032219] text-amber-300 shadow'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            All Products ({products.length})
          </button>

          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => handleTabChange(c.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeCatalogTab === c.id
                  ? 'bg-[#032219] text-amber-300 shadow'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Dynamic Pagination & Catalog Navigator (Prevents Infinite Scrolling) */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80">
          <div className="text-xs text-slate-500 font-medium text-center sm:text-left">
            Showing <span className="font-bold text-slate-900">{displayedProducts.length}</span> of <span className="font-bold text-slate-900">{currentTabProducts.length}</span> items
            <div className="w-48 h-1.5 bg-slate-200 rounded-full mt-1.5 overflow-hidden mx-auto sm:mx-0">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (displayedProducts.length / Math.max(1, currentTabProducts.length)) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {hasMore && (
              <button
                type="button"
                onClick={() => setVisibleCount(prev => prev + 8)}
                className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-bold text-xs hover:bg-slate-50 transition shadow-sm active:scale-95"
              >
                Load More (+8 Products)
              </button>
            )}

            <Link
              to={activeCatalogTab === 'all' ? '/shop' : `/shop?category=${activeCatalogTab}`}
              className="px-5 py-2.5 rounded-xl bg-[#032219] text-amber-300 font-bold text-xs hover:bg-[#063e2e] transition shadow flex items-center gap-1.5 active:scale-95"
            >
              <span>Explore Full Store Catalog ({currentTabProducts.length}) →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 11. Brand Heritage & Sunnah Guarantees (Clean Ivory Cards) */}
      <section className="bg-white py-14 sm:py-20 border-y border-amber-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
              Our Sunnah Commitment
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#032219]">
              Why Indian Muslims Choose Arabians Shopping Zone
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              We stand apart from regular drop-shippers. We operate our own physical Islamic store with direct laboratory certification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-[#fcfbf9] p-6 sm:p-8 rounded-3xl border border-amber-900/10 space-y-3 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-serif text-xl font-bold">
                🥣
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">Sprouted Barley Nutrition</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our Talbina uses real whole-grain barley mentioned in Sahih Bukhari (Hadith 5417) to soothe grieving hearts and boost vitality — 100% natural with roasted dry fruits and zero artificial chemicals.
              </p>
            </div>

            <div className="bg-[#fcfbf9] p-6 sm:p-8 rounded-3xl border border-amber-900/10 space-y-3 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-serif text-xl font-bold">
                👑
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">Authentic Men's Tailoring</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Traditional Saudi stiff standing collars, concealed snap plackets, and Kashmiri Amama shareef. Every thobe has calibrated length and chest sizing with <strong>100% Free Size Exchange</strong> if it does not fit perfectly.
              </p>
            </div>

            <div className="bg-[#fcfbf9] p-6 sm:p-8 rounded-3xl border border-amber-900/10 space-y-3 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-serif text-xl font-bold">
                📍
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">Real Physical Store</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Unlike faceless websites, our store is verified on Google Maps with hundreds of in-person shoppers. You can visit us in market or order online with guaranteed Pan-India Cash on Delivery.
              </p>
            </div>

          </div>

          {/* Direct WhatsApp Callout Banner */}
          <div className="bg-gradient-to-r from-emerald-900 to-[#032219] text-white rounded-2xl p-5 sm:p-6 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h4 className="font-serif text-base sm:text-lg font-bold">Need Custom Thobe Sizing or Talbina Dosage Guidance?</h4>
              <p className="text-xs text-emerald-200">Our in-store specialists are available on WhatsApp 6 days a week.</p>
            </div>
            <a
              href={getGeneralSupportWhatsAppUrl('Thobe Sizing & Talbina Advice', settings.whatsapp)}
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-amber-500 transition flex items-center gap-2 whitespace-nowrap shadow"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

        </div>
      </section>

      {/* 12. Sunnah Lifestyle Knowledge Hub & SEO FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12" id="faq-section">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Customer Knowledge Hub</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#032219]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Learn more about authentic Sunnah nutrition, artisanal tailoring, pure Dehnul Oud longevity, and express Pan-India shipping.
          </p>
        </div>

        <div className="space-y-3">
          {HOME_FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-amber-900/10 shadow-sm overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between gap-4 font-serif font-bold text-slate-900 hover:text-amber-800 transition"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0 border border-amber-200/60">
                      {idx + 1}
                    </span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={`w-5 h-5 text-amber-600 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-amber-900/5 animate-fadeIn">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Local Store & Inquiry Teaser */}
        <div className="mt-8 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="text-xs text-slate-700">
            <span className="font-bold text-amber-950">Have a specific question about an order or custom Nikah size?</span>
            <span className="block text-slate-500">Our customer care desk replies in less than 5 minutes on WhatsApp.</span>
          </div>
          <Link
            to="/store"
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Visit Physical Store & Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 13. Verified Customer Reviews */}
      <ReviewsSection />

    </div>
  );
}
