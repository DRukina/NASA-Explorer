import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const isValidDate = (dateString: string): boolean => {
  if (!DATE_REGEX.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

const getDateDifference = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const validateOptionalDate = (req: Request, res: Response, next: NextFunction) => {
  const date = req.query.date as string;

  if (date) {
    if (!isValidDate(date)) {
      throw new ValidationError('Invalid date format. Use YYYY-MM-DD');
    }

    // Check if date is in the future
    const inputDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison

    if (inputDate > today) {
      throw new ValidationError('Date cannot be in the future');
    }
  }

  next();
};

export const validateDateRange = (maxDays: number = 30) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const startDate = req.query.start_date as string;
    const endDate = req.query.end_date as string;

    if (!startDate || !endDate) {
      throw new ValidationError('Both start_date and end_date are required');
    }

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      throw new ValidationError('Invalid date format. Use YYYY-MM-DD');
    }

    const diffDays = getDateDifference(startDate, endDate);
    if (diffDays > maxDays) {
      throw new ValidationError(`Date range cannot exceed ${maxDays} days`);
    }

    if (new Date(startDate) > new Date(endDate)) {
      throw new ValidationError('start_date cannot be after end_date');
    }

    next();
  };
};

export const validateCount = (maxCount: number = 10) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const countParam = req.query.count as string;

    if (countParam) {
      const count = parseInt(countParam, 10);

      if (isNaN(count) || count < 1) {
        throw new ValidationError('Count must be a positive integer');
      }

      if (count > maxCount) {
        throw new ValidationError(`Count cannot exceed ${maxCount}`);
      }

      req.query.count = count.toString();
    }

    next();
  };
};

export const validateNeoId = (req: Request, res: Response, next: NextFunction) => {
  const neoId = req.params.id;

  if (!neoId || !/^\d+$/.test(neoId)) {
    throw new ValidationError('Invalid NEO ID. Must be a numeric value');
  }

  next();
};

export const validateRequiredQuery = (requiredParams: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingParams = requiredParams.filter(param => !req.query[param]);

    if (missingParams.length > 0) {
      throw new ValidationError(`Missing required parameters: ${missingParams.join(', ')}`);
    }

    next();
  };
};

export const sanitizeRequest = (req: Request, res: Response, next: NextFunction) => {
  Object.keys(req.query).forEach(key => {
    if (typeof req.query[key] === 'string') {
      req.query[key] = (req.query[key] as string).trim();
    }
  });

  next();
};
