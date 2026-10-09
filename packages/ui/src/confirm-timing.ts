// Giving up resets the streak, so it takes two clicks: in the popup, on the
// focus screen and in the website's drawings alike. The React screens use
// useConfirmTwice (./use-confirm-twice.ts); the focus screen, plain DOM, reads
// these directly. No React here, so the content script does not bundle it.

/** How long an armed action waits for the second click before disarming. */
export const CONFIRM_WINDOW_MS = 3000;

/** A confirming click sooner than this is the tail of a double-click, not a decision. */
export const MIN_CONFIRM_DELAY_MS = 400;
