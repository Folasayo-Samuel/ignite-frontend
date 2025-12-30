import { BASE_URL } from "@/constants";
import { useMutation } from "@tanstack/react-query";
import { api } from "./apiFunction";
import { ApiError, ApiOptions, HttpMethod } from "@/components/api/type";

export const useApiMutation = <T, TVariables>(
  options: Omit<ApiOptions, "method" | "url"> & {
    method?: HttpMethod;
    url: string | ((variables: TVariables) => string);
  }
) => {
  return useMutation<T, ApiError, TVariables>({
    mutationFn: (variables) => {
      console.log('🔍 API Request:', {
        method: options.method || "POST",
        url: `${BASE_URL || ""}${options.url}`,
        data: variables,
      });
      
      const finalUrl = typeof options.url === 'function' 
        ? options.url(variables) 
        : options.url;
                                              
      return api<T>({
        ...options,
        method: options.method || "POST",
        url: `${BASE_URL || ""}${finalUrl}`,
        data: variables,
      });
    },
  });
};
