import React from 'react';
import { 
  CheckCircle2, 
  Truck, 
  Printer, 
  ArrowRight, 
  Sparkles, 
  Package, 
  Calendar, 
  MapPin, 
  Phone,
  MessageSquare
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function OrderSuccessModal() {
  const { placedOrder, setPlacedOrder, setIsTrackOpen, settings } = useStore();

  if (!placedOrder) return null;

  const handleTrack = () => {
    const id = placedOrder.id;
    setPlacedOrder(null);
    setIsTrackOpen(true);
    // Store id in sessionStorage for auto-search
    sessionStorage.setItem('asz_track_id', id);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-amber-500/40 p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Celebration Icon */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto border-4 border-emerald-200 shadow-emerald animate-bounce">
            <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Mubarak! Order Placed Successfully</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#032219]">
            Thank You, {placedOrder.customer?.name}!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Your sacred parcel is being prepared with immense care at our warehouse. We have sent confirmation details to your phone.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-[#faf8f5] rounded-2xl p-4 sm:p-5 border border-amber-900/10 space-y-3.5 text-xs sm:text-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Order ID</span>
              <div className="font-mono text-base font-black text-[#064e3b]">{placedOrder.id}</div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Payment Mode</span>
              <div className="font-bold text-slate-900">{placedOrder.paymentMethod}</div>
            </div>
          </div>

          {/* Delivery Address Snapshot */}
          <div className="flex items-start gap-2.5 text-slate-700">
            <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-slate-900">Shipping Destination:</div>
              <p className="text-xs text-slate-600">
                {placedOrder.customer?.address}, {placedOrder.customer?.city}, {placedOrder.customer?.state} - {placedOrder.customer?.pincode}
              </p>
              <div className="text-[11px] text-slate-500 mt-0.5">Phone: +91 {placedOrder.customer?.phone}</div>
            </div>
          </div>

          {/* Items Summary */}
          <div className="space-y-1.5 pt-2 border-t border-slate-200">
            <div className="font-semibold text-slate-900 text-xs">Items in Parcel ({placedOrder.items?.length}):</div>
            {placedOrder.items?.map((item, i) => (
              <div key={i} className="flex justify-between text-xs text-slate-600">
                <span>{item.name} x {item.quantity}</span>
                <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="flex justify-between font-black text-slate-950 pt-2 border-t border-slate-300 text-sm">
              <span>Total Paid / Due on Delivery:</span>
              <span className="text-emerald-800 text-base">₹{placedOrder.total}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={handleTrack}
            className="w-full py-3.5 rounded-xl bg-[#032219] text-amber-300 font-bold text-xs sm:text-sm hover:bg-[#063e2e] transition shadow-md flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4 text-amber-400" />
            <span>Track Order Status Live ({placedOrder.id})</span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={handlePrint}
              className="py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={() => setPlacedOrder(null)}
              className="py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-bold hover:from-amber-400 hover:to-amber-500 transition flex items-center justify-center gap-1.5 shadow-gold"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
