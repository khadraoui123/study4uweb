import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createAcademicSlice, type AcademicSlice } from './store/slices/academicSlice';
import { createAISlice, type AISlice } from './store/slices/aiSlice';
import { createGamificationSlice, type GamificationSlice } from './store/slices/gamificationSlice';
import { createTaskSlice, type TaskSlice } from './store/slices/taskSlice';
import { createAuthSlice, type AuthSlice } from './store/slices/authSlice';
import { createPlannerSlice, type PlannerSlice } from './store/slices/plannerSlice';
import { createAnalyticsSlice, type AnalyticsSlice } from './store/slices/analyticsSlice';
import { createFocusSlice, type FocusSlice } from './store/slices/focusSlice';
import { createSocialSlice, type SocialSlice } from './store/slices/socialSlice';
import { createDashboardSlice, type DashboardSlice } from './store/slices/dashboardSlice';
import { createNoteSlice, type NoteSlice } from './store/slices/noteSlice';

export type StoreState = AcademicSlice & 
  AISlice & 
  GamificationSlice & 
  TaskSlice & 
  AuthSlice & 
  PlannerSlice & 
  AnalyticsSlice & 
  FocusSlice & 
  SocialSlice & 
  DashboardSlice &
  NoteSlice & {
  checkStreak: () => void;
  initializeApp: () => Promise<void>;
};

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createAcademicSlice(...a),
      ...createAISlice(...a),
      ...createGamificationSlice(...a),
      ...createTaskSlice(...a),
      ...createAuthSlice(...a),
      ...createPlannerSlice(...a),
      ...createAnalyticsSlice(...a),
      ...createFocusSlice(...a),
      ...createSocialSlice(...a),
      ...createDashboardSlice(...a),
      ...createNoteSlice(...a),

      checkStreak: () => {},

      initializeApp: async () => {
        const api = a[2];
        const state = api.getState() as StoreState;
        if (!state.isAuthenticated) return;
        try {
          await Promise.all([
            state.loadCourses?.().catch(() => {}),
            state.loadTasks?.().catch(() => {}),
            state.loadNotes?.().catch(() => {}),
            state.loadEvents?.().catch(() => {}),
            state.loadStats?.().catch(() => {}),
            state.loadProfile?.().catch(() => {}),
            state.loadAchievements?.().catch(() => {}),
            state.loadMemory?.().catch(() => {}),
            state.loadFriends?.().catch(() => {}),
            state.loadLeaderboard?.().catch(() => {}),
            state.loadNotifications?.().catch(() => {}),
            state.loadSession?.().catch(() => {}),
            state.loadChatHistory?.().catch(() => {}),
            state.loadSuggestions?.().catch(() => {}),
          ]);
        } catch {}
      },
    }),
    { 
      name: 'study4u-neural-storage',
      partialize: (state) => {
        const s = state as any;
        return {
          accessToken: s.accessToken,
          refreshToken: s.refreshToken,
          user: s.user,
        };
      },
      merge: (persisted, current) => {
        const p = persisted as any;
        if (p?.accessToken) {
          return {
            ...current,
            isAuthenticated: false,
            accessToken: p.accessToken,
            refreshToken: p.refreshToken,
            user: p.user,
          };
        }
        return current;
      },
    }
  )
);
