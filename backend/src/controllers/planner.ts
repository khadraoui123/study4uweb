import { Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';
import { param } from '../utils/param.js';

export async function getEvents(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { start, end } = req.query;
    const where: any = { userId: req.user!.userId };
    if (start && end) {
      where.start = { gte: new Date(start as string) };
      where.end = { lte: new Date(end as string) };
    }
    const events = await prisma.calendarEvent.findMany({ where, orderBy: { start: 'asc' } });
    res.json({ success: true, data: events });
  } catch (err) { next(err); }
}

export async function createEvent(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const event = await prisma.calendarEvent.create({
      data: {
        title: req.body.title, start: new Date(req.body.start), end: new Date(req.body.end),
        type: req.body.type || 'study', cognitiveIntensity: req.body.cognitiveIntensity || 'MEDIUM',
        xpReward: req.body.xpReward || 0, isAiGenerated: req.body.isAiGenerated || false,
        status: req.body.status || 'pending', aiRecommendation: req.body.aiRecommendation,
        linkedTaskId: req.body.linkedTaskId, courseId: req.body.courseId, userId: req.user!.userId,
      },
    });
    res.status(201).json({ success: true, data: event });
  } catch (err) { next(err); }
}

export async function updateEvent(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = param(req, 'id');
    const existing = await prisma.calendarEvent.findFirst({ where: { id, userId: req.user!.userId } });
    if (!existing) throw new AppError('Event not found', 404);
    const allowed = ['title', 'start', 'end', 'type', 'cognitiveIntensity', 'xpReward', 'status', 'aiRecommendation', 'linkedTaskId', 'courseId', 'isAiGenerated'];
    const updates: any = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = (key === 'start' || key === 'end') ? new Date(req.body[key]) : req.body[key];
    }
    const event = await prisma.calendarEvent.update({ where: { id }, data: updates });
    res.json({ success: true, data: event });
  } catch (err) { next(err); }
}

export async function deleteEvent(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = param(req, 'id');
    const existing = await prisma.calendarEvent.findFirst({ where: { id, userId: req.user!.userId } });
    if (!existing) throw new AppError('Event not found', 404);
    await prisma.calendarEvent.delete({ where: { id } });
    res.json({ success: true, message: 'Event deleted' });
  } catch (err) { next(err); }
}

export async function getDrift(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const events = await prisma.calendarEvent.findMany({ where: { userId: req.user!.userId } });
    const completed = events.filter(e => e.status === 'completed').length;
    const missed = events.filter(e => e.status === 'missed').length;
    const total = completed + missed || 1;
    const ratio = completed / total;
    const driftScore = Math.round((ratio - 0.7) * 50);
    res.json({ success: true, data: { driftScore, driftMessage: getDriftMessage(driftScore) } });
  } catch (err) { next(err); }
}

export async function autoFillSchedule(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const tasks = await prisma.task.findMany({ where: { userId: req.user!.userId, completed: false } });
    const courses = await prisma.course.findMany({ where: { userId: req.user!.userId } });
    const existingIds = (await prisma.calendarEvent.findMany({ where: { userId: req.user!.userId, isAiGenerated: true }, select: { linkedTaskId: true } })).map(e => e.linkedTaskId).filter(Boolean);
    const pendingTasks = tasks.filter(t => !existingIds.includes(t.id));
    const today = new Date();
    today.setHours(17, 0, 0, 0);
    const newEvents: any[] = [];
    pendingTasks.forEach((task, idx) => {
      const course = courses.find(c => c.id === task.courseId);
      const startHour = 17 + idx * 2;
      const start = new Date(today); start.setHours(startHour);
      const end = new Date(today); end.setHours(startHour + 1);
      newEvents.push({ title: `AI Focus: ${task.title}`, start, end, type: task.urgency === 'URGENT' ? 'focus' : 'study', cognitiveIntensity: task.urgency === 'URGENT' ? 'PEAK' : 'HIGH', xpReward: task.xpValue || 150, isAiGenerated: true, status: 'pending', linkedTaskId: task.id, courseId: task.courseId, aiRecommendation: `Auto-scheduled for ${course?.name || 'General Study'}. AI optimized for weak subject retention.`, userId: req.user!.userId });
      const breakStart = new Date(today); breakStart.setHours(startHour + 1);
      const breakEnd = new Date(today); breakEnd.setHours(startHour + 2);
      newEvents.push({ title: 'AI Cognitive Rest & Consolidation', start: breakStart, end: breakEnd, type: 'break', cognitiveIntensity: 'LOW', xpReward: 25, isAiGenerated: true, status: 'pending', aiRecommendation: 'Mandatory neural recovery window to prevent cognitive fatigue.', userId: req.user!.userId });
    });
    if (newEvents.length > 0) await prisma.calendarEvent.createMany({ data: newEvents });
    const allEvents = await prisma.calendarEvent.findMany({ where: { userId: req.user!.userId }, orderBy: { start: 'asc' } });
    res.json({ success: true, data: allEvents, message: `${newEvents.length} events scheduled` });
  } catch (err) { next(err); }
}

function getDriftMessage(score: number): string {
  if (score >= 10) return `Excellent temporal alignment (+${score}%). You are operating ahead of predicted exam trajectories.`;
  if (score >= 0) return `Stable execution (${score}%). Academic systems are synchronized with baseline syllabus requirements.`;
  return `You are drifting ${Math.abs(score)}% behind your exam preparation timeline. AI recommends injecting revision blocks.`;
}
