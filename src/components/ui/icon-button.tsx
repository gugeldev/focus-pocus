import type { ComponentProps } from 'react';
import { cx } from '@/lib/cx';
import type { IconComponent } from './icons';

const tones = {
  neutral: 'enabled:hover:bg-raised-hover enabled:hover:text-text',
  danger: 'enabled:hover:bg-danger-wash enabled:hover:text-danger',
};

type Props = Omit<ComponentProps<'button'>, 'children'> & {
  icon: IconComponent;
  /** Every icon button needs a name: it has no visible text. */
  'aria-label': string;
  tone?: keyof typeof tones;
  pill?: boolean;
};

/** A quiet 32px button holding one 18px icon. */
export function IconButton({
  icon: Icon,
  tone = 'neutral',
  pill,
  className,
  type = 'button',
  ...props
}: Props) {
  return (
    <button
      type={type}
      className={cx(
        'focus-ring inline-flex size-8 shrink-0 items-center justify-center text-text-faint transition-[background-color,color,scale,opacity] duration-(--duration) ease-fluid enabled:active:scale-92',
        tones[tone],
        pill ? 'rounded-full' : 'rounded-sm',
        className,
      )}
      {...props}
    >
      <Icon size={18} aria-hidden="true" />
    </button>
  );
}
