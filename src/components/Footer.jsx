import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  MapPin, 
  PhoneCall, 
  Phone,
  Mail,
  ShieldCheck, 
  Truck, 
  ArrowRight, 
  Award, 
  CheckCircle2, 
  Clock, 
  Send,
  HeartHandshake,
  Check,
  Building2,
  ExternalLink
} from 'lucide-react';
import InstagramIcon from './InstagramIcon';
import { useStore } from '../context/StoreContext';
import { getGeneralSupportWhatsAppUrl } from '../utils/whatsapp';

export default function Footer() {
  const location = useLocation();
  const isCleanPage = location.pathname === '/track' || location.pathname === '/checkout' || location.pathname === '/distributor';
  const { settings, categories, showToast, reviewStats } = useStore();
  const [vipPhone, setVipPhone] = useState('');
  const [vipSubmitted, setVipSubmitted] = useState(false);

  const handleVipSubmit = (e) => {
    e.preventDefault();
    if (vipPhone.trim().length >= 10) {
      setVipSubmitted(true);
      showToast('JazakAllah Khair! Welcome to the Arabians VIP Privilege Circle.');
      setTimeout(() => {
        setVipPhone('');
        setVipSubmitted(false);
      }, 4000);
    } else {
      showToast('Please enter a valid 10-digit phone or WhatsApp number.', 'error');
    }
  };

  return (
    <footer className="relative bg-[#02130e] text-white overflow-hidden pb-24 md:pb-12">
      
      {/* 0. Architectural Transition Curve (Ivory Page into Royal Emerald Footer) */}
      <div className="relative w-full overflow-hidden bg-[#faf8f5] select-none pointer-events-none leading-none">
        <svg 
          viewBox="0 0 1440 60" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-6 sm:h-10 block"
          preserveAspectRatio="none"
        >
          {/* Fill matching footer background */}
          <path 
            d="M0,0 C360,55 1080,55 1440,0 L1440,60 L0,60 Z" 
            fill="#02130e"
          />
          {/* Subtle golden trim line following the curve */}
          <path 
            d="M0,0 C360,55 1080,55 1440,0" 
            stroke="rgba(245, 158, 11, 0.45)" 
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Decorative Architectural Islamic Geometric Accent */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none bg-[radial-gradient(#d4af37_1.5px,transparent_1.5px)] [background-size:28px_28px]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-amber-500/5 blur-3xl pointer-events-none rounded-full"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-12">
        
        {/* 1. UNIQUE TOP SHOWCASE: The "Arabians Royal Circle" VIP & Dealership Pavilion (Hidden on dedicated pages like Track & Checkout) */}
        {!isCleanPage && (
          <div className="rounded-3xl bg-gradient-to-r from-[#04241b] via-[#083528] to-[#04241b] border border-amber-500/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: VIP Club */}
              <div className="lg:col-span-7 space-y-3 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>The Arabians Royal Circle</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-black text-white leading-tight">
                  Unlock Exclusive Sunnah Blessings & Early Batches
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100/80 max-w-lg mx-auto lg:mx-0 font-normal">
                  Join 12,000+ Indian Muslim families receiving Jummah blessing discounts, fresh stone-ground Talbina harvest alerts, and new Saudi Thobe arrivals.
                </p>

                {/* VIP WhatsApp / Phone Form */}
                <form onSubmit={handleVipSubmit} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-md mx-auto lg:mx-0">
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      placeholder="Enter WhatsApp or Phone No."
                      value={vipPhone}
                      onChange={(e) => setVipPhone(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#021812]/90 border border-amber-500/40 text-white placeholder-emerald-200/40 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs sm:text-sm hover:from-amber-400 hover:to-amber-500 shadow-gold transition flex items-center justify-center gap-2 shrink-0 active:scale-95"
                  >
                    {vipSubmitted ? <Check className="w-4 h-4 text-emerald-950" /> : <Send className="w-4 h-4 text-slate-950" />}
                    <span>{vipSubmitted ? 'Joined VIP!' : 'Join Privilege Circle'}</span>
                  </button>
                </form>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-[11px] text-emerald-300/70">
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-amber-400" /> Jummah Deals</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-amber-400" /> Lab-Test Reports</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-amber-400" /> No Spam Ever</span>
                </div>
              </div>

              {/* Right Column: Wholesale Dealership Banner Card */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#021812]/90 to-emerald-950/80 p-5 sm:p-6 rounded-2xl border border-amber-500/30 space-y-3 text-center lg:text-left shadow-inner">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-amber-400 text-xs font-bold">
                  <Building2 className="w-4 h-4" />
                  <span>Retailer & Distributor Opportunity</span>
                </div>
                <h4 className="font-serif text-lg font-bold text-white">
                  Want to Stock Arabians in Your City?
                </h4>
                <p className="text-xs text-emerald-100/70 leading-relaxed">
                  Enjoy <strong>up to 45% retailer margins</strong> on Sprouted Talbina, Saudi Jubbas & Aged Cambodian Dehnul Oud with full marketing standees and free pan-India dispatch.
                </p>
                <div className="pt-1">
                  <Link
                    to="/distributor"
                    className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-bold transition flex items-center justify-center gap-2"
                  >
                    <span>Apply for Dealership Program</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 2. UNIQUE EDITORIAL 4-BLOCK SECTION (No boring vertical list!) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pt-4">
          
          {/* Block 1: Brand Essence & Physical Store Crest (4 cols) */}
          <div className="lg:col-span-4 space-y-4 text-center sm:text-left">
            <Link 
              to="/" 
              onClick={() => {
                if (location.pathname === '/') {
                  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center gap-4 group"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-[#02130e] border-2 border-amber-400 shadow-gold shrink-0 flex items-center justify-center ring-2 ring-amber-400/60 ring-offset-2 ring-offset-[#02130e] group-hover:scale-105 transition-transform duration-300">
                <img src="/assets/logo/logo_main.png" alt="Arabians Logo" className="w-full h-full object-contain rounded-full" />
              </div>
              <div className="text-left space-y-0.5">
                <span className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-white block">
                  ARABIANS
                </span>
                <span className="text-xs sm:text-sm text-amber-400 font-bold uppercase tracking-widest block">
                  SHOPPING ZONE
                </span>
                <span className="text-[11px] text-emerald-300/80 block font-medium">
                  Royal Sunnah Lifestyle
                </span>
              </div>
            </Link>

            <p className="text-xs text-emerald-100/75 leading-relaxed font-normal">
              India's premier Islamic lifestyle house dedicated to authentic Sunnah nutrition, tailored royal Saudi attire, pure Assamese agarwood oils, and heirloom Nikah keepsakes.
            </p>

            {/* Direct Verification Chips */}
            <div className="space-y-2 pt-1">
              <a
                href={settings.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-800/60 text-emerald-200 text-xs hover:border-amber-500/40 hover:text-white transition group"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="text-left flex-1 truncate">
                  <div className="font-bold text-white text-[11px] group-hover:text-amber-300 transition">Verified Physical Store</div>
                  <div className="text-[10px] text-emerald-300/60 truncate">Locate on Google Maps</div>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-amber-400 shrink-0" />
              </a>

              <a
                href={getGeneralSupportWhatsAppUrl('VIP Customer Desk', settings.whatsapp)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-800/60 text-emerald-200 text-xs hover:border-amber-500/40 hover:text-white transition group"
                title="Chat on WhatsApp"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <PhoneCall className="w-3.5 h-3.5" />
                </div>
                <div className="text-left flex-1 truncate">
                  <div className="font-bold text-white text-[11px] group-hover:text-amber-300 transition">WhatsApp Only Desk</div>
                  <div className="text-[10px] text-emerald-300/80 font-mono">+91 72338 62626</div>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-amber-400 shrink-0" />
              </a>

              <a
                href="tel:+919236028318"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-800/60 text-emerald-200 text-xs hover:border-amber-500/40 hover:text-white transition group"
                title="Call Directly"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div className="text-left flex-1 truncate">
                  <div className="font-bold text-white text-[11px] group-hover:text-amber-300 transition">Calling Helpline</div>
                  <div className="text-[10px] text-emerald-300/80 font-mono">+91 92360 28318</div>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-amber-400 shrink-0" />
              </a>

              <a
                href="mailto:arabiansshoppingzone@gmail.com"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-800/60 text-emerald-200 text-xs hover:border-amber-500/40 hover:text-white transition group"
                title="Email Support"
              >
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div className="text-left flex-1 truncate">
                  <div className="font-bold text-white text-[11px] group-hover:text-amber-300 transition">Official Email</div>
                  <div className="text-[10px] text-emerald-300/80 truncate font-mono">arabiansshoppingzone@gmail.com</div>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-amber-400 shrink-0" />
              </a>
            </div>
          </div>

          {/* Block 2: Curated Collections (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center gap-2 border-b border-emerald-800/60 pb-2">
              <span className="font-mono text-xs text-amber-400 font-bold">01.</span>
              <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
                Royal Collections
              </h4>
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/shop?category=wearing" className="text-emerald-200/80 hover:text-amber-300 transition flex items-center justify-between py-1 border-b border-emerald-900/40 group">
                  <span>Saudi & Emirati Thobes</span>
                  <span className="text-[10px] text-amber-400/70 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </li>
              <li>
                <Link to="/product/talbina-vanilla" className="text-emerald-200/80 hover:text-amber-300 transition flex items-center justify-between py-1 border-b border-emerald-900/40 group">
                  <span>Sprouted Barley Talbina (5 Flavors)</span>
                  <span className="text-[10px] text-amber-400/70 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </li>
              <li>
                <Link to="/shop?category=fragrance" className="text-emerald-200/80 hover:text-amber-300 transition flex items-center justify-between py-1 border-b border-emerald-900/40 group">
                  <span>Dehnul Oud & Bakhoor Burners</span>
                  <span className="text-[10px] text-amber-400/70 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </li>
              <li>
                <Link to="/shop?category=decor" className="text-emerald-200/80 hover:text-amber-300 transition flex items-center justify-between py-1 border-b border-emerald-900/40 group">
                  <span>Islamic 3D Acrylic Decor</span>
                  <span className="text-[10px] text-amber-400/70 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </li>
              <li>
                <Link to="/shop?category=wedding" className="text-emerald-200/80 hover:text-amber-300 transition flex items-center justify-between py-1 border-b border-emerald-900/40 group">
                  <span>Nikah Nama Keepsakes & Quill Pens</span>
                  <span className="text-[10px] text-amber-400/70 group-hover:translate-x-1 transition-transform">→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Block 3: Customer Care & Ethics (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2 border-b border-emerald-800/60 pb-2">
              <span className="font-mono text-xs text-amber-400 font-bold">02.</span>
              <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
                Store Policies
              </h4>
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/shipping-policy" className="text-emerald-200/80 hover:text-amber-300 transition block py-1 border-b border-emerald-900/40">
                  Shipping & Delivery
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="text-emerald-200/80 hover:text-amber-300 transition block py-1 border-b border-emerald-900/40">
                  7-Day Return & Replacement
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-emerald-200/80 hover:text-amber-300 transition block py-1 border-b border-emerald-900/40">
                  Privacy & Data Protection
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-emerald-200/80 hover:text-amber-300 transition block py-1 border-b border-emerald-900/40">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-emerald-200/80 hover:text-amber-300 transition block py-1 border-b border-emerald-900/40">
                  About Our Heritage
                </Link>
              </li>
            </ul>
          </div>

          {/* Block 4: Customer Help & Track (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center gap-2 border-b border-emerald-800/60 pb-2">
              <span className="font-mono text-xs text-amber-400 font-bold">03.</span>
              <h4 className="font-serif text-sm font-bold text-white uppercase tracking-wider">
                Assistance & Support
              </h4>
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/track" className="text-emerald-200/80 hover:text-amber-300 transition flex items-center justify-between py-1 border-b border-emerald-900/40 group">
                  <span>Track Live Shipment</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">19,000+ Pincodes</span>
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-emerald-200/80 hover:text-amber-300 transition flex items-center justify-between py-1 border-b border-emerald-900/40 group">
                  <span>Verified Customer Reviews</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">{reviewStats?.total || 328}+ Real</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-emerald-200/80 hover:text-amber-300 transition block py-1 border-b border-emerald-900/40">
                  Customer Care Desk
                </Link>
              </li>
              <li>
                <Link to="/store" className="text-emerald-200/80 hover:text-amber-300 transition flex items-center justify-between py-1 border-b border-emerald-900/40 group">
                  <span>Visit Our Shop</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">Google Maps</span>
                </Link>
              </li>
              <li>
                <Link to="/distributor" className="text-emerald-200/80 hover:text-amber-300 transition block py-1 border-b border-emerald-900/40">
                  B2B Wholesale Portal
                </Link>
              </li>

              <li>
                <a 
                  href={settings.instagramUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-emerald-200/80 hover:text-amber-300 transition flex items-center gap-1.5 py-1"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>Follow @arabians_shopping_zone</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* 3. UNIQUE PAYMENT & TRUST BADGES BAR */}
        <div className="pt-6 border-t border-emerald-900/60 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex flex-wrap items-center gap-3 text-emerald-300/70 text-[11px]">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-800/40">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>100% Halal Verified</span>
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-800/40">
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>Pan-India Cash on Delivery</span>
            </span>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-800/40">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Lab Certified Sprouted Barley</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-emerald-300/60">
            <span>Accepted Payments:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800/50 text-white font-mono">UPI</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800/50 text-white font-mono">GPay</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800/50 text-white font-mono">PhonePe</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800/50 text-white font-mono">COD</span>
          </div>
        </div>

        {/* 4. LUXURY WATERMARK & BOTTOM COPYRIGHT */}
        <div className="pt-8 border-t border-emerald-900/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 text-center md:text-left">
          <p>© {new Date().getFullYear()} Arabians Shopping Zone. All rights reserved.</p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
            <Link to="/privacy-policy" className="hover:text-amber-300 transition">Privacy Policy</Link>
            <span>•</span>
            <Link to="/return-policy" className="hover:text-amber-300 transition">Refund Policy</Link>
            <span>•</span>
            <Link to="/shipping-policy" className="hover:text-amber-300 transition">Shipping Policy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-amber-300 transition">Terms of Service</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-amber-300 transition">Contact Desk</Link>
          </div>
        </div>

        {/* Subtle Architectural Luxury Watermark Across the Base */}
        <div className="text-center pt-2 select-none pointer-events-none opacity-[0.04]">
          <span className="font-serif text-5xl sm:text-7xl lg:text-9xl font-black tracking-[0.25em] text-white uppercase">
            ARABIANS
          </span>
        </div>

      </div>
    </footer>
  );
}
