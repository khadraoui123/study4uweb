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
  simulateCognitiveDecay: () => void;
  boostMastery: (courseId: string, amount: number) => void;
}

export const createAcademicSlice: StateCreator<any> = (set, get) => ({
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
  addCourse: (course) => set((state: any) => ({ courses: [...state.courses, course] })),
  updateCourse: (id, update) => set((state: any) => ({
    courses: state.courses.map((c: any) => c.id === id ? { ...c, ...update } : c)
  })),
  logAttendance: (courseId, type) => set((state: any) => ({
    courses: state.courses.map((c: any) => {
      if (c.id === courseId) {
        const updated = { ...c.attendance };
        (updated as any)[type] += 1;
        return { ...c, attendance: updated };
      }
      return c;
    })
  })),
  addExam: (exam) => {
    set((state: any) => ({ exams: [...state.exams, exam] }));
    
    // Auto-inject into planner
    const examEvent = {
      id: `exam_${exam.id}`,
      title: `EXAM: ${exam.title}`,
      start: `${exam.date}T09:00:00`,
      end: `${exam.date}T11:00:00`,
      type: 'exam',
      courseId: exam.courseId,
      cognitiveIntensity: 'PEAK',
      xpReward: 500,
      status: 'pending',
      aiRecommendation: 'High-threat temporal event. AI suggests clearing 2 days prior for deep review.'
    };
    
    get().addEvent(examEvent as any);
    get().pushToast({
      type: 'warning',
      title: 'Temporal Threat Detected',
      body: `Exam "${exam.title}" added to calendar. Timeline adjusted.`,
    });
  },
  addPerformanceSnapshot: (score) => set((state: any) => ({
    performanceHistory: [...state.performanceHistory, { date: new Date().toISOString().split('T')[0], score }]
  })),
  completeOnboarding: () => set({ onboardingCompleted: true }),

  simulateCognitiveDecay: () => set((state: any) => ({
    courses: state.courses.map((c: any) => ({
      ...c,
      percentage: Math.max(0, Math.round((c.percentage - (c.difficulty * 0.1)) * 10) / 10)
    }))
  })),

  boostMastery: (courseId, amount) => set((state: any) => ({
    courses: state.courses.map((c: any) => 
      c.id === courseId ? { ...c, percentage: Math.min(100, c.percentage + amount) } : c
    )
  }))
});

