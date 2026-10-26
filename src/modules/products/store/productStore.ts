import { create } from 'zustand';
import type { Product } from '../../../types/product';

export interface ToastState {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ProductStore {
  // Query & Filter states
  searchQuery: string;
  selectedCategory: string;
  minPrice: number | undefined;
  maxPrice: number | undefined;
  inStockOnly: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
  viewMode: 'grid' | 'table';

  // Modal states
  isCreateModalOpen: boolean;
  isEditModalOpen: boolean;
  isViewModalOpen: boolean;
  isDeleteModalOpen: boolean;
  selectedProduct: Product | null;

  // Feedback toast
  toast: ToastState | null;

  // Filter actions
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setMinPrice: (min: number | undefined) => void;
  setMaxPrice: (max: number | undefined) => void;
  setInStockOnly: (inStockOnly: boolean) => void;
  setSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setViewMode: (mode: 'grid' | 'table') => void;
  resetFilters: () => void;

  // Modal actions
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (product: Product) => void;
  closeEditModal: () => void;
  openViewModal: (product: Product) => void;
  closeViewModal: () => void;
  openDeleteModal: (product: Product) => void;
  closeDeleteModal: () => void;

  // Toast actions
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  searchQuery: '',
  selectedCategory: 'all',
  minPrice: undefined,
  maxPrice: undefined,
  inStockOnly: false,
  sortBy: 'createdAt',
  sortOrder: 'desc',
  page: 1,
  limit: 10,
  viewMode: 'grid',

  isCreateModalOpen: false,
  isEditModalOpen: false,
  isViewModalOpen: false,
  isDeleteModalOpen: false,
  selectedProduct: null,

  toast: null,

  setSearchQuery: (query) => set({ searchQuery: query, page: 1 }),
  setSelectedCategory: (category) => set({ selectedCategory: category, page: 1 }),
  setMinPrice: (minPrice) => set({ minPrice, page: 1 }),
  setMaxPrice: (maxPrice) => set({ maxPrice, page: 1 }),
  setInStockOnly: (inStockOnly) => set({ inStockOnly, page: 1 }),
  setSort: (sortBy, sortOrder) => set({ sortBy, sortOrder, page: 1 }),
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit, page: 1 }),
  setViewMode: (viewMode) => set({ viewMode }),
  resetFilters: () =>
    set({
      searchQuery: '',
      selectedCategory: 'all',
      minPrice: undefined,
      maxPrice: undefined,
      inStockOnly: false,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
    }),

  openCreateModal: () => set({ isCreateModalOpen: true, selectedProduct: null }),
  closeCreateModal: () => set({ isCreateModalOpen: false, selectedProduct: null }),

  openEditModal: (product) => set({ isEditModalOpen: true, selectedProduct: product }),
  closeEditModal: () => set({ isEditModalOpen: false, selectedProduct: null }),

  openViewModal: (product) => set({ isViewModalOpen: true, selectedProduct: product }),
  closeViewModal: () => set({ isViewModalOpen: false, selectedProduct: null }),

  openDeleteModal: (product) => set({ isDeleteModalOpen: true, selectedProduct: product }),
  closeDeleteModal: () => set({ isDeleteModalOpen: false, selectedProduct: null }),

  showToast: (message, type = 'success') => {
    const id = Date.now();
    set({ toast: { id, message, type } });
    setTimeout(() => {
      set((state) => (state.toast?.id === id ? { toast: null } : {}));
    }, 4000);
  },
  hideToast: () => set({ toast: null }),
}));
