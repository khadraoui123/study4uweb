import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';

export const userRouter = Router();
userRouter.use(authenticate);

// Profile management is handled via auth routes
userRouter.get('/me', (req: any, res) => {
  res.json({ success: true, data: req.user });
});
