import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Copy, Check, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function FlashSaleTimer() {
  const { showToast, settings } = useStore();
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 42, seconds: 19 });

  const flashSale = settings?.flashSale || {};

  useEffect(() => {
    // Calculates time remaining until end of the current day (midnight) in local time
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;

      if (diff <= 0) {
        return { hours: 23, minutes: 59, seconds: 59 };
      }

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // If store owner disabled flash sale from admin panel
  if (flashSale.enabled === false) {
    return null;
  }

  const badge = flashSale.badge || 'Special Sunnah Blessing Deal';
  const headline = flashSale.headline || 'Flat 10% Off On Orders Above ₹999 + Free Express Pan-India COD';
  const subtitle = flashSale.subtitle || 'Direct from our market studio. Sealed with tamper-proof halal guarantee.';
  const couponCode = flashSale.couponCode || 'ARABIAN10';

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCoupon(true);
    showToast(`Coupon ${couponCode} copied to clipboard! Enjoy your discount!`);
    setTimeout(() => setCopiedCoupon(false), 3000);
  };

  const formatUnit = (val) => String(val).padStart(2, '0');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 p-4 sm:p-6 shadow-xl border-2 border-amber-300">
        
        {/* Subtle royal pattern backdrop */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-5 text-center lg:text-left">
          
          {/* Left: Offer text & badge */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#032219] text-amber-300 flex items-center justify-center shrink-0 shadow-md">
              <Flame className="w-6 h-6 animate-pulse text-amber-400" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-slate-950 text-amber-300 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{badge}</span>
              </div>
              <h3 className="font-serif font-black text-base sm:text-xl leading-tight text-slate-950">
                {headline}
              </h3>
              <p className="text-xs text-slate-900 font-medium">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Right: Countdown clock & CTA */}
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            
            {/* Countdown timer blocks */}
            <div className="flex items-center gap-1.5 bg-[#032219]/90 backdrop-blur-sm p-1.5 rounded-2xl border border-amber-500/30 text-amber-300 shadow-inner">
              <div className="flex items-center gap-1 px-1.5 text-amber-400 text-[10px] font-bold">
                <Clock className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
                <span className="hidden sm:inline">ENDS IN:</span>
              </div>
              
              <div className="bg-black/50 px-2 py-1 rounded-xl text-center min-w-[32px]">
                <span className="font-mono font-black text-xs sm:text-sm text-amber-300">{formatUnit(timeLeft.hours)}</span>
                <span className="block text-[8px] text-amber-400/70 uppercase font-semibold">hrs</span>
              </div>
              <span className="text-amber-400 font-bold">:</span>
              
              <div className="bg-black/50 px-2 py-1 rounded-xl text-center min-w-[32px]">
                <span className="font-mono font-black text-xs sm:text-sm text-amber-300">{formatUnit(timeLeft.minutes)}</span>
                <span className="block text-[8px] text-amber-400/70 uppercase font-semibold">min</span>
              </div>
              <span className="text-amber-400 font-bold">:</span>
              
              <div className="bg-black/50 px-2 py-1 rounded-xl text-center min-w-[32px]">
                <span className="font-mono font-black text-xs sm:text-sm text-amber-300">{formatUnit(timeLeft.seconds)}</span>
                <span className="block text-[8px] text-amber-400/70 uppercase font-semibold">sec</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyCoupon}
                className="px-4 py-2.5 rounded-2xl bg-slate-950 text-amber-300 font-mono font-bold text-xs hover:bg-slate-900 transition flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                title="Click to copy coupon code"
              >
                {copiedCoupon ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
                <span>{copiedCoupon ? 'COPIED!' : couponCode}</span>
              </button>

              <Link
                to="/shop"
                className="px-4 py-2.5 rounded-2xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-50 transition shadow-md flex items-center gap-1 active:scale-95 whitespace-nowrap"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
