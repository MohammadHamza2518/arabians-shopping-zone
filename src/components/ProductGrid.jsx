import React, { useState, useMemo } from 'react';
import { Sparkles, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import ProductCard from './ProductCard';

export default function ProductGrid() {
  const { 
    products, 
    categories, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    loading 
  } = useStore();

  const [sortBy, setSortBy] = useState('featured');

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter(p => p.category === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Sorting
    if (sortBy === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="catalog-section" className="py-12 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title & Subhead */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Complete Store Catalog</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#032219]">
              Explore Sacred & Royal Collections
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Showing {filteredProducts.length} authentic products across 5 curated categories.
            </p>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-300 text-slate-800 text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="featured">Featured / Best Matches</option>
              <option value="rating">Highest Rated (4.9+)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Pill Filters (Secondary Bar) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar mb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
              selectedCategory === 'all'
                ? 'bg-[#032219] text-amber-400 border-amber-500 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-amber-400'
            }`}
          >
            All Products ({products.length})
          </button>
          {categories.map((c) => {
            const count = products.filter(p => p.category === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                  selectedCategory === c.id
                    ? 'bg-[#032219] text-amber-400 border-amber-500 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-amber-400'
                }`}
              >
                {c.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Active Indicator */}
        {searchQuery && (
          <div className="mb-6 bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-center justify-between text-xs text-amber-900">
            <span>
              Searching for: <strong>"{searchQuery}"</strong> ({filteredProducts.length} results found)
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="font-bold flex items-center gap-1 hover:underline"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Search</span>
            </button>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-200 p-4 space-y-4">
                <div className="bg-slate-200 h-48 rounded-xl"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8 space-y-3">
            <p className="text-slate-500 text-sm">
              No products found matching your search or category filter.
            </p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-5 py-2.5 rounded-xl bg-[#032219] text-amber-300 text-xs font-bold hover:bg-[#063e2e]"
            >
              Reset Filters & Show All Products
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
