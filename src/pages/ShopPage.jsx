import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
  Star
} from 'lucide-react';

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
  const [selectedCategory, setSelectedCategory] = useState(activeCategoryParam);
  const [searchQuery, setSearchQuery] = useState('');
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
    const param = searchParams.get('category');
    if (param) setSelectedCategory(param);
  }, [searchParams]);

  const handleCategorySelect = (id) => {
    setSelectedCategory(id);
    if (id === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: id });
    }
  };

  const maxPriceParam = searchParams.get('maxPrice');
  const minPriceParam = searchParams.get('minPrice');

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
        const query = searchQuery.trim().toLowerCase();
        const matchesQuery = 
          !query ||
          (p.name && p.name.toLowerCase().includes(query)) ||
          (p.description && p.description.toLowerCase().includes(query)) ||
          (p.category && p.category.toLowerCase().includes(query)) ||
          (p.badge && p.badge.toLowerCase().includes(query)) ||
          (p.tags && Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(query)));
        
        const matchesMaxPrice = !maxPriceParam || (Number(p.price) <= Number(maxPriceParam));
        const matchesMinPrice = !minPriceParam || (Number(p.price) >= Number(minPriceParam));

        return matchesCat && matchesQuery && matchesMaxPrice && matchesMinPrice;
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
  }, [products, selectedCategory, searchQuery, sortBy]);

  const currentCategoryObj = categories.find(c => c.id === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fadeIn">
      
      {/* Breadcrumb Navigation - Hidden on mobile screens */}
      <nav className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-amber-700 transition">Home</Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold">Store Catalog</span>
        {currentCategoryObj && (
          <>
            <span>/</span>
            <span className="text-amber-700 font-bold">{currentCategoryObj.name}</span>
          </>
        )}
      </nav>

      {/* Page Header Banner */}
      <div className="bg-gradient-to-r from-[#032219] via-[#053527] to-[#032219] text-white p-6 sm:p-10 rounded-3xl border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Complete Sacred Catalog</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-white">
            {currentCategoryObj ? currentCategoryObj.name : 'All Collections & Products'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
            {currentCategoryObj?.subtitle || 'Explore certified Sunnah superfoods, bespoke Emirati thobes, aged Cambodian oud, and sacred Nikah essentials.'}
          </p>
        </div>
      </div>

      {/* Category Filter Pills & Search Bar */}
      <div className="space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-gold'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-amber-400'
            }`}
          >
            All Products ({products.length})
          </button>

          {categories.map((cat) => {
            const count = products.filter(p => p.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-gold'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-amber-400'
                }`}
              >
                <span>{cat.name}</span>
                <span className="ml-1.5 text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Filter Controls Row: Search + Sort */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search by name, flavor, or fabric..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
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

          {/* Sort Dropdown */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-3 text-xs text-slate-600">
            <span className="font-medium whitespace-nowrap">
              Showing <strong className="text-slate-900">{filteredProducts.length}</strong> items
            </span>

            {/* Custom Luxury Sort Dropdown */}
            <div className="relative" ref={sortDropdownRef}>
              <button
                data-testid="sort-trigger"
                type="button"
                onClick={() => setIsSortOpen(!isSortOpen)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border shadow-sm cursor-pointer ${
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
                    <span>Sort Collection</span>
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

        {/* Active Price Filter Chip */}
        {(maxPriceParam || minPriceParam) && (
          <div className="flex items-center gap-2 pt-1 text-xs">
            <span className="text-slate-500 font-medium">Budget Filter:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300/80 shadow-sm">
              <span>{maxPriceParam ? `Items Under ₹${maxPriceParam}` : `Items Above ₹${minPriceParam}`}</span>
              <button
                type="button"
                onClick={() => {
                  searchParams.delete('maxPrice');
                  searchParams.delete('minPrice');
                  setSearchParams(searchParams);
                }}
                className="hover:text-rose-600 cursor-pointer ml-1 p-0.5 rounded-full hover:bg-amber-200 transition"
                title="Clear filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 mx-auto flex items-center justify-center text-xl">
            🔍
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-slate-900">No Matching Items Found</h3>
            <p className="text-xs text-slate-500">
              We couldn't find any items matching "{searchQuery}". Try selecting another category or clearing your search.
            </p>
          </div>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
}
