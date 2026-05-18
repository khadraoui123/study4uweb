import { Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';
import { param } from '../utils/param.js';

export async function getSession(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    let session = await prisma.focusSession.findFirst({ where: { userId: req.user!.userId, completed: false } });
    if (!session) session = await prisma.focusSession.create({ data: { userId: req.user!.userId } });
    res.json({ success: true, data: session });
  } catch (err) { next(err); }
}

export async function updateSession(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = param(req, 'id');
    const existing = await prisma.focusSession.findFirst({ where: { id, userId: req.user!.userId } });
    if (!existing) throw new AppError('Session not found', 404);
    const allowed = ['duration', 'isRunning', 'isActive', 'ambientSound', 'volume', 'completed', 'earnedXP'];
    const updates: any = {};
    for (const key of allowed) { if (req.body[key] !== undefined) updates[key] = req.body[key]; }
    const session = await prisma.focusSession.update({ where: { id }, data: updates });
    if (req.body.completed && req.body.earnedXP) {
      await prisma.user.update({ where: { id: req.user!.userId }, data: { xp: { increment: req.body.earnedXP }, totalFocusTime: { increment: Math.floor((existing.duration || 1500) / 60) } } });
    }
    res.json({ success: true, data: session });
  } catch (err) { next(err); }
}

export async function startNewSession(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await prisma.focusSession.updateMany({ where: { userId: req.user!.userId, completed: false }, data: { completed: true } });
    const session = await prisma.focusSession.create({ data: { userId: req.user!.userId, isRunning: true, isActive: true, duration: 1500 } });
    res.status(201).json({ success: true, data: session });
  } catch (err) { next(err); }
}

export async function completeSession(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = param(req, 'id');
    const session = await prisma.focusSession.findFirst({ where: { id, userId: req.user!.userId } });
    if (!session) throw new AppError('Session not found', 404);
    const xpEarned = Math.floor((session.duration || 1500) / 60) * 2;
    const updated = await prisma.focusSession.update({ where: { id }, data: { completed: true, isRunning: false, isActive: false, earnedXP: xpEarned } });
    await prisma.user.update({ where: { id: req.user!.userId }, data: { xp: { increment: xpEarned }, totalFocusTime: { increment: Math.floor((session.duration || 1500) / 60) } } });
    await prisma.studySession.create({ data: { duration: Math.floor((session.duration || 1500) / 60), subject: 'Focus Session', efficiency: 85, userId: req.user!.userId } });
    res.json({ success: true, data: updated, xpEarned });
  } catch (err) { next(err); }
}
