import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getCourses, getCourse, createCourse, updateCourse, deleteCourse, boostMastery, logAttendance } from '../controllers/courses.js';

export const coursesRouter = Router();
coursesRouter.use(authenticate);

coursesRouter.get('/', getCourses);
coursesRouter.get('/:id', getCourse);
coursesRouter.post('/', createCourse);
coursesRouter.patch('/:id', updateCourse);
coursesRouter.delete('/:id', deleteCourse);
coursesRouter.post('/:id/boost', boostMastery);
coursesRouter.post('/:id/attendance', logAttendance);
