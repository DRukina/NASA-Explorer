import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { ApiResponse } from '../types/api';
import { handleApiError } from '../utils/error';

export function useApiQuery<TData, TError = Error>(
  queryKey: (string | number | boolean | undefined)[],
  queryFn: () => Promise<ApiResponse<TData>>,
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData, TError> {
  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const response = await queryFn();

        if (!response.success) {
          throw new Error(response.error?.message || 'API request failed');
        }

        return response.data as TData;
      } catch (error) {
        const errorMessage = handleApiError(error);
        throw new Error(errorMessage) as TError;
      }
    },
    ...options,
  });
}

export type ApiQueryFn<T> = () => Promise<ApiResponse<T>>;

export const createQueryKey = (
  baseKey: string,
  ...params: (string | number | boolean | undefined)[]
): (string | number | boolean | undefined)[] => {
  return [baseKey, ...params.filter((param) => param !== undefined)];
};
