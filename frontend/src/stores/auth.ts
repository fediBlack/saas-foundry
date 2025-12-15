import { defineStore } from "pinia";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.withCredentials = true;

interface User {
  id: number;
  email: string;
  name?: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem("token"),
    loading: false,
    error: null,
    initialized: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
  },
  actions: {
    async register(email: string, password: string, name?: string) {
      this.loading = true;
      this.error = null;
      try {
        const res = await axios.post("/auth/register", {
          email,
          password,
          name,
        });
        this.user = res.data.user;
        this.token = res.data.token;
        localStorage.setItem("token", this.token || "");
      } catch (err: any) {
        this.error = err.response?.data?.error || "Registration failed";
      } finally {
        this.loading = false;
        this.initialized = true;
      }
    },
    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        const res = await axios.post("/auth/login", { email, password });
        this.user = res.data.user;
        this.token = res.data.token;
        localStorage.setItem("token", this.token || "");
      } catch (err: any) {
        this.error = err.response?.data?.error || "Login failed";
      } finally {
        this.loading = false;
      }
    },
    async fetchMe() {
      this.loading = true;
      this.error = null;
      try {
        const res = await axios.get("/auth/me", {
          headers: this.token ? { Authorization: `Bearer ${this.token}` } : {},
        });

        this.user = res.data.user;
      } catch {
        this.user = null;
        this.token = null;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      await axios.post("/auth/logout");
      localStorage.removeItem("token");
      this.user = null;
      this.token = null;
    },
  },
});
