import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';
import { param } from '../utils/param.js';

const createSchema = z.object({
  body: z.object({
    code: z.string().min(1),
    name: z.string().min(1),
    instructor: z.string().optional(),
    schedule: z.string().optional(),
    difficulty: z.number().int().min(1).max(10).optional(),
    room: z.string().optional(),
  }),
});

export async function getCourses(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const courses = await prisma.course.findMany({
      where: { userId: req.user!.userId },
      include: { _count: { select: { tasks: true, exams: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: courses });
  } catch (err) { next(err); }
}

export async function getCourse(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const course = await prisma.course.findFirst({
      where: { id: param(req, 'id'), userId: req.user!.userId },
      include: { tasks: true, exams: true, notes: true },
    });
    if (!course) throw new AppError('Course not found', 404);
    res.json({ success: true, data: course });
  } catch (err) { next(err); }
}

export async function createCourse(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = createSchema.parse({ body: req.body }).body;
    const course = await prisma.course.create({
      data: { ...data, userId: req.user!.userId },
    });
    res.status(201).json({ success: true, data: course });
  } catch (err) { next(err); }
}

export async function updateCourse(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = param(req, 'id');
    const existing = await prisma.course.findFirst({ where: { id, userId: req.user!.userId } });
    if (!existing) throw new AppError('Course not found', 404);
    const allowed = ['code', 'name', 'instructor', 'schedule', 'difficulty', 'percentage', 'currentGrade', 'room', 'attendancePresent', 'attendanceAbsent', 'attendanceLate'];
    const updates: any = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const course = await prisma.course.update({ where: { id }, data: updates });
    res.json({ success: true, data: course });
  } catch (err) { next(err); }
}

export async function deleteCourse(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = param(req, 'id');
    const existing = await prisma.course.findFirst({ where: { id, userId: req.user!.userId } });
    if (!existing) throw new AppError('Course not found', 404);
    await prisma.course.delete({ where: { id } });
    res.json({ success: true, message: 'Course deleted' });
  } catch (err) { next(err); }
}

export async function boostMastery(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = param(req, 'id');
    const { amount } = req.body;
    const course = await prisma.course.findFirst({ where: { id, userId: req.user!.userId } });
    if (!course) throw new AppError('Course not found', 404);
    const updated = await prisma.course.update({
      where: { id },
      data: { percentage: Math.min(100, course.percentage + (amount || 5)) },
    });
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
}

export async function logAttendance(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = param(req, 'id');
    const { type } = req.body;
    if (!['present', 'absent', 'late'].includes(type)) throw new AppError('Invalid attendance type', 400);
    const course = await prisma.course.findFirst({ where: { id, userId: req.user!.userId } });
    if (!course) throw new AppError('Course not found', 404);
    const field = type === 'present' ? 'attendancePresent' : type === 'absent' ? 'attendanceAbsent' : 'attendanceLate';
    const updated = await prisma.course.update({ where: { id }, data: { [field]: { increment: 1 } } });
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
}
