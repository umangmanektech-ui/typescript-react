import { AlertTriangle, Loader2 } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useDeleteProduct } from '../hooks/useProductMutations';

export const DeleteConfirmModal = () => {
  const { isDeleteModalOpen, closeDeleteModal, selectedProduct } = useProductStore();
  const deleteMutation = useDeleteProduct();

  if (!isDeleteModalOpen || !selectedProduct) return null;

  const targetId = selectedProduct._id || selectedProduct.id || '';

  const handleDelete = () => {
    if (targetId) {
      deleteMutation.mutate(targetId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md glass-panel rounded-3xl border border-rose-500/20 shadow-2xl p-6 sm:p-7">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0 text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Delete Product?</h3>
            <p className="text-xs text-slate-400 mt-0.5">This action cannot be undone.</p>
          </div>
        </div>

        <div className="my-5 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <p className="text-slate-400">
            You are about to permanently delete:
          </p>
          <p className="text-white font-bold text-sm mt-1 truncate">
            {selectedProduct.title}
          </p>
          <p className="text-slate-500 font-mono text-[11px] mt-1">
            ID: {targetId}
          </p>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={closeDeleteModal}
            disabled={deleteMutation.isPending}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700/80 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/25 disabled:opacity-50 transition-all cursor-pointer"
          >
            {deleteMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Confirm Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};
