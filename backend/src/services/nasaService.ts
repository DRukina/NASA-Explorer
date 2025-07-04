import axios, { AxiosInstance } from 'axios';
import { config } from '../config';
import { ExternalApiError } from '../utils/errors';

export class NasaService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.nasaApiBaseUrl,
      timeout: config.nasaApiTimeout,
      params: {
        api_key: config.nasaApiKey,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      config => {
        console.log(`Making NASA API request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      error => {
        console.error('NASA API request error:', error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      response => {
        console.log(`NASA API response: ${response.status} ${response.config.url}`);
        return response;
      },
      error => {
        console.error('NASA API response error:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          url: error.config?.url,
          message: error.message,
        });

        if (error.response) {
          const status = error.response.status;
          const message = error.response.data?.error?.message || error.message;

          if (status >= 400 && status < 500) {
            throw new ExternalApiError(`NASA API client error: ${message}`, status);
          } else if (status >= 500) {
            throw new ExternalApiError(`NASA API server error: ${message}`, status);
          }
        } else if (error.request) {
          throw new ExternalApiError('NASA API request timeout or network error', 503);
        }

        throw new ExternalApiError(`NASA API error: ${error.message}`, 502);
      }
    );
  }

  async getApod(date?: string) {
    const params: Record<string, string> = {};
    if (date) {
      params.date = date;
    }

    const response = await this.client.get('/planetary/apod', { params });
    return response.data;
  }

  async getRandomApod(count: number = 1) {
    const response = await this.client.get('/planetary/apod', {
      params: { count },
    });
    return response.data;
  }

  async getApodRange(startDate: string, endDate: string) {
    const response = await this.client.get('/planetary/apod', {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });
    return response.data;
  }

  async getNeoFeed(startDate: string, endDate: string) {
    const response = await this.client.get('/neo/rest/v1/feed', {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });
    return response.data;
  }

  async getNeoStats() {
    const response = await this.client.get('/neo/rest/v1/stats');
    return response.data;
  }

  async getNeoById(neoId: string) {
    const response = await this.client.get(`/neo/rest/v1/neo/${neoId}`);
    return response.data;
  }
}

export const nasaService = new NasaService();
