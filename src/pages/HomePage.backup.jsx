// EXACT BACKUP OF ORIGINAL HOMEPAGE (PRESERVED FOR 1-CLICK REVERT IF DESIRED)
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CategoryStories from '../components/CategoryStories';
import Hero from '../components/Hero';
import TalbinaSpotlight from '../components/TalbinaSpotlight';
import ReelsShowcase from '../components/ReelsShowcase';
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
  Copy,
  Check,
  Zap,
  TrendingUp,
  Gift
} from 'lucide-react';

export default function HomePageBackup() {
  const { products, categories, settings, showToast } = useStore();
  const [activeCatalogTab, setActiveCatalogTab] = useState('all');
  const [visibleCount, setVisibleCount] = useState(8);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  const handleTabChange = (tabId) => {
    setActiveCatalogTab(tabId);
    setVisibleCount(8);
  };

  const currentTabProducts = activeCatalogTab === 'all' 
    ? products 
    : products.filter(p => p.category === activeCatalogTab);

  const displayedProducts = currentTabProducts.slice(0, visibleCount);
  const hasMore = visibleCount < currentTabProducts.length;

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('ARABIAN10');
    setCopiedCoupon(true);
    showToast('Coupon ARABIAN10 copied to clipboard!');
    setTimeout(() => setCopiedCoupon(false), 3000);
  };

  return (
    <div className="bg-[#faf8f5] text-slate-800 animate-fadeIn pb-20 space-y-12 sm:space-y-16">
      <CategoryStories />
      <Hero />
      <ReelsShowcase />

      {/* Limited-Time Flash Offer Announcement Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 rounded-2xl p-4 sm:p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 border border-amber-300">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-300 flex items-center justify-center shrink-0 shadow">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="font-serif font-black text-sm sm:text-base leading-tight">
                Special Sunnah Blessing Offer: Flat 10% Off on Orders Above ₹999!
              </div>
              <div className="text-xs text-slate-900 font-medium">
                Free Express Pan-India Delivery + Premium Gift Packaging Included.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCoupon}
              className="px-4 py-2 rounded-xl bg-slate-950 text-amber-300 font-mono font-bold text-xs hover:bg-slate-900 transition flex items-center gap-1.5 shadow"
            >
              {copiedCoupon ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCoupon ? 'COPIED!' : 'ARABIAN10'}</span>
            </button>
            <Link
              to="/shop"
              className="px-4 py-2 rounded-xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition shadow"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>

      {/* 5 Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Curated Collections</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#032219]">
            The 5 Pillars of Arabians
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Authentic Sunnah superfoods, tailored Saudi attire, aged Cambodian oud, and sacred Nikah keepsakes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/15 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  👑 Royal Wardrobe
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-black text-[#032219]">
                  Men's Saudi & Emirati Thobes
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md">
                  Pristine straight-cut white jubbas, standing stiff collars, and concealed snap buttons. Engineered for Jummah and auspicious gatherings.
                </p>
                <div className="flex items-center gap-2 pt-1 text-xs text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Free Size Replacement Guarantee</span>
                </div>
              </div>
              <span className="text-xs font-black text-amber-950 bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-xl whitespace-nowrap font-serif">
                From ₹1,499
              </span>
            </div>
            <div className="my-6 relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 aspect-[16/9] flex items-center justify-center p-3">
              <img
                src="/assets/studio/mens_white_thobe.jpg"
                alt="Men's Saudi Thobe"
                className="max-h-full object-contain filter drop-shadow-lg group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <Link
              to="/shop?category=wearing"
              className="w-full py-3 rounded-xl bg-[#032219] text-amber-300 font-bold text-xs hover:bg-[#063e2e] transition flex items-center justify-center gap-2"
            >
              <span>Explore All Men's Thobes, Amama & Bisht</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="md:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/15 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                🥣 Sunnah Superfood
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-black text-[#032219]">
                Arabian's Sprouted Talbina
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Stone-ground roasted barley blended with dry fruits. Mentioned in Bukhari 5417 to ease anxiety and nourish the body.
              </p>
            </div>
            <div className="my-6 relative rounded-2xl overflow-hidden bg-emerald-50/40 border border-emerald-100 aspect-[4/3] flex items-center justify-center p-4">
              <img
                src="/assets/talbina/talbina_vanilla_dryfruits.png"
                alt="Arabian's Talbina Box"
                className="max-h-full object-contain filter drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <Link
              to="/product/talbina-vanilla"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs hover:from-amber-400 hover:to-amber-500 transition flex items-center justify-center gap-1.5 shadow-gold"
            >
              <span>Order 5 Flavors Online (₹349)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-amber-900/15 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                ✨ Alcohol-Free
              </span>
              <h4 className="font-serif text-lg font-bold text-[#032219]">Aged Cambodian Dehnul Oud</h4>
              <p className="text-xs text-slate-500">Pure wild agarwood misce oil with 24–48 hours projection.</p>
            </div>
            <div className="my-4 aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center p-3">
              <img
                src="/assets/studio/dehnul_oud_pure.jpg"
                alt="Dehnul Oud"
                className="max-h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <Link
              to="/shop?category=fragrance"
              className="text-xs font-bold text-[#032219] group-hover:text-amber-700 transition flex items-center justify-between pt-2 border-t border-slate-100"
            >
              <span>Explore Attars & Bakhoor</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-amber-900/15 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800 bg-indigo-100 px-2.5 py-0.5 rounded-full">
                🕌 Handcrafted Art
              </span>
              <h4 className="font-serif text-lg font-bold text-[#032219]">3D Gold Ayat-ul-Kursi Tugra</h4>
              <p className="text-xs text-slate-500">Mirror-finish acrylic and resin calligraphy clocks for sacred homes.</p>
            </div>
            <div className="my-4 aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center p-3">
              <img
                src="/assets/studio/ayatul_kursi_tugra.jpg"
                alt="Ayat-ul-Kursi Tugra"
                className="max-h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <Link
              to="/shop?category=decor"
              className="text-xs font-bold text-[#032219] group-hover:text-amber-700 transition flex items-center justify-between pt-2 border-t border-slate-100"
            >
              <span>View Wall Clocks & Frames</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-amber-900/15 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-full">
                💍 Sunnah Nikah
              </span>
              <h4 className="font-serif text-lg font-bold text-[#032219]">Velvet Gold-Foil Nikah Nama</h4>
              <p className="text-xs text-slate-500">Heirloom marriage booklets, quill signing pens & Haq Mehar boxes.</p>
            </div>
            <div className="my-4 aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center p-3">
              <img
                src="/assets/studio/nikah_nama_booklet.jpg"
                alt="Nikah Nama Booklet"
                className="max-h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <Link
              to="/shop?category=wedding"
              className="text-xs font-bold text-[#032219] group-hover:text-amber-700 transition flex items-center justify-between pt-2 border-t border-slate-100"
            >
              <span>Browse Wedding Keepsakes</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Hamper Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#032219] via-[#053a2b] to-[#032219] border border-amber-500/40 p-6 sm:p-10 shadow-xl text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 text-center md:text-left max-w-xl">
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

      <TalbinaSpotlight />

      {/* Catalog Grid */}
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

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

      {/* Sunnah Guarantees */}
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

      <ReviewsSection />
    </div>
  );
}
