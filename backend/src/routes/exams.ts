import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getExams, createExam, updateExam, deleteExam, recordExamScore, getFlashcards, createFlashcard, updateFlashcard } from '../controllers/exams.js';

export const examsRouter = Router();
examsRouter.use(authenticate);

examsRouter.get('/', getExams);
examsRouter.post('/', createExam);
examsRouter.patch('/:id', updateExam);
examsRouter.delete('/:id', deleteExam);
examsRouter.post('/:id/score', recordExamScore);
examsRouter.get('/flashcards', getFlashcards);
examsRouter.post('/flashcards', createFlashcard);
examsRouter.patch('/flashcards/:id', updateFlashcard);
