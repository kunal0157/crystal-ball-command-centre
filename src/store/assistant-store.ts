import { create } from 'zustand';
import { ApprovalItem, SummaryResponse, GreetingResponse } from '@/lib/schemas';

export type AssistantMode = 'home' | 'summary' | 'chat' | 'help' | 'teach';

export interface ChatMessageItem {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isStreaming?: boolean;
  isFallback?: boolean;
}

interface AssistantState {
  // Widget Visibility & Mode
  isOpen: boolean;
  isMinimized: boolean;
  activeMode: AssistantMode;
  sessionId: string;

  // Queue Data
  approvals: ApprovalItem[];
  selectedItem: ApprovalItem | null;

  // Assistant Responses & History
  greeting: GreetingResponse | null;
  summary: SummaryResponse | null;
  messages: ChatMessageItem[];
  teachStep: number;

  // Status flags
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;

  // Actions
  setIsOpen: (open: boolean) => void;
  setIsMinimized: (min: boolean) => void;
  setActiveMode: (mode: AssistantMode) => void;
  setApprovals: (items: ApprovalItem[]) => void;
  setSelectedItem: (item: ApprovalItem | null) => void;
  setGreeting: (greeting: GreetingResponse | null) => void;
  setSummary: (summary: SummaryResponse | null) => void;
  addMessage: (msg: Omit<ChatMessageItem, 'id' | 'timestamp'>) => string;
  updateMessageContent: (id: string, appendContent: string, isFallback?: boolean) => void;
  finishStreamingMessage: (id: string) => void;
  clearMessages: () => void;
  setTeachStep: (step: number) => void;
  setLoading: (loading: boolean) => void;
  setIsStreaming: (streaming: boolean) => void;
  setError: (err: string | null) => void;
  resetSession: () => void;
}

export const useAssistantStore = create<AssistantState>((set, get) => ({
  isOpen: true,
  isMinimized: false,
  activeMode: 'home',
  sessionId: 'session-' + Math.random().toString(36).substring(2, 9),

  approvals: [],
  selectedItem: null,

  greeting: null,
  summary: null,
  messages: [],
  teachStep: 1,

  isLoading: false,
  isStreaming: false,
  error: null,

  setIsOpen: (isOpen) => set({ isOpen }),
  setIsMinimized: (isMinimized) => set({ isMinimized }),
  setActiveMode: (activeMode) => set({ activeMode, error: null }),
  setApprovals: (approvals) => set({ approvals }),
  setSelectedItem: (selectedItem) => set({ selectedItem }),
  setGreeting: (greeting) => set({ greeting }),
  setSummary: (summary) => set({ summary }),

  addMessage: (msg) => {
    const id = 'msg-' + Math.random().toString(36).substring(2, 9);
    const newMsg: ChatMessageItem = {
      ...msg,
      id,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    set((state) => ({ messages: [...state.messages, newMsg] }));
    return id;
  },

  updateMessageContent: (id, appendContent, isFallback) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.id === id
          ? {
              ...m,
              content: m.content + appendContent,
              isFallback: isFallback !== undefined ? isFallback : m.isFallback,
            }
          : m
      ),
    }));
  },

  finishStreamingMessage: (id) => {
    set((state) => ({
      messages: state.messages.map((m) => (m.id === id ? { ...m, isStreaming: false } : m)),
      isStreaming: false,
    }));
  },

  clearMessages: () => set({ messages: [] }),
  setTeachStep: (teachStep) => set({ teachStep }),
  setLoading: (isLoading) => set({ isLoading }),
  setIsStreaming: (isStreaming) => set({ isStreaming }),
  setError: (error) => set({ error }),

  resetSession: () =>
    set({
      sessionId: 'session-' + Math.random().toString(36).substring(2, 9),
      messages: [],
      summary: null,
      error: null,
      activeMode: 'home',
    }),
}));
