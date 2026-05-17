import { type StateCreator } from 'zustand';

export type ProductivityState = 'PEAK' | 'NORMAL' | 'BURNOUT_RISK' | 'RECOVERING';
export type StudyMode = 'DEEP_WORK' | 'LIGHT_REVIEW' | 'EXAM_PREP' | 'BREAK';

export interface NeuralInsight {
  id: string;
  type: 'warning' | 'tip' | 'achievement' | 'urgent';
  title: string;
  body: string;
  actions: InsightAction[];
  dismissed: boolean;
  createdAt: number;
}

export interface InsightAction {
  label: string;
  route?: string;
  storeAction?: string; // name of store action to call
  icon: string;
}

export interface ToastNotification {
  id: string;
  type: 'xp' | 'streak' | 'insight' | 'focus' | 'success' | 'warning';
  title: string;
  body?: string;
  xpAmount?: number;
  duration?: number; // ms
}

export interface DashboardSlice {
  focusScore: number; // 0–100
  productivityState: ProductivityState;
  activeStudyMode: StudyMode;
  cognitiveWindows: number[]; // 24 values (hour 0–23), 0–100 productivity
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

const defaultCognitiveWindows = [
  5, 3, 2, 1, 2, 5,   // 0–5 AM (sleep/low)
  15, 35, 60, 75, 85, 90, // 6–11 AM (morning ramp-up)
  70, 55, 45, 50, 65, 88, // 12–17 PM (post-lunch dip → rise)
  92, 95, 88, 75, 55, 30  // 18–23 PM (peak evening → decay)
];

const defaultInsights: NeuralInsight[] = [
  {
    id: 'ins-1',
    type: 'warning',
    title: 'Discrete Structures retention dropping',
    body: 'Your recall rate for Set Theory has fallen 12% over the past 3 sessions. Immediate revision recommended.',
    actions: [
      { label: 'Start Revision', route: '/tutor', icon: 'brain' },
      { label: 'Generate Quiz', route: '/tutor', icon: 'zap' },
    ],
    dismissed: false,
    createdAt: Date.now()
  },
  {
    id: 'ins-2',
    type: 'tip',
    title: 'Peak performance window: 7PM – 10PM',
    body: 'Your focus sessions consistently score 20% higher in the evening. Schedule high-difficulty work then.',
    actions: [
      { label: 'Open Planner', route: '/planner', icon: 'calendar' },
      { label: 'Set Focus Block', route: '/focus', icon: 'target' },
    ],
    dismissed: false,
    createdAt: Date.now() - 60000
  },
  {
    id: 'ins-3',
    type: 'urgent',
    title: 'Circuit Design midterm in 8 days',
    body: 'EEE182.4 midterm requires immediate attention. You have 3 incomplete practice problems and no revision scheduled.',
    actions: [
      { label: 'Schedule Study', route: '/planner', icon: 'calendar' },
      { label: 'Start Now', route: '/focus', icon: 'zap' },
      { label: 'AI Tutor Help', route: '/tutor', icon: 'brain' },
    ],
    dismissed: false,
    createdAt: Date.now() - 30000
  },
];

export const createDashboardSlice: StateCreator<DashboardSlice> = (set) => ({
  focusScore: 74,
  productivityState: 'NORMAL',
  activeStudyMode: 'DEEP_WORK',
  cognitiveWindows: defaultCognitiveWindows,
  neuralInsights: defaultInsights,
  toastQueue: [],
  completedTasksToday: 2,
  aiActivityStatus: 'active',

  setFocusScore: (score) => set({ focusScore: score }),
  setProductivityState: (state) => set({ productivityState: state }),
  setStudyMode: (mode) => set({ activeStudyMode: mode }),
  updateCognitiveWindow: (hour, value) => set((s) => {
    const w = [...s.cognitiveWindows];
    w[hour] = value;
    return { cognitiveWindows: w };
  }),
  dismissInsight: (id) => set((s) => ({
    neuralInsights: s.neuralInsights.map(i => i.id === id ? { ...i, dismissed: true } : i)
  })),
  addInsight: (insight) => set((s) => ({
    neuralInsights: [insight, ...s.neuralInsights]
  })),
  pushToast: (toast) => set((s) => ({
    toastQueue: [...s.toastQueue, { ...toast, id: Math.random().toString(36).slice(2) }]
  })),
  removeToast: (id) => set((s) => ({
    toastQueue: s.toastQueue.filter(t => t.id !== id)
  })),
  incrementCompletedToday: () => set((s) => ({ completedTasksToday: s.completedTasksToday + 1 })),
  setAIStatus: (status) => set({ aiActivityStatus: status }),
});
