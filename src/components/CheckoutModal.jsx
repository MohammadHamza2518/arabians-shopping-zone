import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  QrCode, 
  Banknote, 
  MessageSquare, 
  ArrowRight, 
  Lock,
  Tag
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { getCartOrderWhatsAppUrl } from '../utils/whatsapp';

export default function CheckoutModal() {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartSubtotal, 
    couponDiscount, 
    deliveryFee, 
    cartTotal, 
    appliedCoupon, 
    createOrder,
    settings,
    showToast
  } = useStore();

  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD', 'UPI', 'WHATSAPP'
  const [submitting, setSubmitting] = useState(false);

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  if (!isCheckoutOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customer.name || !customer.phone || !customer.address || !customer.city || !customer.pincode) {
      showToast("Please fill in all mandatory shipping fields.", "error");
      return;
    }
    if (customer.phone.replace(/\D/g, '').length < 10) {
      showToast("Please enter a valid 10-digit phone number.", "error");
      return;
    }

    setSubmitting(true);

    if (paymentMethod === 'WHATSAPP') {
      // Create order first
      const order = await createOrder(customer, 'WhatsApp Order');
      setSubmitting(false);
      if (order) {
        const waUrl = getCartOrderWhatsAppUrl({
          orderId: order.id,
          customer,
          items: cart.map(i => ({ 
            name: i.product.name, 
            price: i.product.price, 
            quantity: i.quantity, 
            selectedSize: i.selectedSize || i.variant,
            customization: i.customization || null
          })),
          total: cartTotal,
          paymentMethod: 'WhatsApp Direct Order'
        }, settings.whatsapp);
        window.open(waUrl, '_blank');
      }
    } else {
      await createOrder(customer, paymentMethod);
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-amber-500/30 my-8 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#032219] text-white flex items-center justify-between border-b border-amber-500/20 shrink-0">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <h2 className="font-serif text-lg sm:text-xl font-bold">Secure Checkout</h2>
            <span className="text-[11px] bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-700">
              100% Encrypted
            </span>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1 rounded-full text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="overflow-y-auto p-5 sm:p-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Shipping & Payment */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Shipping Details */}
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">
                    1
                  </span>
                  <span>Delivery Address & Contact</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tariq Hashmi"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit number"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="text-xs sm:text-sm">
                  <label className="block font-semibold text-slate-700 mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="For invoice & tracking updates"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="text-xs sm:text-sm">
                  <label className="block font-semibold text-slate-700 mb-1">Street Address / House No. / Landmark *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Flat/House No, Building Name, Street, Landmark"
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-xs sm:text-sm">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Hyderabad"
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">State *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Telangana"
                      value={customer.state}
                      onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="6 digits"
                      value={customer.pincode}
                      onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3 pt-2">
                <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xs font-black">
                    2
                  </span>
                  <span>Choose Payment Mode</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* COD */}
                  <div
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'COD'
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                        : 'border-slate-200 hover:border-amber-400 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Banknote className="w-5 h-5 text-emerald-700" />
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900">Cash On Delivery</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Pay at your doorstep</div>
                  </div>

                  {/* UPI / QR Code */}
                  <div
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'UPI'
                        ? 'border-amber-600 bg-amber-50/70 shadow-sm'
                        : 'border-slate-200 hover:border-amber-400 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <QrCode className="w-5 h-5 text-amber-700" />
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'UPI'}
                        onChange={() => setPaymentMethod('UPI')}
                        className="text-amber-600 focus:ring-amber-500"
                      />
                    </div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900">Instant UPI / QR</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">GPay, PhonePe, Paytm</div>
                  </div>

                  {/* WhatsApp Direct */}
                  <div
                    onClick={() => setPaymentMethod('WHATSAPP')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === 'WHATSAPP'
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-sm'
                        : 'border-slate-200 hover:border-amber-400 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <MessageSquare className="w-5 h-5 text-emerald-600" />
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'WHATSAPP'}
                        onChange={() => setPaymentMethod('WHATSAPP')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                    </div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900">Order on WhatsApp</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Direct chat with shop</div>
                  </div>

                </div>

                {/* UPI QR Display when UPI selected */}
                {paymentMethod === 'UPI' && (
                  <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 animate-fadeIn">
                    <div className="w-28 h-28 bg-white p-2 rounded-xl border border-amber-200 shadow-sm flex items-center justify-center shrink-0">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=arabians@upi%26pn=Arabians%20Shopping%20Zone%26am=${cartTotal}%26cu=INR`}
                        alt="Scan UPI QR" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-xs space-y-1 text-center sm:text-left">
                      <div className="font-bold text-slate-900 text-sm">Scan with any UPI App to Pay ₹{cartTotal}</div>
                      <p className="text-slate-600">Supports Google Pay, PhonePe, Paytm, BHIM or Mobile Banking.</p>
                      <div className="text-[11px] text-emerald-800 font-semibold pt-1">
                        ✓ Instant Payment Verification enabled. Click "Place Order" after paying.
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Order Summary & Place Order Button */}
            <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between space-y-4">
              
              <div>
                <h3 className="font-serif font-bold text-base text-slate-900 pb-3 border-b border-slate-200">
                  Order Summary ({cart.length} items)
                </h3>

                {/* Items preview */}
                <div className="max-h-48 overflow-y-auto space-y-2.5 py-3 no-scrollbar">
                  {cart.map((item, i) => (
                    <div key={i} className="flex items-start justify-between gap-2 text-xs">
                      <div className="flex items-start gap-2 truncate">
                        <img src={item.product.image} alt="" className="w-8 h-8 object-cover rounded bg-white border shrink-0 mt-0.5" />
                        <div className="truncate">
                          <span className="truncate font-medium text-slate-800 block">
                            {item.product.name}
                          </span>
                          {item.customization && (
                            <span className="text-[10px] text-amber-800 font-semibold block truncate">
                              👑 {item.customization.shareLaterOnWhatsApp ? 'Personalization: On WhatsApp' : item.customization.summary}
                            </span>
                          )}
                          <span className="text-slate-500 text-[11px]">x{item.quantity}</span>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0">
                        ₹{item.product.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calculation */}
                <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-200">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-800">₹{cartSubtotal}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Coupon Discount ({appliedCoupon?.code})</span>
                      <span>-₹{couponDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span>{deliveryFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-slate-950 pt-2 border-t border-slate-300">
                    <span>Total Payable</span>
                    <span className="text-xl font-extrabold text-[#064e3b]">₹{cartTotal}</span>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm hover:from-amber-400 hover:to-amber-500 shadow-gold transition flex items-center justify-center gap-2 active:scale-95"
                >
                  {submitting ? (
                    <span>Processing Order...</span>
                  ) : paymentMethod === 'WHATSAPP' ? (
                    <>
                      <MessageSquare className="w-4 h-4" />
                      <span>Order on WhatsApp (₹{cartTotal})</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Place Order (₹{cartTotal})</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Your order is backed by Arabians 100% Quality Guarantee</span>
                </div>
              </div>

            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
