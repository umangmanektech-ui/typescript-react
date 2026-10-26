import { Package, DollarSign, Layers, Tag } from 'lucide-react';
import { useProductStats } from '../hooks/useProductQueries';

export const ProductStats = () => {
  const { data: stats, isLoading, isError } = useProductStats();

  if (isError) {
    return null; // Gracefully degrade if endpoint is not responding
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }).format(val || 0);
  };

  const formatNumber = (val: number) => {
    return new Intl.NumberFormat('en-US').format(val || 0);
  };

  const topCategory = stats?.categoryBreakdown && stats.categoryBreakdown.length > 0
    ? [...stats.categoryBreakdown].sort((a, b) => b.count - a.count)[0]
    : null;

  return (
    <section aria-label="Inventory Analytics" className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-indigo-500/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Products
            </span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            {isLoading ? (
              <div className="h-8 w-24 bg-slate-800 animate-pulse rounded-lg"></div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                  {formatNumber(stats?.totalProducts || 0)}
                </span>
                <span className="text-xs text-indigo-400 font-medium">in catalog</span>
              </div>
            )}
          </div>
        </div>

        {/* Total Stock */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-emerald-500/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Stock
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            {isLoading ? (
              <div className="h-8 w-24 bg-slate-800 animate-pulse rounded-lg"></div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                  {formatNumber(stats?.totalStock || 0)}
                </span>
                <span className="text-xs text-emerald-400 font-medium">units stored</span>
              </div>
            )}
          </div>
        </div>

        {/* Average Price */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-amber-500/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Average Price
            </span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            {isLoading ? (
              <div className="h-8 w-24 bg-slate-800 animate-pulse rounded-lg"></div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                  {formatCurrency(stats?.averagePrice || 0)}
                </span>
                <span className="text-xs text-amber-400 font-medium">per item</span>
              </div>
            )}
          </div>
        </div>

        {/* Top Category */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-purple-500/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Categories
            </span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Tag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            {isLoading ? (
              <div className="h-8 w-24 bg-slate-800 animate-pulse rounded-lg"></div>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                  {stats?.categoryBreakdown?.length || 0}
                </span>
                <span className="text-xs text-purple-400 font-medium truncate max-w-[120px]">
                  {topCategory ? `Top: ${topCategory.category}` : 'categories'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
