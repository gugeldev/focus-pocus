import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cx } from '@/lib/cx';

/** Whether `value` has been different from what it was on the first render. */
function useHasChanged<T>(value: T) {
  const initial = useRef(value);
  const [hasChanged, setHasChanged] = useState(false);
  if (!hasChanged && value !== initial.current) setHasChanged(true);
  return hasChanged;
}

type Props = {
  isRunning: boolean;
  /** Starts a session, or gives up the running one. */
  onPress: () => void;
};

/**
 * Start focusing, or Give up during a session. The label slides in when it
 * changes, not when the popup opens.
 */
export function StartButton({ isRunning, onPress }: Props) {
  const labelHasChanged = useHasChanged(isRunning);

  return (
    <Button pill size="lg" variant={isRunning ? 'danger' : 'primary'} onClick={onPress}>
      <span key={String(isRunning)} className={cx(labelHasChanged && 'animate-fade-up')}>
        {isRunning ? 'Give up' : 'Start focusing'}
      </span>
    </Button>
  );
}
