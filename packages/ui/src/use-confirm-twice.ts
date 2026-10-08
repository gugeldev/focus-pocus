import { useEffect, useState } from 'react';
import { CONFIRM_WINDOW_MS, MIN_CONFIRM_DELAY_MS } from './confirm-timing';

/**
 * An action that takes two clicks: `confirm` arms it the first time and runs
 * `onConfirmed` the second, if that comes within the confirm window but not as
 * part of a double-click. Only armed while `enabled`.
 */
export function useConfirmTwice(enabled = true) {
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
