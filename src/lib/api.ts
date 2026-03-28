import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const localHosts = ['localhost', '127.0.0.1'];
const isLocalPreview = typeof window !== 'undefined' && localHosts.includes(window.location.hostname);

export const API_BASE = import.meta.env.VITE_API_URL || (isLocalPreview ? 'http://localhost:5000' : 'https://api.feelgoodapp.net');
export const isApiConfigured = Boolean(API_BASE);

const api = axios.create({
  baseURL: API_BASE || undefined,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && API_BASE) {
      originalRequest._retry = true;
      const { refreshToken, setTokens, logout } = useAuthStore.getState();
      if (!refreshToken) {
        logout();
        window.location.href = '/admin/login';
        return Promise.reject(error);
      }
      try {
        const res = await axios.post(`${API_BASE}/api/auth/refresh`, {}, {
          headers: { Authorization: `Bearer ${refreshToken}` },
          withCredentials: true,
        });
        const { accessToken: newAccess, refreshToken: newRefresh } = res.data;
        setTokens(newAccess, newRefresh);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch {
        logout();
        window.location.href = '/admin/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
