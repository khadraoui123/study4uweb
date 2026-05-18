import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_BASE = 'http://localhost:3001/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const stored = localStorage.getItem('study4u-neural-storage');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      const s = parsed?.state;
      const token = s?.accessToken || s?.auth?.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {}
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (error.config?.url?.includes('/auth/refresh')) {
        localStorage.removeItem('study4u-neural-storage');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      const stored = localStorage.getItem('study4u-neural-storage');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const s = parsed?.state;
          const refreshToken = s?.refreshToken || s?.auth?.refreshToken;
          if (refreshToken) {
            try {
              const res = await axios.post(`${API_BASE}/auth/refresh`, { refreshToken });
              const { accessToken, refreshToken: newRefresh } = res.data.data;
              const updated = JSON.parse(JSON.stringify(parsed));
              if (updated.state.auth) {
                updated.state.auth.accessToken = accessToken;
                updated.state.auth.refreshToken = newRefresh;
              } else {
                updated.state.accessToken = accessToken;
                updated.state.refreshToken = newRefresh;
              }
              localStorage.setItem('study4u-neural-storage', JSON.stringify(updated));
              if (error.config) {
                error.config.headers.Authorization = `Bearer ${accessToken}`;
                return axios(error.config);
              }
            } catch (refreshErr) {
              localStorage.removeItem('study4u-neural-storage');
              window.location.href = '/login';
              return Promise.reject(refreshErr);
            }
          } else {
            localStorage.removeItem('study4u-neural-storage');
            window.location.href = '/login';
          }
        } catch {
          localStorage.removeItem('study4u-neural-storage');
          window.location.href = '/login';
        }
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
