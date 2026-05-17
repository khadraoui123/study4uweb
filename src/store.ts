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

      checkStreak: () => {
        // Simple placeholder for now, already have streak in state
      }
    }),
    { name: 'studymate-neural-storage' }
  )
);
