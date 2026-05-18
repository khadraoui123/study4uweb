import { api } from './client';

export const analyticsApi = {
  getStats: () => api.get('/analytics/stats').then(r => r.data.data),
  getPerformance: () => api.get('/analytics/performance').then(r => r.data.data),
  addPerformanceSnapshot: (score: number) => api.post('/analytics/performance', { score }).then(r => r.data.data),
  getGoals: () => api.get('/analytics/goals').then(r => r.data.data),
  updateGoals: (data: any) => api.patch('/analytics/goals', data).then(r => r.data.data),
};
