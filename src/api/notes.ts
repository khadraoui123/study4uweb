import { api } from './client';

export const notesApi = {
  getAll: (params?: { courseId?: string; search?: string }) =>
    api.get('/notes', { params }).then(r => r.data.data),
  get: (id: string) => api.get(`/notes/${id}`).then(r => r.data.data),
  create: (data: any) => api.post('/notes', data).then(r => r.data.data),
  update: (id: string, data: any) => api.patch(`/notes/${id}`, data).then(r => r.data.data),
  delete: (id: string) => api.delete(`/notes/${id}`).then(r => r.data.data),
};
