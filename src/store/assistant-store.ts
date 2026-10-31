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

  // Queue Data & UI filters
  approvals: ApprovalItem[];
  selectedItem: ApprovalItem | null;
  searchQuery: string;
  activeView: 'queue' | 'hierarchy';
  activeTab: 'snapshot' | 'media';
  activeNav: string;

  // Assistant Responses & History
  greeting: GreetingResponse | null;
  summary: SummaryResponse | null;
  messages: ChatMessageItem[];
  teachStep: number;

  // Status flags & features
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  isSpeaking: boolean;
  isHelpModalOpen: boolean;
  notificationCount: number;
  toastMessage: string | null;

  // Actions
  setIsOpen: (open: boolean) => void;
  setIsMinimized: (min: boolean) => void;
  setActiveMode: (mode: AssistantMode) => void;
  setApprovals: (items: ApprovalItem[]) => void;
  setSelectedItem: (item: ApprovalItem | null) => void;
  setSearchQuery: (query: string) => void;
  setActiveView: (view: 'queue' | 'hierarchy') => void;
  setActiveTab: (tab: 'snapshot' | 'media') => void;
  setActiveNav: (nav: string) => void;
  setIsHelpModalOpen: (open: boolean) => void;
  setIsSpeaking: (speaking: boolean) => void;
  showToast: (msg: string) => void;
  clearToast: () => void;

  // Real Queue Operations
  approveItem: (id: string) => void;
  rejectItem: (id: string, reason?: string) => void;

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
  searchQuery: '',
  activeView: 'queue',
  activeTab: 'snapshot',
  activeNav: 'dashboard',

  greeting: null,
  summary: null,
  messages: [],
  teachStep: 1,

  isLoading: false,
  isStreaming: false,
  error: null,
  isSpeaking: false,
  isHelpModalOpen: false,
  notificationCount: 3,
  toastMessage: null,

  setIsOpen: (isOpen) => set({ isOpen }),
  setIsMinimized: (isMinimized) => set({ isMinimized }),
  setActiveMode: (activeMode) => set({ activeMode, error: null }),
  setApprovals: (approvals) => {
    set({ approvals });
    if (!get().selectedItem && approvals.length > 0) {
      set({ selectedItem: approvals[0] });
    }
  },
  setSelectedItem: (selectedItem) => set({ selectedItem }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setActiveView: (activeView) => set({ activeView }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setActiveNav: (activeNav) => set({ activeNav }),
  setIsHelpModalOpen: (isHelpModalOpen) => set({ isHelpModalOpen }),
  setIsSpeaking: (isSpeaking) => set({ isSpeaking }),

  showToast: (msg) => {
    set({ toastMessage: msg });
    setTimeout(() => {
      if (get().toastMessage === msg) {
        set({ toastMessage: null });
      }
    }, 3500);
  },
  clearToast: () => set({ toastMessage: null }),

  approveItem: (id) => {
    set((state) => {
      const updated = state.approvals.map((item) =>
        item.id === id ? { ...item, status: 'Approved' } : item
      );
      const target = state.approvals.find((i) => i.id === id);
      return {
        approvals: updated,
        selectedItem: state.selectedItem?.id === id ? { ...state.selectedItem, status: 'Approved' } : state.selectedItem,
        notificationCount: Math.max(0, state.notificationCount - 1),
      };
    });
    get().showToast('Item approved and synchronized with HMS Digital Twin!');
  },

  rejectItem: (id, reason = 'Compliance check incomplete') => {
    set((state) => {
      const updated = state.approvals.map((item) =>
        item.id === id ? { ...item, status: 'Rejected' } : item
      );
      return {
        approvals: updated,
        selectedItem: state.selectedItem?.id === id ? { ...state.selectedItem, status: 'Rejected' } : state.selectedItem,
      };
    });
    get().showToast(`Item rejected: ${reason}`);
  },

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
