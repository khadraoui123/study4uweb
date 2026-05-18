import { api } from './client';

export const gamificationApi = {
  getProfile: () => api.get('/gamification/profile').then(r => r.data.data),
  addXP: (amount: number) => api.post('/gamification/xp', { amount }).then(r => r.data.data),
  getAchievements: () => api.get('/gamification/achievements').then(r => r.data.data),
  unlockAchievement: (achievementId: string) => api.post('/gamification/achievements/unlock', { achievementId }).then(r => r.data.data),
  incrementStreak: () => api.post('/gamification/streak').then(r => r.data.data),
};
