import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import apodRoutes from './routes/apod';
import neoRoutes from './routes/neo';

const app = express();

const limiter = rateLimit(config.rateLimiting);
const corsOptions = config.cors;

app.use(limiter);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    },
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/apod', apodRoutes);
app.use('/api/neo', neoRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'NASA Explorer API',
      version: '1.0.0',
      endpoints: {
        apod: '/api/apod',
        neo: '/api/neo',
        health: '/health',
      },
      documentation: 'https://github.com/your-repo/nasa-explorer',
    },
    timestamp: new Date().toISOString(),
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
