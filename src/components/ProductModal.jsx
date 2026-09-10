import React, { useState, useEffect } from 'react';
import { 
  X, 
  Star, 
  Check, 
  ShoppingBag, 
  ArrowRight, 
  MessageSquare, 
  ShieldCheck, 
  Truck, 
  Heart,
  Share2,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import SmartSizeFinderModal from '../components/SmartSizeFinderModal';
import PersonalizationStudio from './PersonalizationStudio';
import { getProductOrderWhatsAppUrl, getRestockInquiryWhatsAppUrl } from '../utils/whatsapp';

export default function ProductModal() {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    addToCart, 
    setIsCheckoutOpen,
    toggleWishlist,
    wishlist,
    settings,
    showToast
  } = useStore();

  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [customization, setCustomization] = useState(null);
  const [qty, setQty] = useState(1);
  const [hasModalImgError, setHasModalImgError] = useState(false);
  const [modalImgClass, setModalImgClass] = useState('object-cover object-center');

  // Stock and Flipkart-Style Size Availability
  const totalSizes = Array.isArray(selectedProduct?.sizes) ? selectedProduct.sizes.length : 0;
  const outSizes = Array.isArray(selectedProduct?.outOfStockSizes) ? selectedProduct.outOfStockSizes : [];
  const isEntireProductOutOfStock = selectedProduct?.inStock === false || (selectedProduct?.stock !== undefined && selectedProduct?.stock <= 0);
  const isSelectedSizeOutOfStock = Boolean(selectedSize && outSizes.includes(selectedSize));
  const isCurrentSelectionUnavailable = isEntireProductOutOfStock || isSelectedSizeOutOfStock;

  // Auto-select first available size
  useEffect(() => {
    if (selectedProduct?.sizes && selectedProduct.sizes.length > 0) {
      const prodOutSizes = selectedProduct.outOfStockSizes || [];
      const firstAvailable = selectedProduct.sizes.find(s => !prodOutSizes.includes(s));
      setSelectedSize(firstAvailable || selectedProduct.sizes[0]);
    } else {
      setSelectedSize(null);
    }
  }, [selectedProduct]);

  const images = selectedProduct?.gallery && selectedProduct.gallery.length > 0 
    ? selectedProduct.gallery 
    : (selectedProduct ? [selectedProduct.image] : []);

  const currentImage = images[activeImage] || selectedProduct?.image;

  useEffect(() => {
    setHasModalImgError(false);
    const isWearing = selectedProduct?.category === 'wearing';
    if (selectedProduct?.imageFit === 'cover') {
      setModalImgClass(isWearing ? 'object-cover object-top' : 'object-cover object-center');
    } else if (selectedProduct?.imageFit === 'contain' || !isWearing) {
      setModalImgClass('object-contain p-3 sm:p-4');
    } else {
      setModalImgClass('object-cover object-top');
    }
  }, [currentImage, selectedProduct]);

  const handleModalImageLoad = (e) => {
    const isWearing = selectedProduct?.category === 'wearing';
    if (selectedProduct?.imageFit === 'cover') {
      setModalImgClass(isWearing ? 'object-cover object-top' : 'object-cover object-center');
      return;
    }
    if (selectedProduct?.imageFit === 'contain' || !isWearing) {
      setModalImgClass('object-contain p-3 sm:p-4');
      return;
    }
    const { naturalWidth, naturalHeight } = e.target;
    if (naturalWidth && naturalHeight) {
      const ratio = naturalWidth / naturalHeight;
      setModalImgClass(ratio < 0.85 ? 'object-cover object-top' : 'object-cover object-center');
    }
  };

  if (!selectedProduct) return null;

  const isWishlisted = wishlist.includes(selectedProduct.id);

  const discountPercent = selectedProduct.mrp > selectedProduct.price
    ? Math.round(((selectedProduct.mrp - selectedProduct.price) / selectedProduct.mrp) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(selectedProduct, qty, selectedSize, customization);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, qty, selectedSize, customization);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedProduct.name,
        text: `Check out ${selectedProduct.name} on Arabians Shopping Zone!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Link copied to clipboard!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl overflow-hidden shadow-2xl border border-amber-500/30 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 flex items-center justify-center transition"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto p-5 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* Gallery Column */}
            <div className="md:col-span-6 space-y-3">
              {/* Main Image Display */}
              <div className="relative aspect-square bg-gradient-to-b from-[#fcfbf9] to-[#f4f1ea] rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center">
                {hasModalImgError ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-emerald-950 via-slate-900 to-amber-950 text-amber-200">
                    <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-3">
                      <Sparkles className="w-7 h-7 text-amber-400" />
                    </div>
                    <span className="text-sm font-serif font-bold text-amber-100 line-clamp-2 px-3">
                      {selectedProduct.name}
                    </span>
                    <span className="text-[10px] text-amber-400/80 uppercase font-mono mt-1">
                      Arabians Authentic
                    </span>
                  </div>
                ) : (
                  <img 
                    src={currentImage} 
                    alt={selectedProduct.name}
                    onLoad={handleModalImageLoad}
                    onError={() => setHasModalImgError(true)}
                    className={`w-full h-full ${modalImgClass}`}
                  />
                )}
                {discountPercent > 0 && (
                  <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full z-10 shadow-sm">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails if multiple */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 bg-slate-50 shrink-0 transition ${
                        activeImage === idx ? 'border-amber-500 shadow-md scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover object-center" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details Column */}
            <div className="md:col-span-6 space-y-4">
              
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span className="uppercase font-bold tracking-wider text-emerald-800">
                    {selectedProduct.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <button onClick={handleShare} className="text-slate-500 hover:text-slate-800 p-1" title="Share">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => toggleWishlist(selectedProduct.id)}
                      className={`p-1 ${isWishlisted ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
                      title="Wishlist"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
                    </button>
                  </div>
                </div>

                <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                  {selectedProduct.name}
                </h2>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-700">{selectedProduct.rating}</span>
                  <span className="text-xs text-slate-400">({selectedProduct.reviewsCount} customer reviews)</span>
                </div>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3 p-3 rounded-xl bg-amber-50/60 border border-amber-200">
                <span className="text-2xl sm:text-3xl font-black text-slate-950">
                  ₹{selectedProduct.price}
                </span>
                {selectedProduct.mrp > selectedProduct.price && (
                  <span className="text-sm sm:text-base text-slate-400 line-through">
                    ₹{selectedProduct.mrp}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Save ₹{selectedProduct.mrp - selectedProduct.price}
                  </span>
                )}
              </div>

              {/* Sizes / Net Weight Selector (Flipkart Style) */}
              {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-bold text-slate-800">Select Thobe Size (Length):</label>
                    {selectedSize && (
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        isSelectedSizeOutOfStock 
                          ? 'bg-rose-50 text-rose-700 border-rose-300' 
                          : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      }`}>
                        Size {selectedSize} {isSelectedSizeOutOfStock ? '(Sold Out)' : '(In Stock)'}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes.map((s) => {
                      const isOOS = outSizes.includes(s);
                      const isSelected = selectedSize === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSelectedSize(s)}
                          className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                            isSelected
                              ? isOOS
                                ? 'bg-slate-900 text-rose-300 border-2 border-rose-500 shadow'
                                : 'bg-[#032219] text-amber-300 border-2 border-amber-500 shadow-sm'
                              : isOOS
                              ? 'bg-slate-100/90 text-slate-400 border border-slate-300 line-through decoration-rose-500 decoration-2 hover:border-slate-400'
                              : 'bg-white text-slate-700 border border-slate-300 hover:border-amber-400'
                          }`}
                        >
                          <span>{s}</span>
                          {isOOS && (
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
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-300/80 text-[11px] text-amber-900 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        Size <strong>{selectedSize}</strong> is currently out of stock. You can inquire restock date on WhatsApp below!
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Master Out-of-Stock Alert */}
              {isEntireProductOutOfStock && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    This product is currently <strong>Out of Stock</strong>. Inquire on WhatsApp to get notified as soon as fresh stock arrives!
                  </span>
                </div>
              )}

              {selectedProduct.netWeight && (
                <div className="text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg inline-block font-medium">
                  Pack Size: <strong>{selectedProduct.netWeight}</strong>
                </div>
              )}

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Key Benefits */}
              {selectedProduct.benefits && (
                <div className="space-y-1.5 pt-1">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Highlights:</h4>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {selectedProduct.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Personalization Studio for Wedding & Custom Keepsakes */}
              <PersonalizationStudio 
                product={selectedProduct} 
                onChange={setCustomization} 
              />

              {/* Quantity & CTAs */}
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 p-1">
                    <button 
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      disabled={isCurrentSelectionUnavailable}
                      className="w-7 h-7 rounded-lg bg-white text-slate-800 font-bold border border-slate-200 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="w-9 text-center font-bold text-xs">{qty}</span>
                    <button 
                      onClick={() => setQty(qty + 1)}
                      disabled={isCurrentSelectionUnavailable}
                      className="w-7 h-7 rounded-lg bg-white text-slate-800 font-bold border border-slate-200 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>

                  {isCurrentSelectionUnavailable ? (
                    <button
                      disabled
                      className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs sm:text-sm border border-slate-300 cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <span>{isSelectedSizeOutOfStock ? `Size ${selectedSize} Sold Out` : 'Product Out of Stock'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 py-3 rounded-xl bg-[#032219] text-amber-300 hover:bg-[#063e2e] font-bold text-xs sm:text-sm shadow transition flex items-center justify-center gap-2 active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart (₹{selectedProduct.price * qty})</span>
                    </button>
                  )}
                </div>

                {isCurrentSelectionUnavailable ? (
                  <button
                    disabled
                    className="w-full py-3.5 rounded-xl bg-slate-200 text-slate-400 font-bold text-xs sm:text-sm cursor-not-allowed flex items-center justify-center gap-1.5"
                  >
                    <span>Currently Unavailable</span>
                  </button>
                ) : (
                  <button
                    onClick={handleBuyNow}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs sm:text-sm hover:from-amber-400 hover:to-amber-500 shadow-gold transition flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <span>Instant Checkout Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {/* WhatsApp Action: Either normal order or Restock date inquiry */}
                {isCurrentSelectionUnavailable ? (
                  <a
                    href={getRestockInquiryWhatsAppUrl(selectedProduct, isSelectedSizeOutOfStock ? selectedSize : null, settings?.whatsapp)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Inquire Restock Date on WhatsApp</span>
                  </a>
                ) : (
                  <a
                    href={getProductOrderWhatsAppUrl(selectedProduct, qty, selectedSize, settings?.whatsapp, customization)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-semibold text-xs transition flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>Order / Inquire on WhatsApp</span>
                  </a>
                )}
              </div>

              {/* Delivery Assurance */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Free delivery above ₹999</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Cash on Delivery verified</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
