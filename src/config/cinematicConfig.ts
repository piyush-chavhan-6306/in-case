/**
 * Centralized Cinematic Scroll & Camera Configuration for IN CASE
 * Allows easy tuning of camera progression, scroll pacing, and lerp speeds.
 */

export const CINEMATIC_CONFIG = {
  // Total extracted PNG frames in /public/frames/frame-0001.png .. frame-1200.png
  TOTAL_FRAMES: 1200,

  // Total scroll container height in viewport height units (vh)
  // Slower, relaxed scroll pacing ensures every scene and narrative card is clearly visible
  SCROLL_CONTAINER_HEIGHT_VH: 2400,

  // Frame lerp speed (0.01 to 0.5): 0.14 provides immediate response with silky camera glide
  FRAME_LERP_SPEED: 0.14,

  // 3D camera micro-parallax & perspective factor
  CAMERA_PARALLAX_FACTOR: 0.04,

  // Scene transition fade duration in milliseconds
  SCENE_TRANSITION_DURATION_MS: 500,

  // Initial eager preload count for instant rendering
  INITIAL_PRELOAD_COUNT: 45,

  // Grid step for milestone preloading across entire film
  PRELOAD_GRID_STEP: 6,

  // Local window around current frame to preload while scrolling
  ACTIVE_PRELOAD_WINDOW: 35,

  // Maximum frame distance to search for a loaded neighbor fallback (guarantees zero flicker)
  NEAREST_NEIGHBOR_SEARCH_LIMIT: 80,

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
  return `${SUPABASE_FRAMES_CDN}/frame-${pad}.${extension}`;
}
