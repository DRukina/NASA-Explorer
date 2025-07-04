import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',

  nasaApiKey: process.env.NASA_API_KEY || 'DEMO_KEY',
  nasaApiBaseUrl: 'https://api.nasa.gov',
  nasaApiTimeout: 10000,

  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  rateLimiting: {
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
      success: false,
      error: {
        message: 'Too many requests from this IP, please try again later.',
        status: 429,
      },
      timestamp: new Date().toISOString(),
    },
    standardHeaders: true,
    legacyHeaders: true,
  },

  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200,
  },

  cache: {
    defaultTtl: 300,
    apodTtl: 600,
    neoTtl: 600,
    neoTodayTtl: 1800,
    neoStatsTtl: 3600,
    apodRandomTtl: 300,
    apodRangeTtl: 900,
  },
};
