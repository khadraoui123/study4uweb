import { type StateCreator } from 'zustand';
import { authApi } from '../../api/auth';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  major: string;
  year: string;
  avatar: string;
  rank: string;
  credits: number;
  totalCredits: number;
  gpa: number;
  xp: number;
  level: number;
  streak: number;
  totalFocusTime: number;
}

export interface AuthSlice {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, major?: string, year?: string, avatar?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (update: Partial<UserProfile>) => Promise<void>;
  loadProfile: () => Promise<void>;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  accessToken: null,
  refreshToken: null,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const data = await authApi.login(email, password);
      set({
        user: data.user,
        isAuthenticated: true,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isLoading: false,
      });
    } catch (err: any) {
      set({ isLoading: false });
      const msg = err.response?.data?.error || 'Login failed';
      throw new Error(msg);
    }
  },

  register: async (name, email, password, major, year, avatar) => {
    set({ isLoading: true });
    try {
      const data = await authApi.register(name, email, password, major, year, avatar);
      set({
        user: data.user as any,
        isAuthenticated: true,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isLoading: false,
      });
    } catch (err: any) {
      set({ isLoading: false });
      const msg = err.response?.data?.error || 'Registration failed';
      throw new Error(msg);
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, accessToken: null, refreshToken: null });
  },

  updateProfile: async (update) => {
    try {
      const user = await authApi.updateProfile(update);
      set({ user });
    } catch {}
  },

  loadProfile: async () => {
    try {
      const user = await authApi.getProfile();
      set({ user, isAuthenticated: true });
    } catch {
      set({ isAuthenticated: false, user: null });
    }
  },
});
