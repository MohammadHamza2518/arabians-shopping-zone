import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { getCartOrderWhatsAppUrl, getOrderConfirmationWhatsAppUrl } from '../utils/whatsapp';
import { 
  ShieldCheck, 
  Truck, 
  QrCode, 
  Banknote, 
  MessageSquare, 
  CheckCircle2, 
  Trash2, 
  ArrowLeft, 
  Sparkles,
  Ticket,
  Copy,
  ArrowRight,
  CreditCard,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { 
    cart, 
    cartCount, 
    cartSubtotal,
    deliveryFee,
    cartTotal,
    getOrderBreakdown,
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    createOrder,
    settings,
    showToast
  } = useStore();

  const [paymentMode, setPaymentMode] = useState('online'); // 'online' (Razorpay), 'cod', 'whatsapp'

  // Dynamic order breakdown based on paymentMode
  const currentBreakdown = getOrderBreakdown ? getOrderBreakdown(paymentMode) : {
    subtotal: cartSubtotal,
    discount: couponDiscount,
    deliveryFee,
    onlineDiscount: 0,
    codFee: 0,
    total: cartTotal
  };

  const onlineBreakdown = getOrderBreakdown ? getOrderBreakdown('online') : currentBreakdown;
  const codBreakdown = getOrderBreakdown ? getOrderBreakdown('cod') : currentBreakdown;

  const couponCode = appliedCoupon?.code || '';
  const shippingCharges = currentBreakdown.deliveryFee;
  const activeOnlineDiscount = currentBreakdown.onlineDiscount;
  const activeCodFee = currentBreakdown.codFee;
  const finalTotal = currentBreakdown.total;

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [placedOrderInfo, setPlacedOrderInfo] = useState(null);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  useEffect(() => {
    fetch('/api/coupons')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAvailableCoupons(data.filter(c => c.active !== false));
        }
      })
      .catch(() => {});
  }, []);


  const handleApplyCoupon = async (codeToApply) => {
    const code = typeof codeToApply === 'string' ? codeToApply : couponInput;
    if (!code || !code.trim()) return;
    setCouponLoading(true);
    const res = await applyCoupon(code.trim().toUpperCase());
    setCouponLoading(false);
    if (res && res.message) {
      showToast(res.message, res.success ? 'success' : 'error');
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast("Your cart is empty. Add items before placing an order.", "error");
      return;
    }

    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.pincode) {
      showToast("Please fill in all mandatory address fields.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`;
      const customerData = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: fullAddress,
        street: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      };
      const orderPayload = {
        customer: customerData,
        customerName: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: fullAddress,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        items: cart.map(i => {
          const p = i.product || i;
          return {
            id: p.id,
            name: p.name,
            price: p.price,
            quantity: i.quantity,
            selectedSize: i.variant || null,
            customization: i.customization || null,
            image: p.image
          };
        }),
        subtotal: cartSubtotal,
        discount: couponDiscount,
        couponCode: couponCode || null,
        shippingCharges,
        onlineDiscount: activeOnlineDiscount,
        codFee: activeCodFee,
        total: finalTotal,
        paymentMode,
        paymentStatus: paymentMode === 'online' ? 'Paid Online' : 'Pending Verification'
      };

      // 1. ONLINE PAYMENT FLOW (RAZORPAY)
      if (paymentMode === 'online') {
        const initRes = await fetch('/api/payment/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: orderPayload.items,
            couponCode: couponCode || null,
            customer: orderPayload.customer,
            amount: finalTotal,
            receipt: `rcpt_${Date.now().toString().slice(-8)}`,
            notes: {
              customerName: formData.name,
              phone: formData.phone,
              city: formData.city
            }
          })
        });

        const initData = await initRes.json();
        if (!initData.success || !initData.orderId) {
          throw new Error(initData.message || "Could not connect to payment gateway. Please try Cash on Delivery.");
        }

        const openRazorpay = () => {
          const options = {
            key: initData.keyId,
            amount: initData.amount,
            currency: initData.currency || 'INR',
            name: 'Arabians Shopping Zone',
            description: `Order Payment (${cartCount} items)`,
            image: '/assets/logo/logo_main.png',
            order_id: initData.orderId,
            prefill: {
              name: formData.name,
              email: formData.email,
              contact: formData.phone
            },
            notes: {
              address: fullAddress
            },
            theme: {
              color: '#022c22'
            },
            modal: {
              ondismiss: () => {
                setSubmitting(false);
                showToast("Payment window closed. You can retry or choose Cash on Delivery.", "info");
              }
            },
            handler: async (response) => {
              try {
                const verifyRes = await fetch('/api/payment/verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    orderData: orderPayload
                  })
                });

                const verifyData = await verifyRes.json();
                if (verifyData.success && verifyData.order) {
                  setPlacedOrderInfo(verifyData.order);
                  clearCart();
                  confetti({
                    particleCount: 140,
                    spread: 90,
                    origin: { y: 0.6 },
                    colors: ['#047857', '#d97706', '#f59e0b', '#10b981', '#ffffff']
                  });
                  showToast("Alhamdulillah! Payment verified and order confirmed.", "success");
                } else {
                  showToast(verifyData.message || "Payment verification failed. Please contact customer care.", "error");
                }
              } catch (verErr) {
                showToast("Network error verifying payment. Please save Payment ID: " + response.razorpay_payment_id, "error");
              } finally {
                setSubmitting(false);
              }
            }
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        };

        if (typeof window.Razorpay === 'undefined') {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = openRazorpay;
          script.onerror = () => {
            setSubmitting(false);
            showToast("Failed to load Razorpay payment SDK. Please check connection.", "error");
          };
          document.body.appendChild(script);
        } else {
          openRazorpay();
        }
        return;
      }

      // 2. COD & WHATSAPP ORDER FLOW
      const res = await createOrder(orderPayload);
      if (res && (res.id || res.success)) {
        const orderData = res.order || res;
        setPlacedOrderInfo(orderData);
        clearCart();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
        if (paymentMode === 'whatsapp') {
          const waUrl = getCartOrderWhatsAppUrl({
            orderId: res.order?.id,
            customer: {
              name: formData.fullName || formData.name,
              phone: formData.phone,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode
            },
            items: cart.map(i => ({
              name: i.product?.name,
              price: i.product?.price,
              quantity: i.quantity,
              selectedSize: i.variant || i.selectedSize,
              customization: i.customization || null
            })),
            total: finalTotal,
            paymentMethod: 'WhatsApp Direct Order'
          }, settings.whatsapp);
          window.open(waUrl, '_blank');
        }
      } else {
        showToast(res.message || "Failed to place order.", "error");
      }
    } catch (err) {
      showToast(err.message || "An error occurred while placing order.", "error");
    } finally {
      if (paymentMode !== 'online') {
        setSubmitting(false);
      }
    }
  };

  // SUCCESS VIEW POST-PURCHASE
  if (placedOrderInfo) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
            Alhamdulillah • Order Confirmed
          </span>
          <h1 className="font-serif text-3xl font-extrabold text-slate-900">
            JazakAllah Khair for Your Order!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Your sacred parcel is being carefully inspected and prepared for dispatch.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md text-left space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Order Reference ID:</span>
              <div className="font-mono font-black text-xl text-amber-900">{placedOrderInfo.id}</div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Amount:</span>
              <div className="font-serif font-black text-xl text-emerald-900">₹{placedOrderInfo.total}</div>
            </div>
          </div>

          {/* Instant WhatsApp Tracking Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-900 to-[#032219] text-white space-y-3 shadow-md border border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Instant WhatsApp Order Slip</span>
            </div>
            <h3 className="font-serif font-bold text-base sm:text-lg text-white">
              Send Tracking Slip to Arabians WhatsApp
            </h3>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Tap below to connect with our official WhatsApp desk (+91 72338 62626). Your Order ID and live tracking link will be sent automatically so you receive instant dispatch updates!
            </p>
            <a
              href={getOrderConfirmationWhatsAppUrl(placedOrderInfo, settings.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black text-xs sm:text-sm text-center transition flex items-center justify-center gap-2 shadow-lg active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-slate-950" />
              <span>Send Order Confirmation to WhatsApp</span>
            </a>
          </div>

          <div className="text-xs space-y-2 text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <strong className="text-slate-900">Deliver To:</strong>{' '}
              {placedOrderInfo.customerName || placedOrderInfo.customer?.name || formData.name}{' '}
              ({placedOrderInfo.phone || placedOrderInfo.customer?.phone || formData.phone})
            </div>
            <div>
              <strong className="text-slate-900">Address:</strong>{' '}
              {placedOrderInfo.address || (placedOrderInfo.customer?.address ? placedOrderInfo.customer.address : `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`)}
            </div>
            <div>
              <strong className="text-slate-900">Payment Status:</strong>{' '}
              <span className={`uppercase font-bold ${placedOrderInfo.paymentStatus === 'Paid Online' ? 'text-emerald-700 font-extrabold' : 'text-amber-800'}`}>
                {placedOrderInfo.paymentStatus || (paymentMode === 'online' ? 'Paid Online' : 'Pending Verification')}
              </span>
              <span className="text-slate-400 ml-1">({placedOrderInfo.paymentMode || placedOrderInfo.paymentMethod || paymentMode})</span>
            </div>
            {placedOrderInfo.razorpayPaymentId && (
              <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-emerald-50 border border-emerald-300/80 text-emerald-900 font-mono mt-1">
                <span className="font-bold flex items-center gap-1.5 text-[11px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Razorpay Reference ID:
                </span>
                <span className="font-black select-all">{placedOrderInfo.razorpayPaymentId}</span>
              </div>
            )}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              to={`/track?query=${placedOrderInfo.id}`}
              className="flex-1 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs text-center transition flex items-center justify-center gap-2 shadow"
            >
              <Truck className="w-4 h-4 text-amber-400" />
              <span>Track Live Parcel on Website</span>
            </Link>
          </div>
        </div>

        <Link to="/shop" className="inline-block text-xs font-bold text-amber-700 hover:underline">
          ← Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Breadcrumb - Hidden on mobile */}
      <nav className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-amber-700 transition">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-amber-700 transition">Shop</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Secure Checkout</span>
      </nav>

      {/* Page Title */}
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900">
          Complete Your Sacred Order
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Fast Pan-India delivery with Cash on Delivery (COD) and Instant UPI.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="text-4xl">🛍️</div>
          <h2 className="font-serif font-bold text-lg text-slate-900">Your Cart is Empty</h2>
          <p className="text-xs text-slate-500">You haven't added any products to your shopping bag yet.</p>
          <Link to="/shop" className="inline-block px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800">
            Explore Sacred Shop
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Delivery Details & Payment Mode (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Address Section */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  1
                </div>
                <h3 className="font-serif font-bold text-base text-slate-900">
                  Shipping & Delivery Address
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Syed Tariq Hashmi"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    placeholder="For tracking updates & invoice"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Street Address / House No. / Landmark *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Flat 402, Al-Madina Heights, Mehdipatnam"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City / District *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyderabad"
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
                    placeholder="e.g. Telangana"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pin Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="6-digit Pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method Selector */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                  2
                </div>
                <h3 className="font-serif font-bold text-base text-slate-900">
                  Select Payment Option
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Online Payment via Razorpay */}
                <label className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between space-y-2 relative overflow-hidden ${
                  paymentMode === 'online' ? 'border-emerald-600 bg-emerald-50/60 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMode === 'online'}
                      onChange={() => setPaymentMode('online')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-xs text-slate-900">Pay Online (Instant)</span>
                      {onlineBreakdown.onlineDiscount > 0 && (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-200 text-emerald-950 border border-emerald-400">
                          ⚡ SAVE ₹{onlineBreakdown.onlineDiscount}
                        </span>
                      )}
                    </div>
                    <div className="text-emerald-800 font-bold font-mono text-sm mt-0.5">₹{onlineBreakdown.total}</div>
                    <p className="text-[10px] text-slate-500 mt-0.5">UPI, GPay, PhonePe, Cards, NetBanking</p>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between space-y-2 ${
                  paymentMode === 'cod' ? 'border-amber-600 bg-amber-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                      <Banknote className="w-4 h-4" />
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMode === 'cod'}
                      onChange={() => setPaymentMode('cod')}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-xs text-slate-900">Cash On Delivery (COD)</span>
                      {codBreakdown.codFee > 0 && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-200 text-amber-950">
                          +₹{codBreakdown.codFee} COD
                        </span>
                      )}
                    </div>
                    <div className="text-slate-800 font-bold font-mono text-sm mt-0.5">₹{codBreakdown.total}</div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Pay cash or UPI at your doorstep</p>
                  </div>
                </label>

                {/* Direct WhatsApp Order */}
                <label className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between space-y-2 ${
                  paymentMode === 'whatsapp' ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMode === 'whatsapp'}
                      onChange={() => setPaymentMode('whatsapp')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">Order via WhatsApp</div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Direct chat with store rep</p>
                  </div>
                </label>
              </div>

              {/* Online Payment Trust Banner */}
              {paymentMode === 'online' && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center gap-3 animate-fadeIn">
                  <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-amber-300" />
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                      <span>Powered by Razorpay Verified Live Gateway</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded border border-emerald-300">256-Bit SSL Encrypted</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Supports Google Pay, PhonePe, Paytm, BHIM UPI, Visa, Mastercard, RuPay & NetBanking.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Order Summary & Checkout Action (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm space-y-5 sticky top-24">
              <h3 className="font-serif font-bold text-base text-slate-900 pb-3 border-b border-slate-100">
                Order Summary ({cartCount} items)
              </h3>

              {/* Item List */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {cart.map((item, idx) => {
                  const prod = item.product || item;
                  const itemKey = `${prod.id || idx}-${item.variant || 'std'}-${idx}`;
                  return (
                    <div key={itemKey} className="flex items-start gap-3 text-xs border-b border-slate-100 pb-2.5 last:border-0 last:pb-0">
                      <img src={prod.image} alt="" className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-200 p-1 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-900 truncate">{prod.name}</div>
                        {item.variant && item.variant !== 'standard' && (
                          <div className="text-[11px] text-slate-500">Option: {item.variant}</div>
                        )}
                        {item.customization && (
                          <div className="mt-1 p-1.5 rounded-lg bg-amber-50 border border-amber-200 text-[10px] text-amber-950">
                            <span className="font-bold text-amber-900 block">👑 Personalization:</span>
                            {item.customization.shareLaterOnWhatsApp ? (
                              <span className="text-emerald-800">Will share details on WhatsApp</span>
                            ) : item.customization.isWedding ? (
                              <span>
                                {item.customization.groomName || 'Dulha'} ❤️ {item.customization.brideName || 'Dulhan'}
                                {item.customization.eventDate && ` • ${item.customization.eventDate}`}
                              </span>
                            ) : (
                              <span>{item.customization.customText}</span>
                            )}
                          </div>
                        )}
                        <div className="text-amber-800 font-semibold mt-0.5">₹{prod.price} × {item.quantity}</div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 mt-1">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(prod.id, item.variant || 'standard', -1, item.customization)}
                          className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center font-bold hover:bg-slate-200 cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-5 text-center font-bold text-xs">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(prod.id, item.variant || 'standard', 1, item.customization)}
                          className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center font-bold hover:bg-slate-200 cursor-pointer"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeFromCart(prod.id, item.variant || 'standard', item.customization)}
                          className="p-1 text-slate-400 hover:text-rose-600 ml-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Coupon Engine */}
              <div className="pt-3 border-t border-slate-100">
                {couponCode ? (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-emerald-900">Coupon applied: {couponCode}</span>
                      <div className="text-emerald-700">Saved ₹{couponDiscount}</div>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs text-rose-600 font-bold hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Enter Coupon (e.g. SAVE50)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs uppercase focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon(couponInput)}
                        disabled={couponLoading}
                        className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
                      >
                        {couponLoading ? '...' : 'Apply'}
                      </button>
                    </div>

                    {/* Quick 1-Tap Available Coupons */}
                    {(() => {
                      const cartProductIds = cart.map(i => String(i.product?.id || i.id));
                      const relevantCoupons = availableCoupons.filter(c => !c.productId || cartProductIds.includes(String(c.productId)));
                      if (relevantCoupons.length === 0) return null;
                      return (
                        <div className="space-y-1.5 pt-1">
                          <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                            <Ticket className="w-3 h-3 text-amber-500" />
                            <span>Tap to Apply Available Coupon:</span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {relevantCoupons.map((c) => (
                              <button
                                key={c.code}
                                type="button"
                                onClick={() => {
                                  setCouponInput(c.code);
                                  handleApplyCoupon(c.code);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 text-[10px] font-bold transition flex items-center gap-1 shadow-xs"
                                title={c.description}
                              >
                                <span>{c.code}</span>
                                <span className="text-emerald-700 font-semibold">({c.discountPercent ? `${c.discountPercent}% OFF` : `₹${c.flatDiscount} OFF`})</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>

              {/* Price Calculation */}
              <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">₹{cartSubtotal}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Coupon Discount</span>
                    <span className="font-semibold">-₹{couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Pan-India Delivery</span>
                  <span className="font-semibold text-slate-900">
                    {shippingCharges === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${shippingCharges}`}
                  </span>
                </div>
                {activeOnlineDiscount > 0 && paymentMode === 'online' && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Online Payment Savings</span>
                    <span>-₹{activeOnlineDiscount}</span>
                  </div>
                )}
                {activeCodFee > 0 && paymentMode === 'cod' && (
                  <div className="flex justify-between text-amber-700 font-bold">
                    <span>COD Handling Fee</span>
                    <span>+₹{activeCodFee}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-slate-950 pt-2 border-t border-slate-200">
                  <span>Total Payable</span>
                  <span className="text-emerald-800 font-serif text-lg">₹{finalTotal}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-4 rounded-xl text-slate-950 font-black text-sm transition shadow-gold flex items-center justify-center gap-2 active:scale-95 cursor-pointer ${
                  paymentMode === 'online'
                    ? 'bg-gradient-to-r from-emerald-400 via-amber-400 to-emerald-400 hover:from-emerald-300 hover:to-amber-300'
                    : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500'
                }`}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                    <span>Connecting Secure Gateway...</span>
                  </span>
                ) : paymentMode === 'online' ? (
                  <>
                    <Lock className="w-4 h-4 text-emerald-950" />
                    <span>Pay Online Now • ₹{finalTotal}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Confirm & Place Order (₹{finalTotal})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>100% Encrypted • Pan-India Insured Dispatch</span>
              </div>
            </div>
          </div>

        </form>
      )}

    </div>
  );
}
