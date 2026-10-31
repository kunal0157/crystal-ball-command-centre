'use client';

import React from 'react';
import { Bot, User, Sparkles, AlertCircle } from 'lucide-react';
import { ChatMessageItem } from '@/store/assistant-store';

interface StreamingMessageProps {
  message: ChatMessageItem;
}

export function StreamingMessage({ message }: StreamingMessageProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
        isAssistant ? 'bg-slate-50 border border-slate-200/70 text-slate-800' : 'bg-indigo-50/70 border border-indigo-100 text-indigo-950 ml-6'
      }`}
    >
      <div
        className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
          isAssistant
            ? message.isFallback
              ? 'bg-amber-100 text-amber-700'
              : 'bg-indigo-600 text-white'
            : 'bg-indigo-200 text-indigo-800'
        }`}
      >
        {isAssistant ? (
          message.isFallback ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )
        ) : (
          <User className="w-4 h-4" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-gray-900">
              {isAssistant ? 'Approvals AI Co-pilot' : 'Operator'}
            </span>
            {isAssistant && message.isFallback && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-200/80 text-amber-900">
                Offline Rule Fallback
              </span>
            )}
            {isAssistant && !message.isFallback && (
              <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" /> Live Model
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono text-gray-400">{message.timestamp}</span>
        </div>

        <div className="text-xs leading-relaxed whitespace-pre-wrap font-sans text-gray-700">
          {message.content}
          {message.isStreaming && (
            <span className="inline-block w-1.5 h-3.5 ml-1 bg-indigo-600 animate-pulse align-middle" />
          )}
        </div>
      </div>
    </div>
  );
}
