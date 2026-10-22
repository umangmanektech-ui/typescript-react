import axios from 'axios';
import type {
  CategoryItem,
  CreateProductInput,
  Product,
  ProductQueryParams,
  ProductsResponse,
  UpdateProductInput,
} from '../types/product';
import apiClient from './api';

export const productService = {
  /**
   * Fetch paginated list of products or filter by category/search
   */
  async getProducts(params: ProductQueryParams): Promise<ProductsResponse> {
    const { limit = 12, skip = 0, q, category, sortBy, order } = params;

    // Search query endpoint
    if (q && q.trim()) {
      const response = await apiClient.get<ProductsResponse>('/products/search', {
        params: {
          q: q.trim(),
          limit,
          skip,
          sortBy,
          order,
        },
      });
      return response.data;
    }

    // Category endpoint
    if (category && category !== 'all') {
      const response = await apiClient.get<ProductsResponse>(`/products/category/${encodeURIComponent(category)}`, {
        params: {
          limit,
          skip,
          sortBy,
          order,
        },
      });
      return response.data;
    }

    // Default all products
    const response = await apiClient.get<ProductsResponse>('/products', {
      params: {
        limit,
        skip,
        sortBy,
        order,
      },
    });
    return response.data;
  },

  /**
   * Fetch single product by ID
   */
  async getProductById(id: number): Promise<Product> {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  /**
   * Fetch product categories
   */
  async getCategories(): Promise<CategoryItem[]> {
    const response = await apiClient.get<Array<string | CategoryItem>>('/products/categories');
    
    return response.data.map((cat) => {
      if (typeof cat === 'string') {
        return {
          slug: cat,
          name: cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' '),
        };
      }
      return cat;
    });
  },

  /**
   * Add a new product (DummyJSON mock POST)
   */
  async createProduct(data: CreateProductInput): Promise<Product> {
    const response = await axios.post<Product>('/products/add', data);
    return response.data;
  },

  /**
   * Update an existing product (DummyJSON mock PUT)
   */
  async updateProduct(id: number, data: UpdateProductInput): Promise<Product> {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  /**
   * Delete a product (DummyJSON mock DELETE)
   */
  async deleteProduct(id: number): Promise<{ id: number; isDeleted: boolean; deletedOn: string }> {
    const response = await apiClient.delete<{ id: number; isDeleted: boolean; deletedOn: string }>(`/products/${id}`);
    return response.data;
  },
};

export default productService;
