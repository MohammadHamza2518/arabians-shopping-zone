import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Lock, 
  Unlock, 
  Package, 
  ShoppingBag, 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  Check, 
  Clock, 
  Phone, 
  MessageSquare, 
  IndianRupee, 
  ArrowLeft,
  RefreshCw, 
  Search, 
  Filter, 
  Tag,
  ExternalLink,
  Menu,
  X,
  Shield,
  Eye,
  EyeOff,
  Printer,
  Truck,
  DollarSign,
  Settings,
  ChevronRight,
  BarChart3,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export default function AdminPage() {
  const { products, categories, refreshAll, showToast, settings: globalSettings } = useStore();

  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('asz_admin_auth') === 'true';
  });

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'orders', 'products', 'distributors', 'coupons', 'settings'
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Admin Data states
  const [orders, setOrders] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  
  // Orders filters & tracking
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [trackingInputs, setTrackingInputs] = useState({});
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState(null);

  // Products filters & modal state
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Coupon modal state
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [savingCoupon, setSavingCoupon] = useState(false);
  const [newCouponData, setNewCouponData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '10',
    minOrder: '499',
    description: ''
  });

  // Store settings state
  const [storeSettings, setStoreSettings] = useState({
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
  const [savingSettings, setSavingSettings] = useState(false);

  // Load orders, distributors, coupons & settings
  const fetchAdminData = async () => {
    setLoadingOrders(true);
    try {
      const [ordersRes, distRes, coupRes, setRes] = await Promise.all([
        fetch('/api/orders').catch(() => ({ json: () => [] })),
        fetch('/api/distributors').catch(() => ({ json: () => [] })),
        fetch('/api/coupons').catch(() => ({ json: () => [] })),
        fetch('/api/settings').catch(() => ({ json: () => null }))
      ]);
      const ordersData = await ordersRes.json();
      const distData = await distRes.json();
      const coupData = await coupRes.json();
      const settingsData = await setRes.json();

      setOrders(Array.isArray(ordersData) ? ordersData : (ordersData.orders || []));
      setDistributors(Array.isArray(distData) ? distData : (distData.distributors || []));
      setCoupons(Array.isArray(coupData) ? coupData : []);
      if (settingsData && settingsData.storeName) {
        setStoreSettings(prev => ({
          ...prev,
          ...settingsData,
          flashSale: { ...prev.flashSale, ...(settingsData.flashSale || {}) },
          jummahBundle: { ...prev.jummahBundle, ...(settingsData.jummahBundle || {}) }
        }));
      }
    } catch {
      showToast("Error loading admin records", "error");
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode.trim() === 'arabians786') {
      setIsAuthenticated(true);
      sessionStorage.setItem('asz_admin_auth', 'true');
      showToast("Admin access granted. Welcome to Arabians Executive Console!");
    } else {
      showToast("Incorrect Passcode. Try arabians786", "error");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('asz_admin_auth');
    showToast("Logged out of Admin Console.");
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Order ${orderId} updated to ${newStatus}`);
        fetchAdminData();
      }
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const handleSaveTracking = async (orderId) => {
    const trackNum = trackingInputs[orderId];
    if (!trackNum) {
      showToast("Please enter a tracking number", "error");
      return;
    }
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingNumber: trackNum })
      });
      const data = await res.json();
      if (data.id || data.success) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, trackingId: trackNum, trackingNumber: trackNum } : o));
        showToast(`Tracking saved for ${orderId}: ${trackNum}`);
        fetchAdminData();
      }
    } catch {
      showToast("Error saving tracking number", "error");
    }
  };

  const handleWhatsAppNotify = (order) => {
    const tracking = trackingInputs[order.id] || order.trackingId || 'Preparing for dispatch';
    const text = encodeURIComponent(
      `Assalam o Alaikum ${order.customerName},\n\n` +
      `Your Arabians Shopping Zone order *${order.id}* status has been updated to: *${order.status.toUpperCase()}*.\n` +
      `📦 Courier / Tracking: ${tracking}\n` +
      `💰 Total Amount: ₹${order.total} (${order.paymentMode.toUpperCase()})\n` +
      `📍 Delivery to: ${order.address}\n\n` +
      `🚚 You can track your parcel live anytime:\n${window.location.origin}/#/track?query=${order.id}\n\n` +
      `JazakAllah Khair for shopping with Arabians Shopping Zone!`
    );
    window.open(`https://wa.me/${order.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storeSettings)
      });
      if (res.ok) {
        showToast("Store settings saved & updated live!");
        refreshAll();
      }
    } catch {
      showToast("Failed to save store settings", "error");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const url = editingProduct.isNew ? '/api/products' : `/api/products/${editingProduct.id}`;
      const method = editingProduct.isNew ? 'POST' : 'PUT';
      
      const payload = {
        ...editingProduct,
        price: Number(editingProduct.price) || 0,
        mrp: Number(editingProduct.mrp) || Number(editingProduct.price) || 0,
        rating: Number(editingProduct.rating) || 5.0,
        reviewsCount: Number(editingProduct.reviewsCount) || 1,
        badge: (editingProduct.badge || '').trim()
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success || data.id || data.product) {
        showToast(editingProduct.isNew ? "Product added successfully!" : "Product updated!");
        setIsProductModalOpen(false);
        setEditingProduct(null);
        refreshAll();
      } else {
        showToast(data.message || "Failed to save product", "error");
      }
    } catch {
      showToast("Error saving product", "error");
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from store catalog?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast(`Product removed.`);
        refreshAll();
      }
    } catch {
      showToast("Error deleting product", "error");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    const form = new FormData();
    form.append('image', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form
      });
      const data = await res.json();
      if (data.success) {
        setEditingProduct(prev => ({
          ...prev,
          image: data.imageUrl,
          gallery: [data.imageUrl, ...(prev.gallery || [])]
        }));
        showToast("Product image uploaded successfully!");
      } else {
        showToast("Upload failed", "error");
      }
    } catch {
      showToast("Image upload error", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!newCouponData.code.trim()) {
      showToast("Please enter a coupon code", "error");
      return;
    }
    setSavingCoupon(true);
    try {
      const payload = {
        code: newCouponData.code.trim().toUpperCase(),
        discountPercent: newCouponData.discountType === 'percentage' ? Number(newCouponData.discountValue) : 0,
        flatDiscount: newCouponData.discountType === 'flat' ? Number(newCouponData.discountValue) : 0,
        minOrder: Number(newCouponData.minOrder) || 0,
        description: newCouponData.description.trim()
      };
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Failed to save coupon");
      showToast(`Coupon ${payload.code} saved successfully!`);
      setIsCouponModalOpen(false);
      setNewCouponData({ code: '', discountType: 'percentage', discountValue: '10', minOrder: '499', description: '' });
      fetchAdminData();
    } catch {
      showToast("Error creating coupon", "error");
    } finally {
      setSavingCoupon(false);
    }
  };

  const handleToggleCoupon = async (code) => {
    try {
      const res = await fetch(`/api/coupons/${code}/toggle`, { method: 'PUT' });
      const data = await res.json();
      if (data.success) {
        showToast(`Coupon ${code} status updated!`);
        fetchAdminData();
      }
    } catch {
      showToast("Failed to toggle coupon status", "error");
    }
  };

  const handleDeleteCoupon = async (code) => {
    if (!window.confirm(`Are you sure you want to delete coupon ${code}?`)) return;
    try {
      const res = await fetch(`/api/coupons/${code}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast(`Coupon ${code} deleted.`);
        fetchAdminData();
      }
    } catch {
      showToast("Error deleting coupon", "error");
    }
  };

  // PASSCODE LOGIN SCREEN (STANDALONE EXECUTIVE PORTAL)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050b10] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient luxury glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-[#0a141d]/90 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 text-center relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/20 font-black text-2xl">
            👑
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] tracking-widest font-black uppercase text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Arabians Executive Suite
            </span>
            <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
              Store Control Center
            </h1>
            <p className="text-xs text-slate-400">
              Authorized personnel only. Enter master administrative passcode to manage orders, catalog, and store operations.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Passcode
              </label>
              <div className="relative">
                <input
                  type={showPasscode ? "text" : "password"}
                  autoFocus
                  placeholder="Enter Passcode..."
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-[#04080c] border border-slate-700 text-white font-mono text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-black text-xs uppercase tracking-wider hover:brightness-110 transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Admin Console</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Passcode hint: <strong className="text-amber-300 font-mono">arabians786</strong></span>
            <a
              href="#/"
              className="text-amber-400 hover:text-amber-300 transition flex items-center gap-1 font-semibold"
            >
              <span>← Public Store</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'all' || o.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = !orderSearch.trim() || 
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.phone.includes(orderSearch);
    return matchesStatus && matchesSearch;
  });

  const filteredProducts = products.filter(p => {
    const matchesCat = productCategoryFilter === 'all' || p.category.toLowerCase() === productCategoryFilter.toLowerCase();
    const matchesSearch = !productSearch.trim() || p.name.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const activeOrdersCount = orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length;

  return (
    <div className="min-h-screen bg-[#070d12] text-slate-100 flex flex-col md:flex-row">
      
      {/* ========================================================================= */}
      {/* STANDALONE EXECUTIVE SIDEBAR                                              */}
      {/* ========================================================================= */}
      <aside className={`
        fixed md:sticky top-0 inset-y-0 left-0 z-40 w-72 bg-[#0a131a] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out h-screen overflow-y-auto
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-5 space-y-6">
          
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black text-lg shadow-md shadow-amber-500/20">
                👑
              </div>
              <div>
                <h1 className="font-serif font-black text-base text-white tracking-wide">
                  ARABIANS HQ
                </h1>
                <p className="text-[10px] text-amber-400/90 font-semibold tracking-wider uppercase">
                  Executive Suite v2.0
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* System Status Pill */}
          <div className="px-3.5 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-300 font-bold">Node API :5000</span>
            </div>
            <span className="text-emerald-400/80 text-[10px] font-mono">ONLINE</span>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1.5 text-xs font-semibold">
            
            <button
              onClick={() => { setActiveTab('dashboard'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition ${
                activeTab === 'dashboard'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveTab('orders'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition ${
                activeTab === 'orders'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Orders & Fulfillment</span>
              </div>
              {activeOrdersCount > 0 && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                  activeTab === 'orders' ? 'bg-slate-950 text-amber-300' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {activeOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('products'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition ${
                activeTab === 'products'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Products & Catalog</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activeTab === 'products' ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-400'
              }`}>
                {products.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('distributors'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition ${
                activeTab === 'distributors'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>B2B Wholesale Leads</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activeTab === 'distributors' ? 'bg-slate-950 text-amber-300' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
              }`}>
                {distributors.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('coupons'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition ${
                activeTab === 'coupons'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4" />
                <span>Promo Coupons</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activeTab === 'coupons' ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-400'
              }`}>
                {coupons.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('settings'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition ${
                activeTab === 'settings'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings className="w-4 h-4" />
                <span>Store & Shipping Settings</span>
              </div>
            </button>

          </nav>
        </div>

        {/* Sidebar Footer Operations */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <a
            href="#/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-bold flex items-center justify-between group transition"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>View Customer Store</span>
            </div>
            <span className="text-[10px] text-slate-400">Live ↗</span>
          </a>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-3.5 rounded-xl bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 border border-rose-800/30 text-xs font-bold flex items-center gap-2 transition"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Lock / Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* ========================================================================= */}
      {/* MAIN WORKSPACE AREA                                                       */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 bg-[#0a131a]/95 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-800 text-slate-300"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Admin Console &gt; <span className="text-amber-400">{activeTab.toUpperCase()}</span>
              </div>
              <h2 className="font-serif font-black text-lg text-white capitalize">
                {activeTab === 'dashboard' && 'Executive Overview'}
                {activeTab === 'orders' && 'Orders & Parcel Dispatch'}
                {activeTab === 'products' && 'Product Catalog Management'}
                {activeTab === 'distributors' && 'B2B Wholesale Pipeline'}
                {activeTab === 'coupons' && 'Promotional Coupons & Vouchers'}
                {activeTab === 'settings' && 'Store Configuration & Rates'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={fetchAdminData}
              className="p-2.5 rounded-xl bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600 transition"
              title="Sync Store Data"
            >
              <RefreshCw className={`w-4 h-4 ${loadingOrders ? 'animate-spin text-amber-400' : ''}`} />
            </button>

            {activeTab === 'products' && (
              <button
                onClick={() => {
                  setEditingProduct({
                    id: `prod-${Date.now()}`,
                    name: '',
                    category: 'wearing',
                    price: 999,
                    mrp: 1499,
                    rating: 5.0,
                    badge: 'New Arrival',
                    image: '/assets/logo/logo_main.png',
                    description: '',
                    benefits: [],
                    tags: [],
                    isNew: true
                  });
                  setIsProductModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs hover:brightness-110 transition shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Product</span>
              </button>
            )}

            {activeTab === 'coupons' && (
              <button
                onClick={() => {
                  setNewCouponData({ code: '', discountType: 'percentage', discountValue: '10', minOrder: '499', description: '' });
                  setIsCouponModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs hover:brightness-110 transition shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Coupon</span>
              </button>
            )}

            <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-800 text-xs">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black">
                👑
              </div>
              <div>
                <div className="text-white font-bold leading-tight">Store Owner</div>
                <div className="text-[10px] text-emerald-400">Master Authority</div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-8 space-y-8 max-w-7xl w-full mx-auto animate-fadeIn">
          
          {/* ========================================================================= */}
          {/* TAB 1: DASHBOARD OVERVIEW                                                 */}
          {/* ========================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              
              {/* 4 Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-[#0c1620] p-6 rounded-3xl border border-slate-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>Total Store Sales</span>
                    <IndianRupee className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="font-serif text-3xl font-black text-emerald-400">
                    ₹{totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Calculated over {orders.length} orders
                  </div>
                </div>

                <div className="bg-[#0c1620] p-6 rounded-3xl border border-slate-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>Pending Dispatch</span>
                    <Truck className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="font-serif text-3xl font-black text-amber-400">
                    {activeOrdersCount}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Requires packing & courier handover
                  </div>
                </div>

                <div className="bg-[#0c1620] p-6 rounded-3xl border border-slate-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>Active Products</span>
                    <Package className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="font-serif text-3xl font-black text-sky-400">
                    {products.length}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Across 5 Pure Categories
                  </div>
                </div>

                <div className="bg-[#0c1620] p-6 rounded-3xl border border-slate-800 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>B2B Dealer Leads</span>
                    <Users className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="font-serif text-3xl font-black text-indigo-400">
                    {distributors.length}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Wholesale applicants pipeline
                  </div>
                </div>

              </div>

              {/* Quick Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div 
                  onClick={() => setActiveTab('orders')}
                  className="bg-[#0c1620] hover:bg-[#101c29] cursor-pointer p-5 rounded-3xl border border-slate-800 hover:border-amber-500/40 transition group space-y-2"
                >
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                    📦
                  </div>
                  <h3 className="font-serif font-bold text-white group-hover:text-amber-300 transition">
                    Fulfill Orders & Print Slips
                  </h3>
                  <p className="text-xs text-slate-400">
                    View new orders, update delivery status, add courier tracking IDs and generate packing invoices.
                  </p>
                </div>

                <div 
                  onClick={() => {
                    setEditingProduct({
                      id: `prod-${Date.now()}`,
                      name: '',
                      category: 'wearing',
                      price: 999,
                      mrp: 1499,
                      rating: 5.0,
                      badge: 'New Arrival',
                      image: '/assets/logo/logo_main.png',
                      description: '',
                      benefits: [],
                      tags: [],
                      isNew: true
                    });
                    setIsProductModalOpen(true);
                  }}
                  className="bg-[#0c1620] hover:bg-[#101c29] cursor-pointer p-5 rounded-3xl border border-slate-800 hover:border-emerald-500/40 transition group space-y-2"
                >
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                    ✨
                  </div>
                  <h3 className="font-serif font-bold text-white group-hover:text-emerald-300 transition">
                    Add New Product / Attar
                  </h3>
                  <p className="text-xs text-slate-400">
                    Upload product photos, set Sunnah benefits, pricing, and tag them for Hamper Builder.
                  </p>
                </div>

                <div 
                  onClick={() => setActiveTab('settings')}
                  className="bg-[#0c1620] hover:bg-[#101c29] cursor-pointer p-5 rounded-3xl border border-slate-800 hover:border-sky-500/40 transition group space-y-2"
                >
                  <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
                    ⚙️
                  </div>
                  <h3 className="font-serif font-bold text-white group-hover:text-sky-300 transition">
                    Configure Shipping & Banner
                  </h3>
                  <p className="text-xs text-slate-400">
                    Adjust free Pan-India shipping threshold, delivery charges, and announcement headline.
                  </p>
                </div>

              </div>

              {/* Recent Orders Snapshot */}
              <div className="bg-[#0c1620] rounded-3xl border border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-white">
                    Recent Customer Orders ({orders.slice(0, 5).length})
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    <span>View All Orders →</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-800/80">
                  {orders.slice(0, 5).map(o => (
                    <div key={o.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-300">{o.id}</span>
                          <span className="text-slate-400">• {o.customerName}</span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                            {o.paymentMode}
                          </span>
                        </div>
                        <div className="text-slate-400 text-[11px] mt-0.5">
                          {o.items ? o.items.length : 0} item(s) • Total: <strong className="text-emerald-400">₹{o.total}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          o.status === 'Delivered' 
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
                        }`}>
                          {o.status}
                        </span>

                        <button
                          onClick={() => { setActiveInvoiceOrder(o); }}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
                          title="Print Packing Slip"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

      {/* TAB 2: ORDERS & FULFILLMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          
          {/* Search & Status Filters */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#0c1620] p-4 rounded-3xl border border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by Order ID (ORD-...), Customer Name, or Phone..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#070d12] border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Status Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
              {['all', 'Confirmed', 'Dispatched', 'In Transit', 'Delivered', 'Cancelled'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                    statusFilter === st
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {st === 'all' ? 'All Orders' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <div className="bg-[#0c1620] rounded-3xl border border-slate-800 p-12 text-center space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
                <h3 className="font-serif font-bold text-white">No Orders Found</h3>
                <p className="text-xs text-slate-400">Try clearing your filters or check back later.</p>
              </div>
            ) : (
              filteredOrders.map((ord) => (
                <div key={ord.id} className="bg-[#0c1620] rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-sm space-y-4">
                  
                  {/* Top Order Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono font-bold text-sm bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-xl">
                        {ord.id}
                      </span>
                      <span className="text-xs text-slate-400">{ord.createdAt}</span>
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        ord.paymentMode === 'cod' 
                          ? 'bg-amber-950 text-amber-300 border border-amber-700/50' 
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                      }`}>
                        {ord.paymentMode}
                      </span>
                    </div>

                    {/* Status Updater & Actions */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-slate-400 font-semibold">Status:</span>
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-slate-700 font-bold text-xs bg-[#070d12] text-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="Confirmed">Confirmed</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() => handleWhatsAppNotify(ord)}
                        className="p-2 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900 transition flex items-center gap-1 text-xs font-bold"
                        title="Send WhatsApp Update to Customer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">WhatsApp</span>
                      </button>

                      <button
                        onClick={() => setActiveInvoiceOrder(ord)}
                        className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition flex items-center gap-1 text-xs font-bold"
                        title="Print Packing Slip / Receipt"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Print Slip</span>
                      </button>
                    </div>
                  </div>

                  {/* Order Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    
                    {/* Customer & Address */}
                    <div className="space-y-2 bg-[#081018] p-4 rounded-2xl border border-slate-800/80">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                        Customer & Delivery Address:
                      </span>
                      <div className="font-bold text-white text-sm">
                        {ord.customerName}
                      </div>
                      <div className="text-amber-400 font-mono">
                        <a href={`tel:${ord.phone}`} className="hover:underline flex items-center gap-1">
                          <Phone className="w-3 h-3 inline" /> {ord.phone}
                        </a>
                      </div>
                      <div className="text-slate-300 leading-relaxed pt-1">
                        {ord.address}
                      </div>

                      {/* Courier Tracking Section */}
                      <div className="pt-3 mt-2 border-t border-slate-800 flex items-center gap-2">
                        <Truck className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                          type="text"
                          placeholder="Add Courier Tracking ID (e.g. BD-89234)..."
                          value={trackingInputs[ord.id] !== undefined ? trackingInputs[ord.id] : (ord.trackingId || '')}
                          onChange={(e) => setTrackingInputs({ ...trackingInputs, [ord.id]: e.target.value })}
                          className="flex-1 px-3 py-1.5 rounded-xl bg-[#04080c] border border-slate-700 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                        <button
                          onClick={() => handleSaveTracking(ord.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 text-amber-400 font-bold hover:bg-slate-700 transition shrink-0"
                        >
                          Save
                        </button>
                      </div>
                    </div>

                    {/* Items Breakdown */}
                    <div className="space-y-2 bg-[#081018] p-4 rounded-2xl border border-slate-800/80">
                      <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px] block">
                        Items Ordered ({ord.items ? ord.items.length : 0}):
                      </span>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {ord.items && ord.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-center text-slate-300 py-1 border-b border-slate-800/60 last:border-0">
                            <div>
                              <span className="font-semibold text-white">{it.name}</span>
                              {it.selectedSize && (
                                <span className="text-[10px] text-amber-400 ml-1.5">({it.selectedSize})</span>
                              )}
                              <span className="text-slate-400 ml-1">× {it.quantity}</span>
                            </div>
                            <span className="font-mono text-slate-200">₹{it.price * it.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-black">
                        <span className="text-slate-300">Total Payable:</span>
                        <span className="text-emerald-400 font-mono text-base">₹{ord.total}</span>
                      </div>
                    </div>

                  </div>

                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PRODUCTS & CATALOG CRUD                                            */}
      {/* ========================================================================= */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          
          {/* Product Search & Category Filters */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-[#0c1620] p-4 rounded-3xl border border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search product catalog by title..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#070d12] border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
              {['all', 'wearing', 'fragrance', 'health', 'decor', 'wedding'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setProductCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap capitalize transition ${
                    productCategoryFilter === cat
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cat === 'all' ? 'All Items' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((p) => (
              <div key={p.id} className="bg-[#0c1620] rounded-3xl p-4 border border-slate-800 shadow-sm flex gap-3.5 items-start">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-20 h-20 rounded-2xl object-contain bg-[#070d12] border border-slate-800 p-1.5 shrink-0"
                />
                
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                      {p.category}
                    </span>
                    {p.badge && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 truncate">
                        {p.badge}
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-xs text-white truncate" title={p.name}>
                    {p.name}
                  </h4>

                  <div className="text-xs">
                    <span className="font-black text-emerald-400 font-mono">₹{p.price}</span>
                    {p.mrp && (
                      <span className="line-through text-slate-500 ml-1.5 text-[11px]">
                        ₹{p.mrp}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => {
                        setEditingProduct({ ...p, isNew: false });
                        setIsProductModalOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-[11px] font-bold flex items-center gap-1 transition"
                    >
                      <Edit3 className="w-3 h-3 text-amber-400" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      className="px-2.5 py-1 rounded-xl bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 text-[11px] font-bold flex items-center gap-1 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: DISTRIBUTOR & WHOLESALE LEADS                                      */}
      {/* ========================================================================= */}
      {activeTab === 'distributors' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-white">
                Wholesale Franchise Applications ({distributors.length})
              </h3>
              <p className="text-xs text-slate-400">Direct inquiries from store owners and regional distributors.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {distributors.map((d) => (
              <div key={d.id} className="bg-[#0c1620] rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-serif font-bold text-base text-white">{d.businessName}</h4>
                    <p className="text-xs text-slate-400 font-medium">Owner: {d.ownerName}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                    {d.status || 'New Lead'}
                  </span>
                </div>

                <div className="text-xs text-slate-300 space-y-1 bg-[#070d12] p-3 rounded-2xl border border-slate-800/80">
                  <div><strong className="text-slate-400">Location:</strong> {d.city}, {d.state}</div>
                  <div><strong className="text-slate-400">Planned Investment:</strong> <span className="text-emerald-400 font-bold">{d.investment}</span></div>
                  {d.notes && <div><strong className="text-slate-400">Notes:</strong> {d.notes}</div>}
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <a
                    href={`tel:${d.phone}`}
                    className="flex-1 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-700 transition"
                  >
                    <Phone className="w-3 h-3 text-amber-400" />
                    <span>Call {d.phone}</span>
                  </a>

                  <a
                    href={`https://wa.me/${d.phone.replace(/[^0-9]/g, '')}?text=Assalam%20o%20Alaikum%20${encodeURIComponent(d.ownerName)},%20regarding%20your%20Arabians%20Shopping%20Zone%20distributorship%20inquiry.`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-900 transition"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>WhatsApp Chat</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: PROMO COUPONS                                                      */}
      {/* ========================================================================= */}
      {activeTab === 'coupons' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0c1620] p-5 rounded-3xl border border-slate-800">
            <div>
              <h3 className="font-serif font-bold text-base text-white">Store Discount Vouchers</h3>
              <p className="text-xs text-slate-400">Create, toggle, and manage customer discount codes for checkout.</p>
            </div>
            <button
              onClick={() => {
                setNewCouponData({ code: '', discountType: 'percentage', discountValue: '10', minOrder: '499', description: '' });
                setIsCouponModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs hover:brightness-110 transition shadow-sm flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div key={c.code} className="bg-[#0c1620] rounded-3xl border border-slate-800 p-5 shadow-sm space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-black text-sm px-3 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    {c.code}
                  </span>
                  <button
                    onClick={() => handleToggleCoupon(c.code)}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition ${
                      c.active !== false 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/50' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {c.active !== false ? '● Active' : '○ Inactive'}
                  </button>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <div className="font-bold text-white text-base">
                    {c.discountPercent ? `${c.discountPercent}% OFF Entire Order` : `Flat ₹${c.flatDiscount} OFF`}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Minimum Cart Value: <strong className="text-white">₹{c.minOrder || 0}</strong>
                  </div>
                  <div className="text-[11px] text-amber-300/80 italic">
                    "{c.description || 'Promotional Store Voucher'}"
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-medium">Valid at Checkout</span>
                  <button
                    onClick={() => handleDeleteCoupon(c.code)}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/40 transition"
                    title="Delete Coupon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: STORE & SHIPPING SETTINGS                                          */}
      {/* ========================================================================= */}
      {activeTab === 'settings' && (
        <div className="bg-[#0c1620] rounded-3xl border border-slate-800 p-6 sm:p-8 space-y-6 max-w-4xl">
          <div>
            <h3 className="font-serif font-bold text-xl text-white flex items-center gap-2">
              <span>Store Operations & Live Promotional Controls</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Easily update promotional offers, sales countdowns, combos, shipping rates, and customer helplines live on the storefront.
            </p>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
            
            {/* SECTION 1: FLASH SALE & COUNTDOWN TIMER */}
            <div className="p-5 rounded-2xl bg-[#070d12] border border-amber-500/30 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                    ⚡
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-white">
                      Flash Deal & Live Countdown Banner
                    </h4>
                    <p className="text-[11px] text-slate-400">Controls the urgent ticking countdown banner on the Homepage</p>
                  </div>
                </div>

                {/* Enable / Disable toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={storeSettings.flashSale?.enabled !== false}
                    onChange={(e) => setStoreSettings({
                      ...storeSettings,
                      flashSale: { ...storeSettings.flashSale, enabled: e.target.checked }
                    })}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-800 border-slate-700 focus:ring-0"
                  />
                  <span className="font-bold text-[11px] text-amber-300">
                    {storeSettings.flashSale?.enabled !== false ? 'Active on Home' : 'Disabled'}
                  </span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1 text-[11px]">
                    Offer Badge / Tag
                  </label>
                  <input
                    type="text"
                    value={storeSettings.flashSale?.badge || ''}
                    onChange={(e) => setStoreSettings({
                      ...storeSettings,
                      flashSale: { ...storeSettings.flashSale, badge: e.target.value }
                    })}
                    placeholder="e.g. Special Sunnah Blessing Deal"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#0c1620] border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1 text-[11px]">
                    Coupon Code (1-Click Copy)
                  </label>
                  <input
                    type="text"
                    value={storeSettings.flashSale?.couponCode || ''}
                    onChange={(e) => setStoreSettings({
                      ...storeSettings,
                      flashSale: { ...storeSettings.flashSale, couponCode: e.target.value.trim().toUpperCase() }
                    })}
                    placeholder="e.g. ARABIAN10"
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#0c1620] border border-slate-700 text-amber-300 font-mono font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1 text-[11px]">
                  Offer Headline Text
                </label>
                <input
                  type="text"
                  value={storeSettings.flashSale?.headline || ''}
                  onChange={(e) => setStoreSettings({
                    ...storeSettings,
                    flashSale: { ...storeSettings.flashSale, headline: e.target.value }
                  })}
                  placeholder="e.g. Flat 10% Off On Orders Above ₹999 + Free Express Pan-India COD"
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#0c1620] border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1 text-[11px]">
                  Offer Subtitle / Description
                </label>
                <input
                  type="text"
                  value={storeSettings.flashSale?.subtitle || ''}
                  onChange={(e) => setStoreSettings({
                    ...storeSettings,
                    flashSale: { ...storeSettings.flashSale, subtitle: e.target.value }
                  })}
                  placeholder="e.g. Direct from our market studio. Sealed with tamper-proof halal guarantee."
                  className="w-full px-3.5 py-2.5 rounded-2xl bg-[#0c1620] border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* SECTION 2: STORE INFO & TOP ANNOUNCEMENT */}
            <div className="p-5 rounded-2xl bg-[#070d12] border border-slate-800 space-y-4">
              <h4 className="font-serif font-bold text-sm text-white flex items-center gap-2">
                <span>General Store Information</span>
              </h4>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1 text-[11px]">
                  Store Brand Name
                </label>
                <input
                  type="text"
                  value={storeSettings.storeName}
                  onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#0c1620] border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1 text-[11px]">
                  Top Announcement Bar (Shown at very top of storefront)
                </label>
                <textarea
                  rows={2}
                  value={storeSettings.announcement}
                  onChange={(e) => setStoreSettings({ ...storeSettings, announcement: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl bg-[#0c1620] border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* SECTION 4: SHIPPING CHARGES */}
            <div className="p-5 rounded-2xl bg-[#070d12] border border-slate-800 space-y-4">
              <h4 className="font-serif font-bold text-sm text-white">Shipping & Delivery Fees</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1 text-[11px]">
                    Free Pan-India Delivery Minimum (₹)
                  </label>
                  <input
                    type="number"
                    value={storeSettings.freeShippingThreshold}
                    onChange={(e) => setStoreSettings({ ...storeSettings, freeShippingThreshold: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#0c1620] border border-slate-700 text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1 text-[11px]">
                    Standard Delivery Fee (₹)
                  </label>
                  <input
                    type="number"
                    value={storeSettings.standardShippingFee}
                    onChange={(e) => setStoreSettings({ ...storeSettings, standardShippingFee: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#0c1620] border border-slate-700 text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 5: CONTACT CREDENTIALS */}
            <div className="p-5 rounded-2xl bg-[#070d12] border border-slate-800 space-y-4">
              <h4 className="font-serif font-bold text-sm text-white">Customer Support & Contact Details</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1 text-[11px]">
                    WhatsApp Number (API)
                  </label>
                  <input
                    type="text"
                    value={storeSettings.whatsapp}
                    onChange={(e) => setStoreSettings({ ...storeSettings, whatsapp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#0c1620] border border-slate-700 text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1 text-[11px]">
                    Phone Helpline (Calling)
                  </label>
                  <input
                    type="text"
                    value={storeSettings.phone}
                    onChange={(e) => setStoreSettings({ ...storeSettings, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#0c1620] border border-slate-700 text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1 text-[11px]">
                    Official Support Email
                  </label>
                  <input
                    type="email"
                    value={storeSettings.email}
                    onChange={(e) => setStoreSettings({ ...storeSettings, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-2xl bg-[#0c1620] border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={savingSettings}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs hover:brightness-110 transition shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
              >
                {savingSettings ? 'Saving Changes...' : 'Save & Publish Store Settings'}
              </button>
            </div>

          </form>
        </div>
      )}

    </main>
  </div>

  {/* ========================================================================= */}
  {/* MODAL 1: ADD / EDIT PRODUCT                                               */}
  {/* ========================================================================= */}
  {isProductModalOpen && editingProduct && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0c1620] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 my-8 border border-amber-500/30 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-serif font-bold text-lg text-white">
            {editingProduct.isNew ? 'Add New Product to Catalog' : 'Edit Product Details'}
          </h3>
          <button
            onClick={() => setIsProductModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Product Title *</label>
            <input
              type="text"
              required
              value={editingProduct.name}
              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#070d12] border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Category *</label>
              <select
                value={editingProduct.category}
                onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#070d12] border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="wearing">Wearing & Royal Attire (Men)</option>
                <option value="health">Health & Sunnah Foods</option>
                <option value="fragrance">Attar, Oud & Bakhoor</option>
                <option value="decor">Islamic Home Decor</option>
                <option value="wedding">Nikah & Wedding Collection</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Special Badge</label>
              <input
                type="text"
                placeholder="e.g. Sunnah Classic, Bestseller"
                value={editingProduct.badge || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#070d12] border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                required
                value={editingProduct.price}
                onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#070d12] border border-slate-700 text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">MRP Price (₹)</label>
              <input
                type="number"
                value={editingProduct.mrp || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, mrp: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#070d12] border border-slate-700 text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Product Photo Upload */}
          <div>
            <label className="block font-bold text-slate-300 mb-1">Product Photo</label>
            <div className="flex items-center gap-3">
              <img
                src={editingProduct.image}
                alt=""
                className="w-14 h-14 rounded-2xl object-contain border border-slate-700 p-1 bg-[#070d12]"
              />
              <label className="flex-1 py-3 px-4 rounded-2xl border border-dashed border-slate-600 text-center cursor-pointer hover:border-amber-500 text-slate-300 font-bold transition">
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                {uploadingImage ? 'Uploading Image...' : 'Upload Image from Mobile / PC'}
              </label>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Product Description</label>
            <textarea
              rows={3}
              value={editingProduct.description || ''}
              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#070d12] border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-3">
            <button
              type="submit"
              disabled={savingProduct}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black tracking-wide hover:brightness-110 transition shadow-lg shadow-amber-500/20"
            >
              {savingProduct ? 'Saving Product...' : 'Save Product Changes'}
            </button>
            <button
              type="button"
              onClick={() => setIsProductModalOpen(false)}
              className="px-5 py-3.5 rounded-2xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

  {/* ========================================================================= */}
  {/* MODAL 2: CREATE COUPON                                                    */}
  {/* ========================================================================= */}
  {isCouponModalOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0c1620] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 my-8 border border-amber-500/30 shadow-2xl text-slate-100">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-serif font-bold text-lg text-white">Create New Discount Voucher</h3>
          <button
            onClick={() => setIsCouponModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreateCoupon} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1">Coupon Code *</label>
            <input
              type="text"
              required
              placeholder="e.g. JUMMAH15, EIDMUBARAK"
              value={newCouponData.code}
              onChange={(e) => setNewCouponData({ ...newCouponData, code: e.target.value.toUpperCase() })}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#070d12] border border-slate-700 font-mono uppercase font-black text-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Discount Type *</label>
              <select
                value={newCouponData.discountType}
                onChange={(e) => setNewCouponData({ ...newCouponData, discountType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#070d12] border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">Discount Value *</label>
              <input
                type="number"
                required
                min="1"
                value={newCouponData.discountValue}
                onChange={(e) => setNewCouponData({ ...newCouponData, discountValue: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-[#070d12] border border-slate-700 text-white font-mono font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Minimum Order Value (₹) *</label>
            <input
              type="number"
              required
              min="0"
              value={newCouponData.minOrder}
              onChange={(e) => setNewCouponData({ ...newCouponData, minOrder: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#070d12] border border-slate-700 text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1">Coupon Description</label>
            <input
              type="text"
              placeholder="e.g. 15% Off for Jummah Blessings"
              value={newCouponData.description}
              onChange={(e) => setNewCouponData({ ...newCouponData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-[#070d12] border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-3">
            <button
              type="submit"
              disabled={savingCoupon}
              className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black tracking-wide hover:brightness-110 transition shadow-lg shadow-amber-500/20"
            >
              {savingCoupon ? 'Saving Coupon...' : 'Create & Activate'}
            </button>
            <button
              type="button"
              onClick={() => setIsCouponModalOpen(false)}
              className="px-5 py-3.5 rounded-2xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

  {/* ========================================================================= */}
  {/* MODAL 3: PRINTABLE PACKING SLIP / INVOICE                                 */}
  {/* ========================================================================= */}
  {activeInvoiceOrder && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 max-w-2xl w-full space-y-6 my-8 shadow-2xl border border-amber-500/40 relative">
        
        {/* Action Bar (Print / Close) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Official Dispatch Slip & Invoice
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-slate-950 text-amber-400 hover:bg-slate-850 text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={() => setActiveInvoiceOrder(null)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Branded Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-serif font-black text-2xl text-slate-950 tracking-wide">
              ARABIANS SHOPPING ZONE
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Sunnah & Luxury Lifestyle • Pan-India Delivery
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              WhatsApp: +91 72338 62626 • Call: +91 92360 28318 • arabiansshoppingzone@gmail.com
            </p>
          </div>

          <div className="text-right">
            <div className="font-mono font-bold text-sm bg-slate-100 px-3 py-1 rounded-xl inline-block text-slate-950">
              {activeInvoiceOrder.id}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Date: {activeInvoiceOrder.createdAt}
            </div>
            <div className="text-xs font-bold uppercase text-amber-700">
              Payment: {activeInvoiceOrder.paymentMode}
            </div>
          </div>
        </div>

        {/* Customer & Address Details */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
          <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">
            Billed & Shipped To:
          </span>
          <div className="font-bold text-slate-900 text-sm">{activeInvoiceOrder.customerName}</div>
          <div className="text-slate-600">{activeInvoiceOrder.address}</div>
          <div className="text-slate-700 font-mono">Contact: {activeInvoiceOrder.phone}</div>
          {activeInvoiceOrder.trackingId && (
            <div className="text-emerald-700 font-bold pt-1">
              Courier Tracking: {activeInvoiceOrder.trackingId}
            </div>
          )}
        </div>

        {/* Items Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Item Description</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Unit Price</th>
                <th className="p-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeInvoiceOrder.items && activeInvoiceOrder.items.map((it, idx) => (
                <tr key={idx}>
                  <td className="p-3 font-medium text-slate-900">
                    {it.name} {it.selectedSize ? `(${it.selectedSize})` : ''}
                  </td>
                  <td className="p-3 text-center">{it.quantity}</td>
                  <td className="p-3 text-right font-mono">₹{it.price}</td>
                  <td className="p-3 text-right font-mono font-bold">₹{it.price * it.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="flex justify-end text-xs">
          <div className="w-64 space-y-1.5 text-right">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono">₹{activeInvoiceOrder.total}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping:</span>
              <span className="text-emerald-600 font-bold">FREE</span>
            </div>
            <div className="flex justify-between font-black text-sm text-slate-950 pt-2 border-t border-slate-200">
              <span>Total Amount:</span>
              <span className="text-emerald-800 font-mono text-base">₹{activeInvoiceOrder.total}</span>
            </div>
          </div>
        </div>

        {/* Footer Blessing */}
        <div className="text-center pt-4 border-t border-slate-100 text-[11px] text-slate-400">
          JazakAllah Khair for your trust & purchase! • Arabians Shopping Zone
        </div>

      </div>
    </div>
  )}

</div>
);
}
