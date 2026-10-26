export interface ApiResponse<T = unknown> {
  success?: boolean;
  status?: string;
  message?: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiHealthResponse {
  status: string;
  uptime?: number;
  timestamp?: string;
  message?: string;
}

export interface ApiErrorResponse {
  success?: boolean;
  message: string;
  errors?: Array<{ field?: string; message: string }> | string[];
}
