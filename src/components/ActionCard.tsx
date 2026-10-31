'use client';

import React from 'react';

export function PresentSummaryIllustration() {
  return (
    <svg viewBox="0 0 120 120" className="w-20 h-20" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background soft glow */}
      <circle cx="60" cy="60" r="50" fill="#FEF3C7" />
      {/* Body / Clothes */}
      <path d="M40 98C40 82 48 76 60 76C72 76 80 82 80 98" fill="#F59E0B" />
      {/* Head & Neck */}
      <rect x="56" y="65" width="8" height="12" rx="4" fill="#FCD34D" />
      <circle cx="60" cy="52" r="16" fill="#FDE68A" />
      {/* Dark Hair */}
      <path d="M44 48C44 38 52 34 60 34C68 34 76 38 76 48C76 54 74 58 72 58C70 48 50 48 48 58C46 58 44 54 44 48Z" fill="#1F2937" />
      {/* Face features */}
      <circle cx="55" cy="52" r="1.5" fill="#374151" />
      <circle cx="65" cy="52" r="1.5" fill="#374151" />
      <path d="M57 58Q60 61 63 58" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
      {/* Document she is presenting */}
      <g transform="rotate(-8 82 58)">
        <rect x="70" y="42" width="28" height="36" rx="4" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1.5" />
        <rect x="75" y="48" width="18" height="3" rx="1.5" fill="#818CF8" />
        <rect x="75" y="54" width="14" height="2" rx="1" fill="#D1D5DB" />
        <rect x="75" y="59" width="16" height="2" rx="1" fill="#D1D5DB" />
        <rect x="75" y="64" width="10" height="2" rx="1" fill="#F59E0B" />
      </g>
      {/* Sparkles */}
      <circle cx="28" cy="38" r="3" fill="#FBBF24" />
      <circle cx="96" cy="32" r="2" fill="#6366F1" />
    </svg>
  );
}

export function TalkToMeIllustration() {
  return (
    <svg viewBox="0 0 120 120" className="w-20 h-20" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background glow */}
      <circle cx="60" cy="60" r="50" fill="#E0E7FF" />
      {/* Body */}
      <path d="M42 98C42 84 50 78 60 78C70 78 78 84 78 98" fill="#6366F1" />
      {/* Neck & Head */}
      <rect x="56" y="67" width="8" height="12" rx="4" fill="#FCD34D" />
      <circle cx="60" cy="54" r="16" fill="#FDE68A" />
      {/* Hair */}
      <path d="M44 50C44 38 52 36 60 36C68 36 76 38 76 50C74 46 68 44 60 44C52 44 46 46 44 50Z" fill="#374151" />
      {/* Face features */}
      <circle cx="56" cy="54" r="1.5" fill="#374151" />
      <circle cx="64" cy="54" r="1.5" fill="#374151" />
      <path d="M57 60Q60 63 63 60" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" />
      {/* Microphone / Sound waves */}
      <rect x="76" y="52" width="6" height="12" rx="3" fill="#4B5563" />
      <path d="M74 58C74 63 84 63 84 58" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="79" y1="64" x2="79" y2="70" stroke="#4B5563" strokeWidth="1.5" />
      {/* Speech Audio waves */}
      <path d="M88 52C90 55 90 61 88 64" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
      <path d="M94 48C97 53 97 63 94 68" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function HelpMeIllustration() {
  return (
    <svg viewBox="0 0 120 120" className="w-20 h-20" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background glow */}
      <circle cx="60" cy="60" r="50" fill="#FEF08A" fillOpacity="0.5" />
      {/* Sitting desk surface */}
      <rect x="25" y="90" width="70" height="4" rx="2" fill="#E5E7EB" />
      {/* Body */}
      <path d="M44 90C44 78 51 74 60 74C69 74 76 78 76 90" fill="#EAB308" />
      {/* Arm bent touching chin */}
      <path d="M68 84L75 66L68 62" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      {/* Head & Neck */}
      <circle cx="60" cy="50" r="15" fill="#FDE68A" />
      {/* Hair */}
      <path d="M45 48C45 36 53 34 60 34C67 34 75 36 75 48C72 45 66 43 60 43C54 43 48 45 45 48Z" fill="#92400E" />
      {/* Thinking facial expression */}
      <circle cx="56" cy="50" r="1.5" fill="#374151" />
      <circle cx="64" cy="49" r="1.5" fill="#374151" />
      <path d="M58 56Q61 55 64 57" stroke="#B45309" strokeWidth="1.5" strokeLinecap="round" />
      {/* Big Question Mark */}
      <path d="M86 34C86 28 94 28 94 34C94 38 89 40 89 44" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
      <circle cx="89" cy="51" r="2" fill="#F59E0B" />
    </svg>
  );
}

export function TeachMeIllustration() {
  return (
    <svg viewBox="0 0 120 120" className="w-20 h-20" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background glow */}
      <circle cx="60" cy="60" r="50" fill="#DCFCE7" />
      {/* Mentor (Left) */}
      <path d="M30 98C30 84 38 80 48 80C56 80 62 84 64 98" fill="#059669" />
      <circle cx="46" cy="58" r="13" fill="#FDE68A" />
      <path d="M33 54C33 46 40 44 46 44C52 44 59 46 59 54C56 50 51 49 46 49C41 49 36 50 33 54Z" fill="#1F2937" />
      {/* Student (Right) */}
      <path d="M60 98C60 86 68 82 76 82C84 82 90 86 92 98" fill="#F97316" />
      <circle cx="76" cy="62" r="12" fill="#FDE68A" />
      {/* Graduation Cap on Student */}
      <polygon points="76,40 92,46 76,52 60,46" fill="#1E293B" />
      <rect x="74" y="50" width="4" height="4" fill="#1E293B" />
      <path d="M88 47L88 56" stroke="#EAB308" strokeWidth="1.5" />
      {/* Joint book/screen */}
      <rect x="50" y="80" width="22" height="15" rx="2" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
      <line x1="54" y1="85" x2="68" y2="85" stroke="#10B981" strokeWidth="1.5" />
      <line x1="54" y1="89" x2="64" y2="89" stroke="#94A3B8" strokeWidth="1" />
    </svg>
  );
}

interface ActionCardProps {
  title: string;
  type: 'summary' | 'chat' | 'help' | 'teach';
  badge?: string;
  onClick: () => void;
  disabled?: boolean;
}

export function ActionCard({ title, type, badge, onClick, disabled }: ActionCardProps) {
  const renderIllustration = () => {
    switch (type) {
      case 'summary':
        return <PresentSummaryIllustration />;
      case 'chat':
        return <TalkToMeIllustration />;
      case 'help':
        return <HelpMeIllustration />;
      case 'teach':
        return <TeachMeIllustration />;
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="group relative flex flex-col items-center justify-between p-3.5 rounded-2xl border border-gray-200/80 bg-white hover:border-indigo-400 hover:shadow-md transition-all duration-200 text-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {badge && (
        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider bg-rose-500 text-white shadow-xs">
          {badge}
        </span>
      )}

      <div className="w-full flex items-center justify-center my-1 transition-transform group-hover:scale-105 duration-200">
        {renderIllustration()}
      </div>

      <div className="w-full mt-2">
        <h4 className="text-xs font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
          {title}
        </h4>
      </div>
    </button>
  );
}
