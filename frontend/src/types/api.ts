// API types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: Array<{ field: string; message: string }>;
  };
  timestamp: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Array<{ field: string; message: string }>;
  status?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
