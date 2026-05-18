import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getSession, updateSession, startNewSession, completeSession } from '../controllers/focus.js';

export const focusRouter = Router();
focusRouter.use(authenticate);

focusRouter.get('/', getSession);
focusRouter.post('/start', startNewSession);
focusRouter.patch('/:id', updateSession);
focusRouter.post('/:id/complete', completeSession);
