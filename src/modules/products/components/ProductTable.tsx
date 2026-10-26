import { Eye, Edit3, Trash2, Star, ArrowUpDown } from 'lucide-react';
import type { Product } from '../../../types/product';
import { useProductStore } from '../store/productStore';

interface ProductTableProps {
  products: Product[];
}

export const ProductTable = ({ products }: ProductTableProps) => {
  const {
    openViewModal,
    openEditModal,
    openDeleteModal,
    sortBy,
    sortOrder,
    setSort,
  } = useProductStore();

  const handleHeaderSort = (field: string) => {
    if (sortBy === field) {
      setSort(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(field, 'asc');
    }
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th
                onClick={() => handleHeaderSort('title')}
                className="py-4 px-6 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Product</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              </th>
              <th className="py-4 px-6">SKU</th>
              <th className="py-4 px-6">Category</th>
              <th
                onClick={() => handleHeaderSort('price')}
                className="py-4 px-6 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Price</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              </th>
              <th
                onClick={() => handleHeaderSort('stock')}
                className="py-4 px-6 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Stock Status</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              </th>
              <th
                onClick={() => handleHeaderSort('rating')}
                className="py-4 px-6 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Rating</span>
                  <ArrowUpDown className="w-3.5 h-3.5 opacity-60" />
                </div>
              </th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {products.map((product) => {
              const isOutOfStock = product.stock <= 0;
              const isLowStock = product.stock > 0 && product.stock <= 5;

              return (
                <tr
                  key={product._id || product.id}
                  className="hover:bg-slate-850/50 transition-colors group"
                >
                  {/* Title & Description */}
                  <td className="py-4 px-6 max-w-xs">
                    <div
                      onClick={() => openViewModal(product)}
                      className="font-bold text-white group-hover:text-indigo-300 transition-colors truncate cursor-pointer"
                      title={product.title}
                    >
                      {product.title}
                    </div>
                    <div className="text-xs text-slate-400 truncate mt-0.5">
                      {product.description}
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="py-4 px-6 font-mono text-xs text-slate-300">
                    {product.sku || '—'}
                  </td>

                  {/* Category */}
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60">
                      {product.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-6 font-bold text-white text-base">
                    ${Number(product.price).toFixed(2)}
                  </td>

                  {/* Stock */}
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        isOutOfStock
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          : isLowStock
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isOutOfStock
                            ? 'bg-rose-400'
                            : isLowStock
                            ? 'bg-amber-400'
                            : 'bg-emerald-400'
                        }`}
                      />
                      {isOutOfStock
                        ? 'Out of Stock'
                        : `${product.stock} in stock`}
                    </span>
                  </td>

                  {/* Rating */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                      <span>{product.rating ? product.rating.toFixed(1) : '—'}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openViewModal(product)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(product)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-colors"
                        title="Edit product"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openDeleteModal(product)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
