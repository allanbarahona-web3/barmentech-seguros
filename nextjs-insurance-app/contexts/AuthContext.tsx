'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType, RegisterDto } from '@/lib/types/auth';
import { authAPI } from '@/lib/api/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Load user from localStorage on mount - SYNCHRONOUS
   */
  useEffect(() => {
    console.log('[AuthContext] Loading authentication state...');
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    
    console.log('[AuthContext] Token exists:', !!savedToken);
    console.log('[AuthContext] User exists:', !!savedUser);

    if (savedToken && savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('[AuthContext] Setting user:', parsedUser.email);
        setUser(parsedUser);
        setToken(savedToken);
      } catch (parseError) {
        console.error('[AuthContext] Error parsing saved user:', parseError);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    } else {
      console.log('[AuthContext] No saved authentication');
    }

    // IMPORTANT: Set loading to false IMMEDIATELY after checking localStorage
    console.log('[AuthContext] Loading complete, isAuthenticated:', !!(savedToken && savedUser));
    setLoading(false);
  }, []);

  /**
   * Validate token in background (after initial load)
   */
  useEffect(() => {
    if (!token) return; // No token to validate

    const validateToken = async () => {
      try {
        console.log('[AuthContext] Background: Validating token...');
        console.log('[AuthContext] Background: Token from state:', token?.substring(0, 20) + '...');
        console.log('[AuthContext] Background: Token from localStorage:', localStorage.getItem('auth_token')?.substring(0, 20) + '...');
        
        const currentUser = await authAPI.me();
        console.log('[AuthContext] Background: Token valid, updating user');
        setUser(currentUser);
        localStorage.setItem('auth_user', JSON.stringify(currentUser));
      } catch (apiError: any) {
        console.error('[AuthContext] Background: Validation error:', apiError);
        if (apiError.response?.status === 401) {
          console.log('[AuthContext] Background: Token invalid (401), logging out');
          logout();
        } else {
          console.warn('[AuthContext] Background: Validation error (keeping session):', apiError.message);
        }
      }
    };

    // Validate after a delay to ensure token is set in interceptor
    const timeoutId = setTimeout(validateToken, 500); // Increased from 100ms to 500ms
    return () => clearTimeout(timeoutId);
  }, [token]);

  /**
   * Login user
   */
  const login = async (email: string, password: string) => {
    try {
      console.log('[AuthContext] Login: Attempting login for', email);
      const response = await authAPI.login({ email, password, honeypot: '' });
      
      console.log('[AuthContext] Login: Response received, token:', response.access_token?.substring(0, 20) + '...');
      console.log('[AuthContext] Login: User:', response.user.email);
      
      // Save to state
      setUser(response.user);
      setToken(response.access_token);

      // Save to localStorage
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      
      // Verify it was saved
      const savedToken = localStorage.getItem('auth_token');
      const savedUser = localStorage.getItem('auth_user');
      console.log('[AuthContext] Login: Verified localStorage - Token exists:', !!savedToken, 'User exists:', !!savedUser);
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  /**
   * Register new client
   */
  const register = async (data: RegisterDto) => {
    try {
      const response = await authAPI.register({ ...data, honeypot: '' });
      
      // Save to state
      setUser(response.user);
      setToken(response.access_token);

      // Save to localStorage
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
    } catch (error: any) {
      console.error('Register error:', error);
      throw new Error(error.response?.data?.message || 'Error al registrarse');
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    console.log('[AuthContext] Logout: Called from', new Error().stack?.split('\n')[2]);
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    console.log('[AuthContext] Logout: Complete');
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use auth context
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
