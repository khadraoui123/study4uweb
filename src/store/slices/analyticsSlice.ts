import { type StateCreator } from 'zustand';

export interface StudySession {
  id: string;
  duration: number; // in minutes
  timestamp: string;
  subject: string;
  efficiency: number; // 0-100
}

export interface AnalyticsSlice {
  sessions: StudySession[];
  dailyGoals: { completed: number; total: number };
  weeklyProgress: number[]; // 7 values
  addSession: (session: StudySession) => void;
  updateGoal: (completed: number) => void;
}

export const createAnalyticsSlice: StateCreator<AnalyticsSlice> = (set) => ({
  sessions: [
    { id: 's1', duration: 45, timestamp: '2026-05-15T10:00:00', subject: 'Electrical Circuit Design', efficiency: 85 },
    { id: 's2', duration: 60, timestamp: '2026-05-15T14:00:00', subject: 'Physics Mechanics', efficiency: 92 },
  ],
  dailyGoals: { completed: 3, total: 5 },
  weeklyProgress: [4, 5, 3, 6, 4, 5, 2],
  addSession: (session) => set((state) => ({ 
    sessions: [...state.sessions, session],
    weeklyProgress: state.weeklyProgress.map((v, i) => i === new Date().getDay() ? v + 1 : v)
  })),
  updateGoal: (completed) => set((state) => ({ 
    dailyGoals: { ...state.dailyGoals, completed } 
  })),
});
