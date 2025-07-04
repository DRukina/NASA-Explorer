import { Request, Response, NextFunction } from 'express';
import { ApiError, isOperationalError } from '../utils/errors';
import { ApiResponse } from '../types/nasa';
import { config } from '../config';

export function errorHandler(
  error: Error & {
    response?: { status?: number; data?: { error?: { message?: string } }; statusText?: string };
    code?: string;
    status?: number;
  },
  req: Request,
  res: Response<ApiResponse<null>>,
  _next: NextFunction
): void {
  console.error('Error occurred:', {
    url: req.url,
    method: req.method,
    error: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });

  let status = 500;
  let message = 'Internal server error';

  if (error instanceof ApiError) {
    status = error.statusCode;
    message = error.message;
  } else if (error.response) {
    status = error.response.status || 500;
    message = error.response.data?.error?.message || error.response.statusText || 'NASA API error';
  } else if (error.code === 'ECONNABORTED') {
    status = 408;
    message = 'Request timeout - NASA API is taking too long to respond';
  } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    status = 503;
    message = 'Service unavailable - Cannot connect to NASA API';
  } else if (error.name === 'ValidationError') {
    status = 400;
    message = error.message;
  } else if (error.status) {
    status = error.status;
    message = error.message;
  } else if (error.message) {
    message = error.message;
  }

  const response: ApiResponse<null> = {
    success: false,
    error: {
      message,
      status,
      ...(config.nodeEnv === 'development' && { stack: error.stack }),
    },
    timestamp: new Date().toISOString(),
  };

  if (!isOperationalError(error)) {
    console.error('Non-operational error:', {
      error: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
    });
  }

  res.status(status).json(response);
}

export function notFoundHandler(
  req: Request,
  res: Response<ApiResponse<null>>,
  _next: NextFunction
): void {
  const response: ApiResponse<null> = {
    success: false,
    error: {
      message: `Route ${req.method} ${req.path} not found`,
      status: 404,
    },
    timestamp: new Date().toISOString(),
  };

  res.status(404).json(response);
}
