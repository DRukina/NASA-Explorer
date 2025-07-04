import request from 'supertest';
import app from '../app';

describe('NASA Explorer API', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          status: 'healthy',
          environment: expect.any(String),
          uptime: expect.any(Number),
          timestamp: expect.any(String),
        },
        timestamp: expect.any(String),
      });
    });

    it('should return valid timestamp format', async () => {
      const response = await request(app).get('/health').expect(200);

      const timestamp = response.body.data.timestamp;
      expect(new Date(timestamp).toISOString()).toBe(timestamp);
    });
  });

  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app).get('/').expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          message: 'NASA Explorer API',
          version: '1.0.0',
          endpoints: {
            apod: '/api/apod',
            neo: '/api/neo',
            health: '/health',
          },
          documentation: expect.any(String),
        },
        timestamp: expect.any(String),
      });
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/non-existent-route').expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: {
          message: expect.stringContaining('not found'),
          status: 404,
        },
      });
    });
  });

  describe('CORS Headers', () => {
    it('should include CORS headers', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('Rate Limiting', () => {
    it('should include rate limit headers', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.headers['x-ratelimit-limit']).toBeDefined();
      expect(response.headers['x-ratelimit-remaining']).toBeDefined();
    });
  });
});
