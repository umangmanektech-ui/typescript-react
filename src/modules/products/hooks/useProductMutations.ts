import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../../../services/productService';
import { productKeys } from './useProductQueries';
import { useProductStore } from '../store/productStore';
import type { CreateProductInput, UpdateProductInput } from '../../../types/product';

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { showToast, closeCreateModal } = useProductStore();

  return useMutation({
    mutationFn: (data: CreateProductInput) => productService.createProduct(data),
    onSuccess: (createdProduct) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
      showToast(`Product "${createdProduct.title}" created successfully!`, 'success');
      closeCreateModal();
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to create product', 'error');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { showToast, closeEditModal } = useProductStore();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductInput }) =>
      productService.updateProduct(id, data),
    onSuccess: (updatedProduct) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(updatedProduct._id) });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
      showToast(`Product "${updatedProduct.title}" updated successfully!`, 'success');
      closeEditModal();
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to update product', 'error');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { showToast, closeDeleteModal } = useProductStore();

  return useMutation({
    mutationFn: (id: string) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({ queryKey: productKeys.stats() });
      showToast('Product removed successfully!', 'success');
      closeDeleteModal();
    },
    onError: (error: Error) => {
      showToast(error.message || 'Failed to delete product', 'error');
    },
  });
};
