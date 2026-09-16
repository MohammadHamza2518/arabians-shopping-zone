import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { 
  Building2, 
  TrendingUp, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  PhoneCall, 
  CheckCircle2, 
  Award,
  ArrowRight,
  HelpCircle,
  Check,
  Store,
  MessageSquare,
  Clock,
  ExternalLink,
  ChevronRight,
  MapPin,
  Lock
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getDistributorWhatsAppUrl } from '../utils/whatsapp';

const INVESTMENT_TIERS = [
  {
    id: 'starter',
    value: '₹25,000 - ₹50,000 (Starter Dealership)',
    title: 'Starter Dealership',
    amount: '₹25,000 - ₹50,000',
    badge: 'Low Risk Entry',
    description: 'Ideal for small Islamic bookshops, medical stores, & emerging retail entrepreneurs.',
    benefits: [
      'High-velocity Sprouted Talbina (all flavors)',
      'Pure Alcohol-Free Attar sample kit',
      '35% Guaranteed retail margin',
      'Free counter display standee'
    ]
  },
  {
    id: 'stockist',
    value: '₹50,000 - ₹1,00,000 (City Stockist)',
    title: 'City Stockist',
    amount: '₹50,000 - ₹1,00,000',
    badge: 'Most Popular 👑',
    popular: true,
    description: 'Exclusive neighborhood territory rights with complete multi-category catalog access.',
    benefits: [
      'Full catalog: Talbina, Thobes, Oud & Decor',
      'Exclusive local territory protection',
      'Complimentary acrylic standee & marketing kit',
      '40% Profit margin + priority dispatch'
    ]
  },
  {
    id: 'distributor',
    value: '₹1,00,000+ (Master District Distributor)',
    title: 'District Distributor',
    amount: '₹1,00,000+',
    badge: 'District Monopoly',
    description: 'Sole authorized distributor for your district with highest factory-tier discounts.',
    benefits: [
      'Guaranteed 100% district monopoly (zero competition)',
      'Highest margin (up to 45% ROI on retail MRP)',
      'Dedicated B2B account manager on WhatsApp',
      'Free promotional standees & lab certificates'
    ]
  }
];

const PRODUCT_TILES = [
  {
    id: 'talbina',
    name: 'Arabians Talbina (All Flavors)',
    category: 'Sunnah Nutrition',
    badge: 'Fastest Selling',
    emoji: '🥣',
    desc: 'Sprouted whole-grain barley with real dry fruits. High monthly repeat orders.'
  },
  {
    id: 'thobes',
    name: 'Designer Saudi & Emirati Thobes',
    category: 'Men\'s Tailoring',
    badge: 'High Ticket',
    emoji: '👑',
    desc: 'Stiff standing collars, concealed snap plackets & Kashmiri Amama shareef.'
  },
  {
    id: 'oud',
    name: 'Attar & Dehnul Oud (Fragrance)',
    category: 'Pure Perfumery',
    badge: '45% Margin',
    emoji: '🪔',
    desc: 'Pure alcohol-free Assamese agarwood oils & long-lasting bespoke blends.'
  },
  {
    id: 'bakhoor',
    name: 'Bakhoor & Electric Burners',
    category: 'Home Aromatics',
    badge: 'High Demand',
    emoji: '💨',
    desc: 'Traditional agarwood incense chips & luxury brass/electric mabkharas.'
  },
  {
    id: 'decor',
    name: 'Islamic Home Decor (Ayat-ul-Kursi Art)',
    category: 'Wall Art',
    badge: 'Heirloom',
    emoji: '🖼️',
    desc: '3D acrylic and metal calligraphy plaques for modern Islamic households.'
  },
  {
    id: 'nikah',
    name: 'Nikah Wedding Keepsakes',
    category: 'Wedding Essentials',
    badge: 'Year-Round',
    emoji: '💍',
    desc: 'Embossed Nikah namas, velvet ring boxes, and handmade feather quills.'
  },
  {
    id: 'skincare',
    name: 'Natural & Sunnah Skin Care',
    category: 'Herbal & Organic',
    badge: 'High Repeat',
    emoji: '✨',
    desc: 'Kashmiri Ubtan Body Pack, Saffron & Sandalwood Soaps, Night Creams & Herbal Care.'
  }
];

export default function DistributorPage() {
  const { settings, showToast } = useStore();

  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    businessType: 'Retail Store / Islamic Mart',
    investment: '₹50,000 - ₹1,00,000 (City Stockist)',
    categories: ['Arabians Talbina (All Flavors)', 'Designer Saudi & Emirati Thobes'],
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleCategory = (catName) => {
    setFormData(prev => {
      const exists = prev.categories.includes(catName);
      if (exists) {
        if (prev.categories.length === 1) {
          showToast('Please keep at least one product category selected.', 'info');
          return prev;
        }
        return { ...prev, categories: prev.categories.filter(c => c !== catName) };
      }
      return { ...prev, categories: [...prev.categories, catName] };
    });
  };

  const handleSelectTier = (tierValue) => {
    setFormData(prev => ({ ...prev, investment: tierValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.ownerName.trim() || !formData.phone.trim() || !formData.city.trim()) {
      showToast('Please fill in your name, WhatsApp number, and city.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.businessName || formData.ownerName,
        contactPerson: formData.ownerName,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        state: formData.state,
        currentBusiness: formData.businessType,
        investmentBudget: formData.investment,
        interestedProducts: formData.categories,
        message: formData.notes,
        businessName: formData.businessName,
        ownerName: formData.ownerName,
        investment: formData.investment,
        categories: formData.categories,
        notes: formData.notes
      };

      const res = await fetch('/api/distributors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json().catch(() => ({}));
      
      if (res.ok || data.id || data.success) {
        setSubmitted(true);
        showToast("JazakAllah Khair! Application registered. Our B2B team will contact you within 24 hours.");
        const el = document.getElementById('dealership-form');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        showToast(data.message || "Failed to submit. Please connect via WhatsApp.", "error");
      }
    } catch {
      showToast("Could not send application. Please connect directly via WhatsApp.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const directWhatsAppUrl = getDistributorWhatsAppUrl({
    contactPerson: formData.ownerName || 'Prospective Dealer',
    firmName: formData.businessName || '',
    city: formData.city || '',
    state: formData.state || '',
    phone: formData.phone || '',
    categories: formData.categories,
    notes: formData.notes
  }, settings.whatsapp);

  return (
    <div className="bg-[#faf8f5] text-slate-800 animate-fadeIn pb-16">
      <SEO 
        title="Distributorship & Dealership Program | Arabians Shopping Zone B2B"
        description="Become an authorized distributor or stockist for Arabians Shopping Zone. Up to 45% retail margins on Sprouted Talbina, Saudi Thobes, Pure Oud Attars & Islamic decor. Pan-India wholesale delivery."
        keywords="talbina distributorship india, islamic products wholesale dealer, buy thobes bulk india, attar wholesale supplier, halal business franchise opportunity"
        canonical="https://arabiansshoppingzone.com/distributor"
      />
      
      {/* 1. EDITORIAL LUXURY HERO */}
      <section className="relative bg-gradient-to-b from-[#021812] via-[#04241b] to-[#021812] text-white pt-8 sm:pt-12 pb-16 sm:pb-20 overflow-hidden">
        {/* Subtle Islamic Geometric Motif Ambient Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-amber-500/10 blur-3xl pointer-events-none rounded-full"></div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center">
          
          {/* Breadcrumb */}
          <nav className="inline-flex items-center gap-2 text-xs text-emerald-300/80 bg-white/5 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
            <Link to="/" className="hover:text-amber-300 transition">Home</Link>
            <span>/</span>
            <span className="text-white font-medium">B2B Dealership & Franchise</span>
          </nav>

          {/* Prestige Badge */}
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Pan-India Wholesale & Stockist Program</span>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight max-w-4xl mx-auto">
            Bring India's Leading <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-amber-400">Sunnah Lifestyle</span> Brand to Your City
          </h1>

          <p className="text-xs sm:text-base text-emerald-100/85 max-w-2xl mx-auto leading-relaxed font-normal">
            Partner directly with Arabians Shopping Zone. Stock stone-ground authentic <strong>Talbeena</strong>, royal Saudi <strong>Thobes</strong>, and aged <strong>Dehnul Oud</strong> with protected district territory, high retail margins, and direct factory dispatch.
          </p>

          {/* Quick Stats Banner (Transparent High-Trust Counters) */}
          <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm border border-amber-400/20 rounded-2xl p-3.5 text-center">
              <div className="font-serif text-xl sm:text-2xl font-black text-amber-400">35% - 45%</div>
              <div className="text-[11px] text-emerald-200/80 font-medium mt-0.5">Retail Profit Margin</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-amber-400/20 rounded-2xl p-3.5 text-center">
              <div className="font-serif text-xl sm:text-2xl font-black text-amber-400">120+ Cities</div>
              <div className="text-[11px] text-emerald-200/80 font-medium mt-0.5">Active Stockists in India</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-amber-400/20 rounded-2xl p-3.5 text-center">
              <div className="font-serif text-xl sm:text-2xl font-black text-amber-400">1 District</div>
              <div className="text-[11px] text-emerald-200/80 font-medium mt-0.5">1 Authorized Stockist</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-amber-400/20 rounded-2xl p-3.5 text-center">
              <div className="font-serif text-xl sm:text-2xl font-black text-amber-400">₹25,000</div>
              <div className="text-[11px] text-emerald-200/80 font-medium mt-0.5">Low Starter MOQ</div>
            </div>
          </div>

          {/* Instant Hero Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="#dealership-form"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs sm:text-sm hover:from-amber-400 hover:to-amber-500 shadow-gold transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Apply for Dealership (1 Min)</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            
            <a
              href={directWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#063b2c] hover:bg-[#084b38] text-emerald-100 font-bold text-xs sm:text-sm border border-emerald-400/30 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Instant WhatsApp Inquiry</span>
            </a>
          </div>

        </div>
      </section>

      {/* ARCHITECTURAL TRANSITION INTO WHITE CONTENT */}
      <div className="relative w-full overflow-hidden leading-none select-none pointer-events-none -mt-px bg-[#021812]">
        <svg 
          viewBox="0 0 1440 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-5 sm:h-8 block"
          preserveAspectRatio="none"
        >
          <path d="M0,0 C480,40 960,40 1440,0 L1440,40 L0,40 Z" fill="#faf8f5" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 -mt-2">
        
        {/* 2. THE 3-STEP DEALERSHIP ROADMAP (REMOVES ALL CONFUSION) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-sm space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-widest">
              Simple & Transparent Onboarding
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#032219]">
              How the Dealership Works in 3 Steps
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              No complex corporate red-tape. Start retailing Sunnah essentials in under 48 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            
            <div className="p-5 rounded-2xl bg-[#faf8f5] border border-amber-900/10 relative space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-serif font-black text-sm flex items-center justify-center shadow-sm">
                01
              </div>
              <h3 className="font-serif font-bold text-base text-slate-900">Submit Application</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Provide your store location and target product interests in the 60-second form below.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#faf8f5] border border-amber-900/10 relative space-y-2">
              <div className="w-9 h-9 rounded-xl bg-[#032219] text-amber-300 font-serif font-black text-sm flex items-center justify-center shadow-sm border border-amber-400/30">
                02
              </div>
              <h3 className="font-serif font-bold text-base text-slate-900">Get Wholesale Catalog</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our Wholesale Manager shares the complete B2B margin sheet & MOQ sample options on WhatsApp within 2 hours.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#faf8f5] border border-amber-900/10 relative space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white font-serif font-black text-sm flex items-center justify-center shadow-sm">
                03
              </div>
              <h3 className="font-serif font-bold text-base text-slate-900">Factory Dispatch</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receive authentic stock at your shop with GST bill, promotional counter standees, and FSSAI lab certificates.
              </p>
            </div>

          </div>
        </div>

        {/* 3. CORE VALUE PILLARS (WHY DEALERS LOVE ARABIANS) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-amber-900/10 shadow-sm space-y-3 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-800 flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-serif font-bold text-lg text-slate-900">35% to 45% Net Profit Margins</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Talbina is an essential daily nutritional staple. Muslim families consume 2 to 4 boxes every month, creating dependable repeat cashflow with zero dead inventory risk.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-amber-900/10 shadow-sm space-y-3 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="font-serif font-bold text-lg text-slate-900">Protected District Monopoly</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We grant territorial exclusivity per city / district cluster so your shop faces zero internal price undercutting or cross-selling from neighboring retailers.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-amber-900/10 shadow-sm space-y-3 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-800 flex items-center justify-center font-bold">
              <Truck className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-serif font-bold text-lg text-slate-900">Direct Express Factory Supply</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Complimentary promotional rollup standees, acrylic counter units, FSSAI lab quality reports, and fast insured express cargo dispatched Pan-India within 48 hours.
            </p>
          </div>

        </div>

        {/* 4. APPLICATION FORM SECTION */}
        <div id="dealership-form" className="bg-white rounded-3xl border border-amber-900/15 shadow-xl overflow-hidden scroll-mt-24">
          
          {/* Form Header */}
          <div className="bg-gradient-to-r from-[#032219] to-[#043325] text-white p-6 sm:p-8 border-b border-amber-500/30">
            <div className="max-w-2xl space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider border border-amber-500/30">
                <Store className="w-3.5 h-3.5 text-amber-400" />
                <span>Authorized Retailer Onboarding</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-white">
                Official Dealership Application Form
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200/80">
                Complete this quick profile to receive the wholesale price catalog, MOQ details, and territory verification.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-10">
            {submitted ? (
              /* Success Confirmation */
              <div className="text-center py-10 space-y-5 max-w-lg mx-auto animate-fadeIn">
                <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center border-4 border-emerald-200 shadow-sm">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                
                <div className="space-y-1">
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">Application Status: Registered</span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-black text-[#032219]">
                    JazakAllah Khair, {formData.ownerName || 'Partner'}!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                    Your wholesale application for <strong>{formData.city || 'your city'}</strong> has been assigned to our B2B Onboarding Director. We will contact you on <strong>{formData.phone}</strong> within 24 hours.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#faf8f5] border border-amber-900/10 text-left text-xs space-y-2">
                  <div className="font-bold text-slate-800 border-b border-slate-200 pb-1">Application Summary:</div>
                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div><span className="text-slate-400">Firm:</span> {formData.businessName || 'Individual'}</div>
                    <div><span className="text-slate-400">Location:</span> {formData.city}, {formData.state}</div>
                    <div className="col-span-2"><span className="text-slate-400">Investment Tier:</span> {formData.investment}</div>
                    <div className="col-span-2"><span className="text-slate-400">Products:</span> {formData.categories.join(', ')}</div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={directWhatsAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white text-xs sm:text-sm font-bold shadow transition flex items-center justify-center gap-2"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Instant Review on WhatsApp</span>
                  </a>
                  <Link 
                    to="/" 
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition flex items-center justify-center"
                  >
                    Return to Home
                  </Link>
                </div>
              </div>
            ) : (
              /* Active Form */
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* PART 1: BUSINESS & CONTACT INFORMATION */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center">1</span>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900">
                      Store & Contact Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">
                        Shop / Firm / Business Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Al-Madina Supermarket or Individual"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-900 placeholder:text-slate-400 font-medium transition"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">
                        Owner / Contact Person Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Hafiz Naimur Rahman"
                        value={formData.ownerName}
                        onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-900 placeholder:text-slate-400 font-medium transition"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">
                        WhatsApp Mobile Number *
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-xs font-bold text-slate-500 select-none">
                          🇮🇳 +91
                        </span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          placeholder="98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                          className="w-full pl-[72px] pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-900 placeholder:text-slate-400 font-medium transition"
                        />
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Wholesale price PDF & catalog will be sent to this WhatsApp number.
                      </span>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        placeholder="For official dealer agreement"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-900 placeholder:text-slate-400 font-medium transition"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">
                        City / District *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Hyderabad, Kozhikode, Lucknow, Mumbai"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-900 placeholder:text-slate-400 font-medium transition"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Telangana, Kerala, Uttar Pradesh, Maharashtra"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-900 placeholder:text-slate-400 font-medium transition"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1.5">
                        Current Business Type:
                      </label>
                      <select
                        value={formData.businessType}
                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                      >
                        <option>Retail Store / Islamic Mart</option>
                        <option>Pharmacy / Unani & Ayurvedic Medical Store</option>
                        <option>Perfume & Attar Specialist Boutique</option>
                        <option>Clothing, Jubba & Hijab Showroom</option>
                        <option>Supermarket / Departmental Store</option>
                        <option>Online E-Commerce Seller / Social Media Reseller</option>
                        <option>New Entrepreneur (Opening New Retail Store)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* PART 2: PARTNERSHIP LEVEL SELECTION (INTERACTIVE VISUAL CARDS) */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center">2</span>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900">
                      Choose Your Dealership Tier
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Select your initial stock budget. You can always upgrade your tier later as order volumes grow.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {INVESTMENT_TIERS.map((tier) => {
                      const isSelected = formData.investment === tier.value;
                      return (
                        <div
                          key={tier.id}
                          onClick={() => handleSelectTier(tier.value)}
                          className={`relative rounded-2xl p-5 border-2 cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-emerald-950 text-white border-amber-400 shadow-lg scale-[1.01]' 
                              : 'bg-white text-slate-800 border-slate-200 hover:border-amber-400 hover:shadow-sm'
                          }`}
                        >
                          {/* Active Indicator / Popular Badge */}
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                              isSelected
                                ? 'bg-amber-400 text-slate-950'
                                : tier.popular
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {tier.badge}
                            </span>
                            
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                              isSelected 
                                ? 'bg-amber-400 text-slate-950 border-amber-400' 
                                : 'border-slate-300 bg-white'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </div>

                          <h4 className={`font-serif text-lg font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {tier.title}
                          </h4>
                          <div className={`font-serif text-xl font-extrabold mt-1 mb-2 ${isSelected ? 'text-amber-300' : 'text-amber-700'}`}>
                            {tier.amount}
                          </div>
                          
                          <p className={`text-[11px] leading-relaxed mb-4 ${isSelected ? 'text-emerald-200/80' : 'text-slate-500'}`}>
                            {tier.description}
                          </p>

                          {/* Bullet Highlights */}
                          <div className={`pt-3 border-t space-y-1.5 text-[11px] ${isSelected ? 'border-emerald-800' : 'border-slate-100'}`}>
                            {tier.benefits.map((b, idx) => (
                              <div key={idx} className="flex items-start gap-1.5">
                                <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isSelected ? 'text-amber-400' : 'text-emerald-700'}`} />
                                <span className={isSelected ? 'text-emerald-100' : 'text-slate-600'}>{b}</span>
                              </div>
                            ))}
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* PART 3: TARGET PRODUCTS SELECTION (INTERACTIVE TILES WITH EMOJIS & TAGS) */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center">3</span>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900">
                      Select Target Products for Your Store
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    Tap any category to add or remove it from your wholesale catalog quotation.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {PRODUCT_TILES.map((prod) => {
                      const isSelected = formData.categories.includes(prod.name);
                      return (
                        <div
                          key={prod.id}
                          onClick={() => toggleCategory(prod.name)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected 
                              ? 'bg-emerald-50 border-emerald-600 shadow-sm' 
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="text-2xl">{prod.emoji}</span>
                              <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isSelected 
                                    ? 'bg-emerald-700 text-white' 
                                    : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {prod.badge}
                                </span>
                                <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                                  isSelected 
                                    ? 'bg-emerald-700 border-emerald-700 text-white' 
                                    : 'border-slate-300 bg-white'
                                }`}>
                                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                              </div>
                            </div>

                            <h4 className={`font-serif font-bold text-sm leading-tight ${isSelected ? 'text-[#032219]' : 'text-slate-900'}`}>
                              {prod.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                              {prod.desc}
                            </p>
                          </div>

                          <div className="pt-2.5 mt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                            <span className="text-slate-500 font-medium">{prod.category}</span>
                            <span className={`font-bold ${isSelected ? 'text-emerald-800' : 'text-slate-400'}`}>
                              {isSelected ? '✓ Selected' : '+ Tap to Select'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* PART 4: BUSINESS EXPERIENCE / REMARKS */}
                <div className="space-y-2 pt-2">
                  <label className="block font-bold text-slate-700 text-xs">
                    Business Experience / Specific Requirements (Optional):
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your existing shop size, customer profile, or any questions for our wholesale team..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-900 placeholder:text-slate-400 text-xs font-medium transition"
                  />
                </div>

                {/* SUBMIT BUTTON */}
                <div className="space-y-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm sm:text-base transition shadow-gold flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Registering Application...</span>
                    ) : (
                      <>
                        <span>Submit Dealership Application</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 px-1">
                    <div className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Strictly Confidential • Zero spam • Direct response within 24 hours.</span>
                    </div>
                    <a
                      href={directWhatsAppUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-amber-800 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Need quick answer? WhatsApp Wholesale Desk →</span>
                    </a>
                  </div>
                </div>

              </form>
            )}
          </div>

        </div>

        {/* 5. FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-900/10 shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-5 h-5 text-amber-600" />
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
              Wholesale & Dealership FAQs
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-amber-900/10 space-y-1.5">
              <h4 className="font-serif font-bold text-slate-900 text-sm">
                What is the Minimum Order Quantity (MOQ)?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Starter Dealership begins at just ₹25,000 across mixed products. You do not need to buy bulk single cartons — you can mix Talbina flavors, attars, and thobe sizes.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-amber-900/10 space-y-1.5">
              <h4 className="font-serif font-bold text-slate-900 text-sm">
                How does Territory Protection work?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Once approved as an authorized District Stockist, we do not supply to any other competing physical store within your agreed pincode/district perimeter.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-amber-900/10 space-y-1.5">
              <h4 className="font-serif font-bold text-slate-900 text-sm">
                Are marketing materials and standees included?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Yes! Every qualifying stockist carton includes a complimentary acrylic counter display, rollup banner standee, and official lab certification certificates for in-store credibility.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#faf8f5] border border-amber-900/10 space-y-1.5">
              <h4 className="font-serif font-bold text-slate-900 text-sm">
                How fast is factory dispatch Pan-India?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Orders are dispatched within 24-48 hours from our central warehouse via insured express cargo with real-time tracking to any city in India.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
