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
      // Assuming the backend returns the next cursor ID as the last message's ID or in a metadata field
      // Adapt this based on your actual backend response structure. 
      // Based on the controller, it seems to just return a list.
      if (!lastPage || !Array.isArray(lastPage) || lastPage.length === 0) return undefined;
      const lastItem = lastPage[lastPage.length - 1];
      return lastItem?._id || lastItem?.id; 
    },
    ...queryConfig,
  } as any);
};
