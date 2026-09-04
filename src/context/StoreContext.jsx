import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reels, setReels] = useState([]);
  const [settings, setSettings] = useState({
    storeName: "Arabians Shopping Zone",
    whatsapp: "917233862626",
    whatsappDisplay: "+91 72338 62626",
    phone: "+91 92360 28318",
    callNumber: "+91 92360 28318",
    email: "arabiansshoppingzone@gmail.com",
    announcement: "🌙 Special Offer: Free Express Pan-India Delivery on orders above ₹999 | Use Code ARABIAN10 for 10% Off!",
    freeShippingThreshold: 999,
    standardShippingFee: 70,
    flashSale: {
      enabled: true,
      badge: "Special Sunnah Blessing Deal",
      headline: "Flat 10% Off On Orders Above ₹999 + Free Express Pan-India COD",
      subtitle: "Direct from our market studio. Sealed with tamper-proof halal guarantee.",
      couponCode: "ARABIAN10"
    },
    jummahBundle: {
      enabled: true,
      badge: "Jummah Sunnah Mubarak Set • 1-Click Combo",
      title: "The Complete Sunnah Jummah Wardrobe Kit",
      subtitle: "Revive the pristine Sunnah of Friday prayers in one complete set: a pristine tailored Saudi thobe, handcrafted Turkish velvet cap, and aged alcohol-free Cambodian oud.",
      comboPrice: 2299,
      originalPrice: 2797
    }
  });

  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeReel, setActiveReel] = useState(null);

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [isDistributorOpen, setIsDistributorOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activePolicy, setActivePolicy] = useState(null); // 'about', 'shipping', 'returns', 'privacy', 'terms', 'contact'
  const [placedOrder, setPlacedOrder] = useState(null);

  // Cart & Wishlist persistence
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('asz_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('asz_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Active coupon
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    localStorage.setItem('asz_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('asz_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Load initial store data
  const refreshAll = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, revRes, reelRes, setRes] = await Promise.all([
        fetch('/api/products').then(r => r.json()),
        fetch('/api/categories').then(r => r.json()),
        fetch('/api/reviews').then(r => r.json()),
        fetch('/api/reels').then(r => r.json()),
        fetch('/api/settings').then(r => r.json())
      ]);
      setProducts(prodRes || []);
      setCategories(catRes || []);
      setReviews(revRes || []);
      setReels(reelRes || []);
      if (setRes && setRes.storeName) setSettings(setRes);
    } catch (err) {
      console.error("Failed to fetch store data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAll();
  }, []);

  // Cart management
  const addToCart = (product, quantity = 1, selectedVariant = null) => {
    setCart(prev => {
      const variantKey = selectedVariant || 'standard';
      const existingIdx = prev.findIndex(item => item.product.id === product.id && item.variant === variantKey);

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      } else {
        return [...prev, { product, quantity, variant: variantKey }];
      }
    });

    showToast(`Added "${product.name.slice(0, 28)}..." to cart!`);
  };

  const updateCartQuantity = (productId, variant, delta) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId && item.variant === variant) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (productId, variant) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.variant === variant)));
    showToast("Item removed from cart", "info");
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        showToast("Removed from wishlist", "info");
        return prev.filter(id => id !== productId);
      } else {
        showToast("Added to wishlist ❤️");
        return [...prev, productId];
      }
    });
  };

  // Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const freeShippingThreshold = 999;
  const deliveryFee = cartSubtotal >= freeShippingThreshold || cartSubtotal === 0 ? 0 : 70;
  
  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountPercent) {
      couponDiscount = Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100);
    } else if (appliedCoupon.flatDiscount) {
      couponDiscount = Math.min(cartSubtotal, appliedCoupon.flatDiscount);
    } else if (appliedCoupon.discount) {
      couponDiscount = appliedCoupon.discount;
    }
  }

  const cartTotal = Math.max(0, cartSubtotal - couponDiscount + deliveryFee);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Validate and apply coupon
  const applyCoupon = async (code) => {
    setCouponError('');
    if (!code) {
      setCouponError('Please enter coupon code');
      return false;
    }
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartTotal: cartSubtotal })
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        setCouponError(data.message || 'Invalid coupon code');
        return false;
      }
      setAppliedCoupon(data);
      showToast(`Coupon "${data.code}" applied: ₹${data.discount} saved! 🎉`);
      return true;
    } catch {
      setCouponError('Error validating coupon. Try again.');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError('');
    showToast("Coupon removed", "info");
  };

  // Place Order
  const createOrder = async (customerDetails, paymentMethod) => {
    try {
      const orderPayload = {
        customer: customerDetails,
        items: cart.map(i => ({
          id: i.product.id,
          name: i.product.name + (i.variant !== 'standard' ? ` (${i.variant})` : ''),
          price: i.product.price,
          quantity: i.quantity,
          image: i.product.image
        })),
        subtotal: cartSubtotal,
        discount: couponDiscount,
        couponCode: appliedCoupon ? appliedCoupon.code : '',
        deliveryFee,
        total: cartTotal,
        paymentMethod
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!res.ok) throw new Error("Failed to place order");
      const orderData = await res.json();

      // Confetti celebration
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#047857', '#d97706', '#f59e0b', '#10b981', '#ffffff']
      });

      setPlacedOrder(orderData);
      clearCart();
      setIsCheckoutOpen(false);

      // Refresh background orders list
      refreshAll();
      return orderData;
    } catch (err) {
      console.error(err);
      showToast("Order placement failed. Please try again.", "error");
      return null;
    }
  };

  return (
    <StoreContext.Provider value={{
      products,
      categories,
      reviews,
      reels,
      settings,
      loading,
      selectedCategory,
      setSelectedCategory,
      searchQuery,
      setSearchQuery,
      selectedProduct,
      setSelectedProduct,
      activeReel,
      setActiveReel,
      cart,
      cartCount,
      cartSubtotal,
      deliveryFee,
      freeShippingThreshold,
      couponDiscount,
      appliedCoupon,
      couponError,
      cartTotal,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      applyCoupon,
      removeCoupon,
      wishlist,
      toggleWishlist,
      isCartOpen,
      setIsCartOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      isTrackOpen,
      setIsTrackOpen,
      isDistributorOpen,
      setIsDistributorOpen,
      isAdminOpen,
      setIsAdminOpen,
      activePolicy,
      setActivePolicy,
      placedOrder,
      setPlacedOrder,
      createOrder,
      refreshAll,
      toast,
      showToast
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
