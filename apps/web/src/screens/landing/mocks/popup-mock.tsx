'use client';

import { Brand } from '@focus-pocus/ui/brand';
import { Button } from '@focus-pocus/ui/button';
import { cx } from '@focus-pocus/ui/cx';
import { formatTime } from '@focus-pocus/ui/format-time';
import { IconButton } from '@focus-pocus/ui/icon-button';
import { IconAllowlist, IconBlocklist, IconSettings, IconStreak } from '@focus-pocus/ui/icons';
import { ProgressRing } from '@focus-pocus/ui/progress-ring';
import { Segmented } from '@focus-pocus/ui/segmented';
import { useEffect, useState } from 'react';
import logo from '@/assets/logo.png';
import { useCopy } from '@/lib/i18n-provider';
import { useInterval } from '@/lib/use-interval';

// A working drawing of the toolbar popup (apps/extension/src/screens/popup/),
// built from the same kit and the same classes, and run by local state instead
// of the extension's storage. Change the popup, change this.

/** The extension's duration presets (apps/extension/src/screens/popup/presets.ts). */
const presets = [
  { value: 60, label: '1m' },
  { value: 900, label: '15m' },
  { value: 1500, label: '25m' },
  { value: 1800, label: '30m' },
  { value: 2700, label: '45m' },
  { value: 3600, label: '1h' },
];

type Mode = 'blocklist' | 'allowlist';

/** The popup's give-up guard (start-button.tsx): a second click within 3s, not a double-click. */
const CONFIRM_WINDOW_MS = 3000;
const MIN_CONFIRM_DELAY_MS = 400;

/** The copy key and the button variant of each phase, as in start-button.tsx. */
const phases = {
  idle: { label: 'start', variant: 'primary' },
  running: { label: 'giveUp', variant: 'danger' },
  armed: { label: 'confirmGiveUp', variant: 'danger-solid' },
} as const;

/** A session that counts down for real; finishing it adds to the streak, giving up zeroes it. */
function useDemoSession() {
  const [selectedTime, setSelectedTime] = useState(1500);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [streak, setStreak] = useState(12);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const isRunning = secondsLeft !== null;

  useInterval(
    () => {
      if (secondsLeft === null) return;
      if (secondsLeft > 1) return setSecondsLeft(secondsLeft - 1);
      setSecondsLeft(null);
      setStreak((current) => current + 1);
      setIsCelebrating(true);
    },
    isRunning ? 1000 : null,
  );

  return {
    selectedTime,
    setSelectedTime,
    secondsLeft: secondsLeft ?? selectedTime,
    isRunning,
    streak,
    isCelebrating,
    endCelebration: () => setIsCelebrating(false),
    start: () => setSecondsLeft(selectedTime),
    giveUp: () => {
      setSecondsLeft(null);
      setStreak(0);
    },
  };
}

/** The toolbar popup, working: pick a mode and a time, start, and give up (twice) or finish. */
export function PopupMock() {
  const { app, site } = useCopy();
  const session = useDemoSession();
  const [mode, setMode] = useState<Mode>('blocklist');
  const [caption, setCaption] = useState('');

  const start = () => {
    const { encouragements } = app.popup;
    setCaption(encouragements[Math.floor(Math.random() * encouragements.length)] ?? '');
    session.start();
  };

  return (
    <figure
      aria-label={site.mocks.popup}
      className="w-80 overflow-hidden rounded-window bg-canvas shadow-float ring-1 ring-hairline"
    >
      <header className="flex items-center justify-between pt-4 pr-3 pl-4">
        <Brand logoSrc={logo.src} size="sm" />
        <div className="flex items-center gap-1">
          <span
            className={cx(
              'inline-flex h-8 items-center gap-1 rounded-full pr-3 pl-2.5 text-sm font-semibold text-text-muted tabular-nums',
              session.isCelebrating && 'animate-bump',
            )}
            onAnimationEnd={session.endCelebration}
            title={app.popup.streakLabel}
          >
            <IconStreak aria-hidden="true" className="text-streak" size={15} weight="fill" />
            {session.streak}
          </span>
          <IconButton
            aria-label={app.popup.settings}
            icon={IconSettings}
            pill
            title={app.popup.settings}
          />
        </div>
      </header>
      <div className="flex flex-col gap-4 px-4 pt-2 pb-4">
        <Dial
          caption={session.isRunning ? caption : ''}
          isRunning={session.isRunning}
          secondsLeft={session.secondsLeft}
          selectedTime={session.selectedTime}
        />
        <fieldset className="flex min-w-0 flex-col gap-2" disabled={session.isRunning}>
          <legend className="sr-only">{app.popup.sessionSettings}</legend>
          <Segmented
            disabled={session.isRunning}
            name="demo-mode"
            onChange={setMode}
            options={[
              { value: 'blocklist', label: app.popup.modes.blocklist, icon: IconBlocklist },
              { value: 'allowlist', label: app.popup.modes.allowlist, icon: IconAllowlist },
            ]}
            pill
            value={mode}
          />
          <Segmented
            className="tabular-nums"
            disabled={session.isRunning}
            name="demo-duration"
            onChange={session.setSelectedTime}
            options={presets}
            pill
            value={session.selectedTime}
          />
        </fieldset>
        <StartButton isRunning={session.isRunning} onGiveUp={session.giveUp} onStart={start} />
      </div>
    </figure>
  );
}

type DialProps = {
  secondsLeft: number;
  selectedTime: number;
  isRunning: boolean;
  caption: string;
};

/** The countdown in its ring (dial.tsx and time-field.tsx), without the custom-time editor. */
function Dial({ secondsLeft, selectedTime, isRunning, caption }: DialProps) {
  const time = formatTime(secondsLeft);

  return (
    <div className="relative mx-auto mt-2 mb-1 size-49">
      <ProgressRing isRunning={isRunning} progress={secondsLeft / selectedTime} />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-center">
        <p
          className={cx(
            'min-h-4.5 max-w-37.5 truncate text-xs font-medium',
            isRunning ? 'animate-fade-up text-accent' : 'text-text-faint',
          )}
          key={isRunning ? caption : undefined}
        >
          {caption}
        </p>
        <p
          className={cx(
            'w-41 rounded-full pt-1 pb-1.5 text-center font-semibold leading-none tracking-display tabular-nums',
            time.length > 5 ? 'text-display-sm' : 'text-display',
          )}
        >
          {time}
        </p>
        <p className="min-h-4.5" />
      </div>
    </div>
  );
}

type StartButtonProps = {
  isRunning: boolean;
  onStart: () => void;
  onGiveUp: () => void;
};

/** Start, or give up with a confirming second click, as start-button.tsx does it. */
function StartButton({ isRunning, onStart, onGiveUp }: StartButtonProps) {
  const { app } = useCopy();
  const [armedAt, setArmedAt] = useState<number | null>(null);
  const isArmed = isRunning && armedAt !== null;
  const phase = isArmed ? 'armed' : isRunning ? 'running' : 'idle';
  const { label, variant } = phases[phase];
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (armedAt === null) return;
    const timeout = setTimeout(() => setArmedAt(null), CONFIRM_WINDOW_MS);
    return () => clearTimeout(timeout);
  }, [armedAt]);

  const handleClick = () => {
    setHasChanged(true);
    if (!isRunning) {
      setArmedAt(null);
      return onStart();
    }
    if (armedAt === null) return setArmedAt(Date.now());
    if (Date.now() - armedAt < MIN_CONFIRM_DELAY_MS) return;
    setArmedAt(null);
    onGiveUp();
  };

  return (
    <Button onBlur={() => setArmedAt(null)} onClick={handleClick} pill size="lg" variant={variant}>
      <span aria-live="polite">
        <span className={cx(hasChanged && 'animate-fade-up')} key={phase}>
          {app.popup[label]}
        </span>
      </span>
    </Button>
  );
}
