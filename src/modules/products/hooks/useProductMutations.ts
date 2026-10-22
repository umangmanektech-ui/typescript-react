import { useMutation, useQueryClient } from '@tanstack/react-query';
import productService from '../../../services/productService';
import type { ApiErrorResponse } from '../../../types/api';
import type { CreateProductInput, UpdateProductInput } from '../../../types/product';
import { useProductStore } from '../store/productStore';
import { PRODUCT_QUERY_KEYS } from './useProductQueries';

/**
 * Mutation hook to create a new product
 */
export const useCreateProductMutation = () => {
  const queryClient = useQueryClient();
  const { closeCreateModal, showToast } = useProductStore();

  return useMutation({
    mutationFn: (newProduct: CreateProductInput) => productService.createProduct(newProduct),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
      closeCreateModal();
      showToast(`Product "${data.title}" created successfully!`, 'success');
    },
    onError: (error: ApiErrorResponse) => {
      showToast(error?.response?.data?.message || 'Failed to create product', 'error');
    },
  });
};

/**
 * Mutation hook to update an existing product
 */
export const useUpdateProductMutation = () => {
  const queryClient = useQueryClient();
  const { closeEditModal, showToast } = useProductStore();

  return useMutation({
    mutationFn: (data: UpdateProductInput) =>
      productService.updateProduct(data.id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
      closeEditModal();
      showToast(`Product "${data.title}" updated successfully!`, 'success');
    },
    onError: (error: ApiErrorResponse) => {
      showToast(error?.response?.data?.message || 'Failed to update product', 'error');
    },
  });
};

/**
 * Mutation hook to delete a product
 */
export const useDeleteProductMutation = () => {
  const queryClient = useQueryClient();
  const { closeDeleteModal, showToast, selectedProduct } = useProductStore();

  return useMutation({
    mutationFn: (id: number) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_QUERY_KEYS.all });
      closeDeleteModal();
      showToast(
        `Product "${selectedProduct?.title || 'Item'}" deleted successfully!`,
        'info'
      );
    },
    onError: (error: ApiErrorResponse) => {
      showToast(error?.response?.data?.message || 'Failed to delete product', 'error');
    },
  });
};
