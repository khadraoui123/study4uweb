import { Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';
import { param } from '../utils/param.js';

export async function getExams(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const exams = await prisma.exam.findMany({ where: { userId: req.user!.userId }, include: { course: { select: { id: true, code: true, name: true } } }, orderBy: { date: 'asc' } });
    res.json({ success: true, data: exams });
  } catch (err) { next(err); }
}

export async function createExam(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const exam = await prisma.exam.create({ data: { title: req.body.title, date: new Date(req.body.date), weight: req.body.weight || 0, courseId: req.body.courseId, userId: req.user!.userId }, include: { course: { select: { id: true, code: true, name: true } } } });
    await prisma.calendarEvent.create({ data: { title: `EXAM: ${exam.title}`, start: new Date(req.body.date), end: new Date(new Date(req.body.date).getTime() + 2 * 60 * 60 * 1000), type: 'exam', courseId: exam.courseId, cognitiveIntensity: 'PEAK', xpReward: 500, status: 'pending', aiRecommendation: 'High-threat temporal event. AI suggests clearing 2 days prior for deep review.', userId: req.user!.userId } });
    res.status(201).json({ success: true, data: exam });
  } catch (err) { next(err); }
}

export async function updateExam(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = param(req, 'id');
    const existing = await prisma.exam.findFirst({ where: { id, userId: req.user!.userId } });
    if (!existing) throw new AppError('Exam not found', 404);
    const allowed = ['title', 'date', 'weight', 'score', 'courseId'];
    const updates: any = {};
    for (const key of allowed) { if (req.body[key] !== undefined) updates[key] = key === 'date' ? new Date(req.body[key]) : req.body[key]; }
    const exam = await prisma.exam.update({ where: { id }, data: updates, include: { course: { select: { id: true, code: true, name: true } } } });
    res.json({ success: true, data: exam });
  } catch (err) { next(err); }
}

export async function deleteExam(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = param(req, 'id');
    const existing = await prisma.exam.findFirst({ where: { id, userId: req.user!.userId } });
    if (!existing) throw new AppError('Exam not found', 404);
    await prisma.exam.delete({ where: { id } });
    res.json({ success: true, message: 'Exam deleted' });
  } catch (err) { next(err); }
}

export async function recordExamScore(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = param(req, 'id');
    const { score } = req.body;
    const exam = await prisma.exam.findFirst({ where: { id, userId: req.user!.userId } });
    if (!exam) throw new AppError('Exam not found', 404);
    const updated = await prisma.exam.update({ where: { id }, data: { score } });
    await prisma.performanceSnapshot.create({ data: { score, userId: req.user!.userId } });
    const xpEarned = Math.round(score * 2);
    await prisma.user.update({ where: { id: req.user!.userId }, data: { xp: { increment: xpEarned } } });
    res.json({ success: true, data: updated, xpEarned });
  } catch (err) { next(err); }
}

export async function getFlashcards(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { courseId } = req.query;
    const where: any = { userId: req.user!.userId };
    if (courseId) where.courseId = courseId as string;
    const flashcards = await prisma.flashcard.findMany({ where, orderBy: { lastReviewed: 'asc' } });
    res.json({ success: true, data: flashcards });
  } catch (err) { next(err); }
}

export async function createFlashcard(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const card = await prisma.flashcard.create({ data: { question: req.body.question, answer: req.body.answer, courseId: req.body.courseId, userId: req.user!.userId } });
    res.status(201).json({ success: true, data: card });
  } catch (err) { next(err); }
}

export async function updateFlashcard(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = param(req, 'id');
    const existing = await prisma.flashcard.findFirst({ where: { id, userId: req.user!.userId } });
    if (!existing) throw new AppError('Flashcard not found', 404);
    const card = await prisma.flashcard.update({ where: { id }, data: { ...req.body, lastReviewed: req.body.mastery !== undefined ? new Date() : undefined } });
    res.json({ success: true, data: card });
  } catch (err) { next(err); }
}
