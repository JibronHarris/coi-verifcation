import { User } from "./user.types";

export interface SessionResponse {
  user: User | null;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}

export interface SignInDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}
