import { Router } from 'express';
import { ApodResponse } from '../types/nasa';
import { nasaService } from '../services/nasaService';
import { config } from '../config';
import {
  createApiHandler,
  createDateCacheKey,
  createCountCacheKey,
  createDateRangeCacheKey,
} from '../utils/createApiHandler';
import {
  validateOptionalDate,
  validateDateRange,
  validateCount,
  sanitizeRequest,
} from '../middleware/requestValidator';

const router = Router();

router.get(
  '/',
  sanitizeRequest,
  validateOptionalDate,
  createApiHandler<ApodResponse>({
    cacheKey: req => createDateCacheKey('apod', req),
    fetchFunction: async req => {
      const date = req.query.date as string;
      return await nasaService.getApod(date);
    },
    cacheTtl: config.cache.apodTtl,
  })
);

router.get(
  '/random',
  sanitizeRequest,
  validateCount(10),
  createApiHandler<ApodResponse | ApodResponse[]>({
    cacheKey: req => createCountCacheKey('apod-random', req),
    fetchFunction: async req => {
      const count = parseInt(req.query.count as string) || 1;
      return await nasaService.getRandomApod(count);
    },
    cacheTtl: config.cache.apodRandomTtl,
  })
);

router.get(
  '/range',
  sanitizeRequest,
  validateDateRange(30),
  createApiHandler<ApodResponse[]>({
    cacheKey: req => createDateRangeCacheKey('apod-range', req),
    fetchFunction: async req => {
      const startDate = req.query.start_date as string;
      const endDate = req.query.end_date as string;
      return await nasaService.getApodRange(startDate, endDate);
    },
    cacheTtl: config.cache.apodRangeTtl,
  })
);

export default router;
