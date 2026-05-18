import { type StateCreator } from 'zustand';
import { socialApi } from '../../api/social';

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'studying';
  xp?: number;
  level?: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  level: number;
  avatar: string;
  id?: string;
  streak?: number;
}

export interface Notification {
  id: string;
  type: 'achievement' | 'info' | 'warning';
  title: string;
  message: string;
  time: string;
  createdAt?: string;
  read?: boolean;
  iconType?: 'zap' | 'info' | 'alert';
  color?: string;
}

export interface SocialSlice {
  friends: Friend[];
  notifications: Notification[];
  leaderboard: LeaderboardEntry[];
  isLoading: boolean;
  loadFriends: () => Promise<void>;
  loadLeaderboard: () => Promise<void>;
  loadNotifications: () => Promise<void>;
  addFriend: (friendId: string) => Promise<void>;
  removeFriend: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  clearNotification: (id: string) => Promise<void>;
}

export const createSocialSlice: StateCreator<SocialSlice> = (set) => ({
  friends: [],
  notifications: [],
  leaderboard: [],
  isLoading: false,

  loadFriends: async () => {
    try {
      const friends = await socialApi.getFriends();
      set({ friends });
    } catch {}
  },

  loadLeaderboard: async () => {
    try {
      const leaderboard = await socialApi.getLeaderboard();
      set({ leaderboard });
    } catch {}
  },

  loadNotifications: async () => {
    try {
      const notifications = await socialApi.getNotifications();
      set({ notifications });
    } catch {}
  },

  addFriend: async (friendId) => {
    try {
      await socialApi.addFriend(friendId);
    } catch {}
  },

  removeFriend: async (id) => {
    try {
      await socialApi.removeFriend(id);
      set((state) => ({ friends: state.friends.filter(f => f.id !== id) }));
    } catch {}
  },

  markAllRead: async () => {
    try {
      await socialApi.markAllNotificationsRead();
      set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
      }));
    } catch {}
  },

  clearNotification: async (id) => {
    try {
      await socialApi.clearNotification(id);
      set((state) => ({ notifications: state.notifications.filter(n => n.id !== id) }));
    } catch {}
  },
});
