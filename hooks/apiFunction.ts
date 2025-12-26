/* eslint-disable react-hooks/rules-of-hooks */
import { ApiOptions } from "@/components/api/type";
import axiosInstance from "./axiosInstance";
import { globalErrorHandler } from "./errorHandling";

export const api = async <T>({
  url,
  method,
  ...config
}: ApiOptions): Promise<T> => {
  console.log('🔍 Raw API call:', { url, method, ...config });
  
  try {
    const response = await axiosInstance({ url, method, ...config });
    console.log('✅ API response:', response?.status, response?.data);

    return response?.data?.data;
  } catch (error) {
    console.log('❌ API error:', error);
    throw globalErrorHandler(error);
  }
};
