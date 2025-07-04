import NodeCache from 'node-cache';
import { config } from '../config';

export const cache = new NodeCache({ stdTTL: config.cache.defaultTtl });

export class CacheService {
  private cache: NodeCache;

  constructor(cache: NodeCache) {
    this.cache = cache;
  }

  get<T>(key: string): T | undefined {
    const data = this.cache.get<T>(key);
    if (data) {
      console.log(`Cache hit for key: ${key}`);
    }
    return data;
  }

  set<T>(key: string, data: T, ttl?: number): boolean {
    const result = ttl ? this.cache.set(key, data, ttl) : this.cache.set(key, data);
    console.log(`Cache set for key: ${key}${ttl ? ` with TTL: ${ttl}s` : ''}`);
    return result;
  }

  del(key: string): number {
    const result = this.cache.del(key);
    console.log(`Cache deleted for key: ${key}`);
    return result;
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  getStats() {
    return this.cache.getStats();
  }

  flushAll(): void {
    this.cache.flushAll();
    console.log('Cache cleared');
  }

  async getOrSet<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    ttl?: number
  ): Promise<{ data: T; cached: boolean }> {
    const cachedData = this.get<T>(key);
    if (cachedData) {
      return { data: cachedData, cached: true };
    }

    console.log(`Cache miss for key: ${key}, fetching from source`);
    const data = await fetchFunction();

    this.set(key, data, ttl);

    return { data, cached: false };
  }
}

export const cacheService = new CacheService(cache);
