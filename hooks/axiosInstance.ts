import { BASE_URL } from "@/constants";
import { useAuthStore } from "@/store/authStore";
import axios, { AxiosError } from "axios";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    'X-Channel': 1
  },
});

axiosInstance.interceptors.request.use((config) => {
  // Access the store state directly without hooks
  const accessToken = useAuthStore.getState().accessToken;
  
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Access the logout function directly from the store
      useAuthStore.getState().logout();
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;