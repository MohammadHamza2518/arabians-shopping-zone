import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reels, setReels] = useState([]);
  const [settings, setSettings] = useState({
    storeName: "Arabians Shopping Zone",
    whatsapp: "917233862626",
    whatsappDisplay: "+91 72338 62626",
    phone: "+91 72338 62626",
    callNumber: "+91 72338 62626",
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

  // Real-time Cross-tab synchronization channel
  const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
    ? new BroadcastChannel('asz_realtime_sync')
    : null;

  // Load initial store data with zero cache
  const refreshAll = async (showLoading = false, broadcast = false) => {
    try {
      if (showLoading) setLoading(true);
      const noCache = { cache: 'no-store' };
      const [prodRes, catRes, revRes, reelRes, setRes, heroRes] = await Promise.all([
        fetch('/api/products', noCache).then(r => r.json()).catch(() => []),
        fetch('/api/categories', noCache).then(r => r.json()).catch(() => []),
        fetch('/api/reviews', noCache).then(r => r.json()).catch(() => []),
        fetch('/api/reels', noCache).then(r => r.json()).catch(() => []),
        fetch('/api/settings', noCache).then(r => r.json()).catch(() => ({})),
        fetch('/api/hero-slides', noCache).then(r => r.json()).catch(() => [])
      ]);
      setProducts(prodRes || []);
      setCategories(catRes || []);
      setReviews(revRes || []);
      setReels(reelRes || []);
      if (Array.isArray(heroRes) && heroRes.length > 0) setHeroSlides(heroRes);
      if (setRes && setRes.storeName) setSettings(setRes);

      if (broadcast && syncChannel) {
        syncChannel.postMessage({ type: 'STORE_UPDATED', timestamp: Date.now() });
      }
    } catch (err) {
      console.error("Failed to fetch store data:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    refreshAll(true);

    // Cross-tab real-time listener: when admin or another tab changes data, update instantly
    if (syncChannel) {
      syncChannel.onmessage = (e) => {
        if (e.data?.type === 'STORE_UPDATED' || e.data?.type === 'ORDER_PLACED') {
          refreshAll(false, false);
        }
      };
    }

    // Auto-sync whenever user or admin switches back into this tab
    const handleFocus = () => {
      refreshAll(false, false);
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Real dynamic reviews analytics hub (auto-calculates when reviews change)
  const reviewStats = useMemo(() => {
    const list = Array.isArray(reviews) ? reviews : [];
    const total = list.length;
    if (total === 0) {
      return {
        total: 0,
        average: '4.9',
        recommendRate: '99.2',
        counts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
        distribution: [
          { star: '5 ★', count: 0, pct: '89%', width: '89%', color: 'bg-amber-400' },
          { star: '4 ★', count: 0, pct: '9%', width: '9%', color: 'bg-amber-400/80' },
          { star: '3 ★', count: 0, pct: '2%', width: '2%', color: 'bg-amber-400/60' },
          { star: '2 ★', count: 0, pct: '0%', width: '0%', color: 'bg-amber-400/40' },
          { star: '1 ★', count: 0, pct: '0%', width: '0%', color: 'bg-amber-400/30' },
        ]
      };
    }

    let sum = 0;
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    list.forEach(r => {
      const rating = Number(r.rating) || 5;
      sum += rating;
      const star = Math.min(5, Math.max(1, Math.round(rating)));
      counts[star] = (counts[star] || 0) + 1;
    });

    const average = (sum / total).toFixed(1);
    const positiveReviews = (counts[5] || 0) + (counts[4] || 0);
    const recommendRate = ((positiveReviews / total) * 100).toFixed(1);

    const distribution = [
      { star: '5 ★', count: counts[5] || 0, pct: `${Math.round(((counts[5] || 0) / total) * 100)}%`, width: `${Math.round(((counts[5] || 0) / total) * 100)}%`, color: 'bg-amber-400' },
      { star: '4 ★', count: counts[4] || 0, pct: `${Math.round(((counts[4] || 0) / total) * 100)}%`, width: `${Math.round(((counts[4] || 0) / total) * 100)}%`, color: 'bg-amber-400/80' },
      { star: '3 ★', count: counts[3] || 0, pct: `${Math.round(((counts[3] || 0) / total) * 100)}%`, width: `${Math.round(((counts[3] || 0) / total) * 100)}%`, color: 'bg-amber-400/60' },
      { star: '2 ★', count: counts[2] || 0, pct: `${Math.round(((counts[2] || 0) / total) * 100)}%`, width: `${Math.round(((counts[2] || 0) / total) * 100)}%`, color: 'bg-amber-400/40' },
      { star: '1 ★', count: counts[1] || 0, pct: `${Math.round(((counts[1] || 0) / total) * 100)}%`, width: `${Math.round(((counts[1] || 0) / total) * 100)}%`, color: 'bg-amber-400/30' },
    ];

    return {
      total,
      average,
      recommendRate,
      counts,
      distribution
    };
  }, [reviews]);

  // Submit new review helper
  const addReview = async (reviewPayload) => {
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewPayload)
      });
      if (!res.ok) throw new Error("Failed to post review");
      const savedReview = await res.json();
      setReviews(prev => [savedReview, ...(prev || [])]);
      refreshAll(false);
      return { success: true, review: savedReview };
    } catch (err) {
      console.error("Error submitting review:", err);
      return { success: false, error: err.message };
    }
  };

  // Cart management
  const addToCart = (product, quantity = 1, selectedVariant = null, customization = null) => {
    // Inventory safeguard: Check if product or selected size is out of stock
    if (product.inStock === false || (product.stock !== undefined && product.stock <= 0)) {
      showToast("Ye product filhal out of stock hai!", "error");
      return;
    }

    if (selectedVariant && Array.isArray(product.outOfStockSizes) && product.outOfStockSizes.includes(selectedVariant)) {
      showToast(`Size ${selectedVariant} filhal out of stock hai!`, "error");
      return;
    }

    setCart(prev => {
      const variantKey = selectedVariant || 'standard';
      const custKey = customization ? JSON.stringify(customization) : '';
      const existingIdx = prev.findIndex(item => {
        const itemCustKey = item.customization ? JSON.stringify(item.customization) : '';
        return item.product.id === product.id && item.variant === variantKey && itemCustKey === custKey;
      });

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        return next;
      } else {
        return [...prev, { product, quantity, variant: variantKey, customization: customization || null }];
      }
    });

    const customSuffix = customization ? ' (with Custom Personalization)' : '';
    showToast(`Added "${product.name.slice(0, 26)}..."${customSuffix} to cart!`);
  };

  const updateCartQuantity = (productId, variant, delta, customization = undefined) => {
    setCart(prev => {
      const targetCustKey = customization !== undefined ? (customization ? JSON.stringify(customization) : '') : null;
      return prev.map(item => {
        const itemCustKey = item.customization ? JSON.stringify(item.customization) : '';
        const isCustMatch = targetCustKey === null || itemCustKey === targetCustKey;
        if (item.product.id === productId && item.variant === variant && isCustMatch) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (productId, variant, customization = undefined) => {
    const targetCustKey = customization !== undefined ? (customization ? JSON.stringify(customization) : '') : null;
    setCart(prev => prev.filter(item => {
      const itemCustKey = item.customization ? JSON.stringify(item.customization) : '';
      const isCustMatch = targetCustKey === null || itemCustKey === targetCustKey;
      return !(item.product.id === productId && item.variant === variant && isCustMatch);
    }));
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
      const isFullPayload = customerDetails && (customerDetails.customer || customerDetails.items || customerDetails.customerName);
      
      const custObj = (customerDetails && customerDetails.customer) 
        ? customerDetails.customer 
        : {
            name: customerDetails?.customerName || customerDetails?.name || '',
            phone: customerDetails?.phone || '',
            email: customerDetails?.email || '',
            address: customerDetails?.address || '',
            city: customerDetails?.city || '',
            state: customerDetails?.state || '',
            pincode: customerDetails?.pincode || ''
          };

      const custName = custObj.name || customerDetails?.customerName || customerDetails?.name || 'Customer';
      const custPhone = custObj.phone || customerDetails?.phone || '';
      const custEmail = custObj.email || customerDetails?.email || '';
      const custAddress = customerDetails?.address || custObj.address || '';

      const orderPayload = isFullPayload ? {
        ...customerDetails,
        customer: custObj,
        customerName: custName,
        phone: custPhone,
        email: custEmail,
        address: custAddress,
        items: customerDetails.items || cart.map(i => ({
          id: i.product?.id || i.id,
          name: (i.product?.name || i.name) + (i.variant && i.variant !== 'standard' ? ` (${i.variant})` : ''),
          price: i.product?.price || i.price,
          quantity: i.quantity,
          image: i.product?.image || i.image,
          selectedSize: i.variant !== 'standard' ? i.variant : null,
          customization: i.customization || null
        })),
        subtotal: customerDetails.subtotal ?? cartSubtotal,
        discount: customerDetails.discount ?? couponDiscount,
        couponCode: customerDetails.couponCode ?? (appliedCoupon ? appliedCoupon.code : ''),
        deliveryFee: customerDetails.shippingCharges ?? customerDetails.deliveryFee ?? deliveryFee,
        total: customerDetails.total ?? cartTotal,
        paymentMethod: customerDetails.paymentMode || customerDetails.paymentMethod || paymentMethod || 'COD',
        paymentMode: customerDetails.paymentMode || customerDetails.paymentMethod || paymentMethod || 'COD'
      } : {
        customer: custObj,
        customerName: custName,
        phone: custPhone,
        email: custEmail,
        address: custAddress,
        items: cart.map(i => ({
          id: i.product?.id || i.id,
          name: (i.product?.name || i.name) + (i.variant !== 'standard' ? ` (${i.variant})` : ''),
          price: i.product?.price || i.price,
          quantity: i.quantity,
          image: i.product?.image || i.image,
          selectedSize: i.variant !== 'standard' ? i.variant : null,
          customization: i.customization || null
        })),
        subtotal: cartSubtotal,
        discount: couponDiscount,
        couponCode: appliedCoupon ? appliedCoupon.code : '',
        deliveryFee,
        total: cartTotal,
        paymentMethod: paymentMethod || 'COD',
        paymentMode: paymentMethod || 'COD'
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

      // Refresh background orders list and broadcast
      refreshAll(false, true);
      if (syncChannel) {
        syncChannel.postMessage({ type: 'ORDER_PLACED', orderId: orderData?.id, total: orderData?.total });
      }
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
      heroSlides,
      setHeroSlides,
      reviews,
      setReviews,
      reviewStats,
      addReview,
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
