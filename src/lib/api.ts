import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

// Always use relative URLs (/api/*) so requests are handled by the local proxy.
// Local dev:  Vite proxy in vite.config.ts forwards /api/* → https://api.feelgoodapp.net
// Production: CloudFront behavior forwards /api/* → https://api.feelgoodapp.net
// Override: set VITE_API_URL if you need to point to a different backend
export const API_BASE = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  ''
).replace(/\/$/, '');

export const isApiConfigured = true;

const api = axios.create({
  baseURL: API_BASE || undefined,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000, // 15s — prevents the infinite "sending" spinner on network/CORS errors
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
    if (error.response?.status === 401 && !originalRequest._retry) {
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
          timeout: 15000,
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
