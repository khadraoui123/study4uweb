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

export const createTaskSlice: StateCreator<any> = (set, get) => ({
  tasks: [
    { id: '1', courseId: '1', title: 'Submit Circuit Design Lab Manual', urgency: 'URGENT', priority: 1, completed: false, progress: 45, dueDate: '2026-05-18', xpValue: 150 },
    { id: '2', courseId: '2', title: 'Read Chapter 4 Physics Workbook', urgency: 'NORMAL', priority: 2, completed: true, progress: 100, dueDate: '2026-05-15', xpValue: 50 },
    { id: '3', courseId: '1', title: 'Practice Discrete Math Problems', urgency: 'NORMAL', priority: 1, completed: false, progress: 10, dueDate: '2026-05-20', xpValue: 200, aiSuggested: true }
  ],
  toggleTask: (id) => {
    const task = get().tasks.find((t: any) => t.id === id);
    if (!task) return;

    const becomingCompleted = !task.completed;
    
    set((state: any) => ({
      tasks: state.tasks.map((t: any) => t.id === id ? { ...t, completed: becomingCompleted, progress: becomingCompleted ? 100 : t.progress } : t)
    }));

    if (becomingCompleted) {
      get().addXP(task.xpValue);
      get().incrementCompletedToday();
      get().incrementDailyGoal();
      get().pushToast({
        type: 'xp',
        title: 'Task Synchronized',
        body: `+${task.xpValue} XP earned for ${task.title}`,
        xpAmount: task.xpValue
      });
      
      // If it's a major task, maybe check for achievements
      if (task.xpValue >= 200) {
        get().incrementStreak();
      }
    }
  },
  updateTaskProgress: (id, progress) => {
    const task = get().tasks.find((t: any) => t.id === id);
    if (!task) return;

    const wasCompleted = task.completed;
    const isNowCompleted = progress === 100;

    set((state: any) => ({
      tasks: state.tasks.map((t: any) => t.id === id ? { ...t, progress, completed: isNowCompleted } : t)
    }));

    if (!wasCompleted && isNowCompleted) {
      get().addXP(task.xpValue);
      get().incrementCompletedToday();
      get().incrementDailyGoal();
      get().pushToast({
        type: 'xp',
        title: 'Task Complete',
        body: `+${task.xpValue} XP earned`,
        xpAmount: task.xpValue
      });
    }
  },
  addTask: (task) => set((state: any) => ({ tasks: [...state.tasks, task] })),
  deleteTask: (id) => set((state: any) => ({ tasks: state.tasks.filter((t: any) => t.id !== id) })),
  getAISuggestions: () => {
    // Logic to suggest tasks based on weak subjects
  }
});

