import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getEvents, createEvent, updateEvent, deleteEvent, getDrift, autoFillSchedule } from '../controllers/planner.js';

export const plannerRouter = Router();
plannerRouter.use(authenticate);

plannerRouter.get('/', getEvents);
plannerRouter.post('/', createEvent);
plannerRouter.patch('/:id', updateEvent);
plannerRouter.delete('/:id', deleteEvent);
plannerRouter.get('/drift', getDrift);
plannerRouter.post('/auto-fill', autoFillSchedule);
