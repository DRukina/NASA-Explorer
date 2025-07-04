import { VercelRequest, VercelResponse } from '@vercel/node';
import { nasaService } from './utils/nasaClient';
import { 
  createApiResponse, 
  createErrorResponse, 
  handleCors, 
  validateDate, 
  validateDateRange,
  sanitizeQuery 
} from './utils/helpers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) {
    return;
  }

  if (req.method !== 'GET') {
    return createErrorResponse(res, 'Method not allowed', 405);
  }

  try {
    const query = sanitizeQuery(req.query);
    const { date, count, start_date, end_date } = query;

    if (count) {
      const countNum = parseInt(count);
      if (isNaN(countNum) || countNum < 1 || countNum > 10) {
        return createErrorResponse(res, 'Count must be between 1 and 10', 400);
      }
      
      const data = await nasaService.getRandomApod(countNum);
      return createApiResponse(res, data);
    }

    if (start_date && end_date) {
      if (!validateDateRange(start_date, end_date, 30)) {
        return createErrorResponse(res, 'Invalid date range. Maximum 30 days allowed.', 400);
      }
      
      const data = await nasaService.getApodRange(start_date, end_date);
      return createApiResponse(res, data);
    }

    if (date) {
      if (!validateDate(date)) {
        return createErrorResponse(res, 'Invalid date format. Use YYYY-MM-DD', 400);
      }
    }

    const data = await nasaService.getApod(date);
    return createApiResponse(res, data);

  } catch (error) {
    console.error('APOD API error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return createErrorResponse(res, message, 500);
  }
}
