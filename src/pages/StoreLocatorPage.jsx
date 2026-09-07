import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import {
  MapPin, Navigation, Clock, Phone, MessageSquare,
  Car, ExternalLink, Star, ShieldCheck, Sparkles,
  Building2, ChevronRight, Copy, CheckCircle2, ArrowRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getGeneralSupportWhatsAppUrl } from '../utils/whatsapp';

const STORE_HOURS = [
  { day: 'Saturday to Thursday', time: '10:00 AM to 9:00 PM', open: true },
  { day: 'Friday', time: 'Closed for Jummah (Opens 3 PM)', open: false },
];

const CATEGORIES_AT_STORE = [
  { emoji: '\uD83D\uDC58', name: "Men's Thobes & Attire", count: '20+ Styles' },
  { emoji: '\uD83C\uDF38', name: 'Arabic Fragrances & Oud', count: '30+ Attars' },
  { emoji: '\uD83C\uDF6F', name: 'Talbina & Sunnah Foods', count: '5 Variants' },
  { emoji: '\uD83D\uDD4C', name: 'Islamic Home Decor', count: '10+ Designs' },
  { emoji: '\uD83D\uDC8D', name: 'Muslim Wedding Products', count: 'Full Range' },
];

export default function StoreLocatorPage() {
  const { settings, reviewStats } = useStore();
  const [copied, setCopied] = useState(false);

  const storeHighlights = [
    { icon: ShieldCheck, label: '100% Genuine', desc: 'Only certified halal & authentic products', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { icon: Star, label: `${reviewStats?.average || '4.9'} Star Rated`, desc: `${reviewStats?.total || 328}+ verified in-store & online reviews`, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
    { icon: Sparkles, label: 'Live Try & Buy', desc: 'Touch, feel & choose from studio stock', color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
    { icon: Car, label: 'Easy Parking', desc: 'Market area with open street-side parking', color: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-200' },
  ];

  const GOOGLE_MAPS_SHARE = 'https://share.google/PEgVk9ck06u9M8PA9';
  const GOOGLE_MAPS_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3576.888!2d75.7873!3d26.9124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db49b9a85f6db%3A0x93ac85f07b2d4dae!2sArabians%20Shopping%20Zone!5e0!3m2!1sen!2sin!4v1699000000001!5m2!1sen!2sin';

  const handleCopyAddress = () => {
    navigator.clipboard.writeText('Arabians Shopping Zone, Chauraha, 88/485, Dalel Purwa, Opposite Shifa Eye Hospital, Becon Ganj, Mulganj, Kanpur, Uttar Pradesh 208001').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] animate-fadeIn">
      <SEO 
        title="Visit Our Physical Store | Arabians Shopping Zone Kanpur"
        description="Experience the finest Sunnah lifestyle store in person. Try authentic Saudi Thobes, sample aged pure Dehnul Oud & Attars, and purchase freshly prepared Sprouted Talbina at our flagship boutique in Kanpur (Opposite Shifa Eye Hospital)."
        keywords="Arabians Shopping Zone store, islamic shop kanpur, sunnah lifestyle store kanpur, buy thobe near me, attar shop near me, talbina store kanpur, mulganj becon ganj"
        canonical="https://arabiansshoppingzone.shop/store"
        schema={{
          "@context": "https://schema.org",
          "@type": "Store",
          "name": "Arabians Shopping Zone Boutique",
          "description": "Premium Islamic Lifestyle, Authentic Talbina, Saudi Thobes & Pure Dehnul Oud",
          "url": "https://arabiansshoppingzone.shop/store",
          "telephone": "+917233862626",
          "priceRange": "₹₹",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Chauraha, 88/485, Dalel Purwa, Opposite Shifa eye hospital, Becon Ganj, Mulganj",
            "addressLocality": "Kanpur",
            "addressRegion": "Uttar Pradesh",
            "postalCode": "208001",
            "addressCountry": "IN"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 26.9124,
            "longitude": 75.7873
          },
          "openingHoursSpecification": [
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
              "opens": "10:00",
              "closes": "21:00"
            },
            {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": "Friday",
              "opens": "15:00",
              "closes": "21:00"
            }
          ]
        }}
      />

      {/* HERO BANNER */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#021812] via-[#032219] to-[#053527]">
        <div className="absolute inset-0 opacity-5 pointer-events-none select-none overflow-hidden">
          <div className="absolute font-serif text-amber-300 leading-none -right-20 -top-10 select-none" style={{fontSize:'18rem'}}>
            الع
          </div>
        </div>
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 text-white">
          <nav className="hidden sm:flex items-center gap-2 text-xs text-emerald-300/70 mb-8">
            <Link to="/" className="hover:text-amber-300 transition">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-amber-300 font-semibold">Visit Our Shop</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Physical Store - Rajasthan, India
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl font-extrabold leading-tight">
                Come Visit Us
                <span className="block text-amber-400">In Person</span>
              </h1>

              <p className="text-emerald-100/80 text-sm sm:text-base leading-relaxed max-w-md">
                Experience authentic Arabian lifestyle products first-hand. Touch, feel and choose from our full studio collection. Our experts are here to guide you.
              </p>

              <div className="flex flex-wrap gap-3">
                <a
                  href={GOOGLE_MAPS_SHARE}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 text-slate-950 font-bold text-sm hover:bg-amber-400 transition-all shadow-lg active:scale-95"
                >
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </a>
                <a
                  href={getGeneralSupportWhatsAppUrl('I want to visit the store, please share the exact location', settings.whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-all active:scale-95"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  WhatsApp for Location
                </a>
              </div>
            </div>

            {/* Store Hours on hero */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Clock className="w-5 h-5" />
                Store Opening Hours
              </div>
              <div className="space-y-3">
                {STORE_HOURS.map((item) => (
                  <div key={item.day} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-xs font-semibold text-emerald-100">{item.day}</div>
                    <div className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${item.open ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/15 text-rose-300'}`}>
                      {item.time}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-1 flex items-center gap-2 text-emerald-300/70 text-[11px]">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                Open today if it is not Friday
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12">

        {/* Map + Store Info */}
        <div className="grid lg:grid-cols-5 gap-6">

          {/* Map - 3 cols */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl overflow-hidden border border-amber-900/15 shadow-2xl bg-white">
              <div className="px-5 py-4 bg-[#032219] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">Arabians Shopping Zone</div>
                    <div className="text-emerald-300/60 text-[10px]">Verified Google Business</div>
                  </div>
                </div>
                <a
                  href={GOOGLE_MAPS_SHARE}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-amber-300 text-xs font-bold hover:text-amber-200 transition"
                >
                  Open in Maps
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="relative" style={{paddingBottom:'62%'}}>
                <iframe
                  title="Arabians Shopping Zone Location"
                  src={GOOGLE_MAPS_EMBED}
                  className="absolute inset-0 w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center gap-3">
                <a
                  href={GOOGLE_MAPS_SHARE}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#032219] text-amber-300 font-bold text-xs hover:bg-[#063e2e] transition shadow"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Get Directions on Google Maps
                </a>
                <button
                  onClick={handleCopyAddress}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                >
                  {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  {copied ? 'Copied!' : 'Copy Address'}
                </button>
              </div>
            </div>
          </div>

          {/* Store Info - 2 cols */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#032219] font-bold text-sm">
                <Building2 className="w-5 h-5 text-amber-600" />
                Store Address
              </div>
              <div className="space-y-2.5">
                <div className="text-base font-extrabold text-slate-900 font-serif">Arabians Shopping Zone</div>
                <div className="text-xs text-slate-700 leading-relaxed font-medium">
                  Chauraha, 88/485, Dalel Purwa, Opposite Shifa Eye Hospital, Becon Ganj, Mulganj, Kanpur, Uttar Pradesh — 208001
                </div>
                <a
                  href={GOOGLE_MAPS_SHARE}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 hover:bg-amber-200 px-3 py-1 rounded-full transition"
                >
                  <MapPin className="w-3 h-3" />
                  View on Google Maps
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="bg-[#032219] rounded-3xl p-5 space-y-3">
              <div className="text-amber-300 font-bold text-sm flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Call Before You Visit
              </div>
              <a
                href="tel:+917233862626"
                className="flex items-center justify-between p-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 group transition"
              >
                <div>
                  <div className="text-white font-bold text-sm">+91 72338 62626</div>
                  <div className="text-emerald-300/60 text-[10px]">Main Helpline - 10AM to 9PM</div>
                </div>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href={getGeneralSupportWhatsAppUrl('I am planning to visit your store soon', settings.whatsapp)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/20 group transition"
              >
                <div>
                  <div className="text-white font-bold text-sm">+91 72338 62626</div>
                  <div className="text-emerald-300/70 text-[10px]">WhatsApp Only Desk</div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-4">
              <div className="text-amber-900 font-bold text-xs mb-1.5">Pro Tip for Walk-in Visitors</div>
              <p className="text-amber-800 text-xs leading-relaxed">
                WhatsApp us before visiting so we can have your selected products ready and give you a smooth VIP walk-in experience!
              </p>
            </div>
          </div>
        </div>

        {/* Store Highlights */}
        <div>
          <div className="text-center mb-6 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Why Visit Us In Person?
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#032219]">
              The Ultimate In-Store Experience
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {storeHighlights.map(({ icon: Icon, label, desc, color, bg, border }) => (
              <div key={label} className={`${bg} ${border} border rounded-3xl p-5 text-center space-y-2.5 hover:shadow-md transition`}>
                <div className={`w-12 h-12 rounded-2xl ${bg} border ${border} flex items-center justify-center mx-auto shadow-sm`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <div className="font-bold text-slate-900 text-sm">{label}</div>
                <div className="text-slate-600 text-[11px] leading-relaxed">{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* What is available */}
        <div className="bg-gradient-to-br from-[#021812] to-[#032219] rounded-3xl p-8 sm:p-10">
          <div className="text-center mb-8 space-y-2">
            <div className="text-amber-400 font-bold text-xs uppercase tracking-wider">Available In-Store</div>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
              Full Collection At Our Shop
            </h2>
            <p className="text-emerald-100/60 text-xs">
              Every product category available for live browsing and same-day purchase
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {CATEGORIES_AT_STORE.map(({ emoji, name, count }) => (
              <div key={name} className="flex items-center gap-3 p-4 rounded-2xl bg-white/8 border border-white/10 hover:bg-white/12 transition group">
                <span className="text-2xl shrink-0">{emoji}</span>
                <div className="flex-1">
                  <div className="text-white font-bold text-sm">{name}</div>
                  <div className="text-emerald-300/60 text-[10px]">{count} in stock</div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-400/40 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
              </div>
            ))}
            <Link
              to="/shop"
              className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 transition group"
            >
              <span className="text-2xl shrink-0">🛍️</span>
              <div className="flex-1">
                <div className="text-amber-300 font-bold text-sm">Browse Online Catalog</div>
                <div className="text-amber-400/60 text-[10px]">Order from home</div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition" />
            </Link>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5">
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-serif font-extrabold text-xl text-slate-900">Ready to Visit?</h3>
            <p className="text-slate-600 text-xs mt-1 max-w-sm">
              Tap Get Directions and Google Maps will guide you straight to our store entrance.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <a
              href={GOOGLE_MAPS_SHARE}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#032219] text-amber-300 font-bold text-sm hover:bg-[#063e2e] transition shadow-lg"
            >
              <Navigation className="w-4 h-4" />
              Get Directions
            </a>
            <a
              href={getGeneralSupportWhatsAppUrl('I want to visit the Arabians Shopping Zone store', settings.whatsapp)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-500 transition shadow-lg"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp Us
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
