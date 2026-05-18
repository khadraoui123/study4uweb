import { type StateCreator } from 'zustand';

export type ProductivityState = 'PEAK' | 'NORMAL' | 'BURNOUT_RISK' | 'RECOVERING';
export type StudyMode = 'DEEP_WORK' | 'LIGHT_REVIEW' | 'EXAM_PREP' | 'BREAK';

export interface NeuralInsight {
  id: string;
  type: 'warning' | 'tip' | 'achievement' | 'urgent';
  title: string;
  body: string;
  actions: InsightAction[];
  dismissed?: boolean;
  createdAt: number;
}

export interface InsightAction {
  label: string;
  route?: string;
  storeAction?: string;
  icon: string;
}

export interface ToastNotification {
  id: string;
  type: 'xp' | 'streak' | 'insight' | 'focus' | 'success' | 'warning';
  title: string;
  body?: string;
  xpAmount?: number;
  duration?: number;
}

export interface DashboardSlice {
  focusScore: number;
  productivityState: ProductivityState;
  activeStudyMode: StudyMode;
  cognitiveWindows: number[];
  neuralInsights: NeuralInsight[];
  toastQueue: ToastNotification[];
  completedTasksToday: number;
  aiActivityStatus: 'idle' | 'analyzing' | 'generating' | 'active';
  setFocusScore: (score: number) => void;
  setProductivityState: (state: ProductivityState) => void;
  setStudyMode: (mode: StudyMode) => void;
  updateCognitiveWindow: (hour: number, value: number) => void;
  dismissInsight: (id: string) => void;
  addInsight: (insight: NeuralInsight) => void;
  pushToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
  incrementCompletedToday: () => void;
  setAIStatus: (status: DashboardSlice['aiActivityStatus']) => void;
}

export const createDashboardSlice: StateCreator<DashboardSlice> = (set) => ({
  focusScore: 74,
  productivityState: 'NORMAL',
  activeStudyMode: 'DEEP_WORK',
  cognitiveWindows: [5,3,2,1,2,5,15,35,60,75,85,90,70,55,45,50,65,88,92,95,88,75,55,30],
  neuralInsights: [
    { id: 'ins-1', type: 'warning', title: 'Discrete Structures retention dropping', body: 'Your performance in Discrete Structures has declined 12% this week. Consider reviewing foundational concepts.', actions: [{ label: 'Start Revision', route: '/tutor', icon: 'brain' }, { label: 'Generate Quiz', route: '/tutor', icon: 'zap' }], dismissed: false, createdAt: Date.now() },
    { id: 'ins-2', type: 'tip', title: 'Peak performance window: 7PM - 10PM', body: 'Your cognitive heatmap shows peak productivity between 7PM and 10PM. Schedule intensive study blocks during this window.', actions: [{ label: 'Open Planner', route: '/planner', icon: 'calendar' }, { label: 'Set Focus Block', route: '/focus', icon: 'target' }], dismissed: false, createdAt: Date.now() - 60000 },
    { id: 'ins-3', type: 'urgent', title: 'Circuit Design midterm in 8 days', body: 'Your Electrical Circuit Design midterm is approaching. AI recommends allocating 6 hours of focused preparation.', actions: [{ label: 'Schedule Study', route: '/planner', icon: 'calendar' }, { label: 'Start Now', route: '/focus', icon: 'zap' }, { label: 'AI Tutor Help', route: '/tutor', icon: 'brain' }], dismissed: false, createdAt: Date.now() - 30000 },
  ],
  toastQueue: [],
  completedTasksToday: 0,
  aiActivityStatus: 'active',

  setFocusScore: (score) => set({ focusScore: score }),
  setProductivityState: (state) => set({ productivityState: state }),
  setStudyMode: (mode) => set({ activeStudyMode: mode }),
  updateCognitiveWindow: (hour, value) => set((s) => { const w = [...s.cognitiveWindows]; w[hour] = value; return { cognitiveWindows: w }; }),
  dismissInsight: (id) => set((s) => ({ neuralInsights: s.neuralInsights.map(i => i.id === id ? { ...i, dismissed: true } : i) })),
  addInsight: (insight) => set((s) => ({ neuralInsights: [insight, ...s.neuralInsights] })),
  pushToast: (toast) => set((s) => ({ toastQueue: [...s.toastQueue, { ...toast, id: Math.random().toString(36).slice(2) }] })),
  removeToast: (id) => set((s) => ({ toastQueue: s.toastQueue.filter(t => t.id !== id) })),
  incrementCompletedToday: () => set((s) => ({ completedTasksToday: s.completedTasksToday + 1 })),
  setAIStatus: (status) => set({ aiActivityStatus: status }),
});
