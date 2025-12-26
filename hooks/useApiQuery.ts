import { useQuery, useMutation, QueryKey, UseQueryOptions } from "@tanstack/react-query";
import { api } from "./apiFunction";
import { BASE_URL } from "@/constants";
import { ApiError, ApiOptions } from "@/components/api/type";

export const useApiQuery = <T>(
  key: QueryKey,
  options: Omit<ApiOptions, "url"> & { url: string },
  queryConfig?: Omit<UseQueryOptions<T, ApiError, T, QueryKey>, 'queryKey' | 'queryFn'>
) => {
  return useQuery<T, ApiError>({
    queryKey: key,
    queryFn: () =>
      api<T>({
        ...options,
        method: options.method || "GET",
        url: `${BASE_URL || ""}${options.url}`,
      }),
    ...queryConfig, // allow things like `enabled: false`, `staleTime`, etc.
  });
};

// ... existing code ...

export const useApiMutation = <TData, TVariables>(
  options: Omit<ApiOptions, "url"> & { url: string; invalidateTags?: QueryKey[] }
) => {
  return useMutation<TData, ApiError, TVariables>({
    mutationFn: (variables) =>
      api<TData>({
        ...options,
        method: options.method || "POST",
        url: `${BASE_URL || ""}${options.url}`,
        data: variables,
      }),
    onSuccess: () => {
      // In a real app with queryClient available, we would invalidate tags here
      // queryClient.invalidateQueries({ queryKey: options.invalidateTags })
    },
  });
};
