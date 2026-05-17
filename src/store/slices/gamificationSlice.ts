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

export const createGamificationSlice: StateCreator<any> = (set, get) => ({
  xp: 1250,
  level: 5,
  streak: 12,
  totalFocusTime: 1440,
  achievements: [
    { id: '1', title: 'Neural Pioneer', description: 'Complete your first focus session', icon: 'zap', unlockedAt: Date.now() },
    { id: '2', title: 'Deep Diver', description: 'Focus for 2 hours straight', icon: 'brain' },
    { id: '3', title: 'Exam Crusher', description: 'Score 100% on a mock exam', icon: 'award' }
  ],
  addXP: (amount) => set((state: any) => {
    const newXP = state.xp + amount;
    const nextLevelXP = state.level * 1000;
    if (newXP >= nextLevelXP) {
      const newLevel = state.level + 1;
      // Use setTimeout to ensure toast is pushed after state update if needed, 
      // but Zustand set is synchronous. However, get() inside set might be tricky.
      // Better to calculate new state and then use it.
      
      setTimeout(() => {
        get().pushToast({
          type: 'success',
          title: 'Neural Level Up!',
          body: `You have ascended to Level ${newLevel}. Cognitive capacity increased.`,
        });
      }, 100);

      return { xp: newXP - nextLevelXP, level: newLevel };
    }
    return { xp: newXP };
  }),
  incrementStreak: () => {
    set((state: any) => ({ streak: state.streak + 1 }));
    get().pushToast({
      type: 'streak',
      title: 'Streak Maintained',
      body: `Day ${get().streak}! Your neural consistency is impressive.`,
    });
  },
  unlockAchievement: (id) => {
    const achievement = get().achievements.find((a: any) => a.id === id);
    if (achievement && !achievement.unlockedAt) {
      set((state: any) => ({
        achievements: state.achievements.map((a: any) => a.id === id ? { ...a, unlockedAt: Date.now() } : a)
      }));
      get().pushToast({
        type: 'success',
        title: 'Prestige Unlocked',
        body: `Achievement Earned: ${achievement.title}`,
      });
      get().addXP(500); // Bonus XP for achievements
    }
  },
  addFocusTime: (minutes) => {
    set((state: any) => ({ totalFocusTime: state.totalFocusTime + minutes }));
    // Check for focus-based achievements
    if (get().totalFocusTime >= 2000 && !get().achievements.find((a: any) => a.id === '2')?.unlockedAt) {
       get().unlockAchievement('2');
    }
  }
});

