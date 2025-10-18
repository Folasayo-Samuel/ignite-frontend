/* eslint-disable react-hooks/rules-of-hooks */
import { ApiOptions } from "@/components/api/type";
import axiosInstance from "./axiosInstance";
import { globalErrorHandler } from "./errorHandling";

export const api = async <T>({
  url,
  method,
  ...config
}: ApiOptions): Promise<T> => {
  try {
    const response = await axiosInstance({ url, method, ...config });

    return response?.data;
  } catch (error) {
    console.log(error, "error_queryy");
    throw globalErrorHandler(error);
  }
};
