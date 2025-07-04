import type {
  ApiResponse,
  ApodData,
  NeoData,
  NearEarthObject,
} from '../types/api';
import { API_ENDPOINTS } from '../constants/api';
import { createApiError } from './error';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = (await response.json()) as ApiResponse<T>;

      if (!response.ok) {
        const errorMessage =
          data.error?.message || `HTTP error! status: ${response.status}`;
        throw createApiError(
          errorMessage,
          response.status,
          data.error?.details
        );
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private buildQueryString(
    params: Record<string, string | number | undefined>
  ): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  async getApod(date?: string): Promise<ApiResponse<ApodData>> {
    const queryString = this.buildQueryString({ date });
    return this.request<ApodData>(`${API_ENDPOINTS.APOD}${queryString}`);
  }

  async getRandomApod(
    count: number = 1
  ): Promise<ApiResponse<ApodData | ApodData[]>> {
    const queryString = this.buildQueryString({ count });
    return this.request<ApodData | ApodData[]>(
      `${API_ENDPOINTS.APOD_RANDOM}${queryString}`
    );
  }

  async getApodRange(
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<ApodData[]>> {
    const queryString = this.buildQueryString({
      start_date: startDate,
      end_date: endDate,
    });
    return this.request<ApodData[]>(
      `${API_ENDPOINTS.APOD_RANGE}${queryString}`
    );
  }

  async getNeo(): Promise<ApiResponse<NeoData>> {
    return this.request<NeoData>(API_ENDPOINTS.NEO);
  }

  async getNeoFeed(
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<NeoData>> {
    const queryString = this.buildQueryString({
      start_date: startDate,
      end_date: endDate,
    });
    return this.request<NeoData>(`${API_ENDPOINTS.NEO_FEED}${queryString}`);
  }

  async getNeoToday(): Promise<ApiResponse<NeoData>> {
    return this.request<NeoData>(API_ENDPOINTS.NEO_TODAY);
  }

  async getNeoStats(): Promise<ApiResponse<Record<string, unknown>>> {
    return this.request<Record<string, unknown>>(API_ENDPOINTS.NEO_STATS);
  }

  async getNeoById(id: string): Promise<ApiResponse<NearEarthObject>> {
    return this.request<NearEarthObject>(`${API_ENDPOINTS.NEO_BY_ID}/${id}`);
  }

  async getHealth(): Promise<
    ApiResponse<{ status: string; timestamp: string }>
  > {
    return this.request<{ status: string; timestamp: string }>(
      API_ENDPOINTS.HEALTH
    );
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export { ApiClient };
