import { useQuery } from '@tanstack/react-query';
import { productService } from '../../../services/productService';
import type { ProductQueryParams } from '../../../types/product';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: ProductQueryParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  stats: () => [...productKeys.all, 'stats'] as const,
  health: () => ['api-health'] as const,
};

export const useProducts = (params: ProductQueryParams) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productService.getProducts(params),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useProduct = (id?: string) => {
  return useQuery({
    queryKey: productKeys.detail(id || ''),
    queryFn: () => productService.getProductById(id!),
    enabled: Boolean(id),
  });
};

export const useProductStats = () => {
  return useQuery({
    queryKey: productKeys.stats(),
    queryFn: () => productService.getProductStats(),
    staleTime: 1000 * 60, // 1 minute
  });
};

export const useApiHealth = () => {
  return useQuery({
    queryKey: productKeys.health(),
    queryFn: () => productService.getHealth(),
    refetchInterval: 20000, // Recheck every 20 seconds
    retry: 1,
  });
};
