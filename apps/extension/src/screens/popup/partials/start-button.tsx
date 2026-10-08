import { Button } from '@focus-pocus/ui/button';
import { cx } from '@focus-pocus/ui/cx';
import { useEffect, useRef, useState } from 'react';
import { useMessages } from '@/lib/use-messages';

/** How long the button waits for the second click before disarming. */
const CONFIRM_WINDOW_MS = 3000;

/** A confirming click sooner than this is the tail of a double-click, not a decision. */
const MIN_CONFIRM_DELAY_MS = 400;

/** The copy key and the button variant of each phase. */
const phases = {
  idle: { label: 'start', variant: 'primary' },
  running: { label: 'giveUp', variant: 'danger' },
  armed: { label: 'confirmGiveUp', variant: 'danger-solid' },
} as const;

/** Whether `value` has been different from what it was on the first render. */
function useHasChanged<T>(value: T) {
  const initial = useRef(value);
  const [hasChanged, setHasChanged] = useState(false);
  if (!hasChanged && value !== initial.current) setHasChanged(true);
  return hasChanged;
}

/**
 * An action that takes two clicks: `confirm` arms it the first time and runs
 * `onConfirmed` the second, if that comes within the confirm window but not as
 * part of a double-click. Only armed while `enabled`.
 */
function useConfirmTwice(enabled: boolean) {
  const [armedAt, setArmedAt] = useState<number | null>(null);
  const isArmed = enabled && armedAt !== null;

  useEffect(() => {
    if (armedAt === null) return;
    const timeout = setTimeout(() => setArmedAt(null), CONFIRM_WINDOW_MS);
    return () => clearTimeout(timeout);
  }, [armedAt]);

  function confirm(onConfirmed: () => void) {
    if (!isArmed) return setArmedAt(Date.now());
    if (Date.now() - armedAt < MIN_CONFIRM_DELAY_MS) return;
    setArmedAt(null);
    onConfirmed();
  }

  return { isArmed, confirm, disarm: () => setArmedAt(null) };
}

type Props = {
  isRunning: boolean;
  /** Starts a session, or gives up the running one once the give up is confirmed. */
  onPress: () => void;
};

/**
 * Start focusing, or Give up during a session, which resets the streak and so
 * asks for a second click. The label slides in when it changes, not when the
 * popup opens.
 */
export function StartButton({ isRunning, onPress }: Props) {
  const t = useMessages();
  const { isArmed, confirm, disarm } = useConfirmTwice(isRunning);
  const phase = isArmed ? 'armed' : isRunning ? 'running' : 'idle';
  const { label: labelKey, variant } = phases[phase];
  const label = t.popup[labelKey];
  const labelHasChanged = useHasChanged(phase);

  function handleClick() {
    if (isRunning) return confirm(onPress);
    disarm(); // a leftover from a session that ended while armed
    onPress();
  }

  return (
    <Button pill size="lg" variant={variant} onClick={handleClick} onBlur={disarm}>
      {/* Stays mounted so screen readers announce the swap to the armed label. */}
      <span aria-live="polite">
        <span key={phase} className={cx(labelHasChanged && 'animate-fade-up')}>
          {label}
        </span>
      </span>
    </Button>
  );
}
