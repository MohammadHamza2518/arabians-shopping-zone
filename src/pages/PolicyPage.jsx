import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Truck, RotateCcw, ShieldCheck, FileText, Sparkles, PhoneCall, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function PolicyPage() {
  const location = useLocation();
  const { settings } = useStore();

  const getPolicyType = () => {
    const path = location.pathname;
    if (path.includes('shipping')) return 'shipping';
    if (path.includes('return')) return 'returns';
    if (path.includes('privacy')) return 'privacy';
    if (path.includes('terms')) return 'terms';
    if (path.includes('about')) return 'about';
    return 'shipping';
  };

  const currentType = getPolicyType();

  const tabs = [
    { id: 'shipping', path: '/shipping-policy', label: 'Shipping & Delivery', icon: Truck },
    { id: 'returns', path: '/return-policy', label: '7-Day Return & Exchange', icon: RotateCcw },
    { id: 'privacy', path: '/privacy-policy', label: 'Privacy & Security', icon: ShieldCheck },
    { id: 'terms', path: '/terms', label: 'Terms & Conditions', icon: FileText },
    { id: 'about', path: '/about', label: 'About Arabians', icon: Sparkles },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fadeIn">
      
      {/* Breadcrumbs - Hidden on mobile */}
      <nav className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-amber-700 transition">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Store Guidelines</span>
      </nav>

      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-[#032219] via-[#053527] to-[#032219] text-white p-6 sm:p-10 rounded-3xl border border-amber-500/30 shadow-xl space-y-2">
        <span className="text-xs font-bold text-amber-300 uppercase tracking-widest bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
          Official Arabians Policy
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-white">
          {tabs.find(t => t.id === currentType)?.label || 'Customer Policies'}
        </h1>
        <p className="text-xs sm:text-sm text-emerald-200/80 max-w-2xl">
          Operating with complete transparency, Sunnah ethics, and verified Indian consumer protection standards.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentType === tab.id;
          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-slate-950 text-white shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:border-amber-400'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-amber-500" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Main Policy Content Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm leading-relaxed text-slate-700 text-xs sm:text-sm space-y-6">
        
        {/* SHIPPING POLICY */}
        {currentType === 'shipping' && (
          <div className="space-y-6 max-w-3xl">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-center gap-3">
              <Truck className="w-6 h-6 text-emerald-700 shrink-0" />
              <div>
                <strong>Free Express Pan-India Shipping:</strong> Applied automatically on all orders above <strong>₹999</strong>. Orders under ₹999 carry a flat ₹70 logistics fee.
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-bold text-base text-slate-900">1. Fast 24-Hour Dispatch</h3>
              <p>
                Every order placed before 3:00 PM IST is packed and dispatched from our primary facility within 24 business hours. Each item is double-checked for quality, sealed with tamper-proof security tape, and handed over to our verified national courier partners.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-bold text-base text-slate-900">2. Estimated Delivery Timelines</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Metro Cities (Hyderabad, Bangalore, Mumbai, Delhi NCR, Chennai, Kolkata):</strong> 2 to 4 working days.</li>
                <li><strong>State Capitals & Tier 2 Cities (Lucknow, Ahmedabad, Patna, Kozhikode, Srinagar, Bhopal):</strong> 3 to 5 working days.</li>
                <li><strong>Rural Pincodes & Remote Territories:</strong> 5 to 7 working days.</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-bold text-base text-slate-900">3. Premier Courier Network</h3>
              <p>
                We do not use unverified local parcel services. We exclusively partner with <strong>BlueDart Express, Delhivery, and DTDC</strong> to ensure prompt delivery and live AWB tracking.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-bold text-base text-slate-900">4. Cash on Delivery (COD)</h3>
              <p>
                COD is available across over 19,000+ Indian pincodes. Customers can inspect the sealed package and pay using cash or any UPI app (GPay/PhonePe) directly to the delivery personnel upon handover.
              </p>
            </div>
          </div>
        )}

        {/* RETURN & REFUND POLICY */}
        {currentType === 'returns' && (
          <div className="space-y-6 max-w-3xl">
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-lg text-slate-900">Our 7-Day Hassle-Free Guarantee</h3>
              <p>
                Customer happiness and honor are our sacred duty. If an item arrives damaged, flawed, or does not meet your expectations, we provide a smooth <strong>7-Day return or replacement</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">👔 Men's Thobes & Attire</h4>
                <p className="text-xs text-slate-600">
                  If the collar or length doesn't fit comfortably, we provide <strong>100% Free Doorstep Size Exchange</strong>. Garments must be unworn with tags attached.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">🥣 Talbina & Pure Honey</h4>
                <p className="text-xs text-slate-600">
                  Under FSSAI food hygiene protocols, opened food jars cannot be returned. However, if any jar or box arrives crushed or seal-compromised, we ship an <strong>Immediate Free Replacement</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">🌿 Dehnul Oud & Attars</h4>
                <p className="text-xs text-slate-600">
                  Any perfume or oil with damaged dropper vials or leakage during transit is replaced within 48 hours.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">🖼️ 3D Decor & Nikah Books</h4>
                <p className="text-xs text-slate-600">
                  Any hairline damage or acrylic cracking during shipment qualifies for an immediate fresh unit dispatch.
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-100">
              <h4 className="font-serif font-bold text-sm text-slate-900">How to Initiate a Return / Exchange:</h4>
              <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-600">
                <li>Take a clear picture of the outer parcel label and item.</li>
                <li>WhatsApp our dedicated returns helpline at <strong>+91 72338 62626</strong> (or call <strong>+91 92360 28318</strong>) with your Order ID.</li>
                <li>Our operations team will arrange free reverse courier pickup from your home.</li>
              </ol>
            </div>
          </div>
        )}

        {/* PRIVACY POLICY */}
        {currentType === 'privacy' && (
          <div className="space-y-6 max-w-3xl">
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-base text-slate-900">Your Privacy is Sacred</h3>
              <p>
                We handle your personal contact and address details under strict Indian IT privacy regulations and ethical Sunnah commerce principles.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">1. Zero Third-Party Monetization</h4>
              <p>
                We <strong>NEVER sell, share, or monetize</strong> your phone number, email address, or home address to marketing brokers, spam databases, or third-party advertisers. Your phone number is strictly used for delivery OTP coordinates and WhatsApp order notifications.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">2. High-Grade 256-Bit SSL Encryption</h4>
              <p>
                All data transmission between your browser and our servers is encrypted using bank-grade 256-bit SSL protocols. We do not store credit/debit card numbers or UPI MPINs on our servers.
              </p>
            </div>
          </div>
        )}

        {/* TERMS & CONDITIONS */}
        {currentType === 'terms' && (
          <div className="space-y-6 max-w-3xl">
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-base text-slate-900">Terms of Service</h3>
              <p>
                By placing an order on Arabians Shopping Zone, you acknowledge and agree to the following terms:
              </p>
            </div>

            <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600">
              <li><strong>Halal Authenticity Guarantee:</strong> All food items, non-alcoholic perfume oils, and clothing items conform to genuine Islamic dietary and ritual standards.</li>
              <li><strong>Pricing Integrity:</strong> Prices displayed on our storefront are all-inclusive of statutory taxes. Any promotional discount code must be applied prior to checkout completion.</li>
              <li><strong>Order Cancellation:</strong> You may cancel an order before dispatch by sending a quick WhatsApp message. Once the courier AWB is generated, standard return and exchange procedures apply.</li>
            </ul>
          </div>
        )}

        {/* ABOUT US */}
        {currentType === 'about' && (
          <div className="space-y-6 max-w-3xl">
            <div className="space-y-2">
              <h3 className="font-serif font-bold text-xl text-slate-900">Our Heritage & Sunnah Mission</h3>
              <p>
                <strong>Arabians Shopping Zone</strong> was founded with a singular noble vision: to make authentic prophetic nutrition, majestic Arabic craftsmanship, and sacred Islamic lifestyle essentials easily accessible to every Muslim household across India.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1">
                <div className="font-serif font-bold text-sm text-amber-950">Pure Sunnah Superfoods</div>
                <p className="text-xs text-amber-800">Stone-ground sprouted barley Talbina and wild raw Sidr honey formulated for heart, digestive, and physical vitality.</p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                <div className="font-serif font-bold text-sm text-emerald-950">Master Emirati Tailoring</div>
                <p className="text-xs text-emerald-800">Bespoke thobes, bishts, and prayer turbans tailored with wrinkle-free fabrics and dignified Arabian cuts.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 space-y-1">
                <div className="font-serif font-bold text-sm text-slate-950">Sacred Nikah & Decor</div>
                <p className="text-xs text-slate-700">Handbound velvet Nikah certificate books, signing pens, and 3D mirror gold acrylic calligraphy for Islamic homes.</p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Assistance Box */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-serif font-bold text-base text-amber-300">Have a Question About Our Policies?</h4>
          <p className="text-xs text-slate-400">Our customer care desk is ready on WhatsApp to assist you.</p>
        </div>
        <Link
          to="/contact"
          className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition"
        >
          Contact Customer Care
        </Link>
      </div>

    </div>
  );
}
