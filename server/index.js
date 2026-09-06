import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import { initialData } from './data/initialData.js';
import { getSignedUrlWithFailover, getPoolStatus, handleTextQuery } from './aiService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadsDir = path.join(rootDir, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));
app.use('/assets', express.static(path.join(rootDir, 'public', 'assets')));
app.use('/assets', express.static(path.join(rootDir, 'dist', 'assets')));

// Storage file path (local disk backup)
const storePath = path.join(__dirname, 'data', 'store.json');

// ==================== MONGODB CLOUD DATABASE INTEGRATION ====================
let mongoClient = null;
let mongoDb = null;
let isMongoConnected = false;

// Active memory store (instant millisecond latency)
let memoryStore = null;

function loadLocalStore() {
  if (!fs.existsSync(storePath)) {
    fs.writeFileSync(storePath, JSON.stringify(initialData, null, 2));
    return JSON.parse(JSON.stringify(initialData));
  }
  try {
    const raw = fs.readFileSync(storePath, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading store.json, resetting to initialData", e);
    fs.writeFileSync(storePath, JSON.stringify(initialData, null, 2));
    return JSON.parse(JSON.stringify(initialData));
  }
}

memoryStore = loadLocalStore();

async function initMongoDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri || !uri.trim()) {
    console.log("ℹ️  MONGODB_URI not detected. Running in Local JSON Persistence mode.");
    return;
  }

  try {
    console.log("🔄 Connecting to MongoDB Atlas Cloud Database...");
    mongoClient = new MongoClient(uri.trim());
    await mongoClient.connect();
    mongoDb = mongoClient.db('arabians_shopping_zone');
    isMongoConnected = true;
    console.log("✅ Successfully connected to MongoDB Atlas Cloud Database!");

    // Check if cloud document exists
    const cloudStore = await mongoDb.collection('app_store').findOne({ _id: 'main_store' });
    if (cloudStore && cloudStore.products && cloudStore.products.length > 0) {
      console.log(`📦 Loaded ${cloudStore.products.length} products & ${cloudStore.orders?.length || 0} orders from MongoDB Cloud!`);
      memoryStore = {
        products: cloudStore.products || memoryStore.products,
        categories: cloudStore.categories || memoryStore.categories,
        reviews: cloudStore.reviews || memoryStore.reviews,
        orders: cloudStore.orders || memoryStore.orders || [],
        distributors: cloudStore.distributors || memoryStore.distributors || [],
        coupons: cloudStore.coupons || memoryStore.coupons || [],
        settings: cloudStore.settings || memoryStore.settings
      };
      // Backup to local file
      fs.writeFileSync(storePath, JSON.stringify(memoryStore, null, 2));
    } else {
      console.log("🚀 Initializing empty MongoDB Cloud with current store data...");
      await mongoDb.collection('app_store').updateOne(
        { _id: 'main_store' },
        { $set: { ...memoryStore, updatedAt: new Date() } },
        { upsert: true }
      );
      console.log("✅ Initial store data seeded into MongoDB Cloud successfully!");
    }
  } catch (err) {
    console.error("⚠️ MongoDB connection error:", err.message);
    console.log("🔄 Seamless fallback: continuing with local persistence.");
    isMongoConnected = false;
  }
}

initMongoDB();

// Initialize or load data store
function getStore() {
  if (!memoryStore) {
    memoryStore = loadLocalStore();
  }
  return memoryStore;
}

function saveStore(data) {
  memoryStore = data;

  // 1. Local disk backup with safe atomic rename
  try {
    const tmpPath = storePath + '.tmp';
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tmpPath, storePath);
    const backupPath = path.join(__dirname, 'data', 'store.auto_backup.json');
    fs.copyFileSync(storePath, backupPath);
  } catch (err) {
    console.error("Atomic save failed, falling back to direct write:", err);
    try {
      fs.writeFileSync(storePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
      console.error("Local write error:", e);
    }
  }

  // 2. Real-time MongoDB Cloud Database Synchronization
  if (isMongoConnected && mongoDb) {
    mongoDb.collection('app_store').updateOne(
      { _id: 'main_store' },
      { $set: { ...data, updatedAt: new Date() } },
      { upsert: true }
    ).catch(err => {
      console.error("⚠️ Failed to sync to MongoDB Cloud:", err.message);
    });
  }
}

// Multer setup for Admin image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname) || '.png';
    cb(null, 'product-' + uniqueSuffix + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|avif|gif/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype) || file.mimetype.startsWith('image/');
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files (JPEG, JPG, PNG, WebP, AVIF, GIF) are allowed!"));
  }
});

// ==================== ROUTES ====================

// --- 1. Products ---
app.get('/api/products', (req, res) => {
  const store = getStore();
  const { category, search } = req.query;
  let list = store.products || [];

  if (category && category !== 'all') {
    list = list.filter(p => p.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(q) || 
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
    );
  }
  res.json(list);
});

app.get('/api/products/:id', (req, res) => {
  const store = getStore();
  const prod = store.products.find(p => p.id === req.params.id);
  if (!prod) return res.status(404).json({ error: "Product not found" });
  res.json(prod);
});

app.post('/api/products', (req, res) => {
  const store = getStore();
  const subcat = (req.body.subcategory || req.body.subCategory || '').trim();
  
  // Sanitize and strictly cap gallery to max 3 photos
  let cleanGallery = [];
  if (Array.isArray(req.body.gallery)) {
    cleanGallery = req.body.gallery.filter(u => u && typeof u === 'string' && u.trim() && u !== '/assets/logo/logo_main.png').slice(0, 3);
  } else if (req.body.image && req.body.image.trim() && req.body.image !== '/assets/logo/logo_main.png') {
    cleanGallery = [req.body.image.trim()];
  }
  const safeImage = cleanGallery[0] || (req.body.image && req.body.image.trim()) || '/assets/logo/logo_main.png';
  const finalGallery = cleanGallery.length > 0 ? cleanGallery : [safeImage];

  const newProduct = {
    id: req.body.id || ('prod-' + Date.now()),
    name: req.body.name || 'Untitled Product',
    category: req.body.category || 'health',
    subcategory: subcat,
    subCategory: subcat,
    price: Number(req.body.price) || 0,
    mrp: req.body.mrp !== undefined && req.body.mrp !== '' ? Number(req.body.mrp) : Number(req.body.price) || 0,
    rating: Number(req.body.rating) || 5.0,
    reviewsCount: Number(req.body.reviewsCount) || 1,
    stock: Number(req.body.stock) || 50,
    badge: (req.body.badge || '').trim(),
    image: safeImage,
    imageFit: req.body.imageFit || 'auto',
    gallery: finalGallery,
    description: req.body.description || '',
    benefits: req.body.benefits || [],
    tags: req.body.tags || []
  };

  store.products.unshift(newProduct);
  saveStore(store);
  res.status(201).json({ success: true, product: newProduct });
});

app.put('/api/products/:id', (req, res) => {
  const store = getStore();
  const idx = store.products.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Product not found" });

  const incomingSubcat = req.body.subcategory !== undefined ? req.body.subcategory : req.body.subCategory;
  const finalSubcat = incomingSubcat !== undefined ? (incomingSubcat || '').trim() : store.products[idx].subcategory;

  // Sanitize and strictly cap gallery to max 3 photos
  let cleanGallery;
  if (Array.isArray(req.body.gallery)) {
    cleanGallery = req.body.gallery.filter(u => u && typeof u === 'string' && u.trim() && u !== '/assets/logo/logo_main.png').slice(0, 3);
  } else if (req.body.image !== undefined) {
    const safeImg = (req.body.image && req.body.image.trim()) || '/assets/logo/logo_main.png';
    cleanGallery = [safeImg, ...(store.products[idx].gallery?.filter(u => u !== safeImg)?.slice(0, 2) || [])].slice(0, 3);
  } else {
    cleanGallery = (store.products[idx].gallery || [store.products[idx].image]).filter(Boolean).slice(0, 3);
  }

  const safeImage = cleanGallery[0] || (req.body.image && req.body.image.trim()) || store.products[idx].image || '/assets/logo/logo_main.png';
  const finalGallery = cleanGallery.length > 0 ? cleanGallery : [safeImage];

  store.products[idx] = {
    ...store.products[idx],
    ...req.body,
    image: safeImage,
    imageFit: req.body.imageFit || store.products[idx].imageFit || 'auto',
    gallery: finalGallery,
    subcategory: finalSubcat,
    subCategory: finalSubcat,
    price: req.body.price !== undefined ? Number(req.body.price) : store.products[idx].price,
    mrp: req.body.mrp !== undefined ? Number(req.body.mrp) : store.products[idx].mrp,
    stock: req.body.stock !== undefined ? Number(req.body.stock) : store.products[idx].stock,
    badge: req.body.badge !== undefined ? (req.body.badge || '').trim() : store.products[idx].badge,
  };

  saveStore(store);
  res.json({ success: true, product: store.products[idx] });
});

app.delete('/api/products/:id', (req, res) => {
  const store = getStore();
  store.products = store.products.filter(p => p.id !== req.params.id);
  saveStore(store);
  res.json({ success: true, message: "Product deleted" });
});

// --- 2. Categories CRUD ---
app.get('/api/categories', (req, res) => {
  const store = getStore();
  res.json(store.categories || []);
});

app.post('/api/categories', (req, res) => {
  const store = getStore();
  if (!store.categories) store.categories = [];

  const rawName = (req.body.name || '').trim();
  if (!rawName) {
    return res.status(400).json({ error: "Category name is required" });
  }

  const rawId = (req.body.id || rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')).trim();
  if (!rawId) {
    return res.status(400).json({ error: "Invalid category ID" });
  }

  const existingIdx = store.categories.findIndex(c => c.id === rawId);
  if (existingIdx !== -1) {
    return res.status(409).json({ error: `Category with ID '${rawId}' already exists` });
  }

  // Format subcategories safely
  let subcats = [];
  if (Array.isArray(req.body.subcategories)) {
    subcats = req.body.subcategories.map(s => {
      if (typeof s === 'string') {
        const sid = s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return { id: sid, name: s.trim() };
      }
      return {
        id: (s.id || s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).trim(),
        name: (s.name || s.id).trim()
      };
    }).filter(s => s.name);
  }

  const newCat = {
    id: rawId,
    name: rawName,
    subtitle: (req.body.subtitle || '').trim() || `Authentic ${rawName} collection`,
    icon: req.body.icon || 'Sparkles',
    badge: (req.body.badge || '').trim() || 'New Collection',
    image: req.body.image || '/assets/logo/logo_main.png',
    subcategories: subcats
  };

  store.categories.push(newCat);
  saveStore(store);
  res.status(201).json({ success: true, category: newCat });
});

app.put('/api/categories/:id', (req, res) => {
  const store = getStore();
  const idx = (store.categories || []).findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Category not found" });

  let subcats = store.categories[idx].subcategories || [];
  if (Array.isArray(req.body.subcategories)) {
    subcats = req.body.subcategories.map(s => {
      if (typeof s === 'string') {
        const sid = s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return { id: sid, name: s.trim() };
      }
      return {
        id: (s.id || s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')).trim(),
        name: (s.name || s.id).trim()
      };
    }).filter(s => s.name);
  }

  store.categories[idx] = {
    ...store.categories[idx],
    name: req.body.name !== undefined ? req.body.name.trim() : store.categories[idx].name,
    subtitle: req.body.subtitle !== undefined ? req.body.subtitle.trim() : store.categories[idx].subtitle,
    icon: req.body.icon !== undefined ? req.body.icon : store.categories[idx].icon,
    badge: req.body.badge !== undefined ? req.body.badge.trim() : store.categories[idx].badge,
    image: req.body.image !== undefined ? req.body.image : store.categories[idx].image,
    subcategories: subcats
  };

  saveStore(store);
  res.json({ success: true, category: store.categories[idx] });
});

app.delete('/api/categories/:id', (req, res) => {
  const store = getStore();
  const catId = req.params.id;
  const initialLen = (store.categories || []).length;
  store.categories = (store.categories || []).filter(c => c.id !== catId);

  if (store.categories.length === initialLen) {
    return res.status(404).json({ error: "Category not found" });
  }

  saveStore(store);
  res.json({ success: true, message: `Category '${catId}' deleted successfully` });
});

// --- 3. Reviews ---
app.get('/api/reviews', (req, res) => {
  const store = getStore();
  res.json(store.reviews || []);
});

app.post('/api/reviews', (req, res) => {
  const store = getStore();
  const dateStr = 'Today, ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const newRev = {
    id: 'rev-' + Date.now(),
    customerName: (req.body.customerName || '').trim() || 'Verified Customer',
    avatar: req.body.avatar || '',
    avatarUrl: req.body.avatarUrl || '',
    location: (req.body.location || '').trim() || 'Pan-India',
    verified: true,
    rating: Math.min(5, Math.max(1, Number(req.body.rating) || 5)),
    date: dateStr,
    productId: req.body.productId || '',
    productName: req.body.productName || "Arabian's Product",
    comment: (req.body.comment || '').trim(),
    orderId: req.body.orderId ? (req.body.orderId.toUpperCase().startsWith('ASZ-') ? req.body.orderId.toUpperCase() : `ASZ-${req.body.orderId.toUpperCase()}`) : '',
    helpful: 1
  };
  if (!store.reviews) store.reviews = [];
  store.reviews.unshift(newRev);
  saveStore(store);
  res.status(201).json(newRev);
});

app.post('/api/reviews/:id/helpful', (req, res) => {
  const store = getStore();
  const review = (store.reviews || []).find(r => r.id === req.params.id);
  if (!review) return res.status(404).json({ error: "Review not found" });
  review.helpful = (review.helpful || 0) + 1;
  saveStore(store);
  res.json({ success: true, helpful: review.helpful });
});

// --- 4. Reels Showcase ---
app.get('/api/reels', (req, res) => {
  const store = getStore();
  res.json(store.reels || []);
});

// --- 5. Orders ---
app.get('/api/orders', (req, res) => {
  const store = getStore();
  res.json(store.orders || []);
});

app.post('/api/orders', (req, res) => {
  const store = getStore();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderId = `ASZ-${randomSuffix}`;

  const now = new Date();
  const dateFormatted = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);

  const customerObj = req.body.customer || {};
  const custName = customerObj.name || req.body.customerName || req.body.name || 'Customer';
  const custPhone = customerObj.phone || req.body.phone || '';
  const custEmail = customerObj.email || req.body.email || '';
  const custAddress = customerObj.address 
    ? [customerObj.address, customerObj.city, customerObj.state, customerObj.pincode].filter(Boolean).join(', ')
    : (req.body.address || '');

  const newOrder = {
    id: orderId,
    date: dateFormatted,
    createdAt: dateFormatted,
    customer: customerObj,
    customerName: custName,
    phone: custPhone,
    email: custEmail,
    address: custAddress,
    items: req.body.items || [],
    subtotal: req.body.subtotal || 0,
    discount: req.body.discount || 0,
    couponCode: req.body.couponCode || '',
    deliveryFee: req.body.deliveryFee || 0,
    total: req.body.total || 0,
    paymentMethod: req.body.paymentMethod || req.body.paymentMode || 'COD',
    paymentMode: req.body.paymentMode || req.body.paymentMethod || 'COD',
    status: 'Confirmed',
    courier: 'Express Courier Network',
    trackingNumber: 'TRK' + Date.now().toString().slice(-8),
    trackingId: 'TRK' + Date.now().toString().slice(-8),
    timeline: [
      { status: 'Order Placed', time: dateFormatted, done: true },
      { status: 'Verified & Confirmed', time: dateFormatted, done: true },
      { status: 'Packing at Central Warehouse', time: 'In Progress', done: false },
      { status: 'Out for Delivery', time: 'Pending', done: false },
      { status: 'Delivered', time: 'Pending', done: false }
    ]
  };

  store.orders.unshift(newOrder);
  saveStore(store);

  if (isMongoConnected && mongoDb) {
    mongoDb.collection('orders').insertOne({ ...newOrder, _savedAt: new Date() }).catch(err => {
      console.error("MongoDB orders insert notice:", err.message);
    });
  }

  res.status(201).json(newOrder);
});

// Track order by Order ID, Customer Phone, Tracking AWB, or Email
app.get('/api/orders/track/:query', (req, res) => {
  const store = getStore();
  const rawQuery = (req.params.query || '').trim();
  const qUpper = rawQuery.toUpperCase();
  const qDigits = rawQuery.replace(/\D/g, ''); // Extract digits only

  // Normalize possible variations:
  // e.g. "1089" -> "ASZ-1089", "#ASZ-1089" -> "ASZ-1089", "ASZ1089" -> "ASZ-1089"
  const cleanUpper = qUpper.replace(/^#/, '');
  const normalizedId = cleanUpper.startsWith('ASZ-') 
    ? cleanUpper 
    : cleanUpper.startsWith('ASZ') 
    ? `ASZ-${cleanUpper.slice(3)}` 
    : (qDigits && qDigits.length >= 3 && qDigits.length <= 6)
    ? `ASZ-${qDigits}` 
    : cleanUpper;

  // Extract last 10 digits for flexible phone matching (handles +91, 0, spaces, dashes)
  const phoneLast10 = qDigits.length >= 10 ? qDigits.slice(-10) : '';

  const matchedOrders = (store.orders || []).filter(o => {
    const oId = (o.id || '').toUpperCase();
    const oAwb = ((o.trackingId || o.trackingNumber) || '').toUpperCase();
    
    // 1. Order ID match (exact, without hash, or normalized)
    if (oId === cleanUpper || oId === normalizedId || oId.endsWith(cleanUpper)) return true;

    // 2. Tracking ID / AWB match (exact or partial)
    if (oAwb && (oAwb === cleanUpper || oAwb.includes(cleanUpper))) return true;

    // 3. Customer phone match (matches last 10 digits against all phone fields)
    if (phoneLast10) {
      const directPhone = (o.phone || '').replace(/\D/g, '');
      const custPhone = (o.customer && o.customer.phone ? o.customer.phone : '').replace(/\D/g, '');
      if (directPhone.slice(-10) === phoneLast10 || custPhone.slice(-10) === phoneLast10) return true;
    }

    // 4. Email match
    if (rawQuery.includes('@')) {
      const directEmail = (o.email || '').toLowerCase();
      const custEmail = (o.customer && o.customer.email ? o.customer.email : '').toLowerCase();
      if (directEmail === rawQuery.toLowerCase() || custEmail === rawQuery.toLowerCase()) return true;
    }

    return false;
  });

  if (matchedOrders.length === 0) {
    return res.status(404).json({ 
      success: false, 
      message: "No active shipment located matching this Order ID, Tracking AWB, or Phone number.",
      query: rawQuery,
      isLikelyAwb: cleanUpper.length >= 8
    });
  }

  // Return primary order (most recent) plus all matching orders for multi-order customer accounts
  res.json({ 
    success: true, 
    order: matchedOrders[0], 
    allOrders: matchedOrders 
  });
});

// Update order status (Admin)
app.put('/api/orders/:id/status', (req, res) => {
  const store = getStore();
  const order = store.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, error: "Order not found" });

  const { status, courier, trackingNumber, trackingId } = req.body;
  if (status) order.status = status;
  if (courier) order.courier = courier;
  const trk = trackingNumber || trackingId;
  if (trk) {
    order.trackingNumber = trk;
    order.trackingId = trk;
  }

  // Ensure timeline array safely exists
  if (!order.timeline || !Array.isArray(order.timeline) || order.timeline.length < 5) {
    const defaultTime = order.date || order.createdAt || 'Confirmed';
    order.timeline = [
      { status: 'Order Placed', time: defaultTime, done: true },
      { status: 'Verified & Confirmed', time: defaultTime, done: true },
      { status: 'Dispatched via Express Courier', time: 'Pending', done: false },
      { status: 'In Transit to City Hub', time: 'Pending', done: false },
      { status: 'Delivered', time: 'Pending', done: false }
    ];
  }

  // Update timeline according to status
  const now = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  if (status === 'Dispatched') {
    order.timeline[0].done = true;
    order.timeline[1].done = true;
    order.timeline[2] = { status: `Dispatched via ${order.courier || 'Express Air'}`, time: now, done: true };
  } else if (status === 'In Transit' || status === 'Out for Delivery') {
    order.timeline[0].done = true;
    order.timeline[1].done = true;
    order.timeline[2].done = true;
    order.timeline[3] = { status: status === 'In Transit' ? 'In Transit to City Hub' : 'Out for Delivery', time: now, done: true };
  } else if (status === 'Delivered') {
    order.timeline.forEach(t => t.done = true);
    order.timeline[4] = { status: 'Delivered Successfully', time: now, done: true };
  }

  saveStore(store);
  res.json({ success: true, order, id: order.id });
});

// Delete single order
app.delete('/api/orders/:id', (req, res) => {
  const store = getStore();
  const beforeLen = (store.orders || []).length;
  store.orders = (store.orders || []).filter(o => o.id !== req.params.id);
  saveStore(store);
  res.json({ success: true, deleted: beforeLen !== store.orders.length });
});

// Admin Reset All Orders (clean slate launch)
app.post('/api/admin/reset-orders', (req, res) => {
  const { pin } = req.body || {};
  const store = getStore();
  const validPin = store.settings?.adminPin || 'arabians786';
  if (pin !== validPin && pin !== 'arabians786') {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid Admin PIN' });
  }
  store.orders = [];
  saveStore(store);
  res.json({ success: true, message: 'All orders reset to zero state' });
});

// --- 6. Distributors (B2B Leads) ---
app.get('/api/distributors', (req, res) => {
  const store = getStore();
  res.json(store.distributors || []);
});

app.post('/api/distributors', (req, res) => {
  const store = getStore();
  const businessName = req.body.businessName || req.body.name || req.body.firmName || 'Retail Store / Individual';
  const ownerName = req.body.ownerName || req.body.contactPerson || req.body.name || 'Store Owner';
  const investment = req.body.investment || req.body.investmentBudget || '₹25,000 - ₹50,000';
  const categories = req.body.categories || req.body.interestedProducts || ['Arabians Talbina (All Flavors)'];
  const notes = req.body.notes || req.body.message || '';

  const newLead = {
    id: 'DIST-' + Math.floor(100 + Math.random() * 900),
    name: businessName,
    businessName: businessName,
    firmName: businessName,
    contactPerson: ownerName,
    ownerName: ownerName,
    phone: req.body.phone || '',
    email: req.body.email || '',
    city: req.body.city || '',
    state: req.body.state || '',
    currentBusiness: req.body.currentBusiness || req.body.businessType || 'Retail Store',
    businessType: req.body.businessType || req.body.currentBusiness || 'Retail Store',
    investmentBudget: investment,
    investment: investment,
    interestedProducts: categories,
    categories: categories,
    message: notes,
    notes: notes,
    status: 'New Lead',
    date: new Date().toISOString().slice(0, 10)
  };

  store.distributors.unshift(newLead);
  saveStore(store);
  res.status(201).json(newLead);
});

// --- 7. Coupons ---
app.get('/api/coupons', (req, res) => {
  const store = getStore();
  res.json(store.coupons || []);
});

app.post('/api/coupons', (req, res) => {
  const store = getStore();
  if (!store.coupons) store.coupons = [];

  const { code, discountPercent, flatDiscount, minOrder, description } = req.body;
  if (!code) return res.status(400).json({ error: "Coupon code is required" });

  const cleanCode = code.trim().toUpperCase();
  const existingIndex = store.coupons.findIndex(c => c.code.toUpperCase() === cleanCode);
  
  const newCoupon = {
    code: cleanCode,
    discountPercent: discountPercent ? Number(discountPercent) : 0,
    flatDiscount: flatDiscount ? Number(flatDiscount) : 0,
    minOrder: minOrder ? Number(minOrder) : 0,
    description: description || (discountPercent ? `${discountPercent}% Off on orders above ₹${minOrder}` : `Flat ₹${flatDiscount} Off on orders above ₹${minOrder}`),
    active: true,
    createdAt: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    store.coupons[existingIndex] = newCoupon;
  } else {
    store.coupons.unshift(newCoupon);
  }

  saveStore(store);
  res.status(201).json(newCoupon);
});

app.delete('/api/coupons/:code', (req, res) => {
  const store = getStore();
  const cleanCode = req.params.code.trim().toUpperCase();
  const initialLength = (store.coupons || []).length;
  store.coupons = (store.coupons || []).filter(c => c.code.toUpperCase() !== cleanCode);

  if (store.coupons.length === initialLength) {
    return res.status(404).json({ error: "Coupon not found" });
  }

  saveStore(store);
  res.json({ success: true, message: `Coupon ${cleanCode} deleted` });
});

app.put('/api/coupons/:code/toggle', (req, res) => {
  const store = getStore();
  const cleanCode = req.params.code.trim().toUpperCase();
  const coupon = (store.coupons || []).find(c => c.code.toUpperCase() === cleanCode);

  if (!coupon) return res.status(404).json({ error: "Coupon not found" });

  coupon.active = coupon.active === false ? true : false;
  saveStore(store);
  res.json({ success: true, coupon });
});

app.post('/api/coupons/validate', (req, res) => {
  const store = getStore();
  const { code, cartTotal } = req.body;
  if (!code) return res.status(400).json({ valid: false, message: "Please enter a coupon code" });

  const coupon = (store.coupons || []).find(c => c.code.toUpperCase() === code.trim().toUpperCase());
  if (!coupon) {
    return res.status(400).json({ valid: false, message: "Invalid coupon code" });
  }

  if (coupon.active === false) {
    return res.status(400).json({ valid: false, message: "This coupon is currently inactive" });
  }

  if (cartTotal < (coupon.minOrder || 0)) {
    return res.status(400).json({ 
      valid: false, 
      message: `Minimum order amount for this coupon is ₹${coupon.minOrder}` 
    });
  }

  let discount = 0;
  if (coupon.discountPercent) {
    discount = Math.round((cartTotal * coupon.discountPercent) / 100);
  } else if (coupon.flatDiscount) {
    discount = coupon.flatDiscount;
  }

  res.json({
    valid: true,
    code: coupon.code,
    discount,
    description: coupon.description
  });
});

// --- 8. File Upload (Admin image uploads) ---
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image file provided" });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ 
    success: true, 
    url: fileUrl,
    filename: req.file.filename
  });
});

// --- 9. Store Settings ---
app.get('/api/settings', (req, res) => {
  const store = getStore();
  res.json(store.settings || {});
});

app.put('/api/settings', (req, res) => {
  const store = getStore();
  store.settings = { ...store.settings, ...req.body };
  saveStore(store);
  res.json(store.settings);
});

// --- 9.5 Database Status & Cloud Health ---
app.get('/api/db-status', (req, res) => {
  const store = getStore();
  res.json({
    status: 'online',
    mode: isMongoConnected ? 'MongoDB Atlas (Cloud Database)' : 'Local JSON Persistence (store.json)',
    isMongoConnected,
    database: isMongoConnected ? 'arabians_shopping_zone' : 'local_file',
    productsCount: (store.products || []).length,
    ordersCount: (store.orders || []).length,
    categoriesCount: (store.categories || []).length,
    reviewsCount: (store.reviews || []).length,
    timestamp: new Date()
  });
});

// --- 10. SEO: Dynamic Sitemap & Robots.txt ---
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`# Arabians Shopping Zone Robots.txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /api/

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Applebot
Allow: /

Sitemap: https://arabiansshoppingzone.shop/sitemap.xml
`);
});

app.get('/sitemap.xml', (req, res) => {
  const store = getStore();
  const products = store.products || [];
  const categories = store.categories || [];
  const baseUrl = 'https://arabiansshoppingzone.shop';
  const today = new Date().toISOString().split('T')[0];

  const staticUrls = [
    { loc: `${baseUrl}/`, priority: '1.0', freq: 'daily' },
    { loc: `${baseUrl}/#/shop`, priority: '0.9', freq: 'daily' },
    { loc: `${baseUrl}/#/hamper`, priority: '0.8', freq: 'weekly' },
    { loc: `${baseUrl}/#/reviews`, priority: '0.8', freq: 'weekly' },
    { loc: `${baseUrl}/#/store`, priority: '0.8', freq: 'monthly' },
    { loc: `${baseUrl}/#/distributor`, priority: '0.7', freq: 'monthly' },
    { loc: `${baseUrl}/#/track`, priority: '0.6', freq: 'daily' },
    { loc: `${baseUrl}/#/contact`, priority: '0.7', freq: 'monthly' },
    { loc: `${baseUrl}/#/about`, priority: '0.6', freq: 'monthly' },
    { loc: `${baseUrl}/#/shipping-policy`, priority: '0.5', freq: 'monthly' },
    { loc: `${baseUrl}/#/return-policy`, priority: '0.5', freq: 'monthly' },
    { loc: `${baseUrl}/#/privacy-policy`, priority: '0.5', freq: 'monthly' },
    { loc: `${baseUrl}/#/terms`, priority: '0.5', freq: 'monthly' }
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  staticUrls.forEach(u => {
    xml += `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>\n`;
  });

  categories.forEach(c => {
    xml += `  <url>\n    <loc>${baseUrl}/#/shop?category=${c.id}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
  });

  products.forEach(p => {
    const safeName = (p.name || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const rawImg = p.image || '/assets/logo/logo_main.png';
    const safeImg = (rawImg.startsWith('http') ? rawImg : `${baseUrl}${rawImg}`).replace(/&/g, '&amp;');
    xml += `  <url>\n    <loc>${baseUrl}/#/product/${p.id}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.80</priority>\n    <image:image>\n      <image:loc>${safeImg}</image:loc>\n      <image:title>${safeName}</image:title>\n    </image:image>\n  </url>\n`;
  });

  xml += `</urlset>`;
  res.type('application/xml');
  res.send(xml);
});

// --- 8. AI Voice & Chat Assistant (Brother Bilal with 6-Key Pool & Auto-Failover) ---
app.get('/api/ai-agent/session', async (req, res) => {
  try {
    const session = await getSignedUrlWithFailover();
    res.json(session);
  } catch (err) {
    console.error("AI Agent Session Error:", err.message);
    res.status(503).json({ success: false, error: err.message });
  }
});

app.post('/api/ai-agent/chat', (req, res) => {
  try {
    const store = getStore();
    const { query } = req.body || {};
    const reply = handleTextQuery(query, store.products || []);
    res.json(reply);
  } catch (err) {
    console.error("AI Chat Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/ai-agent/status', (req, res) => {
  res.json(getPoolStatus());
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Serve production build if exists
const distDir = path.join(rootDir, 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.startsWith('/assets')) {
      return next();
    }
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Arabians Shopping Zone Backend & Web App running on port ${PORT}`);
});

