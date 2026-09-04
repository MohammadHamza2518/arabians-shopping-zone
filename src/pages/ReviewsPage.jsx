import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  CheckCircle2, 
  ThumbsUp, 
  MessageSquarePlus, 
  MapPin, 
  ShieldCheck, 
  X,
  Sparkles,
  Check,
  Filter,
  PackageCheck,
  Award,
  ChevronDown,
  Camera,
  User,
  Search,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Globe,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext';

export default function ReviewsPage() {
  const { reviews, products, refreshAll, showToast } = useStore();
  
  // UI & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // newest, helpful, rating
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Modal & Form States
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [helpfulVoted, setHelpfulVoted] = useState({});
  const [dpPreview, setDpPreview] = useState(null);

  const [form, setForm] = useState({
    customerName: '',
    location: '',
    rating: 5,
    productId: '',
    productName: "Arabian's Talbeena Vanilla Dry Fruits (500g)",
    orderId: '',
    comment: '',
    avatarUrl: ''
  });

  // Scroll to top on page load / page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const getAvatarGradient = (name = '') => {
    const colors = [
      'from-emerald-700 to-teal-900',
      'from-amber-700 to-amber-950',
      'from-slate-800 to-slate-950',
      'from-emerald-800 to-green-950',
      'from-amber-800 to-yellow-950',
      'from-cyan-800 to-slate-900'
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return colors[sum % colors.length];
  };

  const getInitials = (name = 'Customer') => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const handleDpUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("Profile image must be less than 5MB", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setDpPreview(reader.result);
      setForm(prev => ({ ...prev, avatarUrl: reader.result }));
      showToast("Profile DP selected!");
    };
    reader.readAsDataURL(file);
  };

  const handleHelpfulClick = async (reviewId) => {
    if (helpfulVoted[reviewId]) {
      showToast("You've already marked this review as helpful.");
      return;
    }
    setHelpfulVoted(prev => ({ ...prev, [reviewId]: true }));
    showToast("✓ Marked review as helpful! JazakAllah.");
    try {
      await fetch(`/api/reviews/${reviewId}/helpful`, { method: 'POST' });
      refreshAll();
    } catch {
      // optimistic update retained
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerName.trim() || !form.comment.trim()) {
      showToast("Please fill in your name and review.", "error");
      return;
    }
    if (form.comment.trim().length < 10) {
      showToast("Please write at least 10 characters in your review.", "error");
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        ...form,
        avatar: getInitials(form.customerName)
      };
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        showToast("🎉 JazakAllah! Your verified review is now published.");
        setIsWriteModalOpen(false);
        setDpPreview(null);
        setForm({
          customerName: '',
          location: '',
          rating: 5,
          productId: '',
          productName: "Arabian's Talbeena Vanilla Dry Fruits (500g)",
          orderId: '',
          comment: '',
          avatarUrl: ''
        });
        refreshAll();
        setCurrentPage(1);
      } else {
        showToast("Failed to submit review. Please try again.", "error");
      }
    } catch {
      showToast("Could not submit review. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Language count helpers
  const langCounts = useMemo(() => {
    const counts = { all: reviews.length, hinglish: 0, english: 0, hindi: 0, urdu: 0 };
    reviews.forEach(r => {
      const l = r.language || 'hinglish';
      if (counts[l] !== undefined) counts[l]++;
    });
    return counts;
  }, [reviews]);

  // Filtered and Sorted Reviews
  const filteredReviews = useMemo(() => {
    return reviews.filter(rev => {
      // Category filter
      if (selectedCategory === '5stars' && rev.rating !== 5) return false;
      if (selectedCategory === 'health' && rev.category !== 'health' && !rev.productName?.toLowerCase().includes('talb')) return false;
      if (selectedCategory === 'wearing' && rev.category !== 'wearing' && !rev.productName?.toLowerCase().includes('thobe')) return false;
      if (selectedCategory === 'fragrance' && rev.category !== 'fragrance' && !rev.productName?.toLowerCase().includes('oud') && !rev.productName?.toLowerCase().includes('bakhoor')) return false;
      if (selectedCategory === 'gifts' && rev.category !== 'gifts' && !rev.productName?.toLowerCase().includes('nikah') && !rev.productName?.toLowerCase().includes('ayat')) return false;

      // Language filter
      if (selectedLanguage !== 'all' && (rev.language || 'hinglish') !== selectedLanguage) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = rev.customerName?.toLowerCase().includes(q);
        const matchesLoc = rev.location?.toLowerCase().includes(q);
        const matchesComment = rev.comment?.toLowerCase().includes(q);
        const matchesProduct = rev.productName?.toLowerCase().includes(q);
        const matchesOrder = rev.orderId?.toLowerCase().includes(q);
        if (!matchesName && !matchesLoc && !matchesComment && !matchesProduct && !matchesOrder) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'helpful') return (b.helpful || 0) - (a.helpful || 0);
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      // default: newest first (reviews are already ordered newest to oldest in store)
      return 0;
    });
  }, [reviews, selectedCategory, selectedLanguage, searchQuery, sortBy]);

  // Pagination calculations
  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / itemsPerPage));
  const displayedReviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReviews.slice(start, start + itemsPerPage);
  }, [filteredReviews, currentPage, itemsPerPage]);

  const ratingDescriptions = {
    5: "⭐⭐⭐⭐⭐ 5/5 — Outstanding & Highly Recommended",
    4: "⭐⭐⭐⭐ 4/5 — Very Good & Happy with Quality",
    3: "⭐⭐⭐ 3/5 — Good & Met Expectations",
    2: "⭐⭐ 2/5 — Needs Improvement",
    1: "⭐ 1/5 — Not Satisfied"
  };

  const isFilterActive = selectedCategory !== 'all' || selectedLanguage !== 'all' || searchQuery.trim() !== '';

  return (
    <div className="min-h-screen bg-[#faf8f5] py-5 sm:py-10 w-full max-w-full overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 min-w-0">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between gap-2.5 mb-5 sm:mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#032219] transition bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>Back to Store</span>
          </Link>

          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-5 py-2 rounded-xl bg-[#032219] text-amber-300 font-bold text-xs hover:bg-[#073628] shadow-md transition active:scale-95 border border-amber-400/30 shrink-0"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Page Main Header */}
        <div className="mb-5 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 border border-emerald-300 text-[10.5px] sm:text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>100% Genuine Verified Buyer Community</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-black text-[#032219] leading-tight">
            Verified Customer Reviews
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base mt-1.5 max-w-3xl leading-relaxed">
            Authentic experiences from genuine buyers across Hyderabad, Lucknow, Delhi, Bengaluru, Mumbai, Srinagar, Bhopal, Kolkata and Pan-India.
          </p>
        </div>

        {/* ======================================================== */}
        {/* RATING ANALYTICS HUB (100% MOBILE-SAFE, ZERO OVERFLOW) */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-amber-900/15 shadow-sm mb-5 sm:mb-8 grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center w-full min-w-0 max-w-full overflow-hidden">
          
          {/* Col 1: Big Rating Score & Stars */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left md:border-r border-slate-200/80 md:pr-6 w-full min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-serif font-black text-[#032219]">4.9</span>
              <span className="text-slate-400 font-bold text-base sm:text-lg">/ 5</span>
            </div>
            <div className="flex items-center gap-1 text-amber-400 my-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 shrink-0" />
              ))}
            </div>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">
              Based on <span className="font-bold text-slate-900">{reviews.length}+ Verified Reviews</span>
            </p>
            <div className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>99.2% Recommend Rate</span>
            </div>
          </div>

          {/* Col 2: Star Distribution Bars */}
          <div className="md:col-span-4 space-y-1.5 text-xs text-slate-600 px-0 sm:px-1 md:px-4 md:border-r border-slate-200/80 w-full min-w-0">
            {[
              { star: '5 ★', pct: '89%', width: '89%', color: 'bg-amber-400' },
              { star: '4 ★', pct: '9%', width: '9%', color: 'bg-amber-400/80' },
              { star: '3 ★', pct: '2%', width: '2%', color: 'bg-amber-400/60' },
              { star: '2 ★', pct: '0%', width: '0%', color: 'bg-amber-400/40' },
              { star: '1 ★', pct: '0%', width: '0%', color: 'bg-amber-400/30' },
            ].map(b => (
              <div key={b.star} className="flex items-center gap-2 w-full min-w-0">
                <span className="w-7 text-right font-bold text-slate-700 shrink-0">{b.star}</span>
                <div className="flex-1 min-w-0 h-2 sm:h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full ${b.color} rounded-full transition-all`} style={{ width: b.width }}></div>
                </div>
                <span className="w-8 text-right font-medium text-slate-500 shrink-0">{b.pct}</span>
              </div>
            ))}
          </div>

          {/* Col 3: Trust Badges */}
          <div className="md:col-span-4 flex flex-col justify-center space-y-2 text-xs text-slate-700 md:pl-4 w-full min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="font-semibold text-[11.5px] sm:text-xs">OTP & Delivery Linked Verified Buyers</span>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <span className="font-semibold text-[11.5px] sm:text-xs">100% Genuine Customer Feedback</span>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Award className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-[11.5px] sm:text-xs">100% Halal Certified Sunnah Standard</span>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <PackageCheck className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-[11.5px] sm:text-xs">Pan-India BlueDart & Delhivery Doorstep</span>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* INTERACTIVE CONTROLS: SEARCH, CATEGORY, LANGUAGE, SORT */}
        {/* (STREAMLINED FOR MOBILE & DESKTOP — ZERO CRAMPED UI) */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 border border-amber-900/15 shadow-sm mb-5 sm:mb-8 space-y-3 sm:space-y-4 w-full min-w-0 max-w-full overflow-hidden">
          
          {/* Row 1: Search Bar (Full Width & Clean Mobile Placeholder) */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by keyword, city, product, or name..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                title="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Row 2: Sort and Active Reset Row */}
          <div className="flex items-center justify-between gap-2 pt-0.5 text-xs">
            <div className="flex items-center gap-1.5 min-w-0">
              {isFilterActive ? (
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedLanguage('all');
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition active:scale-95"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All Filters</span>
                </button>
              ) : (
                <span className="text-slate-500 font-medium text-[11.5px] truncate">
                  {filteredReviews.length} Verified Reviews Available
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[11px] font-bold text-slate-500 hidden xs:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-amber-500 focus:outline-none"
              >
                <option value="newest">⚡ Newest</option>
                <option value="helpful">👍 Most Helpful</option>
                <option value="rating">⭐ Top Rated</option>
              </select>
            </div>
          </div>

          {/* Row 3: Language Filter Chips (Smooth Touch Horizontal Scrolling) */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth -mx-3.5 px-3.5 sm:mx-0 sm:px-0 py-1 border-t border-slate-100 min-w-0">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-0.5">
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              Lang:
            </span>
            {[
              { id: 'all', label: `All (${langCounts.all})` },
              { id: 'hinglish', label: `Hinglish (${langCounts.hinglish})` },
              { id: 'english', label: `English (${langCounts.english})` },
              { id: 'hindi', label: `हिन्दी (${langCounts.hindi})` },
              { id: 'urdu', label: `اردو (${langCounts.urdu})` }
            ].map(lang => (
              <button
                key={lang.id}
                onClick={() => {
                  setSelectedLanguage(lang.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                  selectedLanguage === lang.id
                    ? 'bg-emerald-900 text-amber-300 shadow-sm ring-1 ring-amber-400/40'
                    : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-900'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Row 4: Category Filter Chips (Smooth Touch Horizontal Scrolling) */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth -mx-3.5 px-3.5 sm:mx-0 sm:px-0 py-1 border-t border-slate-100 min-w-0">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-0.5">
              <Filter className="w-3.5 h-3.5 text-amber-600" />
              Category:
            </span>
            {[
              { id: 'all', label: 'All' },
              { id: 'health', label: '🥣 Talbina' },
              { id: 'wearing', label: '👑 Men\'s Thobes' },
              { id: 'fragrance', label: '✨ Oud & Bakhoor' },
              { id: 'gifts', label: '🎁 Gifts & Nikah' },
              { id: '5stars', label: '⭐ 5 Stars' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap shrink-0 transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#032219] text-amber-300 shadow-sm ring-1 ring-amber-400/40'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-400/50 hover:bg-amber-50/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

        </div>

        {/* Results Counter Row */}
        <div className="flex items-center justify-between text-[11.5px] sm:text-xs text-slate-500 mb-3 sm:mb-4 px-1">
          <span>
            Showing <strong className="text-slate-800">{displayedReviews.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong> - <strong className="text-slate-800">{Math.min(currentPage * itemsPerPage, filteredReviews.length)}</strong> of <strong className="text-slate-800">{filteredReviews.length}</strong>
          </span>
          <span>Page {currentPage} of {totalPages}</span>
        </div>

        {/* ======================================================== */}
        {/* REVIEWS CARDS GRID (MOBILE-RESPONSIVE & POLISHED) */}
        {/* ======================================================== */}
        <div id="reviews-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full min-w-0">
          {displayedReviews.map((rev) => {
            const isUrdu = rev.language === 'urdu';
            return (
              <div 
                key={rev.id}
                className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-amber-900/15 hover:border-amber-400/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-3.5 w-full min-w-0 overflow-hidden"
              >
                <div className="space-y-3">
                  
                  {/* Header: Customer Avatar + Name + Badges + Date */}
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      {/* Customer DP / Royal Gradient Initials Avatar */}
                      {rev.avatarUrl ? (
                        <img 
                          src={rev.avatarUrl} 
                          alt={rev.customerName} 
                          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover shrink-0 border-2 border-amber-400 shadow-sm ring-2 ring-amber-400/20" 
                        />
                      ) : (
                        <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr ${getAvatarGradient(rev.customerName)} text-white font-serif font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-sm border border-white`}>
                          {rev.avatar || getInitials(rev.customerName)}
                        </div>
                      )}
                      
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight truncate">
                            {rev.customerName}
                          </h4>
                          {rev.verified && (
                            <span className="inline-flex items-center gap-0.5 text-[9.5px] sm:text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 sm:px-2 py-0.5 rounded-full font-bold">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>Verified Buyer</span>
                            </span>
                          )}
                          {rev.date?.includes('Today') && (
                            <span className="text-[9.5px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded-full font-extrabold animate-pulse">
                              ✨ New
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[10.5px] sm:text-[11px] text-slate-500 mt-0.5">
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                            <span className="truncate">{rev.location}</span>
                          </span>
                          {rev.orderId && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="font-mono text-[10px] text-slate-400 shrink-0">
                                #{rev.orderId}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium shrink-0 pt-0.5">
                      {rev.date}
                    </span>
                  </div>

                  {/* Rating Stars + Product Pill */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 shrink-0" />
                      ))}
                    </div>

                    <div className="text-[10.5px] sm:text-[11px] text-emerald-900 bg-emerald-50/90 px-2.5 py-1 rounded-xl font-semibold border border-emerald-200/80 inline-flex items-center gap-1.5 max-w-full">
                      <PackageCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span className="truncate">Purchased: <strong>{rev.productName}</strong></span>
                    </div>
                  </div>

                  {/* Genuine Customer Review Text (with RTL support for Urdu) */}
                  <p 
                    className={`text-xs sm:text-sm text-slate-700 leading-relaxed font-normal ${isUrdu ? 'text-right font-serif text-sm leading-loose' : ''}`}
                    dir={isUrdu ? 'rtl' : 'ltr'}
                  >
                    "{rev.comment}"
                  </p>

                </div>

                {/* Helpful Footer */}
                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="text-[11px]">Was this feedback helpful?</span>
                  <button
                    onClick={() => handleHelpfulClick(rev.id)}
                    disabled={helpfulVoted[rev.id]}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      helpfulVoted[rev.id]
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'hover:bg-slate-100 text-slate-700 active:scale-95'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${helpfulVoted[rev.id] ? 'fill-emerald-600 text-emerald-600' : 'text-slate-500'}`} />
                    <span>
                      {helpfulVoted[rev.id] ? 'Helpful (' + ((rev.helpful || 0) + 1) + ')' : 'Yes (' + (rev.helpful || 0) + ')'}
                    </span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredReviews.length === 0 && (
          <div className="text-center py-14 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-6">
            <p className="text-slate-800 font-bold text-base">No reviews found matching your search or filters.</p>
            <p className="text-slate-500 text-xs mt-1">Try clearing search terms or selecting "All" to view all customer feedback.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedLanguage('all');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-[#032219] text-amber-300 text-xs font-bold shadow-md hover:bg-[#073628] transition active:scale-95"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* ======================================================== */}
        {/* PAGINATION (MOBILE-SAFE & INTUITIVE) */}
        {/* ======================================================== */}
        {totalPages > 1 && (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm w-full min-w-0">
            
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            <div className="flex items-center gap-1 flex-wrap justify-center">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // On mobile show smaller subset
                if (
                  pageNum === 1 || 
                  pageNum === totalPages || 
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs font-bold transition ${
                        currentPage === pageNum
                          ? 'bg-[#032219] text-amber-300 shadow-md ring-1 ring-amber-400/40'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return <span key={pageNum} className="text-slate-400 px-0.5 text-xs">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-95"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>

          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* WRITE A REVIEW MODAL (MOBILE-OPTIMIZED WITH EASY DP PICKER) */}
      {/* ======================================================== */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-2xl border border-amber-500/30 my-auto max-h-[92vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setIsWriteModalOpen(false)}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div className="mb-4 pr-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Verified Buyer Community</span>
              </div>
              <h3 className="font-serif text-lg sm:text-2xl font-black text-[#032219]">
                Share Your Honest Experience
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Your genuine review helps brothers and sisters choose the best Sunnah products.
              </p>
            </div>

            {/* Review Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs sm:text-sm">
              
              {/* Interactive Star Rating Selector */}
              <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/80">
                <label className="block font-bold text-slate-800 mb-1">
                  Your Rating: <span className="text-amber-700 font-bold">{form.rating} out of 5</span>
                </label>
                <div className="flex items-center gap-2 my-1">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      type="button"
                      key={starVal}
                      onClick={() => setForm({ ...form, rating: starVal })}
                      className="focus:outline-none p-1 transition-transform hover:scale-125"
                    >
                      <Star 
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                          starVal <= form.rating
                            ? 'text-amber-400 fill-amber-400' 
                            : 'text-slate-300'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
                <div className="text-[11px] font-semibold text-amber-950 mt-1">
                  {ratingDescriptions[form.rating]}
                </div>
              </div>

              {/* Profile Picture / DP Upload Box */}
              <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-3 sm:p-4 flex items-center gap-3.5 sm:gap-4">
                <div className="relative shrink-0">
                  {dpPreview ? (
                    <img
                      src={dpPreview}
                      alt="DP Preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-md ring-2 ring-amber-400/30"
                    />
                  ) : (
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-tr ${getAvatarGradient(form.customerName || 'Customer')} text-white font-serif font-black text-lg flex items-center justify-center shadow-inner border-2 border-white`}>
                      {form.customerName ? getInitials(form.customerName) : <User className="w-7 h-7 text-white/80" />}
                    </div>
                  )}
                  <label 
                    htmlFor="dp-file-input-page"
                    className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#032219] text-amber-300 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-emerald-800 transition border-2 border-white"
                    title="Upload Profile Picture"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </label>
                  <input
                    id="dp-file-input-page"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleDpUpload}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-800">
                      Profile DP <span className="text-slate-400 text-xs font-normal">(Optional)</span>
                    </span>
                    {dpPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setDpPreview(null);
                          setForm(prev => ({ ...prev, avatarUrl: '' }));
                        }}
                        className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold underline"
                      >
                        Remove DP
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {dpPreview 
                      ? "✓ Profile DP selected! It will appear on your verified review card." 
                      : "Add your picture to make your review look authentic."}
                  </p>
                  {!dpPreview && (
                    <label
                      htmlFor="dp-file-input-page"
                      className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-white border border-slate-300 hover:border-amber-500 rounded-xl text-xs font-bold text-slate-700 cursor-pointer shadow-sm transition hover:text-[#032219]"
                    >
                      <Camera className="w-3.5 h-3.5 text-amber-600" />
                      <span>Choose DP Photo</span>
                    </label>
                  )}
                </div>
              </div>

              {/* Full Name & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Your Full Name: *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mohammed Farooq"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-800 mb-1">City & State: *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyderabad, Telangana"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Select Product Reviewed */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">Which product did you order? *</label>
                <select
                  value={form.productName}
                  onChange={(e) => {
                    const sel = e.target.value;
                    const match = products.find(p => p.name === sel);
                    setForm({ 
                      ...form, 
                      productName: sel,
                      productId: match ? match.id : ''
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-50 focus:bg-white"
                >
                  <option>Arabian's Talbeena Vanilla Dry Fruits (500g)</option>
                  <option>Arabian's Talbeena Milk Mawa Flavour</option>
                  <option>Arabian's Talbeena Kids Chocolate (1+ Yrs)</option>
                  <option>Arabian's Talbeena Baby Barley Cereal</option>
                  <option>Arabian's Talbeena With Dry Dates (Khajoor)</option>
                  <option>Al-Noor Minimalist Saudi Cut Pure White Thobe</option>
                  <option>Al-Noor Signature Embroidered Designer Thobe</option>
                  <option>Arabian Burberry Pattern Collar Luxury Thobe</option>
                  <option>Aged Royal Dehnul Oud (Cambodian Reserve)</option>
                  <option>Imperial White Oudh Non-Alcoholic Attar (12ml)</option>
                  <option>Arabian Royal Bakhoor & Electric Brass Mabkhara Set</option>
                  <option>Luxury Velvet Gold-Foil Nikah Nama Booklet</option>
                  <option>3D Royal Gold Acrylic Ayat-ul-Kursi Tugra</option>
                  <option>Arabians Royal Sidr Honey Mix with Dry Fruits</option>
                </select>
              </div>

              {/* Order ID (Optional for verified check) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-800">Order ID (Optional):</label>
                  <span className="text-[10px] text-emerald-700 font-bold">Unlocks Instant Verified Badge</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. ASZ-1089 (found on your WhatsApp slip)"
                  value={form.orderId}
                  onChange={(e) => setForm({ ...form, orderId: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-50 focus:bg-white font-mono"
                />
              </div>

              {/* Review Text */}
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Your Detailed Review: *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell us about the taste, fabric quality, fragrance longevity, or delivery speed..."
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-50 focus:bg-white"
                />
                <div className="text-[10px] text-slate-400 text-right mt-0.5">
                  {form.comment.length} characters (minimum 10 required)
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-2xl bg-[#032219] text-amber-300 font-extrabold text-sm hover:bg-[#063e2e] shadow-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 border border-amber-400/40"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-amber-300 border-t-transparent rounded-full animate-spin"></div>
                    <span>Verifying & Publishing Review...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Publish Verified Review</span>
                  </>
                )}
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
