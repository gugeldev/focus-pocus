'use client';

import { formatTime } from '@focus-pocus/ui/format-time';
import { useState } from 'react';
import logo from '@/assets/logo.png';
import { useCopy } from '@/lib/i18n-provider';
import { useInterval } from '@/lib/use-interval';
import { BrowserFrame } from './browser-frame';

// A drawing of the focus screen (apps/extension/src/content/overlay.ts and
// overlay.css) over a blocked site. The extension draws it in a shadow root
// with plain CSS; here it is the same sizes and colors as tokens.

/** Where the countdown starts, and starts over when it runs out. */
const SESSION_SECONDS = 18 * 60 + 42;

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

/** A blocked site under the focus screen, its countdown running. */
export function FocusScreenMock() {
  const { app, site } = useCopy();
  const copy = app.overlay;
  const [secondsLeft, setSecondsLeft] = useState(SESSION_SECONDS);

  useInterval(() => setSecondsLeft((left) => (left > 1 ? left - 1 : SESSION_SECONDS)), 1000);

  return (
    <BrowserFrame label={site.mocks.focusScreen} url="youtube.com">
      <div className="relative">
        <BlockedPage />
        <div className="relative flex min-h-120 items-center justify-center bg-overlay px-6 py-14 text-center backdrop-blur-xl">
          <div className="flex max-w-105 flex-col items-center">
            {/* biome-ignore lint/performance/noImgElement: a 56px logo, next/image would add nothing */}
            <img alt="" className="mb-7 size-14 rounded-overlay-logo" src={logo.src} />
            <p className="mb-3 text-sm font-semibold text-accent">{copy.eyebrow}</p>
            <p className="text-balance text-overlay-title font-semibold tracking-overlay-title">
              {copy.title}
            </p>
            <p className="mt-3 text-balance text-md leading-relaxed text-text-muted">{copy.lead}</p>
            <p className="mt-8 text-overlay-time font-semibold tracking-overlay-time tabular-nums">
              {formatTime(secondsLeft)}
            </p>
            <p className="mt-2 text-sm text-text-faint">{copy.timeLabel}</p>
            <p className="mt-8 text-sm text-text-faint">{copy.warning}</p>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}
