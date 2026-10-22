import { AlertCircle, Edit3, Eye, PackageCheck, Star, Trash2 } from 'lucide-react';
import type { Product } from '../../../types/product';
import { useProductStore } from '../store/productStore';



export const ProductCard= ({ product }: {
  product: Product;
}) => {
  const { openViewModal, openEditModal, openDeleteModal } = useProductStore();

  const originalPrice = product.discountPercentage
    ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="group flex flex-col justify-between rounded-2xl bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/40 p-4 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1">
      <div>
        {/* Thumbnail & Badges Container */}
        <div className="relative aspect-square w-full rounded-xl bg-slate-950/80 overflow-hidden mb-3 border border-slate-800/50 flex items-center justify-center">
          <img
            src={product.thumbnail || product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60'}
            alt={product.title}
            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
            }}
          />

          {/* Discount Pill */}
          {product.discountPercentage && product.discountPercentage > 0 && (
            <div className="absolute top-2 left-2 bg-rose-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
              -{Math.round(product.discountPercentage)}%
            </div>
          )}

          {/* Stock Badge */}
          <div className="absolute top-2 right-2">
            {isOutOfStock ? (
              <span className="flex items-center gap-1 bg-red-950/90 text-red-300 border border-red-500/30 text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
                <AlertCircle className="w-3 h-3 text-red-400" /> Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="flex items-center gap-1 bg-amber-950/90 text-amber-300 border border-amber-500/30 text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
                <AlertCircle className="w-3 h-3 text-amber-400" /> Only {product.stock} left
              </span>
            ) : (
              <span className="flex items-center gap-1 bg-emerald-950/90 text-emerald-300 border border-emerald-500/30 text-[10px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm">
                <PackageCheck className="w-3 h-3 text-emerald-400" /> In Stock ({product.stock})
              </span>
            )}
          </div>
        </div>

        {/* Category & Brand */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
          <span className="capitalize font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
            {product.category}
          </span>
          {product.brand && (
            <span className="truncate max-w-[120px] text-slate-400 text-[11px]">
              {product.brand}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          onClick={() => openViewModal(product)}
          className="text-sm sm:text-base font-semibold text-slate-100 hover:text-indigo-400 transition-colors line-clamp-1 cursor-pointer mb-1"
          title={product.title}
        >
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
          {product.description}
        </p>
      </div>

      {/* Footer Area: Price, Rating & Actions */}
      <div className="pt-3 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-3">
          {/* Price */}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-white">
                ${product.price.toFixed(2)}
              </span>
              {originalPrice && (
                <span className="text-xs text-slate-500 line-through">
                  ${originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-semibold text-slate-200">
              {product.rating ? product.rating.toFixed(1) : '4.5'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => openViewModal(product)}
            className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-700/50 transition-colors cursor-pointer"
            title="View Product Details"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View</span>
          </button>
          <button
            onClick={() => openEditModal(product)}
            className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/50 text-indigo-300 hover:text-indigo-200 text-xs font-medium border border-indigo-500/30 transition-colors cursor-pointer"
            title="Edit Product"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </button>
          <button
            onClick={() => openDeleteModal(product)}
            className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 hover:text-rose-200 text-xs font-medium border border-rose-500/30 transition-colors cursor-pointer"
            title="Delete Product"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
