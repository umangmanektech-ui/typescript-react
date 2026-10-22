import { AlertCircle, Loader2, PackageOpen, RefreshCw, Sparkles } from 'lucide-react';
import React from 'react';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { Pagination } from '../components/Pagination';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { ProductFilters } from '../components/ProductFilters';
import { ProductFormModal } from '../components/ProductFormModal';
import { ProductNavbar } from '../components/ProductNavbar';
import { ProductStats } from '../components/ProductStats';
import { ProductTable } from '../components/ProductTable';
import { ToastNotification } from '../components/ToastNotification';
import { useCategoriesQuery, useProductsQuery } from '../hooks/useProductQueries';
import { useProductStore } from '../store/productStore';

export const ProductsPage: React.FC = () => {
  const {
    searchQuery,
    selectedCategory,
    sortBy,
    order,
    page,
    limit,
    viewMode,
    resetFilters,
    openCreateModal,
  } = useProductStore();

  const skip = (page - 1) * limit;

  const queryParams = {
    limit,
    skip,
    q: searchQuery,
    category: selectedCategory,
    sortBy: sortBy || undefined,
    order: sortBy ? order : undefined,
  };

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useProductsQuery(queryParams);

  const { data: categories = [] } = useCategoriesQuery();

  const products = data?.products || [];
  const total = data?.total || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <ProductNavbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Banner / Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Live API Sandbox
              </span>
              {isFetching && !isLoading && (
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Loader2 className="w-3 h-3 animate-spin text-indigo-400" />
                  Updating...
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Inventory & Products
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-xl">
              Complete full-stack CRUD suite powered by Zustand, React Hook Form, Yup, Axios, and TanStack Query with DummyJSON API.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => refetch()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
              title="Refresh Catalog Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-indigo-400' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Stats Metrics Section */}
        <ProductStats
          products={products}
          totalCount={total}
          totalCategories={categories.length}
        />

        {/* Filters and Search Bar */}
        <ProductFilters />

        {/* Content Section: Loading, Error, Empty, or Data */}
        {isLoading ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-slate-900/50 border border-slate-800/80 p-4 animate-pulse space-y-4"
              >
                <div className="aspect-square w-full rounded-xl bg-slate-800/60" />
                <div className="space-y-2">
                  <div className="h-4 bg-slate-800/80 rounded w-2/3" />
                  <div className="h-3 bg-slate-800/60 rounded w-full" />
                  <div className="h-3 bg-slate-800/40 rounded w-4/5" />
                </div>
                <div className="pt-2 flex justify-between items-center border-t border-slate-800/50">
                  <div className="h-5 bg-slate-800/80 rounded w-16" />
                  <div className="h-4 bg-slate-800/60 rounded w-12" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          /* Error State */
          <div className="rounded-2xl border border-rose-500/20 bg-rose-950/20 p-8 text-center max-w-lg mx-auto my-12 backdrop-blur-md">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Failed to load products</h3>
            <p className="text-xs text-rose-300 mb-6">
              {error?.message || 'Unable to communicate with dummyjson.com. Please check your network and try again.'}
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-12 text-center max-w-md mx-auto my-12 backdrop-blur-md">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto mb-4 border border-slate-700/50">
              <PackageOpen className="w-7 h-7 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No products found</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              No items match your active search keyword or category filter. Try clearing filters or create a new product.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
              <button
                onClick={openCreateModal}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                Add New Product
              </button>
            </div>
          </div>
        ) : (
          /* Data View */
          <div>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <ProductTable products={products} />
            )}

            {/* Pagination Controls */}
            <Pagination total={total} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Built with React 19, TypeScript, Zustand, React Hook Form, Yup, Axios & TanStack Query.
          </p>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Data source:</span>
            <a
              href="https://dummyjson.com/docs/products"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-400 hover:underline inline-flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" /> dummyjson.com
            </a>
          </div>
        </div>
      </footer>

      {/* Modals and Notifications */}
      <ProductFormModal />
      <ProductDetailModal />
      <DeleteConfirmModal />
      <ToastNotification />
    </div>
  );
};

export default ProductsPage;
