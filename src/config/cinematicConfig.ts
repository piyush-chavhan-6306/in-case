/**
 * Centralized Cinematic Scroll & Camera Configuration for IN CASE
 * Allows easy tuning of camera progression, scroll pacing, and lerp speeds.
 */

export const CINEMATIC_CONFIG = {
  // Total extracted JPEG frames in /public/frames/frame-0001.jpg .. frame-1960.jpg
  TOTAL_FRAMES: 1960,

  // Total scroll container height in viewport height units (vh)
  // Slower, relaxed scroll pacing ensures every scene and narrative card is clearly visible
  SCROLL_CONTAINER_HEIGHT_VH: 2400,

  // Frame lerp speed (0.01 to 0.5): lower = smoother, heavier cinematic camera glide
  FRAME_LERP_SPEED: 0.08,

  // 3D camera micro-parallax & perspective factor
  CAMERA_PARALLAX_FACTOR: 0.04,

  // Scene transition fade duration in milliseconds
  SCENE_TRANSITION_DURATION_MS: 500,

  // Initial eager preload count for instant rendering
  INITIAL_PRELOAD_COUNT: 45,

  // Grid step for milestone preloading across entire film
  PRELOAD_GRID_STEP: 12,

  // Local window around current frame to preload while scrolling
  ACTIVE_PRELOAD_WINDOW: 30,

  // Maximum frame distance to search for a loaded neighbor fallback (guarantees zero flicker)
  NEAREST_NEIGHBOR_SEARCH_LIMIT: 120,

  // Frame file extension ('jpg' or 'png')
  // Ready to switch to 'png' with a single toggle when user finishes PNG export
  FRAME_EXTENSION: 'jpg' as 'jpg' | 'png',
};

/**
 * Returns the path to a specific cinematic frame asset
 */
export function getFramePath(
  index: number,
  extension: 'jpg' | 'png' = CINEMATIC_CONFIG.FRAME_EXTENSION
): string {
  const pad = String(index + 1).padStart(4, '0');
  return `/frames/frame-${pad}.${extension}`;
}
