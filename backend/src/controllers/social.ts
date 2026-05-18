import { Response, NextFunction } from 'express';
import { prisma } from '../config/db.js';
import { AuthRequest } from '../types/index.js';
import { AppError } from '../middleware/errorHandler.js';
import { param } from '../utils/param.js';

export async function getLeaderboard(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const users = await prisma.user.findMany({ orderBy: { xp: 'desc' }, take: 50, select: { id: true, name: true, avatar: true, xp: true, level: true, streak: true } });
    const withRank = users.map((u, i) => ({ ...u, rank: i + 1 }));
    res.json({ success: true, data: withRank });
  } catch (err) { next(err); }
}

export async function getFriends(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const friendships = await prisma.friendship.findMany({
      where: { OR: [{ userId: req.user!.userId }, { friendId: req.user!.userId }], status: 'accepted' },
      include: { initiator: { select: { id: true, name: true, avatar: true, xp: true, level: true } }, receiver: { select: { id: true, name: true, avatar: true, xp: true, level: true } } },
    });
    const friends = friendships.map(f => {
      const person = f.userId === req.user!.userId ? f.receiver : f.initiator;
      return { id: person.id, name: person.name, avatar: person.avatar, xp: person.xp, level: person.level, status: 'online' as const };
    });
    res.json({ success: true, data: friends });
  } catch (err) { next(err); }
}

export async function addFriend(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const friendId = req.body.friendId;
    const friend = await prisma.user.findUnique({ where: { id: friendId } });
    if (!friend) throw new AppError('User not found', 404);
    if (friend.id === req.user!.userId) throw new AppError('Cannot add yourself', 400);
    const existing = await prisma.friendship.findFirst({ where: { OR: [{ userId: req.user!.userId, friendId }, { userId: friendId, friendId: req.user!.userId }] } });
    if (existing) throw new AppError('Already friends or request pending', 409);
    const friendship = await prisma.friendship.create({ data: { userId: req.user!.userId, friendId, status: 'accepted' } });
    res.status(201).json({ success: true, data: friendship });
  } catch (err) { next(err); }
}

export async function removeFriend(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = param(req, 'id');
    const friendship = await prisma.friendship.findFirst({ where: { OR: [{ userId: req.user!.userId, friendId: id }, { userId: id, friendId: req.user!.userId }] } });
    if (!friendship) throw new AppError('Friendship not found', 404);
    await prisma.friendship.delete({ where: { id: friendship.id } });
    res.json({ success: true, message: 'Friend removed' });
  } catch (err) { next(err); }
}

export async function getNotifications(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const notifications = await prisma.notification.findMany({ where: { userId: req.user!.userId }, orderBy: { createdAt: 'desc' }, take: 50 });
    res.json({ success: true, data: notifications });
  } catch (err) { next(err); }
}

export async function createNotification(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const note = await prisma.notification.create({ data: { type: req.body.type || 'info', title: req.body.title, message: req.body.message, userId: req.user!.userId } });
    res.status(201).json({ success: true, data: note });
  } catch (err) { next(err); }
}

export async function markAllNotificationsRead(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await prisma.notification.updateMany({ where: { userId: req.user!.userId, read: false }, data: { read: true } });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) { next(err); }
}

export async function clearNotification(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await prisma.notification.deleteMany({ where: { id: param(req, 'id'), userId: req.user!.userId } });
    res.json({ success: true, message: 'Notification cleared' });
  } catch (err) { next(err); }
}

export async function getStudyRooms(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const rooms = await prisma.studyRoom.findMany({ include: { _count: { select: { members: true } } }, orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: rooms });
  } catch (err) { next(err); }
}

export async function createStudyRoom(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const room = await prisma.studyRoom.create({ data: { name: req.body.name, description: req.body.description, members: { create: { userId: req.user!.userId, role: 'owner' } } }, include: { _count: { select: { members: true } } } });
    res.status(201).json({ success: true, data: room });
  } catch (err) { next(err); }
}

export async function joinStudyRoom(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const roomId = param(req, 'id');
    const existing = await prisma.studyRoomMember.findFirst({ where: { roomId, userId: req.user!.userId } });
    if (!existing) await prisma.studyRoomMember.create({ data: { roomId, userId: req.user!.userId } });
    const room = await prisma.studyRoom.findUnique({ where: { id: roomId }, include: { _count: { select: { members: true } } } });
    res.json({ success: true, data: room });
  } catch (err) { next(err); }
}

export async function sendMessage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const message = await prisma.message.create({ data: { content: req.body.content, roomId: param(req, 'roomId'), userId: req.user!.userId }, include: { user: { select: { id: true, name: true, avatar: true } } } });
    res.status(201).json({ success: true, data: message });
  } catch (err) { next(err); }
}

export async function getMessages(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const messages = await prisma.message.findMany({ where: { roomId: param(req, 'roomId') }, include: { user: { select: { id: true, name: true, avatar: true } } }, orderBy: { createdAt: 'asc' }, take: 100 });
    res.json({ success: true, data: messages });
  } catch (err) { next(err); }
}
