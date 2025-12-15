import type { ApiError } from '@/types';

/**
 * Parse validation errors from API response
 * Returns formatted error details
 */
export const parseErrorDetails = (error: ApiError): string[] => {
  const messages: string[] = [];

  if (error.message) {
    messages.push(error.message);
  }

  if (error.details && Array.isArray(error.details)) {
    error.details.forEach((detail: { field: string; message: string }) => {
      messages.push(`${detail.field}: ${detail.message}`);
    });
  }

  return messages.length > 0 ? messages : ['An unknown error occurred'];
};

/**
 * Format a single error detail
 */
export const formatErrorDetail = (field: string, message: string): string => {
  return `${field}: ${message}`;
};

/**
 * Check if error is a validation error
 */
export const isValidationError = (error: ApiError): boolean => {
  return !!(
    error.code === 'VALIDATION_ERROR' ||
    (error.details && Array.isArray(error.details) && error.details.length > 0)
  );
};

/**
 * Check if error is an authentication error
 */
export const isAuthError = (error: ApiError): boolean => {
  return error.status === 401 || error.code === 'UNAUTHORIZED';
};

/**
 * Check if error is a conflict (e.g., email already exists)
 */
export const isConflictError = (error: ApiError): boolean => {
  return error.status === 409 || error.code === 'CONFLICT';
};

/**
 * Get first error message for display
 */
export const getFirstErrorMessage = (error: ApiError): string => {
  if (error.message) {
    return error.message;
  }

  if (error.details && error.details.length > 0) {
    return error.details[0]?.message || 'An unknown error occurred';
  }

  return 'An unknown error occurred';
};
