import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authRouter } from './routes/auth.js';
import { coursesRouter } from './routes/courses.js';
import { tasksRouter } from './routes/tasks.js';
import { notesRouter } from './routes/notes.js';
import { plannerRouter } from './routes/planner.js';
import { focusRouter } from './routes/focus.js';
import { analyticsRouter } from './routes/analytics.js';
import { socialRouter } from './routes/social.js';
import { examsRouter } from './routes/exams.js';
import { gamificationRouter } from './routes/gamification.js';
import { aiRouter } from './routes/ai.js';
import { userRouter } from './routes/user.js';
import { prisma } from './config/db.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, postman or curl)
    if (!origin) return callback(null, true);
    
    // Dynamically permit all local loopback ports during development testing
    const isLocal = origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:');
    if (isLocal || origin === config.frontendUrl || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 200 : 10000, // Developer-friendly threshold for local testing
  message: { error: 'Too many requests, please try again later.' },
  skip: (req) => {
    // Safely skip rate limiting for all localhost and loopback interface requests
    const ip = req.ip || req.socket.remoteAddress || '';
    return (
      ip.includes('127.0.0.1') || 
      ip.includes('::1') || 
      ip.includes('localhost') ||
      process.env.NODE_ENV !== 'production'
    );
  }
});
app.use('/api/', limiter);

app.use('/api/auth', authRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/notes', notesRouter);
app.use('/api/planner', plannerRouter);
app.use('/api/focus', focusRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/social', socialRouter);
app.use('/api/exams', examsRouter);
app.use('/api/gamification', gamificationRouter);
app.use('/api/ai', aiRouter);
app.use('/api/user', userRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`StudyMate API running on port ${config.port}`);
});
