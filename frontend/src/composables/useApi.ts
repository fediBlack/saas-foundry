import { ref } from 'vue';
import type { ApiError } from '@/types';
import { apiUtils } from '@/utils/api';
import { parseErrorDetails } from '@/utils/errors';

/**
 * Composable for making API calls with built-in loading and error handling
 */
export function useApi() {
  const loading = ref(false);
  const error = ref<ApiError | null>(null);
  const errorMessages = ref<string[]>([]);

  const clearError = () => {
    error.value = null;
    errorMessages.value = [];
  };

  const handleError = (err: unknown) => {
    const apiError = err as ApiError;
    error.value = apiError;
    errorMessages.value = parseErrorDetails(apiError);
  };

  const get = async <T>(url: string): Promise<T | null> => {
    clearError();
    loading.value = true;
    try {
      const { data, error: err } = await apiUtils.get<T>(url);
      if (err) {
        handleError(err);
        return null;
      }
      return data;
    } finally {
      loading.value = false;
    }
  };

  const post = async <T>(url: string, payload?: any): Promise<T | null> => {
    clearError();
    loading.value = true;
    try {
      const { data, error: err } = await apiUtils.post<T>(url, payload);
      if (err) {
        handleError(err);
        return null;
      }
      return data;
    } finally {
      loading.value = false;
    }
  };

  const patch = async <T>(url: string, payload?: any): Promise<T | null> => {
    clearError();
    loading.value = true;
    try {
      const { data, error: err } = await apiUtils.patch<T>(url, payload);
      if (err) {
        handleError(err);
        return null;
      }
      return data;
    } finally {
      loading.value = false;
    }
  };

  const delete_ = async <T>(url: string): Promise<T | null> => {
    clearError();
    loading.value = true;
    try {
      const { data, error: err } = await apiUtils.delete<T>(url);
      if (err) {
        handleError(err);
        return null;
      }
      return data;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    errorMessages,
    clearError,
    get,
    post,
    patch,
    delete: delete_,
  };
}
