import type { AxiosError } from "axios";

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export type ApiErrorResponse = AxiosError<ApiError>;

export interface ApiError {
  message: string;
  status: number;
}

export interface PaginationParams {
  limit?: number;
  skip?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

// export interface PaginatedResponse<T> {
//   items?: T[];
//   total: number;
//   skip: number;
//   limit: number;
//   [key: string]: any;
// }
