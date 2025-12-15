import { Request } from "express";

export interface RegisterBody {
  email: string;
  password: string;
  name?: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface AuthRequest extends Request {
  userId?: number;
}

export interface JWTPayload {
  userId: number;
}
