import { type StateCreator } from 'zustand';

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
}

export interface AuthSlice {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
  updateProfile: (update: Partial<UserProfile>) => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  user: {
    id: 'u1',
    name: 'John Doe',
    email: 'john.doe@university.edu',
    major: 'B.S. Computer Engineering',
    year: 'Senior Scholar',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    rank: 'Scholar Grade 42',
    credits: 112,
    totalCredits: 128,
    gpa: 3.92,
  },
  isAuthenticated: true,
  login: (email) => set({ isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  updateProfile: (update) => set((state) => ({
    user: state.user ? { ...state.user, ...update } : null
  })),
});
