import { api } from './client';

export const socialApi = {
  getLeaderboard: () => api.get('/social/leaderboard').then(r => r.data.data),
  getFriends: () => api.get('/social/friends').then(r => r.data.data),
  addFriend: (friendId: string) => api.post('/social/friends', { friendId }).then(r => r.data.data),
  removeFriend: (id: string) => api.delete(`/social/friends/${id}`).then(r => r.data.data),
  getNotifications: () => api.get('/social/notifications').then(r => r.data.data),
  createNotification: (data: any) => api.post('/social/notifications', data).then(r => r.data.data),
  markAllNotificationsRead: () => api.post('/social/notifications/read-all').then(r => r.data.data),
  clearNotification: (id: string) => api.delete(`/social/notifications/${id}`).then(r => r.data.data),
  getRooms: () => api.get('/social/rooms').then(r => r.data.data),
  createRoom: (data: any) => api.post('/social/rooms', data).then(r => r.data.data),
  joinRoom: (id: string) => api.post(`/social/rooms/${id}/join`).then(r => r.data.data),
  getMessages: (roomId: string) => api.get(`/social/rooms/${roomId}/messages`).then(r => r.data.data),
  sendMessage: (roomId: string, content: string) => api.post(`/social/rooms/${roomId}/messages`, { content }).then(r => r.data.data),
};
