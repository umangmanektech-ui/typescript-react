import { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Star,
  Calendar,
  Clock,
  Edit3,
  Trash2,
  Tag,
} from 'lucide-react';
import { useProductStore } from '../store/productStore';

export const ProductDetailModal = () => {
  const {
    isViewModalOpen,
    closeViewModal,
    selectedProduct,
    openEditModal,
    openDeleteModal,
  } = useProductStore();

  const [copiedId, setCopiedId] = useState(false);

  if (!isViewModalOpen || !selectedProduct) return null;

  const targetId = selectedProduct._id || selectedProduct.id || '';

  const handleCopyId = () => {
    if (targetId) {
      navigator.clipboard.writeText(targetId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleEdit = () => {
    const prod = selectedProduct;
    closeViewModal();
    openEditModal(prod);
  };

  const handleDelete = () => {
    const prod = selectedProduct;
    closeViewModal();
    openDeleteModal(prod);
  };

  const isOutOfStock = selectedProduct.stock <= 0;
  const isLowStock = selectedProduct.stock > 0 && selectedProduct.stock <= 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-slate-700/80 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 text-xs font-semibold rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {selectedProduct.category}
              </span>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-lg border ${
                  isOutOfStock
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    : isLowStock
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                }`}
              >
                {isOutOfStock
                  ? 'Out of Stock'
                  : isLowStock
                  ? `Low Stock (${selectedProduct.stock} left)`
                  : `${selectedProduct.stock} in Stock`}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {selectedProduct.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={closeViewModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MongoDB ID bar */}
        <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-mono text-slate-300">
            <span className="text-slate-500">ID:</span>
            <span>{targetId}</span>
          </div>
          <button
            type="button"
            onClick={handleCopyId}
            className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            {copiedId ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy ID</span>
              </>
            )}
          </button>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <div className="glass-card rounded-xl p-3 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Price
            </span>
            <span className="text-xl font-bold text-white mt-1 block">
              ${Number(selectedProduct.price).toFixed(2)}
            </span>
          </div>

          <div className="glass-card rounded-xl p-3 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              SKU
            </span>
            <span className="text-sm font-mono font-medium text-slate-200 mt-1 block truncate">
              {selectedProduct.sku || 'N/A'}
            </span>
          </div>

          <div className="glass-card rounded-xl p-3 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Stock
            </span>
            <span className="text-xl font-bold text-white mt-1 block">
              {selectedProduct.stock}
            </span>
          </div>

          <div className="glass-card rounded-xl p-3 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Rating
            </span>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-amber-400 text-lg">
              <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
              <span>{selectedProduct.rating ? selectedProduct.rating.toFixed(1) : '5.0'}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-5">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Description
          </h4>
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            {selectedProduct.description}
          </p>
        </div>

        {/* Tags */}
        {selectedProduct.tags && selectedProduct.tags.length > 0 && (
          <div className="mt-5">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Tags & Keywords
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedProduct.tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-900 text-xs font-medium text-slate-300 border border-slate-800"
                >
                  <Tag className="w-3 h-3 text-indigo-400" />
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Timestamps */}
        {(selectedProduct.createdAt || selectedProduct.updatedAt) && (
          <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap gap-4 text-xs text-slate-400">
            {selectedProduct.createdAt && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Created: {new Date(selectedProduct.createdAt).toLocaleDateString()}</span>
              </div>
            )}
            {selectedProduct.updatedAt && (
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Updated: {new Date(selectedProduct.updatedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={closeViewModal}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700 hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleEdit}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Product</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
