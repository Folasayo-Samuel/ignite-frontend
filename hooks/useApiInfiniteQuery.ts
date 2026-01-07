import { useInfiniteQuery, QueryKey, UseInfiniteQueryOptions } from "@tanstack/react-query";
import { api } from "./apiFunction";
import { BASE_URL } from "@/constants";
import { ApiError, ApiOptions } from "@/components/api/type";

export const useApiInfiniteQuery = <T>(
  key: QueryKey,
  options: Omit<ApiOptions, "url"> & { url: string },
  // @ts-ignore
  queryConfig?: Omit<UseInfiniteQueryOptions<T, ApiError, any, T, QueryKey>, 'queryKey' | 'queryFn' | 'getNextPageParam' | 'initialPageParam'>
) => {
  return useInfiniteQuery<T, ApiError>({
    queryKey: key,
    initialPageParam: undefined,
    queryFn: ({ pageParam }) =>
      api<T>({
        ...options,
        method: options.method || "GET",
        url: `${BASE_URL || ""}${options.url}`,
        params: {
          ...options.params,
          cursor: pageParam || undefined
        }
      }),
    getNextPageParam: (lastPage: any) => {
      // Handle { items: [], nextCursor: ... } format
      if (lastPage && lastPage.nextCursor) {
        return lastPage.nextCursor;
      }
      
      // Handle raw array format
      if (Array.isArray(lastPage)) {
          if (lastPage.length === 0) return undefined;
          const lastItem = lastPage[lastPage.length - 1];
          return lastItem?._id || lastItem?.id; 
      }
      
      return undefined;
    },
    ...queryConfig,
  } as any);
};
