import { yupResolver } from '@hookform/resolvers/yup';
import { Image as ImageIcon, Loader2, Sparkles, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from '../hooks/useProductMutations';
import { useCategoriesQuery } from '../hooks/useProductQueries';
import type { ProductFormValues } from '../schema/productSchema';
import { productValidationSchema } from '../schema/productSchema';
import { useProductStore } from '../store/productStore';

export const ProductFormModal: React.FC = () => {
  const {
    isCreateModalOpen,
    isEditModalOpen,
    selectedProduct,
    closeCreateModal,
    closeEditModal,
  } = useProductStore();

  const isOpen = isCreateModalOpen || isEditModalOpen;
  const isEditing = Boolean(isEditModalOpen && selectedProduct);

  const { data: categories = [] } = useCategoriesQuery();
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: yupResolver(productValidationSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      discountPercentage: 0,
      stock: 0,
      brand: '',
      category: '',
      thumbnail: '',
    },
  });

  const thumbnailValue = watch('thumbnail');
  const [previewError, setPreviewError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (isEditing && selectedProduct) {
        reset({
          title: selectedProduct.title || '',
          description: selectedProduct.description || '',
          price: selectedProduct.price || 0,
          discountPercentage: selectedProduct.discountPercentage || 0,
          stock: selectedProduct.stock || 0,
          brand: selectedProduct.brand || '',
          category: selectedProduct.category || '',
          thumbnail: selectedProduct.thumbnail || '',
        });
      } else {
        reset({
          title: '',
          description: '',
          price: 0,
          discountPercentage: 0,
          stock: 10,
          brand: '',
          category: categories[0]?.slug || 'beauty',
          thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
        });
      }
      setPreviewError(false);
    }
  }, [isOpen, isEditing, selectedProduct, reset, categories]);

  if (!isOpen) return null;

  const handleClose = () => {
    if (isPending) return;
    if (isEditing) {
      closeEditModal();
    } else {
      closeCreateModal();
    }
  };

  const onSubmit = (data: ProductFormValues) => {
    if (isEditing && selectedProduct) {
      updateMutation.mutate({
        id: selectedProduct.id,
        title: data.title,
        description: data.description,
        price: Number(data.price),
        discountPercentage: data.discountPercentage ? Number(data.discountPercentage) : 0,
        stock: Number(data.stock),
        brand: data.brand || '',
        category: data.category,
        thumbnail: data.thumbnail || undefined,
      }); 
    } else {
      createMutation.mutate({
        title: data.title,
        description: data.description,
        price: Number(data.price),
        discountPercentage: data.discountPercentage ? Number(data.discountPercentage) : 0,
        stock: Number(data.stock),
        brand: data.brand || '',
        category: data.category,
        thumbnail: data.thumbnail || undefined,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEditing ? 'Edit Product' : 'Create New Product'}
              </h2>
              <p className="text-xs text-slate-400">
                {isEditing
                  ? `Updating product #${selectedProduct?.id}`
                  : 'Add a new product to the catalog via DummyJSON'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            disabled={isPending}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Row 1: Title & Brand */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Product Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                {...register('title')}
                placeholder="e.g. Wireless Noise-Cancelling Headphones"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border ${
                  errors.title ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800 focus:border-indigo-500'
                } text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all`}
              />
              {errors.title && (
                <p className="text-xs text-rose-400 font-medium">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">Brand</label>
              <input
                type="text"
                {...register('brand')}
                placeholder="e.g. Sony"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-indigo-500 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Row 2: Category & Price & Discount */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Category <span className="text-rose-400">*</span>
              </label>
              <select
                {...register('category')}
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border ${
                  errors.category ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                } text-sm text-slate-100 focus:outline-none capitalize transition-all cursor-pointer`}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug} className="capitalize">
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs text-rose-400 font-medium">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Price ($) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                {...register('price')}
                placeholder="29.99"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border ${
                  errors.price ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800 focus:border-indigo-500'
                } text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all`}
              />
              {errors.price && (
                <p className="text-xs text-rose-400 font-medium">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Discount (%)
              </label>
              <input
                type="number"
                step="0.1"
                {...register('discountPercentage')}
                placeholder="10"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border ${
                  errors.discountPercentage ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                } text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all`}
              />
              {errors.discountPercentage && (
                <p className="text-xs text-rose-400 font-medium">
                  {errors.discountPercentage.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 3: Stock & Thumbnail URL */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Stock Quantity <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                {...register('stock')}
                placeholder="50"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border ${
                  errors.stock ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800 focus:border-indigo-500'
                } text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all`}
              />
              {errors.stock && (
                <p className="text-xs text-rose-400 font-medium">{errors.stock.message}</p>
              )}
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Thumbnail Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  {...register('thumbnail')}
                  placeholder="https://example.com/image.jpg"
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border ${
                    errors.thumbnail ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                  } text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setValue(
                      'thumbnail',
                      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60'
                    )
                  }
                  className="px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg whitespace-nowrap border border-slate-700"
                  title="Use Sample Image"
                >
                  Sample
                </button>
              </div>
              {errors.thumbnail && (
                <p className="text-xs text-rose-400 font-medium">{errors.thumbnail.message}</p>
              )}
            </div>
          </div>

          {/* Image Preview if provided */}
          {thumbnailValue && !previewError && (
            <div className="flex items-center gap-3 p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
              <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src={thumbnailValue}
                  alt="Preview"
                  className="w-full h-full object-contain"
                  onError={() => setPreviewError(true)}
                />
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Image preview loaded</span>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              {...register('description')}
              placeholder="Provide a detailed description of the product features, specs, and details..."
              className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border ${
                errors.description ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-800 focus:border-indigo-500'
              } text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all resize-none`}
            />
            {errors.description && (
              <p className="text-xs text-rose-400 font-medium">{errors.description.message}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-50"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isEditing ? 'Save Changes' : 'Create Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
