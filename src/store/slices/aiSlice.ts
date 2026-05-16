import { type StateCreator } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AISlice {
  chatHistory: ChatMessage[];
  aiMemory: {
    weakSubjects: string[];
    lastFocus: string;
    productivityScore: number;
    burnoutRisk: number;
    focusHeatmap: number[];
    suggestedActions: string[];
  };
  sendMessage: (content: string) => void;
  addAssistantMessage: (content: string) => void;
  updateMemory: (update: Partial<AISlice['aiMemory']>) => void;
  clearChat: () => void;
}

export const createAISlice: StateCreator<AISlice> = (set) => ({
  chatHistory: [
    { id: '1', role: 'assistant', content: "Neural Assistant online. How can I optimize your study path today?", timestamp: Date.now() }
  ],
  aiMemory: {
    weakSubjects: ['Discrete Structures', 'Quantum Physics'],
    lastFocus: 'Circuit Design',
    productivityScore: 88,
    burnoutRisk: 12,
    focusHeatmap: [2, 5, 8, 12, 15, 10, 5, 3, 1, 0, 0, 0, 4, 8, 12, 18, 22, 25, 20, 15, 10, 8, 5, 2],
    suggestedActions: ['Generate Circuit Quiz', 'Review Set Theory', 'Take a 15m Break']
  },
  sendMessage: (content) => set((state) => ({
    chatHistory: [...state.chatHistory, { id: Math.random().toString(), role: 'user', content, timestamp: Date.now() }]
  })),
  addAssistantMessage: (content) => set((state) => ({
    chatHistory: [...state.chatHistory, { id: Math.random().toString(), role: 'assistant', content, timestamp: Date.now() }]
  })),
  updateMemory: (update) => set((state) => ({
    aiMemory: { ...state.aiMemory, ...update }
  })),
  clearChat: () => set({ chatHistory: [] })
});

