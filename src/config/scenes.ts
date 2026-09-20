/**
 * Centralized Scene Configuration for IN CASE
 * Defines the narrative flow, negative space placement, dynamic icons, and CTAs per scene.
 */

export type BubblePosition = 'top-left' | 'left-center' | 'right-center' | 'bottom-left' | 'top-center';

export type SceneIconKey =
  | 'home'
  | 'family'
  | 'unforeseen'
  | 'commitments'
  | 'discover'
  | 'protect'
  | 'guardians'
  | 'rehearse'
  | 'emergency'
  | 'peace';

export interface SceneConfig {
  id: number;
  startFrame: number;
  endFrame: number;
  badge: string;
  title: string;
  subtitle: string;
  question: string;
  icon: SceneIconKey;
  bubblePosition: BubblePosition;
  bubbleOffsetX?: number;
  bubbleOffsetY?: number;
  bubbleScale?: number;
  bubbleWidth?: string;
  bubbleAlignment?: 'left' | 'center' | 'right';
  showFooterPill?: boolean;
  ctaText?: string;
  ctaAction?: 'discover' | 'protect' | 'rehearse' | 'emergency' | 'play';
}

export const SCENES: SceneConfig[] = [
  {
    id: 1,
    startFrame: 0,
    endFrame: 119,
    badge: 'SCENE 01 · THE HOME',
    title: 'A home built on love and quiet commitments.',
    subtitle: 'Behind every front door is a family relying on financial anchors they rarely discuss.',
    question: 'What happens if you are unreachable tomorrow?',
    icon: 'home',
    bubblePosition: 'top-left',
    bubbleWidth: 'max-w-xl',
    showFooterPill: true,
    ctaText: 'Watch the Scene',
    ctaAction: 'play',
  },
  {
    id: 2,
    startFrame: 120,
    endFrame: 239,
    badge: 'SCENE 02 · THE FAMILY',
    title: 'Your family knows you love them.',
    subtitle: 'Do they know which policy pays the hospital? Or where the physical loan deeds are kept?',
    question: 'Families don’t even know what to look for when tragedy strikes.',
    icon: 'family',
    bubblePosition: 'left-center',
    bubbleWidth: 'max-w-xl',
    showFooterPill: false,
    ctaText: 'Discover Gaps',
    ctaAction: 'discover',
  },
  {
    id: 3,
    startFrame: 240,
    endFrame: 399,
    badge: 'SCENE 03 · UNFORESEEN SEPARATION',
    title: 'When life changes in a single second.',
    subtitle: 'Sudden hospitalization, ICU admission, or unexpected loss. Life takes off into the unknown.',
    question: 'Grief should never be compounded by financial confusion.',
    icon: 'unforeseen',
    bubblePosition: 'left-center',
    bubbleWidth: 'max-w-lg',
    showFooterPill: false,
  },
  {
    id: 4,
    startFrame: 400,
    endFrame: 559,
    badge: 'SCENE 04 · SCATTERED COMMITMENTS',
    title: 'Term plans in email. SIPs on phones. Loans in drawers.',
    subtitle: 'Commitments are scattered across apps, portals, and paperwork with missing nominees.',
    question: 'A password vault stores files. Who knows what even exists?',
    icon: 'commitments',
    bubblePosition: 'top-left',
    bubbleWidth: 'max-w-xl',
    showFooterPill: false,
    ctaText: 'Explore Auto-Discovery',
    ctaAction: 'discover',
  },
  {
    id: 5,
    startFrame: 560,
    endFrame: 719,
    badge: 'SCENE 05 · AUTO-DISCOVERY',
    title: 'Auto-Discovery from Bank Statements.',
    subtitle: 'Drop in a 6-month bank statement. In Case instantly extracts recurring commitments, policies, loans, and SIPs.',
    question: 'Zero manual typing. Instant financial visibility.',
    icon: 'discover',
    bubblePosition: 'right-center',
    bubbleWidth: 'max-w-lg',
    showFooterPill: false,
    ctaText: 'Test Statement Parser',
    ctaAction: 'discover',
  },
  {
    id: 6,
    startFrame: 720,
    endFrame: 849,
    badge: 'SCENE 06 · ZERO KNOWLEDGE',
    title: 'Client-Side AES-256 Military Encryption.',
    subtitle: 'Your blueprint is encrypted directly in your browser before leaving. We never store your decrypted records.',
    question: 'True zero-knowledge family protection.',
    icon: 'protect',
    bubblePosition: 'left-center',
    bubbleWidth: 'max-w-lg',
    showFooterPill: false,
    ctaText: 'Inspect Cryptography',
    ctaAction: 'protect',
  },
  {
    id: 7,
    startFrame: 850,
    endFrame: 969,
    badge: 'SCENE 07 · 2-OF-3 ACCESS',
    title: '2-of-3 Shamir Secret Sharing.',
    subtitle: 'The master key is mathematically split into 3 trusted guardian shares. Any 2 can unlock the emergency kit.',
    question: 'No single point of failure. No rogue access.',
    icon: 'guardians',
    bubblePosition: 'bottom-left',
    bubbleWidth: 'max-w-sm lg:max-w-[370px]',
    bubbleOffsetX: -15,
    bubbleOffsetY: 0,
    bubbleScale: 0.94,
    bubbleAlignment: 'left',
    showFooterPill: false,
    ctaText: 'View Guardian Shares',
    ctaAction: 'protect',
  },
  {
    id: 8,
    startFrame: 970,
    endFrame: 1079,
    badge: 'SCENE 08 · THE REHEARSAL',
    title: 'The World’s First Family Fire Drill.',
    subtitle: 'A vault stores files. In Case proves your family can use them through dynamic, realistic simulations.',
    question: 'Score readiness (0–100) before a crisis ever happens.',
    icon: 'rehearse',
    bubblePosition: 'top-left',
    bubbleWidth: 'max-w-xl',
    showFooterPill: false,
    ctaText: 'Start Fire Drill',
    ctaAction: 'rehearse',
  },
  {
    id: 9,
    startFrame: 1080,
    endFrame: 1149,
    badge: 'SCENE 09 · EMERGENCY ACTION',
    title: 'Calm, Prioritized Action in Crisis.',
    subtitle: 'Low cognitive load triage: First 24 Hours, Next 7 Days, Next 30 Days. Instant claim numbers and zero-hallucination guidance.',
    question: 'Clear direction when emotions are raw.',
    icon: 'emergency',
    bubblePosition: 'top-left',
    bubbleWidth: 'max-w-xl',
    showFooterPill: false,
    ctaText: 'Open Action Playbook',
    ctaAction: 'emergency',
  },
  {
    id: 10,
    startFrame: 1150,
    endFrame: 1199,
    badge: 'SCENE 10 · PEACE OF MIND',
    title: 'A safer tomorrow, together.',
    subtitle: 'Give your loved ones the gift of certainty. Discover, protect, rehearse, and act with confidence.',
    question: 'Ready to build your family emergency kit?',
    icon: 'peace',
    bubblePosition: 'bottom-left',
    bubbleWidth: 'max-w-md lg:max-w-lg',
    bubbleOffsetY: -15,
    bubbleScale: 0.95,
    showFooterPill: false,
    ctaText: 'Begin Auto-Discovery',
    ctaAction: 'discover',
  },
];
