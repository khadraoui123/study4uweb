import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getProfile, addXP, getAchievements, unlockAchievement, incrementStreak } from '../controllers/gamification.js';

export const gamificationRouter = Router();
gamificationRouter.use(authenticate);

gamificationRouter.get('/profile', getProfile);
gamificationRouter.post('/xp', addXP);
gamificationRouter.get('/achievements', getAchievements);
gamificationRouter.post('/achievements/unlock', unlockAchievement);
gamificationRouter.post('/streak', incrementStreak);
