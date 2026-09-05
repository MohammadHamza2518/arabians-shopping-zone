import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import { useStore } from '../context/StoreContext';
import { 
  Sparkles, 
  SlidersHorizontal, 
  Search, 
  ArrowLeft, 
  X,
  ChevronDown,
  Check,
  TrendingUp,
  TrendingDown,
  Star,
  Layers,
  Tag,
  Filter,
  Wheat,
  Droplets,
  Flame,
  Scroll,
  Gift,
  Feather,
  Flower2,
  Gem,
  Compass,
  Clock,
  Shirt,
  HeartPulse,
  BookOpen,
  Package
} from 'lucide-react';

import {
  BrowseCategoriesHeaderIcon,
  AllProductsRoyalIcon,
  ArabianThobeIcon,
  SunnahFoodIcon,
  ArabianOudIcon,
  IslamicDecorIcon,
  NikahWeddingIcon
} from '../components/CategoryIcons';

const CUSTOM_ICON_MAP = {
  Shirt,
  HeartPulse,
  Droplets,
  Flame,
  BookOpen,
  Gift,
  Gem,
  Clock,
  Compass,
  Scroll,
  Sparkles,
  Package,
  Layers
};

const CATEGORY_ICONS = {
  all: AllProductsRoyalIcon,
  wearing: ArabianThobeIcon,
  health: SunnahFoodIcon,
  fragrance: ArabianOudIcon,
  decor: IslamicDecorIcon,
  wedding: NikahWeddingIcon
};

const SUBCATEGORY_ICONS = {
  // Wearing
  'thobes': ArabianThobeIcon,
  'amama': AllProductsRoyalIcon,
  'rumal': Layers,
  'caps': AllProductsRoyalIcon,
  'bisht': ArabianThobeIcon,
  'turban': AllProductsRoyalIcon,
  
  // Health
  'talbina': Wheat,
  'honey-mix': SunnahFoodIcon,
  'pure-honey': Droplets,
  
  // Fragrance
  'perfume': ArabianOudIcon,
  'attar': Droplets,
  'bakhoor': Flame,
  'burner': Flame,
  'roomspray': Sparkles,
  'bodyspray': Sparkles,
  'essential-oil': Droplets,
  'oudwood': Flame,
  'dehnuloud': ArabianOudIcon,
  'carperfume': Compass,
  
  // Decor
  'acrylic-tugra': IslamicDecorIcon,
  'acrylic-clock': Clock,
  'resin-clock': Clock,
  'resin-tugre': IslamicDecorIcon,
  'acrylic-accessories': Gem,
  
  // Wedding
  'nikah-booklet': Scroll,
  'booklet-box': Gift,
  'nikah-pen': Feather,
  'thumb-board': NikahWeddingIcon,
  'nikah-mirror': Sparkles,
  'nikah-dupatta': NikahWeddingIcon,
  'nikah-sehra': Flower2,
  'haq-mehar': Gift,
  'all-wedding': NikahWeddingIcon
};

const SORT_OPTIONS = [
  { id: 'featured', label: 'Sort: Featured', icon: Sparkles },
  { id: 'price-low', label: 'Price: Low to High', icon: TrendingUp },
  { id: 'price-high', label: 'Price: High to Low', icon: TrendingDown },
  { id: 'rating', label: 'Highest Rated', icon: Star }
];

export default function ShopPage() {
  const { products, categories } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategoryParam = searchParams.get('category') || 'all';
  const activeSubParam = searchParams.get('sub') || searchParams.get('subcategory') || 'all';
  const activeSearchParam = searchParams.get('search') || searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState(activeCategoryParam);
  const [selectedSubcategory, setSelectedSubcategory] = useState(activeSubParam);
  const [searchQuery, setSearchQuery] = useState(activeSearchParam);
  const [sortBy, setSortBy] = useState('featured');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    const sub = searchParams.get('sub') || searchParams.get('subcategory') || 'all';
    const q = searchParams.get('search') || searchParams.get('q') || '';
    setSelectedCategory(cat);
    setSelectedSubcategory(sub);
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const handleClearSearch = () => {
    setSearchQuery('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    newParams.delete('q');
    setSearchParams(newParams);
  };

  const handleCategorySelect = (id) => {
    setSelectedCategory(id);
    setSelectedSubcategory('all');
    const newParams = new URLSearchParams(searchParams);
    if (id === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', id);
    }
    newParams.delete('sub');
    newParams.delete('subcategory');
    setSearchParams(newParams);
  };

  const handleSubcategorySelect = (subId) => {
    setSelectedSubcategory(subId);
    const newParams = new URLSearchParams(searchParams);
    if (subId === 'all') {
      newParams.delete('sub');
      newParams.delete('subcategory');
    } else {
      newParams.set('sub', subId);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSearchParams({});
  };

  const maxPriceParam = searchParams.get('maxPrice');
  const minPriceParam = searchParams.get('minPrice');

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const pCat = (p.category || '').toLowerCase().trim();
        const selCat = (selectedCategory || 'all').toLowerCase().trim();
        const matchesCat = selCat === 'all' || pCat === selCat;

        const pSub = (p.subcategory || p.subCategory || '').toLowerCase().trim();
        const selSub = (selectedSubcategory || 'all').toLowerCase().trim();
        const matchesSub = selSub === 'all' || pSub === selSub;

        const query = searchQuery.trim().toLowerCase();
        const tagsStr = Array.isArray(p.tags) 
          ? p.tags.join(' ').toLowerCase() 
          : (typeof p.tags === 'string' ? p.tags.toLowerCase() : '');
        const benefitsStr = Array.isArray(p.benefits)
          ? p.benefits.join(' ').toLowerCase()
          : (typeof p.benefits === 'string' ? p.benefits.toLowerCase() : '');

        const matchesQuery = 
          !query ||
          (p.name && p.name.toLowerCase().includes(query)) ||
          (p.description && p.description.toLowerCase().includes(query)) ||
          (p.category && p.category.toLowerCase().includes(query)) ||
          (pSub && pSub.includes(query)) ||
          (p.badge && p.badge.toLowerCase().includes(query)) ||
          tagsStr.includes(query) ||
          benefitsStr.includes(query) ||
          (p.price !== undefined && String(p.price).includes(query));
        
        const priceNum = Number(p.price) || 0;
        const matchesMaxPrice = !maxPriceParam || (priceNum <= Number(maxPriceParam));
        const matchesMinPrice = !minPriceParam || (priceNum >= Number(minPriceParam));

        return matchesCat && matchesSub && matchesQuery && matchesMaxPrice && matchesMinPrice;
      })
      .sort((a, b) => {
        const priceA = Number(a.price) || 0;
        const priceB = Number(b.price) || 0;
        const ratingA = Number(a.rating) || 0;
        const ratingB = Number(b.rating) || 0;

        if (sortBy === 'price-low') {
          return priceA - priceB;
        }
        if (sortBy === 'price-high') {
          return priceB - priceA;
        }
        if (sortBy === 'rating') {
          if (ratingB !== ratingA) {
            return ratingB - ratingA;
          }
          return (Number(b.reviewsCount) || 0) - (Number(a.reviewsCount) || 0);
        }
        return 0; // Default curated order
      });
  }, [products, selectedCategory, selectedSubcategory, searchQuery, sortBy, maxPriceParam, minPriceParam]);

  const currentCategoryObj = categories.find(c => c.id === selectedCategory);
  const currentSubcategoryObj = currentCategoryObj?.subcategories?.find(s => s.id === selectedSubcategory);

  const seoTitle = useMemo(() => {
    if (searchQuery) return `Search results for "${searchQuery}" | Arabians Shopping Zone`;
    if (selectedCategory === 'wearing') return "Saudi Thobes, Jubbas & Royal Islamic Men's Attire | Arabians Shopping Zone";
    if (selectedCategory === 'wedding') return "Muslim Wedding Essentials & Custom Nikah Nama Booklets | Arabians Shopping Zone";
    if (selectedCategory === 'decor') return "Islamic Wall Art & 3D Acrylic Ayatul Kursi Clocks | Arabians Shopping Zone";
    if (selectedCategory === 'fragrance') return "Pure Dehnul Oud, Alcohol-Free Attars & Bakhoor | Arabians Shopping Zone";
    if (selectedCategory === 'health') return "Authentic Sunnah Talbina & Pure Sidr Honey | Arabians Shopping Zone";
    if (currentCategoryObj) return `${currentCategoryObj.name} | Arabians Shopping Zone`;
    return "Shop Royal Sunnah Lifestyle & Authentic Islamic Essentials | Arabians Shopping Zone";
  }, [selectedCategory, searchQuery, currentCategoryObj]);

  const seoDescription = useMemo(() => {
    if (selectedCategory === 'wearing') return "Shop royal Saudi cut thobes, Emirati jubbas, Madani green amamas, and luxury velvet prayer caps. Handcrafted with bespoke tailoring and Pan-India delivery.";
    if (selectedCategory === 'wedding') return "Explore heirloom quality velvet Nikah Nama certificate booklets, custom engraved acrylic boxes, feather signing pens, and Haq Mehar gift chests.";
    if (selectedCategory === 'decor') return "Transform your home with 3D gold mirror acrylic Ayatul Kursi Tugra wall art, resin geode silent sweep clocks, and handcrafted Quran rehal stands.";
    if (selectedCategory === 'fragrance') return "Discover pure aged Dehnul Oud, royal concentrated attars, Arabian bakhoor muattar, and electric brass mabkhara burners.";
    if (selectedCategory === 'health') return "Authentic Sunnah Talbina packed with roasted dry fruits and 100% pure raw Sidr honey for vital energy and holistic wellbeing.";
    return "Browse Arabians Shopping Zone complete catalog of royal Islamic lifestyle products, 100% Halal certified with express Pan-India Cash on Delivery.";
  }, [selectedCategory]);

  // Active filters count
  const hasActiveFilters = selectedCategory !== 'all' || selectedSubcategory !== 'all' || searchQuery || maxPriceParam || minPriceParam;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* Dynamic SEO Optimization */}
      <SEO 
        title={seoTitle}
        description={seoDescription}
        url={`https://arabiansshoppingzone.com/#/shop${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`}
      />
      
      {/* Breadcrumb Navigation - Hidden on mobile screens */}
      <nav className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-amber-700 transition">Home</Link>
        <span>/</span>
        <button 
          onClick={() => handleCategorySelect('all')}
          className={`hover:text-amber-700 transition ${selectedCategory === 'all' ? 'text-slate-900 font-semibold' : ''}`}
        >
          Store Catalog
        </button>
        {currentCategoryObj && (
          <>
            <span>/</span>
            <button 
              onClick={() => handleSubcategorySelect('all')}
              className={`hover:text-amber-700 transition ${selectedSubcategory === 'all' ? 'text-amber-700 font-bold' : 'text-slate-600'}`}
            >
              {currentCategoryObj.name}
            </button>
          </>
        )}
        {currentSubcategoryObj && (
          <>
            <span>/</span>
            <span className="text-amber-700 font-black">{currentSubcategoryObj.name}</span>
          </>
        )}
      </nav>

      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-[#032219] via-[#053527] to-[#032219] text-white p-5 sm:p-10 rounded-3xl border border-amber-500/30 shadow-xl relative overflow-hidden">
        {/* Subtle Decorative Pattern Overlay */}
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute right-6 bottom-4 hidden md:block opacity-20 pointer-events-none text-right font-serif text-8xl text-amber-300">
          العرب
        </div>

        <div className="relative z-10 max-w-2xl space-y-2 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
            {React.createElement(
              (currentCategoryObj?.icon && CUSTOM_ICON_MAP[currentCategoryObj.icon]) || CATEGORY_ICONS[selectedCategory] || AllProductsRoyalIcon, 
              { className: "w-3.5 h-3.5 text-amber-400" }
            )}
            <span>
              {currentSubcategoryObj 
                ? `${currentCategoryObj?.name} • ${currentSubcategoryObj.name}`
                : currentCategoryObj 
                  ? currentCategoryObj.name 
                  : 'Official Certified Sunnah & Luxury Collection'}
            </span>
          </div>

          <h1 className="font-serif text-xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            {currentSubcategoryObj 
              ? currentSubcategoryObj.name
              : currentCategoryObj 
                ? currentCategoryObj.name 
                : 'All Royal Collections & Products'}
          </h1>

          <p className="text-xs sm:text-sm text-emerald-200/85 leading-relaxed max-w-xl">
            {currentCategoryObj?.subtitle || 'Explore certified Sunnah superfoods, bespoke Emirati thobes, aged Cambodian oud, and sacred Nikah ceremony essentials.'}
          </p>

          <div className="pt-1 flex items-center gap-3 text-xs text-amber-400/90 font-medium">
            <span className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {filteredProducts.length} Authenticated Items
            </span>
            <span>•</span>
            <span>100% Genuine Guarantee</span>
          </div>
        </div>
      </div>

      {/* Main Category Filter Strip */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <BrowseCategoriesHeaderIcon className="w-4 h-4 text-amber-600" />
            <span>Browse Categories</span>
          </h2>
          <span className="text-[11px] text-slate-400 font-medium">
            Total {products.length} Products
          </span>
        </div>

        {/* Category Horizontal Scrolling Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {/* All Button */}
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#032219] text-amber-300 border border-amber-500/50 shadow-md scale-100'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-amber-400 hover:bg-slate-50'
            }`}
          >
            <AllProductsRoyalIcon className={`w-3.5 h-3.5 ${selectedCategory === 'all' ? 'text-amber-400' : 'text-slate-400'}`} />
            <span>All Products</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              selectedCategory === 'all' ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-100 text-slate-500'
            }`}>
              {products.length}
            </span>
          </button>

          {/* Dynamic Categories with Icons */}
          {categories.map((cat) => {
            const count = products.filter(p => p.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            const Icon = (cat.icon && CUSTOM_ICON_MAP[cat.icon]) || CATEGORY_ICONS[cat.id] || Sparkles;

            return (
              <button
                key={cat.id}
                data-testid={`cat-btn-${cat.id}`}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-[#032219] text-amber-300 border border-amber-500/50 shadow-md'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-amber-400 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isSelected ? 'bg-amber-400/20 text-amber-300' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Subcategory Filter Strip (When Category is Selected) */}
      {currentCategoryObj && currentCategoryObj.subcategories && currentCategoryObj.subcategories.length > 0 && (
        <div className="bg-amber-50/50 p-3 sm:p-4 rounded-2xl border border-amber-200/80 space-y-2.5 animate-fadeIn">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-amber-900 font-bold">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>Filter by {currentCategoryObj.name} Type:</span>
            </div>
            <span className="text-[10px] text-amber-700/80 font-medium hidden sm:inline">
              Select a subcategory to refine results
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-1">
            {/* All in this category */}
            <button
              onClick={() => handleSubcategorySelect('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedSubcategory === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-sm font-extrabold'
                  : 'bg-white text-slate-700 border border-amber-200/80 hover:bg-amber-100/60'
              }`}
            >
              All {currentCategoryObj.name.split(' ')[0]} ({products.filter(p => p.category === selectedCategory).length})
            </button>

            {currentCategoryObj.subcategories.map((sub) => {
              const count = products.filter(p => p.category === selectedCategory && ((p.subcategory || p.subCategory) === sub.id)).length;
              const isSelected = selectedSubcategory === sub.id;
              const SubIcon = SUBCATEGORY_ICONS[sub.id] || Sparkles;

              return (
                <button
                  key={sub.id}
                  data-testid={`sub-btn-${sub.id}`}
                  onClick={() => handleSubcategorySelect(sub.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-sm font-extrabold ring-1 ring-amber-600'
                      : 'bg-white text-slate-700 border border-amber-200/80 hover:bg-amber-100/60'
                  }`}
                >
                  <SubIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-amber-700'}`} />
                  <span>{sub.name}</span>
                  <span className={`text-[10px] px-1 rounded-md font-semibold ${
                    isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter Controls Row: Search Box + Sort Dropdown */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Box */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by product name, fabric, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 transition"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Counter and Sort Dropdown */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-3 text-xs text-slate-600">
          <span className="font-medium whitespace-nowrap">
            Showing <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> items
          </span>

          {/* Custom Luxury Sort Dropdown */}
          <div className="relative" ref={sortDropdownRef}>
            <button
              data-testid="sort-trigger"
              type="button"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
                isSortOpen 
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-gold' 
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:border-amber-400'
              }`}
              aria-expanded={isSortOpen}
              aria-haspopup="listbox"
            >
              <SlidersHorizontal className={`w-3.5 h-3.5 ${isSortOpen ? 'text-slate-950' : 'text-amber-600'}`} />
              <span>{SORT_OPTIONS.find(o => o.id === sortBy)?.label || 'Sort: Featured'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isSortOpen ? 'rotate-180 text-slate-950' : 'text-slate-400'}`} />
            </button>

            {/* Luxury Popup Menu */}
            {isSortOpen && (
              <div 
                role="listbox"
                className="absolute right-0 top-full mt-2 w-52 sm:w-56 bg-white/95 backdrop-blur-xl rounded-2xl border border-amber-500/30 shadow-2xl p-1.5 z-40 space-y-1 animate-fadeIn ring-1 ring-black/5"
              >
                <div className="px-2.5 py-1.5 text-[10px] font-black uppercase tracking-wider text-amber-700/80 border-b border-slate-100 flex items-center justify-between">
                  <span>Sort Catalog</span>
                  <span className="text-[9px] text-slate-400 font-normal">Select One</span>
                </div>
                {SORT_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = sortBy === opt.id;
                  return (
                    <button
                      key={opt.id}
                      role="option"
                      aria-selected={isSelected}
                      type="button"
                      onClick={() => {
                        setSortBy(opt.id);
                        setIsSortOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[#032219] text-amber-300 font-bold shadow-sm'
                          : 'text-slate-700 hover:bg-amber-50/70 hover:text-slate-950'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                        <span>{opt.label}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Filter Chips Bar (Category, Subcategory, Search, Budget) */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap text-xs bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80">
          <span className="text-slate-500 font-bold text-[11px] uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3 h-3 text-amber-600" />
            <span>Active Filters:</span>
          </span>

          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-950 text-xs font-bold border border-emerald-300">
              <span>Category: {currentCategoryObj?.name || selectedCategory}</span>
              <button
                onClick={() => handleCategorySelect('all')}
                className="hover:text-rose-600 ml-1 cursor-pointer"
                title="Remove category filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedSubcategory !== 'all' && currentSubcategoryObj && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-950 text-xs font-bold border border-amber-300">
              <span>Type: {currentSubcategoryObj.name}</span>
              <button
                onClick={() => handleSubcategorySelect('all')}
                className="hover:text-rose-600 ml-1 cursor-pointer"
                title="Remove subcategory filter"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-200 text-slate-800 text-xs font-bold">
              <span>Search: "{searchQuery}"</span>
              <button
                onClick={handleClearSearch}
                className="hover:text-rose-600 ml-1 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {(maxPriceParam || minPriceParam) && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-950 text-xs font-bold border border-indigo-200">
              <span>{maxPriceParam ? `Under ₹${maxPriceParam}` : `Above ₹${minPriceParam}`}</span>
              <button
                onClick={() => {
                  searchParams.delete('maxPrice');
                  searchParams.delete('minPrice');
                  setSearchParams(searchParams);
                }}
                className="hover:text-rose-600 ml-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={handleResetFilters}
            className="ml-auto text-[11px] font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-4 max-w-md mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-600 mx-auto flex items-center justify-center text-2xl">
            🔍
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-slate-900">No Matching Items Found</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We couldn't find any items matching your current filters. Try selecting a different subcategory or resetting your search.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-[#032219] text-amber-300 font-bold text-xs hover:bg-[#053527] transition shadow-md cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}

    </div>
  );
}

