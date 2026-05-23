import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3005/api';

/**
 * Axios instance with base configuration
 */
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Add auth token to requests if available
 */
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('[apiClient] Adding token to request:', config.url, '| Token:', token.substring(0, 20) + '...');
      } else {
        console.log('[apiClient] No token found for request:', config.url);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Handle response errors
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't handle 401 here - let AuthContext handle it
    // This prevents double redirect issues
    return Promise.reject(error);
  }
);

export default apiClient;
