import { type StateCreator } from 'zustand';
import { coursesApi } from '../../api/courses';

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  schedule: string;
  difficulty: number;
  percentage: number;
  currentGrade: string;
  attendancePresent: number;
  attendanceAbsent: number;
  attendanceLate: number;
  room: string;
}

export interface Exam {
  id: string;
  courseId: string;
  title: string;
  date: string;
  weight: number;
  score?: number;
  course?: { id: string; code: string; name: string };
}

export interface PerformanceSnapshot {
  id: string;
  date: string;
  score: number;
}

export interface AcademicSlice {
  courses: Course[];
  exams: Exam[];
  performanceHistory: PerformanceSnapshot[];
  onboardingCompleted: boolean;
  isLoading: boolean;
  loadCourses: () => Promise<void>;
  loadExams: () => Promise<void>;
  loadPerformance: () => Promise<void>;
  addCourse: (course: Partial<Course>) => Promise<void>;
  updateCourse: (id: string, update: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  logAttendance: (courseId: string, type: 'present' | 'absent' | 'late') => Promise<void>;
  boostMastery: (courseId: string, amount: number) => Promise<void>;
  addPerformanceSnapshot: (score: number) => Promise<void>;
  completeOnboarding: () => void;
  simulateCognitiveDecay: () => void;
}

export const createAcademicSlice: StateCreator<any> = (set, get) => ({
  courses: [],
  exams: [],
  performanceHistory: [],
  onboardingCompleted: false,
  isLoading: false,

  loadCourses: async () => {
    try {
      const courses = await coursesApi.getAll();
      set({ courses });
    } catch {}
  },

  loadExams: async () => {
    try {
      const { examsApi } = await import('../../api/exams');
      const exams = await examsApi.getAll();
      set({ exams });
    } catch {}
  },

  loadPerformance: async () => {
    try {
      const { analyticsApi } = await import('../../api/analytics');
      const data = await analyticsApi.getPerformance();
      set({ performanceHistory: data });
    } catch {}
  },

  addCourse: async (course) => {
    try {
      const created = await coursesApi.create(course);
      set((state: any) => ({ courses: [...state.courses, created] }));
    } catch {}
  },

  updateCourse: async (id, update) => {
    try {
      const updated = await coursesApi.update(id, update);
      set((state: any) => ({
        courses: state.courses.map((c: any) => c.id === id ? { ...c, ...updated } : c),
      }));
    } catch {}
  },

  deleteCourse: async (id) => {
    try {
      await coursesApi.delete(id);
      set((state: any) => ({ courses: state.courses.filter((c: any) => c.id !== id) }));
    } catch {}
  },

  logAttendance: async (courseId, type) => {
    try {
      await coursesApi.logAttendance(courseId, type);
      set((state: any) => ({
        courses: state.courses.map((c: any) => {
          if (c.id === courseId) {
            const key = type === 'present' ? 'attendancePresent' : type === 'absent' ? 'attendanceAbsent' : 'attendanceLate';
            return { ...c, [key]: (c[key] || 0) + 1 };
          }
          return c;
        }),
      }));
    } catch {}
  },

  boostMastery: async (courseId, amount) => {
    try {
      const updated = await coursesApi.boostMastery(courseId, amount);
      set((state: any) => ({
        courses: state.courses.map((c: any) => c.id === courseId ? { ...c, ...updated } : c),
      }));
      get().pushToast({ type: 'xp', title: 'Mastery Boosted', body: `+${amount}% mastery on ${updated.name}` });
    } catch {}
  },

  addPerformanceSnapshot: async (score) => {
    try {
      const { analyticsApi } = await import('../../api/analytics');
      const snap = await analyticsApi.addPerformanceSnapshot(score);
      set((state: any) => ({
        performanceHistory: [...state.performanceHistory, snap],
      }));
    } catch {}
  },

  completeOnboarding: () => set({ onboardingCompleted: true }),

  simulateCognitiveDecay: () => set((state: any) => ({
    courses: state.courses.map((c: any) => ({
      ...c,
      percentage: Math.max(0, Math.round((c.percentage - (c.difficulty * 0.1)) * 10) / 10),
    })),
  })),
});
