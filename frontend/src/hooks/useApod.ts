import { useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../utils/api';
import { useApiQuery, createQueryKey } from './useApiQuery';
import { QUERY_KEYS, CACHE_TIMES } from '../constants/api';
import type { ApodData } from '../types/api';

export const useApod = (date?: string) => {
  return useApiQuery(
    createQueryKey(QUERY_KEYS.APOD, date || 'today'),
    () => apiClient.getApod(date),
    {
      staleTime: CACHE_TIMES.APOD,
    }
  );
};

export const useRandomApod = (count: number = 1) => {
  return useApiQuery(
    createQueryKey(QUERY_KEYS.APOD, 'random', count),
    () => apiClient.getRandomApod(count),
    {
      staleTime: CACHE_TIMES.APOD_RANDOM,
      enabled: count > 0 && count <= 10,
      select: (data) => {
        if (count === 1) {
          return Array.isArray(data) ? data[0] : data;
        }
        return Array.isArray(data) ? data : [data];
      },
    }
  );
};

export const useApodRange = (
  startDate: string,
  endDate: string,
  enabled: boolean = true
) => {
  return useApiQuery(
    createQueryKey(QUERY_KEYS.APOD, 'range', startDate, endDate),
    () => apiClient.getApodRange(startDate, endDate),
    {
      staleTime: CACHE_TIMES.APOD_RANGE,
      enabled: enabled && !!startDate && !!endDate,
    }
  );
};

export const usePrefetchApod = () => {
  const queryClient = useQueryClient();

  const prefetchApod = async (date?: string) => {
    await queryClient.prefetchQuery({
      queryKey: createQueryKey(QUERY_KEYS.APOD, date || 'today'),
      queryFn: async () => {
        const response = await apiClient.getApod(date);
        if (!response.success) {
          throw new Error(response.error?.message || 'Failed to fetch APOD');
        }
        return response.data as ApodData;
      },
      staleTime: CACHE_TIMES.APOD,
    });
  };

  const prefetchRandomApod = async (count: number = 1) => {
    await queryClient.prefetchQuery({
      queryKey: createQueryKey(QUERY_KEYS.APOD, 'random', count),
      queryFn: async () => {
        const response = await apiClient.getRandomApod(count);
        if (!response.success) {
          throw new Error(
            response.error?.message || 'Failed to fetch random APOD'
          );
        }
        return response.data;
      },
      staleTime: CACHE_TIMES.APOD_RANDOM,
    });
  };

  return { prefetchApod, prefetchRandomApod };
};

export const useInvalidateApod = () => {
  const queryClient = useQueryClient();

  const invalidateApod = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.APOD] });
  };

  const invalidateSpecificApod = (date?: string) => {
    queryClient.invalidateQueries({
      queryKey: createQueryKey(QUERY_KEYS.APOD, date || 'today'),
    });
  };

  return { invalidateApod, invalidateSpecificApod };
};
