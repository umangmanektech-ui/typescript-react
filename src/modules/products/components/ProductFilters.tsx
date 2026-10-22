import React from 'react';
import { useProductStore } from '../store/productStore';
import { useCategoriesQuery } from '../hooks/useProductQueries';
import { Search, RotateCcw, ArrowUpDown, X, Filter } from 'lucide-react';

export const ProductFilters: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    order,
    setSort,
    resetFilters,
  } = useProductStore();

  const { data: categories = [], isLoading: isLoadingCategories } = useCategoriesQuery();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) {
      setSort('', 'asc');
      return;
    }
    const [field, sortOrder] = val.split(':');
    setSort(field, sortOrder as 'asc' | 'desc');
  };

  const currentSortValue = sortBy ? `${sortBy}:${order}` : '';
  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'all' || sortBy !== '';

  return (
    <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 sm:p-5 mb-6 backdrop-blur-md">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by title, description or brand..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          {/* Category Dropdown */}
          <div className="relative min-w-[170px] flex-1 sm:flex-initial">
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                disabled={isLoadingCategories}
                className="w-full bg-transparent text-sm text-slate-200 focus:outline-none cursor-pointer capitalize"
              >
                <option value="all" className="bg-slate-900 text-slate-200">
                  All Categories
                </option>
                {categories.map((cat) => (
                  <option
                    key={cat.slug}
                    value={cat.slug}
                    className="bg-slate-900 text-slate-200 capitalize"
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="relative min-w-[170px] flex-1 sm:flex-initial">
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/50 transition-all">
              <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={currentSortValue}
                onChange={handleSortChange}
                className="w-full bg-transparent text-sm text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="" className="bg-slate-900 text-slate-200">
                  Featured (Default)
                </option>
                <option value="price:asc" className="bg-slate-900 text-slate-200">
                  Price: Low to High
                </option>
                <option value="price:desc" className="bg-slate-900 text-slate-200">
                  Price: High to Low
                </option>
                <option value="rating:desc" className="bg-slate-900 text-slate-200">
                  Highest Rated
                </option>
                <option value="title:asc" className="bg-slate-900 text-slate-200">
                  Alphabetical (A - Z)
                </option>
                <option value="title:desc" className="bg-slate-900 text-slate-200">
                  Alphabetical (Z - A)
                </option>
              </select>
            </div>
          </div>

          {/* Reset button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-sm border border-slate-700/60 transition-all cursor-pointer"
              title="Reset all active filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
