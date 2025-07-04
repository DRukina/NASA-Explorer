import { VercelRequest, VercelResponse } from '@vercel/node';
import { withMiddleware, corsMiddleware, methodGuard } from './utils/middleware';
import { createApiResponse } from './utils/responses';

async function healthHandler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    nasaApiKey: process.env.NASA_API_KEY ? 'configured' : 'using demo key',
    version: '2.0.0',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  };

  createApiResponse(res, healthData);
}

export default withMiddleware(
  healthHandler,
  corsMiddleware,
  methodGuard(['GET'])
);
