import { Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';

const aiResponses = [
  "Based on your recent performance, I recommend focusing on {subject}. Your retention score dropped 12% in the last 48 hours.",
  "Your peak cognitive window is between {time}. Schedule your most challenging work during this period.",
  "I've analyzed your study patterns. You show the strongest retention when studying {subject} in the morning.",
  "Great progress! Your consistency score is {score}%. Keep this momentum for your upcoming {exam}.",
  "Tip: Breaking down {subject} into 25-minute sprints with 5-minute breaks improves retention by 40%.",
  "I notice you haven't reviewed {subject} in {days} days. Spaced repetition suggests you review today.",
  "Your burnout risk is currently {risk}%. Consider scheduling a recovery block this afternoon.",
  "Based on your task completion rate, you're on track to finish all pending tasks by {date}.",
  "I've generated a custom quiz for {subject} based on your weak areas. Would you like to start?",
  "Your focus score has improved by {improvement}% compared to last week. Excellent neural adaptation!",
];

const subjects = ['Circuit Design', 'Physics Mechanics', 'Discrete Mathematics', 'Quantum Physics', 'Thermodynamics'];
const times = ['7:00 PM - 9:00 PM', '8:00 AM - 10:00 AM', '2:00 PM - 4:00 PM'];

export async function getMessages(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'asc' },
      take: 100,
    });
    res.json({ success: true, data: messages });
  } catch (err) { next(err); }
}

export async function sendMessage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { content } = req.body;
    if (!content) throw new AppError('Message content required', 400);

    const userMsg = await prisma.chatMessage.create({
      data: { role: 'user', content, userId: req.user!.userId },
    });

    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { name: true, xp: true, streak: true },
    });
    const memory = await prisma.aIMemory.findUnique({
      where: { userId: req.user!.userId },
    });
    const tasks = await prisma.task.count({ where: { userId: req.user!.userId, completed: false } });
    const exams = await prisma.exam.findFirst({
      where: { userId: req.user!.userId, date: { gte: new Date() } },
      orderBy: { date: 'asc' },
    });

    const template = aiResponses[Math.floor(Math.random() * aiResponses.length)];
    const aiContent = template
      .replace('{subject}', memory?.weakSubjects ? JSON.parse(memory.weakSubjects)[0] || subjects[0] : subjects[0])
      .replace('{time}', times[Math.floor(Math.random() * times.length)])
      .replace('{score}', String(memory?.productivityScore || 85))
      .replace('{exam}', exams?.title || 'upcoming exam')
      .replace('{days}', String(Math.floor(Math.random() * 5) + 1))
      .replace('{risk}', String(memory?.burnoutRisk || 10))
      .replace('{date}', new Date(Date.now() + 7 * 86400000).toLocaleDateString())
      .replace('{improvement}', String(Math.floor(Math.random() * 20) + 5));

    const aiMsg = await prisma.chatMessage.create({
      data: { role: 'assistant', content: aiContent, userId: req.user!.userId },
    });

    res.status(201).json({
      success: true,
      data: { user: userMsg, assistant: aiMsg },
    });
  } catch (err) { next(err); }
}

export async function getMemory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    let memory = await prisma.aIMemory.findUnique({
      where: { userId: req.user!.userId },
    });
    if (!memory) {
      memory = await prisma.aIMemory.create({
        data: { userId: req.user!.userId },
      });
    }
    res.json({ success: true, data: memory });
  } catch (err) { next(err); }
}

export async function updateMemory(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const updates: any = {};
    if (req.body.weakSubjects) updates.weakSubjects = JSON.stringify(req.body.weakSubjects);
    if (req.body.lastFocus !== undefined) updates.lastFocus = req.body.lastFocus;
    if (req.body.productivityScore !== undefined) updates.productivityScore = req.body.productivityScore;
    if (req.body.burnoutRisk !== undefined) updates.burnoutRisk = req.body.burnoutRisk;
    if (req.body.suggestedActions) updates.suggestedActions = JSON.stringify(req.body.suggestedActions);

    const memory = await prisma.aIMemory.upsert({
      where: { userId: req.user!.userId },
      create: { ...updates, userId: req.user!.userId },
      update: updates,
    });
    res.json({ success: true, data: memory });
  } catch (err) { next(err); }
}

export async function getSuggestions(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const [tasks, courses, exams, memory] = await Promise.all([
      prisma.task.findMany({ where: { userId: req.user!.userId, completed: false }, orderBy: { dueDate: 'asc' }, take: 5 }),
      prisma.course.findMany({ where: { userId: req.user!.userId }, orderBy: { percentage: 'asc' }, take: 3 }),
      prisma.exam.findMany({ where: { userId: req.user!.userId, date: { gte: new Date() } }, orderBy: { date: 'asc' }, take: 3 }),
      prisma.aIMemory.findUnique({ where: { userId: req.user!.userId } }),
    ]);

    const weakSubjects = memory?.weakSubjects ? JSON.parse(memory.weakSubjects) : [];
    const suggestions = [
      ...courses.map(c => `Review ${c.name} - Mastery at ${c.percentage}%`),
      ...tasks.map(t => `Complete: ${t.title} (Due: ${t.dueDate?.toLocaleDateString() || 'No date'})`),
      ...exams.map(e => `Prepare for ${e.title} on ${e.date.toLocaleDateString()}`),
      ...weakSubjects.map((s: string) => `Generate quiz for ${s}`),
    ];

    res.json({ success: true, data: suggestions.slice(0, 8) });
  } catch (err) { next(err); }
}

export async function clearChat(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await prisma.chatMessage.deleteMany({
      where: { userId: req.user!.userId },
    });
    res.json({ success: true, message: 'Chat history cleared' });
  } catch (err) { next(err); }
}
