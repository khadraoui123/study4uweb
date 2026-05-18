import { api } from './client';

export const aiApi = {
  getMessages: () => api.get('/ai/messages').then(r => r.data.data),
  sendMessage: (content: string) => api.post('/ai/messages', { content }).then(r => r.data.data),
  clearChat: () => api.delete('/ai/messages').then(r => r.data.data),
  getMemory: () => api.get('/ai/memory').then(r => r.data.data),
  updateMemory: (data: any) => api.patch('/ai/memory', data).then(r => r.data.data),
  getSuggestions: () => api.get('/ai/suggestions').then(r => r.data.data),
};
