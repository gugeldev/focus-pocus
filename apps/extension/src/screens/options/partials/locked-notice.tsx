import { cx } from '@focus-pocus/ui/cx';
import type { ReactNode } from 'react';

type Props = {
  isRunning: boolean;
  children: ReactNode;
};

/**
 * Says why the controls below are locked. It opens over its real height while
 * a session runs; the negative margin cancels the page's gap while it is closed.
 */
export function LockedNotice({ isRunning, children }: Props) {
  return (
    <div
      role="status"
      // Closed, it is only invisible: keep it from being read out too.
      aria-hidden={!isRunning}
      className={cx(
        'grid transition-[grid-template-rows,margin-bottom,opacity] duration-(--duration-layout) ease-fluid',
        isRunning ? 'grid-rows-[1fr] opacity-100' : '-mb-7 grid-rows-[0fr] opacity-0',
      )}
    >
      <div
        className={cx(
          'flex min-h-0 items-center gap-2.5 overflow-hidden rounded-lg bg-accent-wash text-sm font-medium text-accent',
          isRunning && 'border border-accent-dim px-3.5 py-3',
        )}
      >
        <span
          aria-hidden="true"
          className="relative size-2 shrink-0 rounded-full bg-accent after:absolute after:inset-0 after:animate-ripple after:rounded-full after:bg-accent"
        />
        {children}
      </div>
    </div>
  );
}
