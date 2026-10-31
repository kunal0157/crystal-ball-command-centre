'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { useAssistantStore } from '@/store/assistant-store';
import { StreamingMessage } from './StreamingMessage';

export function ChatPanel() {
  const {
    activeMode,
    setActiveMode,
    messages,
    addMessage,
    updateMessageContent,
    finishStreamingMessage,
    isLoading,
    setLoading,
    isStreaming,
    setIsStreaming,
    error,
    setError,
    sessionId,
    summary,
    teachStep,
    setTeachStep,
  } = useAssistantStore();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // Stream reader utility
  const handleStreamResponse = async (
    url: string,
    body: Record<string, unknown>,
    fallbackPlaceholder = 'Assistant is generating response...'
  ) => {
    setError(null);
    setLoading(true);

    const botMsgId = addMessage({
      role: 'assistant',
      content: '',
      isStreaming: true,
      isFallback: false,
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('ReadableStream not supported');

      const decoder = new TextDecoder();
      let buffer = '';
      setLoading(false);
      setIsStreaming(true);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (dataStr === '[DONE]') {
              break;
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.token) {
                updateMessageContent(botMsgId, parsed.token, parsed.isFallback);
              }
            } catch {
              // Ignore partial JSON chunks
            }
          }
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Connection failed';
      setError(msg);
      updateMessageContent(
        botMsgId,
        '\n\n[Offline Warning]: Connection error or timeout reached. Fallback triggered.',
        true
      );
    } finally {
      finishStreamingMessage(botMsgId);
      setLoading(false);
      setIsStreaming(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isStreaming) return;

    const userText = input.trim();
    setInput('');

    addMessage({
      role: 'user',
      content: userText,
    });

    if (activeMode === 'chat') {
      await handleStreamResponse('/api/assistant/chat', {
        sessionId,
        messages: [{ role: 'user', content: userText }],
      });
    } else if (activeMode === 'help') {
      await handleStreamResponse('/api/assistant/help', {
        sessionId,
        query: userText,
      });
    } else if (activeMode === 'teach') {
      await handleStreamResponse('/api/assistant/teach', {
        sessionId,
        step: teachStep,
        userQuery: userText,
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Sub-Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 bg-gray-50/80">
        <button
          onClick={() => setActiveMode('home')}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Actions</span>
        </button>

        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100">
          {activeMode === 'summary' && 'Queue Summary'}
          {activeMode === 'chat' && 'Talk to Me'}
          {activeMode === 'help' && 'Policy Knowledge (RAG)'}
          {activeMode === 'teach' && `Operator Training (Step ${teachStep}/5)`}
        </span>
      </div>

      {/* Summary View specific rendering */}
      {activeMode === 'summary' && summary && (
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          <div className="p-3 rounded-xl bg-slate-900 text-white shadow-sm">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-indigo-400 font-semibold uppercase tracking-wider">
                Priority Assessment
              </span>
              <span className="text-[10px] text-slate-400">
                {summary.isFallback ? 'Deterministic Fallback' : 'AI Reasoning Verified'}
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {summary.summaryText}
            </p>
          </div>

          <div className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Prioritized Inspection Order
          </div>

          <div className="space-y-2">
            {summary.prioritizedItems.map((item, idx) => (
              <div
                key={item.id}
                className="p-3 rounded-lg border border-gray-200 bg-white hover:border-indigo-200 transition-all text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-900 flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    {item.title}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                      item.urgency === 'high'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {item.urgency}
                  </span>
                </div>
                <div className="text-[11px] text-gray-600 mt-1">
                  <strong>Reason:</strong> {item.urgencyReason}
                </div>
                <div className="text-[11px] text-indigo-700 mt-1 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-indigo-600 shrink-0" />
                  Action: {item.recommendedAction}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teach Me Step Controls */}
      {activeMode === 'teach' && (
        <div className="p-3 border-b border-gray-100 bg-indigo-50/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-900">Training Workflow</span>
            <span className="text-[11px] font-mono text-indigo-600 font-bold">
              Step {teachStep} of 5
            </span>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={async () => {
                  setTeachStep(s);
                  await handleStreamResponse('/api/assistant/teach', {
                    sessionId,
                    step: s,
                  });
                }}
                className={`flex-1 py-1 rounded text-[11px] font-bold transition-all ${
                  teachStep === s
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : s < teachStep
                    ? 'bg-indigo-200 text-indigo-900'
                    : 'bg-white border border-gray-200 text-gray-500'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages list for Chat, Help, Teach */}
      {activeMode !== 'summary' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <Lightbulb className="w-8 h-8 text-amber-400 mb-2" />
              <p className="text-xs font-semibold text-gray-600">
                {activeMode === 'chat' && 'Ask any question about your pending queue.'}
                {activeMode === 'help' && 'Ask compliance or SLA policy questions.'}
                {activeMode === 'teach' && 'Click a step above or ask how to review approvals.'}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5 justify-center">
                {activeMode === 'chat' && (
                  <button
                    onClick={() => {
                      setInput('Which of these items needs my attention first and why?');
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    &ldquo;Which of these needs my attention first?&rdquo;
                  </button>
                )}
                {activeMode === 'help' && (
                  <button
                    onClick={() => {
                      setInput('What is the SLA deadline for high urgency items?');
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    &ldquo;What is the SLA for high urgency items?&rdquo;
                  </button>
                )}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <StreamingMessage key={msg.id} message={msg} />
          ))}

          {isLoading && !isStreaming && (
            <div className="flex items-center gap-2 text-xs text-indigo-600 p-3 bg-indigo-50/50 rounded-lg animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing queue and retrieving context...</span>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <span className="font-bold">Error:</span> {error}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input box for non-summary modes */}
      {activeMode !== 'summary' && (
        <form
          onSubmit={handleSendMessage}
          className="p-3 border-t border-gray-100 bg-white flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              activeMode === 'chat'
                ? 'Ask about approvals queue...'
                : activeMode === 'help'
                ? 'Search operational policy...'
                : 'Ask a question about this step...'
            }
            disabled={isLoading || isStreaming}
            className="flex-1 text-xs px-3 py-2 rounded-lg border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || isStreaming}
            className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      )}
    </div>
  );
}
