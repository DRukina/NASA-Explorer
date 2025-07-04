import { Router } from 'express';
import { NeoResponse, NearEarthObject } from '../types/nasa';
import { nasaService } from '../services/nasaService';
import { config } from '../config';
import {
  createApiHandler,
  createDateRangeCacheKey,
  createIdCacheKey,
  getCurrentWeekRange,
} from '../utils/createApiHandler';
import { validateDateRange, validateNeoId, sanitizeRequest } from '../middleware/requestValidator';

const router = Router();

router.get(
  '/',
  sanitizeRequest,
  createApiHandler<NeoResponse>({
    cacheKey: () => {
      const { startDate } = getCurrentWeekRange();
      return `neo-current-week-${startDate}`;
    },
    fetchFunction: async () => {
      const { startDate, endDate } = getCurrentWeekRange();
      return await nasaService.getNeoFeed(startDate, endDate);
    },
    cacheTtl: config.cache.neoTtl,
  })
);

router.get(
  '/feed',
  sanitizeRequest,
  validateDateRange(7),
  createApiHandler<NeoResponse>({
    cacheKey: req => createDateRangeCacheKey('neo-feed', req),
    fetchFunction: async req => {
      const startDate = req.query.start_date as string;
      const endDate = req.query.end_date as string;
      return await nasaService.getNeoFeed(startDate, endDate);
    },
    cacheTtl: config.cache.neoTtl,
  })
);

router.get(
  '/today',
  sanitizeRequest,
  createApiHandler<NeoResponse>({
    cacheKey: () => {
      const today = new Date().toISOString().split('T')[0];
      return `neo-today-${today}`;
    },
    fetchFunction: async () => {
      const today = new Date().toISOString().split('T')[0];
      return await nasaService.getNeoFeed(today, today);
    },
    cacheTtl: config.cache.neoTodayTtl,
  })
);

router.get(
  '/stats',
  sanitizeRequest,
  createApiHandler<Record<string, unknown>>({
    cacheKey: 'neo-stats',
    fetchFunction: async () => {
      return await nasaService.getNeoStats();
    },
    cacheTtl: config.cache.neoStatsTtl,
  })
);

router.get(
  '/:id',
  sanitizeRequest,
  validateNeoId,
  createApiHandler<NearEarthObject>({
    cacheKey: req => createIdCacheKey('neo-detail', req),
    fetchFunction: async req => {
      const neoId = req.params.id;
      return await nasaService.getNeoById(neoId);
    },
    cacheTtl: config.cache.neoTodayTtl,
  })
);

export default router;
