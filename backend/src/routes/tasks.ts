import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getTasks, createTask, updateTask, deleteTask, toggleTask, updateProgress } from '../controllers/tasks.js';

export const tasksRouter = Router();
tasksRouter.use(authenticate);

tasksRouter.get('/', getTasks);
tasksRouter.post('/', createTask);
tasksRouter.patch('/:id', updateTask);
tasksRouter.delete('/:id', deleteTask);
tasksRouter.post('/:id/toggle', toggleTask);
tasksRouter.patch('/:id/progress', updateProgress);
