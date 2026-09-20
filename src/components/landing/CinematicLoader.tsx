import React, { useEffect, useState, useRef } from 'react';
import { getFramePath } from '../../config/cinematicConfig';

interface CinematicLoaderProps {
  onLoaded: () => void;
  minDurationMs?: number;
}

const CRITICAL_FRAMES_TO_PRELOAD = 18;

export const CinematicLoader: React.FC<CinematicLoaderProps> = ({
  onLoaded,
  minDurationMs = 1800,
}) => {
  const [progress, setProgress] = useState(0);
  const [isAssetsReady, setIsAssetsReady] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isLogoSettled, setIsLogoSettled] = useState(false);
  const [hasFailsafeTriggered, setHasFailsafeTriggered] = useState(false);

  const startTimeRef = useRef(Date.now());
  const loadedCountRef = useRef(0);

  // Logo settled state after entrance
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLogoSettled(true);
    }, 950);
    return () => clearTimeout(timer);
  }, []);

  // Preload critical assets: Logo, Frame 1, and initial scene frames
  useEffect(() => {
    let isCancelled = false;
    const totalAssets = 1 + CRITICAL_FRAMES_TO_PRELOAD; // logo + frames

    const updateItemLoaded = () => {
      if (isCancelled) return;
      loadedCountRef.current += 1;
      const pct = Math.min(100, Math.round((loadedCountRef.current / totalAssets) * 100));
      setProgress(pct);

      if (loadedCountRef.current >= totalAssets) {
        handleAllReady();
      }
    };

    const handleAllReady = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const remainingTime = Math.max(0, minDurationMs - elapsed);

      setTimeout(() => {
        if (!isCancelled) {
          setIsAssetsReady(true);
        }
      }, remainingTime);
    };

    // 1. Preload Logo
    const logoImg = new Image();
    logoImg.src = '/logo.png';
    logoImg.onload = updateItemLoaded;
    logoImg.onerror = updateItemLoaded;

    // 2. Preload first batch of frames
    for (let i = 0; i < CRITICAL_FRAMES_TO_PRELOAD; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = updateItemLoaded;
      img.onerror = updateItemLoaded;
    }

    // 3. Failsafe timeout (3.5s max wait so user is never trapped)
    const failsafe = setTimeout(() => {
      if (!isCancelled && !isAssetsReady) {
        setHasFailsafeTriggered(true);
        setIsAssetsReady(true);
      }
    }, 3500);

    return () => {
      isCancelled = true;
      clearTimeout(failsafe);
    };
  }, [minDurationMs]);

  // Handle cinematic exit transition
  useEffect(() => {
    if (!isAssetsReady) return;

    // Step 1: Start exit fade
    setIsExiting(true);

    // Step 2: Allow transition to unblur and fade overlay (1000ms)
    const timer = setTimeout(() => {
      onLoaded();
    }, 1100);

    return () => clearTimeout(timer);
  }, [isAssetsReady, onLoaded]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-1000 ease-out select-none ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-live="polite"
      aria-busy={!isAssetsReady}
    >
      {/* 1. Cinematic Blurred First Frame Background */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={getFramePath(0)}
          alt=""
          onError={(e) => {
            // If frame path is 404 on deployment, gracefully fall back to high-res Pixar scene
            const target = e.currentTarget;
            if (!target.src.includes('reality_desk_bg.png')) {
              target.src = '/reality_desk_bg.png';
            }
          }}
          className={`w-full h-full object-cover transform transition-all duration-1000 ease-out ${
            isExiting
              ? 'blur-0 scale-100 brightness-100'
              : 'blur-md scale-[1.03] brightness-[0.55]'
          }`}
        />
        {/* Soft Vignette Overlay */}
        <div
          className={`absolute inset-0 bg-radial from-black/20 via-black/45 to-navy-950/80 transition-opacity duration-1000 ${
            isExiting ? 'opacity-0' : 'opacity-100'
          }`}
        />
      </div>

      {/* 2. Center Content: Logo, Tagline, Cinematic Progress */}
      <div
        className={`relative z-10 flex flex-col items-center text-center px-6 transition-all duration-500 ease-out ${
          isExiting ? 'opacity-0 scale-98 -translate-y-2' : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        {/* Exact Official IN CASE Logo */}
        <div
          className={`mb-4 transform transition-all ${
            !isLogoSettled ? 'animate-logo-loader-entrance' : 'animate-logo-loader-idle'
          }`}
        >
          <img
            src="/logo.png"
            alt="IN CASE"
            className="h-10 sm:h-12 md:h-14 w-auto object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.65)]"
          />
        </div>

        {/* Cinematic Tagline: Soft warm-white/ivory tone */}
        <p className="animate-tagline-reveal font-display font-medium text-sm sm:text-base text-amber-100/90 tracking-normal mb-8 drop-shadow">
          Prepared today. Brighter tomorrows.
        </p>

        {/* Minimal Cinematic Progress Indicator (thin line with illuminated dot) */}
        <div className="w-48 sm:w-56 flex flex-col items-center">
          <div className="relative w-full h-[2px] bg-white/15 rounded-full overflow-visible">
            {/* Progress track fill */}
            <div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-200 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />

            {/* Glowing illuminated amber pearl dot */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-amber-200 border border-white/60 shadow-[0_0_10px_rgba(245,158,11,0.85)] transition-all duration-300 ease-out"
              style={{ left: `calc(${progress}% - 5px)` }}
            />
          </div>

          {/* Understated Loading Copy */}
          <span className="text-[11px] sm:text-xs text-stone-300/80 font-medium tracking-wide mt-4">
            Preparing your story...
          </span>
        </div>

        {/* Failsafe fallback button (only appears if network was heavily throttled) */}
        {hasFailsafeTriggered && (
          <button
            onClick={() => {
              setIsAssetsReady(true);
              onLoaded();
            }}
            className="mt-6 px-4 py-1.5 rounded-full text-xs font-semibold text-amber-200/90 bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-200"
          >
            Enter Story →
          </button>
        )}
      </div>
    </div>
  );
};
