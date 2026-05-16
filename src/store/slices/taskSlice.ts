import { type StateCreator } from 'zustand';

export interface Task {
  id: string;
  courseId: string;
  title: string;
  dueDate: string;
  priority: 1 | 2 | 3; // 1: High, 2: Medium, 3: Low
  urgency: 'URGENT' | 'NORMAL' | 'LOW';
  completed: boolean;
  progress: number; // 0 to 100
  xpValue: number;
  aiSuggested?: boolean;
}

export interface TaskSlice {
  tasks: Task[];
  toggleTask: (id: string) => void;
  updateTaskProgress: (id: string, progress: number) => void;
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  getAISuggestions: () => void;
}

export const createTaskSlice: StateCreator<TaskSlice> = (set) => ({
  tasks: [
    { id: '1', courseId: '1', title: 'Submit Circuit Design Lab Manual', urgency: 'URGENT', priority: 1, completed: false, progress: 45, dueDate: '2026-05-18', xpValue: 150 },
    { id: '2', courseId: '2', title: 'Read Chapter 4 Physics Workbook', urgency: 'NORMAL', priority: 2, completed: true, progress: 100, dueDate: '2026-05-15', xpValue: 50 },
    { id: '3', courseId: '1', title: 'Practice Discrete Math Problems', urgency: 'NORMAL', priority: 1, completed: false, progress: 10, dueDate: '2026-05-20', xpValue: 200, aiSuggested: true }
  ],
  toggleTask: (id) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed, progress: !t.completed ? 100 : t.progress } : t)
  })),
  updateTaskProgress: (id, progress) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, progress, completed: progress === 100 } : t)
  })),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter(t => t.id !== id) })),
  getAISuggestions: () => {
    // Logic to suggest tasks based on weak subjects
  }
});

