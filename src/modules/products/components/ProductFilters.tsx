import { useState } from 'react';
import {
  Filter,
  SlidersHorizontal,
  RotateCcw,
  ArrowUpDown,
  Search,
} from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { PRODUCT_CATEGORIES } from '../../../types/product';

export const ProductFilters = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    inStockOnly,
    setInStockOnly,
    sortBy,
    sortOrder,
    setSort,
    resetFilters,
    searchQuery,
    setSearchQuery,
  } = useProductStore();

  const [showAdvanced, setShowAdvanced] = useState(false);

  // Count active filters
  const activeCount = [
    selectedCategory !== 'all',
    minPrice !== undefined && minPrice > 0,
    maxPrice !== undefined && maxPrice > 0,
    inStockOnly,
    searchQuery.trim() !== '',
    sortBy !== 'createdAt' || sortOrder !== 'desc',
  ].filter(Boolean).length;

  const sortOptions = [
    { label: 'Date Added', value: 'createdAt' },
    { label: 'Price', value: 'price' },
    { label: 'Title / Name', value: 'title' },
    { label: 'Stock Level', value: 'stock' },
    { label: 'Customer Rating', value: 'rating' },
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'glass-card text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          All Categories
        </button>
        {PRODUCT_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'glass-card text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Main Filter Toolbar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        {/* Mobile Search Bar */}
        <div className="w-full md:hidden relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-slate-900 text-sm text-slate-100 placeholder-slate-400 pl-9 pr-4 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mr-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort by:</span>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSort(e.target.value, sortOrder)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-200">
                {opt.label}
              </option>
            ))}
          </select>

          {/* Asc / Desc Toggle */}
          <button
            type="button"
            onClick={() => setSort(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
            title={`Toggle order: current is ${sortOrder.toUpperCase()}`}
          >
            {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
          </button>
        </div>

        {/* In-Stock & Advanced Filters Toggle */}
        <div className="flex items-center gap-3">
          {/* In Stock toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none text-xs sm:text-sm font-medium text-slate-300">
            <div
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
                inStockOnly ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  inStockOnly ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </div>
            <span>In Stock Only</span>
          </label>

          {/* Toggle Price Filter Panel */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
              showAdvanced || (minPrice !== undefined || maxPrice !== undefined)
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Price Range</span>
          </button>

          {/* Reset Filters button */}
          {activeCount > 0 && (
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset ({activeCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filter Collapsible Panel (Price Range) */}
      {showAdvanced && (
        <div className="glass-card rounded-2xl p-4 border border-indigo-500/20 animate-fade-in flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Price Filter ($ USD)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">$</span>
              <input
                type="number"
                min="0"
                placeholder="Min Price"
                value={minPrice !== undefined ? minPrice : ''}
                onChange={(e) =>
                  setMinPrice(e.target.value === '' ? undefined : Number(e.target.value))
                }
                className="w-28 bg-slate-900 text-xs sm:text-sm pl-6 pr-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <span className="text-slate-500 text-xs">to</span>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">$</span>
              <input
                type="number"
                min="0"
                placeholder="Max Price"
                value={maxPrice !== undefined ? maxPrice : ''}
                onChange={(e) =>
                  setMaxPrice(e.target.value === '' ? undefined : Number(e.target.value))
                }
                className="w-28 bg-slate-900 text-xs sm:text-sm pl-6 pr-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {(minPrice !== undefined || maxPrice !== undefined) && (
              <button
                type="button"
                onClick={() => {
                  setMinPrice(undefined);
                  setMaxPrice(undefined);
                }}
                className="text-xs text-slate-400 hover:text-slate-200 underline"
              >
                Clear Price
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
