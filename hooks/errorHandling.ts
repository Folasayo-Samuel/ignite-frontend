/* eslint-disable react-hooks/rules-of-hooks */
import { ApiError } from "@/components/api/type";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface ResponseData {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
  [key: string]: any;
}

export interface ApiErrorDetails extends ApiError {
  field?: string;
  code?: string;
  retryable?: boolean;
  requiresAuth?: boolean;
  requiresVerification?: boolean;
}

export const handleApiError = (error: unknown): ApiErrorDetails => {
  if (isAxiosError(error)) {
    const responseData = error?.response?.data as ResponseData;
    const status = error.response?.status || 500;

    // Handle different error response formats
    const message = responseData?.message || 
                   responseData?.error || 
                   getValidationErrors(responseData?.errors) ||
                   error.message ||
                   "An unexpected error occurred";

    return {
      message: sanitizeErrorMessage(message),
      status,
      data: responseData,
      field: getErrorField(responseData?.errors),
      code: responseData?.code || getErrorCode(status),
      retryable: isRetryableError(status),
      requiresAuth: status === 401,
      requiresVerification: status === 403 && responseData?.code === 'EMAIL_NOT_VERIFIED',
    };
  } else if (error instanceof Error) {
    return {
      message: sanitizeErrorMessage(error.message),
      status: 500,
      code: 'UNKNOWN_ERROR',
      retryable: false,
      requiresAuth: false,
    };
  } else {
    return {
      message: "An unknown error occurred",
      status: 500,
      code: 'UNKNOWN_ERROR',
      retryable: false,
      requiresAuth: false,
    };
  }
};

function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError === true;
}

function getValidationErrors(errors?: Record<string, string[]>): string | null {
  if (!errors) return null;
  
  const errorMessages = Object.values(errors).flat();
  return errorMessages.length > 0 ? errorMessages[0] : null;
}

function getErrorField(errors?: Record<string, string[]>): string | undefined {
  if (!errors) return undefined;
  return Object.keys(errors)[0];
}

function getErrorCode(status: number): string {
  const statusCodes: Record<number, string> = {
    400: 'BAD_REQUEST',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    422: 'VALIDATION_ERROR',
    429: 'RATE_LIMIT_EXCEEDED',
    500: 'INTERNAL_SERVER_ERROR',
    502: 'BAD_GATEWAY',
    503: 'SERVICE_UNAVAILABLE',
    504: 'GATEWAY_TIMEOUT',
  };
  
  return statusCodes[status] || 'UNKNOWN_ERROR';
}

function isRetryableError(status: number): boolean {
  // Retry on network errors and server errors
  return status >= 500 || status === 429;
}

function sanitizeErrorMessage(message: string): string {
  // Remove sensitive information and sanitize for display
  return message
    .replace(/password/gi, '****')
    .replace(/token/gi, '****')
    .replace(/secret/gi, '****')
    .replace(/key/gi, '****')
    .trim();
}

export const handleNetworkError = (error: ApiErrorDetails) => {
  if (error.status === 0 || error.message?.includes("network error")) {
    toast.error("Network connection error. Please check your internet connection and try again.");
    console.error("Network error:", error.message);
  }
};

export const handleAuthenticationError = (error: ApiErrorDetails) => {
  if (error.requiresAuth) {
    toast.error("Your session has expired. Please log in again.");
    
    // Clear local storage and redirect to login
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/auth/login';
    }
  }
  
  if (error.requiresVerification) {
    toast.error("Please verify your email address to continue.");
    window.location.href = '/auth/verify-email';
  }
};

export const handleForbiddenError = (error: ApiErrorDetails) => {
  if (error.status === 403 && !error.requiresVerification) {
    toast.error("You don't have permission to perform this action.");
    console.error("Forbidden error:", error.message);
  }
};

export const handleValidationError = (error: ApiErrorDetails) => {
  if (error.status === 422 || error.status === 400) {
    if (error.field) {
      toast.error(`${error.field}: ${error.message}`);
    } else {
      toast.error(error.message);
    }
  }
};

export const handleRateLimitError = (error: ApiErrorDetails) => {
  if (error.status === 429) {
    toast.error("Too many requests. Please try again later.");
  }
};

export const handleServerError = (error: ApiErrorDetails) => {
  if (error.status && error.status >= 500) {
    toast.error("Server error. Please try again later.");
    console.error("Server error:", error.message);
  }
};

export const globalErrorHandler = (error: unknown): ApiErrorDetails => {
  const apiError = handleApiError(error);

  // Handle specific error types
  handleNetworkError(apiError);
  handleAuthenticationError(apiError);
  handleForbiddenError(apiError);
  handleValidationError(apiError);
  handleRateLimitError(apiError);
  handleServerError(apiError);

  // Log error for debugging (in production, this would go to a logging service)
  if (process.env.NODE_ENV === 'development') {
    console.error('API Error:', apiError);
  }

  return apiError;
};

// Security utilities
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove potential XSS
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
