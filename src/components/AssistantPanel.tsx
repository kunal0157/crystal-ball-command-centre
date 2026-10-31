'use client';

import React, { useEffect } from 'react';
import {
  Sparkles,
  RotateCcw,
  X,
  Minimize2,
  Maximize2,
  Info,
  Layers,
  MessageSquare,
  HelpCircle,
  GraduationCap,
  ExternalLink,
  Bot,
} from 'lucide-react';
import { useAssistantStore } from '@/store/assistant-store';
import { ActionCard } from './ActionCard';
import { ChatPanel } from './ChatPanel';

export function AssistantPanel() {
  const {
    isOpen,
    setIsOpen,
    isMinimized,
    setIsMinimized,
    activeMode,
    setActiveMode,
    greeting,
    setGreeting,
    setSummary,
    setLoading,
    setError,
    clearMessages,
    sessionId,
  } = useAssistantStore();

  // Load context-aware greeting on mount
  useEffect(() => {
    fetchGreeting();
  }, []);

  const fetchGreeting = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/assistant/greeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, operatorName: 'Operator' }),
      });
      if (res.ok) {
        const data = await res.json();
        setGreeting(data);
      }
    } catch (_err) {
      // fallback handled gracefully
    } finally {
      setLoading(false);
    }
  };

  const handlePresentSummary = async () => {
    setActiveMode('summary');
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/assistant/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      if (res.ok) {
        const data = await res.json();
        setSummary(data);
      } else {
        throw new Error('Failed to fetch summary');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Summary error');
    } finally {
      setLoading(false);
    }
  };

  const handleTalkToMe = () => {
    clearMessages();
    setActiveMode('chat');
  };

  const handleHelpMe = () => {
    clearMessages();
    setActiveMode('help');
  };

  const handleTeachMe = () => {
    clearMessages();
    setActiveMode('teach');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 rounded-full bg-slate-900 text-white shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-2.5 z-50 group border border-slate-700"
      >
        <div className="p-2 rounded-full bg-indigo-600 text-white">
          <Bot className="w-5 h-5" />
        </div>
        <span className="text-xs font-bold tracking-wide pr-1">Approvals Assistant</span>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] rounded-2xl border border-slate-800 bg-white shadow-2xl overflow-hidden flex flex-col z-50 transition-all duration-200 ${
        isMinimized ? 'h-14' : 'h-[580px]'
      }`}
    >
      {/* Reference Card Dark Header */}
      <div className="bg-slate-900 px-4 py-3 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-tight flex items-center gap-2">
              Approvals
              <Info className="w-3.5 h-3.5 text-slate-400 hover:text-white cursor-pointer" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded hover:text-white hover:bg-slate-800 transition-colors"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded hover:text-white hover:bg-slate-800 transition-colors"
            title="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50">
          {/* Sub Navigation Bar matching screenshot */}
          <div className="px-4 py-2 border-b border-gray-100 bg-white flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-gray-700">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>Approvals</span>
            </div>

            <button
              onClick={fetchGreeting}
              className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-indigo-600 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Replay Greeting
            </button>
          </div>

          {/* Mode Switch: Home (4 Cards) vs Dynamic Chat/Summary */}
          {activeMode === 'home' ? (
            <div className="flex-1 flex flex-col p-4 justify-between overflow-y-auto">
              {/* Context-Aware Greeting Banner */}
              {greeting && (
                <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-100 text-indigo-950 text-xs mb-3 shadow-xs">
                  <div className="flex items-center justify-between font-bold text-[11px] uppercase tracking-wider text-indigo-600 mb-1">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Live Assistant Greeting
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">
                      {greeting.isFallback ? 'Fallback' : 'Model Verified'}
                    </span>
                  </div>
                  <p className="leading-relaxed">{greeting.greeting}</p>
                </div>
              )}

              {/* 4 Action Cards matching reference screenshot */}
              <div className="grid grid-cols-2 gap-3 flex-1 items-stretch">
                <ActionCard
                  title="Present me Summary"
                  icon={Layers}
                  badge="Urgency"
                  colorScheme="amber"
                  description="Summarizes pending approvals prioritized by urgency."
                  onClick={handlePresentSummary}
                />
                <ActionCard
                  title="Talk to me"
                  icon={MessageSquare}
                  colorScheme="blue"
                  description="Free-form multi-turn conversation about the queue."
                  onClick={handleTalkToMe}
                />
                <ActionCard
                  title="Help me"
                  icon={HelpCircle}
                  colorScheme="indigo"
                  description="RAG-grounded answers on operational policy."
                  onClick={handleHelpMe}
                />
                <ActionCard
                  title="Teach me"
                  icon={GraduationCap}
                  colorScheme="emerald"
                  description="Adaptive, step-by-step operator training workflow."
                  onClick={handleTeachMe}
                />
              </div>

              {/* Bottom HMS Reference Footer */}
              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                <span>26 folders / items</span>
                <span className="flex items-center gap-1 font-semibold text-gray-600 hover:text-indigo-600 cursor-pointer">
                  HMS Panel <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ) : (
            <ChatPanel />
          )}
        </div>
      )}
    </div>
  );
}
