import { type StateCreator } from 'zustand';

export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO string e.g., '2026-05-17T09:00:00'
  end: string; // ISO string e.g., '2026-05-17T11:00:00'
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
  driftScore: number; // percentage e.g. -12 (12% behind) or +5 (5% ahead)
  driftMessage: string;
  alignmentHistory: { date: string; score: number }[];
  isAiAnalyzing: boolean;
  
  addEvent: (event: CalendarEvent) => void;
  removeEvent: (id: string) => void;
  updateEvent: (id: string, update: Partial<CalendarEvent>) => void;
  updateEventTime: (id: string, start: string, end: string) => void;
  updateFocusSession: (id: string, update: Partial<CalendarEvent>) => void;
  resolveEvent: (id: string, outcome: 'completed' | 'missed' | 'delayed' | 'active') => void;
  autoFillSchedule: (tasks: any[], courses: any[]) => void;
  recalculateDrift: () => void;
  adjustScheduleForTaskCompletion: (taskId: string) => void;
}

const INITIAL_EVENTS: CalendarEvent[] = [
  { 
    id: 'ev1', 
    title: 'Circuit Design Lecture', 
    start: '2026-05-17T08:30:00', 
    end: '2026-05-17T10:30:00', 
    type: 'lecture', 
    courseId: '1',
    cognitiveIntensity: 'MEDIUM',
    xpReward: 100,
    status: 'completed'
  },
  { 
    id: 'ev2', 
    title: 'Physics Mechanics Lab', 
    start: '2026-05-17T11:00:00', 
    end: '2026-05-17T13:00:00', 
    type: 'lecture', 
    courseId: '2',
    cognitiveIntensity: 'HIGH',
    xpReward: 150,
    status: 'active',
    aiRecommendation: 'Review vector calculus before entering lab node.'
  },
  { 
    id: 'ev3', 
    title: 'Deep Focus: Discrete Math Problems', 
    start: '2026-05-17T14:00:00', 
    end: '2026-05-17T16:00:00', 
    type: 'focus',
    courseId: '1',
    cognitiveIntensity: 'PEAK',
    xpReward: 250,
    status: 'pending',
    linkedTaskId: '3',
    aiRecommendation: 'AI Optimal Window. High cognitive retention predicted.'
  },
  { 
    id: 'ev4', 
    title: 'AI Recovery Period', 
    start: '2026-05-17T16:00:00', 
    end: '2026-05-17T16:30:00', 
    type: 'break',
    cognitiveIntensity: 'LOW',
    xpReward: 20,
    isAiGenerated: true,
    status: 'pending',
    aiRecommendation: 'Burnout mitigation buffer following peak focus block.'
  },
  { 
    id: 'ev5', 
    title: 'Physics Midterm Simulation', 
    start: '2026-05-18T10:00:00', 
    end: '2026-05-18T12:00:00', 
    type: 'exam',
    courseId: '2',
    cognitiveIntensity: 'PEAK',
    xpReward: 300,
    status: 'pending'
  }
];

export const createPlannerSlice: StateCreator<PlannerSlice> = (set, get) => ({
  events: INITIAL_EVENTS,
  driftScore: -4, // Starting slightly behind
  driftMessage: 'You are drifting 4% behind your exam preparation timeline. Focus consistency is required.',
  alignmentHistory: [
    { date: 'Mon', score: -10 },
    { date: 'Tue', score: -8 },
    { date: 'Wed', score: -2 },
    { date: 'Thu', score: 5 },
    { date: 'Fri', score: 2 },
    { date: 'Sat', score: -4 },
  ],
  isAiAnalyzing: false,

  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  
  removeEvent: (id) => set((state) => ({ events: state.events.filter(e => e.id !== id) })),
  
  updateEvent: (id, update) => {
    set((state) => ({
      events: state.events.map(e => e.id === id ? { ...e, ...update } : e)
    }));
    if (update.status) get().recalculateDrift();
  },

  updateEventTime: (id, start, end) => set((state) => ({
    events: state.events.map(e => e.id === id ? { ...e, start, end } : e)
  })),

  updateFocusSession: (id, update) => {
    set((state) => ({
      events: state.events.map(e => {
        if (e.id === id) {
          return { ...e, ...update };
        }
        // Exclusivity: Only one event should be active at a time
        if (update.status === 'active' && e.status === 'active') {
          return { ...e, status: 'pending' };
        }
        return e;
      })
    }));
    get().recalculateDrift();
  },

  resolveEvent: (id, outcome) => {
    set((state) => {
      const updatedEvents = state.events.map(e => {
        if (e.id === id) {
          return { ...e, status: outcome };
        }
        return e;
      });
      return { events: updatedEvents };
    });
    get().recalculateDrift();
  },

  recalculateDrift: () => {
    set((state) => {
      const completed = state.events.filter(e => e.status === 'completed').length;
      const missed = state.events.filter(e => e.status === 'missed').length;
      const total = completed + missed || 1;
      const ratio = completed / total;
      const driftScore = Math.round((ratio - 0.7) * 50); // benchmark 70%
      
      let driftMessage = '';
      if (driftScore >= 10) {
        driftMessage = `Excellent temporal alignment (+${driftScore}%). You are operating ahead of predicted exam trajectories.`;
      } else if (driftScore >= 0) {
        driftMessage = `Stable execution (${driftScore}%). Academic systems are synchronized with baseline syllabus requirements.`;
      } else {
        driftMessage = `You are drifting ${Math.abs(driftScore)}% behind your exam preparation timeline. AI recommends injecting revision blocks.`;
      }

      const alignmentHistory = [...state.alignmentHistory];
      if (alignmentHistory.length > 0) {
        alignmentHistory[alignmentHistory.length - 1] = { 
          date: alignmentHistory[alignmentHistory.length - 1].date, 
          score: driftScore 
        };
      }

      return { driftScore, driftMessage, alignmentHistory };
    });
  },

  autoFillSchedule: (tasks, courses) => {
    set({ isAiAnalyzing: true });
    
    setTimeout(() => {
      set((state) => {
        const newEvents: CalendarEvent[] = [];
        const todayStr = new Date().toISOString().split('T')[0];
        
        // Filter out tasks that are already linked or completed
        const pendingTasks = tasks.filter(t => !t.completed && !state.events.some(e => e.linkedTaskId === t.id));

        let currentHour = 17; // Start auto-fill from 5 PM today

        pendingTasks.forEach((task, idx) => {
          const course = courses.find((c: any) => c.id === task.courseId);
          const courseName = course ? course.name : 'General Study';
          const isUrgent = task.urgency === 'URGENT';
          
          // Study block
          const startHour = currentHour;
          const endHour = currentHour + (isUrgent ? 2 : 1);
          const startTime = `${todayStr}T${String(startHour).padStart(2, '0')}:00:00`;
          const endTime = `${todayStr}T${String(endHour).padStart(2, '0')}:00:00`;

          newEvents.push({
            id: `ai_auto_${task.id}_${idx}`,
            title: `AI Focus: ${task.title}`,
            start: startTime,
            end: endTime,
            type: isUrgent ? 'focus' : 'study',
            courseId: task.courseId,
            cognitiveIntensity: isUrgent ? 'PEAK' : 'HIGH',
            xpReward: task.xpValue || 150,
            isAiGenerated: true,
            status: 'pending',
            linkedTaskId: task.id,
            aiRecommendation: `Auto-scheduled for ${courseName}. AI optimized for weak subject retention.`
          });

          currentHour = endHour;

          // Add a smart break after focus
          if (isUrgent || idx % 2 === 1) {
            const breakEnd = currentHour + 1; // 1 hour break/buffer
            newEvents.push({
              id: `ai_break_${task.id}_${idx}`,
              title: 'AI Cognitive Rest & Consolidation',
              start: `${todayStr}T${String(currentHour).padStart(2, '0')}:00:00`,
              end: `${todayStr}T${String(breakEnd).padStart(2, '0')}:00:00`,
              type: 'break',
              cognitiveIntensity: 'LOW',
              xpReward: 25,
              isAiGenerated: true,
              status: 'pending',
              aiRecommendation: 'Mandatory neural recovery window to prevent cognitive fatigue.'
            });
            currentHour = breakEnd;
          }
        });

        // Add a revision block if none exists
        if (!newEvents.some(e => e.type === 'revision')) {
          newEvents.push({
            id: `ai_rev_night`,
            title: 'AI Spaced Repetition: Weak Subjects',
            start: `${todayStr}T21:00:00`,
            end: `${todayStr}T22:00:00`,
            type: 'revision',
            cognitiveIntensity: 'MEDIUM',
            xpReward: 120,
            isAiGenerated: true,
            status: 'pending',
            aiRecommendation: 'Targeting Discrete Structures and Quantum Physics based on recent error rates.'
          });
        }

        return {
          events: [...state.events, ...newEvents],
          isAiAnalyzing: false
        };
      });
      get().recalculateDrift();
    }, 1500);
  },

  adjustScheduleForTaskCompletion: (taskId) => {
    set((state) => ({
      events: state.events.map(e => e.linkedTaskId === taskId ? { ...e, status: 'completed' } : e)
    }));
    get().recalculateDrift();
  }
});
