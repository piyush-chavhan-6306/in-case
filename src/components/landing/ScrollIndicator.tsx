import React from 'react';

interface ScrollIndicatorProps {
  progress: number; // 0 to 1
  totalScenes?: number;
  currentSceneId?: number;
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  progress,
  totalScenes = 10,
  currentSceneId = 1,
}) => {
  const percent = Math.min(100, Math.max(0, Math.round(progress * 100)));

  return (
    <aside
      className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center pointer-events-none select-none transition-opacity duration-500"
      aria-hidden="true"
    >
      {/* Top Label */}
      <span className="text-[10px] font-bold uppercase tracking-widest text-amber-100/70 mb-3 drop-shadow">
        Scroll
      </span>

      {/* Vertical Track */}
      <div className="relative w-1.5 h-36 sm:h-48 bg-white/20 backdrop-blur-md rounded-full overflow-hidden shadow-inner">
        {/* Progress Fill */}
        <div
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-amber-200 via-amber-400 to-amber-500 rounded-full transition-all duration-150"
          style={{ height: `${percent}%` }}
        />

        {/* Floating Glowing Dot */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-3.5 h-3.5 -mt-1.5 rounded-full bg-amber-200 border-2 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)] transition-all duration-150"
          style={{ top: `${percent}%` }}
        />
      </div>

      {/* Scene Dots */}
      <div className="flex flex-col items-center space-y-1.5 my-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`w-1 h-1 rounded-full transition-colors duration-300 ${
              progress >= (i + 1) * 0.25 ? 'bg-amber-300' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Subtle Vertical Text */}
      <span
        className="text-[9px] sm:text-[10px] text-amber-100/60 font-medium tracking-wider mt-1 drop-shadow"
        style={{
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
        }}
      >
        A better tomorrow awaits
      </span>
    </aside>
  );
};
