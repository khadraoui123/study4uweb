import { api } from './client';

export const focusApi = {
  getSession: () => api.get('/focus').then(r => r.data.data),
  startSession: () => api.post('/focus/start').then(r => r.data.data),
  updateSession: (id: string, data: any) => api.patch(`/focus/${id}`, data).then(r => r.data.data),
  completeSession: (id: string) => api.post(`/focus/${id}/complete`).then(r => r.data.data),
};
