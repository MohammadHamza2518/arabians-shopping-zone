import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Pause,
  Heart, 
  ShoppingBag, 
  Volume2, 
  VolumeX, 
  X, 
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Eye,
  Share2,
  Check,
  Flame
} from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import { useStore } from '../context/StoreContext';

// Single Running Reel Card Component - Completely Unobstructed & Crystal Clear
function ReelCard({ reel, onSelect }) {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Play video smoothly when in viewport (Zero-lag performance)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const toggleSound = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const handleOpenInstagram = (e) => {
    e.stopPropagation();
    const url = reel.instagramUrl || 'https://www.instagram.com/arabians_shopping_zone/';
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShopCategory = (e) => {
    e.stopPropagation();
    const cat = reel.category || 'wearing';
    navigate(`/shop?category=${cat}`);
  };

  return (
    <div 
      onClick={() => onSelect && onSelect(reel)}
      className="group relative w-[165px] sm:w-[190px] md:w-auto shrink-0 aspect-[9/16] rounded-3xl overflow-hidden bg-slate-950 border-2 border-emerald-700/60 hover:border-amber-400 shadow-xl cursor-pointer transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-amber-500/20 select-none"
      title="Tap to watch full video • Click 'Shop' for category collection"
    >
      {/* Background HD Poster - Always rendered so zero black screen or loading flicker */}
      <img 
        src={reel.thumbnail} 
        alt={reel.title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Background Live Running Video - Plays seamlessly on top of poster */}
      {!hasError && reel.videoUrl && (
        <video
          ref={videoRef}
          src={reel.videoUrl}
          poster={reel.thumbnail}
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
          onError={() => setHasError(true)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      )}

      {/* Very light minimal gradient only at the very bottom behind the title */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none"></div>

      {/* Top Floating Badges */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 text-[10px]">
        {/* Instagram Reel View Count Pill */}
        <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[11px] font-bold border border-white/20 shadow-md">
          <Play className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
          <span className="text-amber-300 font-extrabold tracking-tight">{reel.views}</span>
          <span className="text-slate-300 font-medium text-[9px] uppercase tracking-wider">views</span>
        </span>

        {/* Quick Audio Mute / Unmute Button on Card */}
        <button
          onClick={toggleSound}
          className={`w-7 h-7 rounded-full backdrop-blur-md flex items-center justify-center transition shadow-lg ${
            !isMuted 
              ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300' 
              : 'bg-black/60 text-white hover:bg-black/80'
          }`}
          title={isMuted ? "Unmute Video Audio" : "Mute Video Audio"}
        >
          {!isMuted ? (
            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-slate-300" />
          )}
        </button>
      </div>

      {/* Center Subtle Play Indicator */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition duration-300">
        <div className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-md border border-amber-400/60 flex items-center justify-center shadow-xl scale-90 group-hover:scale-100 transition">
          <Play className="w-5 h-5 fill-amber-400 text-amber-400 ml-0.5" />
        </div>
      </div>

      {/* Bottom Title & Compact Category Shop Action */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10">
        <p className="text-[11px] sm:text-xs font-bold text-white line-clamp-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] leading-tight mb-1.5">
          {reel.title}
        </p>

        <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-white/15">
          <div 
            onClick={handleOpenInstagram}
            className="flex items-center gap-1 text-[10px] text-amber-300 font-bold opacity-90 truncate hover:text-amber-200 cursor-pointer"
            title="Open on Instagram"
          >
            <InstagramIcon className="w-3 h-3 text-amber-400 shrink-0" />
            <span className="tracking-tight text-[9px] sm:text-[10px] truncate">@arabians</span>
          </div>

          <button
            type="button"
            onClick={handleShopCategory}
            className="px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-[10px] font-black flex items-center gap-1 shadow-md hover:scale-105 active:scale-95 transition-all shrink-0 border border-amber-300/40"
            title={`Shop ${reel.categoryName || 'Category'}`}
          >
            <ShoppingBag className="w-2.5 h-2.5" />
            <span>Shop</span>
            <ChevronRight className="w-2.5 h-2.5 stroke-[3]" />
          </button>
        </div>
      </div>

    </div>
  );
}

const DEFAULT_REELS = [
  {
    id: "reel-1",
    title: "Viral Amama Sharif Tying Tutorial 👑",
    views: "20M",
    likes: "180.7K",
    videoUrl: "/assets/reels/real_amama_tutorial.mp4",
    thumbnail: "/assets/reels/real_amama_tutorial.jpg",
    instagramUrl: "https://www.instagram.com/reel/DVVt2k7ERwZ/",
    category: "wearing",
    categoryName: "Attire & Caps",
    productId: "amama-shareef-madani",
    productName: "Traditional Green Amama Shareef (7 Meters)",
    productPrice: "₹599"
  },
  {
    id: "reel-2",
    title: "Special Designer Cap for 12 Rabi-ul-Awal 👑✨",
    views: "2.8M",
    likes: "142.5K",
    videoUrl: "/assets/reels/real_viral_28m.mp4",
    thumbnail: "/assets/reels/real_viral_28m.jpg",
    instagramUrl: "https://www.instagram.com/reel/DNvW2rM0kQV/",
    category: "wearing",
    categoryName: "Caps & Attire",
    productId: "islamic-cap-collection",
    productName: "Handcrafted Turkish Velvet & Omani Cap Set",
    productPrice: "₹449"
  },
  {
    id: "reel-3",
    title: "BIG QURAAN SET 16 inch 😍 | GIFT & WEDDING ❤️",
    views: "1.1M",
    likes: "92.4K",
    videoUrl: "/assets/reels/real_quran_set.mp4",
    thumbnail: "/assets/reels/real_quran_set.jpg",
    instagramUrl: "https://www.instagram.com/reel/DI6jN-5hW82/",
    category: "wedding",
    categoryName: "Wedding Gifts",
    productId: "big-quraan-set-16-inch",
    productName: "Royal Velvet & Acrylic Big Quraan Set (16 Inch)",
    productPrice: "₹2499"
  },
  {
    id: "reel-4",
    title: "SYRIAN QUBBA AVAILABLE AT ARABIANS 🛍️",
    views: "354K",
    likes: "18.8K",
    videoUrl: "/assets/reels/real_syrian_qubba.mp4",
    thumbnail: "/assets/reels/real_syrian_qubba.jpg",
    instagramUrl: "https://www.instagram.com/reel/DSC5bawjdBm/",
    category: "wearing",
    categoryName: "Royal Bisht",
    productId: "royal-arabic-bisht",
    productName: "Royal Arabian Bisht / Syrian Qubba (Gold Zari)",
    productPrice: "₹3499"
  },
  {
    id: "reel-5",
    title: "Arabian's Mosaic Aroma Lamp & Bakhoor Burner ✨",
    views: "3.9K",
    likes: "1.5K",
    videoUrl: "/assets/reels/real_aroma_lamp.mp4",
    thumbnail: "/assets/reels/real_aroma_lamp.jpg",
    instagramUrl: "https://www.instagram.com/reel/Dcnx6dJKfJM/",
    category: "fragrance",
    categoryName: "Aroma & Bakhoor",
    productId: "arabian-bakhoor-burner-combo",
    productName: "Arabian Royal Bakhoor & Electric Mabkhara Set",
    productPrice: "₹1299"
  },
  {
    id: "reel-6",
    title: "Arabian Talbeena — Sunnat Ka Asli Taste & Health 🥣",
    views: "3.4K",
    likes: "1.1K",
    videoUrl: "/assets/reels/real_talbeena_sunnah.mp4",
    thumbnail: "/assets/reels/real_talbeena_sunnah.jpg",
    instagramUrl: "https://www.instagram.com/reel/DcvNdPIRqm6/",
    category: "health",
    categoryName: "Sunnah Talbeena",
    productId: "talbina-milk-mawa",
    productName: "Arabian's Talbeena Milk Mawa Flavour",
    productPrice: "₹349"
  }
];

export default function ReelsShowcase() {
  const { reels: storeReels, products, setSelectedProduct, activeReel, setActiveReel, settings } = useStore();
  const reels = (storeReels && storeReels.length > 0) ? storeReels : DEFAULT_REELS;
  const [modalMuted, setModalMuted] = useState(false);
  const [likedReels, setLikedReels] = useState(['reel-1', 'reel-2']);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [copiedShare, setCopiedShare] = useState(false);
  const modalVideoRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Sync index when active reel changes
  useEffect(() => {
    if (activeReel) {
      const idx = reels.findIndex(r => r.id === activeReel.id);
      if (idx !== -1) setCurrentReelIndex(idx);
    }
  }, [activeReel, reels]);

  const toggleLike = (id) => {
    setLikedReels(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleShopReelProduct = (productId) => {
    const prod = products.find(p => p.id === productId);
    if (prod) {
      setActiveReel(null);
      setSelectedProduct(prod);
    }
  };

  const nextReel = () => {
    if (reels.length === 0) return;
    const nextIdx = (currentReelIndex + 1) % reels.length;
    setCurrentReelIndex(nextIdx);
    setActiveReel(reels[nextIdx]);
  };

  const prevReel = () => {
    if (reels.length === 0) return;
    const prevIdx = (currentReelIndex - 1 + reels.length) % reels.length;
    setCurrentReelIndex(prevIdx);
    setActiveReel(reels[prevIdx]);
  };

  // Keyboard navigation for modal
  useEffect(() => {
    if (!activeReel) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextReel();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prevReel();
      if (e.key === 'Escape') setActiveReel(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeReel, currentReelIndex, reels]);

  const handleShareWhatsApp = (reel) => {
    const text = `Assalam o Alaikum! Check out this viral reel for ${reel.productName} on Arabians Shopping Zone: ${window.location.origin}/#/product/${reel.productId}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section id="reels-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="relative rounded-3xl bg-gradient-to-b from-[#021811] via-[#04281e] to-[#021811] text-white p-5 sm:p-8 lg:p-10 border border-amber-500/30 shadow-2xl overflow-hidden">
        
        {/* Subtle Islamic Motif Background */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]"></div>

        {/* Header with 43K+ Followers Social Proof */}
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-5 mb-6 sm:mb-8">
          <div>
            {/* Unified Social Proof Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white shadow-sm mb-3">
              <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>@arabians_shopping_zone</span>
              </div>
              <span className="text-white/30">•</span>
              <div className="flex items-center gap-1 text-rose-300 font-bold">
                <Flame className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                <span>20M+ Views</span>
              </div>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
              Watch Sunnah in Motion
            </h2>

            <p className="text-amber-300/95 font-sans font-semibold text-sm sm:text-base mt-1.5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Live Unboxings, Recipe Rituals & Royal Attire Fittings</span>
            </p>

            <p className="text-emerald-100/75 font-sans text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
              Watch authentic 5-minute Talbina preparation, aged Cambodian oud testing, and tailored Saudi jubbah details directly from our studio.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Desktop Scroll Arrows */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={scrollLeft}
                className="w-9 h-9 rounded-xl bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition active:scale-95"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={scrollRight}
                className="w-9 h-9 rounded-xl bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition active:scale-95"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <a
              href={settings.instagramUrl || "https://www.instagram.com/arabians_shopping_zone"}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 text-xs font-black hover:scale-105 transition shadow-gold whitespace-nowrap active:scale-95"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Join 43K+ on Instagram</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </a>
          </div>
        </div>

        {/* Reels Running Video Grid / Horizontal Swipe */}
        <div 
          ref={scrollContainerRef}
          className="relative z-10 flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar pb-3 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reels.map((reel) => (
            <ReelCard
              key={reel.id}
              reel={reel}
              onSelect={(r) => setActiveReel(r)}
            />
          ))}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* FULLSCREEN CINEMA REELS MODAL (INSTAGRAM REELS STYLE)                    */}
      {/* ========================================================================= */}
      {activeReel && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-2 sm:p-4 animate-fadeIn"
          onClick={() => setActiveReel(null)}
        >
          {/* Desktop Left/Right Navigation Arrows */}
          <button
            onClick={(e) => { e.stopPropagation(); prevReel(); }}
            className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center backdrop-blur-md border border-white/20 transition hover:scale-110 active:scale-95"
            title="Previous Reel (Left Arrow)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); nextReel(); }}
            className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white items-center justify-center backdrop-blur-md border border-white/20 transition hover:scale-110 active:scale-95"
            title="Next Reel (Right Arrow)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Reel Modal Container */}
          <div 
            className="relative w-full max-w-sm sm:max-w-[420px] aspect-[9/16] max-h-[92vh] bg-slate-950 rounded-3xl overflow-hidden border-2 border-amber-500/50 shadow-2xl flex flex-col justify-between"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Instagram Story Progress Bar */}
            <div className="absolute top-2 inset-x-3 z-30 flex items-center gap-1.5">
              {reels.map((_, idx) => (
                <div 
                  key={idx}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    idx === currentReelIndex 
                      ? 'bg-amber-400' 
                      : idx < currentReelIndex 
                      ? 'bg-white/70' 
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>

            {/* Background High Definition Video */}
            <video
              ref={modalVideoRef}
              src={activeReel.videoUrl}
              autoPlay
              loop
              playsInline
              muted={modalMuted}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Dark Scrim Gradients */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none"></div>

            {/* Top Profile & Sound Header */}
            <div className="relative z-20 p-4 pt-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-amber-300">
                  <div className="w-full h-full rounded-full overflow-hidden bg-black">
                    <img src="/assets/logo/logo_main.png" alt="Arabians Logo" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <span>arabians_shopping_zone</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  </div>
                  <div className="text-[10px] text-emerald-300 font-medium flex items-center gap-1">
                    <span>Official Instagram Reel</span>
                    <span>•</span>
                    <span className="text-amber-300 font-bold">{activeReel.views} Views</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Audio Sound Toggle */}
                <button
                  onClick={() => setModalMuted(!modalMuted)}
                  className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition shadow ${
                    !modalMuted ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300' : 'bg-black/60 text-white hover:bg-black/80'
                  }`}
                  aria-label="Toggle Sound"
                >
                  {!modalMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setActiveReel(null)}
                  className="w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition"
                  aria-label="Close Modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Action Icons Column (Like, WhatsApp, Counter) */}
            <div className="relative z-20 self-end p-4 pb-0 flex flex-col items-center gap-3">
              {/* Like Button */}
              <button
                onClick={() => toggleLike(activeReel.id)}
                className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md text-white flex flex-col items-center justify-center hover:scale-110 active:scale-90 transition shadow-lg"
              >
                <Heart 
                  className={`w-5 h-5 transition-colors ${
                    likedReels.includes(activeReel.id) 
                      ? 'fill-rose-500 text-rose-500 scale-110' 
                      : 'text-white'
                  }`} 
                />
              </button>
              <span className="text-[10px] text-white font-black drop-shadow">
                {activeReel.likes}
              </span>

              {/* WhatsApp Share Button */}
              <button
                onClick={() => handleShareWhatsApp(activeReel)}
                className="w-11 h-11 rounded-full bg-emerald-600/80 backdrop-blur-md text-white flex items-center justify-center hover:scale-110 active:scale-90 transition shadow-lg"
                title="Share Reel on WhatsApp"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <span className="text-[10px] text-white font-bold drop-shadow">Share</span>
            </div>

            {/* Bottom Product Card & Instant Purchase CTA */}
            <div className="relative z-20 p-4 pt-1 space-y-3">
              
              {/* Reel Caption */}
              <p className="text-xs sm:text-sm font-semibold text-white drop-shadow leading-snug">
                {activeReel.title}
              </p>

              {/* Featured Product Quick Buy Banner */}
              {activeReel.productId && (
                <div 
                  onClick={() => handleShopReelProduct(activeReel.productId)}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-black/75 backdrop-blur-md border border-amber-400/40 hover:border-amber-400 cursor-pointer transition shadow-lg group"
                >
                  <div className="truncate mr-2">
                    <div className="text-[11px] font-bold text-white truncate group-hover:text-amber-300 transition">
                      {activeReel.productName || 'Featured Collection'}
                    </div>
                    <div className="text-[10px] text-amber-400 font-extrabold">
                      {activeReel.productPrice}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-[10px] font-black flex items-center gap-1 shrink-0 shadow active:scale-95 transition"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Buy Now</span>
                  </button>
                </div>
              )}

              {/* Direct Instagram Action Button */}
              <a
                href={activeReel.instagramUrl || "https://www.instagram.com/arabians_shopping_zone/"}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#f09433] via-[#e6683c] via-[#dc2743] to-[#cc2366] text-white font-black text-xs hover:brightness-110 active:scale-95 transition shadow-xl flex items-center justify-center gap-2"
              >
                <InstagramIcon className="w-4 h-4 text-white" />
                <span>Watch on Instagram</span>
              </a>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}

