'use client';

import { IconStreak } from '@focus-pocus/ui/icons';
import type { ReactNode } from 'react';
import { FocusScreenMock } from '@/components/mocks/focus-screen-mock';
import { OptionsMock } from '@/components/mocks/options-mock';
import { DEMO_STREAK, PopupMock } from '@/components/mocks/popup-mock';
import { LOCALES } from '@/lib/i18n';
import { I18nProvider, useCopy } from '@/lib/i18n-provider';
import type { SlideId } from './catalog';

/** Where a drawing caught mid-session shows its countdown. */
export const MID_SESSION_SECONDS = 18 * 60 + 42;

/**
 * How a slide lays out: `side` puts the copy on the left and the drawing on
 * the right; `stacked` centers the copy on top and lets the drawing run off
 * the bottom edge.
 */
export type Layout = 'side' | 'stacked';

/** Each slide's layout and its drawing. */
export const slides: Record<SlideId, { layout: Layout; Visual: () => ReactNode }> = {
  timer: { layout: 'side', Visual: TimerVisual },
  focusScreen: { layout: 'stacked', Visual: FocusScreenVisual },
  lists: { layout: 'stacked', Visual: ListsVisual },
  streak: { layout: 'side', Visual: StreakVisual },
  yours: { layout: 'stacked', Visual: YoursVisual },
};

/** The popup mid-session, grown to read at the store's size. */
function TimerVisual() {
  return (
    <div className="[zoom:1.5]">
      <PopupMock runningFrom={MID_SESSION_SECONDS} />
    </div>
  );
}

/** A blocked site under the focus screen, shrunk so its countdown fits above the edge. */
function FocusScreenVisual() {
  return (
    <div className="w-300 [zoom:0.75]">
      <FocusScreenMock />
    </div>
  );
}

/** The settings page on the blocklist. */
function ListsVisual() {
  return (
    <div className="w-260">
      <OptionsMock />
    </div>
  );
}

/** The popup, idle on a preset, beside the streak it protects. */
function StreakVisual() {
  const { app } = useCopy();

  return (
    <div className="relative pl-36">
      <div className="[zoom:1.5]">
        <PopupMock />
      </div>
      <p className="absolute top-60 left-0 flex items-baseline gap-3 rounded-2xl bg-surface px-6 py-5 shadow-float ring-1 ring-hairline">
        <IconStreak
          aria-hidden="true"
          className="self-center text-streak"
          size={32}
          weight="fill"
        />
        <span className="text-stat font-medium tracking-stat tabular-nums">{DEMO_STREAK}</span>
        <span className="text-md text-text-muted">{app.options.inARow}</span>
      </p>
    </div>
  );
}

/** The popup in each of the extension's languages, the middle one mid-session. */
function YoursVisual() {
  return (
    <div className="flex items-start gap-8">
      {LOCALES.map((locale, index) => (
        <I18nProvider key={locale} locale={locale}>
          <div className="[zoom:1.1]">
            <PopupMock runningFrom={index === 1 ? MID_SESSION_SECONDS : null} />
          </div>
        </I18nProvider>
      ))}
    </div>
  );
}
