import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Truck, 
  ShieldCheck, 
  Plus, 
  Minus,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function CartDrawer() {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    cartCount, 
    cartSubtotal, 
    deliveryFee, 
    freeShippingThreshold, 
    cartTotal, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    applyCoupon, 
    removeCoupon, 
    appliedCoupon, 
    couponError, 
    couponDiscount, 
    setIsCheckoutOpen,
    setSelectedProduct
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    const success = await applyCoupon(couponInput.trim());
    setCouponLoading(false);
    if (success) setCouponInput('');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between border-l border-amber-500/30">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 bg-[#032219] text-white flex items-center justify-between border-b border-amber-500/20">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="font-serif text-lg font-bold">Your Shopping Cart</h2>
              <span className="bg-amber-500 text-slate-950 text-xs font-black px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-emerald-900/50 transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Delivery Progress Bar */}
          <div className="bg-amber-50 border-b border-amber-200 p-3 text-xs text-amber-950">
            {remainingForFreeShipping > 0 ? (
              <div>
                <div className="flex items-center justify-between font-semibold mb-1">
                  <span>Add <strong>₹{remainingForFreeShipping}</strong> more for <strong>FREE Delivery</strong></span>
                  <Truck className="w-4 h-4 text-amber-600" />
                </div>
                <div className="w-full h-1.5 bg-amber-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>MashaAllah! You unlocked <strong>FREE Express Pan-India Delivery</strong></span>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-slate-800 text-base">Your Cart is Empty</h3>
                  <p className="text-xs text-slate-500 mt-1">Explore our authentic Sunnah foods and royal thobes.</p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#032219] text-amber-300 text-xs font-bold hover:bg-[#063e2e]"
                >
                  Start Shopping Now
                </button>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div 
                  key={`${item.product.id}-${item.variant}-${idx}`}
                  className="flex gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-amber-400/40 transition"
                >
                  {/* Thumbnail */}
                  <div 
                    className="w-20 h-20 bg-white rounded-xl overflow-hidden border border-slate-200 shrink-0 p-1 cursor-pointer flex items-center justify-center"
                    onClick={() => { setIsCartOpen(false); setSelectedProduct(item.product); }}
                  >
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 
                          onClick={() => { setIsCartOpen(false); setSelectedProduct(item.product); }}
                          className="font-serif font-bold text-xs sm:text-sm text-slate-900 line-clamp-1 hover:text-emerald-800 cursor-pointer"
                        >
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.variant)}
                          className="text-slate-400 hover:text-rose-600 transition p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {item.variant && item.variant !== 'standard' && (
                        <span className="text-[10px] text-amber-800 bg-amber-100/80 px-1.5 py-0.5 rounded font-medium inline-block mt-0.5">
                          Variant: {item.variant}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center border border-slate-300 rounded-lg bg-white p-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.variant, -1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 text-xs font-bold"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.variant, 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 text-xs font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs sm:text-sm font-black text-slate-950">
                          ₹{item.product.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-slate-200 space-y-3">
              
              {/* Coupon Bar */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon <strong>{appliedCoupon.code}</strong> applied (-₹{couponDiscount})</span>
                  </div>
                  <button 
                    onClick={removeCoupon}
                    className="text-rose-600 font-bold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter Coupon Code (e.g. ARABIAN10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 uppercase tracking-wider"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading}
                      className="px-4 py-2 bg-[#032219] text-amber-300 text-xs font-bold rounded-xl hover:bg-[#063e2e] transition"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-rose-600 font-medium">{couponError}</p>
                  )}
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">₹{cartSubtotal}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-black text-slate-950 pt-2 border-t border-slate-200">
                  <span>Total Payable</span>
                  <span className="text-lg font-extrabold text-[#064e3b]">₹{cartTotal}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs sm:text-sm hover:from-amber-400 hover:to-amber-500 shadow-gold transition flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-3 text-[10px] text-slate-500">
                <span>🔒 256-Bit SSL Encryption</span>
                <span>•</span>
                <span>COD Verified</span>
                <span>•</span>
                <span>Pan-India Courier</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
