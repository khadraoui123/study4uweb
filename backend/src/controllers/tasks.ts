import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';
import { param } from '../utils/param.js';

const createSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    dueDate: z.string().optional(),
    priority: z.number().int().min(1).max(3).optional(),
    urgency: z.enum(['URGENT', 'NORMAL', 'LOW']).optional(),
    xpValue: z.number().int().optional(),
    courseId: z.string().optional(),
    aiSuggested: z.boolean().optional(),
  }),
});

export async function getTasks(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { completed, courseId } = req.query;
    const where: any = { userId: req.user!.userId };
    if (completed !== undefined) where.completed = completed === 'true';
    if (courseId) where.courseId = courseId as string;
    const tasks = await prisma.task.findMany({
      where,
      include: { course: { select: { id: true, code: true, name: true } } },
      orderBy: [{ priority: 'asc' }, { dueDate: 'asc' }],
    });
    res.json({ success: true, data: tasks });
  } catch (err) { next(err); }
}

export async function createTask(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = createSchema.parse({ body: req.body }).body;
    const task = await prisma.task.create({
      data: { ...data, dueDate: data.dueDate ? new Date(data.dueDate) : undefined, userId: req.user!.userId },
    });
    res.status(201).json({ success: true, data: task });
  } catch (err) { next(err); }
}

export async function updateTask(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = param(req, 'id');
    const existing = await prisma.task.findFirst({ where: { id, userId: req.user!.userId } });
    if (!existing) throw new AppError('Task not found', 404);
    const allowed = ['title', 'dueDate', 'priority', 'urgency', 'completed', 'progress', 'xpValue', 'courseId', 'aiSuggested'];
    const updates: any = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = key === 'dueDate' ? new Date(req.body[key]) : req.body[key];
    }
    const task = await prisma.task.update({ where: { id }, data: updates, include: { course: { select: { id: true, code: true, name: true } } } });
    res.json({ success: true, data: task });
  } catch (err) { next(err); }
}

export async function deleteTask(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = param(req, 'id');
    const existing = await prisma.task.findFirst({ where: { id, userId: req.user!.userId } });
    if (!existing) throw new AppError('Task not found', 404);
    await prisma.task.delete({ where: { id } });
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) { next(err); }
}

export async function toggleTask(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = param(req, 'id');
    const task = await prisma.task.findFirst({ where: { id, userId: req.user!.userId } });
    if (!task) throw new AppError('Task not found', 404);
    const nowCompleted = !task.completed;
    const updated = await prisma.task.update({ where: { id }, data: { completed: nowCompleted, progress: nowCompleted ? 100 : task.progress } });
    if (nowCompleted) {
      await prisma.user.update({ where: { id: req.user!.userId }, data: { xp: { increment: task.xpValue }, streak: { increment: 1 } } });
    }
    res.json({ success: true, data: updated, xpEarned: nowCompleted ? task.xpValue : 0 });
  } catch (err) { next(err); }
}

export async function updateProgress(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = param(req, 'id');
    const { progress } = req.body;
    const task = await prisma.task.findFirst({ where: { id, userId: req.user!.userId } });
    if (!task) throw new AppError('Task not found', 404);
    const isNowCompleted = progress >= 100 && !task.completed;
    const updated = await prisma.task.update({ where: { id }, data: { progress, completed: isNowCompleted } });
    if (isNowCompleted) {
      await prisma.user.update({ where: { id: req.user!.userId }, data: { xp: { increment: task.xpValue } } });
    }
    res.json({ success: true, data: updated, xpEarned: isNowCompleted ? task.xpValue : 0 });
  } catch (err) { next(err); }
}
