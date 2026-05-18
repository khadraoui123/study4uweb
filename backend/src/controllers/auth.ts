import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../config/db.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/tokens.js';
import { AppError } from '../middleware/errorHandler.js';
import { AuthRequest } from '../types/index.js';

const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(1),
    major: z.string().optional(),
    year: z.string().optional(),
    avatar: z.string().optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, name, major, year, avatar } = registerSchema.parse({ body: req.body }).body;
    
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new AppError('Email already registered', 409);

    const passwordHash = await bcrypt.hash(password, 12);
    const finalAvatar = avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          passwordHash,
          name,
          major: major || null,
          year: year || null,
          avatar: finalAvatar,
          rank: 'Scholar Grade 1',
          credits: 0,
          totalCredits: 0,
          gpa: 0.0,
          xp: 0,
          level: 1,
          streak: 0,
          totalFocusTime: 0,
        },
      });

      await tx.aIMemory.create({
        data: {
          userId: newUser.id,
          weakSubjects: '[]',
          burnoutRisk: 10,
          productivityScore: 80,
          suggestedActions: '[]',
        },
      });

      await tx.leaderboardEntry.create({
        data: {
          userId: newUser.id,
          score: 0,
          period: 'weekly',
        },
      });

      await tx.notification.create({
        data: {
          userId: newUser.id,
          type: 'success',
          title: 'Neural Node Synced',
          message: `Welcome to Study4u, ${name}! Your learning environment has been fully initialized. Let's optimize your academic workflow together.`,
        },
      });

      // Today's date with time normalized to start of day
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await tx.dailyGoal.create({
        data: {
          userId: newUser.id,
          completed: 0,
          total: 5,
          date: today,
        },
      });

      return newUser;
    });

    const payload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          major: user.major,
          year: user.year,
          rank: user.rank,
          credits: user.credits,
          totalCredits: user.totalCredits,
          gpa: user.gpa,
          xp: user.xp,
          level: user.level,
          streak: user.streak,
          totalFocusTime: user.totalFocusTime,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (err) { next(err); }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = loginSchema.parse({ body: req.body }).body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError('Invalid credentials', 401);

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new AppError('Invalid credentials', 401);

    const payload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await prisma.user.update({ where: { id: user.id }, data: { lastActiveAt: new Date() } });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          major: user.major,
          year: user.year,
          rank: user.rank,
          credits: user.credits,
          totalCredits: user.totalCredits,
          gpa: user.gpa,
          xp: user.xp,
          level: user.level,
          streak: user.streak,
          totalFocusTime: user.totalFocusTime,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (err) { next(err); }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    // Return standard success response
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (err) { next(err); }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new AppError('Refresh token required', 400);

    const decoded = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) throw new AppError('User not found', 404);

    const payload = { userId: user.id, email: user.email };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    res.json({
      success: true,
      data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
    });
  } catch (err) { next(err); }
}

export async function getProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: {
        courses: true,
        aiMemory: true,
        notifications: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        dailyGoals: {
          orderBy: { date: 'desc' },
          take: 1,
        },
        leaderboardEntries: true,
        _count: { select: { tasks: true, notes: true, achievements: true } },
      },
    });
    if (!user) throw new AppError('User not found', 404);

    const { passwordHash, ...safeUser } = user;
    res.json({ success: true, data: safeUser });
  } catch (err) { next(err); }
}

export async function updateProfile(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const allowed = ['name', 'major', 'year', 'avatar'];
    const updates: any = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: updates,
    });

    const { passwordHash, ...safeUser } = user;
    res.json({ success: true, data: safeUser });
  } catch (err) { next(err); }
}

