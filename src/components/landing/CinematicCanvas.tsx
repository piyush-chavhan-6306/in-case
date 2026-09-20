import React, { useEffect, useRef, useState } from 'react';
import { Shield, Sparkles, ChevronDown, Lock, CheckCircle2, ArrowRight } from 'lucide-react';

interface CinematicCanvasProps {
  onStartKit: () => void;
  onOpenUnlock: () => void;
}
import { CINEMATIC_CONFIG, getFramePath } from '../../config/cinematicConfig';

const TOTAL_FRAMES = CINEMATIC_CONFIG.TOTAL_FRAMES;

interface SceneInfo {
  start: number;
  end: number;
  title: string;
  subtitle: string;
  tagline: string;
  badge: string;
}

const SCENES: SceneInfo[] = [
  {
    start: 0,
    end: 149,
    badge: 'SCENE 01 — THE HOME',
    title: 'A home built on love and quiet commitments.',
    subtitle: 'Behind every front door is a family relying on financial anchors they rarely discuss.',
    tagline: 'What happens if you are unreachable tomorrow?',
  },
  {
    start: 150,
    end: 299,
    badge: 'SCENE 02 — THE FAMILY',
    title: 'Your family knows you love them.',
    subtitle: 'Do they know which policy pays the hospital? Or where the physical loan deeds are kept?',
    tagline: 'The deepest problem: Families don’t even know what to look for.',
  },
  {
    start: 300,
    end: 599,
    badge: 'SCENE 03 — UNFORESEEN SEPARATION',
    title: 'When life changes in a single second.',
    subtitle: 'Hospitalization, ICU admission, or sudden loss. Life takes off unpredictably into the unknown.',
    tagline: 'Grief should never be compounded by financial confusion.',
  },
  {
    start: 600,
    end: 899,
    badge: 'SCENE 04 — SCATTERED COMMITMENTS',
    title: 'Term plans in email. SIPs on phones. Loans in drawers.',
    subtitle: 'Financial commitments are scattered across portals, apps, and paperwork with missing nominees.',
    tagline: 'A password vault stores files. But who knows what even exists?',
  },
  {
    start: 900,
    end: 1199,
    badge: 'SCENE 05 — DISCOVER',
    title: 'Auto-Discovery from Bank Statements.',
    subtitle: 'Drop in a 6-month bank statement. In Case instantly extracts recurring commitments, policies, loans, and SIPs.',
    tagline: 'Zero manual typing. Zero friction.',
  },
  {
    start: 1200,
    end: 1349,
    badge: 'SCENE 06 — PROTECT',
    title: 'Client-Side AES-256 Military Encryption.',
    subtitle: 'Your financial blueprint is encrypted in your browser before it ever leaves. We never store or see your decrypted data.',
    tagline: 'True zero-knowledge family protection.',
  },
  {
    start: 1350,
    end: 1499,
    badge: 'SCENE 07 — 2-OF-3 ACCESS',
    title: '2-of-3 Shamir Secret Sharing.',
    subtitle: 'The master key is mathematically split into 3 independent trusted shares. Any 2 can unlock the emergency kit.',
    tagline: 'No single point of failure. No rogue access.',
  },
  {
    start: 1500,
    end: 1649,
    badge: 'SCENE 08 — REHEARSE',
    title: 'The Family Fire Drill.',
    subtitle: 'The ultimate differentiator: In Case generates timed drills with real questions from your inventory.',
    tagline: 'Proves your family can actually use the information.',
  },
  {
    start: 1650,
    end: 1799,
    badge: 'SCENE 09 — ACT',
    title: 'Emergency Mode & 24h Playbooks.',
    subtitle: 'Calm, prioritized instructions: First 24 Hours, Next 7 Days, Next 30 Days. Low cognitive load.',
    tagline: 'Clear direction when it matters most.',
  },
  {
    start: 1800,
    end: 1959,
    badge: 'SCENE 10 — PEACE OF MIND',
    title: 'A safer tomorrow, together.',
    subtitle: 'A vault stores your files. In Case proves your family can use them.',
    tagline: 'Discover. Protect. Rehearse. Act.',
  },
];

export const CinematicCanvas: React.FC<CinematicCanvasProps> = ({ onStartKit, onOpenUnlock }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const [loadedCount, setLoadedCount] = useState(0);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [activeScene, setActiveScene] = useState<SceneInfo>(SCENES[0]);
  const animationFrameRef = useRef<number | null>(null);
  const targetFrameRef = useRef<number>(0);
  const renderedFrameRef = useRef<number>(-1);
  const loadingQueueRef = useRef<Set<number>>(new Set());

  // Priority image loader function
  const requestFrame = (idx: number): Promise<void> => {
    if (idx < 0 || idx >= TOTAL_FRAMES) return Promise.resolve();
    if (imagesRef.current[idx] || loadingQueueRef.current.has(idx)) {
      return Promise.resolve();
    }

    loadingQueueRef.current.add(idx);
    return new Promise((resolve) => {
      const img = new Image();
      img.src = getFramePath(idx);
      img.onload = () => {
        imagesRef.current[idx] = img;
        loadingQueueRef.current.delete(idx);
        setLoadedCount((prev) => prev + 1);
        if (idx === 0 && renderedFrameRef.current === -1) {
          drawFrame(0);
        }
        resolve();
      };
      img.onerror = () => {
        loadingQueueRef.current.delete(idx);
        resolve();
      };
    });
  };

  // Preload initial frames and milestone grid
  useEffect(() => {
    let isCancelled = false;

    const startPreloading = async () => {
      // 1. First 40 frames immediately so hero is instant
      const initialBatch: Promise<void>[] = [];
      for (let i = 0; i < Math.min(40, TOTAL_FRAMES); i++) {
        initialBatch.push(requestFrame(i));
      }
      await Promise.all(initialBatch);

      if (isCancelled) return;

      // 2. Sampled milestone frames every 12 frames across whole 1960 frames
      // That's ~160 images to guarantee instant coverage anywhere in the video
      for (let i = 40; i < TOTAL_FRAMES; i += 12) {
        if (isCancelled) break;
        requestFrame(i);
      }
    };

    startPreloading();

    return () => {
      isCancelled = true;
    };
  }, []);

  // Draw frame on canvas with high-DPI handling and aspect-ratio "cover" logic
  const drawFrame = (frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Find requested frame or the closest loaded frame (search up to 100 frames away)
    let img = imagesRef.current[frameIdx];
    if (!img) {
      for (let offset = 1; offset < 100; offset++) {
        if (frameIdx - offset >= 0 && imagesRef.current[frameIdx - offset]) {
          img = imagesRef.current[frameIdx - offset];
          break;
        }
        if (frameIdx + offset < TOTAL_FRAMES && imagesRef.current[frameIdx + offset]) {
          img = imagesRef.current[frameIdx + offset];
          break;
        }
      }
    }

    if (!img) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Compute aspect-ratio cover
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const canvasAspect = width / height;

    let drawW = width;
    let drawH = height;
    let drawX = 0;
    let drawY = 0;

    if (canvasAspect > imgAspect) {
      drawH = width / imgAspect;
      drawY = (height - drawH) / 2;
    } else {
      drawW = height * imgAspect;
      drawX = (width - drawW) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    // Apply a subtle cinematic vignette overlay for atmospheric immersion
    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      Math.min(width, height) * 0.35,
      width / 2,
      height / 2,
      Math.max(width, height) * 0.85
    );
    gradient.addColorStop(0, 'rgba(6, 10, 20, 0)');
    gradient.addColorStop(1, 'rgba(6, 10, 20, 0.7)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    renderedFrameRef.current = frameIdx;
  };

  // Handle Canvas Resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      if (renderedFrameRef.current >= 0) {
        drawFrame(renderedFrameRef.current);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll listener: Map scroll position directly to frame index 0..1959
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScrollable = container.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      // Current scrolled distance within container
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));

      // Calculate target frame
      const targetIndex = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * (TOTAL_FRAMES - 1)));
      targetFrameRef.current = targetIndex;

      // Proactively load neighbor frames around target
      for (let offset = -15; offset <= 25; offset++) {
        const neighbor = targetIndex + offset;
        if (neighbor >= 0 && neighbor < TOTAL_FRAMES && !imagesRef.current[neighbor]) {
          requestFrame(neighbor);
        }
      }

      // Determine active scene
      const scene = SCENES.find((s) => targetIndex >= s.start && targetIndex <= s.end) || SCENES[0];
      setActiveScene(scene);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth frame render loop with lerp easing
  useEffect(() => {
    let current = 0;

    const renderLoop = () => {
      const target = targetFrameRef.current;
      // Smooth lerp towards target frame
      const diff = target - current;
      if (Math.abs(diff) < 0.1) {
        current = target;
      } else {
        current += diff * 0.25;
      }

      const frameToDraw = Math.round(current);
      if (frameToDraw !== renderedFrameRef.current) {
        drawFrame(frameToDraw);
        setCurrentFrameIndex(frameToDraw);
      }

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameRef.current = requestAnimationFrame(renderLoop);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const progressPercent = Math.round((currentFrameIndex / (TOTAL_FRAMES - 1)) * 100);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-navy-950"
      style={{ height: '850vh' }} // 8.5x screen height for smooth, natural scrubbing across 1960 frames
    >
      {/* Sticky Canvas & Story Stage */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col justify-between">
        {/* Full-Screen Render Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        />

        {/* Center / Lower Cinematic Narrative Card */}
        <div className="relative z-20 px-6 max-w-4xl mx-auto w-full mb-12 pointer-events-none">
          <div className="glass-panel rounded-2xl p-6 sm:p-8 shadow-2xl transition-all duration-300 border border-slate-700/50">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-accent-sky px-2.5 py-1 rounded-md bg-accent-sky/10 border border-accent-sky/20">
                {activeScene.badge}
              </span>
              <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono">
                <span>Frame {String(currentFrameIndex + 1).padStart(4, '0')} / {TOTAL_FRAMES}</span>
                <span className="text-slate-600">•</span>
                <span>{progressPercent}% Story</span>
              </div>
            </div>

            <h1 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-snug mb-3">
              {activeScene.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
              {activeScene.subtitle}
            </p>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-accent-amber flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-accent-amber" />
                <span>{activeScene.tagline}</span>
              </span>

              {/* End of story CTA appears at Scene 10 */}
              {currentFrameIndex >= 1800 && (
                <button
                  onClick={onStartKit}
                  className="pointer-events-auto px-5 py-2.5 rounded-xl bg-accent-amber hover:bg-amber-400 text-navy-950 text-xs sm:text-sm font-bold flex items-center space-x-2 transition shadow-lg shadow-amber-500/20"
                >
                  <span>Begin Auto-Discovery</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Timeline Scrubber Progress Bar */}
        <div className="relative z-20 px-6 py-4 bg-gradient-to-t from-navy-950 via-navy-950/80 to-transparent flex items-center justify-between pointer-events-none">
          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-medium text-slate-300">
                {loadedCount < TOTAL_FRAMES ? `Loading frames (${loadedCount}/${TOTAL_FRAMES})...` : 'Scrubbing 1,960 Cinema Frames'}
              </span>
            </div>
          </div>

          {/* Timeline Bar */}
          <div className="w-1/2 sm:w-2/5 h-1.5 bg-slate-800 rounded-full overflow-hidden mx-4">
            <div
              className="h-full bg-gradient-to-r from-accent-sky via-accent-amber to-accent-cyan transition-all duration-75"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <span>Scroll to advance</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-accent-sky" />
          </div>
        </div>
      </div>
    </div>
  );
};
