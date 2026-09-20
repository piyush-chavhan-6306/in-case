import React, { useState, useEffect } from 'react';
import { Play, ArrowRight, Lightbulb } from 'lucide-react';
import { SceneConfig, BubblePosition } from '../../config/scenes';
import { SceneIcon } from './SceneIcon';

interface StoryBubbleProps {
  scene: SceneConfig;
  onAction?: (action: string) => void;
  mousePos?: { x: number; y: number }; // normalized -1..1 for subtle 3D tilt
}

export const StoryBubble: React.FC<StoryBubbleProps> = ({ scene, onAction, mousePos = { x: 0, y: 0 } }) => {
  // Compute negative space position classes
  const getPositionClasses = (pos: BubblePosition): string => {
    switch (pos) {
      case 'top-left':
        return 'top-24 sm:top-32 lg:top-36 left-4 sm:left-10 lg:left-16 items-start';
      case 'left-center':
        return 'top-1/2 -translate-y-1/2 left-4 sm:left-10 lg:left-16 items-start';
      case 'right-center':
        return 'top-1/2 -translate-y-1/2 right-4 sm:right-10 lg:right-16 items-end';
      case 'bottom-left':
        return 'bottom-12 sm:bottom-16 lg:bottom-20 left-4 sm:left-10 lg:left-16 items-start';
      case 'top-center':
      default:
        return 'top-20 sm:top-28 left-1/2 -translate-x-1/2 items-center';
    }
  };

  // Subtle 3D perspective tilt
  const tiltX = mousePos.y * -4;
  const tiltY = mousePos.x * 4;

  const handleCtaClick = () => {
    if (scene.ctaAction && onAction) {
      onAction(scene.ctaAction);
    }
  };

  return (
    <div
      className={`absolute z-30 transition-all duration-700 ease-out pointer-events-none flex flex-col ${getPositionClasses(
        scene.bubblePosition
      )}`}
      style={{
        transform: `translate(${scene.bubbleOffsetX || 0}px, ${scene.bubbleOffsetY || 0}px)`,
      }}
    >
      <div
        className={`story-bubble p-6 sm:p-7 lg:p-8 ${scene.bubbleWidth || 'max-w-lg lg:max-w-xl'} shadow-2xl pointer-events-auto select-none`}
        style={{
          transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scene.bubbleScale || 1})`,
          transformOrigin:
            scene.bubbleAlignment === 'right'
              ? 'bottom right'
              : scene.bubbleAlignment === 'center'
              ? 'center center'
              : 'bottom left',
          transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.4, 1), all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Subtle Organic Nature / Leaf Accent in top-right corner */}
        <div className="absolute -top-3 -right-2 pointer-events-none filter drop-shadow-sm opacity-90 transition-transform duration-500 hover:rotate-6">
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M17 3C17 3 27 7 29 19C31 31 19 31 15 29C11 27 7 21 7 13C7 5 17 3 17 3Z"
              fill="#65a30d"
              fillOpacity="0.85"
            />
            <path
              d="M17 3C17 11 20 19 29 23"
              stroke="#bef264"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Top Scene Badge & Dynamic 3D Icon */}
        <div className="flex items-center space-x-3 mb-3.5">
          <SceneIcon iconKey={scene.icon} />
          <div>
            <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-stone-700/90 font-mono">
              {scene.badge}
            </span>
          </div>
        </div>

        {/* Narrative Title: Friendly, warm, cinematic typography */}
        {scene.id === 1 ? (
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-[34px] text-stone-900 tracking-tight leading-[1.2] mb-3 transition-colors duration-300">
            {scene.title}
          </h1>
        ) : (
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-[34px] text-stone-900 tracking-tight leading-[1.2] mb-3 transition-colors duration-300">
            {scene.title}
          </h2>
        )}

        {/* Narrative Subtitle: Warm human explanation */}
        <p className="text-stone-700 text-sm sm:text-[15px] lg:text-base leading-relaxed mb-6 font-medium">
          {scene.subtitle}
        </p>

        {/* Interactive Bottom Row: CTA Button + Supporting Question */}
        <div className="pt-4 border-t border-stone-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {scene.ctaText ? (
            <button
              onClick={handleCtaClick}
              className="inline-flex items-center space-x-2.5 px-5 py-2.5 rounded-full bg-[#fdf8ee] hover:bg-[#fffdf7] text-stone-900 text-xs sm:text-sm font-bold shadow-md shadow-stone-900/10 border border-white/60 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] group"
            >
              <div className="w-5 h-5 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-inner group-hover:bg-amber-600 transition">
                {scene.ctaAction === 'play' ? (
                  <Play className="w-2.5 h-2.5 fill-white ml-0.5" />
                ) : (
                  <ArrowRight className="w-2.5 h-2.5" />
                )}
              </div>
              <span>{scene.ctaText}</span>
            </button>
          ) : (
            <div className="hidden sm:block" />
          )}

          {/* Supporting Question */}
          {scene.question && (
            <div className="flex items-center space-x-2 text-xs sm:text-[13px] text-stone-700 font-medium max-w-xs">
              <span className="text-amber-600 text-sm flex-shrink-0">
                <Lightbulb className="w-4 h-4 text-amber-600" />
              </span>
              <span className="leading-snug italic">{scene.question}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
