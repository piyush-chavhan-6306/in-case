/**
 * Centralized Cinematic Scroll & Camera Configuration for IN CASE
 * Allows easy tuning of camera progression, scroll pacing, and lerp speeds.
 */

export const CINEMATIC_CONFIG = {
  // Total extracted frames across all 7 zips (1,827 frames)
  TOTAL_FRAMES: 1827,

  // Total scroll container height in viewport height units (vh)
  // 3200vh gives relaxed, steady scroll pacing across all 10 narrative scenes
  SCROLL_CONTAINER_HEIGHT_VH: 3200,

  // Frame lerp speed (0.01 to 0.5): 0.12 provides silky camera glide without feeling disconnected
  FRAME_LERP_SPEED: 0.12,

  // 3D camera micro-parallax & perspective factor
  CAMERA_PARALLAX_FACTOR: 0.04,

  // Scene transition fade duration in milliseconds
  SCENE_TRANSITION_DURATION_MS: 450,

  // Initial eager preload count for instant rendering
  INITIAL_PRELOAD_COUNT: 50,

  // Grid step for milestone preloading across entire film
  PRELOAD_GRID_STEP: 6,

  // Local window around current frame to preload while scrolling
  ACTIVE_PRELOAD_WINDOW: 45,

  // Maximum frame distance to search for a loaded neighbor fallback (guarantees zero flicker)
  NEAREST_NEIGHBOR_SEARCH_LIMIT: 120,

  // Frame file extension — high-performance WebP optimized for instant streaming & 60fps canvas render
  FRAME_EXTENSION: 'webp' as 'webp' | 'jpg' | 'png',
};

// Supabase Storage CDN Base URL for the 1,200 cinematic frames
export const SUPABASE_FRAMES_CDN = 
  import.meta.env.VITE_FRAMES_BASE_URL ||
  'https://zvrozvsmggujrodnxstj.supabase.co/storage/v1/object/public/frames';

/**
 * Returns the path or CDN URL to a specific cinematic frame asset
 */
export function getFramePath(
  index: number,
  extension: 'webp' | 'jpg' | 'png' = CINEMATIC_CONFIG.FRAME_EXTENSION
): string {
  const pad = String(index + 1).padStart(4, '0');
  return `${SUPABASE_FRAMES_CDN}/frame-${pad}.${extension}?v=2`;
}
