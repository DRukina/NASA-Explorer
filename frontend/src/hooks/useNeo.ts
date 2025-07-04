import { useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { apiClient } from '../utils/api';
import { useApiQuery, createQueryKey } from './useApiQuery';
import { QUERY_KEYS, CACHE_TIMES } from '../constants/api';
import {
  transformNeoToChartData,
  filterAsteroids,
  calculateNeoStats,
} from '../utils/neo';
import type { NeoData, FilterOptions } from '../types/api';

export const useNeo = () => {
  return useApiQuery(
    createQueryKey(QUERY_KEYS.NEO, 'current-week'),
    () => apiClient.getNeo(),
    {
      staleTime: CACHE_TIMES.NEO,
    }
  );
};

export const useNeoFeed = (
  startDate: string,
  endDate: string,
  enabled: boolean = true
) => {
  return useApiQuery(
    createQueryKey(QUERY_KEYS.NEO, 'feed', startDate, endDate),
    () => apiClient.getNeoFeed(startDate, endDate),
    {
      staleTime: CACHE_TIMES.NEO,
      enabled: enabled && !!startDate && !!endDate,
    }
  );
};

export const useNeoToday = () => {
  return useApiQuery(
    createQueryKey(QUERY_KEYS.NEO, 'today'),
    () => apiClient.getNeoToday(),
    {
      staleTime: CACHE_TIMES.NEO_TODAY,
    }
  );
};

export const useNeoStats = () => {
  return useApiQuery(
    createQueryKey(QUERY_KEYS.NEO, 'stats'),
    () => apiClient.getNeoStats(),
    {
      staleTime: CACHE_TIMES.NEO_STATS,
    }
  );
};

export const useNeoById = (id: string, enabled: boolean = true) => {
  return useApiQuery(
    createQueryKey(QUERY_KEYS.NEO, 'detail', id),
    () => apiClient.getNeoById(id),
    {
      staleTime: CACHE_TIMES.NEO_TODAY,
      enabled: enabled && !!id,
    }
  );
};

export const useNeoChartData = (neoData?: NeoData) => {
  return useMemo(() => {
    if (!neoData) return [];
    return transformNeoToChartData(neoData);
  }, [neoData]);
};

export const useFilteredAsteroids = (
  neoData?: NeoData,
  filters?: FilterOptions
) => {
  return useMemo(() => {
    if (!neoData) return [];
    return filterAsteroids(neoData, filters);
  }, [neoData, filters]);
};

export const useNeoStatistics = (neoData?: NeoData) => {
  return useMemo(() => {
    if (!neoData) return null;
    return calculateNeoStats(neoData);
  }, [neoData]);
};

export const usePrefetchNeo = () => {
  const queryClient = useQueryClient();

  const prefetchNeoFeed = async (startDate: string, endDate: string) => {
    await queryClient.prefetchQuery({
      queryKey: createQueryKey(QUERY_KEYS.NEO, 'feed', startDate, endDate),
      queryFn: async () => {
        const response = await apiClient.getNeoFeed(startDate, endDate);
        if (!response.success) {
          throw new Error(
            response.error?.message || 'Failed to fetch NEO feed'
          );
        }
        return response.data as NeoData;
      },
      staleTime: CACHE_TIMES.NEO,
    });
  };

  const prefetchNeoToday = async () => {
    await queryClient.prefetchQuery({
      queryKey: createQueryKey(QUERY_KEYS.NEO, 'today'),
      queryFn: async () => {
        const response = await apiClient.getNeoToday();
        if (!response.success) {
          throw new Error(
            response.error?.message || "Failed to fetch today's NEO data"
          );
        }
        return response.data as NeoData;
      },
      staleTime: CACHE_TIMES.NEO_TODAY,
    });
  };

  return { prefetchNeoFeed, prefetchNeoToday };
};

export const useInvalidateNeo = () => {
  const queryClient = useQueryClient();

  const invalidateNeo = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NEO] });
  };

  const invalidateSpecificNeo = (
    type: string,
    ...params: (string | number)[]
  ) => {
    queryClient.invalidateQueries({
      queryKey: createQueryKey(QUERY_KEYS.NEO, type, ...params),
    });
  };

  return { invalidateNeo, invalidateSpecificNeo };
};
