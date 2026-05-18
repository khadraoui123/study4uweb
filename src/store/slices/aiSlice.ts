import { type StateCreator } from 'zustand';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
  timestamp?: number;
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
  isLoading: boolean;
  loadChatHistory: () => Promise<void>;
  loadMemory: () => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  updateMemory: (update: Partial<AISlice['aiMemory']>) => Promise<void>;
  clearChat: () => Promise<void>;
  loadSuggestions: () => Promise<void>;
  addAssistantMessage: (content: string) => void;
}

export const createAISlice: StateCreator<AISlice> = (set) => ({
  chatHistory: [],
  aiMemory: {
    weakSubjects: [],
    lastFocus: '',
    productivityScore: 80,
    burnoutRisk: 10,
    focusHeatmap: [2, 5, 8, 12, 15, 10, 5, 3, 1, 0, 0, 0, 4, 8, 12, 18, 22, 25, 20, 15, 10, 8, 5, 2],
    suggestedActions: [],
  },
  isLoading: false,

  loadChatHistory: async () => {
    try {
      const { aiApi } = await import('../../api/ai');
      const messages = await aiApi.getMessages();
      set({ chatHistory: messages });
    } catch {}
  },

  loadMemory: async () => {
    try {
      const { aiApi } = await import('../../api/ai');
      const memory = await aiApi.getMemory();
      if (memory) {
        set({
          aiMemory: {
            weakSubjects: memory.weakSubjects ? JSON.parse(memory.weakSubjects) : [],
            lastFocus: memory.lastFocus || '',
            productivityScore: memory.productivityScore || 80,
            burnoutRisk: memory.burnoutRisk || 10,
            focusHeatmap: [2, 5, 8, 12, 15, 10, 5, 3, 1, 0, 0, 0, 4, 8, 12, 18, 22, 25, 20, 15, 10, 8, 5, 2],
            suggestedActions: memory.suggestedActions ? JSON.parse(memory.suggestedActions) : [],
          },
        });
      }
    } catch {}
  },

  sendMessage: async (content) => {
    set({ isLoading: true });
    try {
      const { aiApi } = await import('../../api/ai');
      const result = await aiApi.sendMessage(content);
      set((state) => ({
        chatHistory: [...state.chatHistory, result.user, result.assistant],
        isLoading: false,
      }));
    } catch {
      set({ isLoading: false });
    }
  },

  updateMemory: async (update) => {
    try {
      const { aiApi } = await import('../../api/ai');
      await aiApi.updateMemory(update);
      set((state) => ({
        aiMemory: { ...state.aiMemory, ...update },
      }));
    } catch {}
  },

  clearChat: async () => {
    try {
      const { aiApi } = await import('../../api/ai');
      await aiApi.clearChat();
      set({ chatHistory: [] });
    } catch {}
  },

  loadSuggestions: async () => {
    try {
      const { aiApi } = await import('../../api/ai');
      const suggestions = await aiApi.getSuggestions();
      set((state) => ({
        aiMemory: { ...state.aiMemory, suggestedActions: suggestions },
      }));
    } catch {}
  },

  addAssistantMessage: (content) => {
    set((state) => ({
      chatHistory: [...state.chatHistory, { id: Math.random().toString(), role: 'assistant', content, timestamp: Date.now() }],
    }));
  },
});
