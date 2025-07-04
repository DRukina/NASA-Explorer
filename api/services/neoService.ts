import { nasaService } from '../utils/nasaClient';
import { validateDateRange, validateNeoId, getCurrentWeekRange, getTodayDate, ValidationError } from '../utils/validation';

export interface NeoQuery {
  start_date?: string;
  end_date?: string;
  id?: string;
  stats?: string;
  today?: string;
}

export class NeoService {
  async getNeoData(query: NeoQuery) {
    const { start_date, end_date, id, stats, today } = query;

    if (id) {
      return this.getNeoById(id);
    }

    if (stats === 'true') {
      return this.getNeoStats();
    }

    if (today === 'true') {
      return this.getTodayNeos();
    }

    if (start_date && end_date) {
      return this.getNeoFeedByRange(start_date, end_date);
    }

    return this.getCurrentWeekNeos();
  }

  private async getNeoById(id: string) {
    const validation = validateNeoId(id);
    if (!validation.isValid) {
      throw new ValidationError(validation.error!, 'id');
    }

    return nasaService.getNeoById(id);
  }

  private async getNeoStats() {
    return nasaService.getNeoStats();
  }

  private async getTodayNeos() {
    const todayDate = getTodayDate();
    return nasaService.getNeoFeed(todayDate, todayDate);
  }

  private async getNeoFeedByRange(startDate: string, endDate: string) {
    const validation = validateDateRange(startDate, endDate, 7);
    if (!validation.isValid) {
      throw new ValidationError(validation.error!, 'date_range');
    }

    return nasaService.getNeoFeed(startDate, endDate);
  }

  private async getCurrentWeekNeos() {
    const { startDate, endDate } = getCurrentWeekRange();
    return nasaService.getNeoFeed(startDate, endDate);
  }
}

export const neoService = new NeoService();
