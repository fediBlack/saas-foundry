import { defineStore } from 'pinia';
import { apiUtils } from '@/utils';
import { getFirstErrorMessage } from '@/utils/errors';
import type { User, LoginPayload, RegisterPayload, AuthResponse, AuthState } from '@/types';

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    errorMessages: (state) => (state.error ? [state.error] : []),
  },

  actions: {
    /**
     * Register new user
     */
    async register(payload: RegisterPayload) {
      this.loading = true;
      this.error = null;

      try {
        const { data, error } = await apiUtils.post<AuthResponse>('/auth/register', payload);

        if (error) {
          this.error = getFirstErrorMessage(error);
          return false;
        }

        if (data) {
          this.user = data.user;
          this.token = data.token;
          localStorage.setItem('token', this.token);
          this.initialized = true;
          return true;
        }
      } catch (err) {
        this.error = 'An unexpected error occurred during registration';
      } finally {
        this.loading = false;
      }

      return false;
    },

    /**
     * Login user
     */
    async login(payload: LoginPayload) {
      this.loading = true;
      this.error = null;

      try {
        const { data, error } = await apiUtils.post<AuthResponse>('/auth/login', payload);

        if (error) {
          this.error = getFirstErrorMessage(error);
          return false;
        }

        if (data) {
          this.user = data.user;
          this.token = data.token;
          localStorage.setItem('token', this.token);
          this.initialized = true;
          return true;
        }
      } catch (err) {
        this.error = 'An unexpected error occurred during login';
      } finally {
        this.loading = false;
      }

      return false;
    },

    /**
     * Fetch current user (validate token)
     */
    async fetchMe() {
      this.loading = true;

      try {
        const { data, error } = await apiUtils.get<{ user: User }>('/auth/me');

        if (error) {
          this.user = null;
          this.token = null;
          localStorage.removeItem('token');
          return false;
        }

        if (data?.user) {
          this.user = data.user;
          this.initialized = true;
          return true;
        }
      } catch (err) {
        this.user = null;
        this.token = null;
        localStorage.removeItem('token');
      } finally {
        this.loading = false;
      }

      return false;
    },

    /**
     * Logout user
     */
    async logout() {
      try {
        await apiUtils.post('/auth/logout');
      } catch {
        // Logout error is not critical
      } finally {
        localStorage.removeItem('token');
        this.user = null;
        this.token = null;
        this.error = null;
      }
    },

    /**
     * Clear error message
     */
    clearError() {
      this.error = null;
    },

    /**
     * Initialize store (check if token is valid)
     */
    async initialize() {
      if (this.token && !this.initialized) {
        await this.fetchMe();
      }
      this.initialized = true;
    },
  },
});
