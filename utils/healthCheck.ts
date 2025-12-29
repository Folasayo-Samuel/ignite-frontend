import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ignite-backend-07fb.onrender.com/api";

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${BASE_URL}/auth/countries`, {
      timeout: 5000, // 5 second timeout
    });
    return response.status === 200;
  } catch (error) {
    console.warn('Backend health check failed:', error);
    return false;
  }
};

export const getBackendStatus = async () => {
  const isHealthy = await checkBackendHealth();
  return {
    isHealthy,
    message: isHealthy 
      ? 'Backend is running normally'
      : 'Backend is currently unavailable. Please try again later.',
    timestamp: new Date().toISOString()
  };
};
