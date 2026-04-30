/* eslint-disable react-hooks/rules-of-hooks */
import { ApiOptions } from "@/components/apis/type";
import axiosInstance from "./axiosInstance";
import { globalErrorHandler } from "./errorHandling";

export const api = async <T>({
  url,
  method,
  ...config
}: ApiOptions): Promise<T> => {
  console.log("🔍 Raw API call:", { url, method, ...config });

  try {
    const response = await axiosInstance({ url, method, ...config });
    console.log("✅ API response:", response?.status, response?.data);

    // Resilience: Some controllers wrap in {success, data}, others return raw object.
    // If we see { success: true, data: ... }, we unwrap the 'data' property.
    // Otherwise, we return the whole body.
    if (
      response?.data &&
      typeof response.data === "object" &&
      response.data.success === true &&
      "data" in response.data
    ) {
      return response.data.data;
    }

    return response?.data;
  } catch (error) {
    console.log("❌ API error:", error);
    throw globalErrorHandler(error);
  }
};
