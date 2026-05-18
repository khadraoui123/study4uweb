import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { getNotes, getNote, createNote, updateNote, deleteNote } from '../controllers/notes.js';

export const notesRouter = Router();
notesRouter.use(authenticate);

notesRouter.get('/', getNotes);
notesRouter.get('/:id', getNote);
notesRouter.post('/', createNote);
notesRouter.patch('/:id', updateNote);
notesRouter.delete('/:id', deleteNote);
