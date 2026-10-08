// The progress ring's circle, in its 200-unit viewBox: the popup's
// (./progress-ring.tsx) and the focus screen's, which is plain DOM, share it.
// No React here, so the content script does not bundle it.

export const RING_RADIUS = 94;
export const RING_LENGTH = 2 * Math.PI * RING_RADIUS;
