export type ProductCategory =
  | 'Electronics'
  | 'Computers'
  | 'Accessories'
  | 'Audio'
  | 'Gaming'
  | 'Wearables'
  | 'Home & Kitchen'
  | 'Other';

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Electronics',
  'Computers',
  'Accessories',
  'Audio',
  'Gaming',
  'Wearables',
  'Home & Kitchen',
  'Other',
];

export interface Product {
  _id: string;
  id?: string;
  title: string;
  description: string;
  price: number;
  category: ProductCategory | string;
  stock: number;
  sku: string;
  rating?: number;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductInput {
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  sku: string;
  rating?: number;
  tags?: string[];
}

export interface UpdateProductInput {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  sku?: string;
  rating?: number;
  tags?: string[];
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'createdAt' | 'price' | 'title' | 'stock' | 'rating' | string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CategoryBreakdownItem {
  category: string;
  count: number;
  averagePrice?: number;
}

export interface ProductStatsResponse {
  totalProducts: number;
  averagePrice: number;
  totalStock: number;
  categoryBreakdown?: CategoryBreakdownItem[];
}
