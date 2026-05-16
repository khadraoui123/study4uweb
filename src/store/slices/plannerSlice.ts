import { type StateCreator } from 'zustand';

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  type: 'lecture' | 'exam' | 'study' | 'deadline';
  courseId?: string;
}

export interface PlannerSlice {
  events: CalendarEvent[];
  addEvent: (event: CalendarEvent) => void;
  removeEvent: (id: string) => void;
  updateEvent: (id: string, update: Partial<CalendarEvent>) => void;
}

export const createPlannerSlice: StateCreator<PlannerSlice> = (set) => ({
  events: [
    { id: 'ev1', title: 'Circuit Design Lecture', start: '2026-05-16T11:30:00', end: '2026-05-16T13:30:00', type: 'lecture', courseId: '1' },
    { id: 'ev2', title: 'Physics Lab', start: '2026-05-17T09:00:00', end: '2026-05-17T11:00:00', type: 'lecture', courseId: '2' },
    { id: 'ev3', title: 'Midterm Prep', start: '2026-05-18T14:00:00', end: '2026-05-18T16:00:00', type: 'study' },
  ],
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  removeEvent: (id) => set((state) => ({ events: state.events.filter(e => e.id !== id) })),
  updateEvent: (id, update) => set((state) => ({
    events: state.events.map(e => e.id === id ? { ...e, ...update } : e)
  })),
});
