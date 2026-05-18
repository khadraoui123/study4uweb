import { type StateCreator } from 'zustand';
import { analyticsApi } from '../../api/analytics';

export interface StudySession {
  id: string;
  duration: number;
  timestamp: string;
  subject: string;
  efficiency: number;
}

export interface AnalyticsSlice {
  sessions: StudySession[];
  dailyGoals: { completed: number; total: number };
  weeklyProgress: number[];
  totalFocusMinutes: number;
  totalXPEarned: number;
  isLoading: boolean;
  loadStats: () => Promise<void>;
  addSession: (session: Partial<StudySession>) => void;
  updateGoal: (completed: number) => Promise<void>;
  incrementDailyGoal: () => Promise<void>;
}

export const createAnalyticsSlice: StateCreator<AnalyticsSlice> = (set) => ({
  sessions: [],
  dailyGoals: { completed: 0, total: 5 },
  weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
  totalFocusMinutes: 0,
  totalXPEarned: 0,
  isLoading: false,

  loadStats: async () => {
    try {
      const stats = await analyticsApi.getStats();
      set({
        sessions: stats.sessions || [],
        dailyGoals: stats.dailyGoals || { completed: 0, total: 5 },
        weeklyProgress: stats.weeklyProgress || [0, 0, 0, 0, 0, 0, 0],
        totalFocusMinutes: stats.totalFocusMinutes || 0,
        totalXPEarned: stats.totalXPEarned || 0,
      });
    } catch {}
  },

  addSession: (session) => set((state) => ({
    sessions: [...state.sessions, session as StudySession],
  })),

  updateGoal: async (completed) => {
    try {
      const goal = await analyticsApi.updateGoals({ completed });
      set({ dailyGoals: { completed: goal.completed, total: goal.total } });
    } catch {}
  },

  incrementDailyGoal: async () => {
    try {
      const goal = await analyticsApi.updateGoals({ completed: 0 });
      set((state) => ({
        dailyGoals: { ...state.dailyGoals, completed: state.dailyGoals.completed + 1 },
      }));
    } catch {
      set((state) => ({
        dailyGoals: { ...state.dailyGoals, completed: state.dailyGoals.completed + 1 },
      }));
    }
  },
});
