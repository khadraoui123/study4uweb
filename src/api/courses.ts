import { api } from './client';

export const coursesApi = {
  getAll: () => api.get('/courses').then(r => r.data.data),
  get: (id: string) => api.get(`/courses/${id}`).then(r => r.data.data),
  create: (data: any) => api.post('/courses', data).then(r => r.data.data),
  update: (id: string, data: any) => api.patch(`/courses/${id}`, data).then(r => r.data.data),
  delete: (id: string) => api.delete(`/courses/${id}`).then(r => r.data.data),
  boostMastery: (id: string, amount: number) => api.post(`/courses/${id}/boost`, { amount }).then(r => r.data.data),
  logAttendance: (id: string, type: string) => api.post(`/courses/${id}/attendance`, { type }).then(r => r.data.data),
};
