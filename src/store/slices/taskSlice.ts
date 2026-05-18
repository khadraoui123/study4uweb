import { type StateCreator } from 'zustand';
import { tasksApi } from '../../api/tasks';

export interface Task {
  id: string;
  courseId: string;
  title: string;
  dueDate: string;
  priority: 1 | 2 | 3;
  urgency: 'URGENT' | 'NORMAL' | 'LOW';
  completed: boolean;
  progress: number;
  xpValue: number;
  aiSuggested?: boolean;
  course?: { id: string; code: string; name: string };
}

export interface TaskSlice {
  tasks: Task[];
  isLoading: boolean;
  loadTasks: () => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  updateTaskProgress: (id: string, progress: number) => Promise<void>;
  addTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  getAISuggestions: () => void;
}

export const createTaskSlice: StateCreator<any> = (set, get) => ({
  tasks: [],
  isLoading: false,

  loadTasks: async () => {
    try {
      const tasks = await tasksApi.getAll();
      set({ tasks });
    } catch {}
  },

  toggleTask: async (id) => {
    try {
      const result = await tasksApi.toggle(id);
      set((state: any) => ({
        tasks: state.tasks.map((t: any) => t.id === id ? { ...t, ...result } : t),
      }));
      const task = get().tasks.find((t: any) => t.id === id);
      if (task && !task.completed) {
        get().addXP(task.xpValue);
        get().incrementCompletedToday();
        get().pushToast({
          type: 'xp', title: 'Task Synchronized',
          body: `+${task.xpValue} XP earned for ${task.title}`, xpAmount: task.xpValue,
        });
      }
    } catch {}
  },

  updateTaskProgress: async (id, progress) => {
    try {
      const result = await tasksApi.updateProgress(id, progress);
      set((state: any) => ({
        tasks: state.tasks.map((t: any) => t.id === id ? { ...t, ...result } : t),
      }));
      const task = get().tasks.find((t: any) => t.id === id);
      if (task && progress >= 100 && !task.completed) {
        get().addXP(task.xpValue);
        get().pushToast({ type: 'xp', title: 'Task Complete', body: `+${task.xpValue} XP earned`, xpAmount: task.xpValue });
      }
    } catch {}
  },

  addTask: async (task) => {
    try {
      const created = await tasksApi.create(task);
      set((state: any) => ({ tasks: [...state.tasks, created] }));
    } catch {}
  },

  updateTask: async (id, data) => {
    try {
      const updated = await tasksApi.update(id, data);
      set((state: any) => ({
        tasks: state.tasks.map((t: any) => t.id === id ? { ...t, ...updated } : t),
      }));
    } catch {}
  },

  deleteTask: async (id) => {
    try {
      await tasksApi.delete(id);
      set((state: any) => ({ tasks: state.tasks.filter((t: any) => t.id !== id) }));
    } catch {}
  },

  getAISuggestions: () => {},
});
