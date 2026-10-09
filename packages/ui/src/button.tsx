import type { ComponentProps } from 'react';
import { cx } from './cx';

// Every class below sets a property the others leave alone, so a variant never
// has to win a specificity fight against the base. Hover and press states use
// `not-disabled:` rather than `enabled:`, because a link (ButtonLink) is never
// `:enabled`.

const variants = {
  primary: 'border-transparent bg-accent-solid text-white not-disabled:hover:bg-accent-solid-hover',
  secondary:
    'border-border bg-raised text-text not-disabled:hover:border-border-strong not-disabled:hover:bg-raised-hover',
  danger:
    'border-danger-line bg-danger-wash text-danger-soft not-disabled:hover:border-transparent not-disabled:hover:bg-danger-solid not-disabled:hover:text-white',
  // The filled, committed form of danger. Same look as danger's hover, so it does
  // not jump under the cursor.
  'danger-solid': 'border-transparent bg-danger-solid text-white',
};

const sizes = {
  md: 'h-10 text-base',
  lg: 'h-11 text-md',
};

type Look = {
  variant: keyof typeof variants;
  size?: keyof typeof sizes;
  /** Fully rounded. The popup uses pills everywhere. */
  pill?: boolean;
};

function buttonClasses({ variant, size = 'md', pill }: Look, className: string | undefined) {
  return cx(
    'focus-ring inline-flex items-center justify-center gap-2 border px-4 font-semibold whitespace-nowrap transition-[background-color,border-color,color,scale,opacity] duration-(--duration) ease-fluid not-disabled:active:scale-97 disabled:cursor-not-allowed disabled:opacity-45',
    variants[variant],
    sizes[size],
    pill ? 'rounded-full' : 'rounded-md',
    className,
  );
}

type Props = ComponentProps<'button'> & Look;

/** A labelled button. Primary is filled violet, danger is for giving up only. */
export function Button({ variant, size, pill, className, type = 'button', ...props }: Props) {
  return (
    <button type={type} className={buttonClasses({ variant, size, pill }, className)} {...props} />
  );
}

type LinkProps = ComponentProps<'a'> & Look;

/** A link that looks like a Button, for an action that goes somewhere else. */
export function ButtonLink({ variant, size, pill, className, ...props }: LinkProps) {
  return <a className={buttonClasses({ variant, size, pill }, className)} {...props} />;
}
