import React from 'react';
import { ArrowRight } from 'lucide-react';

interface StoryFooterPillProps {
  show: boolean;
}

export const StoryFooterPill: React.FC<StoryFooterPillProps> = ({ show }) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-6 sm:bottom-8 left-4 sm:left-10 z-30 pointer-events-none select-none animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center space-x-3 p-1.5 pr-4 rounded-full bg-black/35 backdrop-blur-xl border border-white/25 shadow-xl">
        {/* Character Avatar: Friendly smiling character */}
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-amber-200/50 shadow-inner bg-amber-100 flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full object-cover">
            <circle cx="50" cy="50" r="50" fill="#fde68a" />
            <circle cx="50" cy="42" r="22" fill="#d97706" />
            <circle cx="50" cy="45" r="18" fill="#fed7aa" />
            {/* Eyes */}
            <circle cx="43" cy="43" r="2.5" fill="#451a03" />
            <circle cx="57" cy="43" r="2.5" fill="#451a03" />
            {/* Warm Smile */}
            <path d="M44 51 Q50 56 56 51" stroke="#451a03" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Hair */}
            <path d="M30 40 Q50 20 70 40 Q65 24 50 24 Q35 24 30 40 Z" fill="#78350f" />
            {/* Body */}
            <ellipse cx="50" cy="85" rx="30" ry="20" fill="#0284c7" />
          </svg>
        </div>

        {/* Text Prompt */}
        <div className="flex flex-col text-left">
          <span className="text-xs sm:text-[13px] font-semibold text-amber-100 drop-shadow">
            Every story matters.
          </span>
          <span className="text-[10px] sm:text-[11px] text-stone-300 font-medium">
            Scroll to continue
          </span>
        </div>

        {/* Subtle Arrow */}
        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-amber-200 ml-1">
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
