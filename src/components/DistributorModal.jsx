import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  TrendingUp, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  PhoneCall, 
  MessageSquare,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getDistributorWhatsAppUrl } from '../utils/whatsapp';

export default function DistributorModal() {
  const { isDistributorOpen, setIsDistributorOpen, settings, showToast } = useStore();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    currentBusiness: 'Islamic Bookstore & Attar Shop',
    investmentBudget: '₹50,000 - ₹1,00,000',
    interestedProducts: ['Arabians Talbina (All Flavors)', 'Designer Thobes'],
    message: ''
  });

  if (!isDistributorOpen) return null;

  const handleProductToggle = (prod) => {
    setForm(prev => {
      const exists = prev.interestedProducts.includes(prod);
      return {
        ...prev,
        interestedProducts: exists 
          ? prev.interestedProducts.filter(p => p !== prod)
          : [...prev.interestedProducts, prod]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.contactPerson || !form.phone || !form.city || !form.state) {
      showToast("Please fill in contact name, phone, city, and state.", "error");
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch('/api/distributors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setSubmitted(true);
        showToast("Distributor Application submitted successfully!");
      } else {
        throw new Error();
      }
    } catch {
      showToast("Could not submit application. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-amber-500/30 my-8 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#032219] via-[#064e3b] to-[#032219] text-white flex items-center justify-between border-b border-amber-500/20 shrink-0">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Wholesale & Dealership Opportunity</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold">Become an Authorized Distributor</h2>
          </div>
          <button
            onClick={() => setIsDistributorOpen(false)}
            className="p-1 rounded-full text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6">
          
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-4 border-emerald-200">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-slate-900">
                Application Received Successfully!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Our National Business Development Team will review your application and send the wholesale margin sheet & product catalogue on your WhatsApp within 2-4 hours.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={getDistributorWhatsAppUrl({
                    contactPerson: form.contactPerson,
                    firmName: form.firmName,
                    city: form.city,
                    state: form.state,
                    phone: form.phone,
                    categories: form.categories,
                    notes: form.notes
                  }, settings.whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 rounded-xl bg-emerald-700 text-white font-bold text-xs sm:text-sm hover:bg-emerald-800 transition flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Connect Directly on WhatsApp</span>
                </a>

                <button
                  onClick={() => { setSubmitted(false); setIsDistributorOpen(false); }}
                  className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-200"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Value Proposition Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 space-y-1">
                  <TrendingUp className="w-5 h-5 text-amber-700" />
                  <div className="font-bold text-xs sm:text-sm text-slate-900">30% - 45% Margins</div>
                  <div className="text-[11px] text-slate-600">High repeat orders on Sunnah Talbina & Attars.</div>
                </div>

                <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 space-y-1">
                  <Building2 className="w-5 h-5 text-emerald-700" />
                  <div className="font-bold text-xs sm:text-sm text-slate-900">City Monopoly</div>
                  <div className="text-[11px] text-slate-600">Exclusive distribution rights for your district/area.</div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-1">
                  <Truck className="w-5 h-5 text-slate-700" />
                  <div className="font-bold text-xs sm:text-sm text-slate-900">Priority Dispatch</div>
                  <div className="text-[11px] text-slate-600">Direct factory supply & promotional standees.</div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Firm / Business / Shop Name:</label>
                    <input
                      type="text"
                      placeholder="e.g. Al-Barakah Mart or Individual"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hafiz Naimur Rahman"
                      value={form.contactPerson}
                      onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">WhatsApp Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit phone number"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email Address (Optional):</label>
                    <input
                      type="email"
                      placeholder="For dealer contract documents"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">City / District *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kozhikode"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">State *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kerala"
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-semibold text-slate-700 mb-1">Investment Capacity:</label>
                    <select
                      value={form.investmentBudget}
                      onChange={(e) => setForm({ ...form, investmentBudget: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none font-medium"
                    >
                      <option>₹25,000 - ₹50,000 (Starter Kit)</option>
                      <option>₹50,000 - ₹1,00,000 (City Stockist)</option>
                      <option>₹1,00,000 - ₹2,50,000 (Regional Distributor)</option>
                      <option>₹5,00,000+ (Super Stockist)</option>
                    </select>
                  </div>
                </div>

                {/* Interested Products Checkboxes */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">Products You Wish to Distribute:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      "Arabians Talbina (All Flavors)",
                      "Designer Thobes & Jubbas",
                      "Attar & Dehnul Oud",
                      "Bakhoor & Electric Burners",
                      "Islamic Home Decor",
                      "Nikah Wedding Kits"
                    ].map((item) => (
                      <label 
                        key={item}
                        className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition ${
                          form.interestedProducts.includes(item)
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={form.interestedProducts.includes(item)}
                          onChange={() => handleProductToggle(item)}
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-[11px] leading-tight">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Business Experience / Remarks:</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your current store, customer base or wholesale plans..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm hover:from-amber-400 hover:to-amber-500 shadow-gold transition flex items-center justify-center gap-2"
                >
                  {submitting ? 'Submitting Application...' : 'Submit Dealership Application'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
