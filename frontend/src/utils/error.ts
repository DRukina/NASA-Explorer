import type { ApiError } from '../types/api';

export const handleApiError = (error: unknown): string => {
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unexpected error occurred';
};

export const createApiError = (
  message: string,
  status?: number,
  details?: Record<string, unknown>
): ApiError => {
  return {
    message,
    status,
    details,
  };
};

export const isNetworkError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return (
      error.message.toLowerCase().includes('network') ||
      error.message.toLowerCase().includes('fetch') ||
      error.message.toLowerCase().includes('connection')
    );
  }
  return false;
};

export const isTimeoutError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return (
      error.message.toLowerCase().includes('timeout') ||
      error.message.toLowerCase().includes('aborted')
    );
  }
  return false;
};

export const isClientError = (error: unknown): boolean => {
  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as { status: number }).status;
    return status >= 400 && status < 500;
  }
  return false;
};

export const isServerError = (error: unknown): boolean => {
  if (error && typeof error === 'object' && 'status' in error) {
    const status = (error as { status: number }).status;
    return status >= 500 && status < 600;
  }
  return false;
};

export const getRetryMessage = (error: unknown): string => {
  if (isNetworkError(error)) {
    return 'Network connection failed. Please check your internet connection and try again.';
  }

  if (isTimeoutError(error)) {
    return 'Request timed out. Please try again.';
  }

  if (isServerError(error)) {
    return 'Server error occurred. Please try again in a few moments.';
  }

  return handleApiError(error);
};
