import { api } from './client';

export const tasksApi = {
  getAll: (params?: { completed?: boolean; courseId?: string }) =>
    api.get('/tasks', { params }).then(r => r.data.data),
  create: (data: any) => api.post('/tasks', data).then(r => r.data.data),
  update: (id: string, data: any) => api.patch(`/tasks/${id}`, data).then(r => r.data.data),
  delete: (id: string) => api.delete(`/tasks/${id}`).then(r => r.data.data),
  toggle: (id: string) => api.post(`/tasks/${id}/toggle`).then(r => r.data.data),
  updateProgress: (id: string, progress: number) => api.patch(`/tasks/${id}/progress`, { progress }).then(r => r.data.data),
};
