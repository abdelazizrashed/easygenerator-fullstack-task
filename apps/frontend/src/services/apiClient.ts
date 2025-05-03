import { AuthTokenKeys } from '@/features/auth/types';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AuthTokenKeys.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.request.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      console.error('Unauthenticated access - Redirecting to login.');
      localStorage.removeItem(AuthTokenKeys.ACCESS_TOKEN);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default apiClient;
