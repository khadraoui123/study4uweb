import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getLeaderboard, getFriends, addFriend, removeFriend, getNotifications, createNotification, markAllNotificationsRead, clearNotification, getStudyRooms, createStudyRoom, joinStudyRoom, sendMessage, getMessages } from '../controllers/social.js';

export const socialRouter = Router();
socialRouter.use(authenticate);

socialRouter.get('/leaderboard', getLeaderboard);
socialRouter.get('/friends', getFriends);
socialRouter.post('/friends', addFriend);
socialRouter.delete('/friends/:id', removeFriend);
socialRouter.get('/notifications', getNotifications);
socialRouter.post('/notifications', createNotification);
socialRouter.post('/notifications/read-all', markAllNotificationsRead);
socialRouter.delete('/notifications/:id', clearNotification);
socialRouter.get('/rooms', getStudyRooms);
socialRouter.post('/rooms', createStudyRoom);
socialRouter.post('/rooms/:id/join', joinStudyRoom);
socialRouter.get('/rooms/:roomId/messages', getMessages);
socialRouter.post('/rooms/:roomId/messages', sendMessage);
