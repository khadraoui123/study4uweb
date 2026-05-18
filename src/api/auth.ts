import { api } from './client';

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then(r => r.data.data),

  register: (name: string, email: string, password: string, major?: string, year?: string, avatar?: string) =>
    api.post('/auth/register', { name, email, password, major, year, avatar }).then(r => r.data.data),

  refresh: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }).then(r => r.data.data),

  getProfile: () =>
    api.get('/auth/profile').then(r => r.data.data),

  updateProfile: (data: any) =>
    api.patch('/auth/profile', data).then(r => r.data.data),
};
