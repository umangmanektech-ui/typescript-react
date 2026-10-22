import { useQuery } from '@tanstack/react-query';
import productService from '../../../services/productService';
import type { ProductQueryParams } from '../../../types/product';

// Query Keys constants
export const PRODUCT_QUERY_KEYS = {
  all: ['products'] as const,
  list: (params: ProductQueryParams) => ['products', 'list', params] as const,
  detail: (id: number) => ['products', 'detail', id] as const,
  categories: ['categories'] as const,
};

/**
 * Query hook to fetch products with pagination, search, and category filters
 */
export const useProductsQuery = (params: ProductQueryParams = {}) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.list(params),
    queryFn: () => productService.getProducts(params),
  });
};

/**
 * Query hook to fetch all products without filters
 */
export const useAllProductsQuery = () => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.all,
    queryFn: () => productService.getProducts({ limit: 0 }),
  });
};

/**
 * Query hook to fetch a single product by ID
 */
export const useProductDetailQuery = (id: number | null) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.detail(id || 0),
    queryFn: () => productService.getProductById(id!),
    enabled: typeof id === 'number' && id > 0,
  });
};

/**
 * Query hook to fetch all categories
 */
export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.categories,
    queryFn: () => productService.getCategories(),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
};
