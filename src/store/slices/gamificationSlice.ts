import { type StateCreator } from 'zustand';
import { gamificationApi } from '../../api/gamification';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked?: boolean;
  unlockedAt?: number;
  xpReward?: number;
}

export interface GamificationSlice {
  xp: number;
  level: number;
  streak: number;
  achievements: Achievement[];
  totalFocusTime: number;
  isLoading: boolean;
  loadProfile: () => Promise<void>;
  loadAchievements: () => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  incrementStreak: () => Promise<void>;
  unlockAchievement: (id: string) => Promise<void>;
  addFocusTime: (minutes: number) => void;
}

export const createGamificationSlice: StateCreator<any> = (set, get) => ({
  xp: 0,
  level: 1,
  streak: 0,
  achievements: [],
  totalFocusTime: 0,
  isLoading: false,

  loadProfile: async () => {
    try {
      const data = await gamificationApi.getProfile();
      set({
        xp: data.xp || 0,
        level: data.level || 1,
        streak: data.streak || 0,
        totalFocusTime: data.totalFocusTime || 0,
        achievements: data.achievements?.map((a: any) => ({
          ...a.achievement,
          unlocked: true,
          unlockedAt: a.unlockedAt,
        })) || [],
      });
    } catch {}
  },

  loadAchievements: async () => {
    try {
      const data = await gamificationApi.getAchievements();
      set({ achievements: data });
    } catch {}
  },

  addXP: async (amount) => {
    try {
      const result = await gamificationApi.addXP(amount);
      set({ xp: result.xp, level: result.level });
      if (result.leveledUp) {
        setTimeout(() => {
          get().pushToast({
            type: 'success', title: 'Neural Level Up!',
            body: `You have ascended to Level ${result.level}. Cognitive capacity increased.`,
          });
        }, 100);
      }
    } catch {}
  },

  incrementStreak: async () => {
    try {
      const result = await gamificationApi.incrementStreak();
      set({ streak: result.streak });
      get().pushToast({
        type: 'streak', title: 'Streak Maintained',
        body: `Day ${result.streak}! Your neural consistency is impressive.`,
      });
    } catch {}
  },

  unlockAchievement: async (id) => {
    try {
      const result = await gamificationApi.unlockAchievement(id);
      set((state: any) => ({
        achievements: state.achievements.map((a: any) =>
          a.id === id ? { ...a, unlocked: true, unlockedAt: Date.now() } : a
        ),
      }));
      get().pushToast({ type: 'success', title: 'Prestige Unlocked', body: `Achievement Earned!` });
      get().addXP(result.xpReward || 100);
    } catch {}
  },

  addFocusTime: (minutes) => {
    set((state: any) => ({ totalFocusTime: state.totalFocusTime + minutes }));
  },
});
