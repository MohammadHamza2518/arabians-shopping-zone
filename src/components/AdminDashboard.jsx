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
  Sliders
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

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
      setPinError('Invalid Admin Passcode. Try arabians786');
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

      const payload = {
        ...editingProduct,
        image: finalImageUrl,
        gallery: [finalImageUrl]
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
                <div className="text-[11px] text-slate-400">
                  Default PIN: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-bold">arabians786</code>
                </div>
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

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                    <select
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Badge Tag:</label>
                    <input
                      type="text"
                      placeholder="e.g. Bestseller, Sunnah Special"
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

                {/* Direct Image Upload */}
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <label className="block font-semibold text-slate-800">
                    Product Image (Upload from phone/PC or use existing URL):
                  </label>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl border bg-white p-1 shrink-0 overflow-hidden flex items-center justify-center">
                      <img 
                        src={imageFile ? URL.createObjectURL(imageFile) : editingProduct.image} 
                        alt="" 
                        className="w-full h-full object-contain" 
                      />
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setImageFile(e.target.files[0]);
                          }
                        }}
                        className="text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#032219] file:text-amber-300 hover:file:bg-[#063e2e]"
                      />
                      <input
                        type="text"
                        placeholder="Or paste direct image URL"
                        value={editingProduct.image || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300"
                      />
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

      </div>
    </div>
  );
}
