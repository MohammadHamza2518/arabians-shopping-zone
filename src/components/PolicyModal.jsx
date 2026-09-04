import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  RotateCcw, 
  Truck, 
  FileText, 
  PhoneCall, 
  Phone,
  MapPin, 
  Mail, 
  MessageSquare, 
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getGeneralSupportWhatsAppUrl } from '../utils/whatsapp';

export default function PolicyModal() {
  const { activePolicy, setActivePolicy, settings, showToast } = useStore();

  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submittingContact, setSubmittingContact] = useState(false);

  if (!activePolicy) return null;

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmittingContact(true);
    setTimeout(() => {
      setSubmittingContact(false);
      showToast("JazakAllah! Your message has been received. We will call/WhatsApp you shortly.");
      setContactForm({ name: '', phone: '', email: '', subject: 'General Inquiry', message: '' });
      setActivePolicy(null);
    }, 800);
  };

  const tabs = [
    { id: 'about', label: 'About Us', icon: Sparkles },
    { id: 'shipping', label: 'Shipping Policy', icon: Truck },
    { id: 'returns', label: 'Return & Refunds', icon: RotateCcw },
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'contact', label: 'Contact Us', icon: PhoneCall },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn overflow-hidden">
      <div 
        className="relative w-full max-w-4xl h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl border border-amber-500/40 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#032219] text-white flex items-center justify-between border-b border-amber-500/20 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300">
              📜
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold">
                {tabs.find(t => t.id === activePolicy)?.label || 'Customer Policies'}
              </h2>
              <p className="text-[10px] text-amber-300">Arabians Shopping Zone Official Guidelines</p>
            </div>
          </div>

          <button
            onClick={() => setActivePolicy(null)}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-emerald-900/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher Bar */}
        <div className="bg-[#021812] border-b border-emerald-900/80 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activePolicy === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePolicy(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  isActive 
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow' 
                    : 'text-emerald-200/80 hover:text-white hover:bg-emerald-900/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed bg-[#faf8f5]">
          
          {/* TAB 1: ABOUT US */}
          {activePolicy === 'about' && (
            <div className="space-y-4 max-w-3xl">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Heritage & Sunnah Mission</span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  About Arabians Shopping Zone
                </h3>
              </div>

              <p>
                Founded with a sacred commitment to reviving authentic Islamic lifestyles and Sunnah traditions, <strong>Arabians Shopping Zone</strong> is India's premier destination for genuine prophetic superfoods, royal Arabic apparel, sacred calligraphy art, and exquisite non-alcoholic fragrances.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-white border border-amber-500/20 shadow-sm space-y-1">
                  <div className="font-serif font-bold text-sm text-slate-900">100% Halal & Pure</div>
                  <p className="text-[11px] text-slate-600">Every batch of our stone-ground Talbina and Sidr honey is lab-tested and certified free from adulteration.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-amber-500/20 shadow-sm space-y-1">
                  <div className="font-serif font-bold text-sm text-slate-900">Authentic Arabic Cuts</div>
                  <p className="text-[11px] text-slate-600">Directly crafted with Dubai, Saudi, and Omani tailoring standards using wrinkle-free breathable luxury fabrics.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-amber-500/20 shadow-sm space-y-1">
                  <div className="font-serif font-bold text-sm text-slate-900">Direct Delivery</div>
                  <p className="text-[11px] text-slate-600">Pan-India express logistics with Cash on Delivery (COD) to every pin code across all states.</p>
                </div>
              </div>

              <h4 className="font-serif font-bold text-base text-slate-900 pt-2">Our Core Promise</h4>
              <p>
                We do not compromise on ingredients or cloth fibers. Whether you are enjoying a warm bowl of <strong>Arabian's Talbeena</strong> for morning vitality, applying aged <strong>Dehnul Oud</strong> for Jummah prayers, or ordering custom <strong>Nikah Nama Booklets</strong> for your sacred wedding, you receive uncompromised excellence.
              </p>
            </div>
          )}

          {/* TAB 2: SHIPPING & DELIVERY */}
          {activePolicy === 'shipping' && (
            <div className="space-y-4 max-w-3xl">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Fast & Insured Logistics</span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  Shipping & Delivery Policy
                </h3>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-700 shrink-0" />
                <span><strong>Free Express Shipping:</strong> Available on all Pan-India prepaid and COD orders above <strong>₹999</strong>! Orders below ₹999 incur a flat ₹70 nominal courier charge.</span>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">1. Dispatch Timelines</h4>
                <p>
                  All orders placed before 3:00 PM IST (Monday through Saturday) are dispatched from our central warehouse within <strong>24 business hours</strong>. Orders placed on Sundays or public gazetted holidays are processed on the next business day.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">2. Estimated Delivery Duration</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
                  <li><strong>Metro Cities (Hyderabad, Delhi NCR, Bangalore, Mumbai, Chennai, Kolkata):</strong> 2 to 4 business days.</li>
                  <li><strong>Tier 2 & Tier 3 Cities (Lucknow, Ahmedabad, Patna, Kozhikode, Srinagar, Bhopal):</strong> 3 to 5 business days.</li>
                  <li><strong>Remote / Northeast / Island Territories:</strong> 5 to 7 business days.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">3. Courier Partners & Tracking</h4>
                <p>
                  We partner with India's premier logistics carriers including <strong>BlueDart Express, Delhivery, DTDC, and Xpressbees</strong>. Once your parcel is scanned at the hub, you receive an automated SMS/WhatsApp with your real-time tracking number (AWB). You can also track status anytime on our <strong className="text-amber-800">Track Order Page</strong>.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">4. Cash on Delivery (COD) Rules</h4>
                <p>
                  COD is available across 99% of serviceable Indian pincodes. Our courier executive will present the parcel, collect cash or accept direct UPI QR payment at your doorstep upon handover.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: RETURN & REFUND POLICY */}
          {activePolicy === 'returns' && (
            <div className="space-y-4 max-w-3xl">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Hassle-Free Protection</span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  7-Day Return & Replacement Policy
                </h3>
              </div>

              <p>
                At <strong>Arabians Shopping Zone</strong>, customer satisfaction and trust are paramount. If you receive an item that is damaged during transit, defective, or incorrect, we offer a straightforward <strong>7-day replacement or refund guarantee</strong>.
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">👔 Thobes, Bisht & Wearing Products</h4>
                  <p className="text-xs text-slate-600">
                    If the size doesn't fit your height or shoulders, we provide <strong>100% Free Size Exchange</strong>. The garment must remain unwashed, unworn with original tags attached.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">🥣 Talbina & Organic Food Products</h4>
                  <p className="text-xs text-slate-600">
                    Due to hygiene and FSSAI health standards, opened food packages cannot be returned. However, if the tin/box arrives unsealed or crushed during transit, we provide an immediate <strong>100% Free Fresh Replacement</strong> with no questions asked.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">🌿 Attars, Dehnul Oud & Bakhoor</h4>
                  <p className="text-xs text-slate-600">
                    Fragrances with broken seals or damaged dropper vials will be replaced instantly.
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-slate-900 text-sm">How to Request a Return or Exchange:</h4>
                <ol className="list-decimal pl-5 space-y-1 text-xs text-slate-600">
                  <li>Take a clear photo or short video of the parcel or unworn item.</li>
                  <li>Message our dedicated WhatsApp team at <strong>+91 72338 62626</strong> (or call <strong>+91 92360 28318</strong>) with your Order ID.</li>
                  <li>Our support team will schedule a free reverse pickup from your doorstep within 24-48 hours.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 4: PRIVACY POLICY */}
          {activePolicy === 'privacy' && (
            <div className="space-y-4 max-w-3xl">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">Data Protection</span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  Privacy & Data Security Policy
                </h3>
              </div>

              <p>
                We value your trust and are committed to safeguarding your personal information under the Indian Information Technology Act and international privacy principles.
              </p>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">1. Information We Collect</h4>
                <p className="text-xs text-slate-600">
                  When you place an order on Arabians Shopping Zone, we collect your Full Name, Shipping Address, Contact Number, and Email Address solely to process orders, generate shipping labels, and send delivery updates.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">2. Zero Third-Party Sharing</h4>
                <p className="text-xs text-slate-600">
                  We <strong>NEVER sell, rent, or lease</strong> your contact information to telemarketers or external ad networks. Your phone number is only shared with our verified courier partner (e.g. BlueDart/Delhivery) for delivery delivery OTP coordination.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">3. Payment Security</h4>
                <p className="text-xs text-slate-600">
                  We do not store bank card numbers or UPI MPINs on our servers. All transactions are securely routed through certified 256-Bit SSL encrypted gateways.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: TERMS & CONDITIONS */}
          {activePolicy === 'terms' && (
            <div className="space-y-4 max-w-3xl">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Legal Terms</span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  Terms & Conditions of Service
                </h3>
              </div>

              <p>
                By browsing or purchasing from <strong>Arabians Shopping Zone</strong>, you agree to the following terms:
              </p>

              <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600">
                <li><strong>Product Accuracy:</strong> We endeavor to display colors, sizes, and nutritional packaging as accurately as possible. Slight variations in fabric shade may occur due to studio lighting.</li>
                <li><strong>Halal Ethos:</strong> All food products and fragrance oils are strictly non-alcoholic, Halal compliant, and free from unlawful derivatives.</li>
                <li><strong>Order Cancellation:</strong> Customers may cancel an order before it has been dispatched from our warehouse by contacting WhatsApp support. Once dispatched, standard return/exchange procedures apply.</li>
                <li><strong>Intellectual Property:</strong> All logos, packaging visuals, and promotional videos of "Arabians Shopping Zone" and "Arabian's Talbeena" are proprietary assets.</li>
              </ul>
            </div>
          )}

          {/* TAB 6: CONTACT US */}
          {activePolicy === 'contact' && (
            <div className="space-y-6 max-w-3xl">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Direct Customer Care</span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  Contact Arabians Shopping Zone
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <a
                  href={getGeneralSupportWhatsAppUrl('Policy & Customer Assistance', settings.whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 hover:bg-emerald-100 transition space-y-1 block shadow-sm"
                >
                  <MessageSquare className="w-5 h-5 text-emerald-700" />
                  <div className="font-bold text-xs sm:text-sm">WhatsApp Only</div>
                  <div className="text-xs font-mono font-bold text-emerald-800">+91 72338 62626</div>
                  <div className="text-[10px] text-emerald-600 font-medium">Instant Chat • Sizing</div>
                </a>

                <a
                  href="tel:+919236028318"
                  className="p-3.5 rounded-2xl bg-emerald-900 border border-emerald-700 text-white hover:bg-emerald-800 transition space-y-1 block shadow-sm"
                >
                  <Phone className="w-5 h-5 text-amber-400" />
                  <div className="font-bold text-xs sm:text-sm text-white">Call Helpline</div>
                  <div className="text-xs font-mono font-bold text-amber-300">+91 92360 28318</div>
                  <div className="text-[10px] text-emerald-200 font-medium">Direct Voice Call</div>
                </a>

                <a
                  href="mailto:arabiansshoppingzone@gmail.com"
                  className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 hover:bg-amber-100 transition space-y-1 block shadow-sm"
                >
                  <Mail className="w-5 h-5 text-amber-700" />
                  <div className="font-bold text-xs sm:text-sm">Official Email</div>
                  <div className="text-[11px] font-mono font-semibold text-amber-800 break-all">arabiansshoppingzone@gmail.com</div>
                  <div className="text-[10px] text-amber-600 font-medium">Replies &lt; 12 Hours</div>
                </a>

                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-2xl bg-slate-100 border border-slate-300 text-slate-950 hover:bg-slate-200 transition space-y-1 block shadow-sm"
                >
                  <MapPin className="w-5 h-5 text-slate-700" />
                  <div className="font-bold text-xs sm:text-sm">Visit Store</div>
                  <div className="text-xs text-slate-700">Open on Google Maps</div>
                  <div className="text-[10px] text-slate-500 font-medium">Physical Market Shop</div>
                </a>
              </div>

              {/* Direct Message Form */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h4 className="font-serif font-bold text-base text-slate-900">
                  Send Us a Direct Message:
                </h4>

                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1 text-xs">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Salman Qureshi"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1 text-xs">Phone / WhatsApp Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit number"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 text-xs">Subject:</label>
                    <select
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                    >
                      <option>General Inquiry</option>
                      <option>Order Status Inquiry</option>
                      <option>Talbina Bulk Wholesale</option>
                      <option>Thobe Sizing Guidance</option>
                      <option>Nikah Nama Customization</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1 text-xs">Your Message *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="How can we assist you today?..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingContact}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs hover:from-amber-400 hover:to-amber-500 transition shadow-gold"
                  >
                    {submittingContact ? 'Sending Message...' : 'Send Message to Customer Care'}
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 shrink-0">
          <div>
            Need immediate help? Call <strong>+91 92360 28318</strong> or WhatsApp <strong>+91 72338 62626</strong>
          </div>
          <button
            onClick={() => setActivePolicy(null)}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}
