import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import { 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  MessageSquare, 
  ShoppingBag, 
  Zap, 
  Heart, 
  Check, 
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Ruler,
  AlertCircle,
  Copy,
  Tag
} from 'lucide-react';
import SmartSizeFinderModal from '../components/SmartSizeFinderModal';
import PersonalizationStudio from '../components/PersonalizationStudio';
import { getProductOrderWhatsAppUrl, getRestockInquiryWhatsAppUrl } from '../utils/whatsapp';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, categories, addToCart, wishlist, toggleWishlist, settings, loading, showToast } = useStore();

  const [directProduct, setDirectProduct] = useState(null);
  const [directLoading, setDirectLoading] = useState(false);

  // Use product from store context or fall back to direct fetched product
  const product = products.find((p) => p.id === id) || directProduct;

  // Real-time safeguard: If product is not found in memory (e.g. freshly created or direct URL), fetch directly
  useEffect(() => {
    if (!products.find((p) => p.id === id) && id && !loading) {
      setDirectLoading(true);
      fetch(`/api/products/${id}?_t=${Date.now()}`, { cache: 'no-store' })
        .then(r => r.json())
        .then(data => {
          if (data && !data.error && data.id) {
            setDirectProduct(data);
          }
        })
        .catch(() => {})
        .finally(() => setDirectLoading(false));
    }
  }, [id, products, loading]);

  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [customization, setCustomization] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [isSizeFinderOpen, setIsSizeFinderOpen] = useState(false);
  const [detailImgClass, setDetailImgClass] = useState('object-cover object-top');
  const [hasDetailImgError, setHasDetailImgError] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  // Stock and Flipkart-Style Size Availability
  const totalSizes = Array.isArray(product?.sizes) ? product.sizes.length : 0;
  const outSizes = Array.isArray(product?.outOfStockSizes) ? product.outOfStockSizes : [];
  const outSizesCount = totalSizes > 0 ? outSizes.filter(s => product.sizes.includes(s)).length : 0;
  const availableSizesCount = Math.max(0, totalSizes - outSizesCount);
  const isAllSizesOutOfStock = totalSizes > 0 && availableSizesCount === 0;
  const isEntireProductOutOfStock = product?.inStock === false || (product?.stock !== undefined && product?.stock <= 0) || isAllSizesOutOfStock;
  const isSelectedSizeOutOfStock = Boolean(selectedSize && outSizes.includes(selectedSize));
  const isCurrentSelectionUnavailable = isEntireProductOutOfStock || isSelectedSizeOutOfStock;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (product) {
      setSelectedImage(product.image);
      setHasDetailImgError(false);
      const isWearing = product.category === 'wearing';
      const isTalbina = product.subcategory === 'talbina';
      const defaultFit = (product.imageFit === 'cover' || isTalbina)
        ? (isWearing ? 'object-cover object-top' : 'object-cover object-center')
        : (isWearing ? 'object-cover object-top' : 'object-contain p-4 sm:p-6');
      setDetailImgClass(defaultFit);
      
      // Auto-select first in-stock size if sizes are defined
      if (product.sizes && product.sizes.length > 0) {
        const prodOutSizes = product.outOfStockSizes || [];
        const firstAvailable = product.sizes.find(s => !prodOutSizes.includes(s));
        setSelectedSize(firstAvailable || product.sizes[0]);
      } else {
        setSelectedSize('');
      }
    }
  }, [id, product]);

  const handleDetailImageLoad = (e) => {
    const isWearing = product?.category === 'wearing';
    const isTalbina = product?.subcategory === 'talbina';
    if (product?.imageFit === 'cover' || isTalbina) {
      setDetailImgClass(isWearing ? 'object-cover object-top' : 'object-cover object-center');
      return;
    }
    if (product?.imageFit === 'contain' || !isWearing) {
      setDetailImgClass('object-contain p-4 sm:p-6');
      return;
    }
    const { naturalWidth, naturalHeight } = e.target;
    if (naturalWidth && naturalHeight) {
      const ratio = naturalWidth / naturalHeight;
      if (ratio < 0.85) {
        setDetailImgClass('object-cover object-top');
      } else {
        setDetailImgClass('object-cover object-center');
      }
    }
  };

  if (loading || directLoading) {
    return (
      <div className="max-w-xl mx-auto px-4 py-28 text-center space-y-4">
        <div className="inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-slate-500 font-medium">Loading authentic product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="text-4xl">📦</div>
        <h2 className="font-serif text-2xl font-bold text-slate-900">Product Not Found</h2>
        <p className="text-xs text-slate-500">The product you are looking for may have been moved or removed from our store.</p>
        <Link to="/shop" className="inline-block px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs">
          Return to Shop
        </Link>
      </div>
    );
  }

  const discountPercent = product.mrp 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
    : 0;

  const categoryObj = categories.find(c => c.id === product.category);
  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, customization);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize, customization);
    navigate('/checkout');
  };

  const handleWhatsAppOrder = () => {
    const waUrl = getProductOrderWhatsAppUrl(product, quantity, selectedSize, settings.whatsapp, customization);
    window.open(waUrl, '_blank');
  };

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const productSchema = product ? {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": [
      product.image?.startsWith('http') ? product.image : `https://arabiansshoppingzone.com${product.image || '/assets/logo/logo_main.png'}`
    ],
    "description": product.description || `Buy authentic ${product.name} at Arabians Shopping Zone. 100% Halal certified.`,
    "sku": product.id,
    "mpn": product.id,
    "brand": {
      "@type": "Brand",
      "name": "Arabians Shopping Zone"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://arabiansshoppingzone.com/#/product/${product.id}`,
      "priceCurrency": "INR",
      "price": product.price,
      "priceValidUntil": "2027-12-31",
      "itemCondition": "https://schema.org/NewCondition",
      "availability": (product.stock && product.stock > 0) ? "https://schema.org/InStock" : "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Arabians Shopping Zone"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating || 5.0,
      "reviewCount": product.reviewsCount || 10,
      "bestRating": "5",
      "worstRating": "1"
    }
  } : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fadeIn">
      
      {/* Dynamic Product SEO & Google Product Rich Snippets */}
      <SEO 
        title={`${product.name} - ₹${product.price} | Arabians Shopping Zone`}
        description={product.description ? `${product.description.slice(0, 150)}... Buy at ₹${product.price} with Cash on Delivery.` : `Buy ${product.name} online at ₹${product.price}. 100% Halal certified with Pan-India express delivery.`}
        image={product.image}
        url={`https://arabiansshoppingzone.com/#/product/${product.id}`}
        type="product"
        schema={productSchema}
      />
      
      {/* Breadcrumbs - Hidden on mobile */}
      <nav className="hidden sm:flex items-center gap-2 text-xs text-slate-500 overflow-x-auto no-scrollbar">
        <Link to="/" className="hover:text-amber-700 transition whitespace-nowrap">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-amber-700 transition whitespace-nowrap">Shop</Link>
        {categoryObj && (
          <>
            <span>/</span>
            <Link to={`/shop?category=${categoryObj.id}`} className="hover:text-amber-700 transition whitespace-nowrap">
              {categoryObj.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main 2-Column Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-sm">
        
        {/* Left Column: Image Gallery (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#fcfbf9] to-[#f4f1ea] border border-slate-200 aspect-square flex items-center justify-center">
            {hasDetailImgError ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-emerald-950 via-slate-900 to-amber-950 text-amber-200">
                <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-3">
                  <Sparkles className="w-8 h-8 text-amber-400" />
                </div>
                <span className="text-sm font-serif font-bold text-amber-100 line-clamp-2 px-4">
                  {product.name}
                </span>
                <span className="text-xs text-amber-400/80 uppercase font-mono mt-1.5">
                  Arabians Authentic Collection
                </span>
              </div>
            ) : (
              <img
                src={selectedImage || product.image}
                alt={product.name}
                onLoad={handleDetailImageLoad}
                onError={() => setHasDetailImgError(true)}
                className={`w-full h-full ${detailImgClass}`}
              />
            )}
            {discountPercent > 0 && (
              <span className="absolute top-3 left-3 bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-full shadow-md z-10">
                {discountPercent}% OFF
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow border border-slate-200 text-slate-400 hover:text-rose-500 transition z-10"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

          {/* Gallery Thumbnails */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition p-1 bg-slate-50 shrink-0 ${
                    selectedImage === img ? 'border-amber-500 shadow-md' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details & Purchase Controls (7 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Header & Badges */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                {categoryObj?.name || 'Islamic Lifestyle'}
              </span>
              {product.badge && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold border border-amber-300/50">
                  {product.badge}
                </span>
              )}
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-bold text-slate-800">{product.rating}</span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">{product.reviewsCount || 65}+ Customer Reviews</span>
              <span className="text-slate-300">•</span>
              {isEntireProductOutOfStock ? (
                <span className="text-rose-600 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  Currently Out of Stock
                </span>
              ) : (
                <span className="text-emerald-700 font-semibold">In Stock ({product.stock || 40} Units)</span>
              )}
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-[#faf8f5] border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500">Special Direct Price:</span>
              <div className="flex items-baseline gap-2.5 mt-0.5">
                <span className="text-3xl font-black text-slate-950 font-serif">₹{product.price}</span>
                {product.mrp && (
                  <span className="text-sm line-through text-slate-400">₹{product.mrp}</span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-bold text-emerald-700">
                    Save ₹{product.mrp - product.price} ({discountPercent}% OFF)
                  </span>
                )}
              </div>
            </div>
            <div className="text-right text-[11px] font-semibold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              {Boolean(product.freeDelivery || product.deliveryChargeType === 'free') ? (
                <div className="text-emerald-800 font-bold">🚚 100% FREE Delivery</div>
              ) : product.deliveryChargeType === 'custom' && product.customDeliveryCharge !== undefined && product.customDeliveryCharge !== null ? (
                <div className="text-emerald-800 font-bold">🚚 Delivery: ₹{product.customDeliveryCharge}</div>
              ) : (
                <div className="text-emerald-800 font-bold">🚚 Free Delivery &gt; ₹{settings?.freeShippingThreshold !== undefined ? settings.freeShippingThreshold : 999}</div>
              )}
              {settings?.onlineDiscountEnabled !== false && (
                <div className="text-emerald-700 text-[10px] font-bold mt-0.5">
                  ⚡ Pay Online & Save {settings?.onlineDiscountType === 'percentage' ? `${settings?.onlineDiscountValue || 5}%` : `₹${settings?.onlineDiscountValue || 50}`}
                </div>
              )}
            </div>
          </div>

          {/* Product-Specific Promo Coupon Banner */}
          {product.couponCode && Number(product.couponDiscount) > 0 && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                    <Tag className="w-3 h-3 text-slate-950" />
                    <span>Special Coupon</span>
                  </span>
                  <span className="font-mono font-black text-amber-950 text-xs px-2 py-0.5 rounded-md bg-amber-100 border border-amber-300">
                    {product.couponCode}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-900">
                  Save {product.couponType === 'percentage' ? `${product.couponDiscount}% OFF` : `Extra ₹${product.couponDiscount} OFF`} on this product!
                </p>
                <p className="text-[11px] text-slate-500">
                  {product.couponDescription || 'Apply this promo code at checkout to claim your discount.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(product.couponCode);
                  setCopiedCoupon(true);
                  if (typeof showToast === 'function') {
                    showToast(`Coupon "${product.couponCode}" copied! Apply at checkout.`);
                  }
                  setTimeout(() => setCopiedCoupon(false), 2500);
                }}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm shrink-0 active:scale-95 cursor-pointer"
              >
                {copiedCoupon ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-slate-950" />}
                <span>{copiedCoupon ? 'Code Copied!' : `Copy: ${product.couponCode}`}</span>
              </button>
            </div>
          )}

          {/* Size or Specification Selector (Flipkart Style) */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <label className="font-bold text-slate-800">Select Tailored Size:</label>
                  {selectedSize && (
                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded border ${
                      isSelectedSizeOutOfStock
                        ? 'bg-rose-50 text-rose-700 border-rose-300'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    }`}>
                      Size {selectedSize} {isSelectedSizeOutOfStock ? '(Sold Out)' : '(In Stock)'}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setIsSizeFinderOpen(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs transition shadow-sm"
                >
                  <Ruler className="w-3.5 h-3.5 text-amber-600" />
                  <span>📏 Smart Size Finder</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => {
                  const isSizeOOS = outSizes.includes(s);
                  const isSelected = selectedSize === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        isSelected
                          ? isSizeOOS
                            ? 'bg-slate-900 text-rose-300 ring-2 ring-rose-500 shadow'
                            : 'bg-slate-950 text-white shadow-md ring-2 ring-amber-400'
                          : isSizeOOS
                          ? 'bg-slate-100/90 text-slate-400 border border-slate-300 line-through decoration-rose-500 decoration-2 hover:border-slate-400'
                          : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <span>{s}</span>
                      {isSizeOOS && (
                        <span className="text-[8px] font-black uppercase text-rose-600 bg-rose-100 px-1 py-0.5 rounded leading-none no-underline">
                          Sold
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Warning banner when selected size is out of stock */}
              {isSelectedSizeOutOfStock && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-300/80 text-xs text-amber-900 flex items-center gap-2.5 mt-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Size <strong>{selectedSize}</strong> is currently out of stock. Leave an inquiry on WhatsApp to be notified when fresh stock arrives!
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Master Out-of-Stock Alert */}
          {isEntireProductOutOfStock && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-xs text-rose-900 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <p className="font-bold">This product is currently Out of Stock.</p>
                <p className="text-[11px] text-rose-700 mt-0.5">
                  You can chat with us on WhatsApp to inquire restock dates or request an offline reservation.
                </p>
              </div>
            </div>
          )}

          {/* Custom Personalization Studio (Nikah Names, Date, Inscriptions) */}
          <PersonalizationStudio 
            product={product} 
            onChange={setCustomization} 
          />

          {/* Quantity & Dual Action Purchase Buttons */}
          <div className="space-y-3 pt-2">
            
            {/* Stepper + Add to Bag Row */}
            <div className="flex items-center gap-2">
              {/* Stepper */}
              <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={isCurrentSelectionUnavailable}
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-xs">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={isCurrentSelectionUnavailable}
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                >
                  +
                </button>
              </div>

              {/* Secondary: Add to Bag */}
              {isCurrentSelectionUnavailable ? (
                <button
                  disabled
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs border border-slate-300 cursor-not-allowed flex items-center justify-center gap-1.5"
                >
                  <span>{isSelectedSizeOutOfStock ? `Size ${selectedSize} Sold Out` : 'Sold Out'}</span>
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition border border-slate-300 flex items-center justify-center gap-1.5 active:scale-95"
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-800 font-bold">Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-slate-700" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* DUAL HERO ACTION BUTTONS: Buy Now + Buy on WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {isCurrentSelectionUnavailable ? (
                <button
                  disabled
                  className="w-full py-3.5 px-4 rounded-xl bg-slate-200 text-slate-400 font-bold text-xs sm:text-sm cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span>Out of Stock</span>
                </button>
              ) : (
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-black text-xs sm:text-sm hover:from-amber-400 hover:to-amber-500 transition shadow-gold flex items-center justify-center gap-2 active:scale-95"
                >
                  <Zap className="w-4 h-4 text-slate-950" />
                  <span>Buy Now (₹{product.price * quantity})</span>
                </button>
              )}

              {isCurrentSelectionUnavailable ? (
                <a
                  href={getRestockInquiryWhatsAppUrl(product, isSelectedSizeOutOfStock ? selectedSize : null, settings?.whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Ask Restock Date on WhatsApp</span>
                </a>
              ) : (
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-slate-950 font-black text-xs sm:text-sm transition shadow-md flex items-center justify-center gap-2 active:scale-95"
                >
                  <MessageSquare className="w-4 h-4 text-slate-950" />
                  <span>Buy via WhatsApp</span>
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>⚡ Express Pan-India Dispatch</span>
              <span>🛡️ Cash on Delivery Available</span>
              <span>🔄 Free Replacement Guarantee</span>
            </div>
          </div>

          {/* Description & Key Highlights */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="font-serif font-bold text-sm text-slate-900">About This Product:</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {product.benefits && product.benefits.length > 0 && (
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 space-y-2">
                <div className="text-xs font-bold text-emerald-900">Key Sunnah Highlights:</div>
                <ul className="space-y-1.5 text-xs text-emerald-800">
                  {product.benefits.map((b, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] text-slate-600">
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <ShieldCheck className="w-4 h-4 text-amber-600 mx-auto" />
              <div className="font-bold text-slate-800">100% Halal</div>
              <div>Certified Authenticity</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <RotateCcw className="w-4 h-4 text-amber-600 mx-auto" />
              <div className="font-bold text-slate-800">7-Day Free Exchange</div>
              <div>Hassle-Free Pickup</div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <Truck className="w-4 h-4 text-amber-600 mx-auto" />
              <div className="font-bold text-slate-800">Pan-India COD</div>
              <div>Fast Doorstep Delivery</div>
            </div>
          </div>

        </div>

      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
              More From {categoryObj?.name || 'This Collection'}
            </h3>
            <Link to={`/shop?category=${product.category}`} className="text-xs font-bold text-amber-700 hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Mobile Sticky Purchase Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 sm:hidden shadow-lg flex items-center justify-between gap-2">
        <div className="min-w-0 pr-1">
          <div className="text-[10px] text-slate-500 font-semibold truncate">Total ({quantity} item)</div>
          <div className="font-serif text-lg font-black text-slate-900">₹{product.price * quantity}</div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleBuyNow}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-gold flex items-center gap-1 active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-slate-950" />
            <span>Buy Now</span>
          </button>
          <button
            onClick={handleWhatsAppOrder}
            className="px-3.5 py-2.5 rounded-xl bg-[#25D366] text-slate-950 font-black text-xs shadow-sm flex items-center gap-1 active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-950" />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Smart Size Finder Modal */}
      <SmartSizeFinderModal
        isOpen={isSizeFinderOpen}
        onClose={() => setIsSizeFinderOpen(false)}
        onSelectSize={(size) => setSelectedSize(size)}
        currentSelectedSize={selectedSize}
      />

    </div>
  );
}
