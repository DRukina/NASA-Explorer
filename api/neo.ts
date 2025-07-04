import { VercelRequest, VercelResponse } from '@vercel/node';
import { nasaService } from './utils/nasaClient';
import { 
  createApiResponse, 
  createErrorResponse, 
  handleCors, 
  validateDateRange,
  getCurrentWeekRange,
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
    const { start_date, end_date, id, stats, today } = query;

    if (id) {
      if (!id.match(/^\d+$/)) {
        return createErrorResponse(res, 'Invalid NEO ID format', 400);
      }
      
      const data = await nasaService.getNeoById(id);
      return createApiResponse(res, data);
    }

    if (stats === 'true') {
      const data = await nasaService.getNeoStats();
      return createApiResponse(res, data);
    }

    if (today === 'true') {
      const todayDate = new Date().toISOString().split('T')[0];
      const data = await nasaService.getNeoFeed(todayDate, todayDate);
      return createApiResponse(res, data);
    }

    if (start_date && end_date) {
      if (!validateDateRange(start_date, end_date, 7)) {
        return createErrorResponse(res, 'Invalid date range. Maximum 7 days allowed for NEO feed.', 400);
      }
      
      const data = await nasaService.getNeoFeed(start_date, end_date);
      return createApiResponse(res, data);
    }

    const { startDate, endDate } = getCurrentWeekRange();
    const data = await nasaService.getNeoFeed(startDate, endDate);
    return createApiResponse(res, data);

  } catch (error) {
    console.error('NEO API error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return createErrorResponse(res, message, 500);
  }
}
