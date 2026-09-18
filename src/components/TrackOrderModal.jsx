import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ExternalLink,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getTrackOrderWhatsAppUrl } from '../utils/whatsapp';

export default function TrackOrderModal() {
  const { isTrackOpen, setIsTrackOpen, settings } = useStore();
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if session has a pre-filled tracking ID
  useEffect(() => {
    if (isTrackOpen) {
      const savedId = sessionStorage.getItem('asz_track_id');
      if (savedId) {
        setQuery(savedId);
        handleSearch(savedId);
        sessionStorage.removeItem('asz_track_id');
      } else {
        // Preload default demo order so user sees the beauty immediately!
        handleSearch('ASZ-1089');
        setQuery('ASZ-1089');
      }
    }
  }, [isTrackOpen]);

  if (!isTrackOpen) return null;

  const handleSearch = async (targetQuery = query) => {
    const q = (targetQuery || '').trim();
    if (!q) return;

    try {
      setLoading(true);
      setError('');
      const res = await fetch(`/api/orders/track/${encodeURIComponent(q)}`, { cache: 'no-store' });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'No matching order found. Please check Order ID or Phone.');
        setOrder(null);
      } else {
        const data = await res.json();
        const resolved = data.order || (data.id ? data : null);
        if (resolved) {
          setOrder(resolved);
          setError('');
        } else {
          setError(data.message || data.error || 'No matching order found.');
          setOrder(null);
        }
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-amber-500/30 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#032219] text-white flex items-center justify-between border-b border-amber-500/20 shrink-0">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif text-lg sm:text-xl font-bold">Live Order Tracking</h2>
          </div>
          <button
            onClick={() => setIsTrackOpen(false)}
            className="p-1 rounded-full text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6">
          
          {/* Search Box */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Enter Order ID (e.g. ASZ-1089) or Customer Phone:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="e.g. ASZ-1089 or 9871234560"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium uppercase"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <button
                onClick={() => handleSearch()}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs sm:text-sm hover:from-amber-400 hover:to-amber-500 transition shadow-gold"
              >
                {loading ? 'Searching...' : 'Track'}
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Tracking Result View */}
          {order && (
            <div className="space-y-6 pt-2 animate-fadeIn">
              
              {/* Order Status Banner */}
              <div className="bg-gradient-to-r from-emerald-900 to-[#032219] text-white p-5 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-amber-300 font-semibold uppercase tracking-wider">
                    Current Status
                  </div>
                  <div className="text-2xl font-black font-serif text-white mt-0.5">
                    {order.status}
                  </div>
                  <div className="text-xs text-emerald-200/80 mt-1">
                    Courier: <strong>{order.courier || 'Express Network'}</strong> • AWB: <strong>{order.trackingNumber}</strong>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10 text-right sm:text-left text-xs">
                  <div className="text-slate-300 text-[11px]">Destination</div>
                  <div className="font-bold text-white">{order.customer?.city}, {order.customer?.state}</div>
                  <div className="text-[11px] text-amber-300 font-mono mt-0.5">{order.id}</div>
                </div>
              </div>

              {/* Step-by-Step Stepper Timeline */}
              <div className="space-y-3 bg-[#faf8f5] p-5 rounded-2xl border border-amber-900/10">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Shipment Milestones
                </h4>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {order.timeline?.map((step, idx) => (
                    <div key={idx} className="relative flex items-start gap-3 text-xs">
                      <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        step.done 
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' 
                          : 'bg-slate-200 text-slate-500'
                      }`}>
                        {step.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                      </div>
                      <div>
                        <div className={`font-bold ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.status}
                        </div>
                        <div className="text-[11px] text-slate-500">{step.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items in parcel */}
              <div className="space-y-2 border-t border-slate-200 pt-4 text-xs">
                <div className="font-bold text-slate-900">Ordered Items ({order.items?.length}):</div>
                <div className="space-y-1.5">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-slate-600 bg-slate-50 p-2 rounded-lg">
                      <span>{item.name} x {item.quantity}</span>
                      <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1 mt-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">₹{order.subtotal || order.total}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Coupon Discount:</span>
                      <span className="font-mono">-₹{order.discount}</span>
                    </div>
                  )}
                  {order.onlineDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Online Payment Discount:</span>
                      <span className="font-mono">-₹{order.onlineDiscount}</span>
                    </div>
                  )}
                  {order.codFee > 0 && (
                    <div className="flex justify-between text-amber-700 font-bold">
                      <span>COD Handling Fee:</span>
                      <span className="font-mono">+₹{order.codFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>Pan-India Delivery:</span>
                    <span className={order.deliveryFee === 0 || !order.deliveryFee ? "text-emerald-700 font-bold" : "font-mono font-bold"}>
                      {order.deliveryFee === 0 || !order.deliveryFee ? 'FREE' : `₹${order.deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between font-black text-slate-950 pt-1.5 border-t border-slate-200 text-sm">
                    <span>Total Amount ({order.paymentMode?.toUpperCase() || order.paymentMethod?.toUpperCase() || 'COD'}):</span>
                    <span className="text-emerald-800 font-mono text-base">₹{order.total}</span>
                  </div>
                </div>
              </div>

              {/* Need Help CTA */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs">
                <div className="flex items-center gap-2 text-emerald-900">
                  <MessageSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Have questions regarding your delivery?</span>
                </div>
                <a
                  href={getTrackOrderWhatsAppUrl(order.id, order.customerName, order.status, settings.whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-800 text-white font-bold hover:bg-emerald-900 transition whitespace-nowrap"
                >
                  WhatsApp Help
                </a>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
