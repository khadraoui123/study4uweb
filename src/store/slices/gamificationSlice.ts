import { type StateCreator } from 'zustand';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface GamificationSlice {
  xp: number;
  level: number;
  streak: number;
  achievements: Achievement[];
  totalFocusTime: number; // in minutes
  addXP: (amount: number) => void;
  incrementStreak: () => void;
  unlockAchievement: (id: string) => void;
  addFocusTime: (minutes: number) => void;
}

export const createGamificationSlice: StateCreator<GamificationSlice> = (set) => ({
  xp: 1250,
  level: 5,
  streak: 12,
  totalFocusTime: 1440,
  achievements: [
    { id: '1', title: 'Neural Pioneer', description: 'Complete your first focus session', icon: 'zap', unlockedAt: Date.now() },
    { id: '2', title: 'Deep Diver', description: 'Focus for 2 hours straight', icon: 'brain' },
    { id: '3', title: 'Exam Crusher', description: 'Score 100% on a mock exam', icon: 'award' }
  ],
  addXP: (amount) => set((state) => {
    const newXP = state.xp + amount;
    const nextLevelXP = state.level * 1000;
    if (newXP >= nextLevelXP) {
      return { xp: newXP - nextLevelXP, level: state.level + 1 };
    }
    return { xp: newXP };
  }),
  incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
  unlockAchievement: (id) => set((state) => ({
    achievements: state.achievements.map(a => a.id === id ? { ...a, unlockedAt: Date.now() } : a)
  })),
  addFocusTime: (minutes) => set((state) => ({ totalFocusTime: state.totalFocusTime + minutes }))
});

