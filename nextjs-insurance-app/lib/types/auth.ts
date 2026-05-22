/**
 * User roles in the system
 */
export type UserRole = 'ADMIN' | 'AGENT' | 'CLIENT';

/**
 * User entity from backend
 */
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Login request payload
 */
export interface LoginDto {
  email: string;
  password: string;
  honeypot?: string;
}

/**
 * Register request payload
 */
export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  honeypot?: string;
}

/**
 * Authentication response from backend
 */
export interface AuthResponse {
  access_token: string;
  user: User;
}

/**
 * Auth context state
 */
export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
