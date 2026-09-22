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
  CheckCircle2,
  Clock, 
  Phone, 
  MessageSquare, 
  IndianRupee, 
  ArrowLeft,
  ArrowRight,
  RefreshCw, 
  Search, 
  Filter, 
  Tag,
  ExternalLink,
  Send,
  Download,
  Menu,
  X,
  Shield,
  Eye,
  EyeOff,
  Printer,
  Truck,
  DollarSign,
  Settings,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  AlertCircle,
  Sparkles,
  Layers,
  Shirt,
  HeartPulse,
  Droplets,
  Flame,
  BookOpen,
  Gift,
  Gem,
  Scroll,
  Star,
  Compass,
  Image as ImageIcon,
  CreditCard,
  ShieldCheck,
  Ticket
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { searchProducts } from '../utils/searchEngine';

const ICON_OPTIONS = [
  { id: 'Sparkles', name: 'Sparkles (Royal Star / Curated)', Component: Sparkles },
  { id: 'Shirt', name: 'Shirt (Thobes, Jubba & Clothing)', Component: Shirt },
  { id: 'HeartPulse', name: 'HeartPulse (Health, Talbina & Honey)', Component: HeartPulse },
  { id: 'Droplets', name: 'Droplets (Dehnul Oud & Attar)', Component: Droplets },
  { id: 'Flame', name: 'Flame (Bakhoor & Mabkhara)', Component: Flame },
  { id: 'BookOpen', name: 'BookOpen (Quran & Double Rehal)', Component: BookOpen },
  { id: 'Gift', name: 'Gift (Nikah Hampers & Trunks)', Component: Gift },
  { id: 'Gem', name: 'Gem (Rings, Stones & Solitaires)', Component: Gem },
  { id: 'Clock', name: 'Clock (Azan & Namaz Times)', Component: Clock },
  { id: 'Compass', name: 'Compass (Qibla Direction & Heritage)', Component: Compass },
  { id: 'Scroll', name: 'Scroll (Nikah Nama Booklets)', Component: Scroll },
  { id: 'Package', name: 'Package (General Inventory)', Component: Package }
];

const CATEGORY_ICON_MAP = ICON_OPTIONS.reduce((acc, curr) => {
  acc[curr.id] = curr.Component;
  return acc;
}, {});

export default function AdminPage() {
  const { products, categories, heroSlides, setHeroSlides, refreshAll, showToast, settings: globalSettings } = useStore();

  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('asz_admin_auth') === 'true';
  });

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'orders', 'products', 'categories', 'banners', 'distributors', 'coupons', 'settings'
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

  // Shipmozo Delivery Integration State
  const [pushingMozoId, setPushingMozoId] = useState(null);
  const [autoAssigningMozoId, setAutoAssigningMozoId] = useState(null);
  const [mozoModalOrder, setMozoModalOrder] = useState(null);
  const [mozoWeight, setMozoWeight] = useState(500);
  const [mozoWarehouse, setMozoWarehouse] = useState('66952');
  const [mozoStatus, setMozoStatus] = useState(null);

  // Products filters & modal state
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [productUrlInput, setProductUrlInput] = useState('');
  const [previewImageIdx, setPreviewImageIdx] = useState(0);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const productFileInputRef = React.useRef(null);
  const [newSizeInput, setNewSizeInput] = useState('');

  // Category CRUD state
  const [editingCategory, setEditingCategory] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [savingCategory, setSavingCategory] = useState(false);
  const [catImageFile, setCatImageFile] = useState(null);
  const [uploadingCatImage, setUploadingCatImage] = useState(false);
  const [newSubcatInput, setNewSubcatInput] = useState('');
  const catFileInputRef = React.useRef(null);

  // Hero Slide CRUD state
  const [editingSlide, setEditingSlide] = useState(null);
  const [isSlideModalOpen, setIsSlideModalOpen] = useState(false);
  const [savingSlide, setSavingSlide] = useState(false);
  const [slideImageFile, setSlideImageFile] = useState(null);
  const [uploadingSlideImage, setUploadingSlideImage] = useState(false);
  const slideFileInputRef = React.useRef(null);

  // Coupon modal state
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [savingCoupon, setSavingCoupon] = useState(false);
  const [newCouponData, setNewCouponData] = useState({
    code: '',
    scope: 'all', // 'all' (Har Product Par) or 'specific' (Kisi Ek Product Par)
    productId: '',
    discountType: 'percentage',
    discountValue: '10',
    minOrder: '0',
    description: ''
  });

  const openCouponModal = (initialScope = 'all', initialProductId = '') => {
    setNewCouponData({
      code: '',
      scope: initialScope,
      productId: initialProductId || (products && products[0] ? products[0].id : ''),
      discountType: 'percentage',
      discountValue: '10',
      minOrder: '0',
      description: ''
    });
    setIsCouponModalOpen(true);
  };

  // Store settings state
  const [storeSettings, setStoreSettings] = useState({
    storeName: "Arabians Shopping Zone",
    whatsapp: "917233862626",
    whatsappDisplay: "+91 72338 62626",
    phone: "+91 72338 62626",
    callNumber: "+91 72338 62626",
    email: "arabiansshoppingzone@gmail.com",
    announcement: "🌙 Special Offer: Free Express Pan-India Delivery on orders above ₹999!",
    freeShippingThreshold: 999,
    standardShippingFee: 70,
    onlineDiscountEnabled: true,
    onlineDiscountType: 'flat',
    onlineDiscountValue: 50,
    codFeeEnabled: false,
    codExtraFee: 50,
    flashSale: {
      enabled: true,
      badge: "Special Sunnah Blessing Deal",
      headline: "Special Direct Discounts Available + Free Express Pan-India Delivery",
      subtitle: "Direct from our market studio. Sealed with tamper-proof halal guarantee.",
      couponCode: ""
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

  const getAdminHeaders = (extra = {}) => {
    const token = sessionStorage.getItem('asz_admin_token') || '';
    const pin = sessionStorage.getItem('asz_admin_pin') || passcode || 'arabians786';
    return {
      'x-admin-token': token,
      'x-admin-pin': pin,
      ...extra
    };
  };

  // Load orders, distributors, coupons & settings
  const fetchAdminData = async () => {
    setLoadingOrders(true);
    try {
      const [ordersRes, distRes, coupRes, setRes] = await Promise.all([
        fetch('/api/orders', { headers: getAdminHeaders() }).catch(() => ({ json: () => [] })),
        fetch('/api/distributors', { headers: getAdminHeaders() }).catch(() => ({ json: () => [] })),
        fetch('/api/coupons', { headers: getAdminHeaders() }).catch(() => ({ json: () => [] })),
        fetch('/api/settings').catch(() => ({ json: () => null }))
      ]);

      if (ordersRes.status === 401) {
        handleLogout();
        showToast("Admin session expired. Please re-enter PIN.", "error");
        return;
      }

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

  const playOrderChime = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now);
      gain1.gain.setValueAtTime(0.25, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.3);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880.00, now + 0.12);
      gain2.gain.setValueAtTime(0.35, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.55);
    } catch {
      // Audio autoplay policy
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();

      // BroadcastChannel for instant 0.1s order receipt if ordered in same browser
      const adminSyncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
        ? new BroadcastChannel('asz_realtime_sync')
        : null;

      if (adminSyncChannel) {
        adminSyncChannel.onmessage = (e) => {
          if (e.data?.type === 'ORDER_PLACED') {
            playOrderChime();
            showToast(`🔔 New Order Received Instantly: ${e.data.orderId || ''}!`);
            fetch('/api/orders', { headers: getAdminHeaders(), cache: 'no-store' })
              .then(r => r.json())
              .then(freshOrders => {
                if (Array.isArray(freshOrders)) setOrders(freshOrders);
              })
              .catch(() => {});
          }
        };
      }

      // Ultra-fast Auto-poll orders every 3.5 seconds so new orders show up live without delay!
      const pollTimer = setInterval(() => {
        fetch('/api/orders', { headers: getAdminHeaders(), cache: 'no-store' })
          .then(r => {
            if (r.status === 401) return null;
            return r.json();
          })
          .then(freshOrders => {
            if (Array.isArray(freshOrders)) {
              setOrders(prev => {
                if (prev.length > 0 && freshOrders.length > prev.length) {
                  playOrderChime();
                  showToast(`🔔 New Order Received: ${freshOrders[0]?.id}!`);
                }
                return freshOrders;
              });
            }
          })
          .catch(() => {});
      }, 3500);

      // Fetch Shipmozo connection status & warehouse info
      fetch('/api/shipmozo/status', { headers: getAdminHeaders(), cache: 'no-store' })
        .then(r => r.json())
        .then(st => setMozoStatus(st))
        .catch(() => {});

      return () => {
        clearInterval(pollTimer);
        if (adminSyncChannel) adminSyncChannel.close();
      };
    }
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: passcode.trim() })
      });
      const data = await res.json();
      if (res.ok && data.success && data.token) {
        setIsAuthenticated(true);
        sessionStorage.setItem('asz_admin_auth', 'true');
        sessionStorage.setItem('asz_admin_token', data.token);
        sessionStorage.setItem('asz_admin_pin', passcode.trim());
        showToast("Admin access granted. Welcome to Arabians Executive Console!");
      } else {
        showToast(data.message || "Incorrect Passcode. Access denied.", "error");
      }
    } catch {
      if (passcode.trim() === 'arabians786') {
        setIsAuthenticated(true);
        sessionStorage.setItem('asz_admin_auth', 'true');
        sessionStorage.setItem('asz_admin_pin', passcode.trim());
        showToast("Admin access granted.");
      } else {
        showToast("Login connection error", "error");
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('asz_admin_auth');
    sessionStorage.removeItem('asz_admin_token');
    sessionStorage.removeItem('asz_admin_pin');
    showToast("Logged out of Admin Console.");
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
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
        headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
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
    const tracking = trackingInputs[order.id] || order.trackingId || order.trackingNumber || 'Preparing for dispatch';
    const cName = order.customerName || order.customer?.name || 'Valued Customer';
    const cPhone = order.phone || order.customer?.phone || '';
    const cAddress = order.address || (order.customer ? [order.customer.address, order.customer.city, order.customer.state, order.customer.pincode].filter(Boolean).join(', ') : '');
    const cPayment = (order.paymentMode || order.paymentMethod || 'COD').toUpperCase();
    const cStatus = (order.status || 'Confirmed').toUpperCase();

    const text = encodeURIComponent(
      `Assalam o Alaikum ${cName},\n\n` +
      `Your Arabians Shopping Zone order *${order.id}* status has been updated to: *${cStatus}*.\n` +
      `📦 Courier / Tracking: ${tracking}\n` +
      `💰 Total Amount: ₹${order.total} (${cPayment})\n` +
      `📍 Delivery to: ${cAddress}\n\n` +
      `🚚 You can track your parcel live anytime:\n${window.location.origin}/#/track?query=${order.id}\n\n` +
      `JazakAllah Khair for shopping with Arabians Shopping Zone!`
    );
    if (cPhone) {
      window.open(`https://wa.me/${cPhone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
    } else {
      showToast("No customer phone number available for WhatsApp", "error");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm(`Are you sure you want to delete order ${orderId}?`)) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: getAdminHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.filter(o => o.id !== orderId));
        showToast(`Order ${orderId} deleted successfully.`);
      }
    } catch {
      showToast("Error deleting order", "error");
    }
  };

  const handleResetOrders = async () => {
    if (!window.confirm("Are you sure you want to reset all orders to 0? This will clear all test bookings for clean launch.")) return;
    try {
      const res = await fetch('/api/admin/reset-orders', {
        method: 'POST',
        headers: getAdminHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setOrders([]);
        showToast("All orders reset to zero state.");
      }
    } catch {
      showToast("Error resetting orders", "error");
    }
  };

  const handleDeleteDistributor = async (id) => {
    if (!window.confirm("Are you sure you want to remove this dealer lead?")) return;
    try {
      const res = await fetch(`/api/distributors/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setDistributors(prev => prev.filter(d => d.id !== id));
        showToast("Dealer lead removed successfully.");
      }
    } catch {
      showToast("Error deleting distributor lead", "error");
    }
  };

  const handleResetDistributors = async () => {
    if (!window.confirm("Are you sure you want to clear all dealer leads to 0 for launch?")) return;
    try {
      const res = await fetch('/api/admin/reset-distributors', {
        method: 'POST',
        headers: getAdminHeaders()
      });
      const data = await res.json();
      if (data.success) {
        setDistributors([]);
        showToast("All dealer leads reset to zero state.");
      }
    } catch {
      showToast("Error resetting distributor leads", "error");
    }
  };

  // Shipmozo Official Delivery Dispatch Handlers
  const handlePushToShipmozo = async (order, customWeight = 500, warehouseId = '66952') => {
    setPushingMozoId(order.id);
    try {
      const res = await fetch(`/api/shipmozo/push-order/${order.id}`, {
        method: 'POST',
        headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          weight: customWeight,
          warehouseId: warehouseId
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`🚀 Order ${order.id} pushed to Shipmozo! Visible in Shipmozo panel.`);
        setMozoModalOrder(null);
        fetchAdminData();
      } else {
        showToast(data.message || "Failed to push order to Shipmozo", "error");
      }
    } catch (err) {
      showToast("Error connecting to Shipmozo server: " + err.message, "error");
    } finally {
      setPushingMozoId(null);
    }
  };

  const handleAutoAssignMozo = async (order) => {
    setAutoAssigningMozoId(order.id);
    try {
      const res = await fetch(`/api/shipmozo/auto-assign/${order.id}`, {
        method: 'POST',
        headers: getAdminHeaders()
      });
      const data = await res.json();
      if (data.success) {
        showToast(`🚚 Courier Assigned: ${data.courier} | AWB: ${data.awb}`);
        fetchAdminData();
      } else {
        showToast(data.message || "Failed to auto-assign courier in Shipmozo", "error");
      }
    } catch (err) {
      showToast("Error assigning courier: " + err.message, "error");
    } finally {
      setAutoAssigningMozoId(null);
    }
  };

  const handleExportShipmozoCsv = () => {
    if (!orders.length) {
      showToast("No orders available to export", "error");
      return;
    }
    const headers = [
      "Order ID", "Order Date", "Customer Name", "Customer Phone", "Customer Email",
      "Address", "City", "State", "Pincode", "Payment Type", "COD Amount", "Weight (Grams)", "Warehouse ID"
    ];
    const rows = orders.map(o => {
      const c = o.customer || {};
      const fullAddr = (o.address || c.address || '').replace(/"/g, '""');
      const isCod = (o.paymentMode || o.paymentMethod || 'COD').toUpperCase() === 'COD';
      return [
        `"${o.id}"`,
        `"${(o.date || o.createdAt || '').slice(0, 10)}"`,
        `"${(o.customerName || c.name || 'Customer').replace(/"/g, '""')}"`,
        `"${(o.phone || c.phone || '7233862626').replace(/[^0-9]/g, '').slice(-10)}"`,
        `"${o.email || c.email || 'arabianshoppingzone26@gmail.com'}"`,
        `"${fullAddr}"`,
        `"${c.city || 'Kanpur'}"`,
        `"${c.state || 'Uttar Pradesh'}"`,
        `"${c.pincode || '208001'}"`,
        `"${isCod ? 'COD' : 'PREPAID'}"`,
        `"${isCod ? o.total : '0'}"`,
        `"500"`,
        `"66952"`
      ].join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Shipmozo_Orders_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("📥 Exported CSV file formatted for Shipmozo Bulk Import!");
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
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

  const getProductPhotos = (prod) => {
    if (!prod) return [];
    if (Array.isArray(prod.gallery) && prod.gallery.length > 0) {
      const filtered = prod.gallery.filter(u => u && typeof u === 'string' && u.trim() && u !== '/assets/logo/logo_main.png');
      if (filtered.length > 0) return filtered.slice(0, 3);
    }
    if (prod.image && prod.image !== '/assets/logo/logo_main.png') {
      return [prod.image];
    }
    return [];
  };

  const openProductModal = (productToEdit = null) => {
    setProductUrlInput('');
    setPreviewImageIdx(0);
    setNewSizeInput('');
    if (!productToEdit) {
      setEditingProduct({
        id: `prod-${Date.now()}`,
        isNew: true,
        name: '',
        category: categories[0]?.id || 'wearing',
        subcategory: '',
        subCategory: '',
        price: 999,
        mrp: 1499,
        stock: 50,
        rating: 5.0,
        reviewsCount: 1,
        badge: 'New Arrival',
        image: '/assets/logo/logo_main.png',
        gallery: [],
        imageFit: 'auto',
        description: '',
        benefits: [],
        tags: [],
        sizes: [],
        outOfStockSizes: [],
        inStock: true,
        deliveryChargeType: 'default',
        freeDelivery: false,
        customDeliveryCharge: '',
        hasCoupon: false,
        couponCode: '',
        couponType: 'flat',
        couponDiscount: '',
        couponMinOrder: '',
        couponDescription: ''
      });
    } else {
      const photos = getProductPhotos(productToEdit);
      setEditingProduct({
        ...productToEdit,
        isNew: false,
        gallery: photos,
        image: photos[0] || productToEdit.image || '/assets/logo/logo_main.png',
        imageFit: productToEdit.imageFit || 'auto',
        sizes: Array.isArray(productToEdit.sizes) ? [...productToEdit.sizes] : [],
        outOfStockSizes: Array.isArray(productToEdit.outOfStockSizes) ? [...productToEdit.outOfStockSizes] : [],
        inStock: productToEdit.inStock !== false,
        deliveryChargeType: productToEdit.deliveryChargeType || (productToEdit.freeDelivery ? 'free' : (productToEdit.customDeliveryCharge !== undefined && productToEdit.customDeliveryCharge !== null ? 'custom' : 'default')),
        freeDelivery: Boolean(productToEdit.freeDelivery || productToEdit.deliveryChargeType === 'free'),
        customDeliveryCharge: (productToEdit.customDeliveryCharge !== undefined && productToEdit.customDeliveryCharge !== null) ? productToEdit.customDeliveryCharge : '',
        hasCoupon: Boolean(productToEdit.hasCoupon || (productToEdit.couponCode && Number(productToEdit.couponDiscount) > 0)),
        couponCode: productToEdit.couponCode || '',
        couponType: productToEdit.couponType || 'flat',
        couponDiscount: productToEdit.couponDiscount !== undefined ? productToEdit.couponDiscount : '',
        couponMinOrder: productToEdit.couponMinOrder !== undefined ? productToEdit.couponMinOrder : '',
        couponDescription: productToEdit.couponDescription || ''
      });
    }
    setIsProductModalOpen(true);
  };

  const handleToggleProductStock = async (product) => {
    const newStatus = product.inStock === false ? true : false;
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ inStock: newStatus })
      });
      const data = await res.json();
      if (data.success || data.product) {
        showToast(`"${product.name.slice(0, 22)}..." marked ${newStatus ? 'In Stock (Live)' : 'Out of Stock'}`);
        refreshAll();
      } else {
        showToast("Failed to update stock", "error");
      }
    } catch {
      showToast("Error updating stock", "error");
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setSavingProduct(true);
    try {
      const photos = getProductPhotos(editingProduct);
      if (photos.length === 0) {
        showToast("Kam se kam 1 photo hona zaroori hai!", "error");
        setSavingProduct(false);
        return;
      }
      if (photos.length > 3) {
        showToast("Ek product me maximum 3 photos hi allow hain!", "error");
        setSavingProduct(false);
        return;
      }

      const url = editingProduct.isNew ? '/api/products' : `/api/products/${editingProduct.id}`;
      const method = editingProduct.isNew ? 'POST' : 'PUT';
      
      const subcatValue = (editingProduct.subcategory || editingProduct.subCategory || '').trim();
      const isFreeDelivery = Boolean(editingProduct.freeDelivery || editingProduct.deliveryChargeType === 'free');
      const customCharge = editingProduct.deliveryChargeType === 'custom' && editingProduct.customDeliveryCharge !== '' && editingProduct.customDeliveryCharge !== null
        ? Number(editingProduct.customDeliveryCharge)
        : null;

      const hasProductCoupon = Boolean(editingProduct.hasCoupon && editingProduct.couponCode && editingProduct.couponCode.trim());
      const cleanCoupon = hasProductCoupon ? editingProduct.couponCode.trim().toUpperCase() : '';
      const couponDisc = hasProductCoupon ? (Number(editingProduct.couponDiscount) || 0) : 0;

      const payload = {
        ...editingProduct,
        image: photos[0],
        gallery: photos.slice(0, 3),
        price: Number(editingProduct.price) || 0,
        mrp: Number(editingProduct.mrp) || Number(editingProduct.price) || 0,
        stock: Number(editingProduct.stock) || 0,
        rating: Number(editingProduct.rating) || 5.0,
        reviewsCount: Number(editingProduct.reviewsCount) || 1,
        badge: (editingProduct.badge || '').trim(),
        subcategory: subcatValue,
        subCategory: subcatValue,
        sizes: Array.isArray(editingProduct.sizes) ? editingProduct.sizes : [],
        outOfStockSizes: Array.isArray(editingProduct.outOfStockSizes) ? editingProduct.outOfStockSizes : [],
        inStock: editingProduct.inStock !== false,
        deliveryChargeType: isFreeDelivery ? 'free' : (editingProduct.deliveryChargeType || 'default'),
        freeDelivery: isFreeDelivery,
        customDeliveryCharge: customCharge,
        hasCoupon: hasProductCoupon,
        couponCode: cleanCoupon,
        couponType: editingProduct.couponType === 'percentage' ? 'percentage' : 'flat',
        couponDiscount: couponDisc,
        couponMinOrder: hasProductCoupon ? (Number(editingProduct.couponMinOrder) || 0) : 0,
        couponDescription: hasProductCoupon ? (editingProduct.couponDescription || '').trim() : ''
      };

      const res = await fetch(url, {
        method,
        headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
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
      const res = await fetch(`/api/products/${id}`, { 
        method: 'DELETE',
        headers: getAdminHeaders()
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Product removed.`);
        refreshAll();
      }
    } catch {
      showToast("Error deleting product", "error");
    }
  };

  const processImageFiles = async (filesList) => {
    const files = Array.from(filesList || []);
    if (!files.length) return;

    const currentPhotos = getProductPhotos(editingProduct);
    if (currentPhotos.length >= 3) {
      showToast("Maximum 3 photos allowed! Pehle kisi photo ko remove karein.", "error");
      return;
    }

    const availableSlots = 3 - currentPhotos.length;
    const filesToUpload = files.slice(0, availableSlots);

    if (files.length > availableSlots) {
      showToast(`Sirf ${availableSlots} photo(s) ki jagah bachi hai (Max 3). Pehli ${availableSlots} upload ho rahi hain.`, "info");
    }

    setUploadingImage(true);
    try {
      const uploadedUrls = [];
      for (const file of filesToUpload) {
        const form = new FormData();
        form.append('image', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: getAdminHeaders(),
          body: form
        });
        const data = await res.json();
        if (data.success && (data.url || data.imageUrl)) {
          uploadedUrls.push(data.url || data.imageUrl);
        }
      }

      if (uploadedUrls.length > 0) {
        const updatedGallery = [...currentPhotos, ...uploadedUrls].slice(0, 3);
        setEditingProduct(prev => ({
          ...prev,
          image: updatedGallery[0],
          gallery: updatedGallery
        }));
        setPreviewImageIdx(0);
        showToast(`✅ ${uploadedUrls.length} photo(s) uploaded successfully! (${updatedGallery.length}/3 photos)`);
      } else {
        showToast("Upload failed. File format check karein.", "error");
      }
    } catch {
      showToast("Image upload error. Please retry.", "error");
    } finally {
      setUploadingImage(false);
      if (productFileInputRef.current) {
        productFileInputRef.current.value = '';
      }
    }
  };

  const handleImageUpload = (e) => {
    processImageFiles(e.target.files);
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    setIsDraggingImage(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImageFiles(e.dataTransfer.files);
    }
  };

  const handleImageDragOver = (e) => {
    e.preventDefault();
    setIsDraggingImage(true);
  };

  const handleImageDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingImage(false);
  };

  const handleAddImageUrl = (e) => {
    if (e) e.preventDefault();
    const trimmed = productUrlInput.trim();
    if (!trimmed) {
      showToast("Please enter an image URL", "error");
      return;
    }

    const currentPhotos = getProductPhotos(editingProduct);
    if (currentPhotos.length >= 3) {
      showToast("Maximum 3 photos limit reached! 3 se zyda photos nahi dal sakte.", "error");
      return;
    }

    const updatedGallery = [...currentPhotos, trimmed].slice(0, 3);
    setEditingProduct(prev => ({
      ...prev,
      image: updatedGallery[0],
      gallery: updatedGallery
    }));
    setProductUrlInput('');
    setPreviewImageIdx(0);
    showToast(`Photo added successfully! (${updatedGallery.length}/3 photos)`);
  };

  const handleRemovePhoto = (indexToRemove) => {
    const currentPhotos = getProductPhotos(editingProduct);
    const updatedGallery = currentPhotos.filter((_, idx) => idx !== indexToRemove);
    setEditingProduct(prev => ({
      ...prev,
      image: updatedGallery[0] || '/assets/logo/logo_main.png',
      gallery: updatedGallery
    }));
    setPreviewImageIdx(0);
    showToast("Photo removed.");
  };

  const handleSetPrimaryPhoto = (index) => {
    if (index === 0) return;
    const currentPhotos = getProductPhotos(editingProduct);
    const selected = currentPhotos[index];
    const rest = currentPhotos.filter((_, idx) => idx !== index);
    const updatedGallery = [selected, ...rest];
    setEditingProduct(prev => ({
      ...prev,
      image: updatedGallery[0],
      gallery: updatedGallery
    }));
    setPreviewImageIdx(0);
    showToast("Main cover photo updated!");
  };

  // Category CRUD Handlers
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory || !editingCategory.name?.trim()) {
      showToast("Category name is required", "error");
      return;
    }
    setSavingCategory(true);
    try {
      let finalImageUrl = editingCategory.image || '/assets/logo/logo_main.png';

      if (catImageFile) {
        setUploadingCatImage(true);
        const form = new FormData();
        form.append('image', catImageFile);
        const upRes = await fetch('/api/upload', { method: 'POST', headers: getAdminHeaders(), body: form });
        const upData = await upRes.json();
        if (upData.success) {
          finalImageUrl = upData.url || upData.imageUrl;
        } else {
          showToast(upData.error || "Image upload failed", "error");
          setSavingCategory(false);
          setUploadingCatImage(false);
          return;
        }
        setUploadingCatImage(false);
      }

      const rawSlug = editingCategory.isNew
        ? (editingCategory.id && editingCategory.id.trim()
            ? editingCategory.id.trim()
            : editingCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
        : editingCategory.id;

      const slugId = rawSlug.toLowerCase().replace(/[^a-z0-9_-]/g, '');

      const payload = {
        id: slugId,
        name: editingCategory.name.trim(),
        shortName: (editingCategory.shortName || editingCategory.name || '').trim(),
        subtitle: (editingCategory.subtitle || '').trim(),
        icon: editingCategory.icon || 'Sparkles',
        badge: (editingCategory.badge || '').trim(),
        image: finalImageUrl,
        subcategories: editingCategory.subcategories || []
      };

      const url = editingCategory.isNew ? '/api/categories' : `/api/categories/${editingCategory.id}`;
      const method = editingCategory.isNew ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        showToast(editingCategory.isNew ? "Category created successfully!" : "Category updated!");
        setIsCategoryModalOpen(false);
        setEditingCategory(null);
        setCatImageFile(null);
        setNewSubcatInput('');
        refreshAll();
      } else {
        showToast(data.error || "Failed to save category", "error");
      }
    } catch {
      showToast("Error saving category", "error");
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? Products in this category will remain safe in inventory.`)) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { 
        method: 'DELETE',
        headers: getAdminHeaders()
      });
      if (res.ok) {
        showToast(`Category "${name}" deleted!`);
        refreshAll();
      } else {
        const err = await res.json();
        showToast(err.error || "Failed to delete category", "error");
      }
    } catch {
      showToast("Failed to delete category", "error");
    }
  };

  const handleReorderCategory = async (direction, catId) => {
    const idx = categories.findIndex(c => c.id === catId);
    if (idx === -1) return;
    const targetIdx = direction === 'left' || direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= categories.length) return;

    const newOrder = [...categories];
    const [moved] = newOrder.splice(idx, 1);
    newOrder.splice(targetIdx, 0, moved);

    try {
      const res = await fetch('/api/categories-reorder', {
        method: 'PUT',
        headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ orderedIds: newOrder.map(c => c.id) })
      });
      if (res.ok) {
        showToast("Category order updated on Homepage!");
        refreshAll();
      } else {
        showToast("Failed to update category order", "error");
      }
    } catch {
      showToast("Error updating category order", "error");
    }
  };

  const handleAddSubcatToCategory = () => {
    if (!newSubcatInput.trim()) return;
    const subName = newSubcatInput.trim();
    const subId = subName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const currentSubs = editingCategory.subcategories || [];
    if (currentSubs.some(s => s.id === subId)) {
      showToast("Subcategory already exists", "error");
      return;
    }
    setEditingCategory({
      ...editingCategory,
      subcategories: [
        ...currentSubs,
        { id: subId, name: subName, image: editingCategory.image || '/assets/logo/logo_main.png' }
      ]
    });
    setNewSubcatInput('');
  };

  const handleRemoveSubcatFromCategory = (subId) => {
    setEditingCategory({
      ...editingCategory,
      subcategories: (editingCategory.subcategories || []).filter(s => s.id !== subId)
    });
  };

  // --- Homepage Hero Slide Handlers ---
  const openSlideModal = (slide = null) => {
    if (slide) {
      setEditingSlide({ ...slide, isNew: false });
    } else {
      setEditingSlide({
        isNew: true,
        id: `slide-${Date.now()}`,
        badge: '✨ Exclusive Collection',
        title: '',
        subtitle: '',
        highlight: '100% Halal Verified • Fast Delivery',
        price: 'From ₹499',
        mrp: '₹799',
        ctaText: 'Shop Collection',
        ctaLink: '/shop',
        image: '/assets/talbina/talbina_banner_43.jpg'
      });
    }
    setSlideImageFile(null);
    setIsSlideModalOpen(true);
  };

  const handleSaveSlide = async (e) => {
    if (e) e.preventDefault();
    if (!editingSlide || !editingSlide.title?.trim()) {
      showToast("Please enter a slide title / headline", "error");
      return;
    }

    setSavingSlide(true);
    try {
      let finalImageUrl = editingSlide.image || '/assets/talbina/talbina_banner_43.jpg';

      // If user picked a local image file, upload it to server first
      if (slideImageFile) {
        setUploadingSlideImage(true);
        const formData = new FormData();
        formData.append('image', slideImageFile);
        const upRes = await fetch('/api/upload', {
          method: 'POST',
          headers: getAdminHeaders(),
          body: formData
        });
        const upData = await upRes.json();
        if (upData.url) {
          finalImageUrl = upData.url;
        }
      }

      const payload = {
        badge: (editingSlide.badge || '').trim(),
        title: (editingSlide.title || '').trim(),
        subtitle: (editingSlide.subtitle || '').trim(),
        highlight: (editingSlide.highlight || '').trim(),
        price: (editingSlide.price || '').trim(),
        mrp: (editingSlide.mrp || '').trim(),
        ctaText: (editingSlide.ctaText || 'Shop Collection').trim(),
        ctaLink: (editingSlide.ctaLink || '/shop').trim(),
        image: finalImageUrl
      };

      let res;
      if (editingSlide.isNew) {
        res = await fetch('/api/hero-slides', {
          method: 'POST',
          headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`/api/hero-slides/${editingSlide.id}`, {
          method: 'PUT',
          headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (res.ok) {
        showToast(editingSlide.isNew ? "🎉 New Hero Banner added!" : "✅ Hero Banner updated successfully!");
        setIsSlideModalOpen(false);
        setEditingSlide(null);
        setSlideImageFile(null);
        if (data.heroSlides) setHeroSlides(data.heroSlides);
        refreshAll();
      } else {
        showToast(data.error || "Failed to save banner slide", "error");
      }
    } catch (err) {
      showToast("Error saving banner: " + err.message, "error");
    } finally {
      setSavingSlide(false);
      setUploadingSlideImage(false);
    }
  };

  const handleReorderSlide = async (slideId, direction) => {
    const slides = [...(heroSlides || [])];
    const idx = slides.findIndex(s => s.id === slideId);
    if (idx === -1) return;
    const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= slides.length) return;

    const temp = slides[idx];
    slides[idx] = slides[targetIdx];
    slides[targetIdx] = temp;

    setHeroSlides(slides);
    try {
      const res = await fetch('/api/hero-slides-reorder', {
        method: 'PUT',
        headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ slideIds: slides.map(s => s.id) })
      });
      const data = await res.json();
      if (res.ok && data.heroSlides) {
        setHeroSlides(data.heroSlides);
        showToast(`Slide #${idx + 1} shifted ${direction === 'left' ? 'left' : 'right'}!`);
      }
    } catch (err) {
      showToast("Failed to reorder: " + err.message, "error");
    }
  };

  const handleDeleteSlide = async (slideId) => {
    if ((heroSlides || []).length <= 1) {
      showToast("Cannot delete the only slide! At least 1 slide must remain on Homepage.", "error");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this Hero Banner slide from the homepage?")) return;
    try {
      const res = await fetch(`/api/hero-slides/${slideId}`, { 
        method: 'DELETE',
        headers: getAdminHeaders()
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Banner slide removed from Homepage");
        if (data.heroSlides) setHeroSlides(data.heroSlides);
        refreshAll();
      } else {
        showToast(data.error || "Failed to delete slide", "error");
      }
    } catch (err) {
      showToast("Error deleting slide: " + err.message, "error");
    }
  };

  const handleResetSlides = async () => {
    if (!window.confirm("Restore original factory hero banner slides (Thobes, Talbina, Oud, Nikah)? This will reset custom changes.")) return;
    try {
      const res = await fetch('/api/hero-slides/reset', { 
        method: 'POST',
        headers: getAdminHeaders()
      });
      const data = await res.json();
      if (res.ok) {
        showToast("↺ Hero banners restored to original royal design!");
        if (data.heroSlides) setHeroSlides(data.heroSlides);
        refreshAll();
      }
    } catch (err) {
      showToast("Reset failed: " + err.message, "error");
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    if (!newCouponData.code.trim()) {
      showToast("Please enter a coupon code", "error");
      return;
    }
    if (newCouponData.scope === 'specific' && !newCouponData.productId) {
      showToast("Please select a specific product for this coupon", "error");
      return;
    }
    setSavingCoupon(true);
    try {
      const selectedProd = (products || []).find(p => String(p.id) === String(newCouponData.productId));
      const payload = {
        code: newCouponData.code.trim().toUpperCase(),
        appliesTo: newCouponData.scope, // 'all' or 'specific'
        productId: newCouponData.scope === 'specific' ? newCouponData.productId : null,
        productName: newCouponData.scope === 'specific' && selectedProd ? selectedProd.name : null,
        discountPercent: newCouponData.discountType === 'percentage' ? Number(newCouponData.discountValue) : 0,
        flatDiscount: newCouponData.discountType === 'flat' ? Number(newCouponData.discountValue) : 0,
        minOrder: Number(newCouponData.minOrder) || 0,
        description: newCouponData.description.trim()
      };
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to save coupon");
      }
      showToast(`Coupon ${payload.code} created & activated successfully!`);
      setIsCouponModalOpen(false);
      setNewCouponData({
        code: '',
        scope: 'all',
        productId: products && products[0] ? products[0].id : '',
        discountType: 'percentage',
        discountValue: '10',
        minOrder: '0',
        description: ''
      });
      refreshAll();
      fetchAdminData();
    } catch (err) {
      showToast(err.message || "Error creating coupon", "error");
    } finally {
      setSavingCoupon(false);
    }
  };

  const handleToggleCoupon = async (code) => {
    try {
      const res = await fetch(`/api/coupons/${code}/toggle`, { 
        method: 'PUT',
        headers: getAdminHeaders()
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Coupon ${code} status updated!`);
        refreshAll();
        fetchAdminData();
      }
    } catch {
      showToast("Failed to toggle coupon status", "error");
    }
  };

  const handleDeleteCoupon = async (code) => {
    if (!window.confirm(`Are you sure you want to delete coupon ${code}?`)) return;
    try {
      const res = await fetch(`/api/coupons/${code}`, { 
        method: 'DELETE',
        headers: getAdminHeaders()
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Coupon ${code} deleted.`);
        refreshAll();
        fetchAdminData();
      }
    } catch {
      showToast("Error deleting coupon", "error");
    }
  };

  const handleClearAllCoupons = async () => {
    if (!window.confirm("Are you sure you want to delete ALL coupons (both product-specific and store-wide)? This cannot be undone.")) return;
    try {
      const res = await fetch('/api/coupons/clear-all', { 
        method: 'POST',
        headers: getAdminHeaders()
      });
      const data = await res.json();
      if (data.success) {
        showToast("All coupons deleted successfully!");
        setCoupons([]);
        refreshAll();
        fetchAdminData();
      }
    } catch {
      showToast("Error clearing coupons", "error");
    }
  };

  const handleRemoveProductCoupon = async (prod) => {
    if (!window.confirm(`Remove coupon from product "${prod.name}"?`)) return;
    try {
      const res = await fetch(`/api/products/${prod.id}`, {
        method: 'PUT',
        headers: getAdminHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          ...prod,
          hasCoupon: false,
          couponCode: '',
          couponDiscount: 0,
          couponDescription: ''
        })
      });
      const data = await res.json();
      if (data.success || data.product) {
        if (prod.couponCode) {
          await fetch(`/api/coupons/${prod.couponCode.trim().toUpperCase()}`, {
            method: 'DELETE',
            headers: getAdminHeaders()
          }).catch(() => {});
        }
        showToast(`Coupon removed from "${prod.name}"`);
        refreshAll();
        fetchAdminData();
      }
    } catch {
      showToast("Error removing product coupon", "error");
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

          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-amber-500/70" />
              <span>Owner Access Only</span>
            </span>
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
    const custName = o.customerName || o.customer?.name || '';
    const custPhone = o.phone || o.customer?.phone || '';
    const ordId = o.id || '';
    const ordStatus = o.status || '';

    const matchesStatus = statusFilter === 'all' || ordStatus.toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch = !orderSearch.trim() || 
      ordId.toLowerCase().includes(orderSearch.toLowerCase()) ||
      custName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      custPhone.includes(orderSearch);
    return matchesStatus && matchesSearch;
  });

  const filteredProducts = (productSearch.trim() ? searchProducts(products, productSearch) : products).filter(p => {
    const matchesCat = productCategoryFilter === 'all' || p.category.toLowerCase() === productCategoryFilter.toLowerCase();
    return matchesCat;
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
              <span className="text-emerald-300 font-bold">Store Database</span>
            </div>
            <span className="text-emerald-400/90 text-[10px] font-mono font-bold tracking-wider">LIVE SYNC</span>
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
              onClick={() => { setActiveTab('categories'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition ${
                activeTab === 'categories'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className={`w-4 h-4 ${activeTab === 'categories' ? 'text-slate-950' : 'text-amber-400'}`} />
                <span className="font-bold">Homepage Circles & Categories</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activeTab === 'categories' ? 'bg-slate-950 text-amber-300' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {categories.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('banners'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition ${
                activeTab === 'banners'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <ImageIcon className={`w-4 h-4 ${activeTab === 'banners' ? 'text-slate-950' : 'text-amber-400'}`} />
                <span className="font-bold">Homepage Hero Banners</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activeTab === 'banners' ? 'bg-slate-950 text-amber-300' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {heroSlides?.length || 4}
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
                {(products.filter(p => p.couponCode && Number(p.couponDiscount) > 0).length + coupons.length)}
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
                {activeTab === 'categories' && 'Homepage Categories & Story Rings'}
                {activeTab === 'settings' && 'Store Configuration & Rates'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25" title="Live Auto-Sync Active Every 3.5s">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>LIVE SYNC (3.5s)</span>
            </div>

            <button
              onClick={fetchAdminData}
              className="p-2.5 rounded-xl bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600 transition"
              title="Sync Store Data"
            >
              <RefreshCw className={`w-4 h-4 ${loadingOrders ? 'animate-spin text-amber-400' : ''}`} />
            </button>

            <button
              onClick={() => { setActiveTab('categories'); setIsMobileSidebarOpen(false); }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                activeTab === 'categories'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-amber-500/30 hover:border-amber-400'
              }`}
              title="Manage Homepage Story Circles & Categories"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Homepage Circles ({categories.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('banners'); setIsMobileSidebarOpen(false); }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                activeTab === 'banners'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-black shadow-sm'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-amber-500/30 hover:border-amber-400'
              }`}
              title="Manage Homepage Hero Carousel Banners"
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>Hero Banners ({heroSlides?.length || 4})</span>
            </button>

            {activeTab === 'products' && (
              <button
                onClick={() => openProductModal()}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs hover:brightness-110 transition shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            )}

            {activeTab === 'categories' && (
              <button
                onClick={() => {
                  setEditingCategory({
                    isNew: true,
                    id: '',
                    name: '',
                    shortName: '',
                    subtitle: '',
                    icon: 'Sparkles',
                    badge: 'New Collection',
                    image: '/assets/logo/logo_main.png',
                    subcategories: []
                  });
                  setCatImageFile(null);
                  setNewSubcatInput('');
                  setIsCategoryModalOpen(true);
                }}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs hover:brightness-110 transition shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            )}

            {activeTab === 'banners' && (
              <button
                onClick={() => openSlideModal()}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs hover:brightness-110 transition shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Banner Slide</span>
              </button>
            )}

            {activeTab === 'coupons' && (
              <button
                onClick={() => openCouponModal('all')}
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
              
              {/* 5 Stat Cards with Prominent Total Orders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                
                {/* 1. Total Revenue */}
                <div className="bg-[#0c1620] p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-sm space-y-2 hover:border-emerald-500/30 transition">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span>Total Store Sales</span>
                    <IndianRupee className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="font-serif text-2xl sm:text-3xl font-black text-emerald-400">
                    ₹{totalRevenue.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Gross earnings from orders
                  </div>
                </div>

                {/* 2. Total Orders Received (Dedicated Stat) */}
                <div 
                  onClick={() => setActiveTab('orders')}
                  className="bg-[#0c1620] p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-sm space-y-2 hover:border-amber-500/40 cursor-pointer transition group"
                >
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span className="group-hover:text-amber-300 transition">Total Orders</span>
                    <ShoppingBag className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="font-serif text-2xl sm:text-3xl font-black text-amber-400 flex items-baseline gap-1.5">
                    <span>{orders.length}</span>
                    <span className="text-xs font-sans text-slate-400 font-normal">Orders Placed</span>
                  </div>
                  <div className="text-[11px] text-amber-400/80 font-medium">
                    Click to view all bookings →
                  </div>
                </div>

                {/* 3. Pending Dispatch */}
                <div 
                  onClick={() => { setActiveTab('orders'); setStatusFilter('confirmed'); }}
                  className="bg-[#0c1620] p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-sm space-y-2 hover:border-orange-500/40 cursor-pointer transition group"
                >
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span className="group-hover:text-orange-300 transition">Pending Dispatch</span>
                    <Truck className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="font-serif text-2xl sm:text-3xl font-black text-orange-400 flex items-baseline gap-1.5">
                    <span>{activeOrdersCount}</span>
                    <span className="text-xs font-sans text-slate-400 font-normal">To ship</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Requires packing & handover
                  </div>
                </div>

                {/* 4. Active Products */}
                <div 
                  onClick={() => setActiveTab('products')}
                  className="bg-[#0c1620] p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-sm space-y-2 hover:border-sky-500/40 cursor-pointer transition group"
                >
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span className="group-hover:text-sky-300 transition">Active Products</span>
                    <Package className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="font-serif text-2xl sm:text-3xl font-black text-sky-400 flex items-baseline gap-1.5">
                    <span>{products.length}</span>
                    <span className="text-xs font-sans text-slate-400 font-normal">Live</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Across {categories.length} Pure Categories
                  </div>
                </div>

                {/* 5. B2B Dealer Leads */}
                <div 
                  onClick={() => setActiveTab('distributors')}
                  className="bg-[#0c1620] p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-sm space-y-2 hover:border-indigo-500/40 cursor-pointer transition group"
                >
                  <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                    <span className="group-hover:text-indigo-300 transition">B2B Dealer Leads</span>
                    <Users className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="font-serif text-2xl sm:text-3xl font-black text-indigo-400 flex items-baseline gap-1.5">
                    <span>{distributors.length}</span>
                    <span className="text-xs font-sans text-slate-400 font-normal">Inquiries</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Wholesale applicants pipeline
                  </div>
                </div>

              </div>

              {/* Quick Action Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                
                <div 
                  onClick={() => setActiveTab('banners')}
                  className="bg-[#0c1620] hover:bg-[#101c29] cursor-pointer p-5 rounded-3xl border border-amber-500/40 hover:border-amber-400 transition group space-y-2"
                >
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-300 to-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
                    🖼️
                  </div>
                  <h3 className="font-serif font-bold text-amber-300 group-hover:text-amber-200 transition">
                    Homepage Hero Banners
                  </h3>
                  <p className="text-xs text-slate-400">
                    Edit slides (Talbina, Thobes, Oud), change photos, prices, text or add new slides.
                  </p>
                </div>

                <div 
                  onClick={() => setActiveTab('categories')}
                  className="bg-[#0c1620] hover:bg-[#101c29] cursor-pointer p-5 rounded-3xl border border-amber-500/30 hover:border-amber-400 transition group space-y-2"
                >
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-300 to-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
                    🎨
                  </div>
                  <h3 className="font-serif font-bold text-amber-300 group-hover:text-amber-200 transition">
                    Homepage Story Circles
                  </h3>
                  <p className="text-xs text-slate-400">
                    Change circle photos, edit titles, reorder circles or add new categories on homepage.
                  </p>
                </div>

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
                  onClick={() => openProductModal()}
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
                    Recent Customer Orders ({orders.length} Total Bookings)
                  </h3>
                  <div className="flex items-center gap-2.5">
                    {orders.length > 0 && (
                      <button
                        onClick={handleResetOrders}
                        className="px-3 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-200 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                        title="Clear all test bookings for clean launch"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                        <span>Reset All Orders</span>
                      </button>
                    )}
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                    >
                      <span>View All Orders →</span>
                    </button>
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 space-y-2">
                    <ShoppingBag className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-sm font-semibold text-slate-400">No customer orders placed yet</p>
                    <p className="text-xs text-slate-500">Live store is reset & ready for fresh launch. Customer orders will appear here in real-time.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800/80">
                    {orders.slice(0, 5).map(o => (
                      <div key={o.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-amber-300">{o.id}</span>
                            <span className="text-slate-400">• {o.customerName || o.customer?.name || 'Customer'}</span>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                              {o.paymentMode || o.paymentMethod || 'COD'}
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

                          <button
                            onClick={() => handleDeleteOrder(o.id)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-900/80 text-slate-400 hover:text-rose-200 border border-slate-700 hover:border-rose-700 transition flex items-center gap-1 text-xs font-bold"
                            title="Delete Order Record"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                            <span className="hidden sm:inline text-rose-300">Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

      {/* TAB 2: ORDERS & FULFILLMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          
          {/* Quick Orders Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#0c1620] p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Orders Placed</div>
                <div className="text-xl sm:text-2xl font-serif font-black text-amber-400">{orders.length}</div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="bg-[#0c1620] p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Sales Earned</div>
                <div className="text-xl sm:text-2xl font-serif font-black text-emerald-400">₹{totalRevenue.toLocaleString()}</div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <IndianRupee className="w-4 h-4" />
              </div>
            </div>
            <div className="bg-[#0c1620] p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Pending / To Ship</div>
                <div className="text-xl sm:text-2xl font-serif font-black text-orange-400">{activeOrdersCount}</div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div className="bg-[#0c1620] p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Delivered Safely</div>
                <div className="text-xl sm:text-2xl font-serif font-black text-sky-400">{orders.filter(o => o.status === 'Delivered').length}</div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
          </div>

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

            {/* Status Filter Pills & Shipmozo Action */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
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

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href="https://panel.shipmozo.com/orders/new"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:brightness-110 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition"
                  title="Open live Shipmozo orders dashboard"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Open Shipmozo</span>
                  <span className="sm:hidden">Mozo</span>
                </a>

                <button
                  onClick={handleExportShipmozoCsv}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition"
                  title="Export orders as CSV for Shipmozo Bulk Import"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>Bulk CSV</span>
                </button>

                {orders.length > 0 && (
                  <button
                    onClick={handleResetOrders}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-700/60 text-rose-200 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                    title="Reset all orders to 0 for fresh store launch"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reset Orders</span>
                  </button>
                )}
              </div>
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
                      <span className="text-xs text-slate-400">{ord.createdAt || ord.date}</span>
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                        (ord.paymentMode || ord.paymentMethod || 'cod').toLowerCase().includes('online') || (ord.paymentMode || ord.paymentMethod || 'cod').toLowerCase().includes('razorpay')
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                          : (ord.paymentMode || ord.paymentMethod || 'cod').toLowerCase() === 'cod' 
                          ? 'bg-amber-950 text-amber-300 border border-amber-700/50' 
                          : 'bg-teal-950 text-teal-300 border border-teal-700/50'
                      }`}>
                        {ord.paymentMode || ord.paymentMethod || 'COD'}
                      </span>
                      {ord.razorpayPaymentId && (
                        <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-lg flex items-center gap-1" title="Razorpay Payment ID">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                          <span>RZP: {ord.razorpayPaymentId}</span>
                        </span>
                      )}
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

                      <button
                        onClick={() => handleDeleteOrder(ord.id)}
                        className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-900/80 text-slate-400 hover:text-rose-200 border border-slate-700 hover:border-rose-700 transition flex items-center gap-1 text-xs font-bold"
                        title="Delete Order Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>

                      {/* SHIPMOZO DIRECT DELIVERY DISPATCH BUTTONS */}
                      {!ord.shipmozoPushed ? (
                        <button
                          onClick={() => setMozoModalOrder(ord)}
                          disabled={pushingMozoId === ord.id}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 via-sky-600 to-blue-700 hover:brightness-110 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-sky-500/25 active:scale-95 transition"
                          title="Push this order directly into Shipmozo delivery platform"
                        >
                          {pushingMozoId === ord.id ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Send className="w-3.5 h-3.5" />
                          )}
                          <span>{pushingMozoId === ord.id ? 'Pushing...' : '📦 Push to Shipmozo'}</span>
                        </button>
                      ) : (
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2.5 py-1 rounded-xl bg-sky-950/80 border border-sky-500/40 text-sky-300 font-bold text-[11px] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                            <span>Pushed to Mozo ({ord.shipmozoOrderId || ord.id})</span>
                          </span>
                          <a
                            href="https://panel.shipmozo.com/orders/new"
                            target="_blank"
                            rel="noreferrer"
                            className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 text-[11px] font-bold flex items-center gap-1 border border-slate-700 transition"
                          >
                            <ExternalLink className="w-3 h-3" /> View in Mozo
                          </a>
                          {!ord.trackingId && (
                            <button
                              onClick={() => handleAutoAssignMozo(ord)}
                              disabled={autoAssigningMozoId === ord.id}
                              className="px-2.5 py-1 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/50 text-emerald-300 text-[11px] font-bold flex items-center gap-1 transition"
                              title="Auto-Assign Courier & Generate AWB in Shipmozo"
                            >
                              <Truck className="w-3 h-3" />
                              <span>{autoAssigningMozoId === ord.id ? 'Assigning...' : 'Auto AWB'}</span>
                            </button>
                          )}
                        </div>
                      )}
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
                        {ord.customerName || ord.customer?.name || 'Customer'}
                      </div>
                      <div className="text-amber-400 font-mono">
                        <a href={`tel:${ord.phone || ord.customer?.phone || ''}`} className="hover:underline flex items-center gap-1">
                          <Phone className="w-3 h-3 inline" /> {ord.phone || ord.customer?.phone || 'No phone'}
                        </a>
                      </div>
                      <div className="text-slate-300 leading-relaxed pt-1">
                        {ord.address || (ord.customer ? [ord.customer.address, ord.customer.city, ord.customer.state, ord.customer.pincode].filter(Boolean).join(', ') : 'No address')}
                      </div>

                      {/* Courier Tracking Section */}
                      <div className="pt-3 mt-2 border-t border-slate-800 flex items-center gap-2">
                        <Truck className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                          type="text"
                          placeholder="Add Courier Tracking ID (e.g. BD-89234)..."
                          value={trackingInputs[ord.id] !== undefined ? trackingInputs[ord.id] : (ord.trackingId || ord.trackingNumber || '')}
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
                          <div key={idx} className="py-1.5 border-b border-slate-800/60 last:border-0 text-slate-300">
                            <div className="flex justify-between items-center">
                              <div>
                                <span className="font-semibold text-white">{it.name}</span>
                                {it.selectedSize && (
                                  <span className="text-[10px] text-amber-400 ml-1.5">({it.selectedSize})</span>
                                )}
                                <span className="text-slate-400 ml-1">× {it.quantity}</span>
                              </div>
                              <span className="font-mono text-slate-200">₹{it.price * it.quantity}</span>
                            </div>
                            {it.customization && (
                              <div className="mt-1.5 p-2 rounded-lg bg-amber-950/40 border border-amber-500/40 text-[11px] text-amber-200 space-y-0.5">
                                <div className="font-bold text-amber-400 flex items-center gap-1">
                                  <span>👑 Personalized Keepsake Order:</span>
                                </div>
                                {it.customization.shareLaterOnWhatsApp ? (
                                  <div className="text-emerald-300 font-semibold">Customer will provide custom details on WhatsApp</div>
                                ) : it.customization.isWedding ? (
                                  <div className="space-y-0.5">
                                    <div className="text-white font-semibold">
                                      Dulha: <span className="text-amber-300">{it.customization.groomName || '-'}</span> &nbsp;|&nbsp; Dulhan: <span className="text-amber-300">{it.customization.brideName || '-'}</span>
                                    </div>
                                    {it.customization.eventDate && (
                                      <div className="text-slate-300">Date: {it.customization.eventDate} {it.customization.cityVenue ? `• ${it.customization.cityVenue}` : ''}</div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-white font-semibold">
                                    Text: <span className="text-amber-300">{it.customization.customText}</span>
                                  </div>
                                )}
                                {it.customization.specialNotes && (
                                  <div className="text-amber-400/80 italic text-[10px]">
                                    Note: "{it.customization.specialNotes}"
                                  </div>
                                )}
                              </div>
                            )}
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
          
          {/* Product Search, Filters & Add Action */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-[#0c1620] p-4 rounded-3xl border border-slate-800">
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

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 text-xs">
              <button
                onClick={() => setProductCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                  productCategoryFilter === 'all'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                All Items ({products.length})
              </button>

              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setProductCategoryFilter(cat.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                    productCategoryFilter === cat.id
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <button
              onClick={() => openProductModal()}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs hover:brightness-110 transition flex items-center justify-center gap-1.5 shadow-md whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
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
                  <div className="flex items-center justify-between gap-1 flex-wrap">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                        {p.category}
                      </span>
                      {p.subcategory && (
                        <span className="text-[9px] font-bold text-slate-400 capitalize">
                          • {p.subcategory.replace(/-/g, ' ')}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 flex-wrap">
                      {Boolean(p.freeDelivery || p.deliveryChargeType === 'free') ? (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700">
                          🚚 Free Delivery
                        </span>
                      ) : p.deliveryChargeType === 'custom' && p.customDeliveryCharge !== undefined && p.customDeliveryCharge !== null ? (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700">
                          🚚 ₹{p.customDeliveryCharge}
                        </span>
                      ) : null}
                      {p.badge && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 truncate">
                          {p.badge}
                        </span>
                      )}
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                        p.inStock === false || (p.stock !== undefined && p.stock <= 0)
                          ? 'bg-rose-950/80 text-rose-300 border-rose-700' 
                          : 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                      }`}>
                        {p.inStock === false || (p.stock !== undefined && p.stock <= 0) ? '🔴 Out of Stock' : '🟢 In Stock'}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-bold text-xs text-white truncate" title={p.name}>
                    {p.name}
                  </h4>

                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-black text-emerald-400 font-mono">₹{p.price}</span>
                      {p.mrp && (
                        <span className="line-through text-slate-500 ml-1.5 text-[11px]">
                          ₹{p.mrp}
                        </span>
                      )}
                    </div>
                    {p.stock !== undefined && (
                      <span className="text-[10px] text-slate-400">
                        Units: <strong className="text-slate-200">{p.stock}</strong>
                      </span>
                    )}
                  </div>

                  {/* Size status if applicable */}
                  {Array.isArray(p.sizes) && p.sizes.length > 0 && (
                    <div className="text-[10px] text-slate-400 pt-0.5">
                      📏 Sizes: <span className={(p.outOfStockSizes || []).length > 0 ? 'text-amber-400 font-semibold' : 'text-slate-300'}>
                        {p.sizes.length - ((p.outOfStockSizes || []).filter(s => p.sizes.includes(s)).length)}/{p.sizes.length} in stock
                      </span>
                      {(p.outOfStockSizes || []).length > 0 && (
                        <span className="text-rose-400 ml-1 font-semibold">({p.outOfStockSizes.length} sold out)</span>
                      )}
                    </div>
                  )}

                  {/* Coupon status if product has a coupon */}
                  {p.couponCode && Number(p.couponDiscount) > 0 && (
                    <div className="flex items-center gap-1 text-[10px] text-amber-300 font-bold bg-amber-950/40 border border-amber-800/50 px-2 py-0.5 rounded-lg w-fit">
                      <Tag className="w-3 h-3 text-amber-400" />
                      <span>Coupon: {p.couponCode} ({p.couponType === 'percentage' ? `${p.couponDiscount}%` : `₹${p.couponDiscount}`} OFF)</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 pt-2 flex-wrap">
                    <button
                      onClick={() => openProductModal(p)}
                      className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-[11px] font-bold flex items-center gap-1 transition"
                    >
                      <Edit3 className="w-3 h-3 text-amber-400" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleToggleProductStock(p)}
                      className={`px-2 py-1 rounded-xl text-[10px] font-bold border transition flex items-center gap-1 ${
                        p.inStock === false 
                          ? 'bg-emerald-950/50 text-emerald-300 border-emerald-700/70 hover:bg-emerald-900/60' 
                          : 'bg-rose-950/50 text-rose-300 border-rose-700/70 hover:bg-rose-900/60'
                      }`}
                      title={p.inStock === false ? 'Click to mark product In Stock' : 'Click to mark product Out of Stock'}
                    >
                      <span>{p.inStock === false ? '🟢 Set In Stock' : '🔴 Mark OOS'}</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      className="px-2 py-1 rounded-xl bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 text-[11px] font-bold flex items-center gap-1 transition ml-auto"
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
      {/* TAB: CATEGORIES & CATALOG ARCHITECTURE                                    */}
      {/* ========================================================================= */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0c1620] p-5 rounded-3xl border border-slate-800 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-white">Store Categories & Catalog Architecture</h3>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                  {categories.length} Collections
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Add new collections, organize subcategories, change icons & badges. Updates both Homepage and Shop instantly.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingCategory({
                  isNew: true,
                  id: '',
                  name: '',
                  subtitle: '',
                  icon: 'Sparkles',
                  badge: 'New Collection',
                  image: '/assets/logo/logo_main.png',
                  subcategories: []
                });
                setCatImageFile(null);
                setNewSubcatInput('');
                setIsCategoryModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs hover:brightness-110 transition flex items-center gap-1.5 shadow-md shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Category</span>
            </button>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, index) => {
              const catProductsCount = products.filter(p => p.category === cat.id).length;
              const IconComp = CATEGORY_ICON_MAP[cat.icon] || Sparkles;

              return (
                <div 
                  key={cat.id} 
                  className="bg-[#0c1620] rounded-3xl p-5 border border-slate-800 shadow-sm flex flex-col justify-between space-y-4 hover:border-amber-500/40 transition group"
                >
                  <div className="space-y-3">
                    {/* Top strip with Homepage Story Circle & Metadata */}
                    <div className="flex items-start gap-3.5">
                      {/* Exact Homepage Circular Story Ring Preview */}
                      <div className="relative shrink-0 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-amber-600 via-amber-300 to-amber-500 shadow-md group-hover:shadow-[0_4px_15px_rgba(217,119,6,0.35)] transition-all">
                          <div className="w-full h-full rounded-full bg-[#faf8f5] p-[2px] overflow-hidden">
                            <img 
                              src={cat.image || '/assets/logo/logo_main.png'} 
                              alt={cat.name} 
                              className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = '/assets/logo/logo_main.png';
                              }}
                            />
                          </div>
                        </div>
                        <span className="text-[9px] font-extrabold text-amber-400 mt-1 max-w-[70px] truncate text-center">
                          {cat.shortName || cat.name}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                              <IconComp className="w-3.5 h-3.5" />
                            </div>
                            <h4 className="font-serif font-bold text-sm text-white truncate">
                              {cat.name}
                            </h4>
                          </div>

                          {/* Reorder Left / Right on Homepage */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => handleReorderCategory('left', cat.id)}
                              className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center text-[10px] font-bold transition"
                              title="Move left on Homepage Story Strip"
                            >
                              ◀
                            </button>
                            <span className="text-[10px] font-mono text-slate-400 font-bold px-1">
                              #{index + 1}
                            </span>
                            <button
                              type="button"
                              disabled={index === categories.length - 1}
                              onClick={() => handleReorderCategory('right', cat.id)}
                              className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center text-[10px] font-bold transition"
                              title="Move right on Homepage Story Strip"
                            >
                              ▶
                            </button>
                          </div>
                        </div>

                        {cat.badge && (
                          <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {cat.badge}
                          </span>
                        )}

                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                          {cat.subtitle || 'Bespoke collection in Arabians Shopping Zone.'}
                        </p>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="p-2 rounded-xl bg-[#070d12] border border-slate-800 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-mono">
                        Slug: <strong className="text-slate-300">{cat.id}</strong>
                      </span>
                      <span className="font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full font-mono text-[10px]">
                        {catProductsCount} Products
                      </span>
                    </div>

                    {/* Subcategories */}
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center justify-between">
                        <span>Subcategories ({cat.subcategories?.length || 0})</span>
                      </div>
                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                        {cat.subcategories && cat.subcategories.length > 0 ? (
                          cat.subcategories.map((sub) => {
                            const subCount = products.filter(p => p.category === cat.id && (p.subcategory === sub.id || p.subCategory === sub.id)).length;
                            return (
                              <span 
                                key={sub.id} 
                                className="inline-flex items-center gap-1 text-[10px] bg-[#070d12] text-slate-300 font-medium px-2 py-0.5 rounded-md border border-slate-800"
                              >
                                <span>{sub.name}</span>
                                {subCount > 0 && <span className="text-emerald-400 font-bold">({subCount})</span>}
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">No subcategories defined</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      data-testid={`edit-cat-${cat.id}`}
                      onClick={() => {
                        setEditingCategory({ 
                          ...JSON.parse(JSON.stringify(cat)), 
                          shortName: cat.shortName || cat.name,
                          isNew: false 
                        });
                        setCatImageFile(null);
                        setNewSubcatInput('');
                        setIsCategoryModalOpen(true);
                      }}
                      className="flex-1 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-bold transition flex items-center justify-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Edit Category</span>
                    </button>

                    <button
                      data-testid={`delete-cat-${cat.id}`}
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-1.5 rounded-xl bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 transition"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: HOMEPAGE HERO BANNER SLIDER STUDIO                                   */}
      {/* ========================================================================= */}
      {activeTab === 'banners' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0c1620] p-5 sm:p-6 rounded-3xl border border-amber-500/30 shadow-sm">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
                  🖼️
                </div>
                <h3 className="font-serif font-bold text-lg text-white">Homepage Hero Banner Slider Studio</h3>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full font-mono">
                  {(heroSlides || []).length} Slides Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1.5 max-w-2xl">
                Full visual control over the top editorial carousel (Talbina, Thobes, Oud, Nikah). Change headlines, photos, pricing, and button links with zero risk of breaking homepage UI.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <button
                onClick={() => handleResetSlides()}
                className="px-3.5 py-2.5 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 border border-slate-700"
                title="Restore curated default banners"
              >
                <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                <span>Reset to Factory Design</span>
              </button>

              <button
                onClick={() => openSlideModal()}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs hover:brightness-110 transition flex items-center gap-1.5 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add New Slide</span>
              </button>
            </div>
          </div>

          {/* Banner Slides List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {(heroSlides || []).map((slide, index) => (
              <div 
                key={slide.id || index}
                className="bg-[#0c1620] rounded-3xl p-5 sm:p-6 border border-slate-800 hover:border-amber-500/40 transition group space-y-4 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  {/* Card Header: Position & Sequence Control */}
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold bg-amber-500/15 border border-amber-500/30 text-amber-400 px-2.5 py-0.5 rounded-full">
                        Slide #{index + 1}
                      </span>
                      {slide.badge && (
                        <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full truncate max-w-[200px]">
                          {slide.badge}
                        </span>
                      )}
                    </div>

                    {/* Reorder Left / Right */}
                    <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1">
                      <button
                        onClick={() => handleReorderSlide(slide.id, 'left')}
                        disabled={index === 0}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-0.5 transition ${
                          index === 0 
                            ? 'text-slate-600 cursor-not-allowed' 
                            : 'text-amber-400 hover:bg-slate-800 hover:text-white'
                        }`}
                        title="Move Slide Left (Earlier in Carousel)"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        <span>Move Left</span>
                      </button>
                      <span className="text-slate-700 text-xs">|</span>
                      <button
                        onClick={() => handleReorderSlide(slide.id, 'right')}
                        disabled={index === (heroSlides || []).length - 1}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-0.5 transition ${
                          index === (heroSlides || []).length - 1
                            ? 'text-slate-600 cursor-not-allowed' 
                            : 'text-amber-400 hover:bg-slate-800 hover:text-white'
                        }`}
                        title="Move Slide Right (Later in Carousel)"
                      >
                        <span>Move Right</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Visual Body: Thumbnail + Headline + Pricing */}
                  <div className="flex items-start gap-4">
                    {/* Fixed aspect ratio thumbnail with guaranteed crop */}
                    <div className="relative w-32 h-24 sm:w-36 sm:h-28 rounded-2xl overflow-hidden bg-slate-900 border border-amber-900/20 shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300">
                      <img 
                        src={slide.image || '/assets/talbina/talbina_banner_43.jpg'} 
                        alt={slide.title}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/assets/talbina/talbina_banner_43.jpg';
                        }}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-xs text-[9px] font-bold text-amber-300 px-1.5 py-0.5 rounded">
                        Locked 4:3
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <h4 className="font-serif font-bold text-white text-base leading-snug group-hover:text-amber-300 transition line-clamp-2">
                        {slide.title}
                      </h4>

                      {slide.subtitle && (
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {slide.subtitle}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {(slide.price || slide.mrp) && (
                          <span className="text-[11px] font-bold font-serif text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {slide.price} <span className="line-through text-slate-500 font-normal ml-0.5">{slide.mrp}</span>
                          </span>
                        )}
                        {slide.highlight && (
                          <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded truncate max-w-[180px]">
                            ✓ {slide.highlight}
                          </span>
                        )}
                      </div>

                      <div className="text-[10px] text-slate-400 pt-1 flex items-center gap-1 font-mono truncate">
                        <span className="text-amber-400 font-bold">Button:</span>
                        <span>"{slide.ctaText || 'Shop Now'}"</span>
                        <span className="text-slate-500">→ {slide.ctaLink || '/shop'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => openSlideModal(slide)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-amber-500/20"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Edit Slide Content & Photo</span>
                  </button>

                  <button
                    onClick={() => handleDeleteSlide(slide.id)}
                    disabled={(heroSlides || []).length <= 1}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1 border ${
                      (heroSlides || []).length <= 1
                        ? 'text-slate-600 border-slate-800 cursor-not-allowed'
                        : 'text-rose-400 hover:bg-rose-950/40 border-rose-900/40 hover:border-rose-800'
                    }`}
                    title="Delete this banner slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
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
            {distributors.length > 0 && (
              <button
                onClick={handleResetDistributors}
                className="px-3.5 py-1.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-200 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                title="Clear all test leads for launch"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Leads ({distributors.length})</span>
              </button>
            )}
          </div>

          {distributors.length === 0 ? (
            <div className="bg-[#0c1620] rounded-3xl border border-slate-800 p-12 text-center space-y-3">
              <Users className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="font-serif font-bold text-white">No Wholesale Applications Yet</h3>
              <p className="text-xs text-slate-400">New distributor and franchise inquiries from the store will appear here in real-time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {distributors.map((d) => {
                const bName = d.businessName || d.name || d.firmName || 'Retail Store';
                const oName = d.ownerName || d.contactPerson || 'Applicant';
                const invest = d.investment || d.investmentBudget || '₹25,000 - ₹50,000';
                const prods = d.categories || d.interestedProducts || [];
                const notesText = d.notes || d.message || '';

                return (
                  <div key={d.id} className="bg-[#0c1620] rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-sm space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-base text-white">{bName}</h4>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">{d.id}</span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium mt-0.5">
                          Owner / Contact: <span className="text-slate-200 font-bold">{oName}</span>
                        </p>
                      </div>
                      <div className="text-right shrink-0 flex items-center gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                            {d.status || 'New Lead'}
                          </span>
                          {d.date && <div className="text-[10px] text-slate-500 mt-1">{d.date}</div>}
                        </div>
                        <button
                          onClick={() => handleDeleteDistributor(d.id)}
                          className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-rose-900/80 text-slate-400 hover:text-rose-200 border border-slate-700 hover:border-rose-700 transition"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  <div className="text-xs text-slate-300 space-y-1.5 bg-[#070d12] p-3.5 rounded-2xl border border-slate-800/80">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Location:</span>
                      <span className="font-semibold text-slate-200">{d.city}, {d.state}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Planned Investment:</span>
                      <span className="text-emerald-400 font-bold">{invest}</span>
                    </div>
                    {prods.length > 0 && (
                      <div className="pt-1.5 border-t border-slate-800">
                        <span className="text-slate-400 block mb-1">Target Products:</span>
                        <div className="flex flex-wrap gap-1">
                          {prods.map((cat, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {notesText && (
                      <div className="pt-1.5 border-t border-slate-800">
                        <strong className="text-slate-400">Notes:</strong> {notesText}
                      </div>
                    )}
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
                      href={`https://wa.me/${d.phone.replace(/[^0-9]/g, '')}?text=Assalam%20o%20Alaikum%20${encodeURIComponent(oName)},%20this%20is%20Arabians%20Shopping%20Zone%20regarding%20your%20Distributor%20Application%20for%20${encodeURIComponent(d.city)}.`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-emerald-900 transition"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>WhatsApp Chat</span>
                    </a>
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: PROMO COUPONS                                                      */}
      {/* ========================================================================= */}
      {activeTab === 'coupons' && (() => {
        const productCouponsList = (products || []).filter(p => p.couponCode && Number(p.couponDiscount) > 0);
        const storeWideCoupons = (coupons || []).filter(c => c.appliesTo !== 'specific');
        const totalCouponsCount = productCouponsList.length + storeWideCoupons.length;

        return (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#0c1620] p-5 rounded-3xl border border-slate-800">
              <div>
                <h3 className="font-serif font-bold text-base text-white flex items-center gap-2">
                  <span>Discounts & Coupon Studio</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">
                    {productCouponsList.length} Product • {storeWideCoupons.length} Store-wide
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Manage product-specific coupons and global store vouchers systematically.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {totalCouponsCount > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllCoupons}
                    className="px-3.5 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-700/80 text-rose-300 font-bold text-xs transition flex items-center gap-1.5"
                    title="Delete all active coupons"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All Coupons</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => openCouponModal('all')}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs hover:brightness-110 transition shadow-sm flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create New Coupon</span>
                </button>
              </div>
            </div>

            {/* Quick Scope Explainer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-2xl bg-[#0c1620]/80 border border-amber-500/20 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-300 flex items-center justify-center shrink-0">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white">Specific Product Coupons</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Sirf us ek product par apply hota hai. Product card & product page par customer ko dikhta hai copy karne ke liye.
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0c1620]/80 border border-emerald-500/20 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-300 flex items-center justify-center shrink-0">
                  <Ticket className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white">Store-Wide Vouchers</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Cart ke subtotal par chalega chahe customer koi sa bhi product buy kare.
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 1: PRODUCT-SPECIFIC COUPONS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-white flex items-center gap-2">
                    <Tag className="w-4 h-4 text-amber-400" />
                    <span>Product-Specific Active Coupons ({productCouponsList.length})</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    These coupons are attached directly to individual products and apply only when that item is in the cart.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openCouponModal('specific')}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 text-amber-300 font-bold text-xs transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product Coupon</span>
                </button>
              </div>

              {productCouponsList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {productCouponsList.map((p) => (
                    <div key={p.id} className="bg-[#0c1620] rounded-3xl border border-slate-800 p-5 shadow-sm space-y-3 relative flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-14 h-14 rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                            <img src={p.image || '/assets/logo/logo_main.png'} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h5 className="font-bold text-xs text-white truncate">{p.name}</h5>
                            <span className="text-[10px] text-slate-400 capitalize">{p.category}</span>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="font-mono font-black text-xs px-2.5 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                {p.couponCode}
                              </span>
                              <span className="text-[10px] font-bold text-emerald-400">
                                {p.couponType === 'percentage' ? `${p.couponDiscount}% OFF` : `₹${p.couponDiscount} OFF`}
                              </span>
                            </div>
                          </div>
                        </div>

                        {p.couponDescription && (
                          <div className="text-[11px] text-amber-200/70 italic bg-[#070d12] p-2.5 rounded-xl border border-slate-800/80">
                            "{p.couponDescription}"
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={() => openProductModal(p)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3 text-amber-400" />
                          <span>Edit Product</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveProductCoupon(p)}
                          className="p-1.5 rounded-xl text-rose-400 hover:bg-rose-950/40 transition"
                          title="Remove coupon from this product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-3xl bg-[#0c1620] border border-dashed border-slate-800 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                    <Tag className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-sm">No Product-Specific Coupons Created Yet</h5>
                    <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                      Aap kisi bhi product par exclusive coupon laga sakte hain. Customer bag me wahi product daalega toh hi discount milega.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openCouponModal('specific')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Product Coupon Now</span>
                  </button>
                </div>
              )}
            </div>

            {/* SECTION 2: STORE-WIDE COUPONS */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-white flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-emerald-400" />
                    <span>Store-Wide Promotional Vouchers ({storeWideCoupons.length})</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Global vouchers applicable to entire order cart subtotal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openCouponModal('all')}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 text-emerald-300 font-bold text-xs transition flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Store Voucher</span>
                </button>
              </div>

              {storeWideCoupons.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {storeWideCoupons.map((c) => (
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
              ) : (
                <div className="p-8 rounded-3xl bg-[#0c1620]/60 border border-dashed border-slate-800 text-center space-y-3">
                  <p className="text-xs text-slate-400">
                    No store-wide vouchers active right now.
                  </p>
                  <button
                    type="button"
                    onClick={() => openCouponModal('all')}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Store-Wide Voucher</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })()}

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
            
            {/* SECTION 0: RAZORPAY PAYMENT GATEWAY STATUS */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#070d12] to-[#070d12] border border-emerald-500/40 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-sm text-white flex items-center gap-2">
                      <span>Razorpay Live Payment Gateway</span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
                        ● Live & Connected
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-400">Accept direct online payments via UPI (GPay/PhonePe/Paytm), Debit/Credit Cards & NetBanking</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Live Merchant Key:</span>
                  <code className="px-2.5 py-1 rounded-lg bg-black/50 border border-slate-700 text-amber-300 font-mono text-[11px]">
                    rzp_live_TaICrfbpvjAX2q
                  </code>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-300">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Accepted Modes</div>
                  <div className="font-bold text-white text-xs mt-0.5">UPI, Cards, NetBanking, Wallets</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Security Protocol</div>
                  <div className="font-bold text-emerald-400 text-xs mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>HMAC-SHA256 Encrypted</span>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Currency & Settlement</div>
                  <div className="font-bold text-white text-xs mt-0.5">INR (₹) • Direct Bank Settlement</div>
                </div>
              </div>
            </div>
            
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
                    placeholder="Optional (e.g. SAVE50)"
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
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h4 className="font-serif font-bold text-sm text-white flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-500" />
                  <span>Pan-India Shipping & Delivery Rules</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setStoreSettings({
                    ...storeSettings,
                    freeShippingThreshold: storeSettings.freeShippingThreshold === 0 ? 999 : 0
                  })}
                  className={`text-[10px] font-bold px-3 py-1 rounded-full border transition ${
                    storeSettings.freeShippingThreshold === 0
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-emerald-500'
                  }`}
                >
                  {storeSettings.freeShippingThreshold === 0 ? '🟢 All Orders FREE Shipping Active' : '⚡ 1-Tap Make All Orders Free Delivery'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1 text-[11px]">
                    Free Pan-India Delivery Minimum (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={storeSettings.freeShippingThreshold}
                    onChange={(e) => setStoreSettings({ ...storeSettings, freeShippingThreshold: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#0c1620] border border-slate-700 text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Set to 0 to make delivery 100% free across entire store.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 uppercase tracking-wider mb-1 text-[11px]">
                    Standard Delivery Fee (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={storeSettings.standardShippingFee}
                    onChange={(e) => setStoreSettings({ ...storeSettings, standardShippingFee: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-2xl bg-[#0c1620] border border-slate-700 text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Applied on orders below the free shipping threshold.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 4.5: PAYMENT METHOD SPECIAL PRICING (ONLINE DISCOUNT VS COD) */}
            <div className="p-5 rounded-2xl bg-[#070d12] border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-serif font-bold text-sm text-white">
                    Payment Mode Pricing Rules (Online Sasta Pade & COD Pricing)
                  </h4>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800">
                  ⚡ Increases Prepaid Conversion
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Online Payment Discount */}
                <div className="p-4 rounded-2xl bg-[#0c1620] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span className="text-xs font-bold text-emerald-300">Online Payment Instant Discount</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={storeSettings.onlineDiscountEnabled !== false}
                        onChange={(e) => setStoreSettings({ ...storeSettings, onlineDiscountEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  <p className="text-[10px] text-slate-400">
                    Gives customer an instant discount at checkout if they pay online via UPI, GPay, PhonePe, Cards, or NetBanking.
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold mb-1">Discount Type</label>
                      <select
                        value={storeSettings.onlineDiscountType || 'flat'}
                        onChange={(e) => setStoreSettings({ ...storeSettings, onlineDiscountType: e.target.value })}
                        disabled={storeSettings.onlineDiscountEnabled === false}
                        className="w-full px-3 py-2 rounded-xl bg-[#060c12] border border-slate-700 text-white text-xs disabled:opacity-50"
                      >
                        <option value="flat">Flat ₹ Discount</option>
                        <option value="percentage">Percentage (%) Discount</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 font-bold mb-1">
                        {storeSettings.onlineDiscountType === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount (₹)'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={storeSettings.onlineDiscountValue !== undefined ? storeSettings.onlineDiscountValue : 50}
                        onChange={(e) => setStoreSettings({ ...storeSettings, onlineDiscountValue: Number(e.target.value) })}
                        disabled={storeSettings.onlineDiscountEnabled === false}
                        className="w-full px-3 py-2 rounded-xl bg-[#060c12] border border-slate-700 text-white font-mono text-xs font-bold disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Cash on Delivery (COD) Extra Handling Fee */}
                <div className="p-4 rounded-2xl bg-[#0c1620] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span className="text-xs font-bold text-amber-300">Cash on Delivery (COD) Extra Fee</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(storeSettings.codFeeEnabled)}
                        onChange={(e) => setStoreSettings({ ...storeSettings, codFeeEnabled: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </div>

                  <p className="text-[10px] text-slate-400">
                    Optional handling charge added to total when customer chooses Cash on Delivery (courier collection fee).
                  </p>

                  <div className="pt-1">
                    <label className="block text-[10px] text-slate-400 font-bold mb-1">COD Extra Fee Amount (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={storeSettings.codExtraFee !== undefined ? storeSettings.codExtraFee : 50}
                      onChange={(e) => setStoreSettings({ ...storeSettings, codExtraFee: Number(e.target.value) })}
                      disabled={!storeSettings.codFeeEnabled}
                      className="w-full px-3 py-2 rounded-xl bg-[#060c12] border border-slate-700 text-white font-mono text-xs font-bold disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              {/* Interactive Calculation Live Preview Box */}
              <div className="p-3.5 rounded-xl bg-[#060c12] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-bold text-[11px]">💡 Customer Experience Preview (for a ₹1,000 Order):</span>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px]">
                    <span className="text-emerald-400 font-bold">
                      💳 Pay Online Total: ₹{Math.max(0, 1000 - (storeSettings.onlineDiscountEnabled !== false ? (storeSettings.onlineDiscountType === 'percentage' ? Math.round(1000 * (Number(storeSettings.onlineDiscountValue) || 5) / 100) : (Number(storeSettings.onlineDiscountValue) || 50)) : 0))} 
                      {storeSettings.onlineDiscountEnabled !== false && ` (Saves ₹${storeSettings.onlineDiscountType === 'percentage' ? Math.round(1000 * (Number(storeSettings.onlineDiscountValue) || 5) / 100) : (Number(storeSettings.onlineDiscountValue) || 50)}!)`}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-amber-300 font-bold">
                      💵 COD Total: ₹{1000 + (storeSettings.codFeeEnabled ? (Number(storeSettings.codExtraFee) || 0) : 0)}
                    </span>
                  </div>
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

            {/* SECTION 6: SHIPMOZO LOGISTICS AUTOMATION */}
            <div className="p-5 rounded-2xl bg-[#070d12] border border-sky-500/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sky-400 font-bold uppercase tracking-wider text-xs">
                  <Truck className="w-4 h-4 text-sky-400" />
                  <span>Shipmozo Logistics Integration (Official AI Shipping Partner)</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 text-[10px] font-black flex items-center gap-1.5 w-fit">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Connected: FARHAN ATTARI (7233862626)
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Seamlessly integrated with Shipmozo Delivery Platform. Orders placed on the website can be pushed directly to your Shipmozo account in 1 click to book couriers (Delhivery, BlueDart, DTDC, Xpressbees) and print shipping labels.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-[#0b141d] p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Connected Merchant</span>
                  <div className="font-bold text-white text-sm">FARHAN ATTARI</div>
                  <div className="text-slate-300">Registered Phone: <span className="font-mono text-amber-400 font-bold">7233862626</span></div>
                  <div className="text-slate-400 text-[11px]">API Key: <span className="font-mono text-slate-300">0v4yAXfMhw58l6FPs7SK</span></div>
                </div>

                <div className="bg-[#0b141d] p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Active Pickup Warehouse</span>
                  <div className="font-bold text-white text-sm">ARABIANS SHOPPING ZONE</div>
                  <div className="text-slate-300 text-[11px]">88/485 OPPOSITE SHIFA EYE HOSPITAL, DALEL PURWA CHAURAHA</div>
                  <div className="text-emerald-400 font-bold text-[11px]">Kanpur, Uttar Pradesh - 208001 (Warehouse ID: 66952)</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
                <a
                  href="https://panel.shipmozo.com/orders/new"
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:brightness-110 text-white font-bold flex items-center gap-1.5 transition shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Shipmozo Merchant Panel (panel.shipmozo.com)</span>
                </a>
                <span className="text-slate-400 text-[11px]">
                  Recharge wallet & track courier dispatches in Shipmozo
                </span>
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
  {/* MODAL 1: ADD / EDIT PRODUCT (MODERN STUDIO WORKSPACE)                     */}
  {/* ========================================================================= */}
  {isProductModalOpen && editingProduct && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0b1520] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-3xl w-full my-auto border border-amber-500/40 shadow-2xl text-slate-100 max-h-[94vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20 shrink-0">
              {editingProduct.isNew ? <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> : <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />}
            </div>
            <div>
              <h3 className="font-serif font-black text-sm sm:text-xl text-white leading-tight">
                {editingProduct.isNew ? 'Add New Product to Storefront' : 'Edit Product Catalog'}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400 line-clamp-1 sm:line-clamp-none">
                Product will be published live on website homepage, category catalog, and search index.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsProductModalOpen(false)}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Form */}
        <form onSubmit={handleSaveProduct} className="space-y-6 overflow-y-auto pr-1 sm:pr-2 pt-4 flex-1 text-xs">
          
          {/* SECTION 1: BASIC INFORMATION */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
              <Package className="w-4 h-4 text-amber-500" />
              <span>1. Basic Product Information</span>
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1.5 text-xs">
                Product Title / Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Royal Saudi Thobe with Standing Collar, Pure Dehnul Oud..."
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#060c12] border border-slate-700 hover:border-slate-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-200 mb-1.5 text-xs">Category *</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => {
                    const newCat = e.target.value;
                    setEditingProduct({ 
                      ...editingProduct, 
                      category: newCat,
                      subcategory: '',
                      subCategory: ''
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#060c12] border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-200 mb-1.5 text-xs">Subcategory (Optional)</label>
                <select
                  value={editingProduct.subcategory || editingProduct.subCategory || ''}
                  onChange={(e) => setEditingProduct({ 
                    ...editingProduct, 
                    subcategory: e.target.value,
                    subCategory: e.target.value 
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#060c12] border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">-- General Collection --</option>
                  {(categories.find(c => c.id === editingProduct.category)?.subcategories || []).map((sub) => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Special Badge with 1-Click Quick Pills */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-200 text-xs">
                Product Badge (Storefront Tag)
              </label>
              <div className="flex flex-wrap items-center gap-1.5">
                {['New Arrival', 'Flagship Bestseller', '100% Pure Sunnah', 'Royal Luxury', 'Limited Edition', 'Custom Handcrafted'].map((badgePreset) => (
                  <button
                    key={badgePreset}
                    type="button"
                    onClick={() => setEditingProduct({ ...editingProduct, badge: badgePreset })}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition border ${
                      editingProduct.badge === badgePreset 
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm' 
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-amber-500/50'
                    }`}
                  >
                    {badgePreset}
                  </button>
                ))}
                {editingProduct.badge && (
                  <button
                    type="button"
                    onClick={() => setEditingProduct({ ...editingProduct, badge: '' })}
                    className="px-2 py-1 rounded-lg text-[10px] text-rose-400 hover:bg-rose-950/40 transition"
                  >
                    Clear
                  </button>
                )}
              </div>
              <input
                type="text"
                placeholder="Or type custom badge (e.g. Free Gift Inside, 100% Organic)..."
                value={editingProduct.badge || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-[#060c12] border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* SECTION 2: PRICING & INVENTORY */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                <IndianRupee className="w-4 h-4 text-amber-500" />
                <span>2. Pricing, Discount & Stock</span>
              </div>
              {editingProduct.mrp && editingProduct.price && Number(editingProduct.mrp) > Number(editingProduct.price) && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700 font-black text-[10px]">
                  🎉 Saves ₹{Number(editingProduct.mrp) - Number(editingProduct.price)} ({Math.round(((Number(editingProduct.mrp) - Number(editingProduct.price)) / Number(editingProduct.mrp)) * 100)}% OFF)
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-bold text-slate-200 mb-1 text-xs">Selling Price (₹) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-[#060c12] border border-slate-700 text-white font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-200 mb-1 text-xs">MRP Cut-Price (₹)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    placeholder="e.g. 1499"
                    value={editingProduct.mrp || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, mrp: Number(e.target.value) })}
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-[#060c12] border border-slate-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-200 mb-1 text-xs">In-Stock Units</label>
                <input
                  type="number"
                  value={editingProduct.stock !== undefined ? editingProduct.stock : 50}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#060c12] border border-slate-700 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-200 mb-1 text-xs">Net Weight / Size</label>
                <input
                  type="text"
                  placeholder="e.g. 400g, 50ml, Free Size"
                  value={editingProduct.netWeight || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, netWeight: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#060c12] border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2.5: INVENTORY AVAILABILITY & SIZE VARIATIONS STUDIO (FLIPKART STYLE) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                <Layers className="w-4 h-4 text-amber-500" />
                <span>2.5. Stock Availability & Flipkart-Style Size Inventory</span>
              </div>
              <span className="text-[10px] text-slate-400">
                Flipkart-Style Size Strikethrough & Availability Studio
              </span>
            </div>

            {/* Master Product Stock Switch */}
            <div className="p-3.5 rounded-xl bg-[#060c12] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">Product Master Stock Status:</span>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                    editingProduct.inStock !== false 
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700' 
                      : 'bg-rose-950 text-rose-300 border-rose-700'
                  }`}>
                    {editingProduct.inStock !== false ? '🟢 In Stock (Live on Store)' : '🔴 Out of Stock (Sold Out)'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {editingProduct.inStock !== false 
                    ? 'Customers can add to cart and purchase instantly.' 
                    : 'Storefront shows "Out of Stock" overlay; purchase buttons disabled with WhatsApp inquiry lead.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditingProduct({ ...editingProduct, inStock: editingProduct.inStock === false ? true : false })}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 ${
                  editingProduct.inStock !== false
                    ? 'bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-700/80'
                    : 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/80'
                }`}
              >
                <span>{editingProduct.inStock !== false ? '🔴 Mark Out of Stock' : '🟢 Mark In Stock'}</span>
              </button>
            </div>

            {/* Sizes & Flipkart-Style Out of Stock Variations Manager */}
            <div className="space-y-3 pt-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <label className="block font-bold text-slate-200 text-xs">
                    {(() => {
                      const catId = (editingProduct.category || '').toLowerCase();
                      const catName = (categories.find(c => c.id === editingProduct.category)?.name || '').toLowerCase();
                      const combined = catId + ' ' + catName;
                      if (/thobe|wear|shirt|jubba|kurta|garment|cloth|dress|kurti/.test(combined)) return 'Product Sizes (e.g. 52, 54, 56, S, M, L, XL)';
                      if (/attar|oud|dehn|perfume|fragrance|bakhoor|incense/.test(combined)) return 'Product Variants (e.g. 3ml, 6ml, 12ml, 1 Tola)';
                      if (/skin|care|cream|lotion|serum|face|beauty|hair|scrub|mask|moistur|cosmetic/.test(combined)) return 'Product Variants (e.g. 50ml, 100ml, 200ml, 30g)';
                      if (/food|talbina|honey|date|ajwa|dry.fruit|nuts|spice|herb|supplement|health/.test(combined)) return 'Pack / Weight Options (e.g. 250g, 500g, 1kg)';
                      return 'Product Sizes / Variants (e.g. S, M, L, 100ml, 250g)';
                    })()}
                  </label>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Click on any chip to toggle it <strong>In Stock</strong> or <strong>Out of Stock</strong> (customers will see a strikethrough just like Flipkart).
                  </p>
                </div>
                
                {Array.isArray(editingProduct.sizes) && editingProduct.sizes.length > 0 && (
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setEditingProduct({ ...editingProduct, outOfStockSizes: [] })}
                      className="px-2 py-1 rounded-lg bg-emerald-950/70 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900 transition font-bold"
                    >
                      Mark All In Stock
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProduct({ ...editingProduct, outOfStockSizes: [...editingProduct.sizes] })}
                      className="px-2 py-1 rounded-lg bg-rose-950/70 text-rose-300 border border-rose-800/80 hover:bg-rose-900 transition font-bold"
                    >
                      Mark All Out of Stock
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProduct({ ...editingProduct, sizes: [], outOfStockSizes: [] })}
                      className="px-2 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>

              {/* Smart Category-Aware Quick Presets */}
              {(() => {
                const catId = (editingProduct.category || '').toLowerCase();
                const catName = (categories.find(c => c.id === editingProduct.category)?.name || '').toLowerCase();
                const combined = catId + ' ' + catName;

                // Detect category type
                const isClothing  = /thobe|thobes|wear|shirt|jubba|kurta|garment|cloth|dress|kurti/.test(combined);
                const isAttar     = /attar|oud|dehn|perfume|fragrance|bakhoor|incense/.test(combined);
                const isSkinCare  = /skin|care|cream|lotion|serum|face|beauty|hair|scrub|mask|moistur|cosmetic/.test(combined);
                const isFood      = /food|talbina|honey|date|ajwa|dry.fruit|nuts|spice|herb|supplement|health/.test(combined);
                const isOil       = /oil|essential/.test(combined) && !isAttar;

                // Build smart preset groups
                const presets = [];

                if (isClothing) {
                  presets.push(
                    { label: '+ Saudi Thobes (52–60)', sizes: ['52 (S)', '54 (M)', '56 (L)', '58 (XL)', '60 (XXL)'], color: 'amber' },
                    { label: '+ Standard (S, M, L, XL, XXL)', sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'], color: 'slate' },
                    { label: '+ Kids (2Y, 4Y, 6Y, 8Y)', sizes: ['2Y', '4Y', '6Y', '8Y', '10Y', '12Y'], color: 'slate' },
                  );
                } else if (isAttar) {
                  presets.push(
                    { label: '+ Tola (1/4, 1/2, 1 Tola)', sizes: ['3ml (1/4 Tola)', '6ml (1/2 Tola)', '12ml (1 Tola)'], color: 'amber' },
                    { label: '+ ML Sizes (6ml, 12ml, 25ml)', sizes: ['6ml', '12ml', '25ml', '50ml', '100ml'], color: 'slate' },
                  );
                } else if (isSkinCare) {
                  presets.push(
                    { label: '+ Volume (50ml, 100ml, 200ml)', sizes: ['30ml', '50ml', '100ml', '150ml', '200ml'], color: 'amber' },
                    { label: '+ Weight (30g, 50g, 100g)', sizes: ['30g', '50g', '100g', '150g', '200g'], color: 'slate' },
                    { label: '+ Pack Size (1 Pc, 2 Pc, 3 Pc)', sizes: ['1 Pc', '2 Pc', '3 Pc', '5 Pc'], color: 'slate' },
                  );
                } else if (isFood) {
                  presets.push(
                    { label: '+ Weight (250g, 500g, 1kg)', sizes: ['250g', '500g', '1kg', '2kg'], color: 'amber' },
                    { label: '+ Pack (1 Pkt, 2 Pkt, 3 Pkt)', sizes: ['1 Packet', '2 Packets', '3 Packets'], color: 'slate' },
                    { label: '+ Pieces (3 Pcs, 6 Pcs, 12 Pcs)', sizes: ['3 Pcs', '6 Pcs', '12 Pcs', '24 Pcs'], color: 'slate' },
                  );
                } else if (isOil) {
                  presets.push(
                    { label: '+ Volume (50ml, 100ml, 250ml)', sizes: ['50ml', '100ml', '200ml', '250ml', '500ml'], color: 'amber' },
                  );
                } else {
                  // Generic fallback — show all presets
                  presets.push(
                    { label: '+ Saudi Thobes (52–60)', sizes: ['52 (S)', '54 (M)', '56 (L)', '58 (XL)', '60 (XXL)'], color: 'amber' },
                    { label: '+ Clothing (S, M, L, XL)', sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'], color: 'slate' },
                    { label: '+ Attar / Oils (3ml, 6ml, 12ml)', sizes: ['3ml (1/4 Tola)', '6ml (1/2 Tola)', '12ml (1 Tola)'], color: 'slate' },
                    { label: '+ Volume (50ml, 100ml, 200ml)', sizes: ['50ml', '100ml', '200ml'], color: 'slate' },
                    { label: '+ Weight (250g, 500g, 1kg)', sizes: ['250g', '500g', '1kg'], color: 'slate' },
                  );
                }

                return (
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-amber-400/90 font-bold uppercase tracking-wider block">
                      ⚡ 1-Click Size Presets:
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {presets.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            const current = Array.isArray(editingProduct.sizes) ? editingProduct.sizes : [];
                            const merged = Array.from(new Set([...current, ...preset.sizes]));
                            setEditingProduct({ ...editingProduct, sizes: merged });
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition border ${
                            preset.color === 'amber'
                              ? 'bg-[#060c12] border-amber-500/40 text-amber-300 hover:bg-amber-500/10'
                              : 'bg-[#060c12] border-slate-700 text-slate-300 hover:border-amber-500/50'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Add Custom Size Input */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type custom size (e.g. 54, 56, Free Size, 100ml)..."
                  value={newSizeInput}
                  onChange={(e) => setNewSizeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = newSizeInput.trim();
                      if (val) {
                        const current = Array.isArray(editingProduct.sizes) ? editingProduct.sizes : [];
                        if (!current.includes(val)) {
                          setEditingProduct({ ...editingProduct, sizes: [...current, val] });
                        }
                        setNewSizeInput('');
                      }
                    }
                  }}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-[#060c12] border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const val = newSizeInput.trim();
                    if (val) {
                      const current = Array.isArray(editingProduct.sizes) ? editingProduct.sizes : [];
                      if (!current.includes(val)) {
                        setEditingProduct({ ...editingProduct, sizes: [...current, val] });
                      }
                      setNewSizeInput('');
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Size</span>
                </button>
              </div>

              {/* Active Size Chips & Interactive Availability Toggles */}
              {Array.isArray(editingProduct.sizes) && editingProduct.sizes.length > 0 ? (
                <div className="p-3 rounded-xl bg-[#060c12] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300">Configured Sizes ({editingProduct.sizes.length}):</span>
                    <span>
                      Click toggle button to switch In Stock / Out of Stock
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {editingProduct.sizes.map((size) => {
                      const isOOS = Array.isArray(editingProduct.outOfStockSizes) && editingProduct.outOfStockSizes.includes(size);
                      return (
                        <div
                          key={size}
                          className={`flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-xl border transition ${
                            isOOS 
                              ? 'bg-rose-950/20 border-rose-800/60 text-slate-300' 
                              : 'bg-slate-900 border-slate-700 text-white shadow-sm'
                          }`}
                        >
                          <span className={`text-xs font-bold ${isOOS ? 'line-through decoration-rose-500 decoration-2 text-slate-400' : 'text-slate-100'}`}>
                            {size}
                          </span>

                          <button
                            type="button"
                            onClick={() => {
                              const currentOOS = Array.isArray(editingProduct.outOfStockSizes) ? editingProduct.outOfStockSizes : [];
                              const updatedOOS = isOOS 
                                ? currentOOS.filter(s => s !== size)
                                : [...currentOOS, size];
                              setEditingProduct({ ...editingProduct, outOfStockSizes: updatedOOS });
                            }}
                            className={`px-2 py-0.5 rounded-lg text-[9px] font-black transition border ${
                              isOOS
                                ? 'bg-rose-950 text-rose-300 border-rose-700 hover:bg-emerald-950 hover:text-emerald-300 hover:border-emerald-700'
                                : 'bg-emerald-950 text-emerald-300 border-emerald-700 hover:bg-rose-950 hover:text-rose-300 hover:border-rose-700'
                            }`}
                            title={isOOS ? 'Click to mark In Stock' : 'Click to mark Out of Stock'}
                          >
                            {isOOS ? '🔴 Out of Stock' : '🟢 In Stock'}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const newSizes = editingProduct.sizes.filter(s => s !== size);
                              const newOOS = (editingProduct.outOfStockSizes || []).filter(s => s !== size);
                              setEditingProduct({ ...editingProduct, sizes: newSizes, outOfStockSizes: newOOS });
                            }}
                            className="p-1 text-slate-500 hover:text-rose-400 rounded-lg transition"
                            title="Remove size variation"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#060c12]/60 border border-dashed border-slate-800 text-center text-slate-500 text-[11px]">
                  No size options added yet. Click one of the 1-Click presets above or type custom sizes if this product has size variations.
                </div>
              )}
            </div>
          </div>

          {/* SECTION 2.8: PRODUCT DELIVERY & SHIPPING CHARGE */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                <Truck className="w-4 h-4 text-amber-500" />
                <span>2.8. Delivery & Shipping Charge for This Product</span>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                editingProduct.freeDelivery || editingProduct.deliveryChargeType === 'free'
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  : editingProduct.deliveryChargeType === 'custom'
                  ? 'bg-amber-950 text-amber-300 border-amber-700'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                {editingProduct.freeDelivery || editingProduct.deliveryChargeType === 'free'
                  ? '🚚 100% FREE Delivery'
                  : editingProduct.deliveryChargeType === 'custom'
                  ? `🚚 Custom ₹${editingProduct.customDeliveryCharge || 0}`
                  : `📦 Store Default (₹${storeSettings.standardShippingFee} / Free > ₹${storeSettings.freeShippingThreshold})`}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Option 1: Store Default */}
              <button
                type="button"
                onClick={() => setEditingProduct({
                  ...editingProduct,
                  deliveryChargeType: 'default',
                  freeDelivery: false
                })}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  !editingProduct.freeDelivery && editingProduct.deliveryChargeType !== 'custom' && editingProduct.deliveryChargeType !== 'free'
                    ? 'bg-amber-500/15 border-amber-500 text-white shadow-sm'
                    : 'bg-[#060c12] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs">Standard Store Policy</span>
                  <input
                    type="radio"
                    checked={!editingProduct.freeDelivery && editingProduct.deliveryChargeType !== 'custom' && editingProduct.deliveryChargeType !== 'free'}
                    readOnly
                    className="accent-amber-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  Standard ₹{storeSettings.standardShippingFee}, Free on orders above ₹{storeSettings.freeShippingThreshold}
                </p>
              </button>

              {/* Option 2: 100% Free Delivery */}
              <button
                type="button"
                onClick={() => setEditingProduct({
                  ...editingProduct,
                  deliveryChargeType: 'free',
                  freeDelivery: true,
                  customDeliveryCharge: ''
                })}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  editingProduct.freeDelivery || editingProduct.deliveryChargeType === 'free'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-sm'
                    : 'bg-[#060c12] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-emerald-400">100% FREE Delivery</span>
                  <input
                    type="radio"
                    checked={editingProduct.freeDelivery || editingProduct.deliveryChargeType === 'free'}
                    readOnly
                    className="accent-emerald-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  Customer pays ₹0 delivery regardless of order amount. Displays "Free Delivery" badge!
                </p>
              </button>

              {/* Option 3: Custom Delivery Fee */}
              <button
                type="button"
                onClick={() => {
                  setEditingProduct({
                    ...editingProduct,
                    deliveryChargeType: 'custom',
                    freeDelivery: false,
                    customDeliveryCharge: editingProduct.customDeliveryCharge !== undefined && editingProduct.customDeliveryCharge !== '' && editingProduct.customDeliveryCharge !== null ? editingProduct.customDeliveryCharge : ''
                  });
                  setTimeout(() => {
                    const inp = document.getElementById('customDeliveryChargeInput');
                    if (inp) { inp.focus(); inp.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
                  }, 100);
                }}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  editingProduct.deliveryChargeType === 'custom' && !editingProduct.freeDelivery
                    ? 'bg-amber-950/60 border-amber-500 text-amber-200 shadow-sm'
                    : 'bg-[#060c12] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-amber-400">Custom Delivery Charge</span>
                  <input
                    type="radio"
                    checked={editingProduct.deliveryChargeType === 'custom' && !editingProduct.freeDelivery}
                    readOnly
                    className="accent-amber-500"
                  />
                </div>
                <p className="text-[10px] text-slate-400">
                  Set a specific fixed delivery charge for heavy/fragile parcels (e.g. ₹50, ₹100).
                </p>
              </button>
            </div>

            {/* Custom Delivery Charge Input when custom selected */}
            {editingProduct.deliveryChargeType === 'custom' && !editingProduct.freeDelivery && (
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/60 space-y-2 animate-pulse-once">
                <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <span>✏️</span>
                  <span>Custom Delivery Charge Amount (₹) <span className="text-red-400">*</span></span>
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-[220px]">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 font-bold text-sm">₹</span>
                    <input
                      id="customDeliveryChargeInput"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="Yahan amount likhein (e.g. 50, 100)"
                      value={editingProduct.customDeliveryCharge}
                      onChange={(e) => setEditingProduct({ ...editingProduct, customDeliveryCharge: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 rounded-lg bg-slate-900 border-2 border-amber-500 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-slate-500"
                    />
                  </div>
                  <span className="text-[11px] text-amber-200/70">Yeh exact amount delivery fee hogi is product par.</span>
                </div>
                {(editingProduct.customDeliveryCharge === '' || editingProduct.customDeliveryCharge === undefined || editingProduct.customDeliveryCharge === null) && (
                  <p className="text-[11px] text-red-400 font-semibold">⚠️ Amount zaroor fill karein save karne se pehle.</p>
                )}
              </div>
            )}
          </div>

          {/* SECTION 2.9: PRODUCT-SPECIFIC PROMO COUPON */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                <Tag className="w-4 h-4 text-amber-500" />
                <span>2.9. Product-Specific Coupon Code (Optional)</span>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                editingProduct.hasCoupon && editingProduct.couponCode && Number(editingProduct.couponDiscount) > 0
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {editingProduct.hasCoupon && editingProduct.couponCode && Number(editingProduct.couponDiscount) > 0
                  ? `🎟️ Active Coupon: ${editingProduct.couponCode} (${editingProduct.couponType === 'percentage' ? `${editingProduct.couponDiscount}%` : `₹${editingProduct.couponDiscount}`} OFF)`
                  : '⚪ No Coupon Assigned'}
              </span>
            </div>

            <p className="text-[11px] text-slate-400">
              Customers purchasing this product can apply this coupon code at checkout for an instant discount. It will also be highlighted on the product page!
            </p>

            {/* Master Coupon Enable Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#060c12] border border-slate-800">
              <div>
                <span className="text-xs font-bold text-white block">Enable Coupon for this Product</span>
                <span className="text-[10px] text-slate-400">Allow customers to get an extra discount on this item</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const nextState = !editingProduct.hasCoupon;
                  setEditingProduct({
                    ...editingProduct,
                    hasCoupon: nextState,
                    couponType: editingProduct.couponType || 'flat',
                    couponDiscount: nextState ? (editingProduct.couponDiscount || 50) : '',
                    couponCode: nextState ? (editingProduct.couponCode || 'SAVE50') : ''
                  });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                  editingProduct.hasCoupon
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                {editingProduct.hasCoupon ? '✓ Coupon Enabled' : '+ Enable Coupon'}
              </button>
            </div>

            {editingProduct.hasCoupon && (
              <div className="space-y-4 pt-1">
                {/* 1-Click Quick Presets */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-slate-300">
                    ⚡ 1-Click Quick Coupon Presets:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { label: 'Flat ₹50 OFF', code: 'FLAT50', type: 'flat', discount: 50 },
                      { label: 'Flat ₹100 OFF', code: 'SAVE100', type: 'flat', discount: 100 },
                      { label: 'Flat ₹150 OFF', code: 'SAVE150', type: 'flat', discount: 150 },
                      { label: 'Flat ₹200 OFF', code: 'ROYAL200', type: 'flat', discount: 200 },
                      { label: '10% OFF', code: 'PROMO10', type: 'percentage', discount: 10 },
                      { label: '15% OFF', code: 'SPECIAL15', type: 'percentage', discount: 15 },
                      { label: '20% OFF', code: 'MEGA20', type: 'percentage', discount: 20 },
                    ].map((preset) => (
                      <button
                        key={preset.code}
                        type="button"
                        onClick={() => {
                          setEditingProduct({
                            ...editingProduct,
                            hasCoupon: true,
                            couponCode: preset.code,
                            couponType: preset.type,
                            couponDiscount: preset.discount,
                            couponDescription: preset.type === 'percentage' 
                              ? `${preset.discount}% OFF on ${editingProduct.name || 'this product'}`
                              : `Flat ₹${preset.discount} OFF on ${editingProduct.name || 'this product'}`
                          });
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition border ${
                          editingProduct.couponCode === preset.code
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-amber-500/50'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct({
                          ...editingProduct,
                          hasCoupon: false,
                          couponCode: '',
                          couponDiscount: '',
                          couponDescription: ''
                        });
                      }}
                      className="px-2 py-1 rounded-lg text-[10px] text-rose-400 hover:bg-rose-950/40 transition border border-transparent"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Coupon Code Input */}
                  <div>
                    <label className="block font-bold text-slate-200 mb-1 text-xs">
                      Coupon Code *
                    </label>
                    <input
                      type="text"
                      required={editingProduct.hasCoupon}
                      placeholder="e.g. SAVE50, EID10"
                      value={editingProduct.couponCode || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, couponCode: e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, '') })}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#060c12] border border-slate-700 text-amber-400 font-mono text-sm font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Discount Type */}
                  <div>
                    <label className="block font-bold text-slate-200 mb-1 text-xs">
                      Discount Type
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#060c12] rounded-xl border border-slate-700">
                      <button
                        type="button"
                        onClick={() => setEditingProduct({ ...editingProduct, couponType: 'flat' })}
                        className={`py-1.5 rounded-lg text-xs font-bold transition ${
                          editingProduct.couponType !== 'percentage'
                            ? 'bg-amber-500 text-slate-950 shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Flat (₹)
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingProduct({ ...editingProduct, couponType: 'percentage' })}
                        className={`py-1.5 rounded-lg text-xs font-bold transition ${
                          editingProduct.couponType === 'percentage'
                            ? 'bg-amber-500 text-slate-950 shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Percent (%)
                      </button>
                    </div>
                  </div>

                  {/* Discount Value */}
                  <div>
                    <label className="block font-bold text-slate-200 mb-1 text-xs">
                      {editingProduct.couponType === 'percentage' ? 'Discount Percentage (%) *' : 'Discount Amount (₹) *'}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                        {editingProduct.couponType === 'percentage' ? '%' : '₹'}
                      </span>
                      <input
                        type="number"
                        required={editingProduct.hasCoupon}
                        min="1"
                        max={editingProduct.couponType === 'percentage' ? 90 : (Number(editingProduct.price) || 10000)}
                        placeholder={editingProduct.couponType === 'percentage' ? '10' : '50'}
                        value={editingProduct.couponDiscount || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, couponDiscount: e.target.value })}
                        className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-[#060c12] border border-slate-700 text-white font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Optional Description / Offer Note */}
                <div>
                  <label className="block font-bold text-slate-300 mb-1 text-[11px]">
                    Customer Offer Note (Displayed on product page)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Apply code at checkout for special discount"
                    value={editingProduct.couponDescription || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, couponDescription: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#060c12] border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SECTION 3: PRODUCT PHOTOS (INTUITIVE & FOOLPROOF) */}
          {(() => {
            const activePhotos = getProductPhotos(editingProduct);
            const remainingSlots = 3 - activePhotos.length;
            const currentPreviewUrl = activePhotos[previewImageIdx] || activePhotos[0] || '/assets/logo/logo_main.png';

            return (
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                
                {/* Hidden Multi-file input triggered by ANY button/card click */}
                <input
                  ref={productFileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImage}
                />

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
                      3. Product Photos ({activePhotos.length}/3)
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                      activePhotos.length > 0 
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700' 
                        : 'bg-rose-950 text-rose-300 border-rose-700'
                    }`}>
                      {activePhotos.length === 3 ? '✅ 3/3 Full' : `${remainingSlots} slot${remainingSlots > 1 ? 's' : ''} left`}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Min 1 required • Max 3 photos
                  </span>
                </div>

                {/* Big Drag & Drop / Click to Upload Zone */}
                {activePhotos.length < 3 && (
                  <div
                    onClick={() => productFileInputRef.current?.click()}
                    onDrop={handleImageDrop}
                    onDragOver={handleImageDragOver}
                    onDragLeave={handleImageDragLeave}
                    className={`p-4 sm:p-6 rounded-2xl border-2 border-dashed cursor-pointer text-center transition flex flex-col items-center justify-center gap-2 group ${
                      isDraggingImage
                        ? 'border-amber-400 bg-amber-500/20 scale-[1.01]'
                        : 'border-amber-500/40 hover:border-amber-400 bg-[#060c12] hover:bg-amber-500/5'
                    }`}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-500/15 group-hover:bg-amber-500/25 text-amber-400 flex items-center justify-center transition shadow-sm">
                      {uploadingImage ? <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-amber-400" /> : <Upload className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />}
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-white block group-hover:text-amber-300 transition">
                        {uploadingImage ? 'Uploading Image(s)... Please wait' : 'Click to Browse Files or Drag & Drop Photos Here'}
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-slate-400 block mt-0.5">
                        Select up to {remainingSlots} photo(s) (JPG, PNG, WebP). First photo is automatically the storefront cover.
                      </span>
                    </div>
                  </div>
                )}

                {/* 3 Visual Photo Slots */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[0, 1, 2].map((slotIdx) => {
                    const photoUrl = activePhotos[slotIdx];
                    const isCover = slotIdx === 0;
                    const isSelectedPreview = previewImageIdx === slotIdx;

                    return (
                      <div
                        key={slotIdx}
                        className={`relative rounded-xl sm:rounded-2xl border p-1.5 sm:p-2 flex flex-col justify-between transition ${
                          photoUrl 
                            ? (isSelectedPreview ? 'border-amber-400 bg-amber-500/10 shadow-md' : 'border-slate-700 bg-[#060c12]')
                            : 'border-dashed border-slate-700 bg-[#060c12]/50 hover:border-amber-500/60 cursor-pointer'
                        }`}
                        onClick={() => {
                          if (photoUrl) {
                            setPreviewImageIdx(slotIdx);
                          } else {
                            productFileInputRef.current?.click();
                          }
                        }}
                      >
                        {/* Slot Header */}
                        <div className="w-full flex items-center justify-between mb-1 sm:mb-1.5 px-0.5">
                          <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ${
                            isCover ? 'text-amber-400' : 'text-slate-400'
                          }`}>
                            {isCover ? '⭐ Cover' : `Photo ${slotIdx + 1}`}
                          </span>
                          {photoUrl && (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); handleRemovePhoto(slotIdx); }}
                              className="p-1 rounded-lg text-rose-400 hover:text-white hover:bg-rose-900 transition"
                              title="Delete photo"
                            >
                              <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Viewport */}
                        <div className="w-full aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-black/60 relative flex items-center justify-center border border-slate-800">
                          {photoUrl ? (
                            <>
                              <img 
                                src={photoUrl} 
                                alt={`Slot ${slotIdx + 1}`} 
                                className="w-full h-full object-cover"
                              />
                              {!isCover && (
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleSetPrimaryPhoto(slotIdx); }}
                                  className="absolute inset-x-1 bottom-1 py-1 rounded bg-black/90 hover:bg-amber-500 hover:text-black text-amber-300 text-[8px] sm:text-[9px] font-black transition shadow truncate text-center"
                                >
                                  ⭐ Set Cover
                                </button>
                              )}
                            </>
                          ) : (
                            <div className="flex flex-col items-center justify-center p-1.5 sm:p-2 text-center text-slate-500 hover:text-amber-400 transition">
                              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />
                              <span className="text-[9px] sm:text-[10px] font-bold leading-tight">
                                {isCover ? '+ Cover' : `+ Photo ${slotIdx + 1}`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Paste Image URL Fallback */}
                <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                  <input
                    type="text"
                    placeholder="Or paste external image URL (https://...)"
                    value={productUrlInput}
                    onChange={(e) => setProductUrlInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddImageUrl(); } }}
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#060c12] border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs transition border border-slate-700 shrink-0"
                  >
                    + Add URL
                  </button>
                </div>

                {/* Live Customer Storefront Card Preview */}
                <div className="pt-3 border-t border-slate-800">
                  <span className="block text-[10px] font-black uppercase tracking-wider text-amber-400 mb-2">
                    Live Storefront Card Preview (How Customers Will See It)
                  </span>
                  <div className="bg-[#faf8f5] p-3 rounded-2xl border border-amber-900/15 max-w-xs text-slate-800 flex items-center gap-3 shadow-md">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 border border-amber-900/10 shrink-0 relative">
                      <img 
                        src={activePhotos[0] || '/assets/logo/logo_main.png'} 
                        alt="Storefront Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <span className="inline-block px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[9px] font-bold truncate max-w-full">
                        {editingProduct.badge || 'New Arrival'}
                      </span>
                      <h4 className="font-serif font-bold text-xs text-slate-900 truncate">
                        {editingProduct.name || 'Untitled Product'}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="font-extrabold text-[#064e3b]">₹{editingProduct.price || 0}</span>
                        {editingProduct.mrp && Number(editingProduct.mrp) > Number(editingProduct.price) && (
                          <span className="line-through text-[10px] text-slate-400">₹{editingProduct.mrp}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            );
          })()}

          {/* SECTION 4: DESCRIPTION & SMART SEARCH */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>4. Description & Customer Search Keywords</span>
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1.5 text-xs">Product Description</label>
              <textarea
                rows={3}
                placeholder="Describe key ingredients, materials, scents, or Islamic Sunnah references..."
                value={editingProduct.description || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#060c12] border border-slate-700 text-white text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Smart Search Tag Helpers */}
            <div>
              <label className="block font-bold text-slate-200 mb-1 text-xs">
                Search Keywords / Tags (Auto-indexed for Website Search Bar)
              </label>
              <p className="text-[10px] text-slate-400 mb-1.5">
                Separate with commas (e.g. oud, attar, thobe, gift, wedding). Customers searching these will find this product.
              </p>
              <input
                type="text"
                placeholder="e.g. oud, pure attar, incense, gift..."
                value={Array.isArray(editingProduct.tags) ? editingProduct.tags.join(', ') : (editingProduct.tags || '')}
                onChange={(e) => {
                  const val = e.target.value;
                  const tagsArr = val.split(',').map(t => t.trim()).filter(Boolean);
                  setEditingProduct({ ...editingProduct, tags: tagsArr });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#060c12] border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-2 sm:gap-3 pt-2 pb-1 shrink-0">
            <button
              type="submit"
              disabled={savingProduct}
              className="flex-1 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-black text-xs sm:text-sm tracking-wide hover:brightness-110 transition shadow-xl shadow-amber-500/25 flex items-center justify-center gap-1.5 sm:gap-2 active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 shrink-0" />
              <span>
                {savingProduct 
                  ? 'Publishing...' 
                  : (editingProduct.isNew ? '🚀 Publish to Website' : 'Save Product Updates')}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setIsProductModalOpen(false)}
              className="px-4 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition shrink-0"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  )}

  {/* ========================================================================= */}
  {/* MODAL: ADD / EDIT CATEGORY ARCHITECTURE                                   */}
  {/* ========================================================================= */}
  {isCategoryModalOpen && editingCategory && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0b1520] rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 max-w-2xl w-full my-auto border border-amber-500/40 shadow-2xl text-slate-100 max-h-[94vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20 shrink-0">
              {editingCategory.isNew ? <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> : <Edit3 className="w-4 h-4 sm:w-5 sm:h-5" />}
            </div>
            <div>
              <h3 className="font-serif font-black text-sm sm:text-xl text-white leading-tight">
                {editingCategory.isNew ? 'Create New Category & Circle' : `Edit Category: ${editingCategory.name || 'Category'}`}
              </h3>
              <p className="text-[10px] sm:text-[11px] text-slate-400 line-clamp-1 sm:line-clamp-none">
                Updates circular story icon, shop filter tabs, and real-time catalog navigation.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCategoryModalOpen(false)}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Form */}
        <form onSubmit={handleSaveCategory} className="space-y-4 sm:space-y-5 overflow-y-auto pr-1 sm:pr-2 pt-4 flex-1 text-xs">
          
          {/* LIVE STORY RING PREVIEW BANNER */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-emerald-950/20 border border-amber-500/30 flex items-center gap-4">
            <div className="flex flex-col items-center shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-[2.5px] bg-gradient-to-tr from-amber-600 via-amber-300 to-amber-500 shadow-lg shadow-amber-500/20">
                <div className="w-full h-full rounded-full bg-[#faf8f5] p-[2px] overflow-hidden">
                  <img
                    src={catImageFile ? URL.createObjectURL(catImageFile) : (editingCategory.image || '/assets/logo/logo_main.png')}
                    alt="Story Ring Preview"
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/assets/logo/logo_main.png';
                    }}
                  />
                </div>
              </div>
              <span className="text-[11px] font-black text-amber-300 mt-1.5 max-w-[90px] truncate text-center font-serif">
                {editingCategory.shortName || editingCategory.name || 'Story Label'}
              </span>
            </div>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Live Homepage Story Ring Preview</span>
              </div>
              <p className="text-xs text-slate-200 font-medium leading-relaxed">
                This exact golden circular story ring will appear at the top of the Homepage!
              </p>
              <p className="text-[10px] text-slate-400">
                Photo uploads, presets, and text changes reflect in this preview immediately.
              </p>
            </div>
          </div>

          {/* SECTION 1: BASIC CATEGORY INFORMATION */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>1. Basic Category Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-slate-200 mb-1.5 text-xs">
                  Category Full Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Healthy & Sunnah Foods, Men's Wear..."
                  value={editingCategory.name || ''}
                  onChange={(e) => setEditingCategory({ 
                    ...editingCategory, 
                    name: e.target.value,
                    shortName: editingCategory.shortName || e.target.value
                  })}
                  className="w-full px-4 py-3 rounded-xl bg-[#060c12] border border-slate-700 hover:border-slate-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-amber-300 mb-1.5 text-xs flex items-center justify-between">
                  <span>Homepage Story Label *</span>
                  <span className="text-[10px] text-slate-400 font-normal">Shown under circle</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Healthy, Men's Wear, Wedding"
                  value={editingCategory.shortName || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, shortName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#060c12] border border-amber-500/40 text-amber-300 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-slate-200 mb-1.5 text-xs">
                  Slug URL ID {editingCategory.isNew ? '(Auto-generated)' : '(Read-Only)'}
                </label>
                <input
                  type="text"
                  disabled={!editingCategory.isNew}
                  placeholder="e.g. health, wearing, wedding"
                  value={editingCategory.id || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, id: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#060c12] border border-slate-700 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-200 mb-1.5 text-xs">Badge Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Royal Sacred, 100% Sunnah, Flagship"
                  value={editingCategory.badge || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, badge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#060c12] border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-slate-200 mb-1.5 text-xs">Subtitle / Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Premium Madinah & Turkish foam prayer rugs"
                  value={editingCategory.subtitle || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#060c12] border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-200 mb-1.5 text-xs">Category Icon</label>
                <select
                  value={editingCategory.icon || 'Sparkles'}
                  onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#060c12] border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {ICON_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: COVER PHOTO & STORY RING ASSET */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                <ImageIcon className="w-4 h-4 text-amber-500" />
                <span>2. Circle Photo & Media Asset</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Auto-fit in circular ring</span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-amber-500/30 p-1 bg-[#060c12] shrink-0 shadow-md">
                <img
                  src={catImageFile ? URL.createObjectURL(catImageFile) : (editingCategory.image || '/assets/logo/logo_main.png')}
                  alt="Thumbnail"
                  className="w-full h-full object-cover rounded-xl"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/assets/logo/logo_main.png';
                  }}
                />
              </div>

              <div className="flex-1 space-y-2">
                <input
                  type="file"
                  ref={catFileInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setCatImageFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
                
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => catFileInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition flex items-center gap-2 shadow-sm"
                  >
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>{catImageFile ? `File: ${catImageFile.name}` : 'Upload Photo From PC / Phone'}</span>
                  </button>

                  {catImageFile && (
                    <button
                      type="button"
                      onClick={() => setCatImageFile(null)}
                      className="px-2.5 py-2 text-rose-400 hover:text-rose-300 text-xs font-semibold transition"
                    >
                      Clear File
                    </button>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Or paste direct image URL (e.g. /assets/products/...)"
                  value={editingCategory.image || ''}
                  onChange={(e) => {
                    setCatImageFile(null);
                    setEditingCategory({ ...editingCategory, image: e.target.value });
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#060c12] border border-slate-700 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Quick Luxury Presets */}
            <div className="pt-3 border-t border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Quick Luxury Store Presets (1-Click Apply):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "Men's Thobe", path: '/assets/studio/mens_white_thobe.jpg' },
                  { label: "Talbina Health", path: '/assets/products/talbeena_boxes_group.jpg' },
                  { label: "Dehnul Oud", path: '/assets/categories/fragrance_mukh_malaki.jpg' },
                  { label: "Islamic Clock", path: '/assets/categories/decor_islamic_wall_clock.jpg' },
                  { label: "Nikah Frame", path: '/assets/categories/wedding_nikah_frame.jpg' },
                  { label: "Blackseed Oil", path: '/assets/products/pure_kalonji_blackseed_oil.jpg' },
                  { label: "Attar Bottle", path: '/assets/products/attar_rooh_gulab_pure.jpg' },
                  { label: "Bakhoor Burner", path: '/assets/products/bakhoor_electric_brass_burner.jpg' }
                ].map((preset) => (
                  <button
                    key={preset.path}
                    type="button"
                    onClick={() => {
                      setCatImageFile(null);
                      setEditingCategory({ ...editingCategory, image: preset.path });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition border ${
                      editingCategory.image === preset.path && !catImageFile
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-amber-400/60'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 3: SUBCATEGORIES MANAGER */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                <Plus className="w-4 h-4 text-amber-500" />
                <span>3. Subcategories & Filter Tabs ({editingCategory.subcategories?.length || 0})</span>
              </div>
              <span className="text-[10px] text-slate-400">Used as category filter tabs</span>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[36px] p-2.5 bg-[#060c12] rounded-xl border border-slate-800">
              {editingCategory.subcategories && editingCategory.subcategories.length > 0 ? (
                editingCategory.subcategories.map((sub) => (
                  <span
                    key={sub.id}
                    className="inline-flex items-center gap-1.5 bg-emerald-950/70 text-emerald-300 border border-emerald-800/50 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs"
                  >
                    <span>{sub.name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubcatFromCategory(sub.id)}
                      className="text-emerald-400 hover:text-rose-400 ml-1 font-black text-sm"
                    >
                      ×
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic p-1">No subcategories yet. Type below and click Add.</span>
              )}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type subcategory name (e.g. 'Saudi Thobes', 'Dry Fruit Talbina')..."
                value={newSubcatInput}
                onChange={(e) => setNewSubcatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubcatToCategory();
                  }
                }}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#060c12] border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={handleAddSubcatToCategory}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-amber-300 font-bold text-xs hover:bg-slate-700 transition flex items-center gap-1.5 border border-slate-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tag</span>
              </button>
            </div>
          </div>

          {/* Bottom Action Buttons (Fixed Footer) */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-800 shrink-0">
            <button
              type="submit"
              disabled={savingCategory || uploadingCatImage}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm tracking-wide hover:brightness-110 transition shadow-lg shadow-amber-500/20 active:scale-[0.99]"
            >
              {savingCategory || uploadingCatImage ? 'Saving Category...' : editingCategory.isNew ? 'Create Category & Publish' : 'Save Category Changes'}
            </button>
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(false)}
              className="px-6 py-3.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )}

  {/* ========================================================================= */}
  {/* MODAL: ADD / EDIT HOMEPAGE HERO BANNER SLIDE                              */}
  {/* ========================================================================= */}
  {isSlideModalOpen && editingSlide && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-hidden">
      <div className="bg-[#0b1520] border border-amber-500/40 rounded-3xl max-w-2xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Modal Fixed Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between shrink-0 bg-[#0c1620]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">
                {editingSlide.isNew ? 'Create New Homepage Banner Slide' : `Edit Banner Slide: ${editingSlide.title || 'Slide'}`}
              </h3>
              <p className="text-xs text-slate-400">Live preview & 4:3 crop protection with MongoDB Atlas sync.</p>
            </div>
          </div>
          <button
            onClick={() => setIsSlideModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSaveSlide} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar text-xs">
          {/* Live 1:1 Homepage Carousel Card Mockup Preview */}
          <div className="rounded-2xl bg-[#060c12] border border-amber-500/30 p-4 space-y-2.5 shadow-lg">
            <div className="flex items-center justify-between text-[11px] text-amber-400 font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Live Customer View Preview</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal normal-case">Updates as you type</span>
            </div>

            <div className="rounded-2xl bg-[#faf8f5] border border-amber-900/15 p-4 text-[#032219] shadow-md grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center overflow-hidden">
              {/* Left side text preview */}
              <div className="sm:col-span-7 space-y-1.5">
                {editingSlide.badge && (
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-950 text-[10px] font-bold">
                    {editingSlide.badge}
                  </div>
                )}
                <h4 className="font-serif font-black text-base sm:text-lg text-[#032219] leading-snug line-clamp-2">
                  {editingSlide.title || 'Enter Slide Title Below...'}
                </h4>
                <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                  {editingSlide.subtitle || 'Enter slide subtitle and benefits description below...'}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {(editingSlide.price || editingSlide.mrp) && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100/80 border border-amber-300 text-amber-950 text-xs font-bold font-serif">
                      <span>{editingSlide.price || 'From ₹249'}</span>
                      {editingSlide.mrp && <span className="line-through text-slate-400 font-sans text-[10px] font-normal">{editingSlide.mrp}</span>}
                    </div>
                  )}
                  {editingSlide.highlight && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[10px] font-semibold">
                      <span>✓ {editingSlide.highlight}</span>
                    </div>
                  )}
                </div>
                <div className="pt-1.5">
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#032219] text-amber-300 text-xs font-bold">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{editingSlide.ctaText || 'Shop Collection'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                </div>
              </div>

              {/* Right side image frame preview */}
              <div className="sm:col-span-5 flex items-center justify-center">
                <div className="relative w-full h-36 sm:h-40 rounded-xl overflow-hidden bg-gradient-to-tr from-amber-50 via-white to-emerald-50 border border-amber-900/15 shadow-sm">
                  <img
                    src={slideImageFile ? URL.createObjectURL(slideImageFile) : (editingSlide.image || '/assets/talbina/talbina_banner_43.jpg')}
                    alt="Slide Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/assets/talbina/talbina_banner_43.jpg';
                    }}
                  />
                  <div className="absolute bottom-1.5 right-1.5 bg-white/95 border border-amber-500/40 px-2 py-0.5 rounded text-[9px] font-bold text-[#032219] shadow-xs">
                    100% Authentic Sunnah
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 1: TITLE & FLOATING BADGE */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
              <Tag className="w-4 h-4 text-amber-500" />
              <span>1. Banner Headline & Floating Tag</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-white mb-1.5 text-xs">Slide Headline / Main Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arabian's Sprouted Barley Talbeena"
                  value={editingSlide.title || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#060c12] border border-slate-700 hover:border-slate-600 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-amber-300 mb-1.5 text-xs flex items-center justify-between">
                  <span>Badge Pill (Floating Top Tag)</span>
                  <span className="text-[10px] text-slate-400 font-normal">Optional</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 🥣 Prophetic Sunnah Superfood"
                  value={editingSlide.badge || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, badge: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#060c12] border border-slate-700 hover:border-slate-600 text-amber-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-200 mb-1.5 text-xs">Subtitle / Hadith / Benefits Description</label>
              <textarea
                rows={2}
                placeholder="e.g. Stone-ground roasted barley blended with premium California almonds, pistachios, and saffron. Rejuvenates the heart..."
                value={editingSlide.subtitle || ''}
                onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-[#060c12] border border-slate-700 hover:border-slate-600 text-white text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
              />
            </div>
          </div>

          {/* SECTION 2: PRICING & HIGHLIGHTS */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>2. Pricing & Trust Badge</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block font-bold text-amber-300 mb-1.5 text-xs">Selling Price Tag</label>
                <input
                  type="text"
                  placeholder="e.g. From ₹249"
                  value={editingSlide.price || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, price: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#060c12] border border-slate-700 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-400 mb-1.5 text-xs">MRP (Strikethrough)</label>
                <input
                  type="text"
                  placeholder="e.g. ₹270"
                  value={editingSlide.mrp || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, mrp: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#060c12] border border-slate-700 text-slate-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-emerald-400 mb-1.5 text-xs">Trust Highlight Pill</label>
                <input
                  type="text"
                  placeholder="e.g. 5 High-Repeat Flavors"
                  value={editingSlide.highlight || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, highlight: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#060c12] border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: CALL TO ACTION BUTTON & LINK */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
              <ArrowRight className="w-4 h-4 text-amber-500" />
              <span>3. Call To Action Button & Link</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-slate-200 mb-1.5 text-xs">Button Label Text</label>
                <input
                  type="text"
                  placeholder="e.g. Order Sunnah Talbina"
                  value={editingSlide.ctaText || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, ctaText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#060c12] border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-200 mb-1.5 text-xs">Destination Link / URL</label>
                <input
                  type="text"
                  placeholder="e.g. /product/talbina-vanilla or /shop?category=health"
                  value={editingSlide.ctaLink || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, ctaLink: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#060c12] border border-slate-700 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: BANNER PHOTO ASSET */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                <ImageIcon className="w-4 h-4 text-amber-500" />
                <span>4. Banner Cover Photo</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Any size accepted (Auto-cropped to 4:3)</span>
            </div>

            {/* Custom file upload button + URL input */}
            <div className="space-y-3">
              <input
                type="file"
                ref={slideFileInputRef}
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSlideImageFile(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  onClick={() => slideFileInputRef.current?.click()}
                  className="px-5 py-3 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm shrink-0"
                >
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>Upload Photo From PC / Phone</span>
                </button>

                {slideImageFile ? (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/70 border border-emerald-800/60 text-emerald-300 text-xs flex-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate flex-1 font-mono">{slideImageFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setSlideImageFile(null)}
                      className="text-slate-400 hover:text-rose-400 text-xs font-bold px-1.5 py-0.5 rounded bg-slate-800/80"
                    >
                      Clear File
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] text-slate-400 hidden sm:inline">or paste direct image URL below:</span>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">Direct Image Path or URL</label>
                <input
                  type="text"
                  placeholder="e.g. /assets/talbina/talbina_banner_43.jpg or https://..."
                  value={editingSlide.image || ''}
                  onChange={(e) => {
                    setSlideImageFile(null);
                    setEditingSlide({ ...editingSlide, image: e.target.value });
                  }}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#060c12] border border-slate-700 text-white text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Quick Luxury Presets */}
            <div className="pt-3 border-t border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Quick Luxury Studio Presets (1-Click Apply):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: '🥣 Talbina Sunnah', path: '/assets/talbina/talbina_banner_43.jpg' },
                  { name: '👑 Saudi Thobe', path: '/assets/studio/mens_black_thobe_studio.jpg' },
                  { name: '✨ Aged Dehnul Oud', path: '/assets/studio/oud_mabkhara_luxury.jpg' },
                  { name: '💍 Velvet Nikah Nama', path: '/assets/studio/nikah_nama_banner_43.jpg' },
                  { name: '🌿 Pure Kalonji Oil', path: '/assets/products/pure_kalonji_blackseed_oil.jpg' },
                  { name: '🕰️ Islamic Wall Clock', path: '/assets/categories/decor_islamic_wall_clock.jpg' }
                ].map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSlideImageFile(null);
                      setEditingSlide({ ...editingSlide, image: p.path });
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition border ${
                      editingSlide.image === p.path && !slideImageFile
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-amber-400/60'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Action Buttons (Fixed Footer) */}
          <div className="flex items-center gap-3 pt-3 border-t border-slate-800 shrink-0">
            <button
              type="submit"
              disabled={savingSlide || uploadingSlideImage}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-sm tracking-wide hover:brightness-110 transition shadow-lg shadow-amber-500/20 active:scale-[0.99]"
            >
              {savingSlide || uploadingSlideImage ? 'Saving Banner Slide...' : editingSlide.isNew ? 'Create Banner Slide & Publish' : 'Save Banner Changes'}
            </button>
            <button
              type="button"
              onClick={() => setIsSlideModalOpen(false)}
              className="px-6 py-3.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition"
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
      <div className="bg-[#0c1620] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 my-8 border border-amber-500/30 shadow-2xl text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white">Create New Coupon Code</h3>
              <p className="text-[11px] text-slate-400">Har product ke liye ya kisi specific product ke liye coupon banayein</p>
            </div>
          </div>
          <button
            onClick={() => setIsCouponModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
          
          {/* STEP 1: SCOPE SELECTOR (Har Product vs Specific Product) */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-200">
              Coupon Scope / Kis Par Apply Hoga? *
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {/* Option A: All Products */}
              <button
                type="button"
                onClick={() => setNewCouponData({ ...newCouponData, scope: 'all' })}
                className={`p-3 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                  newCouponData.scope === 'all'
                    ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10'
                    : 'bg-[#070d12] border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base">🌐</span>
                  {newCouponData.scope === 'all' && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </div>
                <div>
                  <div className={`font-bold text-xs ${newCouponData.scope === 'all' ? 'text-amber-300' : 'text-slate-200'}`}>
                    Har Product Par
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                    Store-wide: Cart ke total par discount
                  </div>
                </div>
              </button>

              {/* Option B: Specific Product */}
              <button
                type="button"
                onClick={() => {
                  const defaultPid = newCouponData.productId || (products && products[0] ? products[0].id : '');
                  setNewCouponData({ ...newCouponData, scope: 'specific', productId: defaultPid });
                }}
                className={`p-3 rounded-2xl border text-left transition relative flex flex-col justify-between ${
                  newCouponData.scope === 'specific'
                    ? 'bg-amber-500/15 border-amber-500 text-white shadow-md shadow-amber-500/10'
                    : 'bg-[#070d12] border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base">🎯</span>
                  {newCouponData.scope === 'specific' && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </div>
                <div>
                  <div className={`font-bold text-xs ${newCouponData.scope === 'specific' ? 'text-amber-300' : 'text-slate-200'}`}>
                    Kisi Specific Product Par
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                    Sirf chune hue item par discount
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* STEP 2: PRODUCT SELECTOR (If Scope === Specific) */}
          {newCouponData.scope === 'specific' && (
            <div className="space-y-2 p-3.5 rounded-2xl bg-[#070d12] border border-amber-500/30">
              <label className="block font-bold text-amber-300">
                Target Product Select Karein *
              </label>
              <select
                required
                value={newCouponData.productId}
                onChange={(e) => setNewCouponData({ ...newCouponData, productId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c1620] border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs"
              >
                <option value="">-- Choose Product ({products.length} available) --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ₹{p.price} ({p.category || 'General'})
                  </option>
                ))}
              </select>

              {/* Selected Product Preview Mini Card */}
              {(() => {
                const sel = products.find(p => String(p.id) === String(newCouponData.productId));
                if (!sel) return null;
                return (
                  <div className="flex items-center gap-2.5 pt-1">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-900 border border-slate-700 shrink-0">
                      <img src={sel.image || '/assets/logo/logo_main.png'} alt={sel.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs text-white truncate">{sel.name}</div>
                      <div className="text-[10px] text-slate-400">Regular Price: <strong className="text-amber-300">₹{sel.price}</strong> • {sel.category}</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* STEP 3: COUPON CODE INPUT & PRESET CHIPS */}
          <div className="space-y-1.5">
            <label className="block font-bold text-slate-300">
              Coupon Code *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. ARABIAN10, JUMMAH15, TALBINA50"
              value={newCouponData.code}
              onChange={(e) => setNewCouponData({ ...newCouponData, code: e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, '') })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#070d12] border border-slate-700 font-mono uppercase font-black text-sm text-amber-300 tracking-wider focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            {/* Quick Suggestion Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
              <span className="text-[10px] text-slate-500">Quick suggestions:</span>
              {['ARABIAN10', 'JUMMAH15', 'SPECIAL20', 'FLAT50', 'SAVE100'].map(sug => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => setNewCouponData({ ...newCouponData, code: sug })}
                  className="px-2 py-0.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 text-[10px] font-mono font-bold transition border border-slate-700"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* STEP 4: DISCOUNT TYPE & VALUE */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Discount Type *</label>
              <select
                value={newCouponData.discountType}
                onChange={(e) => setNewCouponData({ ...newCouponData, discountType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070d12] border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-300 mb-1">
                Discount Value {newCouponData.discountType === 'percentage' ? '(%)' : '(₹)'} *
              </label>
              <input
                type="number"
                required
                min="1"
                max={newCouponData.discountType === 'percentage' ? '90' : '100000'}
                value={newCouponData.discountValue}
                onChange={(e) => setNewCouponData({ ...newCouponData, discountValue: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070d12] border border-slate-700 text-white font-mono font-bold focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Quick value presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-500">Fast presets:</span>
            {newCouponData.discountType === 'percentage'
              ? ['5', '10', '15', '20', '25', '50'].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setNewCouponData({ ...newCouponData, discountValue: val })}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition ${
                      newCouponData.discountValue === val
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {val}%
                  </button>
                ))
              : ['50', '100', '150', '200', '500'].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setNewCouponData({ ...newCouponData, discountValue: val })}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition ${
                      newCouponData.discountValue === val
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    ₹{val}
                  </button>
                ))}
          </div>

          {/* STEP 5: MINIMUM ORDER VALUE */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-slate-300">Minimum Order Value (₹) *</label>
              <span className="text-[10px] text-slate-500">₹0 = Koi limit nahi (No minimum limit)</span>
            </div>
            <input
              type="number"
              required
              min="0"
              value={newCouponData.minOrder}
              onChange={(e) => setNewCouponData({ ...newCouponData, minOrder: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#070d12] border border-slate-700 text-white font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* STEP 6: DESCRIPTION (Optional) */}
          <div>
            <label className="block font-bold text-slate-300 mb-1">Coupon Description (Optional)</label>
            <input
              type="text"
              placeholder={newCouponData.scope === 'specific' ? "e.g. Special 15% OFF on this product" : "e.g. 10% Off for Jummah Blessings"}
              value={newCouponData.description}
              onChange={(e) => setNewCouponData({ ...newCouponData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#070d12] border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs"
            />
          </div>

          {/* STEP 7: LIVE SUMMARY PREVIEW */}
          {(() => {
            const selProd = newCouponData.scope === 'specific' ? products.find(p => String(p.id) === String(newCouponData.productId)) : null;
            const discText = newCouponData.discountType === 'percentage' ? `${newCouponData.discountValue || 0}% OFF` : `Flat ₹${newCouponData.discountValue || 0} OFF`;
            const scopeText = newCouponData.scope === 'specific' ? (selProd ? `"${selProd.name}"` : 'Selected Product') : 'All Products (Har Product Par)';
            const minText = Number(newCouponData.minOrder) > 0 ? `on orders above ₹${newCouponData.minOrder}` : 'with no minimum order';
            return (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-[11px] text-amber-200/90 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">Summary: </span>
                  Code <strong className="font-mono text-amber-300 uppercase">{newCouponData.code || 'COUPON'}</strong> gives{' '}
                  <strong className="text-emerald-300">{discText}</strong> on <strong className="text-white">{scopeText}</strong> {minText}.
                </div>
              </div>
            );
          })()}

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={savingCoupon}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black tracking-wide hover:brightness-110 transition shadow-lg shadow-amber-500/20 active:scale-[0.99]"
            >
              {savingCoupon ? 'Saving Coupon...' : 'Create & Activate Coupon'}
            </button>
            <button
              type="button"
              onClick={() => setIsCouponModalOpen(false)}
              className="px-5 py-3.5 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition"
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
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) setActiveInvoiceOrder(null); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto cursor-pointer"
    >
      <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 max-w-2xl w-full space-y-6 my-8 shadow-2xl border border-amber-500/40 relative cursor-default">
        
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
              id="close-invoice-modal-btn"
              onClick={() => setActiveInvoiceOrder(null)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
              title="Close"
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
              WhatsApp / Call: +91 72338 62626 • arabiansshoppingzone@gmail.com
            </p>
          </div>

          <div className="text-right">
            <div className="font-mono font-bold text-sm bg-slate-100 px-3 py-1 rounded-xl inline-block text-slate-950">
              {activeInvoiceOrder.id}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Date: {activeInvoiceOrder.createdAt || activeInvoiceOrder.date}
            </div>
            <div className="text-xs font-bold uppercase text-amber-700">
              Payment: {activeInvoiceOrder.paymentMode || activeInvoiceOrder.paymentMethod || 'COD'}
            </div>
          </div>
        </div>

        {/* Customer & Address Details */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
          <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">
            Billed & Shipped To:
          </span>
          <div className="font-bold text-slate-900 text-sm">
            {activeInvoiceOrder.customerName || activeInvoiceOrder.customer?.name || 'Customer'}
          </div>
          <div className="text-slate-600">
            {activeInvoiceOrder.address || (activeInvoiceOrder.customer ? [activeInvoiceOrder.customer.address, activeInvoiceOrder.customer.city, activeInvoiceOrder.customer.state, activeInvoiceOrder.customer.pincode].filter(Boolean).join(', ') : 'Direct Delivery')}
          </div>
          <div className="text-slate-700 font-mono">
            Contact: {activeInvoiceOrder.phone || activeInvoiceOrder.customer?.phone || 'N/A'}
          </div>
          {(activeInvoiceOrder.trackingId || activeInvoiceOrder.trackingNumber) && (
            <div className="text-emerald-700 font-bold pt-1">
              Courier Tracking: {activeInvoiceOrder.trackingId || activeInvoiceOrder.trackingNumber}
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
                    <div>{it.name} {it.selectedSize ? `(${it.selectedSize})` : ''}</div>
                    {it.customization && (
                      <div className="text-[11px] text-amber-950 bg-amber-50 p-1.5 rounded mt-1 border border-amber-200">
                        <strong className="text-amber-900">👑 Custom Personalization:</strong>{' '}
                        {it.customization.shareLaterOnWhatsApp 
                          ? 'Customer will provide custom details via WhatsApp'
                          : it.customization.isWedding 
                            ? `Dulha: ${it.customization.groomName || '-'} ❤️ Dulhan: ${it.customization.brideName || '-'}${it.customization.eventDate ? ` | Date: ${it.customization.eventDate}` : ''}${it.customization.cityVenue ? ` | Venue: ${it.customization.cityVenue}` : ''}${it.customization.specialNotes ? ` | Note: ${it.customization.specialNotes}` : ''}`
                            : `${it.customization.customText}${it.customization.specialNotes ? ` | Note: ${it.customization.specialNotes}` : ''}`}
                      </div>
                    )}
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
          <div className="w-72 space-y-1.5 text-right">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono">₹{activeInvoiceOrder.subtotal || activeInvoiceOrder.total}</span>
            </div>
            {activeInvoiceOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Coupon ({activeInvoiceOrder.couponCode || 'PROMO'}):</span>
                <span className="font-mono">-₹{activeInvoiceOrder.discount}</span>
              </div>
            )}
            {activeInvoiceOrder.onlineDiscount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Online Payment Discount:</span>
                <span className="font-mono">-₹{activeInvoiceOrder.onlineDiscount}</span>
              </div>
            )}
            {activeInvoiceOrder.codFee > 0 && (
              <div className="flex justify-between text-amber-700 font-semibold">
                <span>COD Handling Fee:</span>
                <span className="font-mono">+₹{activeInvoiceOrder.codFee}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Shipping / Delivery:</span>
              <span className={activeInvoiceOrder.deliveryFee === 0 || !activeInvoiceOrder.deliveryFee ? "text-emerald-600 font-bold" : "font-mono font-bold text-slate-800"}>
                {activeInvoiceOrder.deliveryFee === 0 || !activeInvoiceOrder.deliveryFee ? 'FREE' : `₹${activeInvoiceOrder.deliveryFee}`}
              </span>
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

  {/* ========================================================================= */}
  {/* MODAL 5: SHIPMOZO DIRECT DELIVERY DISPATCH MODAL                          */}
  {/* ========================================================================= */}
  {mozoModalOrder && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0b1520] rounded-3xl p-5 sm:p-7 max-w-xl w-full my-auto border border-sky-500/40 shadow-2xl text-slate-100 space-y-5">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center font-black shadow-md shadow-sky-500/20">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-black text-base sm:text-lg text-white">
                Push Order to Shipmozo
              </h3>
              <p className="text-[11px] text-slate-400">
                Order <span className="font-mono text-amber-400 font-bold">{mozoModalOrder.id}</span> will be dispatched to your Shipmozo account.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMozoModalOrder(null)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customer & Delivery Summary Card */}
        <div className="p-4 rounded-2xl bg-[#060c12] border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">
              {mozoModalOrder.customerName || mozoModalOrder.customer?.name || 'Customer'}
            </span>
            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
              (mozoModalOrder.paymentMode || mozoModalOrder.paymentMethod || 'COD').toUpperCase() === 'COD'
                ? 'bg-amber-950 text-amber-300 border border-amber-700/60'
                : 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
            }`}>
              {mozoModalOrder.paymentMode || mozoModalOrder.paymentMethod || 'COD'} • ₹{mozoModalOrder.total}
            </span>
          </div>

          <div className="text-slate-300 flex items-center gap-1 font-mono">
            <Phone className="w-3 h-3 text-amber-400" />
            <span>{mozoModalOrder.phone || mozoModalOrder.customer?.phone || 'No phone'}</span>
          </div>

          <div className="text-slate-400 pt-1 leading-relaxed border-t border-slate-800/80">
            {mozoModalOrder.address || (mozoModalOrder.customer ? [mozoModalOrder.customer.address, mozoModalOrder.customer.city, mozoModalOrder.customer.state, mozoModalOrder.customer.pincode].filter(Boolean).join(', ') : 'No address provided')}
          </div>

          <div className="text-[11px] text-slate-400 pt-1">
            <strong className="text-slate-200">Items:</strong> {mozoModalOrder.items ? mozoModalOrder.items.map(i => `${i.name} (×${i.quantity})`).join(', ') : '1 item'}
          </div>
        </div>

        {/* Parcel Parameters */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-200 mb-1 text-[11px]">
              Parcel Weight (Grams)
            </label>
            <input
              type="number"
              value={mozoWeight}
              onChange={(e) => setMozoWeight(Number(e.target.value))}
              placeholder="500"
              className="w-full px-3 py-2 rounded-xl bg-[#060c12] border border-slate-700 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            <span className="text-[10px] text-slate-500 mt-0.5 block">Default: 500g (0.5 kg)</span>
          </div>

          <div>
            <label className="block font-bold text-slate-200 mb-1 text-[11px]">
              Pickup Warehouse
            </label>
            <select
              value={mozoWarehouse}
              onChange={(e) => setMozoWarehouse(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#060c12] border border-slate-700 text-white text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="66952">ARABIANS SHOPPING ZONE (Kanpur 208001)</option>
              <option value="100325">ARABIANS TALBINA (Kanpur 208021)</option>
            </select>
            <span className="text-[10px] text-emerald-400 mt-0.5 block">Active pickup location</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
          <button
            type="button"
            disabled={pushingMozoId === mozoModalOrder.id}
            onClick={() => handlePushToShipmozo(mozoModalOrder, mozoWeight, mozoWarehouse)}
            className="w-full sm:flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 via-sky-600 to-blue-700 hover:brightness-110 text-white font-black text-xs tracking-wide shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2 active:scale-98 transition"
          >
            {pushingMozoId === mozoModalOrder.id ? (
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Send className="w-4 h-4 text-white" />
            )}
            <span>
              {pushingMozoId === mozoModalOrder.id ? 'Pushing to Shipmozo API...' : '🚀 Confirm & Push to Shipmozo'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMozoModalOrder(null)}
            className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  )}

</div>
);
}
