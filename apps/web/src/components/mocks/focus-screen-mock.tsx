'use client';

import { cx } from '@focus-pocus/ui/cx';
import { formatTime } from '@focus-pocus/ui/format-time';
import { ProgressRing } from '@focus-pocus/ui/progress-ring';
import { useConfirmTwice } from '@focus-pocus/ui/use-confirm-twice';
import { useState } from 'react';
import logo from '@/assets/logo.png';
import { useCopy } from '@/lib/i18n-provider';
import { useInterval } from '@/lib/use-interval';
import { BrowserFrame } from './browser-frame';

// A drawing of the focus screen (apps/extension/src/content/overlay.ts and
// overlay.css) over a blocked site. The extension draws it in a shadow root
// with plain CSS; here it is the same sizes and colors as tokens.

/** Where the countdown starts, and starts over when it runs out or the visitor gives up. */
const SESSION_SECONDS = 18 * 60 + 42;

/** The session the ring measures the countdown against. */
const TOTAL_SECONDS = 25 * 60;

/** A video site's grid, shapes only: what the focus screen covers. */
function BlockedPage() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 grid grid-cols-2 content-start gap-4 overflow-hidden p-6 sm:grid-cols-3"
    >
      {Array.from({ length: 6 }, (_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: identical placeholders, never reordered
        <div className="flex flex-col gap-2" key={index}>
          <div className="aspect-video rounded-lg bg-raised-hover" />
          <div className="h-3 w-4/5 rounded-full bg-raised" />
          <div className="h-3 w-1/2 rounded-full bg-raised" />
        </div>
      ))}
    </div>
  );
}

/** The countdown inside its emptying ring, with the faint spell turning around it. */
function Clock({ secondsLeft }: { secondsLeft: number }) {
  const { app } = useCopy();

  return (
    <div className="relative mt-9 grid size-54 place-items-center">
      <svg
        aria-hidden="true"
        className="absolute inset-0 size-full scale-110 motion-safe:animate-spell-ring overflow-visible fill-none stroke-border-strong"
        viewBox="0 0 200 200"
      >
        <circle cx="100" cy="100" r="99" strokeDasharray="1 7" strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0">
        <ProgressRing isRunning progress={secondsLeft / TOTAL_SECONDS} />
      </div>
      <div className="relative">
        <p className="text-overlay-time font-light tracking-overlay-time tabular-nums">
          {formatTime(secondsLeft)}
        </p>
        <p className="mt-2 text-sm text-text-faint">{app.overlay.timeLabel}</p>
      </div>
    </div>
  );
}

/** Give up, in two clicks: the second one, inside the window, starts the countdown over. */
function GiveUpButton({ onGiveUp }: { onGiveUp: () => void }) {
  const { app } = useCopy();
  const { isArmed: armed, confirm, disarm } = useConfirmTwice();

  return (
    <button
      className={cx(
        'focus-ring inline-flex h-10 min-w-33 items-center justify-center rounded-full border px-5 text-base font-medium transition-[color,background-color,border-color,scale] duration-(--duration) ease-fluid active:scale-97',
        armed
          ? 'border-danger-solid bg-danger-solid text-white'
          : 'border-border-strong text-text-muted hover:border-danger-line hover:bg-danger-wash hover:text-danger',
      )}
      onBlur={disarm}
      onClick={() => confirm(onGiveUp)}
      type="button"
    >
      <span className="animate-fade-up" key={String(armed)}>
        {armed ? app.overlay.confirmGiveUp : app.overlay.giveUp}
      </span>
    </button>
  );
}

/** A blocked site under the focus screen, its countdown running. */
export function FocusScreenMock() {
  const { app, site } = useCopy();
  const copy = app.overlay;
  const [secondsLeft, setSecondsLeft] = useState(SESSION_SECONDS);

  useInterval(() => setSecondsLeft((left) => (left > 1 ? left - 1 : SESSION_SECONDS)), 1000);

  return (
    <BrowserFrame label={site.mocks.focusScreen} url="youtube.com">
      <div className="relative overflow-hidden">
        <BlockedPage />
        <div className="relative flex min-h-120 items-center justify-center bg-canvas/94 px-6 py-14 text-center backdrop-blur-xl backdrop-saturate-120">
          {/* The aura: two violet clouds drifting behind the card. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 -left-40 size-130 motion-safe:animate-drift rounded-full bg-radial-[closest-side] from-accent-solid/14 to-transparent blur-2xl" />
            <div className="absolute -right-40 -bottom-40 size-130 motion-safe:animate-drift-reverse rounded-full bg-radial-[closest-side] from-accent-solid/14 to-transparent blur-2xl" />
          </div>
          <div className="relative flex max-w-115 flex-col items-center">
            {/* biome-ignore lint/performance/noImgElement: a 56px logo, next/image would add nothing */}
            <img alt="" className="mb-7 size-14 rounded-overlay-logo" src={logo.src} />
            <p className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-border bg-raised py-1 pr-3 pl-2.5 text-sm font-medium text-accent">
              <span className="relative size-1.5 rounded-full bg-accent">
                <span className="absolute inset-0 motion-safe:animate-ping rounded-full bg-accent" />
              </span>
              {copy.eyebrow}
            </p>
            <p className="text-balance text-overlay-title font-medium tracking-overlay-title">
              {copy.title}
            </p>
            <p className="mt-3 text-balance text-md leading-relaxed text-text-muted">{copy.lead}</p>
            <Clock secondsLeft={secondsLeft} />
            <div className="mt-9 flex flex-col items-center gap-3">
              <GiveUpButton onGiveUp={() => setSecondsLeft(SESSION_SECONDS)} />
              <p className="text-sm text-text-faint">{copy.warning}</p>
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}
