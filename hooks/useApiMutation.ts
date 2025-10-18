import { BASE_URL } from "@/constants";
import { useMutation } from "@tanstack/react-query";
import { api } from "./apiFunction";
import { ApiError, ApiOptions, HttpMethod } from "@/components/api/type";

export const useApiMutation = <T, TVariables>(
  options: Omit<ApiOptions, "method" | "url"> & {
    method?: HttpMethod;
    url: string;
  }
) => {
  return useMutation<T, ApiError, TVariables>({
    mutationFn: (variables) =>
      api<T>({
        ...options,
        method: options.method || "POST",
        url: `${BASE_URL || ""}${options.url}`,
        data: variables,
      }),
  });
};
