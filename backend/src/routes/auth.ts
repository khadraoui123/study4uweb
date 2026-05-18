import { Router } from 'express';
import { register, login, logout, refresh, getProfile, updateProfile } from '../controllers/auth.js';
import { authenticate } from '../middleware/auth.js';

export const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/refresh', refresh);
authRouter.get('/me', authenticate, getProfile);
authRouter.get('/profile', authenticate, getProfile);
authRouter.patch('/profile', authenticate, updateProfile);
