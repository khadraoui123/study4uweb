import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getMessages, sendMessage, getMemory, updateMemory, getSuggestions, clearChat } from '../controllers/ai.js';

export const aiRouter = Router();
aiRouter.use(authenticate);

aiRouter.get('/messages', getMessages);
aiRouter.post('/messages', sendMessage);
aiRouter.delete('/messages', clearChat);
aiRouter.get('/memory', getMemory);
aiRouter.patch('/memory', updateMemory);
aiRouter.get('/suggestions', getSuggestions);
