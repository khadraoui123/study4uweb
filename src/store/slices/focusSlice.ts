import { type StateCreator } from 'zustand';

export interface FocusSlice {
  pomodoroTime: number;
  isTimerRunning: boolean;
  activeFocusSession: boolean;
  ambientSound: 'none' | 'rain' | 'lofi' | 'waves' | 'forest';
  volume: number;
  setTimerState: (running: boolean) => void;
  tickTimer: () => void;
  resetTimer: () => void;
  startFocusSession: () => void;
  setAmbientSound: (sound: 'none' | 'rain' | 'lofi' | 'waves' | 'forest') => void;
  setVolume: (volume: number) => void;
}

export const createFocusSlice: StateCreator<FocusSlice> = (set) => ({
  pomodoroTime: 25 * 60,
  isTimerRunning: false,
  activeFocusSession: false,
  ambientSound: 'none',
  volume: 50,
  setTimerState: (running) => set({ isTimerRunning: running }),
  tickTimer: () => set((state) => ({ 
    pomodoroTime: state.pomodoroTime > 0 ? state.pomodoroTime - 1 : 0 
  })),
  resetTimer: () => set({ pomodoroTime: 25 * 60, isTimerRunning: false, activeFocusSession: false }),
  startFocusSession: () => set({ activeFocusSession: true, isTimerRunning: true }),
  setAmbientSound: (sound) => set({ ambientSound: sound }),
  setVolume: (volume) => set({ volume }),
});
