import { VercelRequest, VercelResponse } from '@vercel/node';
import { withMiddleware, corsMiddleware, methodGuard, rateLimitMiddleware } from './utils/middleware';
import { createApiResponse, createValidationErrorResponse } from './utils/responses';
import { sanitizeQuery, ValidationError } from './utils/validation';
import { neoService } from './services/neoService';

async function neoHandler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const query = sanitizeQuery(req.query);
  
  try {
    const data = await neoService.getNeoData(query);
    createApiResponse(res, data);
  } catch (error) {
    if (error instanceof ValidationError) {
      createValidationErrorResponse(res, error.field || 'unknown', error.message);
      return;
    }
    
    console.error('NEO API error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    createApiResponse(res, { error: message }, 500);
  }
}

export default withMiddleware(
  neoHandler,
  corsMiddleware,
  methodGuard(['GET']),
  rateLimitMiddleware
);
