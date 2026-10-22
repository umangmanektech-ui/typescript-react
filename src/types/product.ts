export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock: number;
  tags?: string[];
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
    reviewerEmail: string;
  }>;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  meta?: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  images?: string[];
  thumbnail?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CategoryItem {
  slug: string;
  name: string;
  url?: string;
}

export interface CreateProductInput {
  title: string;
  description: string;
  price: number;
  discountPercentage?: number;
  stock: number;
  brand?: string;
  category: string;
  thumbnail?: string;
}

export interface UpdateProductInput extends CreateProductInput {
  id: number;
}

export interface ProductQueryParams {
  limit?: number;
  skip?: number;
  q?: string;
  category?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}
