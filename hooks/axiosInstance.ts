import { BASE_URL } from "@/constants";
import { useAuthStore } from "@/store/authStore";
import axios, { AxiosError } from "axios";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // crucial: allows browser to send/receive cookies automatically
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Channel": 1,
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        return axiosInstance(originalRequest);
      } catch (error) {
        //if Refresh token failed, logout and redirect
        useAuthStore.getState().logout();
        window.location.href = "/auth/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
