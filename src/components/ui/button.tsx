import type { ComponentProps } from 'react';
import { cx } from '@/lib/cx';

// Every class below sets a property the others leave alone, so a variant never
// has to win a specificity fight against the base.

const variants = {
  primary: 'border-transparent bg-accent-solid text-white enabled:hover:bg-accent-solid-hover',
  secondary:
    'border-border bg-raised text-text enabled:hover:border-border-strong enabled:hover:bg-raised-hover',
  danger:
    'border-danger-line bg-danger-wash text-danger-soft enabled:hover:border-transparent enabled:hover:bg-danger-solid enabled:hover:text-white',
  // The filled, committed form of danger. Same look as danger's hover, so it does
  // not jump under the cursor.
  'danger-solid': 'border-transparent bg-danger-solid text-white',
};

const sizes = {
  md: 'h-10 text-base',
  lg: 'h-11 text-md',
};

type Props = ComponentProps<'button'> & {
  variant: keyof typeof variants;
  size?: keyof typeof sizes;
  /** Fully rounded. The popup uses pills everywhere. */
  pill?: boolean;
};

/** A labelled button. Primary is filled violet, danger is for giving up only. */
export function Button({
  variant,
  size = 'md',
  pill,
  className,
  type = 'button',
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={cx(
        'focus-ring inline-flex items-center justify-center gap-2 border px-4 font-semibold whitespace-nowrap transition-[background-color,border-color,color,scale,opacity] duration-(--duration) ease-fluid enabled:active:scale-97 disabled:cursor-not-allowed disabled:opacity-45',
        variants[variant],
        sizes[size],
        pill ? 'rounded-full' : 'rounded-md',
        className,
      )}
      {...props}
    />
  );
}
