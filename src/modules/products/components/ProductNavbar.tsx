import { useState, useEffect } from 'react';
import {
  Boxes,
  Plus,
  LayoutGrid,
  Table as TableIcon,
  Search,
  X,
  Server,
  RefreshCw,
} from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useApiHealth } from '../hooks/useProductQueries';
import { useQueryClient } from '@tanstack/react-query';
import { productKeys } from '../hooks/useProductQueries';

export const ProductNavbar = () => {
  const {
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    openCreateModal,
  } = useProductStore();

  const queryClient = useQueryClient();
  const { data: health, isLoading: isHealthLoading, isError: isHealthError, refetch: refetchHealth } = useApiHealth();
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Debounced search sync
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 350);
    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  // Sync if reset externally
  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: productKeys.lists() }),
      queryClient.invalidateQueries({ queryKey: productKeys.stats() }),
      refetchHealth(),
    ]);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const isConnected = !isHealthLoading && !isHealthError && health !== undefined;

  return (
    <header className="sticky top-0 z-30 w-full glass-panel border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3.5 shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950/40 rounded-[14px] flex items-center justify-center backdrop-blur-sm">
              <Boxes className="w-5 h-5 text-indigo-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">ProductHub</span>
              <span className="px-2 py-0.5 text-[11px] font-semibold tracking-wide uppercase rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                v1 API
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Inventory & Catalog Management
            </p>
          </div>
        </div>

        {/* Global Search Input */}
        <div className="flex-1 max-w-md mx-2 relative hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search title, description, SKU..."
              className="w-full bg-slate-900/80 hover:bg-slate-900 focus:bg-slate-900 text-sm text-slate-100 placeholder-slate-400 pl-10 pr-9 py-2.5 rounded-xl border border-slate-700/70 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-inner"
            />
            {localSearch && (
              <button
                type="button"
                onClick={() => setLocalSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Status, View Switcher & Action Button */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* API Health Pill */}
          <div
            className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
              isConnected
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : isHealthLoading
                ? 'bg-amber-950/40 border-amber-500/30 text-amber-300'
                : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
            }`}
            title={`Backend: http://localhost:5000/api/v1 (${isConnected ? 'Online' : 'Offline'})`}
          >
            <span className="relative flex h-2 w-2">
              {isConnected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isConnected
                    ? 'bg-emerald-400'
                    : isHealthLoading
                    ? 'bg-amber-400'
                    : 'bg-rose-400'
                }`}
              ></span>
            </span>
            <Server className="w-3.5 h-3.5 opacity-70" />
            <span>{isConnected ? 'API Live' : isHealthLoading ? 'Connecting...' : 'API Offline'}</span>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-850 active:scale-95 transition-all"
            title="Refresh Catalog & Stats"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Create Product Button */}
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md shadow-indigo-500/25 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>
      </div>
    </header>
  );
};
