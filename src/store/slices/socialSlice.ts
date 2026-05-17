import { type StateCreator } from 'zustand';

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'studying';
  activity?: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  level: number;
  avatar: string;
}

export interface Notification {
  id: string;
  type: 'achievement' | 'info' | 'warning';
  title: string;
  message: string;
  time: string;
  iconType: 'zap' | 'info' | 'alert';
  color: string;
}

export interface SocialSlice {
  friends: Friend[];
  notifications: Notification[];
  leaderboard: LeaderboardEntry[];
  addFriend: (friend: Friend) => void;
  removeFriend: (id: string) => void;
  updateStatus: (status: 'online' | 'offline' | 'studying', activity?: string) => void;
  markAllRead: () => void;
  clearNotification: (id: string) => void;
}

export const createSocialSlice: StateCreator<SocialSlice> = (set) => ({
  friends: [
    { id: 'f1', name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', status: 'studying', activity: 'Advanced Circuits' },
    { id: 'f2', name: 'James Miller', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', status: 'online' },
    { id: 'f3', name: 'Elena Petrova', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', status: 'offline' },
  ],
  leaderboard: [
    { name: 'Alex Rivera', xp: 12450, level: 42, rank: 1, avatar: 'AR' },
    { name: 'Sarah Chen', xp: 11200, level: 38, rank: 2, avatar: 'SC' },
    { name: 'James Miller', xp: 9800, level: 35, rank: 3, avatar: 'JM' },
    { name: 'Elena Petrova', xp: 8500, level: 30, rank: 4, avatar: 'EP' },
    { name: 'Kevin Zhang', xp: 7200, level: 28, rank: 5, avatar: 'KZ' },
  ],
  notifications: [
    { id: '1', type: 'achievement', title: 'Achievement Unlocked!', message: 'You reached a 7-day study streak. Neural capacity +50 XP.', time: '2 mins ago', iconType: 'zap', color: 'text-yellow-500' },
    { id: '2', type: 'info', title: 'New Course Material', message: 'Dr. Sarah Chen uploaded "Circuit Design Final Review" to EEE182.4.', time: '1 hour ago', iconType: 'info', color: 'text-blue-500' },
    { id: '3', type: 'warning', title: 'Exam Deadline', message: 'Physics Mechanics Lab Midterm is in 48 hours. Start focused review now.', time: '5 hours ago', iconType: 'alert', color: 'text-orange-500' },
  ],
  addFriend: (friend) => set((state) => ({ friends: [...state.friends, friend] })),
  removeFriend: (id) => set((state) => ({ friends: state.friends.filter(f => f.id !== id) })),
  updateStatus: (_status: 'online' | 'offline' | 'studying', _activity?: string) => set((_state) => ({})),
  markAllRead: () => set({ notifications: [] }),
  clearNotification: (id) => set((state) => ({ notifications: state.notifications.filter(n => n.id !== id) })),
});
