import { nasaService } from '../utils/nasaClient';
import { validateDate, validateDateRange, validateCount, ValidationError } from '../utils/validation';

export interface ApodQuery {
  date?: string;
  count?: string;
  start_date?: string;
  end_date?: string;
}

export class ApodService {
  async getApod(query: ApodQuery) {
    const { date, count, start_date, end_date } = query;

    if (count) {
      return this.getRandomApod(count);
    }

    if (start_date && end_date) {
      return this.getApodRange(start_date, end_date);
    }

    if (date) {
      return this.getApodByDate(date);
    }

    return this.getTodayApod();
  }

  private async getRandomApod(countStr: string) {
    const validation = validateCount(countStr);
    if (!validation.isValid) {
      throw new ValidationError(validation.error!, 'count');
    }

    const count = parseInt(countStr, 10);
    return nasaService.getRandomApod(count);
  }

  private async getApodRange(startDate: string, endDate: string) {
    const validation = validateDateRange(startDate, endDate, 30);
    if (!validation.isValid) {
      throw new ValidationError(validation.error!, 'date_range');
    }

    return nasaService.getApodRange(startDate, endDate);
  }

  private async getApodByDate(date: string) {
    const validation = validateDate(date);
    if (!validation.isValid) {
      throw new ValidationError(validation.error!, 'date');
    }

    return nasaService.getApod(date);
  }

  private async getTodayApod() {
    return nasaService.getApod();
  }
}

export const apodService = new ApodService();
