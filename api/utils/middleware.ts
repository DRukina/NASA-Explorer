import { VercelRequest, VercelResponse } from '@vercel/node';
import { createErrorResponse } from './responses';

export type Handler = (req: VercelRequest, res: VercelResponse) => Promise<void>;
export type Middleware = (req: VercelRequest, res: VercelResponse, next: () => Promise<void>) => Promise<void>;

export function withMiddleware(handler: Handler, ...middlewares: Middleware[]): Handler {
  return async (req: VercelRequest, res: VercelResponse) => {
    let index = 0;

    const next = async (): Promise<void> => {
      if (index < middlewares.length) {
        const middleware = middlewares[index++];
        await middleware(req, res, next);
      } else {
        await handler(req, res);
      }
    };

    try {
      await next();
    } catch (error) {
      console.error('API Error:', error);
      const message = error instanceof Error ? error.message : 'Internal server error';
      createErrorResponse(res, message, 500);
    }
  };
}

export const corsMiddleware: Middleware = async (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  await next();
};

export const methodGuard = (allowedMethods: string[]): Middleware => {
  return async (req, res, next) => {
    if (!allowedMethods.includes(req.method || '')) {
      createErrorResponse(res, `Method ${req.method} not allowed`, 405);
      return;
    }
    await next();
  };
};

export const rateLimitMiddleware: Middleware = async (req, res, next) => {
  const userAgent = req.headers['user-agent'] || 'unknown';
  const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
  
  console.log(`API Request: ${req.method} ${req.url} - IP: ${ip} - UA: ${userAgent}`);
  
  await next();
};
