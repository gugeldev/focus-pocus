import { Button } from '@focus-pocus/ui/button';
import { cx } from '@focus-pocus/ui/cx';
import { useConfirmTwice } from '@focus-pocus/ui/use-confirm-twice';
import { useRef, useState } from 'react';
import { useMessages } from '@/lib/use-messages';

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
