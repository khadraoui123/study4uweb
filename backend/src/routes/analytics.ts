import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getStats, getPerformanceHistory, addPerformanceSnapshot, getDailyGoals, updateDailyGoal } from '../controllers/analytics.js';

export const analyticsRouter = Router();
analyticsRouter.use(authenticate);

analyticsRouter.get('/stats', getStats);
analyticsRouter.get('/performance', getPerformanceHistory);
analyticsRouter.post('/performance', addPerformanceSnapshot);
analyticsRouter.get('/goals', getDailyGoals);
analyticsRouter.patch('/goals', updateDailyGoal);
