import { type StateCreator } from 'zustand';
import { plannerApi } from '../../api/planner';

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: 'lecture' | 'exam' | 'study' | 'deadline' | 'break' | 'focus' | 'revision' | 'ai_block';
  courseId?: string;
  cognitiveIntensity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'PEAK';
  xpReward?: number;
  isAiGenerated?: boolean;
  status?: 'pending' | 'active' | 'completed' | 'missed' | 'delayed';
  linkedTaskId?: string;
  aiRecommendation?: string;
}

export interface PlannerSlice {
  events: CalendarEvent[];
  driftScore: number;
  driftMessage: string;
  alignmentHistory: { date: string; score: number }[];
  isAiAnalyzing: boolean;
  loadEvents: () => Promise<void>;
  addEvent: (event: Partial<CalendarEvent>) => Promise<void>;
  removeEvent: (id: string) => Promise<void>;
  updateEvent: (id: string, update: Partial<CalendarEvent>) => Promise<void>;
  updateFocusSession: (id: string, update: Partial<CalendarEvent>) => Promise<void>;
  resolveEvent: (id: string, outcome: 'completed' | 'missed' | 'delayed' | 'active') => Promise<void>;
  autoFillSchedule: () => Promise<void>;
  recalculateDrift: () => Promise<void>;
  adjustScheduleForTaskCompletion: (taskId: string) => Promise<void>;
}

export const createPlannerSlice: StateCreator<any> = (set) => ({
  events: [],
  driftScore: 0,
  driftMessage: 'Analyzing temporal alignment...',
  alignmentHistory: [
    { date: 'Mon', score: 0 }, { date: 'Tue', score: 0 }, { date: 'Wed', score: 0 },
    { date: 'Thu', score: 0 }, { date: 'Fri', score: 0 }, { date: 'Sat', score: 0 },
  ],
  isAiAnalyzing: false,

  loadEvents: async () => {
    try {
      const events = await plannerApi.getEvents();
      set({ events });
    } catch {}
  },

  addEvent: async (event) => {
    try {
      const created = await plannerApi.createEvent(event);
      set((state) => ({ events: [...state.events, created] }));
    } catch {}
  },

  removeEvent: async (id) => {
    try {
      await plannerApi.deleteEvent(id);
      set((state) => ({ events: state.events.filter(e => e.id !== id) }));
    } catch {}
  },

  updateEvent: async (id, update) => {
    try {
      const updated = await plannerApi.updateEvent(id, update);
      set((state) => ({
        events: state.events.map(e => e.id === id ? { ...e, ...updated } : e),
      }));
    } catch {}
  },

  resolveEvent: async (id, outcome) => {
    try {
      const updated = await plannerApi.updateEvent(id, { status: outcome });
      set((state) => ({
        events: state.events.map(e => e.id === id ? { ...e, ...updated } : e),
      }));
    } catch {}
  },

  autoFillSchedule: async () => {
    set({ isAiAnalyzing: true });
    try {
      const result = await plannerApi.autoFill();
      set({ events: result, isAiAnalyzing: false });
    } catch {
      set({ isAiAnalyzing: false });
    }
  },

  recalculateDrift: async () => {
    try {
      const drift = await plannerApi.getDrift();
      set({
        driftScore: drift.driftScore,
        driftMessage: drift.driftMessage,
      });
    } catch {}
  },

  adjustScheduleForTaskCompletion: async (taskId) => {
    set((state) => ({
      events: state.events.map(e => e.linkedTaskId === taskId ? { ...e, status: 'completed' } : e),
    }));
  },
});
