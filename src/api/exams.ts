import { api } from './client';

export const examsApi = {
  getAll: () => api.get('/exams').then(r => r.data.data),
  create: (data: any) => api.post('/exams', data).then(r => r.data.data),
  update: (id: string, data: any) => api.patch(`/exams/${id}`, data).then(r => r.data.data),
  delete: (id: string) => api.delete(`/exams/${id}`).then(r => r.data.data),
  recordScore: (id: string, score: number) => api.post(`/exams/${id}/score`, { score }).then(r => r.data.data),
  getFlashcards: (courseId?: string) => api.get('/exams/flashcards', { params: { courseId } }).then(r => r.data.data),
  createFlashcard: (data: any) => api.post('/exams/flashcards', data).then(r => r.data.data),
  updateFlashcard: (id: string, data: any) => api.patch(`/exams/flashcards/${id}`, data).then(r => r.data.data),
};
