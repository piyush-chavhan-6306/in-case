import React, { useEffect, useRef, useState } from 'react';
import { CINEMATIC_CONFIG } from '../../config/cinematicConfig';
import { SCENES, SceneConfig } from '../../config/scenes';
import { SceneBackground, SceneBackgroundHandle } from './SceneBackground';
import { FloatingNavbar } from './FloatingNavbar';
import { StoryBubble } from './StoryBubble';
import { ScrollIndicator } from './ScrollIndicator';
import { StoryFooterPill } from './StoryFooterPill';
import { CinematicLoader } from './CinematicLoader';
import { AppView } from '../common/Navbar';

interface CinematicSceneProps {
  onNavigate: (view: AppView) => void;
  onOpenUnlock?: () => void;
  onResetData?: () => void;
  onOpenAuth?: () => void;
}

export const CinematicScene: React.FC<CinematicSceneProps> = ({
  onNavigate,
  onOpenUnlock,
  onResetData,
  onOpenAuth,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<SceneBackgroundHandle>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [activeScene, setActiveScene] = useState<SceneConfig>(SCENES[0]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const targetFrameRef = useRef<number>(0);
  const currentLerpFrameRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Track normalized mouse position for subtle 3D perspective
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Map vertical scroll progress to target frame index
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScrollable = container.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable));
      setScrollProgress(progress);

      const target = Math.min(
        CINEMATIC_CONFIG.TOTAL_FRAMES - 1,
        Math.floor(progress * (CINEMATIC_CONFIG.TOTAL_FRAMES - 1))
      );
      targetFrameRef.current = target;

      // Determine active scene
      const scene =
        SCENES.find((s) => target >= s.startFrame && target <= s.endFrame) || SCENES[0];
      setActiveScene(scene);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth 60 FPS lerp loop - decoupled from state to eliminate stutter/glitch
  useEffect(() => {
    let animId: number;

    const renderLoop = () => {
      const target = targetFrameRef.current;
      const current = currentLerpFrameRef.current;

      const diff = target - current;
      if (Math.abs(diff) < 0.04) {
        currentLerpFrameRef.current = target;
      } else {
        currentLerpFrameRef.current += diff * CINEMATIC_CONFIG.FRAME_LERP_SPEED;
      }

      const frameToDraw = Math.round(currentLerpFrameRef.current);
      backgroundRef.current?.drawFrame(frameToDraw);
      setCurrentFrameIndex(frameToDraw);

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Handle scene action clicks (e.g. from the Story Bubble CTA button)
  const handleSceneAction = (action: string) => {
    switch (action) {
      case 'discover':
        onNavigate('discover');
        break;
      case 'protect':
        onNavigate('protect');
        break;
      case 'rehearse':
        onNavigate('rehearse');
        break;
      case 'emergency':
        onNavigate('emergency');
        break;
      case 'play':
      default:
        // Smooth scroll a bit further to see the camera move into the home
        window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
        break;
    }
  };

  // Determine active navigation pillar: 1 = Home, 2 = Discover, 3 = Protect, 4 = Rehearse
  const getActivePillar = (): number => {
    if (activeScene.id <= 4) return 1; // 01 Home
    if (activeScene.id === 5) return 2; // 02 Discover
    if (activeScene.id === 6 || activeScene.id === 7) return 3; // 03 Protect
    return 4; // 04 Rehearse / Act
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-navy-950"
      style={{ height: `${CINEMATIC_CONFIG.SCROLL_CONTAINER_HEIGHT_VH}vh` }}
    >
      {/* Sticky Cinematic Viewport */}
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        {/* 1. Cinematic Background Canvas */}
        <SceneBackground
          ref={backgroundRef}
          currentFrame={currentFrameIndex}
          cameraParallax={{
            x: mousePos.x * CINEMATIC_CONFIG.CAMERA_PARALLAX_FACTOR,
            y: mousePos.y * CINEMATIC_CONFIG.CAMERA_PARALLAX_FACTOR,
          }}
        />

        {/* 2. Floating Minimal Pill Navbar */}
        <FloatingNavbar
          currentView="landing"
          onNavigate={onNavigate}
          activePillar={getActivePillar()}
          onOpenUnlock={onOpenUnlock}
          onResetData={onResetData}
          onOpenAuth={onOpenAuth}
        />

        {/* 3. Dynamic Negative Space Story Bubble */}
        <StoryBubble
          scene={activeScene}
          onAction={handleSceneAction}
          mousePos={mousePos}
        />

        {/* 4. Minimal Right Edge Cinematic Scroll Indicator */}
        <ScrollIndicator
          progress={scrollProgress}
          totalScenes={SCENES.length}
          currentSceneId={activeScene.id}
        />

        {/* 5. Optional Contextual Story Footer Pill (Only when composition permits, e.g. Scene 1) */}
        <StoryFooterPill show={Boolean(activeScene.showFooterPill)} />
      </div>

      {/* Cinematic Fullscreen Loader Overlay */}
      {isLoading && (
        <CinematicLoader onLoaded={() => setIsLoading(false)} />
      )}
    </div>
  );
};
