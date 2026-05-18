import { type StateCreator } from 'zustand';
import { notesApi } from '../../api/notes';

export interface Note {
  id: string;
  title: string;
  content: string;
  courseId?: string;
  tags: string[];
  lastModified: number;
}

export interface NoteSlice {
  notes: Note[];
  isLoading: boolean;
  loadNotes: () => Promise<void>;
  addNote: (note: Partial<Note>) => Promise<void>;
  updateNote: (id: string, update: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  getAISuggestionsForNote: (id: string) => string[];
}

export const createNoteSlice: StateCreator<NoteSlice> = (set) => ({
  notes: [],
  isLoading: false,

  loadNotes: async () => {
    try {
      const notes = await notesApi.getAll();
      set({ notes: notes.map((n: any) => ({
        ...n,
        tags: typeof n.tags === 'string' ? JSON.parse(n.tags) : (n.tags || []),
        lastModified: new Date(n.lastModified).getTime(),
      })) });
    } catch {}
  },

  addNote: async (note) => {
    try {
      const created = await notesApi.create(note);
      set((state) => ({
        notes: [{
          ...created,
          tags: typeof created.tags === 'string' ? JSON.parse(created.tags) : (created.tags || []),
          lastModified: new Date(created.lastModified).getTime(),
        }, ...state.notes],
      }));
    } catch {}
  },

  updateNote: async (id, update) => {
    try {
      const updated = await notesApi.update(id, update);
      set((state) => ({
        notes: state.notes.map((n: any) => n.id === id ? {
          ...n, ...updated,
          tags: typeof updated.tags === 'string' ? JSON.parse(updated.tags) : (updated.tags || n.tags),
          lastModified: new Date(updated.lastModified || Date.now()).getTime(),
        } : n),
      }));
    } catch {}
  },

  deleteNote: async (id) => {
    try {
      await notesApi.delete(id);
      set((state) => ({ notes: state.notes.filter((n: any) => n.id !== id) }));
    } catch {}
  },

  getAISuggestionsForNote: (_id) => ['Summarize concepts', 'Generate Flashcards', 'Explain in simple terms'],
});
