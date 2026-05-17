import { type StateCreator } from 'zustand';

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
  addNote: (note: Omit<Note, 'id' | 'lastModified'>) => void;
  updateNote: (id: string, update: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  getAISuggestionsForNote: (id: string) => string[];
}

export const createNoteSlice: StateCreator<any> = (set, get) => ({
  notes: [
    { id: 'n1', title: 'Thermodynamics Laws', content: '# First Law\nEnergy cannot be created or destroyed.\n# Second Law\nEntropy of an isolated system always increases.', courseId: '2', tags: ['physics', 'laws'], lastModified: Date.now() },
    { id: 'n2', title: 'KVL/KCL Summary', content: 'Kirchhoff\'s voltage and current laws are the basis for circuit analysis.', courseId: '1', tags: ['electronics', 'basics'], lastModified: Date.now() - 86400000 },
  ],
  addNote: (note) => set((state: any) => ({
    notes: [
      { ...note, id: Math.random().toString(36).slice(2), lastModified: Date.now() },
      ...state.notes
    ]
  })),
  updateNote: (id, update) => set((state: any) => ({
    notes: state.notes.map((n: any) => n.id === id ? { ...n, ...update, lastModified: Date.now() } : n)
  })),
  deleteNote: (id) => set((state: any) => ({
    notes: state.notes.filter((n: any) => n.id !== id)
  })),
  getAISuggestionsForNote: (id) => {
    // Simulated AI suggestions based on note content
    return ['Summarize concepts', 'Generate Flashcards', 'Explain entropy'];
  }
});
