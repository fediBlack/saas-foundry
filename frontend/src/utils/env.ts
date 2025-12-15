/**
 * Environment configuration management
 * Centralized access to environment variables with type safety
 */

export const envConfig = {
  /**
   * API base URL for backend requests
   */
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',

  /**
   * Environment mode (development, production, test)
   */
  mode: import.meta.env.MODE,

  /**
   * Whether running in development
   */
  isDev: import.meta.env.DEV,

  /**
   * Whether running in production
   */
  isProd: import.meta.env.PROD,

  /**
   * App version or other metadata
   */
  appVersion: import.meta.env.VITE_APP_VERSION || '0.1.0',
};

/**
 * Validate that required environment variables are set
 */
export const validateEnv = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!envConfig.apiUrl) {
    errors.push('VITE_API_URL is not configured');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
