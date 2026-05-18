import { Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';

export async function getProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { xp: true, level: true, streak: true, totalFocusTime: true },
    });
    const achievements = await prisma.userAchievement.findMany({
      where: { userId: req.user!.userId },
      include: { achievement: true },
    });
    res.json({ success: true, data: { ...user, achievements } });
  } catch (err) { next(err); }
}

export async function addXP(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { amount } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user!.userId } });
    if (!user) throw new AppError('User not found', 404);

    const newXP = user.xp + amount;
    const nextLevelXP = user.level * 1000;
    let newLevel = user.level;
    let leveledUp = false;

    if (newXP >= nextLevelXP) {
      newLevel = user.level + 1;
      leveledUp = true;
    }

    await prisma.user.update({
      where: { id: req.user!.userId },
      data: { xp: leveledUp ? newXP - nextLevelXP : newXP, level: newLevel },
    });

    res.json({ success: true, data: { xp: leveledUp ? newXP - nextLevelXP : newXP, level: newLevel, leveledUp } });
  } catch (err) { next(err); }
}

export async function getAchievements(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const allAchievements = await prisma.achievement.findMany();
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: req.user!.userId },
    });
    const unlockedIds = new Set(userAchievements.map(a => a.achievementId));

    const data = allAchievements.map(a => ({
      ...a,
      unlocked: unlockedIds.has(a.id),
      unlockedAt: userAchievements.find(ua => ua.achievementId === a.id)?.unlockedAt || null,
    }));

    res.json({ success: true, data });
  } catch (err) { next(err); }
}

export async function unlockAchievement(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { achievementId } = req.body;
    const achievement = await prisma.achievement.findUnique({ where: { id: achievementId } });
    if (!achievement) throw new AppError('Achievement not found', 404);

    const existing = await prisma.userAchievement.findUnique({
      where: { userId_achievementId: { userId: req.user!.userId, achievementId } },
    });
    if (existing) throw new AppError('Already unlocked', 409);

    const ua = await prisma.userAchievement.create({
      data: { userId: req.user!.userId, achievementId },
    });

    await prisma.user.update({
      where: { id: req.user!.userId },
      data: { xp: { increment: achievement.xpReward } },
    });

    res.status(201).json({ success: true, data: ua, xpReward: achievement.xpReward });
  } catch (err) { next(err); }
}

export async function incrementStreak(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: { streak: { increment: 1 } },
      select: { streak: true },
    });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
}
