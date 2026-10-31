'use client';

import React, { useEffect, useState } from 'react';
import {
  RotateCcw,
  X,
  Minimize2,
  Maximize2,
  Info,
  Layers,
  ExternalLink,
  Bot,
  Sparkles,
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
    showToast,
  } = useAssistantStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Load context-aware dynamic greeting on initial mount
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
      // Handled gracefully by fallback
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
        className="fixed bottom-6 right-6 p-3.5 rounded-full bg-slate-900 text-white shadow-2xl hover:bg-slate-800 transition-all flex items-center gap-3 z-50 group border border-slate-700 cursor-pointer"
      >
        <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-slate-900 font-bold text-sm shadow-xs">
          🤖
        </div>
        <span className="text-xs font-bold tracking-wide pr-1">Approvals Assistant</span>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-5 right-5 rounded-2xl border border-slate-800 bg-white shadow-2xl overflow-hidden flex flex-col z-50 transition-all duration-200 ${
        isMinimized
          ? 'h-13 w-80'
          : isExpanded
          ? 'w-[480px] h-[680px] max-w-[calc(100vw-2.5rem)] max-h-[calc(100vh-2.5rem)]'
          : 'w-[370px] h-[550px] max-w-[calc(100vw-2.5rem)]'
      }`}
    >
      {/* Top Header matching reference screenshot */}
      <div className="bg-[#0B1528] px-4 py-2.5 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center text-slate-900 text-sm shadow-xs">
            🤖
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold tracking-tight">Approvals</span>
            <button
              onClick={() => setShowInfoModal(!showInfoModal)}
              className="p-0.5 rounded text-slate-400 hover:text-white cursor-pointer"
              title="Assistant Information"
            >
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isExpanded ? 'Restore size' : 'Expand window'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 rounded hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info Popover Modal */}
      {showInfoModal && (
        <div className="absolute top-12 left-4 right-4 bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl p-3.5 z-40 shadow-xl space-y-1.5">
          <div className="flex items-center justify-between font-bold text-white">
            <span>OomniEye Digital Twin Assistant</span>
            <button onClick={() => setShowInfoModal(false)} className="text-slate-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Co-pilot for facility managers reviewing spatial assets, OSHA checklists, and drone telemetry before synchronizing changes with the HMS system.
          </p>
        </div>
      )}

      {!isMinimized && (
        <div className="flex-1 flex flex-col min-h-0 bg-slate-50/50">
          {/* Sub Navigation Bar matching screenshot */}
          <div className="px-4 py-2 border-b border-gray-100 bg-white flex items-center justify-between text-xs">
            <button
              onClick={() => setActiveMode('home')}
              className={`flex items-center gap-1.5 font-bold transition-colors cursor-pointer ${
                activeMode === 'home' ? 'text-indigo-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Approvals</span>
            </button>

            <button
              onClick={fetchGreeting}
              className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer"
              title="Regenerate context-aware greeting"
            >
              <RotateCcw className="w-3 h-3" />
              Replay Greeting
            </button>
          </div>

          {/* Mode Switch: Home (4 Action Cards) vs Dynamic Sub-Views */}
          {activeMode === 'home' ? (
            <div className="flex-1 flex flex-col p-4 justify-between overflow-y-auto">
              {/* Context-Aware Dynamic Greeting Banner */}
              {greeting && (
                <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-100 text-indigo-950 text-xs mb-3 shadow-2xs">
                  <div className="flex items-center justify-between font-bold text-[10px] uppercase tracking-wider text-indigo-700 mb-1">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-600" /> Active Queue Greeting
                    </span>
                    <span className="font-mono text-gray-500">
                      {greeting.isFallback ? 'Fallback Engine' : 'Live LLM'}
                    </span>
                  </div>
                  <p className="leading-relaxed font-medium">{greeting.greeting}</p>
                </div>
              )}

              {/* 4 Action Cards matching reference screenshot */}
              <div className="grid grid-cols-2 gap-3 flex-1 items-stretch">
                <ActionCard
                  title="Present me Summary"
                  type="summary"
                  badge="Urgency"
                  onClick={handlePresentSummary}
                />
                <ActionCard
                  title="Talk to me"
                  type="chat"
                  onClick={handleTalkToMe}
                />
                <ActionCard
                  title="Help me"
                  type="help"
                  onClick={handleHelpMe}
                />
                <ActionCard
                  title="Teach me"
                  type="teach"
                  onClick={handleTeachMe}
                />
              </div>

              {/* Bottom Reference Footer matching screenshot */}
              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
                <span>26 folders / items</span>
                <button
                  onClick={() => showToast('HMS Panel is connected and live.')}
                  className="flex items-center gap-1 font-semibold text-gray-600 hover:text-indigo-600 cursor-pointer"
                >
                  HMS Panel <ExternalLink className="w-3 h-3" />
                </button>
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
