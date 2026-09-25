// src/services/api/types.ts

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  statusCode?: number;
  timestamp?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages?: number;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}
