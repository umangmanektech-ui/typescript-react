import { AlertTriangle, Loader2, Trash2, X } from 'lucide-react';
import { useDeleteProductMutation } from '../hooks/useProductMutations';
import { useProductStore } from '../store/productStore';

export const DeleteConfirmModal = () => {
  const { isDeleteModalOpen, selectedProduct, closeDeleteModal } = useProductStore();
  const deleteMutation = useDeleteProductMutation();

  if (!isDeleteModalOpen || !selectedProduct) return null;

  const handleDelete = () => {
    deleteMutation.mutate(selectedProduct.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={closeDeleteModal}
            disabled={deleteMutation.isPending}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold text-white">Delete Product</h3>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Are you sure you want to delete{' '}
            <span className="font-semibold text-slate-200">
              "{selectedProduct.title}"
            </span>
            ? This action cannot be undone.
          </p>
        </div>

        {/* Product snippet */}
        <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-900 overflow-hidden shrink-0 border border-slate-800 flex items-center justify-center">
            <img
              src={selectedProduct.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60'}
              alt={selectedProduct.title}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-200 truncate">
              {selectedProduct.title}
            </div>
            <div className="text-[11px] text-slate-500">
              ${selectedProduct.price.toFixed(2)} · {selectedProduct.category}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={closeDeleteModal}
            disabled={deleteMutation.isPending}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {deleteMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
