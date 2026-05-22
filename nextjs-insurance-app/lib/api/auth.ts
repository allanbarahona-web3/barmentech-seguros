import { apiClient } from './client';
import { AuthResponse, LoginDto, RegisterDto, User } from '../types/auth';

/**
 * Authentication API calls
 */
export const authAPI = {
  /**
   * Login user
   */
  login: async (credentials: LoginDto): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * Register new client
   */
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * Get current user profile
   */
  me: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },
};
