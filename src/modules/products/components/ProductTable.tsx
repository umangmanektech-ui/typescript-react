import React from 'react';
import type { Product } from '../../../types/product';
import { useProductStore } from '../store/productStore';
import { Eye, Edit3, Trash2, Star, AlertCircle, PackageCheck } from 'lucide-react';

interface ProductTableProps {
  products: Product[];
}

export const ProductTable: React.FC<ProductTableProps> = ({ products }) => {
  const { openViewModal, openEditModal, openDeleteModal } = useProductStore();

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md mb-6 shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm text-slate-300">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400 font-semibold">
              <th scope="col" className="py-4 px-4 sm:px-6">Product</th>
              <th scope="col" className="py-4 px-4">Category</th>
              <th scope="col" className="py-4 px-4">Price</th>
              <th scope="col" className="py-4 px-4">Stock</th>
              <th scope="col" className="py-4 px-4">Rating</th>
              <th scope="col" className="py-4 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {products.map((product) => {
              const isLowStock = product.stock > 0 && product.stock <= 10;
              const isOutOfStock = product.stock <= 0;

              return (
                <tr
                  key={product.id}
                  className="hover:bg-slate-800/40 transition-colors group"
                >
                  {/* Product Details */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                        <img
                          src={
                            product.thumbnail ||
                            product.images?.[0] ||
                            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60'
                          }
                          alt={product.title}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div
                          onClick={() => openViewModal(product)}
                          className="font-medium text-slate-100 hover:text-indigo-400 transition-colors truncate max-w-xs cursor-pointer"
                        >
                          {product.title}
                        </div>
                        <div className="text-xs text-slate-500 truncate max-w-xs">
                          {product.brand ? `${product.brand} · ` : ''}
                          {product.description}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="capitalize text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                      {product.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-white">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.discountPercentage ? (
                        <span className="text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded font-medium border border-rose-500/20">
                          -{Math.round(product.discountPercentage)}%
                        </span>
                      ) : null}
                    </div>
                  </td>

                  {/* Stock */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {isOutOfStock ? (
                      <span className="inline-flex items-center gap-1 text-xs text-red-400 bg-red-950/40 border border-red-500/30 px-2 py-0.5 rounded-full">
                        <AlertCircle className="w-3 h-3 text-red-400" /> Out of stock
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded-full">
                        <AlertCircle className="w-3 h-3 text-amber-400" /> Low ({product.stock})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        <PackageCheck className="w-3 h-3 text-emerald-400" /> {product.stock} units
                      </span>
                    )}
                  </td>

                  {/* Rating */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-slate-300">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-medium">
                        {product.rating ? product.rating.toFixed(1) : '4.5'}
                      </span>
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openViewModal(product)}
                        className="p-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="View details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(product)}
                        className="p-1.5 rounded-lg bg-indigo-950/50 hover:bg-indigo-900/60 text-indigo-300 hover:text-indigo-200 transition-colors cursor-pointer border border-indigo-500/30"
                        title="Edit product"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(product)}
                        className="p-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 hover:text-rose-200 transition-colors cursor-pointer border border-rose-500/30"
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
