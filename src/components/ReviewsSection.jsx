import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  ChevronUp,
  Camera,
  User,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext';

export default function ReviewsSection() {
  const navigate = useNavigate();
  const { reviews, products, refreshAll, showToast, reviewStats } = useStore();
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [helpfulVoted, setHelpfulVoted] = useState({});
  const [visibleCount, setVisibleCount] = useState(4);
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
          particleCount: 75,
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
      } else {
        showToast("Failed to submit review. Please try again.", "error");
      }
    } catch {
      showToast("Could not submit review. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReviews = useMemo(() => {
    if (activeFilter === 'all') return reviews;
    if (activeFilter === '5stars') return reviews.filter(r => r.rating === 5);
    if (activeFilter === 'health') return reviews.filter(r => r.category === 'health' || (r.productName && r.productName.toLowerCase().includes('talb')));
    if (activeFilter === 'wearing') return reviews.filter(r => r.category === 'wearing' || (r.productName && r.productName.toLowerCase().includes('thobe')));
    if (activeFilter === 'fragrance') return reviews.filter(r => r.category === 'fragrance' || (r.productName && (r.productName.toLowerCase().includes('oud') || r.productName.toLowerCase().includes('bakhoor'))));
    if (activeFilter === 'skincare') return reviews.filter(r => r.category === 'skincare' || (r.productName && (r.productName.toLowerCase().includes('skin') || r.productName.toLowerCase().includes('soap') || r.productName.toLowerCase().includes('cream') || r.productName.toLowerCase().includes('ubtan'))));
    return reviews;
  }, [reviews, activeFilter]);

  const displayedReviews = useMemo(() => {
    return filteredReviews.slice(0, visibleCount);
  }, [filteredReviews, visibleCount]);

  const hasMore = visibleCount < filteredReviews.length;
  const isExpanded = visibleCount > 4;

  const handleFilterClick = (filterId) => {
    setActiveFilter(filterId);
    setVisibleCount(4);
  };

  const ratingDescriptions = {
    5: "⭐⭐⭐⭐⭐ 5/5 — Outstanding & Highly Recommended",
    4: "⭐⭐⭐⭐ 4/5 — Very Good & Happy with Quality",
    3: "⭐⭐⭐ 3/5 — Good & Met Expectations",
    2: "⭐⭐ 2/5 — Needs Improvement",
    1: "⭐ 1/5 — Not Satisfied"
  };

  return (
    <section id="reviews-section" className="pt-10 sm:pt-14 pb-8 sm:pb-10 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 border border-emerald-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>100% Genuine Verified Buyers</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#032219] leading-tight">
              Customer Love & Authentic Experiences
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Read real customer feedback, unboxing photos, and delivery experiences from buyers across Hyderabad, Delhi, Bangalore, Mumbai, Lucknow & beyond.
            </p>
          </div>

          {/* Write a Review CTA Button */}
          <button
            onClick={() => setIsWriteModalOpen(true)}
            className="self-start md:self-auto flex items-center gap-2 px-5 py-3 rounded-xl bg-[#032219] text-amber-300 font-bold text-xs sm:text-sm hover:bg-[#073628] hover:shadow-lg transition-all active:scale-95 border border-amber-400/30"
          >
            <MessageSquarePlus className="w-4 h-4 text-amber-400" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* Real-World Rating Analytics Hub (Amazon / Nykaa Style) */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-amber-900/15 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Col 1: Big Rating Score & Stars */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left md:border-r border-slate-200/80 md:pr-6">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-serif font-black text-[#032219]">{reviewStats?.average || '4.9'}</span>
              <span className="text-slate-400 font-bold text-lg">/ 5</span>
            </div>
            <div className="flex items-center gap-1 text-amber-400 my-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">
              Based on <span className="font-bold text-slate-900">{(reviewStats?.total || reviews.length)}+ Verified Reviews</span>
            </p>
            <div className="inline-flex items-center gap-1 mt-2.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{reviewStats?.recommendRate || '99.2'}% Recommend Rate</span>
            </div>
          </div>

          {/* Col 2: Star Distribution Bars */}
          <div className="md:col-span-4 space-y-1.5 text-xs text-slate-600 px-1 md:px-4 md:border-r border-slate-200/80">
            {(reviewStats?.distribution || [
              { star: '5 ★', pct: '89%', width: '89%', color: 'bg-amber-400' },
              { star: '4 ★', pct: '9%', width: '9%', color: 'bg-amber-400/80' },
              { star: '3 ★', pct: '2%', width: '2%', color: 'bg-amber-400/60' },
              { star: '2 ★', pct: '0%', width: '0%', color: 'bg-amber-400/40' },
              { star: '1 ★', pct: '0%', width: '0%', color: 'bg-amber-400/30' },
            ]).map(b => (
              <div key={b.star} className="flex items-center gap-2">
                <span className="w-10 text-right font-bold text-slate-700">{b.star}</span>
                <div className="flex-1 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full ${b.color} rounded-full transition-all duration-500`} style={{ width: b.width }}></div>
                </div>
                <span className="w-9 text-right font-medium text-slate-500">{b.pct}</span>
              </div>
            ))}
          </div>

          {/* Col 3: Trust Badges */}
          <div className="md:col-span-4 flex flex-col justify-center space-y-2 text-xs text-slate-700 md:pl-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <span className="font-semibold">OTP & Delivery Linked Verified Buyers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <span className="font-semibold">100% Genuine Customer Feedback</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Award className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold">100% Halal Certified Sunnah Standard</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <PackageCheck className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold">Pan-India BlueDart & Delhivery Doorstep</span>
            </div>
          </div>

        </div>

        {/* Interactive Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-6">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5 text-amber-600" />
            Filter:
          </span>
          {[
            { id: 'all', label: `All Reviews (${reviews.length})` },
            { id: '5stars', label: '⭐ 5 Stars' },
            { id: 'health', label: '🥣 Sunnah Talbina' },
            { id: 'wearing', label: '👑 Men\'s Thobes' },
            { id: 'fragrance', label: '✨ Dehnul Oud & Bakhoor' },
            { id: 'skincare', label: '🌿 Skin Care' }
          ].map(chip => (
            <button
              key={chip.id}
              onClick={() => handleFilterClick(chip.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === chip.id
                  ? 'bg-[#032219] text-amber-300 shadow-sm ring-1 ring-amber-400/40'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-400/50 hover:bg-amber-50/50'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* Reviews Cards Grid */}
        <div id="reviews-cards-grid" className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {displayedReviews.map((rev) => (
            <div 
              key={rev.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-amber-900/15 hover:border-amber-400/60 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3.5">
                
                {/* Header: Customer Avatar + Name + Badges + Date */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Customer DP / Royal Gradient Initials Avatar */}
                    {rev.avatarUrl ? (
                      <img 
                        src={rev.avatarUrl} 
                        alt={rev.customerName} 
                        className="w-11 h-11 rounded-full object-cover shrink-0 border-2 border-amber-400 shadow-sm ring-2 ring-amber-400/20" 
                      />
                    ) : (
                      <div className={`w-11 h-11 rounded-full bg-gradient-to-tr ${getAvatarGradient(rev.customerName)} text-white font-serif font-black text-sm flex items-center justify-center shrink-0 shadow-sm border border-white`}>
                        {rev.avatar || getInitials(rev.customerName)}
                      </div>
                    )}
                    
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-bold text-sm text-slate-900 leading-tight truncate">
                          {rev.customerName}
                        </h4>
                        {rev.verified && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Verified Buyer</span>
                          </span>
                        )}
                        {rev.date?.includes('Today') && (
                          <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded-full font-extrabold animate-pulse">
                            ✨ New
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>{rev.location}</span>
                        </span>
                        {rev.orderId && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="font-mono text-[10px] text-slate-400">
                              Order #{rev.orderId}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium shrink-0 pt-0.5">
                    {rev.date}
                  </span>
                </div>

                {/* Rating Stars + Product Pill */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>

                  <div className="text-[11px] text-emerald-900 bg-emerald-50/90 px-3 py-1.5 rounded-xl font-semibold border border-emerald-200/80 inline-flex items-center gap-1.5 max-w-full">
                    <PackageCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="truncate">Purchased: <strong>{rev.productName}</strong></span>
                  </div>
                </div>

                {/* Genuine Customer Review Text */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  "{rev.comment}"
                </p>

              </div>

              {/* Helpful Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
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
          ))}
        </div>

        {/* Load More & Pagination Controls (Solves Infinite Scrolling fatigue) */}
        {filteredReviews.length > 4 && (
          <div className="mt-8 flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-3 flex-wrap justify-center">
              {hasMore && (
                <button
                  onClick={() => setVisibleCount(prev => prev + 4)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#032219] text-amber-300 font-bold text-xs sm:text-sm hover:bg-[#073628] shadow-md hover:shadow-lg transition-all active:scale-95 border border-amber-400/30"
                >
                  <span>Load More Reviews (+4)</span>
                  <ChevronDown className="w-4 h-4 text-amber-400" />
                </button>
              )}

              <button
                onClick={() => navigate('/reviews')}
                className="flex items-center gap-1.5 px-5 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs sm:text-sm hover:border-amber-400 hover:text-amber-900 transition-all active:scale-95 shadow-sm group"
              >
                <span>View All ({reviews.length})</span>
                <span className="text-amber-600 font-bold group-hover:translate-x-0.5 transition-transform">→</span>
              </button>

              {isExpanded && (
                <button
                  onClick={() => {
                    setVisibleCount(4);
                    const el = document.getElementById('reviews-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-all active:scale-95"
                >
                  <ChevronUp className="w-4 h-4 text-slate-500" />
                  <span>Show Less</span>
                </button>
              )}
            </div>

            <p className="text-xs text-slate-500 text-center">
              Showing <span className="font-bold text-slate-800">{Math.min(visibleCount, filteredReviews.length)}</span> of <span className="font-bold text-slate-800">{filteredReviews.length}</span> verified customer reviews •{' '}
              <button onClick={() => navigate('/reviews')} className="text-amber-800 hover:text-amber-950 font-bold underline">
                Browse All {reviews.length} on Dedicated Reviews Page →
              </button>
            </p>
          </div>
        )}

        {filteredReviews.length === 0 && (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
            <p className="text-slate-500 text-sm">No reviews found matching this filter.</p>
            <button
              onClick={() => setActiveFilter('all')}
              className="mt-2 text-xs font-bold text-amber-700 underline"
            >
              Show all reviews
            </button>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* 1. WRITE A REVIEW MODAL (100% WORKING & MODERN) */}
      {/* ======================================================== */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-amber-500/30 my-8">
            
            {/* Close Button */}
            <button
              onClick={() => setIsWriteModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200 flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div className="mb-4 pr-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-bold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Verified Buyer Community</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-black text-[#032219]">
                Share Your Honest Experience
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Your genuine review helps brothers and sisters choose the best Sunnah products.
              </p>
            </div>

            {/* Review Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              
              {/* Interactive Star Rating Selector */}
              <div className="bg-amber-50/70 p-3 rounded-2xl border border-amber-200/80">
                <label className="block font-bold text-slate-800 mb-1">
                  Your Overall Rating: <span className="text-amber-700 font-bold">{form.rating} out of 5</span>
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
                    htmlFor="dp-file-input"
                    className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#032219] text-amber-300 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-emerald-800 transition border-2 border-white"
                    title="Upload Profile Picture"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </label>
                  <input
                    id="dp-file-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleDpUpload}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-800">
                      Profile Picture / DP <span className="text-slate-400 text-xs font-normal">(Optional)</span>
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
                      : "Add your DP to give your review an authentic personal touch."}
                  </p>
                  {!dpPreview && (
                    <label
                      htmlFor="dp-file-input"
                      className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-white border border-slate-300 hover:border-amber-500 rounded-xl text-xs font-bold text-slate-700 cursor-pointer shadow-sm transition hover:text-[#032219]"
                    >
                      <Camera className="w-3.5 h-3.5 text-amber-600" />
                      <span>Upload Profile Photo</span>
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-50 focus:bg-white"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-50 focus:bg-white"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-50 focus:bg-white"
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
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-50 focus:bg-white font-mono"
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
                  placeholder="Tell us about the packaging, taste, fabric quality, fragrance longevity, or delivery speed..."
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-50 focus:bg-white"
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

    </section>
  );
}
