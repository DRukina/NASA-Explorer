import { VercelRequest, VercelResponse } from '@vercel/node';
import { withMiddleware, corsMiddleware, methodGuard, rateLimitMiddleware } from './utils/middleware';
import { createApiResponse, createValidationErrorResponse } from './utils/responses';
import { sanitizeQuery, ValidationError } from './utils/validation';
import { apodService } from './services/apodService';

async function apodHandler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const query = sanitizeQuery(req.query);
  
  try {
    const data = await apodService.getApod(query);
    createApiResponse(res, data);
  } catch (error) {
    if (error instanceof ValidationError) {
      createValidationErrorResponse(res, error.field || 'unknown', error.message);
      return;
    }
    
    console.error('APOD API error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    createApiResponse(res, { error: message }, 500);
  }
}

export default withMiddleware(
  apodHandler,
  corsMiddleware,
  methodGuard(['GET']),
  rateLimitMiddleware
);
