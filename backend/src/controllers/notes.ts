import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';
import { param } from '../utils/param.js';

const createSchema = z.object({
  body: z.object({
    title: z.string().min(1),
    content: z.string().optional(),
    tags: z.array(z.string()).optional(),
    courseId: z.string().optional().nullable(),
  }),
});

export async function getNotes(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { courseId, search } = req.query;
    const where: any = { userId: req.user!.userId };
    if (courseId) where.courseId = courseId as string;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' as any } },
        { content: { contains: search as string, mode: 'insensitive' as any } },
      ];
    }
    const notes = await prisma.note.findMany({ where, orderBy: { lastModified: 'desc' } });
    res.json({ success: true, data: notes });
  } catch (err) { next(err); }
}

export async function getNote(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const note = await prisma.note.findFirst({ where: { id: param(req, 'id'), userId: req.user!.userId } });
    if (!note) throw new AppError('Note not found', 404);
    res.json({ success: true, data: note });
  } catch (err) { next(err); }
}

export async function createNote(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = createSchema.parse({ body: req.body }).body;
    const note = await prisma.note.create({ data: { title: data.title, content: data.content || '', tags: JSON.stringify(data.tags || []), courseId: data.courseId, userId: req.user!.userId } });
    res.status(201).json({ success: true, data: note });
  } catch (err) { next(err); }
}

export async function updateNote(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = param(req, 'id');
    const existing = await prisma.note.findFirst({ where: { id, userId: req.user!.userId } });
    if (!existing) throw new AppError('Note not found', 404);
    const allowed = ['title', 'content', 'courseId'];
    const updates: any = {};
    for (const key of allowed) { if (req.body[key] !== undefined) updates[key] = req.body[key]; }
    if (req.body.tags) updates.tags = JSON.stringify(req.body.tags);
    const note = await prisma.note.update({ where: { id }, data: { ...updates, lastModified: new Date() } });
    res.json({ success: true, data: note });
  } catch (err) { next(err); }
}

export async function deleteNote(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = param(req, 'id');
    const existing = await prisma.note.findFirst({ where: { id, userId: req.user!.userId } });
    if (!existing) throw new AppError('Note not found', 404);
    await prisma.note.delete({ where: { id } });
    res.json({ success: true, message: 'Note deleted' });
  } catch (err) { next(err); }
}
