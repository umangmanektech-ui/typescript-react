import { useProductStore } from '../store/productStore';
import { useProducts } from '../hooks/useProductQueries';
import { ProductNavbar } from '../components/ProductNavbar';
import { ProductStats } from '../components/ProductStats';
import { ProductFilters } from '../components/ProductFilters';
import { ProductCard } from '../components/ProductCard';
import { ProductTable } from '../components/ProductTable';
import { Pagination } from '../components/Pagination';
import { ProductFormModal } from '../components/ProductFormModal';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { ToastNotification } from '../components/ToastNotification';
import {
  PackageSearch,
  Plus,
  RefreshCw,
  ServerCrash,
  PackageX,
} from 'lucide-react';

export const ProductsPage = () => {
  const {
    searchQuery,
    selectedCategory,
    minPrice,
    maxPrice,
    inStockOnly,
    sortBy,
    sortOrder,
    page,
    limit,
    viewMode,
    openCreateModal,
    resetFilters,
  } = useProductStore();

  const {
    data: productsData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useProducts({
    page,
    limit,
    search: searchQuery,
    category: selectedCategory,
    minPrice,
    maxPrice,
    inStock: inStockOnly ? true : undefined,
    sortBy,
    sortOrder,
  });

  const products = productsData?.products || [];
  const total = productsData?.total || 0;
  const totalPages = productsData?.totalPages || 1;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <ProductNavbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Header & Page Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Product Catalog
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Real-time inventory management connected to your Node & MongoDB REST API.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isFetching && !isLoading && (
              <span className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Updating catalog...</span>
              </span>
            )}
          </div>
        </div>

        {/* Analytics Stats Overview */}
        <ProductStats />

        {/* Filter Toolbar */}
        <ProductFilters />

        {/* Product Catalog Display */}
        {isLoading ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="glass-card rounded-2xl p-5 border border-slate-800/80 animate-pulse space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div className="h-5 w-20 bg-slate-800 rounded-lg"></div>
                  <div className="h-4 w-16 bg-slate-800 rounded-full"></div>
                </div>
                <div className="h-6 w-3/4 bg-slate-800 rounded-lg"></div>
                <div className="h-4 w-full bg-slate-800 rounded-lg"></div>
                <div className="h-4 w-2/3 bg-slate-800 rounded-lg"></div>
                <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
                  <div className="h-6 w-16 bg-slate-800 rounded-lg"></div>
                  <div className="h-8 w-20 bg-slate-800 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          /* Error State with helpful diagnostics */
          <div className="glass-panel rounded-3xl p-8 sm:p-12 text-center border border-rose-500/30 max-w-2xl mx-auto my-12">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <ServerCrash className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Unable to Connect to Backend API
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-lg mx-auto">
              {error?.message ||
                'Failed to load products from http://localhost:5000/api/v1/products.'}
            </p>

            <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-slate-800 text-left text-xs space-y-2 font-mono">
              <p className="text-slate-400 font-sans font-medium text-xs">
                To start your Node backend server:
              </p>
              <div className="p-2.5 rounded-lg bg-slate-950 text-indigo-300 select-all border border-slate-800">
                cd d:\typescript-node && npm run dev
              </div>
              <p className="text-slate-500 text-[11px] font-sans">
                Make sure your API server is listening on port 5000 with endpoint /api/v1/products.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Connection</span>
              </button>
            </div>
          </div>
        ) : products.length === 0 ? (
          /* Empty Search / Catalog State */
          <div className="glass-panel rounded-3xl p-10 sm:p-16 text-center border border-slate-800 max-w-lg mx-auto my-12">
            <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
              {searchQuery || selectedCategory !== 'all' ? (
                <PackageSearch className="w-8 h-8" />
              ) : (
                <PackageX className="w-8 h-8" />
              )}
            </div>

            <h2 className="text-xl font-bold text-white tracking-tight">
              {searchQuery || selectedCategory !== 'all'
                ? 'No matching products found'
                : 'Your catalog is empty'}
            </h2>

            <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try tweaking your search term, adjusting price filters, or clearing the category selection.'
                : 'Get started by creating your first product using your custom API endpoint.'}
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              {searchQuery || selectedCategory !== 'all' ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all cursor-pointer"
                >
                  Clear All Filters
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Product</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Products Grid or Table */
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                {products.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="animate-fade-in">
                <ProductTable products={products} />
              </div>
            )}

            {/* Pagination Controls */}
            <Pagination
              total={total}
              totalPages={totalPages}
              page={page}
              limit={limit}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 glass-panel py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 ProductHub. Integrated with Node / Express / MongoDB API v1.</p>
          <p className="font-mono text-[11px] text-slate-400">Base URL: http://localhost:5000/api/v1</p>
        </div>
      </footer>

      {/* Global Modals & Notifications */}
      <ProductFormModal />
      <ProductDetailModal />
      <DeleteConfirmModal />
      <ToastNotification />
    </div>
  );
};
