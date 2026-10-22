import {
  Edit3,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useProductDetailQuery } from '../hooks/useProductQueries';
import { useProductStore } from '../store/productStore';

export const ProductDetailModal= () => {
  const { isViewModalOpen, selectedProduct, closeViewModal, openEditModal } =
    useProductStore();

  const { data: detailData } = useProductDetailQuery(
    isViewModalOpen && selectedProduct ? selectedProduct.id : null
  );

  const product = detailData || selectedProduct;
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!isViewModalOpen || !product) return null;

  const images = product.images && product.images.length > 0
    ? product.images
    : product.thumbnail
    ? [product.thumbnail]
    : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60'];

  const originalPrice = product.discountPercentage
    ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  const handleEditClick = () => {
    closeViewModal();
    openEditModal(product);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="capitalize text-xs font-semibold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
              {product.category}
            </span>
            {product.brand && (
              <span className="text-xs text-slate-400">· {product.brand}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleEditClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              onClick={closeViewModal}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gallery Column */}
            <div className="space-y-3">
              <div className="aspect-square w-full rounded-2xl bg-slate-950 border border-slate-800 p-4 flex items-center justify-center overflow-hidden">
                <img
                  src={images[activeImageIndex] || images[0]}
                  alt={product.title}
                  className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
                  }}
                />
              </div>

              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-14 h-14 rounded-xl bg-slate-950 p-1 border overflow-hidden shrink-0 transition-all cursor-pointer ${
                        activeImageIndex === idx
                          ? 'border-indigo-500 ring-2 ring-indigo-500/30 scale-105'
                          : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Column */}
            <div className="space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                  {product.title}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg text-amber-300 text-xs font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating ? product.rating.toFixed(1) : '4.5'}</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    Product ID: #{product.id}
                  </span>
                </div>
              </div>

              {/* Price & Discount */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Current Price</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-extrabold text-white">
                      ${product.price.toFixed(2)}
                    </span>
                    {originalPrice && (
                      <span className="text-sm text-slate-500 line-through">
                        ${originalPrice}
                      </span>
                    )}
                  </div>
                </div>

                {product.discountPercentage ? (
                  <div className="text-right">
                    <span className="text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full">
                      Save {Math.round(product.discountPercentage)}%
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Overview
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specifications & Stock */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
                  <span className="text-slate-500 block">Inventory</span>
                  <span className="font-semibold text-slate-200 mt-0.5 block">
                    {product.stock} units available
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
                  <span className="text-slate-500 block">Availability</span>
                  <span className="font-semibold text-emerald-400 mt-0.5 block">
                    {product.availabilityStatus || 'In Stock'}
                  </span>
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                {product.warrantyInformation && (
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>{product.warrantyInformation}</span>
                  </div>
                )}
                {product.shippingInformation && (
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-violet-400 shrink-0" />
                    <span>{product.shippingInformation}</span>
                  </div>
                )}
                {product.returnPolicy && (
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{product.returnPolicy}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Customer Reviews if available */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="mt-8 pt-6 border-t border-slate-800">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Customer Reviews ({product.reviews.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.reviews.map((rev, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">
                        {rev.reviewerName}
                      </span>
                      <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
