import type { ApiHealthResponse } from '../types/api';
import type {
  CategoryBreakdownItem,
  CreateProductInput,
  Product,
  ProductQueryParams,
  ProductsResponse,
  ProductStatsResponse,
  UpdateProductInput,
} from '../types/product';
import { apiClient } from './api';

/**
 * Normalizes a raw product object ensuring _id and id are accessible
 */
function normalizeProduct(raw: Record<string, unknown>): Product {
  const _id = String(raw._id || raw.id || '');
  return {
    _id,
    id: _id,
    title: String(raw.title || ''),
    description: String(raw.description || ''),
    price: Number(raw.price || 0),
    category: String(raw.category || 'Other'),
    stock: Number(raw.stock || 0),
    sku: String(raw.sku || ''),
    rating: raw.rating !== undefined ? Number(raw.rating) : 0,
    tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : [],
    createdAt: raw.createdAt ? String(raw.createdAt) : undefined,
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : undefined,
  };
}

export const productService = {
  /**
   * Health check
   */
  async getHealth(): Promise<ApiHealthResponse> {
    const response = await apiClient.get<ApiHealthResponse>('/health');
    return response.data;
  },

  /**
   * Fetch paginated and filtered list of products
   */
  async getProducts(params?: ProductQueryParams): Promise<ProductsResponse> {
    const cleanedParams: Record<string, unknown> = {};

    if (params) {
      if (params.page !== undefined) cleanedParams.page = params.page;
      if (params.limit !== undefined) cleanedParams.limit = params.limit;
      if (params.search && params.search.trim() !== '') {
        cleanedParams.search = params.search.trim();
      }
      if (params.category && params.category !== 'all' && params.category.trim() !== '') {
        cleanedParams.category = params.category.trim();
      }
      if (params.minPrice !== undefined && params.minPrice > 0) {
        cleanedParams.minPrice = params.minPrice;
      }
      if (params.maxPrice !== undefined && params.maxPrice > 0) {
        cleanedParams.maxPrice = params.maxPrice;
      }
      if (params.inStock !== undefined) {
        cleanedParams.inStock = params.inStock;
      }
      if (params.sortBy && params.sortBy.trim() !== '') {
        cleanedParams.sortBy = params.sortBy.trim();
      }
      if (params.sortOrder) {
        cleanedParams.sortOrder = params.sortOrder;
      }
    }

    const response = await apiClient.get('/products', { params: cleanedParams });
    const data = response.data;

    let productsList: Product[] = [];
    let total = 0;
    let page = params?.page || 1;
    let limit = params?.limit || 10;
    let totalPages = 1;

    // Adapt various response payload envelopes gracefully
    if (Array.isArray(data)) {
      productsList = data.map(normalizeProduct);
      total = productsList.length;
    } else if (data && typeof data === 'object') {
      const payload = data.data || data;

      if (Array.isArray(payload)) {
        productsList = payload.map(normalizeProduct);
      } else if (Array.isArray(payload.products)) {
        productsList = payload.products.map(normalizeProduct);
      } else if (Array.isArray(data.products)) {
        productsList = data.products.map(normalizeProduct);
      }

      const paginationSource = data.pagination || payload.pagination || data;
      total =
        paginationSource.total ??
        data.total ??
        payload.total ??
        data.count ??
        productsList.length;
      page = paginationSource.page ?? data.page ?? params?.page ?? 1;
      limit = paginationSource.limit ?? data.limit ?? params?.limit ?? 10;
      totalPages = paginationSource.totalPages ?? data.totalPages ?? (Math.ceil(total / (limit || 10)) || 1);
    }

    return {
      products: productsList,
      total,
      page,
      limit,
      totalPages: Math.max(1, totalPages),
    };
  },

  /**
   * Get single product by MongoDB ObjectId
   */
  async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get(`/products/${id}`);
    const data = response.data;
    const raw = data.data ? data.data : data;
    return normalizeProduct(raw);
  },

  /**
   * Create a new product (POST /api/v1/products)
   */
  async createProduct(productData: CreateProductInput): Promise<Product> {
    const response = await apiClient.post('/products', productData);
    const data = response.data;
    const raw = data.data ? data.data : data;
    return normalizeProduct(raw);
  },

  /**
   * Update product by ID (PUT /api/v1/products/:id)
   */
  async updateProduct(id: string, productData: UpdateProductInput): Promise<Product> {
    const response = await apiClient.put(`/products/${id}`, productData);
    const data = response.data;
    const raw = data.data ? data.data : data;
    return normalizeProduct(raw);
  },

  /**
   * Delete product by ID (DELETE /api/v1/products/:id)
   */
  async deleteProduct(id: string): Promise<{ success: boolean; message?: string }> {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },

  /**
   * Analytics and statistics (GET /api/v1/products/analytics/stats)
   */
  async getProductStats(): Promise<ProductStatsResponse> {
    const response = await apiClient.get('/products/analytics/stats');
    const data = response.data;
    const stats = (data.data || data) as Record<string, unknown>;

    let categoryBreakdown: CategoryBreakdownItem[] = [];
    if (Array.isArray(stats.categoryBreakdown)) {
      categoryBreakdown = stats.categoryBreakdown.map((item) => ({
        category: String(item.category || item._id || 'Unknown'),
        count: Number(item.count || 0),
        averagePrice: item.averagePrice !== undefined ? Number(item.averagePrice) : undefined,
      }));
    }

    return {
      totalProducts: Number(stats.totalProducts || stats.count || 0),
      averagePrice: Number(stats.averagePrice || stats.avgPrice || 0),
      totalStock: Number(stats.totalStock || stats.stock || 0),
      categoryBreakdown,
    };
  },
};
