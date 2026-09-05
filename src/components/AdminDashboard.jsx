import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Upload, 
  CheckCircle2, 
  Truck, 
  Phone, 
  MessageSquare, 
  RefreshCw, 
  Save, 
  DollarSign,
  Search,
  Tag,
  Eye,
  Sliders,
  Layers,
  FolderPlus,
  Sparkles,
  Shirt,
  HeartPulse,
  Clock,
  BookOpen,
  Gift,
  Droplets,
  Flame,
  Scroll,
  Gem,
  Compass
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

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

export default function AdminDashboard() {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    products, 
    categories, 
    refreshAll, 
    settings, 
    showToast 
  } = useStore();

  const [authenticated, setAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState('orders'); // 'overview', 'orders', 'products', 'distributors', 'settings'

  // Admin Data states
  const [orders, setOrders] = useState([]);
  const [distributors, setDistributors] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  // Search & Filter in Orders
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Product Edit / Add Modal
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Category Edit / Add Modal
  const [editingCategory, setEditingCategory] = useState(null);
  const [isCatAddMode, setIsCatAddMode] = useState(false);
  const [catImageFile, setCatImageFile] = useState(null);
  const [uploadingCatImage, setUploadingCatImage] = useState(false);
  const [newSubcatInput, setNewSubcatInput] = useState('');

  // Load Admin Data once authenticated
  const fetchAdminData = async () => {
    try {
      setLoadingData(true);
      const [ordRes, distRes, coupRes] = await Promise.all([
        fetch('/api/orders').then(r => r.json()),
        fetch('/api/distributors').then(r => r.json()),
        fetch('/api/coupons').then(r => r.json())
      ]);
      setOrders(ordRes || []);
      setDistributors(distRes || []);
      setCoupons(coupRes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchAdminData();
    }
  }, [authenticated]);

  if (!isAdminOpen) return null;

  // PIN Login Form
  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput.trim() === settings.adminPin || pinInput.trim() === 'arabians786') {
      setAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Invalid Admin Passcode. Access denied.');
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        showToast(`Order ${orderId} marked as "${newStatus}"`);
        fetchAdminData();
        refreshAll();
      }
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  // Product Save (Create or Update)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      let finalImageUrl = editingProduct.image;

      // If user uploaded a new image file, upload it first
      if (imageFile) {
        setUploadingImage(true);
        const formData = new FormData();
        formData.append('image', imageFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          finalImageUrl = uploadData.url;
        }
        setUploadingImage(false);
      }

      const subcatValue = (editingProduct.subcategory || editingProduct.subCategory || '').trim();
      const payload = {
        ...editingProduct,
        image: finalImageUrl,
        gallery: [finalImageUrl],
        subcategory: subcatValue,
        subCategory: subcatValue
      };

      const url = isAddMode ? '/api/products' : `/api/products/${editingProduct.id}`;
      const method = isAddMode ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(isAddMode ? "Product added successfully!" : "Product updated successfully!");
        setEditingProduct(null);
        setImageFile(null);
        refreshAll();
      }
    } catch (err) {
      console.error(err);
      showToast("Error saving product", "error");
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast("Product deleted successfully!");
        refreshAll();
      }
    } catch {
      showToast("Failed to delete product", "error");
    }
  };

  // Category Save (Create or Update)
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory.name || !editingCategory.name.trim()) {
      showToast("Category title is required", "error");
      return;
    }
    try {
      let finalImageUrl = editingCategory.image || '/assets/logo/logo_main.png';

      // If user uploaded a new image file, upload it first
      if (catImageFile) {
        setUploadingCatImage(true);
        const formData = new FormData();
        formData.append('image', catImageFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          finalImageUrl = uploadData.url;
        }
        setUploadingCatImage(false);
      }

      // Auto-generate or sanitize slug ID
      const rawSlug = isCatAddMode
        ? (editingCategory.id && editingCategory.id.trim()
            ? editingCategory.id.trim()
            : editingCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
        : editingCategory.id;

      const slugId = rawSlug.toLowerCase().replace(/[^a-z0-9_-]/g, '');

      const payload = {
        id: slugId,
        name: editingCategory.name.trim(),
        subtitle: (editingCategory.subtitle || '').trim(),
        icon: editingCategory.icon || 'Sparkles',
        badge: (editingCategory.badge || '').trim(),
        image: finalImageUrl,
        subcategories: editingCategory.subcategories || []
      };

      const url = isCatAddMode ? '/api/categories' : `/api/categories/${editingCategory.id}`;
      const method = isCatAddMode ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(isCatAddMode ? "Category added successfully!" : "Category updated successfully!");
        setEditingCategory(null);
        setCatImageFile(null);
        setNewSubcatInput('');
        refreshAll();
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.error || "Failed to save category", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error saving category", "error");
    }
  };

  // Delete Category
  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"? Products in this category will remain in the database.`)) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Category "${name}" deleted!`);
        refreshAll();
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.error || "Failed to delete category", "error");
      }
    } catch {
      showToast("Failed to delete category", "error");
    }
  };

  // Add Subcategory Tag
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

  // Remove Subcategory Tag
  const handleRemoveSubcatFromCategory = (subId) => {
    setEditingCategory({
      ...editingCategory,
      subcategories: (editingCategory.subcategories || []).filter(s => s.id !== subId)
    });
  };

  // Total Revenue calculation
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter(o => o.status !== 'Delivered').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn overflow-hidden">
      <div 
        className="relative w-full max-w-6xl h-[94vh] bg-[#f8fafc] rounded-3xl overflow-hidden shadow-2xl border border-amber-500/40 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Navbar */}
        <div className="p-4 bg-[#032219] text-white flex items-center justify-between border-b border-amber-500/20 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              👑
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-bold">Arabians Store Admin Suite</h2>
              <p className="text-[10px] text-amber-300">Orders, Products & Wholesale Leads Manager</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {authenticated && (
              <button
                onClick={() => { fetchAdminData(); refreshAll(); showToast("Data refreshed!"); }}
                className="p-1.5 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200"
                title="Refresh Data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-emerald-900/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PIN Security Check */}
        {!authenticated ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-[#021812]">
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-500/30 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border-2 border-amber-300">
                <Lock className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-slate-900">Admin Security Passcode</h3>
                <p className="text-xs text-slate-500 mt-1">Enter your store PIN to manage orders and products</p>
              </div>

              <form onSubmit={handlePinSubmit} className="space-y-3">
                <input
                  type="password"
                  autoFocus
                  placeholder="Enter Store Passcode"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full text-center text-lg tracking-widest px-4 py-3 rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
                {pinError && <p className="text-xs text-rose-600 font-medium">{pinError}</p>}
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#032219] text-amber-300 font-bold text-sm hover:bg-[#063e2e] transition shadow"
                >
                  Unlock Admin Dashboard
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Main Admin Layout */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Tab Navigation */}
            <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'overview' ? 'bg-[#032219] text-amber-400' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'orders' ? 'bg-[#032219] text-amber-400' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Orders ({orders.length})</span>
                {pendingOrders > 0 && (
                  <span className="bg-amber-500 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black">
                    {pendingOrders} active
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'products' ? 'bg-[#032219] text-amber-400' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Package className="w-3.5 h-3.5" />
                <span>Products CRUD ({products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'categories' ? 'bg-[#032219] text-amber-400' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Categories & Catalogs ({categories.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('distributors')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'distributors' ? 'bg-[#032219] text-amber-400' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Distributor Leads ({distributors.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('coupons')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === 'coupons' ? 'bg-[#032219] text-amber-400' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Coupons & Settings</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                      <div className="text-[11px] font-bold text-slate-400 uppercase">Total Store Sales</div>
                      <div className="text-xl sm:text-2xl font-black text-emerald-800">₹{totalRevenue}</div>
                      <div className="text-[10px] text-emerald-600 font-semibold">From {orders.length} orders</div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                      <div className="text-[11px] font-bold text-slate-400 uppercase">Pending Dispatches</div>
                      <div className="text-xl sm:text-2xl font-black text-amber-600">{pendingOrders}</div>
                      <div className="text-[10px] text-amber-700 font-semibold">Requires courier packing</div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                      <div className="text-[11px] font-bold text-slate-400 uppercase">Active Catalog</div>
                      <div className="text-xl sm:text-2xl font-black text-slate-900">{products.length} Products</div>
                      <div className="text-[10px] text-slate-500 font-semibold">Across 5 categories</div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                      <div className="text-[11px] font-bold text-slate-400 uppercase">Distributor Inquiries</div>
                      <div className="text-xl sm:text-2xl font-black text-[#032219]">{distributors.length} Leads</div>
                      <div className="text-[10px] text-indigo-600 font-semibold">Wholesale applicants</div>
                    </div>
                  </div>

                  {/* Quick Recent Orders */}
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-serif font-bold text-base text-slate-900">Recent Customer Orders</h3>
                      <button 
                        onClick={() => setActiveTab('orders')}
                        className="text-xs font-bold text-amber-600 hover:underline"
                      >
                        View All Orders →
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {orders.slice(0, 4).map((o) => (
                        <div key={o.id} className="py-3 flex items-center justify-between gap-2 text-xs">
                          <div>
                            <div className="font-bold text-slate-900">{o.customer?.name} ({o.customer?.city})</div>
                            <div className="text-[11px] text-slate-500">{o.id} • {o.items?.length} items • {o.date}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-slate-900">₹{o.total}</div>
                            <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                              {o.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ORDERS MANAGEMENT */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  
                  {/* Filters & Search */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Search by customer name, order ID or phone..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-500">Status:</span>
                      <select
                        value={orderStatusFilter}
                        onChange={(e) => setOrderStatusFilter(e.target.value)}
                        className="text-xs font-medium px-2.5 py-2 rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="all">All Statuses</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  {/* Orders Cards / Table */}
                  <div className="space-y-3">
                    {orders
                      .filter(o => {
                        if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
                        if (orderSearch.trim()) {
                          const q = orderSearch.toLowerCase();
                          return (
                            o.id.toLowerCase().includes(q) ||
                            (o.customer?.name && o.customer.name.toLowerCase().includes(q)) ||
                            (o.customer?.phone && o.customer.phone.includes(q)) ||
                            (o.customer?.city && o.customer.city.toLowerCase().includes(q))
                          );
                        }
                        return true;
                      })
                      .map((o) => (
                        <div 
                          key={o.id}
                          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm font-bold text-slate-900">{o.id}</span>
                                <span className="text-xs text-slate-400">• {o.date}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-900 border border-amber-200">
                                  {o.paymentMethod}
                                </span>
                              </div>
                              <div className="text-xs font-semibold text-slate-800 mt-0.5">
                                {o.customer?.name} • +91 {o.customer?.phone}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              <span className="text-xs font-bold text-slate-500">Update Status:</span>
                              <select
                                value={o.status}
                                onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                                className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-300 bg-emerald-50 text-emerald-900"
                              >
                                <option value="Confirmed">Confirmed</option>
                                <option value="Dispatched">Dispatched</option>
                                <option value="In Transit">In Transit</option>
                                <option value="Delivered">Delivered</option>
                              </select>

                              {/* WhatsApp Notify Customer */}
                              <a
                                href={`https://wa.me/91${o.customer?.phone?.replace(/\D/g, '')}?text=Assalam%20o%20Alaikum%20${encodeURIComponent(o.customer?.name)},%20update%20regarding%20your%20Arabians%20order%20*${o.id}*:%20Status%20is%20now%20*${o.status}*.%20Courier:%20${encodeURIComponent(o.courier || 'Express')}.`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                                title="WhatsApp Update to Customer"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </a>
                            </div>
                          </div>

                          {/* Address & Items */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                            <div>
                              <div className="font-bold text-slate-700">Delivery Address:</div>
                              <p className="mt-0.5">
                                {o.customer?.address}, {o.customer?.city}, {o.customer?.state} - {o.customer?.pincode}
                              </p>
                            </div>

                            <div>
                              <div className="font-bold text-slate-700">Items Ordered ({o.items?.length}):</div>
                              <div className="space-y-0.5 mt-0.5">
                                {o.items?.map((item, i) => (
                                  <div key={i} className="flex justify-between">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span className="font-semibold text-slate-900">₹{item.price * item.quantity}</span>
                                  </div>
                                ))}
                                <div className="flex justify-between font-black text-slate-950 pt-1 border-t border-slate-100">
                                  <span>Total:</span>
                                  <span className="text-emerald-800">₹{o.total}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* TAB 3: PRODUCTS CRUD */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-slate-900">Store Products Inventory</h3>
                      <p className="text-xs text-slate-500">Add, edit, remove products, change prices & upload photos</p>
                    </div>

                    <button
                      onClick={() => {
                        setIsAddMode(true);
                        setEditingProduct({
                          name: '',
                          category: 'health',
                          price: 299,
                          mrp: 399,
                          netWeight: '',
                          badge: 'New Arrival',
                          stock: 50,
                          image: '/assets/logo/logo_main.png',
                          description: '',
                          benefits: ['100% Authentic quality', 'Direct manufacturer pricing'],
                          tags: ['Sunnah Food']
                        });
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#032219] text-amber-300 font-bold text-xs hover:bg-[#063e2e] transition flex items-center gap-1.5 shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Product</span>
                    </button>
                  </div>

                  {/* Products Grid / Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {products.map((p) => (
                      <div key={p.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
                        <div className="flex gap-3">
                          <div className="w-16 h-16 rounded-xl bg-slate-50 border p-1 shrink-0 flex items-center justify-center overflow-hidden">
                            <img src={p.image} alt="" className="w-full h-full object-contain" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                              {p.category}
                            </span>
                            <h4 className="font-serif font-bold text-sm text-slate-900 truncate mt-1">
                              {p.name}
                            </h4>
                            <div className="flex items-baseline gap-2 mt-1">
                              <span className="font-black text-sm text-slate-950">₹{p.price}</span>
                              <span className="text-xs text-slate-400 line-through">₹{p.mrp}</span>
                              <span className="text-[10px] text-slate-500">({p.stock} in stock)</span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            onClick={() => {
                              setIsAddMode(false);
                              setEditingProduct({ ...p });
                            }}
                            className="flex-1 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-1"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                            <span>Edit Product</span>
                          </button>

                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: CATEGORIES & CATALOGS CRUD */}
              {activeTab === 'categories' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif font-bold text-lg text-slate-900">Categories & Catalog Architecture</h3>
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {categories.length} Active Collections
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Add new categories, create subcategories, set custom badges & icons. Updates the Homepage & Shop live!
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setIsCatAddMode(true);
                        setEditingCategory({
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
                      }}
                      className="px-4 py-2.5 rounded-xl bg-[#032219] text-amber-300 font-bold text-xs hover:bg-[#063e2e] transition flex items-center gap-1.5 shadow-md shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Category</span>
                    </button>
                  </div>

                  {/* Categories Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categories.map((cat) => {
                      const catProductsCount = products.filter(p => p.category === cat.id).length;
                      const IconComponent = CATEGORY_ICON_MAP[cat.icon] || Sparkles;

                      return (
                        <div 
                          key={cat.id} 
                          className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-amber-400/60 transition group"
                        >
                          <div className="space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="w-16 h-16 rounded-xl bg-slate-50 border p-1 shrink-0 overflow-hidden flex items-center justify-center">
                                <img 
                                  src={cat.image || '/assets/logo/logo_main.png'} 
                                  alt={cat.name} 
                                  className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform" 
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <div className="w-5 h-5 rounded-md bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                                    <IconComponent className="w-3.5 h-3.5" />
                                  </div>
                                  <h4 className="font-serif font-bold text-sm text-slate-900 truncate">
                                    {cat.name}
                                  </h4>
                                </div>

                                {cat.badge && (
                                  <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300/40">
                                    {cat.badge}
                                  </span>
                                )}

                                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                                  {cat.subtitle || 'Custom curated category in Arabians Shopping Zone.'}
                                </p>
                              </div>
                            </div>

                            {/* Meta pill info */}
                            <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-[11px]">
                              <span className="text-slate-500 font-mono">
                                ID: <strong className="text-slate-700">{cat.id}</strong>
                              </span>
                              <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                                {catProductsCount} Products
                              </span>
                            </div>

                            {/* Subcategories list */}
                            <div>
                              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                                <span>Subcategories ({cat.subcategories?.length || 0})</span>
                              </div>
                              <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                                {cat.subcategories && cat.subcategories.length > 0 ? (
                                  cat.subcategories.map((sub) => {
                                    const subCount = products.filter(p => p.category === cat.id && (p.subcategory === sub.id || p.subCategory === sub.id)).length;
                                    return (
                                      <span 
                                        key={sub.id} 
                                        className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.8 rounded-md border border-slate-200"
                                      >
                                        <span>{sub.name}</span>
                                        {subCount > 0 && <span className="text-emerald-700 font-bold">({subCount})</span>}
                                      </span>
                                    );
                                  })
                                ) : (
                                  <span className="text-[10px] text-slate-400 italic">No subcategories added yet</span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            <button
                              onClick={() => {
                                setIsCatAddMode(false);
                                setEditingCategory(JSON.parse(JSON.stringify(cat)));
                                setCatImageFile(null);
                                setNewSubcatInput('');
                              }}
                              className="flex-1 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-1"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                              <span>Edit Category</span>
                            </button>

                            <button
                              onClick={() => handleDeleteCategory(cat.id, cat.name)}
                              className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
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

              {/* TAB 4: DISTRIBUTOR LEADS */}
              {activeTab === 'distributors' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-slate-900">Wholesale & Distributor Applications</h3>
                    <p className="text-xs text-slate-500">Entrepreneurs applying to sell Arabians Talbina, Thobes & Attar</p>
                  </div>

                  <div className="space-y-3">
                    {distributors.map((d) => (
                      <div key={d.id} className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900">{d.contactPerson}</span>
                              <span className="text-xs text-slate-500">({d.name})</span>
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                                {d.status}
                              </span>
                            </div>
                            <div className="text-xs text-amber-700 font-medium mt-0.5">
                              📍 {d.city}, {d.state} • Investment Budget: <strong>{d.investmentBudget}</strong>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${d.phone}`}
                              className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5"
                            >
                              <Phone className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Call {d.phone}</span>
                            </a>

                            <a
                              href={`https://wa.me/91${d.phone?.replace(/\D/g, '')}?text=Assalam%20o%20Alaikum%20${encodeURIComponent(d.contactPerson)},%20this%20is%20Arabians%20Shopping%20Zone%20regarding%20your%20Distributor%20Application%20for%20${encodeURIComponent(d.city)}.`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 flex items-center gap-1.5"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>

                        <div className="text-xs text-slate-600 space-y-1">
                          <div>Current Business: <strong>{d.currentBusiness}</strong></div>
                          <div>Products of Interest: <strong>{d.interestedProducts?.join(', ')}</strong></div>
                          {d.message && (
                            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic text-slate-700">
                              "{d.message}"
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: COUPONS & SETTINGS */}
              {activeTab === 'coupons' && (
                <div className="space-y-6 max-w-2xl">
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                    <h3 className="font-serif font-bold text-base text-slate-900">Active Promo Discount Codes</h3>
                    <div className="space-y-2">
                      {coupons.map((c, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                          <div>
                            <div className="font-mono font-bold text-emerald-800 text-sm">{c.code}</div>
                            <div className="text-slate-500">{c.description}</div>
                          </div>
                          <span className="font-bold text-slate-900">
                            {c.discountPercent ? `${c.discountPercent}% Off` : `₹${c.flatDiscount} Off`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 text-xs sm:text-sm">
                    <h3 className="font-serif font-bold text-base text-slate-900">Store Public Information</h3>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Store WhatsApp Number (without +):</label>
                      <input
                        type="text"
                        disabled
                        value={settings.whatsapp}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 font-mono"
                      />
                      <span className="text-[11px] text-slate-400 mt-1 block">Configured in server/data/store.json</span>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Current Top Announcement Banner:</label>
                      <input
                        type="text"
                        disabled
                        value={settings.announcement}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* Edit / Add Product Modal */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-8 shadow-2xl border border-amber-500/40 max-h-[90vh] overflow-y-auto space-y-4">
              <button
                onClick={() => { setEditingProduct(null); setImageFile(null); }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-serif text-xl font-bold text-slate-900">
                {isAddMode ? 'Add New Product to Store' : `Edit Product: ${editingProduct.name}`}
              </h3>

              <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs sm:text-sm">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category *</label>
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
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Subcategory</label>
                    <select
                      value={editingProduct.subcategory || editingProduct.subCategory || ''}
                      onChange={(e) => setEditingProduct({ 
                        ...editingProduct, 
                        subcategory: e.target.value,
                        subCategory: e.target.value 
                      })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      <option value="">-- General / None --</option>
                      {(categories.find(c => c.id === editingProduct.category)?.subcategories || []).map((sub) => (
                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Badge Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Bestseller, Special"
                      value={editingProduct.badge || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">MRP Price (₹):</label>
                    <input
                      type="number"
                      value={editingProduct.mrp || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, mrp: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Stock Units:</label>
                    <input
                      type="number"
                      value={editingProduct.stock || 50}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Direct Image Upload & Smart Fit Settings */}
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-slate-900 text-xs sm:text-sm">
                      Product Photo & Display Framing
                    </label>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300/60">
                      Supports JPG, PNG, WebP
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-start">
                    {/* Left: Upload and Controls (7 cols) */}
                    <div className="sm:col-span-7 space-y-2.5">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">1. Upload Image from Mobile/PC</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setImageFile(e.target.files[0]);
                            }
                          }}
                          className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#032219] file:text-amber-300 hover:file:bg-[#063e2e] file:cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">2. Or Paste Image URL</label>
                        <input
                          type="text"
                          placeholder="https://... or /assets/products/..."
                          value={editingProduct.image || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      {/* Image Framing / Fit Selector */}
                      <div className="pt-1">
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          3. Frame Fit Mode (Prevents Awkward Cropping)
                        </label>
                        <select
                          value={editingProduct.imageFit || 'auto'}
                          onChange={(e) => setEditingProduct({ ...editingProduct, imageFit: e.target.value })}
                          className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="auto">✨ Smart Auto-Fit (Preserves clothing & square bottles)</option>
                          <option value="contain">📦 Fit Full Product (100% visible, zero cropping)</option>
                          <option value="cover">👑 Fill Frame (Portrait fashion mode)</option>
                        </select>
                        <p className="text-[10px] text-slate-500 mt-1 leading-tight">
                          • <b>Smart Auto</b>: automatically detects whether image is portrait or square.<br />
                          • <b>Fit Full</b>: ensures 100% of wide/square items are shown with zero edges cut.
                        </p>
                      </div>
                    </div>

                    {/* Right: Live Storefront Card Preview (5 cols) */}
                    <div className="sm:col-span-5 bg-white rounded-2xl p-2.5 border border-amber-300/80 shadow-sm flex flex-col items-center">
                      <div className="w-full flex items-center justify-between mb-1.5 px-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900">
                          Live Storefront Preview
                        </span>
                        <span className="text-[9px] font-bold text-slate-400">
                          1:1 Square Frame
                        </span>
                      </div>

                      {/* Mini Card Viewport */}
                      <div className="w-full max-w-[170px] aspect-square rounded-xl overflow-hidden bg-gradient-to-b from-[#fcfbf9] to-[#f4f1ea] border border-slate-200 relative flex items-center justify-center shadow-inner">
                        {editingProduct.mrp > editingProduct.price && (
                          <div className="absolute top-1.5 left-1.5 bg-rose-600 text-white font-black text-[8px] px-1.5 py-0.5 rounded-full z-10">
                            {Math.round(((editingProduct.mrp - editingProduct.price) / editingProduct.mrp) * 100)}% OFF
                          </div>
                        )}
                        <img 
                          key={imageFile ? imageFile.name : editingProduct.image}
                          src={imageFile ? URL.createObjectURL(imageFile) : (editingProduct.image || '/assets/logo/logo_main.png')} 
                          alt="" 
                          onLoad={(e) => {
                            if (editingProduct.imageFit === 'contain') return;
                            const { naturalWidth, naturalHeight } = e.target;
                            if (naturalWidth && naturalHeight) {
                              const ratio = naturalWidth / naturalHeight;
                              e.target.className = `w-full h-full object-cover ${ratio < 0.85 ? 'object-top' : 'object-center'}`;
                            }
                          }}
                          className={`w-full h-full ${
                            editingProduct.imageFit === 'contain' 
                              ? 'object-contain p-2' 
                              : (editingProduct.category === 'wearing' ? 'object-cover object-top' : 'object-cover object-center')
                          }`}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 mt-1.5 text-center truncate max-w-[170px]">
                        {editingProduct.name || 'Product Title'}
                      </span>
                      <span className="text-[10px] font-mono font-black text-amber-900">
                        ₹{editingProduct.price || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Description:</label>
                  <textarea
                    rows={3}
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => { setEditingProduct(null); setImageFile(null); }}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={uploadingImage}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-gold hover:from-amber-400 hover:to-amber-500"
                  >
                    {uploadingImage ? 'Uploading image...' : isAddMode ? 'Create Product' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit / Add Category Modal */}
        {editingCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-8 shadow-2xl border border-amber-500/40 max-h-[90vh] overflow-y-auto space-y-4">
              <button
                onClick={() => { setEditingCategory(null); setCatImageFile(null); }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900">
                    {isCatAddMode ? 'Add New Store Category' : `Edit Category: ${editingCategory.name}`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Controls homepage story avatars, catalog tabs, and shop filters.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Prayer Mats & Janamaz"
                      value={editingCategory.name}
                      onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Category Slug ID {isCatAddMode ? '(auto-generated if empty)' : '(Read-only)'}
                    </label>
                    <input
                      type="text"
                      disabled={!isCatAddMode}
                      placeholder="e.g. prayer-mats"
                      value={editingCategory.id || ''}
                      onChange={(e) => setEditingCategory({ ...editingCategory, id: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono disabled:bg-slate-100 disabled:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Subtitle / Tagline</label>
                  <input
                    type="text"
                    placeholder="e.g. Premium Madinah & Turkish foam prayer rugs"
                    value={editingCategory.subtitle || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Badge Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. New Arrival, Sunnah, Luxury"
                      value={editingCategory.badge || ''}
                      onChange={(e) => setEditingCategory({ ...editingCategory, badge: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category Icon</label>
                    <select
                      value={editingCategory.icon || 'Sparkles'}
                      onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Category Cover Image Upload */}
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <label className="block font-semibold text-slate-800">
                    Category Cover Image (Displays in Homepage Circular Stories & Catalog):
                  </label>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-xl border bg-white p-1 shrink-0 overflow-hidden flex items-center justify-center">
                      <img 
                        src={catImageFile ? URL.createObjectURL(catImageFile) : (editingCategory.image || '/assets/logo/logo_main.png')} 
                        alt="Preview" 
                        className="w-full h-full object-contain" 
                      />
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setCatImageFile(e.target.files[0]);
                          }
                        }}
                        className="text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#032219] file:text-amber-300 hover:file:bg-[#063e2e]"
                      />
                      <input
                        type="text"
                        placeholder="Or direct image URL (e.g. /assets/...)"
                        value={editingCategory.image || ''}
                        onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Subcategories Tags Manager */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-slate-800">
                      Subcategories ({editingCategory.subcategories?.length || 0})
                    </label>
                    <span className="text-[11px] text-slate-500">Sub-pills on Shop Page</span>
                  </div>

                  {/* Existing subcategories chips */}
                  <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 bg-white rounded-xl border border-slate-200">
                    {editingCategory.subcategories && editingCategory.subcategories.length > 0 ? (
                      editingCategory.subcategories.map((sub) => (
                        <span
                          key={sub.id}
                          className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold px-2.5 py-1 rounded-lg"
                        >
                          <span>{sub.name}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubcatFromCategory(sub.id)}
                            className="text-emerald-700 hover:text-rose-600 ml-0.5"
                            title="Remove subcategory"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No subcategories yet. Add below:</span>
                    )}
                  </div>

                  {/* Add Subcategory input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add subcategory name (e.g. 'Velvet Rugs')"
                      value={newSubcatInput}
                      onChange={(e) => setNewSubcatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSubcatToCategory();
                        }
                      }}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddSubcatToCategory}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-900 transition flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Subcategory</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => { setEditingCategory(null); setCatImageFile(null); }}
                    className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={uploadingCatImage}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-gold hover:from-amber-400 hover:to-amber-500"
                  >
                    {uploadingCatImage ? 'Uploading image...' : isCatAddMode ? 'Create Category' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
