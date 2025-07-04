import { VercelRequest, VercelResponse } from '@vercel/node';
import { createApiResponse, handleCors } from './utils/helpers';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) {
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    nasaApiKey: process.env.NASA_API_KEY ? 'configured' : 'using demo key',
    version: '1.0.0',
  };

  return createApiResponse(res, healthData);
}
