import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/nasa';
import { cacheService } from '../services/cacheService';

export interface ApiHandlerOptions<T> {
  cacheKey: string | ((req: Request) => string);
  fetchFunction: (req: Request) => Promise<T>;
  cacheTtl?: number;
}

export function createApiHandler<T>(options: ApiHandlerOptions<T>) {
  return async (req: Request, res: Response<ApiResponse<T>>, next: NextFunction) => {
    try {
      const cacheKey =
        typeof options.cacheKey === 'function' ? options.cacheKey(req) : options.cacheKey;

      const { data, cached } = await cacheService.getOrSet(
        cacheKey,
        () => options.fetchFunction(req),
        options.cacheTtl
      );

      const response: ApiResponse<T> = {
        success: true,
        data,
        cached,
        timestamp: new Date().toISOString(),
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}

export const createDateCacheKey = (prefix: string, req: Request): string => {
  const date = req.query.date as string;
  return date ? `${prefix}-${date}` : `${prefix}-today`;
};

export const createDateRangeCacheKey = (prefix: string, req: Request): string => {
  const startDate = req.query.start_date as string;
  const endDate = req.query.end_date as string;
  return `${prefix}-${startDate}-${endDate}`;
};

export const createCountCacheKey = (prefix: string, req: Request): string => {
  const count = (req.query.count as string) || '1';
  return `${prefix}-${count}`;
};

export const createIdCacheKey = (prefix: string, req: Request): string => {
  const id = req.params.id;
  return `${prefix}-${id}`;
};

export const getCurrentWeekRange = (): { startDate: string; endDate: string } => {
  const today = new Date();
  const startDate = today.toISOString().split('T')[0];

  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + 7);
  const endDate = endOfWeek.toISOString().split('T')[0];

  return { startDate, endDate };
};
