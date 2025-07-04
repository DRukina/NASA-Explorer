import { VercelResponse } from '@vercel/node';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

export function createApiResponse<T>(
  res: VercelResponse,
  data: T,
  status: number = 200,
  cached: boolean = false
): void {
  const response: ApiResponse<T> = {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };

  if (cached) {
    res.setHeader('X-Cache-Status', 'HIT');
  }

  res.status(status).json(response);
}

export function createErrorResponse(
  res: VercelResponse,
  error: string,
  status: number = 500,
  details?: any
): void {
  const response: ApiResponse = {
    success: false,
    error,
    timestamp: new Date().toISOString(),
  };

  if (details && process.env.NODE_ENV === 'development') {
    response.message = details;
  }

  res.status(status).json(response);
}

export function createValidationErrorResponse(
  res: VercelResponse,
  field: string,
  message: string
): void {
  createErrorResponse(res, `Validation error: ${field} - ${message}`, 400);
}
