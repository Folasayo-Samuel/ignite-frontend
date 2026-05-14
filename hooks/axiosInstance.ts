import { BASE_URL } from "@/constants";
import { useAuthStore } from "@/store/authStore";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

// Request retry configuration
interface RetryConfig extends AxiosRequestConfig {
  _retry?: boolean;
  _retryCount?: number;
  _lastRequestTime?: number;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const RATE_LIMIT_DELAY = 60000; // 1 minute for rate limiting

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // crucial: allows browser to send/receive cookies automatically
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Channel": 1,
    "X-Requested-With": "XMLHttpRequest", // Helps with CSRF protection
  },
});

// Request interceptor for security and tracking
axiosInstance.interceptors.request.use(
  (config) => {
    // Add request timestamp for rate limiting
    const retryConfig = config as RetryConfig;
    retryConfig._lastRequestTime = Date.now();

    // Remove sensitive data from logs in production
    if (process.env.NODE_ENV === 'production') {
      // Sanitize URL to prevent logging sensitive data
      config.url = config.url?.replace(/token=[^&]*/, 'token=***');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for retry logic and error handling
axiosInstance.interceptors.response.use(
  (response) => {
    // Log successful requests in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Success: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        duration: response.config ? Date.now() - ((response.config as RetryConfig)._lastRequestTime || 0) : 0,
      });
    }

    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryConfig;
    
    // Log failed requests in development
    // Log failed requests in development, BUT skip if it is a 401 we are about to refresh
    if (process.env.NODE_ENV === 'development' && error.response?.status !== 401) {
      console.log(`❌ API Error: ${originalRequest.method?.toUpperCase()} ${originalRequest.url}`, {
        status: error.response?.status,
        message: error.message,
        code: error.code,
        data: error.response?.data,
      });
    }

    // Handle CORS errors
    const responseData = error.response?.data as any;
    if (error.response?.status === 403 && responseData && responseData.message?.includes('CORS')) {
      console.log('🚫 CORS Error: Request blocked by CORS policy');
      return Promise.reject(new Error('CORS error: Please check your backend CORS configuration'));
    }

    // Handle browser CORS errors (no response, but CORS error)
    if (!error.response && error.message?.includes('CORS')) {
      console.log('🚫 Browser CORS Error: Cross-origin request blocked');
      return Promise.reject(new Error('CORS error: Your browser blocked the cross-origin request'));
    }

    // Handle network errors
    if (!error.response) {
      // Network error, CORS issue, or server is down
      console.log('🔍 Network error details:', {
        code: error.code,
        message: error.message,
        config: error.config?.url,
        method: error.config?.method,
        isAxiosError: error.isAxiosError,
        errno: (error as any).errno,
        syscall: (error as any).syscall
      });
      
      const retryCount = originalRequest._retryCount || 0;
      
      if (retryCount < MAX_RETRIES && (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK' || error.code === 'ETIMEDOUT')) {
        console.log(`🔄 Retrying request (${retryCount + 1}/${MAX_RETRIES}): ${originalRequest.method?.toUpperCase()} ${originalRequest.url}`);
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        
        // Update retry count
        originalRequest._retryCount = retryCount + 1;
        
        // Retry the request
        return axiosInstance(originalRequest);
      }
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        console.log('🔌 Network Error: Unable to connect to the server. This might be a temporary issue.');
        return Promise.reject(new Error('Unable to connect to the server. Please check your internet connection and try again.'));
      }
      
      if (error.code === 'ETIMEDOUT') {
        console.log('⏰ Timeout Error: Server took too long to respond.');
        return Promise.reject(new Error('Request timeout. The server might be busy. Please try again.'));
      }
      
      return Promise.reject(new Error('Network error. Please check your connection and try again.'));
    }

    // Handle 401 Unauthorized - Token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      // Check skipAuthRefresh flag
      // This allows specific requests (like login) to opt-out of the automatic refresh logic
      // avoiding "Session Expired" errors when the credential themselves are invalid
      const extendedConfig = originalRequest as unknown as { skipAuthRedirect?: boolean, skipAuthRefresh?: boolean };
      const shouldSkipRedirect = extendedConfig.skipAuthRedirect === true;
      const shouldSkipRefresh = extendedConfig.skipAuthRefresh === true;

      // Determine if we are in the admin portal
      const isAdminArea = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin');

      // If this request explicitly skips auth redirect OR is configured to skip refresh OR is in admin area
      // Just reject with the original error so the app/guards can handle it gracefully.
      // (Admin auth is handled purely by AdminAuthGuard and useAdminSession)
      if (shouldSkipRedirect || shouldSkipRefresh || isAdminArea) {
        return Promise.reject(error);
      }

      try {
        // Attempt token refresh (for regular users only)
        await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { 
            withCredentials: true,
            timeout: 10000, // Shorter timeout for refresh
          }
        );
        
        // Retry original request with new token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout and redirect
        useAuthStore.getState().logout();
        
        // Clear all auth data
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          sessionStorage.clear();
        }
        
        // Only redirect if not already on auth page
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth')) {
          window.location.href = "/auth/login";
        }
        
        return Promise.reject(refreshError);
      }
    }

    // Handle rate limiting (429)
    if (error.response?.status === 429 && !originalRequest._retry) {
      // DO NOT automatically retry rate limits on auth endpoints (like login).
      // Let it fail immediately so the user sees the "Too Many Requests" error in the UI.
      if (originalRequest.url?.includes('/auth/')) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      const retryAfter = error.response.headers['retry-after'] || 60;
      const delay = Math.min(retryAfter * 1000, RATE_LIMIT_DELAY);

      // Wait and retry
      await new Promise(resolve => setTimeout(resolve, delay));
      return axiosInstance(originalRequest);
    }

    // Handle server errors with retry logic
    if (shouldRetry(error) && (originalRequest._retryCount || 0) < MAX_RETRIES) {
      originalRequest._retry = true;
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      // Exponential backoff with jitter
      const baseDelay = RETRY_DELAY * Math.pow(2, originalRequest._retryCount - 1);
      const jitter = Math.random() * 1000; // Random jitter to prevent thundering herd
      const delay = Math.min(baseDelay + jitter, 30000); // Max 30 seconds

      await new Promise(resolve => setTimeout(resolve, delay));
      return axiosInstance(originalRequest);
    }

    return Promise.reject(error);
  }
);

// Helper functions
function shouldRetry(error: AxiosError): boolean {
  const status = error.response?.status;
  
  // Retry on network errors and 5xx server errors
  if (!status) return true; // Network error
  
  // Don't retry on client errors (4xx) except 429 (rate limit)
  if (status >= 400 && status < 500 && status !== 429) return false;
  
  // Retry on server errors (5xx)
  if (status >= 500) return true;
  
  return false;
}

// Security utilities
export const setSecurityHeaders = (config: AxiosRequestConfig): AxiosRequestConfig => {
  return {
    ...config,
    headers: {
      ...config.headers,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  };
};

export default axiosInstance;
