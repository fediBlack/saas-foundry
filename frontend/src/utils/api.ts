import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import type { ApiError } from '@/types';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// Response interceptor to handle errors consistently
apiClient.interceptors.response.use(
  (response) => {
    // Success response - extract data from wrapper
    const data = response.data as any;
    // Handle different response formats
    // If response has a 'data' property, use it
    // If response has 'tasks' or other collection properties, use them
    // Otherwise return the whole response
    if (data.data !== undefined) {
      return data.data;
    }
    // Return the whole response if it's already the data
    return data;
  },
  (error: AxiosError<ApiError>) => {
    // Error response handling
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      code: error.response?.data?.code,
      details: error.response?.data?.details,
      status: error.response?.status,
    };

    // Dispatch custom event for 401 errors (handled by router)
    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('unauthorized'));
    }

    return Promise.reject(apiError);
  }
);

// Helper functions for common operations
export const apiUtils = {
  // GET request
  get: async <T>(url: string) => {
    try {
      const response = await apiClient.get<T>(url);
      return { data: response as T, error: null };
    } catch (error) {
      return { data: null, error: error as ApiError };
    }
  },

  // POST request
  post: async <T>(url: string, data?: any) => {
    try {
      const response = await apiClient.post<T>(url, data);
      return { data: response as T, error: null };
    } catch (error) {
      return { data: null, error: error as ApiError };
    }
  },

  // PATCH request
  patch: async <T>(url: string, data?: any) => {
    try {
      const response = await apiClient.patch<T>(url, data);
      return { data: response as T, error: null };
    } catch (error) {
      return { data: null, error: error as ApiError };
    }
  },

  // DELETE request
  delete: async <T>(url: string) => {
    try {
      const response = await apiClient.delete<T>(url);
      return { data: response as T, error: null };
    } catch (error) {
      return { data: null, error: error as ApiError };
    }
  },
};

export default apiClient;
