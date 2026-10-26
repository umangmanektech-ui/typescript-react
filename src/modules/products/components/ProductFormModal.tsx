import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { productValidationSchema, type ProductFormValues } from '../schema/productSchema';
import { useProductStore } from '../store/productStore';
import { useCreateProduct, useUpdateProduct } from '../hooks/useProductMutations';
import { PRODUCT_CATEGORIES } from '../../../types/product';

export const ProductFormModal = () => {
  const {
    isCreateModalOpen,
    isEditModalOpen,
    closeCreateModal,
    closeEditModal,
    selectedProduct,
  } = useProductStore();

  const isOpen = isCreateModalOpen || isEditModalOpen;
  const isEditing = Boolean(isEditModalOpen && selectedProduct);

  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: yupResolver(productValidationSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      stock: 10,
      sku: '',
      category: 'Electronics',
      rating: 4.5,
      tags: '',
    },
  });

  // Pre-fill form on edit or reset on create
  useEffect(() => {
    if (isEditing && selectedProduct) {
      reset({
        title: selectedProduct.title,
        description: selectedProduct.description,
        price: selectedProduct.price,
        stock: selectedProduct.stock,
        sku: selectedProduct.sku || '',
        category: selectedProduct.category,
        rating: selectedProduct.rating || 4.5,
        tags: selectedProduct.tags?.join(', ') || '',
      });
    } else if (isCreateModalOpen) {
      reset({
        title: '',
        description: '',
        price: 0,
        stock: 10,
        sku: '',
        category: 'Electronics',
        rating: 4.5,
        tags: '',
      });
    }
  }, [isEditing, selectedProduct, isCreateModalOpen, reset]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isEditing) closeEditModal();
    else closeCreateModal();
  };

  const handleGenerateSKU = () => {
    const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
    setValue('sku', `PRD-${randomPart}`);
  };

  const onSubmit = (values: ProductFormValues) => {
    const tagsArray = values.tags
      ? values.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const payload = {
      title: values.title.trim(),
      description: values.description.trim(),
      price: Number(values.price),
      category: values.category,
      stock: Number(values.stock),
      sku: values.sku.trim(),
      rating: values.rating ? Number(values.rating) : 4.5,
      tags: tagsArray,
    };

    if (isEditing && selectedProduct) {
      const targetId = selectedProduct._id || selectedProduct.id!;
      updateMutation.mutate({ id: targetId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl border border-slate-700/80 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {isEditing ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEditing
                ? 'Update product details in catalog'
                : 'Fill in details to create a new product item'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Product Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              {...register('title')}
              placeholder="e.g. Logitech MX Master 3S Wireless Mouse"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            {errors.title && (
              <p className="text-xs text-rose-400 mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Grid row: Category & SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category <span className="text-rose-400">*</span>
              </label>
              <select
                {...register('category')}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                {PRODUCT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs text-rose-400 mt-1">{errors.category.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  SKU <span className="text-rose-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleGenerateSKU}
                  className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Generate</span>
                </button>
              </div>
              <input
                type="text"
                {...register('sku')}
                placeholder="e.g. LOGI-MXM3S-01"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm font-mono text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              {errors.sku && (
                <p className="text-xs text-rose-400 mt-1">{errors.sku.message}</p>
              )}
            </div>
          </div>

          {/* Grid row: Price & Stock & Rating */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Price ($ USD) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                {...register('price')}
                placeholder="99.99"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              {errors.price && (
                <p className="text-xs text-rose-400 mt-1">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Stock Quantity <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="0"
                {...register('stock')}
                placeholder="25"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              {errors.stock && (
                <p className="text-xs text-rose-400 mt-1">{errors.stock.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Rating (0 - 5)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                {...register('rating')}
                placeholder="4.9"
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              {errors.rating && (
                <p className="text-xs text-rose-400 mt-1">{errors.rating.message}</p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              {...register('tags')}
              placeholder="mouse, ergonomic, wireless"
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              {...register('description')}
              placeholder="Provide a detailed description of the product features, specs, and materials..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
            {errors.description && (
              <p className="text-xs text-rose-400 mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700/80 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isEditing ? 'Save Changes' : 'Create Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
