import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Search, 
  Menu, 
  X, 
  Truck, 
  MapPin, 
  PhoneCall, 
  Phone,
  Sparkles, 
  UserCheck,
  Gift,
  Star
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import InstagramIcon from './InstagramIcon';
import { getGeneralSupportWhatsAppUrl } from '../utils/whatsapp';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { 
    settings, 
    cartCount, 
    categories,
    products,
    reviewStats 
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');

  const ANNOUNCEMENTS = [
    { text: "🌙 Free Delivery on ₹999+", highlight: "Pan-India COD" },
    { text: "✨ Flat 10% Off Orders", highlight: "Code: ARABIAN10" },
    { text: "🛡️ 100% Halal Certified", highlight: "Verified Quality" }
  ];

  const [announcementIndex, setAnnouncementIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 3600);
    return () => clearInterval(timer);
  }, [ANNOUNCEMENTS.length]);

  const searchResults = headerSearch.trim().length >= 2
    ? products.filter(p => 
        p.name.toLowerCase().includes(headerSearch.toLowerCase()) ||
        p.category.toLowerCase().includes(headerSearch.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(headerSearch.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      navigate(`/shop?search=${encodeURIComponent(headerSearch.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-amber-900/10 transition-all">
      
      {/* Top Announcement Bar: Responsive & Centered on Mobile */}
      <div className="bg-[#032219] text-white font-medium text-[11px] py-2 px-3 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="w-full md:w-auto flex items-center justify-center md:justify-start gap-2 text-center">
            <span className="hidden sm:inline-block bg-amber-500 text-slate-950 text-[9px] uppercase font-black px-2 py-0.5 rounded-full tracking-wider shrink-0">
              100% Halal
            </span>
            <div className="text-emerald-100 text-[11px] sm:text-xs transition-all duration-300">
              <span>{ANNOUNCEMENTS[announcementIndex].text}</span>
              <span className="mx-1 text-amber-400 font-bold">•</span>
              <strong className="text-amber-300 font-bold">{ANNOUNCEMENTS[announcementIndex].highlight}</strong>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs font-medium text-emerald-200">
            <a 
              href={settings.googleMapsUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1 hover:text-amber-300 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Physical Store</span>
            </a>
            <Link
              to="/store"
              className="flex items-center gap-1 hover:text-amber-300 transition-colors"
            >
              <span>Visit Our Shop</span>
            </Link>

            <a 
              href={settings.instagramUrl} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1 hover:text-amber-300 transition-colors"
            >
              <InstagramIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>@arabians_shopping_zone</span>
            </a>
            <a 
              href="tel:+919236028318" 
              className="hidden lg:flex items-center gap-1 hover:text-amber-300 transition-colors"
              title="Call Helpline: +91 92360 28318"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Call: +91 92360 28318</span>
            </a>
            <a 
              href={getGeneralSupportWhatsAppUrl('Store Browsing Assistance', settings.whatsapp)} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1 bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded-full hover:bg-amber-400 transition font-bold"
              title="WhatsApp: +91 72338 62626"
            >
              <PhoneCall className="w-3 h-3 text-slate-950" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Luxury Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          
          {/* Brand Logo & Royal Identity */}
          <Link 
            to="/" 
            onClick={() => {
              if (isHomePage) {
                window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-full p-0.5 bg-[#021812] border-2 border-amber-400 shadow-md shrink-0 flex items-center justify-center ring-1 ring-amber-400/60 overflow-hidden">
              <img 
                src="/assets/logo/logo_main.png" 
                alt="Arabians Shopping Zone Logo" 
                className="w-full h-full object-contain rounded-full group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-serif text-lg sm:text-2xl font-black tracking-wider text-[#032219] group-hover:text-amber-700 transition-colors leading-tight">
                ARABIANS
              </span>
              <span className="text-[8.5px] sm:text-[10.5px] font-extrabold tracking-[0.26em] text-amber-800 uppercase leading-none mt-0.5">
                SHOPPING ZONE
              </span>
              <span className="text-[9px] text-slate-400 font-medium tracking-wider hidden md:block mt-1 leading-none">
                Royal Sunnah Lifestyle
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar (Clean Luxury Pill with Instant Visual Dropdown) */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <div className="relative w-full">
                <input 
                  type="text"
                  placeholder="Search Talbina, Saudi Thobes, Dehnul Oud, Bakhoor, Nikah..."
                  value={headerSearch}
                  onChange={(e) => setHeaderSearch(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-full bg-[#f8f6f0] border border-amber-900/15 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all shadow-inner"
                />
                <Search className="w-4 h-4 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                {headerSearch && (
                  <button 
                    type="button"
                    onClick={() => setHeaderSearch('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </form>

            {/* Instant Visual Live Search Dropdown */}
            {headerSearch.trim().length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-amber-500/30 shadow-2xl overflow-hidden z-50 animate-fadeIn">
                <div className="p-2.5 bg-amber-50/70 border-b border-amber-200/50 flex items-center justify-between text-[11px] font-bold text-amber-900">
                  <span>Live Product Matches ({searchResults.length})</span>
                  <span className="text-[10px] text-slate-500 font-normal">Press Enter to search all</span>
                </div>
                {searchResults.length > 0 ? (
                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                    {searchResults.map((item) => (
                      <Link
                        key={item.id}
                        to={`/product/${item.id}`}
                        onClick={() => setHeaderSearch('')}
                        className="flex items-center gap-3 p-3 hover:bg-amber-50/40 transition group text-left"
                      >
                        <img src={item.image} alt="" className="w-10 h-10 rounded-lg object-contain bg-slate-50 border p-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-xs text-slate-900 truncate group-hover:text-amber-800 transition">
                            {item.name}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500">
                            <span className="font-bold text-emerald-800 font-mono text-xs">₹{item.price}</span>
                            {item.mrp && <span className="line-through">₹{item.mrp}</span>}
                            <span>•</span>
                            <span className="capitalize">{item.category}</span>
                          </div>
                        </div>
                        <span className="text-xs text-amber-600 font-bold group-hover:translate-x-1 transition-transform">→</span>
                      </Link>
                    ))}
                    <Link
                      to={`/shop?search=${encodeURIComponent(headerSearch.trim())}`}
                      onClick={() => setHeaderSearch('')}
                      className="block p-2.5 text-center text-xs font-bold text-amber-800 hover:bg-amber-100/50 transition bg-slate-50"
                    >
                      View all results for "{headerSearch}" in Store Catalog →
                    </Link>
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500">
                    No products found matching "{headerSearch}".
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Verified Customer Reviews Link */}
            <Link
              to="/reviews"
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                location.pathname === '/reviews'
                  ? 'bg-amber-100/90 text-amber-950 border-amber-400 font-bold shadow-sm'
                  : 'text-slate-700 hover:text-[#032219] hover:bg-slate-100 border-slate-200'
              }`}
              title={`${reviewStats?.total || 328}+ Verified Customer Reviews`}
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>Reviews</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">{reviewStats?.average || '4.9'}★</span>
            </Link>

            {/* Custom Hamper Studio */}
            <Link
              to="/hamper"
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 text-amber-950 border border-amber-300 text-xs font-bold hover:bg-amber-100 transition-all shadow-sm"
              title="Curate Custom Nikah & Gift Hamper"
            >
              <Gift className="w-3.5 h-3.5 text-amber-600" />
              <span>Gift Hamper</span>
            </Link>

            {/* Wholesale Dealer Program */}
            <Link
              to="/distributor"
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#032219] text-amber-300 text-xs font-bold shadow hover:bg-[#063e2e] transition-all"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Dealership Program</span>
            </Link>

            {/* Store Location Button */}
            <Link
              to="/store"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition active:scale-95 ${
                location.pathname === '/store' || location.pathname === '/visit'
                  ? 'bg-amber-100/90 text-amber-950 border-amber-400 font-bold shadow-sm'
                  : 'text-slate-700 hover:text-[#032219] hover:bg-slate-100 border-slate-200'
              }`}
              title="Visit Our Physical Store (Jaipur)"
            >
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="hidden sm:inline">Visit Store</span>
            </Link>

            {/* Cart & Checkout */}
            <Link
              to="/checkout"
              className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-gold hover:from-amber-400 hover:to-amber-500 transition-all active:scale-95"
              title="View Cart & Checkout"
            >
              <ShoppingBag className="w-4 h-4 text-slate-950" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-slate-950 text-amber-300 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>



      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-amber-900/15 px-4 py-4 space-y-3 animate-fadeIn shadow-xl">
          <div className="relative">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input 
                type="text"
                placeholder="Search products..."
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>

            {/* Mobile Visual Search Results Dropdown */}
            {headerSearch.trim().length >= 2 && (
              <div className="mt-2 bg-white rounded-xl border border-amber-500/30 shadow-xl overflow-hidden divide-y divide-slate-100 max-h-60 overflow-y-auto">
                {searchResults.length > 0 ? (
                  searchResults.map((item) => (
                    <Link
                      key={item.id}
                      to={`/product/${item.id}`}
                      onClick={() => {
                        setHeaderSearch('');
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 p-2.5 hover:bg-amber-50/40 text-left"
                    >
                      <img src={item.image} alt="" className="w-8 h-8 rounded-lg object-contain bg-slate-50 border shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-slate-900 truncate">{item.name}</div>
                        <div className="text-[10px] text-emerald-800 font-bold font-mono">₹{item.price}</div>
                      </div>
                      <span className="text-amber-600 text-xs font-bold">→</span>
                    </Link>
                  ))
                ) : (
                  <div className="p-3 text-center text-xs text-slate-500">No matches found for "{headerSearch}"</div>
                )}
              </div>
            )}
          </div>

          <div className="space-y-1.5 text-xs">
            {/* Hamper Studio Banner in Mobile Drawer */}
            <Link
              to="/hamper"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100 text-amber-950 font-bold border border-amber-300 shadow-sm"
            >
              <span className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-600" />
                <span>Bespoke Nikah & Gift Hamper</span>
              </span>
              <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-bold">15% Off</span>
            </Link>

            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-slate-900 font-semibold"
            >
              <span>🛍️ Complete Catalog</span>
            </Link>

            {/* Verified Customer Reviews in Mobile Drawer */}
            <Link
              to="/reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-emerald-50 to-amber-50/50 text-[#032219] font-bold border border-emerald-300/80 shadow-sm"
            >
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>⭐ Verified Customer Reviews</span>
              </span>
              <span className="text-[10px] bg-[#032219] text-amber-300 px-2 py-0.5 rounded-full font-bold">{reviewStats?.average || '4.9'} ★ ({reviewStats?.total || 328}+)</span>
            </Link>

            <Link
              to="/distributor"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 text-amber-950 font-bold border border-amber-300"
            >
              <span>🤝 Wholesale Dealership Program</span>
              <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded">High Margin</span>
            </Link>

            <Link
              to="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-slate-800 font-medium"
            >
              <span>🚚 Live Order Tracking</span>
            </Link>

            <Link
              to="/store"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-[#032219] to-[#053527] text-amber-300 font-bold border border-amber-500/30 shadow-sm"
            >
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Visit Our Shop</span>
              </span>
              <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full font-bold">Google Maps</span>
            </Link>

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-slate-800 font-medium"
            >
              <span>📞 Contact & Helpline</span>
            </Link>


            <Link
              to="/shipping-policy"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-slate-800 font-medium"
            >
              <span>📦 Shipping & Delivery Policy</span>
            </Link>

            <Link
              to="/return-policy"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 text-slate-800 font-medium"
            >
              <span>🔄 7-Day Return & Free Replacement</span>
            </Link>

            {/* Direct Mobile Quick Contact */}
            <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
              <a
                href={getGeneralSupportWhatsAppUrl('Mobile Browsing Inquiry', settings.whatsapp)}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300 font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>💬 WhatsApp</span>
              </a>
              <a
                href="tel:+919236028318"
                className="py-2.5 px-2 rounded-xl bg-amber-50 text-amber-950 border border-amber-300 font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>📞 Call Helpline</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </header>
  );
}
