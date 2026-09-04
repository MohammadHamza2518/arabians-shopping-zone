import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  HelpCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getDistributorWhatsAppUrl } from '../utils/whatsapp';

export default function DistributorPage() {
  const { settings, showToast } = useStore();

  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    investment: '₹25,000 - ₹50,000 (Starter Dealership)',
    categories: ['Arabians Talbina (All Flavors)'],
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleCategory = (cat) => {
    if (formData.categories.includes(cat)) {
      setFormData({ ...formData, categories: formData.categories.filter(c => c !== cat) });
    } else {
      setFormData({ ...formData, categories: [...formData.categories, cat] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/distributors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        showToast("Application submitted! Our Wholesale Director will call you within 24 hours.");
      } else {
        showToast(data.message || "Failed to submit application.", "error");
      }
    } catch {
      showToast("Error submitting application. Please contact WhatsApp.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 animate-fadeIn">
      
      {/* Breadcrumb - Hidden on mobile */}
      <nav className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-amber-700 transition">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Distributor & Franchise Portal</span>
      </nav>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#021812] via-[#053527] to-[#021812] text-white p-8 sm:p-12 rounded-3xl border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Pan-India B2B Expansion</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Partner With India's Leading Sunnah Lifestyle Brand
          </h1>
          <p className="text-xs sm:text-base text-emerald-200/90 leading-relaxed">
            Stock verified authentic <strong>Arabian's Talbeena</strong> (5 high-repeat flavors), bespoke <strong>Designer Thobes</strong>, and aged <strong>Dehnul Oud</strong> in your city. Enjoy high margins, exclusive territory protection, and direct factory dispatch.
          </p>
        </div>
      </div>

      {/* 3 Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-3xl border border-amber-500/30 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-slate-900">30% to 45% Profit Margins</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Sunnah Talbina has massive recurring monthly demand. Customers consume 2-4 boxes per family every month, providing dependable repeat revenue.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-amber-500/30 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-slate-900">City / District Monopoly</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We assign exclusive distribution rights per district so you face zero internal price competition in your local territory.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-amber-500/30 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-slate-900">Direct Express Factory Supply</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Free shipping on master cartons, complimentary store banner standees, and FSSAI lab quality certificates included with every shipment.
          </p>
        </div>
      </div>

      {/* Application Form Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
        {submitted ? (
          <div className="text-center py-12 space-y-4 max-w-md mx-auto animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-slate-900">Application Registered!</h3>
            <p className="text-xs text-slate-600">
              JazakAllah Khair. Our B2B Franchise Manager will contact you on <strong>{formData.phone}</strong> with wholesale catalog pricing and sample details.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={getDistributorWhatsAppUrl({
                  contactPerson: formData.ownerName,
                  firmName: formData.businessName,
                  city: formData.city,
                  state: formData.state,
                  phone: formData.phone,
                  categories: formData.categories,
                  notes: formData.notes
                }, settings.whatsapp)}
                target="_blank"
                rel="noreferrer"
                className="inline-block px-5 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
              >
                Connect on WhatsApp for Instant Review
              </a>
              <Link to="/shop" className="inline-block px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold">
                Return to Store
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Dealer Onboarding</span>
              <h2 className="font-serif text-2xl font-bold text-slate-900 mt-1">
                Apply for Dealership / Stockist Rights
              </h2>
              <p className="text-xs text-slate-500">Please provide your business or individual retail details below.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Firm / Shop / Store Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Al-Barakah Mart or Individual"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Owner / Contact Person Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hafiz Naimur Rahman"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">WhatsApp Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="For official dealer agreement"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">City / District *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kozhikode"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">State *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kerala"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Initial Investment Capacity:</label>
                <select
                  value={formData.investment}
                  onChange={(e) => setFormData({ ...formData, investment: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option>₹25,000 - ₹50,000 (Starter Dealership)</option>
                  <option>₹50,000 - ₹1,00,000 (City Stockist)</option>
                  <option>₹1,00,000+ (Master District Distributor)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1.5">Products You Wish to Distribute:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Arabians Talbina (All Flavors)',
                    'Designer Thobes & Jubbas (Men)',
                    'Attar & Dehnul Oud (Fragrance)',
                    'Bakhoor & Electric Burners',
                    'Islamic Home Decor (Ayat-ul-Kursi Art)',
                    'Nikah Wedding Keepsakes'
                  ].map((catName) => (
                    <label key={catName} className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.categories.includes(catName)}
                        onChange={() => toggleCategory(catName)}
                        className="rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span>{catName}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Business Experience / Remarks:</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your current shop, wholesale plans or customer base..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm hover:from-amber-400 hover:to-amber-500 transition shadow-gold flex items-center justify-center gap-2"
            >
              {submitting ? 'Submitting Application...' : 'Submit Dealership Application'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
