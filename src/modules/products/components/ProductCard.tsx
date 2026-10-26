import { Eye, Edit3, Trash2, Star, Box, Tag } from 'lucide-react';
import type { Product } from '../../../types/product';
import { useProductStore } from '../store/productStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { openViewModal, openEditModal, openDeleteModal } = useProductStore();

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const categoryColors: Record<string, string> = {
    Electronics: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Computers: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    Accessories: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    Audio: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Gaming: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    Wearables: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Home & Kitchen': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Other: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  const badgeClass =
    categoryColors[product.category] || categoryColors.Other;

  return (
    <div className="group glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
      {/* Top Header: Category & Stock Status */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg border tracking-wide ${badgeClass}`}
          >
            {product.category}
          </span>

          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
              isOutOfStock
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                : isLowStock
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            }`}
          >
            {isOutOfStock ? 'Out of Stock' : isLowStock ? `Low (${product.stock})` : `${product.stock} in stock`}
          </span>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => openViewModal(product)}
          className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1 cursor-pointer"
          title={product.title}
        >
          {product.title}
        </h3>

        {/* SKU indicator */}
        {product.sku && (
          <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400 font-mono">
            <Box className="w-3.5 h-3.5 text-slate-500" />
            <span>{product.sku}</span>
          </div>
        )}

        {/* Product Description */}
        <p className="mt-2.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {product.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/80 text-[10px] text-slate-300 border border-slate-800"
              >
                <Tag className="w-2.5 h-2.5 opacity-60" />
                {tag}
              </span>
            ))}
            {product.tags.length > 3 && (
              <span className="text-[10px] text-slate-500 self-center">
                +{product.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer: Price, Rating & Actions */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400 block font-medium">Price</span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-white tracking-tight">
              ${Number(product.price).toFixed(2)}
            </span>
            {product.rating !== undefined && product.rating > 0 && (
              <div className="flex items-center gap-1 text-xs font-semibold text-amber-400">
                <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => openViewModal(product)}
            className="p-2 rounded-xl text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 transition-all cursor-pointer"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => openEditModal(product)}
            className="p-2 rounded-xl text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/20 transition-all cursor-pointer"
            title="Edit Product"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => openDeleteModal(product)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
            title="Delete Product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
