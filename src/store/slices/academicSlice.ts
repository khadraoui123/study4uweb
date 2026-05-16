import { type StateCreator } from 'zustand';

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  schedule: string;
  difficulty: number;
  percentage: number;
  currentGrade: string;
  attendance: { present: number; absent: number; late: number };
  room: string;
}

export interface Exam {
  id: string;
  courseId: string;
  title: string;
  date: string;
  weight: number;
}

export interface PerformanceSnapshot {
  date: string;
  score: number;
}

export interface AcademicSlice {
  courses: Course[];
  exams: Exam[];
  performanceHistory: PerformanceSnapshot[];
  onboardingCompleted: boolean;
  addCourse: (course: Course) => void;
  updateCourse: (id: string, update: Partial<Course>) => void;
  logAttendance: (courseId: string, type: 'present' | 'absent' | 'late') => void;
  addExam: (exam: Exam) => void;
  addPerformanceSnapshot: (score: number) => void;
  completeOnboarding: () => void;
}

export const createAcademicSlice: StateCreator<AcademicSlice> = (set) => ({
  courses: [
    { 
      id: '1', code: 'EEE182.4', name: 'Electrical Circuit Design 1L', instructor: 'Dr. Sarah Chen',
      schedule: 'Tue 11:30 AM - 1:30 PM', difficulty: 8,
      attendance: { present: 8, absent: 1, late: 2 }, currentGrade: 'A-', percentage: 89,
      room: 'L402'
    },
    { 
      id: '2', code: 'PHY181.6', name: 'Physics Mechanics Lab', instructor: 'Prof. James Miller',
      schedule: 'Wed 09:00 AM - 11:00 AM', difficulty: 7,
      attendance: { present: 10, absent: 0, late: 1 }, currentGrade: 'A', percentage: 94,
      room: 'S201'
    }
  ],
  exams: [
    { id: 'e1', courseId: '1', title: 'Midterm Exam', date: '2026-05-25', weight: 30 },
    { id: 'e2', courseId: '2', title: 'Final Project', date: '2026-06-10', weight: 40 }
  ],
  performanceHistory: [
    { date: '2026-05-10', score: 75 },
    { date: '2026-05-11', score: 78 },
    { date: '2026-05-12', score: 82 },
    { date: '2026-05-13', score: 80 },
    { date: '2026-05-14', score: 85 },
    { date: '2026-05-15', score: 89 }
  ],
  onboardingCompleted: false,
  addCourse: (course) => set((state) => ({ courses: [...state.courses, course] })),
  updateCourse: (id, update) => set((state) => ({
    courses: state.courses.map(c => c.id === id ? { ...c, ...update } : c)
  })),
  logAttendance: (courseId, type) => set((state) => ({
    courses: state.courses.map((c) => {
      if (c.id === courseId) {
        const updated = { ...c.attendance };
        updated[type] += 1;
        return { ...c, attendance: updated };
      }
      return c;
    })
  })),
  addExam: (exam) => set((state) => ({ exams: [...state.exams, exam] })),
  addPerformanceSnapshot: (score) => set((state) => ({
    performanceHistory: [...state.performanceHistory, { date: new Date().toISOString().split('T')[0], score }]
  })),
  completeOnboarding: () => set({ onboardingCompleted: true })
});

