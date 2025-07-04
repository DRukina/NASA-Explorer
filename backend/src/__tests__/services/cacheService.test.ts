import { cacheService } from '../../services/cacheService';

describe('CacheService', () => {
  beforeEach(() => {
    // Clear cache before each test
    cacheService.flushAll();
  });

  afterEach(() => {
    // Clean up after each test
    cacheService.flushAll();
  });

  describe('set and get', () => {
    it('should store and retrieve data', () => {
      const key = 'test-key';
      const value = { message: 'test data' };

      cacheService.set(key, value);
      const retrieved = cacheService.get(key);

      expect(retrieved).toEqual(value);
    });

    it('should return undefined for non-existent key', () => {
      const result = cacheService.get('non-existent-key');
      expect(result).toBeUndefined();
    });

    it('should store data with TTL', () => {
      const key = 'ttl-key';
      const value = { message: 'ttl data' };
      const ttl = 1; // 1 second

      cacheService.set(key, value, ttl);
      const retrieved = cacheService.get(key);

      expect(retrieved).toEqual(value);
    });

    it('should expire data after TTL', done => {
      const key = 'expire-key';
      const value = { message: 'expire data' };
      const ttl = 0.1; // 100ms

      cacheService.set(key, value, ttl);

      // Check that data exists immediately
      expect(cacheService.get(key)).toEqual(value);

      // Check that data expires after TTL
      setTimeout(() => {
        expect(cacheService.get(key)).toBeUndefined();
        done();
      }, 150);
    });
  });

  describe('has', () => {
    it('should return true for existing key', () => {
      const key = 'exists-key';
      const value = { message: 'exists' };

      cacheService.set(key, value);
      expect(cacheService.has(key)).toBe(true);
    });

    it('should return false for non-existent key', () => {
      expect(cacheService.has('non-existent')).toBe(false);
    });

    it('should return false for expired key', done => {
      const key = 'expire-has-key';
      const value = { message: 'expire has' };
      const ttl = 0.1; // 100ms

      cacheService.set(key, value, ttl);
      expect(cacheService.has(key)).toBe(true);

      setTimeout(() => {
        expect(cacheService.has(key)).toBe(false);
        done();
      }, 150);
    });
  });

  describe('del', () => {
    it('should delete existing key', () => {
      const key = 'delete-key';
      const value = { message: 'delete me' };

      cacheService.set(key, value);
      expect(cacheService.has(key)).toBe(true);

      const deleted = cacheService.del(key);
      expect(deleted).toBe(1);
      expect(cacheService.has(key)).toBe(false);
    });

    it('should return 0 for non-existent key', () => {
      const deleted = cacheService.del('non-existent');
      expect(deleted).toBe(0);
    });

    it('should delete multiple keys individually', () => {
      const keys = ['key1', 'key2', 'key3'];
      const value = { message: 'multi delete' };

      keys.forEach(key => cacheService.set(key, value));
      keys.forEach(key => expect(cacheService.has(key)).toBe(true));

      let totalDeleted = 0;
      keys.forEach(key => {
        totalDeleted += cacheService.del(key);
      });

      expect(totalDeleted).toBe(3);
      keys.forEach(key => expect(cacheService.has(key)).toBe(false));
    });
  });

  describe('flushAll', () => {
    it('should clear all cache entries', () => {
      const testKeys = ['flush1', 'flush2', 'flush3'];
      const value = { message: 'flush test' };

      testKeys.forEach(key => cacheService.set(key, value));
      testKeys.forEach(key => expect(cacheService.has(key)).toBe(true));

      cacheService.flushAll();
      testKeys.forEach(key => expect(cacheService.has(key)).toBe(false));
    });
  });

  describe('getStats', () => {
    it('should return cache statistics', () => {
      const stats = cacheService.getStats();

      expect(stats).toHaveProperty('keys');
      expect(stats).toHaveProperty('hits');
      expect(stats).toHaveProperty('misses');
      expect(stats).toHaveProperty('ksize');
      expect(stats).toHaveProperty('vsize');

      expect(typeof stats.keys).toBe('number');
      expect(typeof stats.hits).toBe('number');
      expect(typeof stats.misses).toBe('number');
      expect(typeof stats.ksize).toBe('number');
      expect(typeof stats.vsize).toBe('number');
    });

    it('should track hits and misses', () => {
      const key = 'stats-key';
      const value = { message: 'stats test' };

      // Initial stats
      const initialStats = cacheService.getStats();
      const initialHits = initialStats.hits;
      const initialMisses = initialStats.misses;

      // Set and get (should increase hits)
      cacheService.set(key, value);
      cacheService.get(key);

      // Get non-existent key (should increase misses)
      cacheService.get('non-existent');

      const finalStats = cacheService.getStats();
      expect(finalStats.hits).toBeGreaterThan(initialHits);
      expect(finalStats.misses).toBeGreaterThan(initialMisses);
    });
  });

  describe('getOrSet', () => {
    it('should fetch and cache data when not cached', async () => {
      const key = 'getOrSet-key';
      const value = { message: 'fetched data' };
      const fetchFunction = jest.fn().mockResolvedValue(value);

      const result = await cacheService.getOrSet(key, fetchFunction);

      expect(result.data).toEqual(value);
      expect(result.cached).toBe(false);
      expect(fetchFunction).toHaveBeenCalledTimes(1);
      expect(cacheService.has(key)).toBe(true);
    });

    it('should return cached data without calling fetch function', async () => {
      const key = 'cached-key';
      const cachedValue = { message: 'cached data' };
      const fetchValue = { message: 'fetched data' };
      const fetchFunction = jest.fn().mockResolvedValue(fetchValue);

      // Pre-populate cache
      cacheService.set(key, cachedValue);

      const result = await cacheService.getOrSet(key, fetchFunction);

      expect(result.data).toEqual(cachedValue);
      expect(result.cached).toBe(true);
      expect(fetchFunction).not.toHaveBeenCalled();
    });

    it('should cache data with TTL when specified', async () => {
      const key = 'ttl-getOrSet-key';
      const value = { message: 'ttl data' };
      const ttl = 1; // 1 second
      const fetchFunction = jest.fn().mockResolvedValue(value);

      const result = await cacheService.getOrSet(key, fetchFunction, ttl);

      expect(result.data).toEqual(value);
      expect(result.cached).toBe(false);
      expect(cacheService.has(key)).toBe(true);
    });

    it('should handle fetch function errors', async () => {
      const key = 'error-key';
      const error = new Error('Fetch failed');
      const fetchFunction = jest.fn().mockRejectedValue(error);

      await expect(cacheService.getOrSet(key, fetchFunction)).rejects.toThrow('Fetch failed');
      expect(fetchFunction).toHaveBeenCalledTimes(1);
      expect(cacheService.has(key)).toBe(false);
    });
  });

  describe('complex data types', () => {
    it('should handle objects', () => {
      const key = 'object-key';
      const value = {
        id: 1,
        name: 'Test Object',
        nested: {
          array: [1, 2, 3],
          boolean: true,
        },
      };

      cacheService.set(key, value);
      const retrieved = cacheService.get(key);

      expect(retrieved).toEqual(value);
      expect(retrieved).not.toBe(value); // Should be a copy, not the same reference
    });

    it('should handle arrays', () => {
      const key = 'array-key';
      const value = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
      ];

      cacheService.set(key, value);
      const retrieved = cacheService.get(key);

      expect(retrieved).toEqual(value);
      expect(Array.isArray(retrieved)).toBe(true);
    });

    it('should handle strings and numbers', () => {
      cacheService.set('string-key', 'test string');
      cacheService.set('number-key', 42);
      cacheService.set('boolean-key', true);

      expect(cacheService.get('string-key')).toBe('test string');
      expect(cacheService.get('number-key')).toBe(42);
      expect(cacheService.get('boolean-key')).toBe(true);
    });
  });
});
