import { type StateCreator } from 'zustand';
import { focusApi } from '../../api/focus';

export interface FocusSlice {
  pomodoroTime: number;
  isTimerRunning: boolean;
  activeFocusSession: boolean;
  ambientSound: 'none' | 'rain' | 'lofi' | 'waves' | 'forest';
  volume: number;
  sessionId: string | null;
  isLoading: boolean;
  loadSession: () => Promise<void>;
  setTimerState: (running: boolean) => void;
  tickTimer: () => void;
  resetTimer: () => void;
  startFocusSession: () => Promise<void>;
  setAmbientSound: (sound: 'none' | 'rain' | 'lofi' | 'waves' | 'forest') => void;
  setVolume: (volume: number) => void;
  completeSession: () => Promise<void>;
}

export const createFocusSlice: StateCreator<any> = (set, get) => ({
  pomodoroTime: 25 * 60,
  isTimerRunning: false,
  activeFocusSession: false,
  ambientSound: 'none' as const,
  volume: 50,
  sessionId: null,
  isLoading: false,

  loadSession: async () => {
    try {
      const session = await focusApi.getSession();
      if (session) {
        set({
          sessionId: session.id,
          pomodoroTime: session.duration || 25 * 60,
          isTimerRunning: session.isRunning || false,
          activeFocusSession: session.isActive || false,
          ambientSound: session.ambientSound || 'none',
          volume: session.volume || 50,
        });
      }
    } catch {}
  },

  setTimerState: (running) => set({ isTimerRunning: running }),
  tickTimer: () => set((state) => ({ pomodoroTime: state.pomodoroTime > 0 ? state.pomodoroTime - 1 : 0 })),

  resetTimer: () => set({
    pomodoroTime: 25 * 60,
    isTimerRunning: false,
    activeFocusSession: false,
  }),

  startFocusSession: async () => {
    try {
      const session = await focusApi.startSession();
      set({
        sessionId: session.id,
        activeFocusSession: true,
        isTimerRunning: true,
        pomodoroTime: session.duration || 25 * 60,
      });
    } catch {}
  },

  setAmbientSound: (sound) => {
    set({ ambientSound: sound });
    const sid = get().sessionId;
    if (sid) focusApi.updateSession(sid, { ambientSound: sound }).catch(() => {});
  },

  setVolume: (volume) => {
    set({ volume });
    const sid = get().sessionId;
    if (sid) focusApi.updateSession(sid, { volume }).catch(() => {});
  },

  completeSession: async () => {
    const sid = get().sessionId;
    if (sid) {
      try {
        const result = await focusApi.completeSession(sid);
        get().addXP(result.xpEarned || 0);
        const mins = Math.floor(get().pomodoroTime / 60);
        get().addFocusTime(mins || 25);
        get().pushToast({
          type: 'focus', title: 'Focus Session Complete',
          body: `+${result.xpEarned || 50} XP earned. Neural pathways strengthened.`,
          xpAmount: result.xpEarned || 50,
        });
      } catch {}
    }
    set({ activeFocusSession: false, isTimerRunning: false, pomodoroTime: 25 * 60, sessionId: null });
  },
});
