// Auth types
export interface User {
  id: number;
  email: string;
  name?: string | null;
  createdAt?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

export interface AuthError {
  message: string;
  details?: Array<{ field: string; message: string }>;
}
