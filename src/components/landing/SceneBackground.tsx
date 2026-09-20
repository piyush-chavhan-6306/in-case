import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { CINEMATIC_CONFIG, getFramePath } from '../../config/cinematicConfig';

export interface SceneBackgroundHandle {
  drawFrame: (index: number) => void;
}

interface SceneBackgroundProps {
  currentFrame: number;
  cameraParallax?: { x: number; y: number };
}

export const SceneBackground = forwardRef<SceneBackgroundHandle, SceneBackgroundProps>(
  ({ currentFrame, cameraParallax = { x: 0, y: 0 } }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<(HTMLImageElement | null)[]>(
      new Array(CINEMATIC_CONFIG.TOTAL_FRAMES).fill(null)
    );
    const renderedFrameRef = useRef<number>(-1);
    const loadingQueueRef = useRef<Set<number>>(new Set());

    // Priority frame requester
    const requestFrame = (idx: number): Promise<void> => {
      if (idx < 0 || idx >= CINEMATIC_CONFIG.TOTAL_FRAMES) return Promise.resolve();
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

    // Draw frame on canvas
    const drawFrame = (frameIdx: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Find requested frame or the closest loaded frame
      let img = imagesRef.current[frameIdx];
      if (!img) {
        for (let offset = 1; offset < CINEMATIC_CONFIG.NEAREST_NEIGHBOR_SEARCH_LIMIT; offset++) {
          if (frameIdx - offset >= 0 && imagesRef.current[frameIdx - offset]) {
            img = imagesRef.current[frameIdx - offset];
            break;
          }
          if (
            frameIdx + offset < CINEMATIC_CONFIG.TOTAL_FRAMES &&
            imagesRef.current[frameIdx + offset]
          ) {
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

      // Subtle parallax camera offset
      const px = cameraParallax.x * (width * 0.015);
      const py = cameraParallax.y * (height * 0.015);

      ctx.drawImage(img, drawX + px, drawY + py, drawW, drawH);

      // Warm cinematic ambient vignette
      const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.4,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.88
      );
      gradient.addColorStop(0, 'rgba(8, 12, 22, 0)');
      gradient.addColorStop(0.7, 'rgba(8, 12, 22, 0.25)');
      gradient.addColorStop(1, 'rgba(6, 10, 20, 0.65)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      renderedFrameRef.current = frameIdx;
    };

    useImperativeHandle(ref, () => ({
      drawFrame,
    }));

    // Initialize preloading strategy
    useEffect(() => {
      let isCancelled = false;

      const runPreload = async () => {
        // 1. Load initial batch urgently
        const initialPromises: Promise<void>[] = [];
        for (let i = 0; i < Math.min(CINEMATIC_CONFIG.INITIAL_PRELOAD_COUNT, CINEMATIC_CONFIG.TOTAL_FRAMES); i++) {
          initialPromises.push(requestFrame(i));
        }
        await Promise.all(initialPromises);

        if (isCancelled) return;

        // 2. Preload milestone keyframes across all 1960 frames
        for (let i = CINEMATIC_CONFIG.INITIAL_PRELOAD_COUNT; i < CINEMATIC_CONFIG.TOTAL_FRAMES; i += CINEMATIC_CONFIG.PRELOAD_GRID_STEP) {
          if (isCancelled) break;
          requestFrame(i);
        }
      };

      runPreload();

      return () => {
        isCancelled = true;
      };
    }, []);

    // Proactively preload surrounding neighborhood when currentFrame changes
    useEffect(() => {
      for (let offset = -15; offset <= CINEMATIC_CONFIG.ACTIVE_PRELOAD_WINDOW; offset++) {
        const target = currentFrame + offset;
        if (target >= 0 && target < CINEMATIC_CONFIG.TOTAL_FRAMES && !imagesRef.current[target]) {
          requestFrame(target);
        }
      }
      drawFrame(currentFrame);
    }, [currentFrame, cameraParallax.x, cameraParallax.y]);

    // Handle high-DPI resize
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

    return (
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none transition-transform duration-300"
        style={{
          transform: `scale(${1 + Math.abs(cameraParallax.x) * 0.02})`,
        }}
      />
    );
  }
);
