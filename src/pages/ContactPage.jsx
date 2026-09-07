import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Mail, MapPin, PhoneCall, Phone, ExternalLink, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getGeneralSupportWhatsAppUrl } from '../utils/whatsapp';

export default function ContactPage() {
  const { settings, showToast } = useStore();

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
      showToast("JazakAllah! Your message has been received. Our team will contact you shortly.");
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-fadeIn">
      
      {/* Breadcrumb - Hidden on mobile */}
      <nav className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-amber-700 transition">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Contact & Support</span>
      </nav>

      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100/80 px-3 py-1 rounded-full">
          Customer Care
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-900">
          Get in Touch With Arabians
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Have questions regarding Talbina recipes, thobe custom sizing, or bulk order delivery? We are here to assist.
        </p>
      </div>

      {/* Contact Cards Grid: 4 Dedicated Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. WhatsApp Only */}
        <a
          href={getGeneralSupportWhatsAppUrl('General Customer Care', settings.whatsapp)}
          target="_blank"
          rel="noreferrer"
          className="p-5 rounded-3xl bg-emerald-50 border border-emerald-300 text-emerald-950 hover:bg-emerald-100 transition space-y-3 block shadow-sm"
        >
          <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base">WhatsApp Support</h3>
            <p className="text-xs text-emerald-800 font-mono font-bold mt-0.5">+91 72338 62626</p>
            <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-full">
              WhatsApp Only • Fast
            </span>
          </div>
        </a>

        {/* 2. Direct Calling Helpline */}
        <a
          href="tel:+917233862626"
          className="p-5 rounded-3xl bg-emerald-900 text-white border border-emerald-700 hover:bg-emerald-800 transition space-y-3 block shadow-sm"
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base text-white">Call Helpline</h3>
            <p className="text-xs text-amber-300 font-mono font-bold mt-0.5">+91 72338 62626</p>
            <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
              Call Direct • 10AM-9PM
            </span>
          </div>
        </a>

        {/* 3. Official Email Support */}
        <a
          href="mailto:arabiansshoppingzone@gmail.com"
          className="p-5 rounded-3xl bg-amber-50 border border-amber-300 text-amber-950 hover:bg-amber-100 transition space-y-3 block shadow-sm"
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base">Official Email</h3>
            <p className="text-xs text-amber-800 font-mono font-semibold mt-0.5 break-all">arabiansshoppingzone@gmail.com</p>
            <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full">
              Within 12 Hours
            </span>
          </div>
        </a>

        {/* 4. Physical Store Location */}
        <a
          href={settings.googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="p-5 rounded-3xl bg-slate-50 border border-slate-300 text-slate-950 hover:bg-slate-100 transition space-y-3 block shadow-sm"
        >
          <div className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base">Visit Store</h3>
            <p className="text-xs text-slate-700 font-semibold mt-0.5">Physical Market Shop</p>
            <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full">
              <span>Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        </a>
      </div>

      {/* Direct Inquiry Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm max-w-2xl mx-auto">
        {sent ? (
          <div className="text-center py-8 space-y-3 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-xl text-slate-900">Message Delivered!</h3>
            <p className="text-xs text-slate-600">
              Thank you for reaching out. A representative from Arabians Shopping Zone will call or message your WhatsApp shortly.
            </p>
            <button
              onClick={() => { setSent(false); setForm({ name: '', phone: '', email: '', subject: 'General Inquiry', message: '' }); }}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-serif font-bold text-lg text-slate-900">
                Send Us a Direct Message
              </h3>
              <p className="text-xs text-slate-500">Fill out this quick form and our support desk will respond promptly.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salman Qureshi"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phone / WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Subject</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option>General Inquiry</option>
                  <option>Order Delivery Status</option>
                  <option>Talbina Recipe & Flavors</option>
                  <option>Thobe Sizing & Exchange</option>
                  <option>Wholesale & Bulk Orders</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Your Message *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we assist you today?..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs sm:text-sm hover:from-amber-400 hover:to-amber-500 transition shadow-gold flex items-center justify-center gap-2"
            >
              {submitting ? 'Sending Message...' : 'Send Message to Support'}
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
