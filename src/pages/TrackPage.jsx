import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  MessageSquare, 
  ArrowLeft,
  ShieldCheck,
  Package,
  Zap,
  PhoneCall,
  ExternalLink,
  Sparkles,
  Copy,
  Check,
  RefreshCw
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getTrackOrderWhatsAppUrl } from '../utils/whatsapp';

export default function TrackPage() {
  const [searchParams] = useSearchParams();
  const { settings, showToast } = useStore();

  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedAwb, setCopiedAwb] = useState(false);

  const fetchTracking = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(searchQuery.trim())}?_t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      const resolvedOrder = data.order || (data.id ? data : null);
      if (resolvedOrder) {
        setOrder(resolvedOrder);
        setAllOrders(data.allOrders || [resolvedOrder]);
      } else {
        setOrder(null);
        setAllOrders([]);
        setErrorMsg(data.message || data.error || 'No active shipment found with this Order ID or Phone number.');
      }
    } catch {
      setOrder(null);
      setAllOrders([]);
      setErrorMsg('Failed to connect to tracking server. Please check your internet connection.');
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  useEffect(() => {
    const q = searchParams.get('query');
    if (q) {
      setQuery(q);
      fetchTracking(q);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTracking(query);
  };

  const handleCopyAwb = (awb) => {
    if (!awb) return;
    navigator.clipboard.writeText(awb);
    setCopiedAwb(true);
    if (showToast) showToast(`AWB Tracking Number ${awb} copied!`);
    setTimeout(() => setCopiedAwb(false), 2500);
  };

  const getCarrierLiveUrl = (courierName, awb) => {
    if (!awb) return null;
    const c = (courierName || '').toLowerCase();
    if (c.includes('bluedart')) return `https://www.bluedart.com/tracking?numbers=${encodeURIComponent(awb)}`;
    if (c.includes('delhivery')) return `https://www.delhivery.com/track/package/${encodeURIComponent(awb)}`;
    if (c.includes('dtdc')) return `https://www.dtdc.in/tracking/shipment-tracking.asp?strCnno=${encodeURIComponent(awb)}`;
    if (c.includes('india post') || c.includes('speed post')) return `https://www.indiapost.gov.in/_layouts/15/dpt.cept.trackconsignment/trackconsignment.aspx`;
    if (c.includes('shiprocket')) return `https://shiprocket.co/tracking/${encodeURIComponent(awb)}`;
    return `https://www.google.com/search?q=${encodeURIComponent(`${courierName || 'Courier'} tracking ${awb}`)}`;
  };

  const statusSteps = [
    { key: 'placed', label: 'Order Placed', desc: 'Logged in store registry & payment verified' },
    { key: 'confirmed', label: 'Verified & Packed', desc: 'Sealed with tamper-proof halal guarantee tape' },
    { key: 'dispatched', label: 'Dispatched (BlueDart Air)', desc: 'Handed to express logistics hub' },
    { key: 'in_transit', label: 'In Transit to Hub', desc: 'Moving towards destination city hub' },
    { key: 'delivered', label: 'Delivered', desc: 'Safely handed to customer' }
  ];

  const getStepIndex = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'delivered') return 4;
    if (s === 'in transit' || s === 'in_transit') return 3;
    if (s === 'dispatched') return 2;
    if (s === 'confirmed' || s === 'packing' || s === 'processing') return 1;
    return 0; // placed
  };

  return (
    <div className="min-h-[85vh] bg-[#faf8f5] py-8 sm:py-16 px-4 sm:px-6 lg:px-8 flex flex-col justify-start">
      <SEO 
        title="Live Order Tracking & Express Logistics | Arabians Shopping Zone"
        description="Track your Arabians Shopping Zone order in real time. Enter your Order ID or phone number to check BlueDart, Delhivery, and DTDC courier status and estimated dispatch time."
        keywords="track order arabians shopping zone, shipment status, bluedart live tracking, courier tracking islamic store"
        canonical="https://arabiansshoppingzone.com/track"
      />
      <div className="max-w-3xl mx-auto w-full space-y-8 animate-fadeIn">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-950 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Storefront</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-100/70 border border-emerald-300/60 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Courier Gateway Active</span>
          </div>
        </div>

        {/* Dedicated Tracking Portal Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-amber-900/15 shadow-xl space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 text-amber-800 mx-auto flex items-center justify-center shadow-inner">
              <Truck className="w-7 h-7" />
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-950 text-[11px] font-bold">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>EXPRESS PAN-INDIA DISPATCH</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#032219] tracking-tight">
              Track Your Arabians Parcel
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Enter your Order ID (e.g. <strong>ASZ-1089</strong>), 10-digit mobile number, or Courier AWB number to track live shipment status.
            </p>
          </div>

          {/* Search Input Box */}
          <form onSubmit={handleSearch} className="max-w-xl mx-auto space-y-3">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  required
                  placeholder="Order ID, Phone No., or AWB..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 bg-slate-50/50 text-sm font-medium focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition shadow-inner"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-sm hover:scale-[1.02] shadow-gold transition active:scale-95 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Truck className="w-4 h-4" />}
                <span>{loading ? 'Locating...' : 'Track Parcel'}</span>
              </button>
            </div>
          </form>

          {/* Multiple Orders Found Selector (e.g. customer phone match) */}
          {allOrders.length > 1 && (
            <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200 space-y-2">
              <span className="text-[11px] font-bold text-amber-900 block">
                Found {allOrders.length} orders for this account. Select order to view:
              </span>
              <div className="flex flex-wrap gap-2">
                {allOrders.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setOrder(o)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                      order?.id === o.id
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-700 hover:border-amber-400'
                    }`}
                  >
                    <span>{o.id}</span>
                    <span className="text-[10px] uppercase font-sans font-semibold">({o.status})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tracking Result View */}
          {order && (
            <div className="pt-4 border-t border-slate-100 space-y-6 animate-fadeIn">
              
              {/* Header Status Card */}
              <div className="p-5 sm:p-6 rounded-2xl bg-[#032219] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-amber-500/30 shadow-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider">Current Shipment Status</span>
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  </div>
                  <div className="font-serif text-2xl sm:text-3xl font-bold uppercase tracking-wide text-white mt-0.5">
                    {order.status}
                  </div>
                  <div className="text-xs text-emerald-200/80 mt-1 flex flex-wrap items-center gap-2">
                    <span>Carrier: <strong>{order.courier || 'BlueDart Express Air'}</strong></span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      AWB: <strong className="font-mono text-amber-300">{order.trackingId || order.trackingNumber || 'BD982341982IN'}</strong>
                      <button
                        type="button"
                        onClick={() => handleCopyAwb(order.trackingId || order.trackingNumber || 'BD982341982IN')}
                        className="p-1 hover:bg-white/10 rounded transition text-amber-300"
                        title="Copy AWB Tracking Number"
                      >
                        {copiedAwb ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                  <div className="bg-emerald-950/80 border border-amber-500/30 px-4 py-2 rounded-xl text-left sm:text-right w-full sm:w-auto">
                    <span className="text-[10px] text-slate-400 block">Shipping Destination:</span>
                    <span className="text-xs font-bold text-amber-300 block">
                      {order.address ? order.address.split(',')[0] : (order.customer ? `${order.customer.city}, ${order.customer.state}` : 'India')}
                    </span>
                    <span className="text-[11px] text-slate-300 block font-mono">Order Ref: {order.id}</span>
                  </div>

                  {/* 1-Click Live Carrier External Link */}
                  {order.trackingNumber || order.trackingId ? (
                    <a
                      href={getCarrierLiveUrl(order.courier, order.trackingNumber || order.trackingId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-300 hover:text-amber-200 bg-white/10 hover:bg-white/15 px-3 py-1 rounded-lg border border-amber-500/30 transition shadow-sm"
                    >
                      <span>Track on Official {order.courier || 'Courier'} Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : null}
                </div>
              </div>

              {/* 5-Step Visual Stepper */}
              <div className="py-2 px-2 sm:px-4">
                <h3 className="font-serif font-bold text-sm text-[#032219] mb-6 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Real-Time Shipment Milestones</span>
                </h3>

                <div className="relative pl-6 space-y-8 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {statusSteps.map((step, idx) => {
                    const currentIdx = getStepIndex(order.status);
                    const isPassed = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div key={step.key} className="relative flex items-start gap-4">
                        <div className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all ${
                          isPassed 
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' 
                            : 'bg-white border-slate-300 text-slate-400'
                        }`}>
                          {isPassed ? '✓' : idx + 1}
                        </div>

                        <div className="space-y-0.5">
                          <div className={`font-bold text-xs sm:text-sm ${
                            isCurrent ? 'text-emerald-800' : isPassed ? 'text-slate-900' : 'text-slate-400'
                          }`}>
                            {step.label}
                            {isCurrent && (
                              <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
                                Current Active Stage
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500">{step.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Parcel Contents */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Parcel Contents ({order.items?.length || 0} items):</span>
                  <span className="text-slate-900 font-mono font-bold">Total: ₹{order.total} ({order.paymentMode?.toUpperCase() || order.paymentMethod?.toUpperCase() || 'COD'})</span>
                </div>

                <div className="space-y-2">
                  {order.items && order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-3 rounded-2xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img src={item.image} alt="" className="w-10 h-10 rounded-xl object-contain bg-white p-1 border" />
                        )}
                        <div>
                          <div className="font-bold text-slate-900">{item.name}</div>
                          {item.selectedSize && <div className="text-[10px] text-amber-800 font-medium">Size: {item.selectedSize}</div>}
                        </div>
                      </div>
                      <div className="font-semibold text-slate-800">
                        Qty: {item.quantity} • <span className="font-bold text-emerald-900">₹{item.price * item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Financial Breakdown */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-mono font-bold">₹{order.subtotal || order.total}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Coupon Discount ({order.couponCode || 'PROMO'})</span>
                      <span className="font-mono">-₹{order.discount}</span>
                    </div>
                  )}
                  {order.onlineDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Online Payment Savings</span>
                      <span className="font-mono">-₹{order.onlineDiscount}</span>
                    </div>
                  )}
                  {order.codFee > 0 && (
                    <div className="flex justify-between text-amber-700 font-bold">
                      <span>COD Handling Fee</span>
                      <span className="font-mono">+₹{order.codFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Pan-India Delivery</span>
                    <span className={order.deliveryFee === 0 || !order.deliveryFee ? "text-emerald-700 font-bold" : "font-mono font-bold text-slate-800"}>
                      {order.deliveryFee === 0 || !order.deliveryFee ? 'FREE' : `₹${order.deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-black text-slate-950 pt-2 border-t border-slate-200 text-sm">
                    <span>Total Amount ({order.paymentMode?.toUpperCase() || order.paymentMethod?.toUpperCase() || 'COD'})</span>
                    <span className="text-emerald-800 font-mono text-base">₹{order.total}</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Support */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5 text-center sm:text-left">
                  <span className="font-bold text-emerald-950 block">Need Address Correction or Expedited Delivery?</span>
                  <span className="text-emerald-800/80">Our dedicated dispatch desk is on standby to assist you directly.</span>
                </div>
                <a
                  href={getTrackOrderWhatsAppUrl(order.id, order.customerName || order.customer?.name, order.status, settings.whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition flex items-center gap-2 shadow-sm whitespace-nowrap"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Dispatch Desk</span>
                </a>
              </div>

            </div>
          )}

          {/* Error / Not Found View */}
          {searched && !order && errorMsg && (
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="bg-rose-50 rounded-2xl border border-rose-200 p-6 text-center space-y-2 max-w-md mx-auto">
                <div className="text-2xl">⚠️</div>
                <h3 className="font-serif font-bold text-sm text-rose-950">Shipment Record Not Found</h3>
                <p className="text-xs text-rose-700 leading-relaxed">{errorMsg}</p>
                <p className="text-[11px] text-slate-500 pt-1">
                  Please verify the Order ID received in your confirmation WhatsApp message, or enter the 10-digit mobile number used during checkout.
                </p>
              </div>

              {/* Direct Courier Links fallback if customer entered an external AWB */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                <span className="text-xs text-slate-600 block">Have a direct carrier AWB number from BlueDart or Delhivery?</span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <a
                    href={`https://www.bluedart.com/tracking?numbers=${encodeURIComponent(query)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl flex items-center gap-1"
                  >
                    <span>Track on BlueDart Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={`https://www.delhivery.com/track/package/${encodeURIComponent(query)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-amber-800 hover:text-amber-950 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl flex items-center gap-1"
                  >
                    <span>Track on Delhivery Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* 3 Trust Pillars at bottom of card */}
          <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center gap-2 text-xs font-semibold text-slate-700">
              <Zap className="w-4 h-4 text-amber-600" />
              <span>Same-Day Dispatch</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center gap-2 text-xs font-semibold text-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Tamper-Proof Halal Seal</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center gap-2 text-xs font-semibold text-slate-700">
              <Truck className="w-4 h-4 text-amber-600" />
              <span>Express Pan-India COD</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
