import { api } from './client';

export const plannerApi = {
  getEvents: (params?: { start?: string; end?: string }) =>
    api.get('/planner', { params }).then(r => r.data.data),
  createEvent: (data: any) => api.post('/planner', data).then(r => r.data.data),
  updateEvent: (id: string, data: any) => api.patch(`/planner/${id}`, data).then(r => r.data.data),
  deleteEvent: (id: string) => api.delete(`/planner/${id}`).then(r => r.data.data),
  getDrift: () => api.get('/planner/drift').then(r => r.data.data),
  autoFill: () => api.post('/planner/auto-fill').then(r => r.data.data),
};
