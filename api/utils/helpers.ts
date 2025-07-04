import { VercelRequest, VercelResponse } from '@vercel/node';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function createApiResponse<T>(
  res: VercelResponse,
  data: T,
  status: number = 200
): void {
  res.status(status).json({
    success: true,
    data,
  });
}

export function createErrorResponse(
  res: VercelResponse,
  error: string,
  status: number = 500
): void {
  res.status(status).json({
    success: false,
    error,
  });
}

export function validateDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && !!dateString.match(/^\d{4}-\d{2}-\d{2}$/);
}

export function validateDateRange(startDate: string, endDate: string, maxDays: number = 30): boolean {
  if (!validateDate(startDate) || !validateDate(endDate)) {
    return false;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays <= maxDays && start <= end;
}

export function getCurrentWeekRange(): { startDate: string; endDate: string } {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 3);
  
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 3);

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

export function sanitizeQuery(query: any): Record<string, string> {
  const sanitized: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(query)) {
    if (typeof value === 'string') {
      sanitized[key] = value.trim();
    }
  }
  
  return sanitized;
}

export function setCorsHeaders(res: VercelResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export function handleCors(req: VercelRequest, res: VercelResponse): boolean {
  setCorsHeaders(res);
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  
  return false;
}
