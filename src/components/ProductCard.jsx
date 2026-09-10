import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Eye, Sparkles, ImageOff } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { isProductCustomizable } from './PersonalizationStudio';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlist } = useStore();
  const isWishlisted = wishlist.includes(product.id);

  // Determine initial fit:
  // 'wearing' category (thobes/models) uses full-bleed object-cover object-top.
  // All packaged goods (health, fragrance, decor, wedding) use object-contain with gentle padding so NO product is cropped!
  const isWearing = product.category === 'wearing';
  const isTalbina = product.subcategory === 'talbina';
  const getFitClass = () => {
    if (product.imageFit === 'cover' || isTalbina) return isWearing ? 'object-cover object-top' : 'object-cover object-center';
    if (product.imageFit === 'contain') return 'object-contain p-2.5 sm:p-3';
    return isWearing ? 'object-cover object-top' : 'object-contain p-2.5 sm:p-3';
  };

  const [imgClass, setImgClass] = useState(getFitClass);
  const [hasImgError, setHasImgError] = useState(false);

  useEffect(() => {
    setHasImgError(false);
    setImgClass(getFitClass());
  }, [product.image, product.imageFit, product.category, product.subcategory]);

  const discountPercent = product.mrp && product.price && Number(product.mrp) > Number(product.price)
    ? Math.round(((Number(product.mrp) - Number(product.price)) / Number(product.mrp)) * 100) 
    : 0;

  // Stock and Flipkart-Style Size Availability
  const totalSizes = Array.isArray(product.sizes) ? product.sizes.length : 0;
  const outSizes = Array.isArray(product.outOfStockSizes) ? product.outOfStockSizes : [];
  const outSizesCount = totalSizes > 0 ? outSizes.filter(s => product.sizes.includes(s)).length : 0;
  const availableSizesCount = Math.max(0, totalSizes - outSizesCount);
  const isAllSizesOutOfStock = totalSizes > 0 && availableSizesCount === 0;
  const isOutOfStock = product.inStock === false || (product.stock !== undefined && product.stock <= 0) || isAllSizesOutOfStock;

  const handleImageLoad = (e) => {
    if (product.imageFit === 'cover' || isTalbina) {
      setImgClass(isWearing ? 'object-cover object-top' : 'object-cover object-center');
      return;
    }
    if (product.imageFit === 'contain' || !isWearing) {
      setImgClass('object-contain p-2.5 sm:p-3');
      return;
    }
    const { naturalWidth, naturalHeight } = e.target;
    if (naturalWidth && naturalHeight) {
      const ratio = naturalWidth / naturalHeight;
      if (ratio < 0.85) {
        setImgClass('object-cover object-top');
      } else {
        setImgClass('object-cover object-center');
      }
    }
  };

  return (
    <div 
      data-testid="product-card"
      data-price={product.price}
      data-rating={product.rating}
      className="group bg-white rounded-2xl overflow-hidden border border-amber-900/10 hover:border-amber-500/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
    >
      
      {/* Clickable Image & Badges - Uniform 1:1 Luxury Studio Square Frame */}
      <Link 
        to={`/product/${product.id}`} 
        className="relative aspect-square bg-gradient-to-b from-[#fcfbf9] to-[#f4f1ea] overflow-hidden flex items-center justify-center cursor-pointer select-none"
      >
        
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 left-2.5 bg-rose-600 text-white font-black text-[9px] sm:text-[10px] px-2.5 py-0.5 rounded-full shadow-md z-10 max-w-[calc(100%-3.5rem)] truncate">
            {discountPercent}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
          className="absolute top-2.5 right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 shadow-sm hover:scale-110 active:scale-90 transition z-10"
          aria-label="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Product Image with Smart Aspect-Aware Fit & Error Fallback */}
        {hasImgError ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-emerald-950 via-slate-900 to-amber-950 text-amber-200">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mb-2">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <span className="text-[11px] font-serif font-bold text-amber-100 line-clamp-2 px-2">
              {product.name}
            </span>
            <span className="text-[9px] text-amber-400/80 uppercase font-mono mt-1">
              Arabians Authentic
            </span>
          </div>
        ) : (
          <img 
            src={product.image} 
            alt={product.name}
            onLoad={handleImageLoad}
            onError={() => setHasImgError(true)}
            className={`w-full h-full ${imgClass} group-hover:scale-105 transition-transform duration-500`}
            loading="lazy"
          />
        )}

        {/* Out of Stock Overlay Banner */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-10 p-2 text-center">
            <span className="bg-slate-950/95 text-rose-300 border border-rose-500/50 font-black text-[10px] sm:text-xs px-3 py-1.5 rounded-full uppercase tracking-wider shadow-xl flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick View overlay on desktop (only when in stock) */}
        {!isOutOfStock && (
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <span className="bg-white/95 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-amber-600" />
              <span>View Details</span>
            </span>
          </div>
        )}
      </Link>

      {/* Details & Actions */}
      <div className="p-3 sm:p-4 space-y-2 flex-1 flex flex-col justify-between">
        
        <div className="space-y-1.5">
          {/* Category, Special Badge & Rating */}
          <div className="flex items-center justify-between gap-1 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <span className="uppercase tracking-wider font-bold text-emerald-800 text-[10px]">
                {product.category}
              </span>
              {product.subcategory && (
                <span className="text-[10px] text-slate-400 font-medium capitalize truncate max-w-[85px] hidden xs:inline">
                  • {product.subcategory.replace(/-/g, ' ')}
                </span>
              )}
              {product.badge && product.badge.trim() !== '' && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300/60 leading-none truncate max-w-[100px]">
                  {product.badge.trim()}
                </span>
              )}
              {isProductCustomizable(product) && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-300/80 leading-none truncate flex items-center gap-0.5">
                  👑 Custom Names
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-amber-500 font-bold shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <Link 
            to={`/product/${product.id}`}
            className="font-serif font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 hover:text-[#064e3b] transition-colors block"
          >
            {product.name}
          </Link>

          {/* Sizing or Weight Tag with Stock Awareness */}
          {(product.netWeight || totalSizes > 0) && (
            <div className="text-[10px] sm:text-[11px] text-slate-500">
              {product.netWeight ? (
                <span>{product.netWeight}</span>
              ) : totalSizes > 0 ? (
                isOutOfStock ? (
                  <span className="text-rose-600 font-bold">All Sizes Out of Stock</span>
                ) : outSizesCount > 0 ? (
                  <span className="text-amber-700 font-medium">
                    {availableSizesCount} of {totalSizes} Sizes In Stock
                  </span>
                ) : (
                  <span>{totalSizes} Sizes Available</span>
                )
              ) : null}
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm sm:text-base font-black text-slate-950 font-serif">
                ₹{product.price}
              </span>
              {product.mrp > product.price && (
                <span className="text-[11px] text-slate-400 line-through">
                  ₹{product.mrp}
                </span>
              )}
            </div>
          </div>

          {isOutOfStock ? (
            <span 
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 text-slate-400 border border-slate-200 text-xs font-bold select-none cursor-not-allowed"
              title="Currently out of stock"
            >
              Sold Out
            </span>
          ) : (
            <button
              type="button"
              onClick={() => addToCart(product, 1)}
              className="px-3 py-1.5 rounded-xl bg-[#032219] text-amber-300 hover:bg-[#063e2e] active:scale-95 transition-all text-xs font-bold flex items-center gap-1.5 shadow-sm"
              aria-label="Add to cart"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Add</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
