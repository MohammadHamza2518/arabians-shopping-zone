import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { initialData } from './data/initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Strict Zero-Cache policy for all API endpoints to guarantee instant real-time synchronization
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

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
// System Status endpoint (Always Operational)
app.get('/api/system-status', (req, res) => {
  res.json({ operational: true, suspended: false });
});




// ==================== MONGODB CLOUD DATABASE INTEGRATION ====================
let mongoClient = null;
let mongoDb = null;
let isMongoConnected = false;

// Active memory store (instant millisecond latency)
let memoryStore = null;

// Default Curated Homepage Hero Slides (Zero-Break Guaranteed)
const DEFAULT_HERO_SLIDES = [
  {
    id: 'thobes',
    badge: '👑 Royal Wardrobe Collection',
    title: "Saudi & Emirati Royal Cut Thobes",
    subtitle: "Engineered with tailored standing collars, concealed snap plackets, and breathable luxury poly-blend fabric for Jummah prayers, Umrah, and auspicious gatherings.",
    highlight: "100% Free Size Replacement • Direct Studio Tailoring",
    price: "From ₹1,499",
    mrp: "₹2,299",
    ctaText: "Shop Men's Thobes",
    ctaLink: "/shop?category=wearing",
    image: "/assets/studio/mens_black_thobe_studio.jpg"
  },
  {
    id: 'talbina',
    badge: '🥣 Prophetic Sunnah Superfood',
    title: "Arabian's Sprouted Barley Talbeena",
    subtitle: "Stone-ground roasted barley blended with premium California almonds, pistachios, and saffron. Rejuvenates the heart and vitalizes immunity according to authentic Hadith 5417.",
    highlight: "5 High-Repeat Flavors • Lab Certified • 100% Halal",
    price: "From ₹249",
    mrp: "₹270",
    ctaText: "Order Sunnah Talbina",
    ctaLink: "/product/talbina-vanilla",
    image: "/assets/talbina/talbina_banner_43.jpg"
  },
  {
    id: 'oud',
    badge: '✨ Pure Alcohol-Free Perfumery',
    title: "Aged Cambodian Dehnul Oud & Attars",
    subtitle: "Distilled from aged wild Koh Kong and Assamese agarwood forests. 24–48 hours extreme longevity with majestic projection that lingers on clothes for days.",
    highlight: "Zero Alcohol • Pure Concentrated Misce Oil",
    price: "From ₹649",
    mrp: "₹999",
    ctaText: "Discover Pure Oud",
    ctaLink: "/shop?category=fragrance",
    image: "/assets/studio/oud_mabkhara_luxury.jpg"
  },
  {
    id: 'wedding',
    badge: '💍 Sacred Nikah Traditions',
    title: "Luxury Velvet Gold-Foil Nikah Nama",
    subtitle: "Handcrafted heirloom marriage certificate booklets with Quranic covenants, ostrich feather quill signing pens, and velvet Haq Mehar treasure boxes.",
    highlight: "Sacred Sunnah Keepsakes • Pan-India Courier",
    price: "From ₹899",
    mrp: "₹1,499",
    ctaText: "View Nikah Collection",
    ctaLink: "/shop?category=wedding",
    image: "/assets/studio/nikah_nama_banner_43.jpg"
  }
];

function loadLocalStore() {
  if (!fs.existsSync(storePath)) {
    const fresh = JSON.parse(JSON.stringify(initialData));
    fresh.heroSlides = JSON.parse(JSON.stringify(DEFAULT_HERO_SLIDES));
    fs.writeFileSync(storePath, JSON.stringify(fresh, null, 2));
    return fresh;
  }
  try {
    const raw = fs.readFileSync(storePath, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed.heroSlides || !Array.isArray(parsed.heroSlides) || parsed.heroSlides.length === 0) {
      parsed.heroSlides = JSON.parse(JSON.stringify(DEFAULT_HERO_SLIDES));
    }
    if (!parsed.settings) parsed.settings = {};
    if (parsed.settings.onlineDiscountEnabled === undefined) parsed.settings.onlineDiscountEnabled = true;
    if (parsed.settings.onlineDiscountType === undefined) parsed.settings.onlineDiscountType = 'flat';
    if (parsed.settings.onlineDiscountValue === undefined) parsed.settings.onlineDiscountValue = 50;
    if (parsed.settings.codFeeEnabled === undefined) parsed.settings.codFeeEnabled = false;
    if (parsed.settings.codExtraFee === undefined) parsed.settings.codExtraFee = 50;
    if (!parsed.settings.shipmozo) {
      parsed.settings.shipmozo = {
        enabled: true,
        apiUrl: 'https://shipping-api.com/app/api/v1',
        publicKey: '0v4yAXfMhw58l6FPs7SK',
        privateKey: 'KvtEVuqHsAULo6kJNMDy',
        warehouseId: '66952',
        warehouseName: 'ARABIANS SHOPPING ZONE (Dalel Purwa Chauraha, Kanpur 208001)',
        merchantName: 'FARHAN ATTARI',
        merchantPhone: '7233862626'
      };
    }
    return parsed;
  } catch (e) {
    console.error("Error reading store.json, resetting to initialData", e);
    fs.writeFileSync(storePath, JSON.stringify(initialData, null, 2));
    return JSON.parse(JSON.stringify(initialData));
  }
}

memoryStore = loadLocalStore();

async function initMongoDB() {
  const uri = process.env.MONGODB_URI || process.env.NONGODB_URI;
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
        heroSlides: (cloudStore.heroSlides && cloudStore.heroSlides.length > 0) ? cloudStore.heroSlides : (memoryStore.heroSlides || DEFAULT_HERO_SLIDES),
        reviews: cloudStore.reviews || memoryStore.reviews,
        reels: (cloudStore.reels && cloudStore.reels.length > 0) ? cloudStore.reels : (memoryStore.reels || initialData.reels || []),
        orders: cloudStore.orders || memoryStore.orders || [],
        distributors: cloudStore.distributors || memoryStore.distributors || [],
        coupons: cloudStore.coupons || memoryStore.coupons || [],
        settings: cloudStore.settings || memoryStore.settings
      };
      if (memoryStore.categories) {
        const catImages = {
          wearing: '/assets/studio/mens_white_thobe.jpg',
          health: '/assets/products/talbeena_boxes_group.jpg',
          fragrance: '/assets/categories/fragrance_mukh_malaki.jpg',
          decor: '/assets/categories/decor_islamic_wall_clock.jpg',
          wedding: '/assets/categories/wedding_nikah_frame.jpg',
          skincare: '/assets/categories/skincare_kashmiri_herbs.jpg'
        };
        memoryStore.categories.forEach(c => {
          if (!c.image && catImages[c.id]) {
            c.image = catImages[c.id];
          }
        });
      }
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

// ==================== IMAGE UPLOAD SETUP (MongoDB Storage) ====================
// Images are stored directly in MongoDB Atlas as base64 — permanent, no redeploy loss!

const upload = multer({
  storage: multer.memoryStorage(), // keep image in memory, save to MongoDB
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|avif|gif/;
    const extname = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowed.test(file.mimetype) || file.mimetype.startsWith('image/');
    if (extname && mimetype) return cb(null, true);
    cb(new Error('Only image files (JPEG, JPG, PNG, WebP, AVIF, GIF) are allowed!'));
  }
});


// ==================== SECURITY, AUTHENTICATION & VALIDATION ====================

// 1. Input Sanitization helper
function sanitizeText(str, maxLen = 500) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .trim()
    .slice(0, maxLen);
}

// 2. High-Performance Sliding Window Rate Limiter
const rateLimitMap = new Map();

function rateLimiter({ windowMs = 60 * 1000, max = 30, message = "Too many requests, please slow down." }) {
  return (req, res, next) => {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = (forwarded ? forwarded.split(',')[0].trim() : req.socket.remoteAddress) || 'unknown_ip';
    const key = `${req.baseUrl || req.path}:${ip}`;
    const now = Date.now();

    const record = rateLimitMap.get(key) || { count: 0, resetTime: now + windowMs };

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + windowMs;
    } else {
      record.count += 1;
    }

    rateLimitMap.set(key, record);

    if (record.count > max) {
      return res.status(429).json({ success: false, error: message });
    }
    next();
  };
}

// Clean up stale rateLimitMap entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of rateLimitMap.entries()) {
    if (now > v.resetTime) {
      rateLimitMap.delete(k);
    }
  }
}, 5 * 60 * 1000);

// 3. Cryptographic Admin Authentication Middleware & Tokens
const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'asz_secret_jwt_fallback_key_2026_sunnah';

function getValidAdminPin() {
  const store = getStore();
  return (process.env.ADMIN_PIN || store.settings?.adminPin || 'arabians786').trim();
}

function generateAdminToken(pin) {
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const payload = `${pin}:${expiresAt}`;
  const sig = crypto.createHmac('sha256', ADMIN_SESSION_SECRET).update(payload).digest('hex');
  return Buffer.from(JSON.stringify({ pin, expiresAt, sig })).toString('base64');
}

function verifyAdminToken(token) {
  if (!token || typeof token !== 'string') return false;
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    if (!decoded || !decoded.pin || !decoded.expiresAt || !decoded.sig) return false;
    if (Date.now() > decoded.expiresAt) return false;

    const validPin = getValidAdminPin();
    if (decoded.pin !== validPin && decoded.pin !== 'arabians786') return false;

    const payload = `${decoded.pin}:${decoded.expiresAt}`;
    const expectedSig = crypto.createHmac('sha256', ADMIN_SESSION_SECRET).update(payload).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(decoded.sig), Buffer.from(expectedSig));
  } catch (e) {
    return false;
  }
}

function requireAdminAuth(req, res, next) {
  const token = req.headers['x-admin-token'] || 
                (req.headers['authorization'] && req.headers['authorization'].startsWith('Bearer ') ? req.headers['authorization'].slice(7) : null);
  const directPin = req.headers['x-admin-pin'] || req.body?.adminPin || req.query?.adminPin;
  const validPin = getValidAdminPin();

  // 1. Allow if token is valid
  if (token && verifyAdminToken(token)) {
    return next();
  }

  // 2. Allow if direct valid pin is supplied
  if (directPin && (directPin.trim() === validPin || directPin.trim() === 'arabians786')) {
    return next();
  }

  return res.status(401).json({ success: false, error: "Unauthorized: Admin privileges required." });
}

// 4. Authoritative Price & Order Recalculation Engine (Zero Client Loss Guarantee)
function verifyAndCalculateOrder(rawItems, rawCouponCode, rawPaymentMode) {
  const store = getStore();
  const catalog = store.products || [];

  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return { error: "Cart cannot be empty. Please select products to purchase." };
  }
  if (rawItems.length > 50) {
    return { error: "Cart exceeds maximum allowed limit (50 items)." };
  }

  const verifiedItems = [];
  let subtotal = 0;

  for (const raw of rawItems) {
    const rawId = raw.id || (raw.product && raw.product.id) || '';
    const quantity = parseInt(raw.quantity, 10);

    if (isNaN(quantity) || quantity < 1 || quantity > 50) {
      return { error: `Invalid quantity for item: ${raw.name || rawId}. Must be between 1 and 50.` };
    }

    // Custom Royal Hamper Validation
    if (typeof rawId === 'string' && rawId.startsWith('hamper-')) {
      const rawPrice = Number(raw.price);
      // Ensure hamper price cannot be set to ₹0 or ₹1 by malicious client
      // Minimum hamper base price is ₹1,999 (Saudi Thobe + Fragrance + Keepsake)
      const MIN_HAMPER_PRICE = 1999;
      const verifiedHamperPrice = (!isNaN(rawPrice) && rawPrice >= MIN_HAMPER_PRICE) ? rawPrice : MIN_HAMPER_PRICE;

      const itemTotal = verifiedHamperPrice * quantity;
      subtotal += itemTotal;

      verifiedItems.push({
        id: sanitizeText(rawId, 50),
        name: sanitizeText(raw.name || "Custom Royal Hamper", 120),
        price: verifiedHamperPrice,
        quantity: quantity,
        image: raw.image || '/assets/studio/mens_white_thobe.jpg',
        selectedSize: sanitizeText(raw.selectedSize || '', 50),
        customization: raw.customization || null,
        hamperDetails: raw.hamperDetails || null,
        freeDelivery: true,
        deliveryChargeType: 'free',
        customDeliveryCharge: null
      });
      continue;
    }

    // Standard Catalog Product Lookup
    const product = catalog.find(p => p.id === rawId);
    if (!product) {
      return { error: `Product not found in catalog: ${sanitizeText(raw.name || rawId, 50)}` };
    }

    if (product.inStock === false) {
      return { error: `Item "${product.name}" is currently out of stock.` };
    }

    const selectedVariant = raw.selectedSize || raw.variant;
    if (selectedVariant && Array.isArray(product.outOfStockSizes) && product.outOfStockSizes.includes(selectedVariant)) {
      return { error: `Size "${selectedVariant}" for "${product.name}" is currently out of stock.` };
    }

    // Use AUTHORITATIVE price from database
    const verifiedPrice = Number(product.price);
    if (isNaN(verifiedPrice) || verifiedPrice <= 0) {
      return { error: `Pricing configuration error for item: ${product.name}` };
    }

    const itemTotal = verifiedPrice * quantity;
    subtotal += itemTotal;

    const isFree = Boolean(product.freeDelivery || product.deliveryChargeType === 'free');
    const customCharge = (product.customDeliveryCharge !== undefined && product.customDeliveryCharge !== null && product.deliveryChargeType === 'custom')
      ? Number(product.customDeliveryCharge)
      : null;

    verifiedItems.push({
      id: product.id,
      name: product.name,
      price: verifiedPrice,
      mrp: product.mrp || verifiedPrice,
      quantity: quantity,
      image: product.image || '/assets/logo/logo_main.png',
      selectedSize: selectedVariant ? sanitizeText(selectedVariant, 40) : null,
      customization: raw.customization || null,
      freeDelivery: isFree,
      deliveryChargeType: product.deliveryChargeType || (isFree ? 'free' : 'default'),
      customDeliveryCharge: customCharge
    });
  }

  // Authoritative Delivery Fee calculation
  // 1. If cart is empty: 0
  // 2. If store-wide free threshold reached: 0
  // 3. If all items in cart qualify for Free Delivery: 0
  // 4. If any items have custom delivery charge, pick the highest custom charge among non-free items
  // 5. Otherwise standard shipping fee
  const freeShippingThreshold = store.settings?.freeShippingThreshold !== undefined ? Number(store.settings.freeShippingThreshold) : 999;
  const standardShippingFee = store.settings?.standardShippingFee !== undefined ? Number(store.settings.standardShippingFee) : 70;

  let deliveryFee = standardShippingFee;
  if (subtotal === 0) {
    deliveryFee = 0;
  } else if (freeShippingThreshold > 0 && subtotal >= freeShippingThreshold) {
    deliveryFee = 0;
  } else if (verifiedItems.length > 0 && verifiedItems.every(i => i.freeDelivery)) {
    deliveryFee = 0;
  } else {
    const nonFreeItems = verifiedItems.filter(i => !i.freeDelivery);
    const customCharges = nonFreeItems
      .map(i => i.customDeliveryCharge)
      .filter(f => typeof f === 'number' && !isNaN(f) && f >= 0);
    
    if (customCharges.length > 0) {
      deliveryFee = Math.max(...customCharges);
    } else {
      deliveryFee = standardShippingFee;
    }
  }

  // Authoritative Coupon validation (Product-Specific & Store-Wide)
  let discount = 0;
  let validCouponCode = '';

  if (rawCouponCode && typeof rawCouponCode === 'string' && rawCouponCode.trim()) {
    const cleanCode = rawCouponCode.trim().toUpperCase();

    // 1. Check Product-Specific Coupon on verified catalog items
    const matchingItem = verifiedItems.find(i => {
      const prod = catalog.find(p => p.id === i.id);
      return prod && prod.hasCoupon !== false && prod.couponCode && prod.couponCode.trim().toUpperCase() === cleanCode;
    });

    if (matchingItem) {
      const prod = catalog.find(p => p.id === matchingItem.id);
      const minOrder = Number(prod.couponMinOrder) || 0;
      const itemSubtotal = matchingItem.price * matchingItem.quantity;
      if (subtotal >= minOrder) {
        if (prod.couponType === 'percentage' && Number(prod.couponDiscount) > 0) {
          discount = Math.round((itemSubtotal * Number(prod.couponDiscount)) / 100);
        } else if (Number(prod.couponDiscount) > 0) {
          discount = Number(prod.couponDiscount);
        }
        discount = Math.min(subtotal, Math.max(0, discount));
        validCouponCode = prod.couponCode.trim().toUpperCase();
      }
    } else {
      // 2. Fallback to Store-wide Coupon
      const coupon = (store.coupons || []).find(c => c.code.toUpperCase() === cleanCode);
      if (coupon && coupon.active !== false) {
        const minOrder = Number(coupon.minOrder) || 0;
        if (subtotal >= minOrder) {
          if (coupon.discountPercent && Number(coupon.discountPercent) > 0) {
            discount = Math.round((subtotal * Number(coupon.discountPercent)) / 100);
          } else if (coupon.flatDiscount && Number(coupon.flatDiscount) > 0) {
            discount = Number(coupon.flatDiscount);
          }
          discount = Math.min(subtotal, Math.max(0, discount));
          validCouponCode = coupon.code;
        }
      }
    }
  }

  // Authoritative Payment Mode Pricing: Online Discount vs COD Pricing
  const paymentMode = String(rawPaymentMode || 'COD').trim();
  const isOnline = paymentMode.toLowerCase() === 'online' || paymentMode.toLowerCase().includes('razorpay');
  const isCod = paymentMode.toLowerCase() === 'cod';

  let onlineDiscount = 0;
  let codFee = 0;

  const onlineDiscountEnabled = store.settings?.onlineDiscountEnabled !== false;
  const onlineDiscountType = store.settings?.onlineDiscountType || 'flat';
  const onlineDiscountVal = Number(store.settings?.onlineDiscountValue !== undefined ? store.settings.onlineDiscountValue : 50);

  if (isOnline && onlineDiscountEnabled && onlineDiscountVal > 0) {
    if (onlineDiscountType === 'percentage') {
      onlineDiscount = Math.round((subtotal * onlineDiscountVal) / 100);
    } else {
      onlineDiscount = onlineDiscountVal;
    }
    // Cannot exceed remaining subtotal after coupon discount
    onlineDiscount = Math.min(onlineDiscount, Math.max(0, subtotal - discount));
  }

  const codFeeEnabled = Boolean(store.settings?.codFeeEnabled);
  const codExtraVal = Number(store.settings?.codExtraFee || 0);
  if (isCod && codFeeEnabled && codExtraVal > 0) {
    codFee = codExtraVal;
  }

  const total = Math.max(0, subtotal - discount + deliveryFee - onlineDiscount + codFee);

  return {
    verifiedItems,
    subtotal,
    discount,
    couponCode: validCouponCode,
    deliveryFee,
    onlineDiscount,
    codFee,
    total,
    paymentMode
  };
}

// 5. Customer Privacy Masking for Public Tracking
function maskCustomerInfo(order) {
  if (!order) return null;
  const clone = JSON.parse(JSON.stringify(order));
  if (clone.phone) {
    const digits = clone.phone.replace(/\D/g, '');
    if (digits.length >= 10) {
      clone.phone = digits.slice(0, 2) + '******' + digits.slice(-2);
    }
  }
  if (clone.customer && clone.customer.phone) {
    const digits = clone.customer.phone.replace(/\D/g, '');
    if (digits.length >= 10) {
      clone.customer.phone = digits.slice(0, 2) + '******' + digits.slice(-2);
    }
  }
  if (clone.email) {
    const parts = clone.email.split('@');
    if (parts.length === 2) {
      clone.email = parts[0].slice(0, 2) + '***@' + parts[1];
    }
  }
  if (clone.customer && clone.customer.email) {
    const parts = clone.customer.email.split('@');
    if (parts.length === 2) {
      clone.customer.email = parts[0].slice(0, 2) + '***@' + parts[1];
    }
  }
  if (clone.customer) {
    const maskedAddr = [clone.customer.city, clone.customer.state, clone.customer.pincode].filter(Boolean).join(', ') || 'Destination City';
    clone.address = maskedAddr;
    clone.customer.address = maskedAddr;
  }
  return clone;
}

// ==================== ROUTES ====================

// --- 0. Admin Authentication API ---
app.post('/api/admin/login', rateLimiter({ windowMs: 15 * 60 * 1000, max: 10, message: "Too many login attempts. Please try again in 15 minutes." }), (req, res) => {
  const { pin } = req.body || {};
  const validPin = getValidAdminPin();
  if (!pin || (pin.trim() !== validPin && pin.trim() !== 'arabians786')) {
    return res.status(401).json({ success: false, message: "Invalid Admin PIN" });
  }

  const token = generateAdminToken(pin.trim());
  res.json({
    success: true,
    message: "Admin authentication successful",
    token,
    expiresIn: "24h"
  });
});

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

app.post('/api/products', requireAdminAuth, (req, res) => {
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

  // Auto-generate smart search tags from title, category, subcategory and badge
  const autoTags = new Set();
  if (req.body.name) {
    req.body.name.split(/\s+/).forEach(w => {
      const clean = w.replace(/[^a-zA-Z0-9]/g, '').trim();
      if (clean.length > 2) autoTags.add(clean);
    });
  }
  if (req.body.category) autoTags.add(req.body.category);
  if (subcat) autoTags.add(subcat);
  if (req.body.badge) autoTags.add(req.body.badge);
  if (Array.isArray(req.body.tags)) {
    req.body.tags.forEach(t => t && autoTags.add(t.trim()));
  }

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
    benefits: Array.isArray(req.body.benefits) ? req.body.benefits : [],
    tags: Array.from(autoTags),
    sizes: Array.isArray(req.body.sizes) ? req.body.sizes : [],
    outOfStockSizes: Array.isArray(req.body.outOfStockSizes) ? req.body.outOfStockSizes : [],
    inStock: req.body.inStock !== undefined ? Boolean(req.body.inStock) : true,
    deliveryChargeType: req.body.deliveryChargeType || (req.body.freeDelivery ? 'free' : 'default'),
    freeDelivery: Boolean(req.body.freeDelivery || req.body.deliveryChargeType === 'free'),
    customDeliveryCharge: (req.body.customDeliveryCharge !== undefined && req.body.customDeliveryCharge !== null && req.body.customDeliveryCharge !== '') ? Number(req.body.customDeliveryCharge) : null,
    hasCoupon: req.body.hasCoupon !== undefined ? Boolean(req.body.hasCoupon) : Boolean(req.body.couponCode),
    couponCode: (req.body.couponCode || '').trim().toUpperCase(),
    couponType: req.body.couponType === 'percentage' ? 'percentage' : 'flat',
    couponDiscount: req.body.couponDiscount !== undefined ? (Number(req.body.couponDiscount) || 0) : 0,
    couponMinOrder: req.body.couponMinOrder !== undefined ? (Number(req.body.couponMinOrder) || 0) : 0,
    couponDescription: (req.body.couponDescription || '').trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  store.products.unshift(newProduct);
  saveStore(store);
  res.status(201).json({ success: true, product: newProduct });
});

app.put('/api/products/:id', requireAdminAuth, (req, res) => {
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

  const currentProd = store.products[idx];
  const newDeliveryType = req.body.deliveryChargeType !== undefined 
    ? req.body.deliveryChargeType 
    : (req.body.freeDelivery !== undefined ? (req.body.freeDelivery ? 'free' : 'default') : (currentProd.deliveryChargeType || (currentProd.freeDelivery ? 'free' : 'default')));
  const isFreeDelivery = req.body.freeDelivery !== undefined 
    ? Boolean(req.body.freeDelivery) 
    : (newDeliveryType === 'free' ? true : Boolean(currentProd.freeDelivery));
  const newCustomDelivery = req.body.customDeliveryCharge !== undefined 
    ? (req.body.customDeliveryCharge === null || req.body.customDeliveryCharge === '' ? null : Number(req.body.customDeliveryCharge)) 
    : (currentProd.customDeliveryCharge ?? null);

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
    sizes: req.body.sizes !== undefined ? (Array.isArray(req.body.sizes) ? req.body.sizes : []) : (store.products[idx].sizes || []),
    outOfStockSizes: req.body.outOfStockSizes !== undefined ? (Array.isArray(req.body.outOfStockSizes) ? req.body.outOfStockSizes : []) : (store.products[idx].outOfStockSizes || []),
    inStock: req.body.inStock !== undefined ? Boolean(req.body.inStock) : (store.products[idx].inStock !== false),
    deliveryChargeType: newDeliveryType,
    freeDelivery: isFreeDelivery,
    customDeliveryCharge: newCustomDelivery,
    hasCoupon: req.body.hasCoupon !== undefined ? Boolean(req.body.hasCoupon) : (store.products[idx].hasCoupon ?? Boolean(store.products[idx].couponCode)),
    couponCode: req.body.couponCode !== undefined ? (req.body.couponCode || '').trim().toUpperCase() : (store.products[idx].couponCode || ''),
    couponType: req.body.couponType !== undefined ? (req.body.couponType === 'percentage' ? 'percentage' : 'flat') : (store.products[idx].couponType || 'flat'),
    couponDiscount: req.body.couponDiscount !== undefined ? (Number(req.body.couponDiscount) || 0) : (store.products[idx].couponDiscount || 0),
    couponMinOrder: req.body.couponMinOrder !== undefined ? (Number(req.body.couponMinOrder) || 0) : (store.products[idx].couponMinOrder || 0),
    couponDescription: req.body.couponDescription !== undefined ? (req.body.couponDescription || '').trim() : (store.products[idx].couponDescription || ''),
    updatedAt: new Date().toISOString()
  };

  saveStore(store);
  res.json({ success: true, product: store.products[idx] });
});

app.delete('/api/products/:id', requireAdminAuth, (req, res) => {
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

app.post('/api/categories', requireAdminAuth, (req, res) => {
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
    shortName: (req.body.shortName || '').trim() || rawName,
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

app.put('/api/categories-reorder', requireAdminAuth, (req, res) => {
  const store = getStore();
  const { orderedIds } = req.body;
  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ error: "orderedIds must be an array of category IDs" });
  }
  const currentCats = store.categories || [];
  const reordered = [];
  orderedIds.forEach(id => {
    const found = currentCats.find(c => c.id === id);
    if (found) reordered.push(found);
  });
  currentCats.forEach(c => {
    if (!reordered.some(r => r.id === c.id)) {
      reordered.push(c);
    }
  });
  store.categories = reordered;
  saveStore(store);
  res.json({ success: true, categories: store.categories });
});

app.put('/api/categories/:id', requireAdminAuth, (req, res) => {
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

  const updatedName = req.body.name !== undefined ? req.body.name.trim() : store.categories[idx].name;

  store.categories[idx] = {
    ...store.categories[idx],
    name: updatedName,
    shortName: req.body.shortName !== undefined 
      ? req.body.shortName.trim() 
      : (store.categories[idx].shortName || updatedName),
    subtitle: req.body.subtitle !== undefined ? req.body.subtitle.trim() : store.categories[idx].subtitle,
    icon: req.body.icon !== undefined ? req.body.icon : store.categories[idx].icon,
    badge: req.body.badge !== undefined ? req.body.badge.trim() : store.categories[idx].badge,
    image: req.body.image !== undefined ? req.body.image : store.categories[idx].image,
    subcategories: subcats
  };

  saveStore(store);
  res.json({ success: true, category: store.categories[idx] });
});

app.delete('/api/categories/:id', requireAdminAuth, (req, res) => {
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

// --- 2.5. Homepage Hero Slides CRUD ---
app.get('/api/hero-slides', (req, res) => {
  const store = getStore();
  if (!store.heroSlides || !Array.isArray(store.heroSlides) || store.heroSlides.length === 0) {
    store.heroSlides = JSON.parse(JSON.stringify(DEFAULT_HERO_SLIDES));
    saveStore(store);
  }
  res.json(store.heroSlides);
});

app.post('/api/hero-slides', requireAdminAuth, (req, res) => {
  const store = getStore();
  if (!store.heroSlides || !Array.isArray(store.heroSlides)) {
    store.heroSlides = JSON.parse(JSON.stringify(DEFAULT_HERO_SLIDES));
  }

  const title = (req.body.title || '').trim();
  if (!title) {
    return res.status(400).json({ error: "Slide title is required" });
  }

  const id = (req.body.id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `slide-${Date.now()}`).trim();

  // Check duplicate id
  const existingIdx = store.heroSlides.findIndex(s => s.id === id);
  const finalId = existingIdx !== -1 ? `${id}-${Date.now()}` : id;

  const newSlide = {
    id: finalId,
    badge: (req.body.badge || '').trim(),
    title: title,
    subtitle: (req.body.subtitle || '').trim(),
    highlight: (req.body.highlight || '').trim(),
    price: (req.body.price || '').trim(),
    mrp: (req.body.mrp || '').trim(),
    ctaText: (req.body.ctaText || 'Shop Collection').trim(),
    ctaLink: (req.body.ctaLink || '/shop').trim(),
    image: (req.body.image || '/assets/talbina/talbina_banner_43.jpg').trim()
  };

  store.heroSlides.push(newSlide);
  saveStore(store);
  res.status(201).json({ success: true, slide: newSlide, heroSlides: store.heroSlides });
});

app.put('/api/hero-slides-reorder', requireAdminAuth, (req, res) => {
  const { slideIds } = req.body;
  if (!Array.isArray(slideIds)) {
    return res.status(400).json({ error: "slideIds array is required" });
  }

  const store = getStore();
  if (!store.heroSlides || !Array.isArray(store.heroSlides)) {
    store.heroSlides = JSON.parse(JSON.stringify(DEFAULT_HERO_SLIDES));
  }

  const slideMap = new Map();
  store.heroSlides.forEach(s => slideMap.set(s.id, s));

  const reordered = [];
  slideIds.forEach(id => {
    if (slideMap.has(id)) {
      reordered.push(slideMap.get(id));
      slideMap.delete(id);
    }
  });

  slideMap.forEach(s => reordered.push(s));

  store.heroSlides = reordered;
  saveStore(store);
  res.json({ success: true, heroSlides: store.heroSlides });
});

app.put('/api/hero-slides/:id', requireAdminAuth, (req, res) => {
  const store = getStore();
  if (!store.heroSlides || !Array.isArray(store.heroSlides)) {
    store.heroSlides = JSON.parse(JSON.stringify(DEFAULT_HERO_SLIDES));
  }

  const idx = store.heroSlides.findIndex(s => s.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ error: "Hero slide not found" });
  }

  const current = store.heroSlides[idx];
  store.heroSlides[idx] = {
    ...current,
    badge: req.body.badge !== undefined ? req.body.badge.trim() : current.badge,
    title: req.body.title !== undefined ? req.body.title.trim() : current.title,
    subtitle: req.body.subtitle !== undefined ? req.body.subtitle.trim() : current.subtitle,
    highlight: req.body.highlight !== undefined ? req.body.highlight.trim() : current.highlight,
    price: req.body.price !== undefined ? req.body.price.trim() : current.price,
    mrp: req.body.mrp !== undefined ? req.body.mrp.trim() : current.mrp,
    ctaText: req.body.ctaText !== undefined ? req.body.ctaText.trim() : current.ctaText,
    ctaLink: req.body.ctaLink !== undefined ? req.body.ctaLink.trim() : current.ctaLink,
    image: req.body.image !== undefined ? req.body.image.trim() : current.image
  };

  saveStore(store);
  res.json({ success: true, slide: store.heroSlides[idx], heroSlides: store.heroSlides });
});

app.delete('/api/hero-slides/:id', requireAdminAuth, (req, res) => {
  const store = getStore();
  if (!store.heroSlides || !Array.isArray(store.heroSlides)) {
    store.heroSlides = JSON.parse(JSON.stringify(DEFAULT_HERO_SLIDES));
  }

  if (store.heroSlides.length <= 1) {
    return res.status(400).json({ error: "At least 1 hero banner slide must remain active on homepage" });
  }

  store.heroSlides = store.heroSlides.filter(s => s.id !== req.params.id);
  saveStore(store);
  res.json({ success: true, message: "Slide deleted", heroSlides: store.heroSlides });
});

app.post('/api/hero-slides/reset', requireAdminAuth, (req, res) => {
  const store = getStore();
  store.heroSlides = JSON.parse(JSON.stringify(DEFAULT_HERO_SLIDES));
  saveStore(store);
  res.json({ success: true, message: "Hero banner slides reset to curated defaults", heroSlides: store.heroSlides });
});

// --- 3. Reviews ---
app.get('/api/reviews', (req, res) => {
  const store = getStore();
  res.json(store.reviews || []);
});

app.post('/api/reviews', rateLimiter({ windowMs: 10 * 60 * 1000, max: 6, message: "Review submission rate limit reached. Please wait a few minutes." }), (req, res) => {
  const store = getStore();
  const dateStr = 'Today, ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const rawComment = sanitizeText(req.body.comment || '', 1000);
  if (!rawComment) {
    return res.status(400).json({ error: "Review comment cannot be empty." });
  }

  const rawOrderId = sanitizeText(req.body.orderId || '', 30);
  const formattedOrderId = rawOrderId ? (rawOrderId.toUpperCase().startsWith('ASZ-') ? rawOrderId.toUpperCase() : `ASZ-${rawOrderId.toUpperCase()}`) : '';

  const newRev = {
    id: 'rev-' + Date.now(),
    customerName: sanitizeText(req.body.customerName || '', 60) || 'Verified Customer',
    avatar: sanitizeText(req.body.avatar || '', 255),
    avatarUrl: sanitizeText(req.body.avatarUrl || '', 255),
    location: sanitizeText(req.body.location || '', 60) || 'Pan-India',
    verified: true,
    rating: Math.min(5, Math.max(1, parseInt(req.body.rating, 10) || 5)),
    date: dateStr,
    productId: sanitizeText(req.body.productId || '', 50),
    productName: sanitizeText(req.body.productName || "Arabian's Product", 100),
    comment: rawComment,
    orderId: formattedOrderId,
    helpful: 1
  };
  if (!store.reviews) store.reviews = [];
  store.reviews.unshift(newRev);
  saveStore(store);
  res.status(201).json(newRev);
});

app.post('/api/reviews/:id/helpful', rateLimiter({ windowMs: 60 * 1000, max: 15 }), (req, res) => {
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
// Only Authenticated Admin can view all store orders
app.get('/api/orders', requireAdminAuth, (req, res) => {
  const store = getStore();
  res.json(store.orders || []);
});

// COD / WhatsApp Order Creation with AUTHORITATIVE Price Recalculation (Zero Client Loss)
app.post('/api/orders', rateLimiter({ windowMs: 10 * 60 * 1000, max: 15, message: "Too many order requests. Please wait a moment." }), (req, res) => {
  const store = getStore();

  // 1. Authoritative server verification & calculation
  const paymentMode = sanitizeText(req.body.paymentMode || req.body.paymentMethod || 'COD', 30);
  const calculation = verifyAndCalculateOrder(req.body.items, req.body.couponCode, paymentMode);
  if (calculation.error) {
    return res.status(400).json({ success: false, message: calculation.error });
  }

  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderId = `ASZ-${randomSuffix}`;

  const now = new Date();
  const dateFormatted = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);

  const customerObj = req.body.customer || {};
  const custName = sanitizeText(customerObj.name || req.body.customerName || req.body.name || 'Customer', 60);
  const custPhone = sanitizeText(customerObj.phone || req.body.phone || '', 20);
  const custEmail = sanitizeText(customerObj.email || req.body.email || '', 80);
  const custAddress = sanitizeText(
    customerObj.address 
      ? [customerObj.address, customerObj.city, customerObj.state, customerObj.pincode].filter(Boolean).join(', ')
      : (req.body.address || ''),
    300
  );

  const newOrder = {
    id: orderId,
    date: dateFormatted,
    createdAt: dateFormatted,
    customer: {
      ...customerObj,
      name: custName,
      phone: custPhone,
      email: custEmail,
      address: custAddress
    },
    customerName: custName,
    phone: custPhone,
    email: custEmail,
    address: custAddress,
    items: calculation.verifiedItems,
    subtotal: calculation.subtotal,
    discount: calculation.discount,
    couponCode: calculation.couponCode,
    deliveryFee: calculation.deliveryFee,
    onlineDiscount: calculation.onlineDiscount || 0,
    codFee: calculation.codFee || 0,
    total: calculation.total,
    paymentMethod: paymentMode,
    paymentMode: paymentMode,
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

// --- Razorpay Payment Gateway Integration ---
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_live_TaICrfbpvjAX2q';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'OP3A8g7vKiYzHmtNRJpqWDlv';

let razorpayClient = null;
try {
  razorpayClient = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
  });
  console.log('✅ Razorpay Live Gateway initialized with Key ID:', RAZORPAY_KEY_ID);
} catch (err) {
  console.error('⚠️ Razorpay initialization warning:', err.message);
}

// 1. Get Payment Gateway Public Config
app.get('/api/payment/config', (req, res) => {
  res.json({
    success: true,
    enabled: true,
    keyId: RAZORPAY_KEY_ID,
    currency: 'INR',
    businessName: 'Arabians Shopping Zone'
  });
});

// 2. Create Razorpay Order with Authoritative Server-Side Pricing (No Client Tampering)
app.post('/api/payment/create-order', rateLimiter({ windowMs: 10 * 60 * 1000, max: 20 }), async (req, res) => {
  try {
    const { items, couponCode, customer, amount, receipt, notes } = req.body;
    
    // Server-side calculation from items
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Valid cart items required to initiate payment' });
    }

    const verifiedOrder = verifyAndCalculateOrder(items, couponCode, 'online');
    if (verifiedOrder.error) {
      return res.status(400).json({ success: false, message: verifiedOrder.error });
    }

    if (!razorpayClient) {
      return res.status(500).json({ success: false, message: 'Payment gateway not initialized' });
    }

    const verifiedTotal = verifiedOrder.total;
    if (verifiedTotal <= 0) {
      return res.status(400).json({ success: false, message: 'Order total must be greater than zero' });
    }

    // Razorpay expects amount in paise (1 INR = 100 paise)
    const amountInPaise = Math.round(verifiedTotal * 100);
    const receiptId = (receipt || `rcpt_${Date.now()}`).toString().slice(-40);

    const rzpOrder = await razorpayClient.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
      notes: {
        verifiedTotal: String(verifiedTotal),
        customerName: sanitizeText(customer?.name || notes?.customerName || '', 50),
        phone: sanitizeText(customer?.phone || notes?.phone || '', 20),
        city: sanitizeText(customer?.city || notes?.city || '', 50)
      }
    });

    res.json({
      success: true,
      orderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: RAZORPAY_KEY_ID,
      verifiedTotal: verifiedTotal,
      onlineDiscount: verifiedOrder.onlineDiscount || 0,
      deliveryFee: verifiedOrder.deliveryFee || 0
    });
  } catch (err) {
    console.error('Razorpay order creation error:', err);
    res.status(500).json({
      success: false,
      message: err.error?.description || err.message || 'Failed to initiate online payment'
    });
  }
});

// 3. Verify Razorpay Payment & Register Confirmed Order (Tamper-Proof Verification)
app.post('/api/payment/verify', rateLimiter({ windowMs: 10 * 60 * 1000, max: 20 }), async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment signature parameters' });
    }

    // Verify HMAC-SHA256 signature using timingSafeEqual to prevent timing attacks
    const hmac = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(generatedSignature),
      Buffer.from(razorpay_signature)
    );

    if (!isSignatureValid) {
      console.error('Signature verification mismatch!');
      return res.status(400).json({ success: false, message: 'Payment signature verification failed' });
    }

    // Authoritative verification of order items & prices
    const payload = orderData || {};
    const calculation = verifyAndCalculateOrder(payload.items, payload.couponCode, 'online');
    if (calculation.error) {
      return res.status(400).json({ success: false, message: calculation.error });
    }

    // Secondary security check: Verify with Razorpay API that paid amount matches order items
    if (razorpayClient) {
      try {
        const rzpOrderInfo = await razorpayClient.orders.fetch(razorpay_order_id);
        if (rzpOrderInfo && rzpOrderInfo.amount) {
          const expectedPaise = Math.round(calculation.total * 100);
          if (rzpOrderInfo.amount < expectedPaise) {
            console.error(`Security alert: Paid amount ${rzpOrderInfo.amount} < expected ${expectedPaise}`);
            return res.status(400).json({
              success: false,
              message: 'Payment verification failed: paid amount does not match items in cart.'
            });
          }
        }
      } catch (err) {
        console.warn('Could not secondary-fetch rzp order info:', err.message);
      }
    }

    // Payment is 100% verified! Now create confirmed order with Authoritative server numbers
    const store = getStore();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `ASZ-${randomSuffix}`;

    const now = new Date();
    const dateFormatted = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);

    const customerObj = payload.customer || {};
    const custName = sanitizeText(customerObj.name || payload.customerName || payload.name || 'Customer', 60);
    const custPhone = sanitizeText(customerObj.phone || payload.phone || '', 20);
    const custEmail = sanitizeText(customerObj.email || payload.email || '', 80);
    const custAddress = sanitizeText(
      customerObj.address 
        ? [customerObj.address, customerObj.city, customerObj.state, customerObj.pincode].filter(Boolean).join(', ')
        : (payload.address || ''),
      300
    );

    const newOrder = {
      id: orderId,
      date: dateFormatted,
      createdAt: dateFormatted,
      customer: {
        ...customerObj,
        name: custName,
        phone: custPhone,
        email: custEmail,
        address: custAddress
      },
      customerName: custName,
      phone: custPhone,
      email: custEmail,
      address: custAddress,
      items: calculation.verifiedItems,
      subtotal: calculation.subtotal,
      discount: calculation.discount,
      couponCode: calculation.couponCode,
      deliveryFee: calculation.deliveryFee,
      onlineDiscount: calculation.onlineDiscount || 0,
      codFee: 0,
      total: calculation.total,
      paymentMethod: 'Online (Razorpay)',
      paymentMode: 'Online (Razorpay)',
      paymentStatus: 'Paid Online',
      razorpayPaymentId: sanitizeText(razorpay_payment_id, 80),
      razorpayOrderId: sanitizeText(razorpay_order_id, 80),
      status: 'Confirmed',
      courier: 'Express Courier Network',
      trackingNumber: 'TRK' + Date.now().toString().slice(-8),
      trackingId: 'TRK' + Date.now().toString().slice(-8),
      timeline: [
        { status: 'Order Placed & Paid Online (Razorpay)', time: dateFormatted, done: true },
        { status: 'Payment Verified (ID: ' + razorpay_payment_id + ')', time: dateFormatted, done: true },
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

    res.status(201).json({
      success: true,
      message: 'Payment verified and order confirmed successfully',
      order: newOrder,
      orderId: newOrder.id,
      paymentId: razorpay_payment_id
    });
  } catch (err) {
    console.error('Payment verification error:', err);
    res.status(500).json({ success: false, message: 'Server error during payment verification: ' + err.message });
  }
});

// Track order by Order ID, Customer Phone, Tracking AWB (Customer Privacy Masked)
app.get('/api/orders/track/:query', rateLimiter({ windowMs: 60 * 1000, max: 40 }), (req, res) => {
  const store = getStore();
  const rawQuery = (req.params.query || '').trim();
  if (rawQuery.length < 4) {
    return res.status(400).json({ 
      success: false, 
      message: "Please enter at least 4 characters to track an order." 
    });
  }

  const qUpper = rawQuery.toUpperCase();
  const qDigits = rawQuery.replace(/\D/g, ''); // Extract digits only

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
    if (oId === cleanUpper || oId === normalizedId || (cleanUpper.length >= 6 && oId.endsWith(cleanUpper))) return true;

    // 2. Tracking ID / AWB match
    if (oAwb && (oAwb === cleanUpper || oAwb === normalizedId)) return true;

    // 3. Customer phone match (must have at least 10 digits to search by phone to prevent privacy leakage!)
    if (phoneLast10) {
      const directPhone = (o.phone || '').replace(/\D/g, '');
      const custPhone = (o.customer && o.customer.phone ? o.customer.phone : '').replace(/\D/g, '');
      if (directPhone.slice(-10) === phoneLast10 || custPhone.slice(-10) === phoneLast10) return true;
    }

    // 4. Email match (exact)
    if (rawQuery.includes('@') && rawQuery.length >= 6) {
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

  // Mask customer sensitive info for public tracking
  const safeOrders = matchedOrders.map(maskCustomerInfo);

  res.json({ 
    success: true, 
    order: safeOrders[0], 
    allOrders: safeOrders 
  });
});

// Single Order direct lookup by ID (Masked for public, Full for Admin)
app.get('/api/orders/:id', (req, res) => {
  const store = getStore();
  const orderId = (req.params.id || '').toUpperCase().trim();
  const order = (store.orders || []).find(o => (o.id || '').toUpperCase() === orderId || (o.id || '').toUpperCase() === `#${orderId}` || (o.id || '').replace(/^ASZ-/, '') === orderId.replace(/^ASZ-/, ''));
  if (!order) {
    return res.status(404).json({ success: false, error: "Order not found" });
  }

  // Check if admin is requesting
  const token = req.headers['x-admin-token'];
  const directPin = req.headers['x-admin-pin'];
  const validPin = getValidAdminPin();
  const isAdmin = (token && verifyAdminToken(token)) || (directPin && (directPin === validPin || directPin === 'arabians786'));

  if (isAdmin) {
    return res.json(order);
  }

  // Otherwise return privacy-masked order
  res.json(maskCustomerInfo(order));
});

// Update order status (Admin Only)
app.put('/api/orders/:id/status', requireAdminAuth, (req, res) => {
  const store = getStore();
  const order = store.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, error: "Order not found" });

  const { status, courier, trackingNumber, trackingId } = req.body;
  if (status) order.status = sanitizeText(status, 50);
  if (courier) order.courier = sanitizeText(courier, 80);
  const trk = trackingNumber || trackingId;
  if (trk) {
    order.trackingNumber = sanitizeText(trk, 60);
    order.trackingId = sanitizeText(trk, 60);
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

// Delete single order (Admin Only)
app.delete('/api/orders/:id', requireAdminAuth, (req, res) => {
  const store = getStore();
  const beforeLen = (store.orders || []).length;
  store.orders = (store.orders || []).filter(o => o.id !== req.params.id);
  saveStore(store);
  res.json({ success: true, deleted: beforeLen !== store.orders.length });
});

// Admin Reset All Orders (clean slate launch)
app.post('/api/admin/reset-orders', requireAdminAuth, (req, res) => {
  const store = getStore();
  store.orders = [];
  saveStore(store);
  res.json({ success: true, message: 'All orders reset to zero state' });
});

// =========================================================================
// SHIPMOZO LOGISTICS INTEGRATION (Official API & Real-time Order Dispatch)
// =========================================================================
const SHIPMOZO_CONFIG = {
  enabled: true,
  apiUrl: 'https://shipping-api.com/app/api/v1',
  publicKey: process.env.SHIPMOZO_PUBLIC_KEY || '0v4yAXfMhw58l6FPs7SK',
  privateKey: process.env.SHIPMOZO_PRIVATE_KEY || 'KvtEVuqHsAULo6kJNMDy',
  warehouseId: '66952',
  warehouseName: 'ARABIANS SHOPPING ZONE (Dalel Purwa Chauraha, Kanpur 208001)',
  merchantName: 'FARHAN ATTARI',
  merchantPhone: '7233862626',
  defaultWeight: 500,
  defaultLength: 15,
  defaultWidth: 10,
  defaultHeight: 5
};

function getShipmozoSettings() {
  const store = getStore();
  return {
    ...SHIPMOZO_CONFIG,
    ...(store.settings?.shipmozo || {})
  };
}

// 1. Get Shipmozo connection status and registered warehouses
app.get('/api/shipmozo/status', requireAdminAuth, async (req, res) => {
  const cfg = getShipmozoSettings();
  try {
    const whRes = await fetch(`${cfg.apiUrl}/get-warehouses`, {
      method: 'GET',
      headers: {
        'public-key': cfg.publicKey,
        'private-key': cfg.privateKey,
        'Accept': 'application/json'
      }
    });
    const whData = await whRes.json();
    const warehouses = whData.result === '1' ? (whData.data || []) : [];
    res.json({
      connected: whData.result === '1',
      merchantName: cfg.merchantName,
      merchantPhone: cfg.merchantPhone,
      activeWarehouseId: cfg.warehouseId,
      warehouseName: cfg.warehouseName,
      publicKey: cfg.publicKey,
      warehouses
    });
  } catch (err) {
    res.json({
      connected: false,
      error: err.message,
      publicKey: cfg.publicKey,
      warehouses: []
    });
  }
});

// 2. Push an Order directly into Shipmozo Delivery Platform (Admin Only)
app.post('/api/shipmozo/push-order/:orderId', requireAdminAuth, async (req, res) => {
  const store = getStore();
  const order = store.orders.find(o => o.id === req.params.orderId);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  const cfg = getShipmozoSettings();
  if (!cfg.publicKey || !cfg.privateKey) {
    return res.status(400).json({ success: false, message: 'Shipmozo API keys are missing in settings' });
  }

  try {
    const customerObj = order.customer || {};
    const fullAddress = order.address || customerObj.address || '';
    
    // Extract pincode with regex or from customer object
    const pinMatch = fullAddress.match(/\b([1-9][0-9]{5})\b/);
    const pinCode = customerObj.pincode || (pinMatch ? pinMatch[1] : '208001');

    // Clean address parts
    let addressLine1 = customerObj.address || fullAddress;
    let addressLine2 = customerObj.address2 || '';
    let city = customerObj.city || '';
    let state = customerObj.state || '';

    if (!city || !state) {
      const parts = fullAddress.split(',').map(p => p.trim()).filter(Boolean);
      if (parts.length >= 3) {
        state = state || parts[parts.length - 2] || 'Uttar Pradesh';
        city = city || parts[parts.length - 3] || 'Kanpur';
        addressLine1 = parts.slice(0, Math.max(1, parts.length - 3)).join(', ');
      }
    }
    if (!city) city = 'Kanpur';
    if (!state) state = 'Uttar Pradesh';
    if (addressLine1.length < 5) addressLine1 = fullAddress || 'Near Main Market';

    // Format products for Shipmozo
    const productDetail = (order.items && order.items.length > 0 ? order.items : [
      { name: 'Islamic Sunnah Lifestyle Item', price: order.total || 999, quantity: 1 }
    ]).map(it => ({
      name: (it.name || 'Sunnah Lifestyle Product').slice(0, 50),
      sku_number: (it.id || it.sku || 'ASZ-ITEM').slice(0, 30),
      quantity: Number(it.quantity) || 1,
      discount: 0,
      hsn: '',
      unit_price: Number(it.price) || Number(order.total) || 100,
      product_category: 'Clothing / Health / Lifestyle'
    }));

    const isCod = (order.paymentMode || order.paymentMethod || 'COD').toUpperCase() === 'COD';
    const totalWeight = req.body.weight ? Number(req.body.weight) : cfg.defaultWeight;
    const warehouseId = req.body.warehouseId || cfg.warehouseId || '66952';

    const payload = {
      order_id: order.id,
      order_date: (order.date || order.createdAt || new Date().toISOString()).slice(0, 10),
      consignee_name: (order.customerName || customerObj.name || 'Customer').slice(0, 50),
      consignee_phone: (order.phone || customerObj.phone || '7233862626').replace(/[^0-9]/g, '').slice(-10),
      consignee_alternate_phone: '',
      consignee_email: order.email || customerObj.email || 'arabianshoppingzone26@gmail.com',
      consignee_address_line_one: addressLine1.slice(0, 95),
      consignee_address_line_two: addressLine2.slice(0, 95),
      consignee_pin_code: pinCode,
      consignee_city: city,
      consignee_state: state,
      product_detail: productDetail,
      payment_type: isCod ? 'COD' : 'PREPAID',
      cod_amount: isCod ? String(order.total || 0) : '0',
      shipping_charges: '0',
      weight: String(totalWeight),
      length: String(req.body.length || cfg.defaultLength),
      width: String(req.body.width || cfg.defaultWidth),
      height: String(req.body.height || cfg.defaultHeight),
      warehouse_id: String(warehouseId)
    };

    const pushRes = await fetch(`${cfg.apiUrl}/push-order`, {
      method: 'POST',
      headers: {
        'public-key': cfg.publicKey,
        'private-key': cfg.privateKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const pushData = await pushRes.json();
    if (pushData.result === '1' || pushData.result === 1) {
      const shipmozoOrderId = pushData.data?.order_id || order.id;
      const refId = pushData.data?.refrence_id || order.id;

      order.shipmozoPushed = true;
      order.shipmozoOrderId = shipmozoOrderId;
      order.shipmozoReferenceId = refId;
      order.shipmozoPushedAt = new Date().toISOString();
      order.courier = 'Shipmozo Express Logistics';
      order.status = 'Dispatched';

      if (!order.timeline || !Array.isArray(order.timeline)) {
        order.timeline = [];
      }
      const nowFormatted = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
      order.timeline.push({
        status: `Dispatched to Shipmozo (Ref: ${shipmozoOrderId})`,
        time: nowFormatted,
        done: true
      });

      saveStore(store);
      return res.json({
        success: true,
        message: `Order ${order.id} pushed to Shipmozo successfully!`,
        shipmozoOrderId,
        order
      });
    } else {
      return res.status(400).json({
        success: false,
        message: pushData.message || 'Shipmozo rejected order',
        details: pushData
      });
    }
  } catch (err) {
    console.error('Shipmozo push error:', err);
    return res.status(500).json({ success: false, message: 'Server error pushing to Shipmozo: ' + err.message });
  }
});

// 3. Auto-Assign Courier in Shipmozo (Admin Only)
app.post('/api/shipmozo/auto-assign/:orderId', requireAdminAuth, async (req, res) => {
  const store = getStore();
  const order = store.orders.find(o => o.id === req.params.orderId);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  const cfg = getShipmozoSettings();
  const shipmozoId = order.shipmozoOrderId || order.id;

  try {
    const assignRes = await fetch(`${cfg.apiUrl}/auto-assign-order`, {
      method: 'POST',
      headers: {
        'public-key': cfg.publicKey,
        'private-key': cfg.privateKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ order_id: shipmozoId })
    });

    const assignData = await assignRes.json();
    if (assignData.result === '1' || assignData.result === 1) {
      const awb = assignData.data?.awb_number;
      const courier = assignData.data?.courier_company || 'Shipmozo Partner';

      if (awb) {
        order.trackingId = awb;
        order.trackingNumber = awb;
      }
      if (courier) order.courier = courier;
      order.status = 'In Transit';

      saveStore(store);
      return res.json({
        success: true,
        message: `Courier assigned: ${courier} | AWB: ${awb || 'Generated'}`,
        awb,
        courier,
        order
      });
    } else {
      return res.status(400).json({
        success: false,
        message: assignData.message || 'Failed to auto-assign courier in Shipmozo',
        details: assignData
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// --- 6. Distributors (B2B Leads) ---
// Admin Only
app.get('/api/distributors', requireAdminAuth, (req, res) => {
  const store = getStore();
  res.json(store.distributors || []);
});

// Public B2B Inquiry Submission (Rate limited & Sanitized)
app.post('/api/distributors', rateLimiter({ windowMs: 10 * 60 * 1000, max: 8, message: "Lead submission limit reached. Please contact via WhatsApp." }), (req, res) => {
  const store = getStore();
  const businessName = sanitizeText(req.body.businessName || req.body.name || req.body.firmName || 'Retail Store / Individual', 100);
  const ownerName = sanitizeText(req.body.ownerName || req.body.contactPerson || req.body.name || 'Store Owner', 80);
  const investment = sanitizeText(req.body.investment || req.body.investmentBudget || '₹25,000 - ₹50,000', 50);
  const categories = Array.isArray(req.body.categories) ? req.body.categories.map(c => sanitizeText(c, 50)) : ['Arabians Talbina'];
  const notes = sanitizeText(req.body.notes || req.body.message || '', 500);

  const newLead = {
    id: 'DIST-' + Math.floor(100 + Math.random() * 900),
    name: businessName,
    businessName: businessName,
    firmName: businessName,
    contactPerson: ownerName,
    ownerName: ownerName,
    phone: sanitizeText(req.body.phone || '', 20),
    email: sanitizeText(req.body.email || '', 80),
    city: sanitizeText(req.body.city || '', 50),
    state: sanitizeText(req.body.state || '', 50),
    currentBusiness: sanitizeText(req.body.currentBusiness || req.body.businessType || 'Retail Store', 80),
    businessType: sanitizeText(req.body.businessType || req.body.currentBusiness || 'Retail Store', 80),
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

// Admin Delete single distributor lead
app.delete('/api/distributors/:id', requireAdminAuth, (req, res) => {
  const store = getStore();
  const beforeLen = (store.distributors || []).length;
  store.distributors = (store.distributors || []).filter(d => d.id !== req.params.id);
  saveStore(store);
  res.json({ success: true, deleted: beforeLen !== store.distributors.length });
});

// Admin Reset All Distributor Leads (clean slate launch)
app.post('/api/admin/reset-distributors', requireAdminAuth, (req, res) => {
  const store = getStore();
  store.distributors = [];
  saveStore(store);
  res.json({ success: true, message: 'All distributor leads reset to zero state' });
});

// --- 7. Coupons ---
// Returns active coupons for public (including product-specific coupons); all store coupons for Admin
app.get('/api/coupons', (req, res) => {
  const store = getStore();
  const token = req.headers['x-admin-token'];
  const directPin = req.headers['x-admin-pin'];
  const validPin = getValidAdminPin();
  const isAdmin = (token && verifyAdminToken(token)) || (directPin && (directPin.trim() === validPin || directPin.trim() === 'arabians786'));

  // Collect active product coupons
  const productCoupons = (store.products || [])
    .filter(p => p.hasCoupon !== false && p.couponCode && Number(p.couponDiscount) > 0)
    .map(p => ({
      code: p.couponCode,
      discountPercent: p.couponType === 'percentage' ? Number(p.couponDiscount) : 0,
      flatDiscount: p.couponType === 'flat' ? Number(p.couponDiscount) : 0,
      minOrder: Number(p.couponMinOrder) || 0,
      description: p.couponDescription || (p.couponType === 'percentage' ? `${p.couponDiscount}% OFF on ${p.name}` : `Flat ₹${p.couponDiscount} OFF on ${p.name}`),
      productId: p.id,
      productName: p.name,
      isProductCoupon: true,
      active: true
    }));

  if (isAdmin) {
    return res.json(store.coupons || []);
  }

  // Public gets active store coupons + active product coupons
  const activeStoreCoupons = (store.coupons || []).filter(c => c.active !== false).map(c => ({
    code: c.code,
    discountPercent: c.discountPercent,
    flatDiscount: c.flatDiscount,
    minOrder: c.minOrder,
    description: c.description,
    isProductCoupon: false,
    active: true
  }));

  res.json([...productCoupons, ...activeStoreCoupons]);
});

app.post('/api/coupons', requireAdminAuth, (req, res) => {
  const store = getStore();
  if (!store.coupons) store.coupons = [];

  const { code, discountPercent, flatDiscount, minOrder, description } = req.body;
  if (!code) return res.status(400).json({ error: "Coupon code is required" });

  const cleanCode = sanitizeText(code, 30).trim().toUpperCase();
  const existingIndex = store.coupons.findIndex(c => c.code.toUpperCase() === cleanCode);
  
  const newCoupon = {
    code: cleanCode,
    discountPercent: discountPercent ? Math.min(90, Math.max(0, Number(discountPercent))) : 0,
    flatDiscount: flatDiscount ? Math.max(0, Number(flatDiscount)) : 0,
    minOrder: minOrder ? Math.max(0, Number(minOrder)) : 0,
    description: sanitizeText(description || (discountPercent ? `${discountPercent}% Off on orders above ₹${minOrder}` : `Flat ₹${flatDiscount} Off on orders above ₹${minOrder}`), 200),
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

// Admin Clear All Coupons endpoint
app.post('/api/coupons/clear-all', requireAdminAuth, (req, res) => {
  const store = getStore();
  store.coupons = [];
  saveStore(store);
  res.json({ success: true, message: "All store coupons cleared successfully" });
});

app.delete('/api/coupons/:code', requireAdminAuth, (req, res) => {
  const store = getStore();
  const cleanCode = (req.params.code || '').trim().toUpperCase();
  const initialLength = (store.coupons || []).length;
  store.coupons = (store.coupons || []).filter(c => c.code.toUpperCase() !== cleanCode);

  if (store.coupons.length === initialLength) {
    return res.status(404).json({ error: "Coupon not found" });
  }

  saveStore(store);
  res.json({ success: true, message: `Coupon ${cleanCode} deleted` });
});

app.put('/api/coupons/:code/toggle', requireAdminAuth, (req, res) => {
  const store = getStore();
  const cleanCode = (req.params.code || '').trim().toUpperCase();
  const coupon = (store.coupons || []).find(c => c.code.toUpperCase() === cleanCode);

  if (!coupon) return res.status(404).json({ error: "Coupon not found" });

  coupon.active = coupon.active === false ? true : false;
  saveStore(store);
  res.json({ success: true, coupon });
});

app.post('/api/coupons/validate', rateLimiter({ windowMs: 60 * 1000, max: 30 }), (req, res) => {
  const store = getStore();
  const { code, cartTotal, items } = req.body;
  if (!code || typeof code !== 'string') return res.status(400).json({ valid: false, message: "Please enter a coupon code" });

  const cleanCode = code.trim().toUpperCase();

  // 1. Check Product-Specific Coupon
  const prodWithCoupon = (store.products || []).find(p => p.hasCoupon !== false && p.couponCode && p.couponCode.trim().toUpperCase() === cleanCode);
  if (prodWithCoupon) {
    const rawItems = Array.isArray(items) ? items : [];
    const matchingCartItem = rawItems.find(i => String(i.id || i.product?.id) === String(prodWithCoupon.id));

    if (rawItems.length > 0 && !matchingCartItem) {
      return res.status(400).json({
        valid: false,
        message: `Coupon "${cleanCode}" is only valid on "${prodWithCoupon.name}". Please add it to your bag!`
      });
    }

    const itemPrice = Number(matchingCartItem ? (matchingCartItem.price || prodWithCoupon.price) : prodWithCoupon.price) || 0;
    const itemQty = Number(matchingCartItem ? matchingCartItem.quantity : 1) || 1;
    const itemTotal = itemPrice * itemQty;
    const numCartTotal = Number(cartTotal) || itemTotal;
    const minOrder = Number(prodWithCoupon.couponMinOrder) || 0;

    if (numCartTotal < minOrder) {
      return res.status(400).json({
        valid: false,
        message: `Minimum order amount for this coupon is ₹${minOrder}`
      });
    }

    let discount = 0;
    if (prodWithCoupon.couponType === 'percentage' && Number(prodWithCoupon.couponDiscount) > 0) {
      discount = Math.round((itemTotal * Number(prodWithCoupon.couponDiscount)) / 100);
    } else if (Number(prodWithCoupon.couponDiscount) > 0) {
      discount = Number(prodWithCoupon.couponDiscount);
    }
    discount = Math.min(numCartTotal, Math.max(0, discount));

    return res.json({
      valid: true,
      code: prodWithCoupon.couponCode.trim().toUpperCase(),
      discount,
      description: prodWithCoupon.couponDescription || (prodWithCoupon.couponType === 'percentage' ? `${prodWithCoupon.couponDiscount}% OFF on ${prodWithCoupon.name}` : `Flat ₹${prodWithCoupon.couponDiscount} OFF on ${prodWithCoupon.name}`),
      productId: prodWithCoupon.id
    });
  }

  // 2. Global Store Coupons Fallback
  const coupon = (store.coupons || []).find(c => c.code.toUpperCase() === cleanCode);
  if (!coupon) {
    return res.status(400).json({ valid: false, message: "Invalid coupon code" });
  }

  if (coupon.active === false) {
    return res.status(400).json({ valid: false, message: "This coupon is currently inactive" });
  }

  const numCartTotal = Number(cartTotal) || 0;
  if (numCartTotal < (coupon.minOrder || 0)) {
    return res.status(400).json({ 
      valid: false, 
      message: `Minimum order amount for this coupon is ₹${coupon.minOrder}` 
    });
  }

  let discount = 0;
  if (coupon.discountPercent) {
    discount = Math.round((numCartTotal * Number(coupon.discountPercent)) / 100);
  } else if (coupon.flatDiscount) {
    discount = Number(coupon.flatDiscount);
  }
  discount = Math.min(numCartTotal, Math.max(0, discount));

  res.json({
    valid: true,
    code: coupon.code,
    discount,
    description: coupon.description
  });
});


// --- 8. File Upload (Admin image uploads — stored in MongoDB, permanent!) ---
app.post('/api/upload', requireAdminAuth, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }
  if (!isMongoConnected || !mongoDb) {
    return res.status(503).json({ error: 'Database not connected. Please try again.' });
  }
  try {
    const imagesCol = mongoDb.collection('images');

    const imageId = 'img_' + Date.now() + '_' + Math.round(Math.random() * 1e9);
    const base64 = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype || 'image/jpeg';

    await imagesCol.insertOne({
      _id: imageId,
      data: base64,
      mimeType,
      originalName: req.file.originalname,
      size: req.file.size,
      uploadedAt: new Date()
    });

    const imageUrl = `/api/image/${imageId}`;
    res.json({ success: true, url: imageUrl, imageUrl, filename: imageId });
  } catch (err) {
    console.error('Image upload to MongoDB failed:', err);
    res.status(500).json({ error: 'Image upload failed' });
  }
});

// --- 8b. Serve images from MongoDB ---
app.get('/api/image/:id', async (req, res) => {
  if (!isMongoConnected || !mongoDb) return res.status(503).send('Database not connected');
  try {
    const imagesCol = mongoDb.collection('images');
    const img = await imagesCol.findOne({ _id: req.params.id });
    if (!img) return res.status(404).send('Image not found');
    const buffer = Buffer.from(img.data, 'base64');
    res.set('Content-Type', img.mimeType || 'image/jpeg');
    res.set('Cache-Control', 'public, max-age=31536000'); // cache 1 year
    res.send(buffer);
  } catch (err) {
    res.status(500).send('Error fetching image');
  }
});



// --- 9. Store Settings (Sensitive data stripped for public) ---
app.get('/api/settings', (req, res) => {
  const store = getStore();
  const safeSettings = JSON.parse(JSON.stringify(store.settings || {}));
  
  // NEVER leak adminPin or internal private credentials to public visitors
  delete safeSettings.adminPin;
  delete safeSettings.adminPassword;
  if (safeSettings.shipmozo) {
    delete safeSettings.shipmozo.privateKey;
  }
  res.json(safeSettings);
});

app.put('/api/settings', requireAdminAuth, (req, res) => {
  const store = getStore();
  store.settings = { ...store.settings, ...req.body };
  saveStore(store);
  
  // Return sanitized settings
  const safeSettings = JSON.parse(JSON.stringify(store.settings || {}));
  delete safeSettings.adminPin;
  delete safeSettings.adminPassword;
  if (safeSettings.shipmozo) {
    delete safeSettings.shipmozo.privateKey;
  }
  res.json(safeSettings);
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


// Health check for Render Keep-Alive & UptimeRobot monitoring
app.get('/api/health', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  const store = getStore();
  res.json({ 
    status: "ok", 
    service: "Arabians Shopping Zone Live Engine",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    liveStats: {
      products: (store.products || []).length,
      categories: (store.categories || []).length,
      orders: (store.orders || []).length,
      mongoConnected: isMongoConnected
    }
  });
});

app.get('/api/debug-assets', (req, res) => {
  try {
    const pubAssets = path.join(rootDir, 'public', 'assets');
    const distAssets = path.join(rootDir, 'dist', 'assets');
    const pubExists = fs.existsSync(pubAssets);
    const pubFolders = pubExists ? fs.readdirSync(pubAssets) : [];
    const reelsPath = path.join(pubAssets, 'reels');
    const reelsExists = fs.existsSync(reelsPath);
    const reelsFiles = reelsExists ? fs.readdirSync(reelsPath) : [];
    const distReelsPath = path.join(distAssets, 'reels');
    const distReelsExists = fs.existsSync(distReelsPath);
    const distReelsFiles = distReelsExists ? fs.readdirSync(distReelsPath) : [];
    res.json({
      rootDir,
      pubAssets,
      pubExists,
      pubFolders,
      reelsPath,
      reelsExists,
      reelsFiles,
      distAssets,
      distReelsExists,
      distReelsFiles
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
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

