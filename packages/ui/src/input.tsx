import type { ComponentProps } from 'react';
import { cx } from './cx';

/** A text field. Focus only lightens its border; things you press get the ring. */
export function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      className={cx(
        'h-10 w-full rounded-md border border-border bg-sunken px-3 text-base leading-normal outline-none transition-[border-color,opacity] duration-(--duration) ease-fluid placeholder:text-text-placeholder enabled:hover:border-border-strong focus-visible:border-border-focus disabled:cursor-not-allowed disabled:opacity-45',
        className,
      )}
      {...props}
    />
  );
}
