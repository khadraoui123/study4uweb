import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

const prisma = new PrismaClient();

async function safeCreate(model: any, data: any) {
  try { await model.create({ data }); } catch { /* ignore duplicates */ }
}

async function main() {
  const passwordHash = await bcrypt.hash('password123', 12);

  const user = await prisma.user.upsert({
    where: { email: 'john.doe@university.edu' },
    update: {},
    create: {
      id: 'u1',
      email: 'john.doe@university.edu',
      passwordHash,
      name: 'John Doe',
      major: 'B.S. Computer Engineering',
      year: 'Senior Scholar',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      rank: 'Scholar Grade 42',
      credits: 112,
      totalCredits: 128,
      gpa: 3.92,
      xp: 1250,
      level: 5,
      streak: 12,
      totalFocusTime: 1440,
    },
  });

  const achievements = [
    { id: 'ach-1', title: 'Neural Pioneer', description: 'Complete your first focus session', icon: 'zap', xpReward: 100 },
    { id: 'ach-2', title: 'Deep Diver', description: 'Focus for 2 hours straight', icon: 'brain', xpReward: 200 },
    { id: 'ach-3', title: 'Exam Crusher', description: 'Score 100% on a mock exam', icon: 'award', xpReward: 300 },
    { id: 'ach-4', title: 'Task Master', description: 'Complete 10 tasks in a day', icon: 'check-check', xpReward: 150 },
    { id: 'ach-5', title: 'Streak King', description: 'Maintain a 7-day streak', icon: 'flame', xpReward: 250 },
    { id: 'ach-6', title: 'Knowledge Seeker', description: 'Create 20 notes', icon: 'book', xpReward: 100 },
    { id: 'ach-7', title: 'Social Butterfly', description: 'Add 5 friends', icon: 'users', xpReward: 100 },
    { id: 'ach-8', title: 'Quiz Champion', description: 'Score 90%+ on 5 quizzes', icon: 'trophy', xpReward: 400 },
  ];

  for (const a of achievements) {
    await prisma.achievement.upsert({ where: { id: a.id }, update: {}, create: a });
  }

  await prisma.userAchievement.upsert({
    where: { userId_achievementId: { userId: user.id, achievementId: 'ach-1' } },
    update: {},
    create: { userId: user.id, achievementId: 'ach-1' },
  });

  const course1 = await prisma.course.upsert({
    where: { id: 'c1' },
    update: {},
    create: {
      id: 'c1', code: 'EEE182.4', name: 'Electrical Circuit Design 1L',
      instructor: 'Dr. Sarah Chen', schedule: 'Tue 11:30 AM - 1:30 PM',
      difficulty: 8, percentage: 89, currentGrade: 'A-', room: 'L402',
      attendancePresent: 8, attendanceAbsent: 1, attendanceLate: 2,
      userId: user.id,
    },
  });

  const course2 = await prisma.course.upsert({
    where: { id: 'c2' },
    update: {},
    create: {
      id: 'c2', code: 'PHY181.6', name: 'Physics Mechanics Lab',
      instructor: 'Prof. James Miller', schedule: 'Wed 09:00 AM - 11:00 AM',
      difficulty: 7, percentage: 94, currentGrade: 'A', room: 'S201',
      attendancePresent: 10, attendanceAbsent: 0, attendanceLate: 1,
      userId: user.id,
    },
  });

  await safeCreate(prisma.exam, { id: 'e1', title: 'Midterm Exam', date: new Date('2026-05-25'), weight: 30, courseId: course1.id, userId: user.id });
  await safeCreate(prisma.exam, { id: 'e2', title: 'Final Project', date: new Date('2026-06-10'), weight: 40, courseId: course2.id, userId: user.id });

  const snapData = [
    { date: '2026-05-10', score: 75 },
    { date: '2026-05-11', score: 78 },
    { date: '2026-05-12', score: 82 },
    { date: '2026-05-13', score: 80 },
    { date: '2026-05-14', score: 85 },
    { date: '2026-05-15', score: 89 },
  ];
  for (const s of snapData) {
    await safeCreate(prisma.performanceSnapshot, { ...s, date: new Date(s.date), userId: user.id });
  }

  await safeCreate(prisma.task, { id: 't1', title: 'Submit Circuit Design Lab Manual', dueDate: new Date('2026-05-18'), urgency: 'URGENT', priority: 1, completed: false, progress: 45, xpValue: 150, courseId: course1.id, userId: user.id });
  await safeCreate(prisma.task, { id: 't2', title: 'Read Chapter 4 Physics Workbook', dueDate: new Date('2026-05-15'), urgency: 'NORMAL', priority: 2, completed: true, progress: 100, xpValue: 50, courseId: course2.id, userId: user.id });
  await safeCreate(prisma.task, { id: 't3', title: 'Practice Discrete Math Problems', dueDate: new Date('2026-05-20'), urgency: 'NORMAL', priority: 1, completed: false, progress: 10, xpValue: 200, aiSuggested: true, courseId: course1.id, userId: user.id });

  await safeCreate(prisma.note, { id: 'n1', title: 'Thermodynamics Laws', content: '# First Law\nEnergy cannot be created...\n# Second Law\nEntropy always increases.', tags: JSON.stringify(['physics', 'laws']), courseId: course2.id, userId: user.id });
  await safeCreate(prisma.note, { id: 'n2', title: 'KVL/KCL Summary', content: "Kirchhoff's voltage and current laws...", tags: JSON.stringify(['electronics', 'basics']), courseId: course1.id, userId: user.id });

  await safeCreate(prisma.calendarEvent, { id: 'ev1', title: 'Circuit Design Lecture', start: new Date('2026-05-17T08:30:00'), end: new Date('2026-05-17T10:30:00'), type: 'lecture', courseId: course1.id, cognitiveIntensity: 'MEDIUM', xpReward: 100, status: 'completed', userId: user.id });
  await safeCreate(prisma.calendarEvent, { id: 'ev2', title: 'Physics Mechanics Lab', start: new Date('2026-05-17T11:00:00'), end: new Date('2026-05-17T13:00:00'), type: 'lecture', courseId: course2.id, cognitiveIntensity: 'HIGH', xpReward: 150, status: 'active', aiRecommendation: 'Review vector calculus before entering lab node.', userId: user.id });
  await safeCreate(prisma.calendarEvent, { id: 'ev3', title: 'Deep Focus: Discrete Math Problems', start: new Date('2026-05-17T14:00:00'), end: new Date('2026-05-17T16:00:00'), type: 'focus', courseId: course1.id, cognitiveIntensity: 'PEAK', xpReward: 250, status: 'pending', linkedTaskId: 't3', aiRecommendation: 'AI Optimal Window. High cognitive retention predicted.', userId: user.id });

  await prisma.aIMemory.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      weakSubjects: JSON.stringify(['Discrete Structures', 'Quantum Physics']),
      lastFocus: 'Circuit Design',
      productivityScore: 88,
      burnoutRisk: 12,
      suggestedActions: JSON.stringify(['Generate Circuit Quiz', 'Review Set Theory', 'Take a 15m Break']),
    },
  });

  await safeCreate(prisma.studySession, { id: 's1', duration: 45, timestamp: new Date('2026-05-15T10:00:00'), subject: 'Electrical Circuit Design', efficiency: 85, userId: user.id });
  await safeCreate(prisma.studySession, { id: 's2', duration: 60, timestamp: new Date('2026-05-15T14:00:00'), subject: 'Physics Mechanics', efficiency: 92, userId: user.id });

  const leaderboardUsers = [
    { name: 'Alex Rivera', xp: 12450, level: 42 },
    { name: 'Sarah Chen', xp: 11200, level: 38 },
    { name: 'James Miller', xp: 9800, level: 35 },
    { name: 'Elena Petrova', xp: 8500, level: 30 },
    { name: 'Kevin Zhang', xp: 7200, level: 28 },
  ];

  for (const lbUser of leaderboardUsers) {
    const lbUserId = uuid();
    await prisma.user.upsert({
      where: { email: `${lbUser.name.toLowerCase().replace(' ', '.')}@university.edu` },
      update: { xp: lbUser.xp, level: lbUser.level },
      create: {
        id: lbUserId,
        email: `${lbUser.name.toLowerCase().replace(' ', '.')}@university.edu`,
        passwordHash,
        name: lbUser.name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${lbUser.name}`,
        xp: lbUser.xp,
        level: lbUser.level,
      },
    });
  }

  console.log('Seed data created successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
