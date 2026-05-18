import { Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../types/index.js';

export async function getStats(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const [sessions, tasks, goals, focusTime] = await Promise.all([
      prisma.studySession.findMany({ where: { userId }, orderBy: { timestamp: 'desc' }, take: 50 }),
      prisma.task.findMany({ where: { userId } }),
      prisma.dailyGoal.findFirst({ where: { userId, date: { gte: new Date(new Date().setHours(0,0,0,0)) } } }),
      prisma.focusSession.aggregate({ where: { userId, completed: true }, _sum: { earnedXP: true } }),
    ]);
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    const weeklyProgress = getWeeklyProgress(sessions);
    const totalFocusMinutes = await prisma.focusSession.aggregate({ where: { userId, completed: true }, _sum: { duration: true } });
    res.json({ success: true, data: { sessions, tasks: { completed: completedTasks, total: totalTasks }, dailyGoals: goals || { completed: 0, total: 5 }, weeklyProgress, totalFocusMinutes: Math.floor((totalFocusMinutes._sum.duration || 0) / 60), totalXPEarned: focusTime._sum.earnedXP || 0 } });
  } catch (err) { next(err); }
}

export async function getPerformanceHistory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const snaps = await prisma.performanceSnapshot.findMany({ where: { userId: req.user!.userId }, orderBy: { date: 'asc' }, take: 30 });
    res.json({ success: true, data: snaps });
  } catch (err) { next(err); }
}

export async function addPerformanceSnapshot(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const snap = await prisma.performanceSnapshot.create({ data: { score: req.body.score, userId: req.user!.userId } });
    res.status(201).json({ success: true, data: snap });
  } catch (err) { next(err); }
}

export async function getDailyGoals(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    let goal = await prisma.dailyGoal.findFirst({ where: { userId: req.user!.userId, date: { gte: today } } });
    if (!goal) goal = await prisma.dailyGoal.create({ data: { userId: req.user!.userId } });
    res.json({ success: true, data: goal });
  } catch (err) { next(err); }
}

export async function updateDailyGoal(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    let goal = await prisma.dailyGoal.findFirst({ where: { userId: req.user!.userId, date: { gte: today } } });
    if (!goal) {
      goal = await prisma.dailyGoal.create({ data: { userId: req.user!.userId, completed: req.body.completed || 0, total: req.body.total || 5 } });
    } else {
      goal = await prisma.dailyGoal.update({ where: { id: goal.id }, data: { completed: req.body.completed ?? goal.completed, total: req.body.total ?? goal.total } });
    }
    res.json({ success: true, data: goal });
  } catch (err) { next(err); }
}

function getWeeklyProgress(sessions: { timestamp: Date; duration: number }[]): number[] {
  const week = Array(7).fill(0);
  const now = new Date();
  sessions.forEach(s => {
    const diff = Math.floor((now.getTime() - s.timestamp.getTime()) / (1000 * 60 * 60 * 24));
    if (diff >= 0 && diff < 7) week[6 - diff] += s.duration;
  });
  return week;
}
