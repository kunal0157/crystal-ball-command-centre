'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActionCardProps {
  title: string;
  icon: LucideIcon;
  badge?: string;
  description: string;
  colorScheme: 'amber' | 'blue' | 'indigo' | 'emerald';
  onClick: () => void;
  disabled?: boolean;
}

export function ActionCard({
  title,
  icon: Icon,
  badge,
  description,
  colorScheme,
  onClick,
  disabled,
}: ActionCardProps) {
  const colorStyles = {
    amber: {
      border: 'border-amber-200 hover:border-amber-300',
      bg: 'hover:bg-amber-50/50',
      iconBg: 'bg-amber-100 text-amber-700',
      ring: 'focus:ring-amber-400',
    },
    blue: {
      border: 'border-blue-200 hover:border-blue-300',
      bg: 'hover:bg-blue-50/50',
      iconBg: 'bg-blue-100 text-blue-700',
      ring: 'focus:ring-blue-400',
    },
    indigo: {
      border: 'border-indigo-200 hover:border-indigo-300',
      bg: 'hover:bg-indigo-50/50',
      iconBg: 'bg-indigo-100 text-indigo-700',
      ring: 'focus:ring-indigo-400',
    },
    emerald: {
      border: 'border-emerald-200 hover:border-emerald-300',
      bg: 'hover:bg-emerald-50/50',
      iconBg: 'bg-emerald-100 text-emerald-700',
      ring: 'focus:ring-emerald-400',
    },
  }[colorScheme];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative flex flex-col items-center justify-between p-4 rounded-2xl border bg-white shadow-xs transition-all duration-200 text-center ${colorStyles.border} ${colorStyles.bg} ${colorStyles.ring} focus:outline-hidden focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {badge && (
        <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white shadow-xs">
          {badge}
        </span>
      )}

      <div className={`p-3.5 rounded-2xl ${colorStyles.iconBg} mb-3 transition-transform group-hover:scale-105 duration-200 shadow-inner`}>
        <Icon className="w-6 h-6" />
      </div>

      <div className="w-full">
        <h4 className="text-xs font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
          {title}
        </h4>
        <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>
    </button>
  );
}
