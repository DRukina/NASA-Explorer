import axios, { AxiosInstance } from 'axios';
import NodeCache from 'node-cache';

export const cache = new NodeCache({ stdTTL: 300 });

export const nasaApi: AxiosInstance = axios.create({
  baseURL: 'https://api.nasa.gov',
  timeout: 10000,
  params: {
    api_key: process.env.NASA_API_KEY || 'DEMO_KEY',
  },
});

nasaApi.interceptors.request.use(
  config => {
    console.log(`Making NASA API request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    console.error('NASA API request error:', error);
    return Promise.reject(error);
  }
);

nasaApi.interceptors.response.use(
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
    return Promise.reject(error);
  }
);

export async function getCachedData<T>(
  cacheKey: string,
  fetchFunction: () => Promise<T>,
  ttl?: number
): Promise<T> {
  const cachedData = cache.get<T>(cacheKey);
  if (cachedData) {
    console.log(`Cache hit for key: ${cacheKey}`);
    return cachedData;
  }

  console.log(`Cache miss for key: ${cacheKey}, fetching from API`);
  const data = await fetchFunction();

  if (ttl) {
    cache.set(cacheKey, data, ttl);
  } else {
    cache.set(cacheKey, data);
  }
  return data;
}
