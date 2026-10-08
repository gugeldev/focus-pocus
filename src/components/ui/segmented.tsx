import type { CSSProperties, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import type { IconComponent } from './icons';

type Option<T extends string | number> = {
  value: T;
  label: ReactNode;
  icon?: IconComponent;
};

type Props<T extends string | number> = {
  /** The radios' shared name. */
  name: string;
  options: Option<T>[];
  /** A value that matches no option checks nothing, and the thumb fades out. */
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  /**
   * Fully rounded. A pill's thumb is a pill too, so it keeps a wider gap to
   * the track: the thumb's radius is the track's minus that gap.
   */
  pill?: boolean;
  className?: string;
};

/** Radios in a sunken track, with one thumb that slides to the checked option. */
export function Segmented<T extends string | number>({
  name,
  options,
  value,
  onChange,
  disabled,
  pill,
  className,
}: Props<T>) {
  const activeIndex = options.findIndex((option) => option.value === value);
  const vars = {
    '--gap': pill ? '4px' : '3px',
    '--segments': options.length,
    '--active': Math.max(activeIndex, 0),
  } as CSSProperties;

  return (
    <div
      className={cx(
        'relative grid auto-cols-fr grid-flow-col border border-transparent bg-sunken p-(--gap)',
        pill ? 'rounded-full' : 'rounded-md',
        disabled && 'opacity-45',
        className,
      )}
      style={vars}
    >
      <span
        aria-hidden="true"
        className={cx(
          'absolute inset-y-(--gap) left-(--gap) w-[calc((100%-2*var(--gap))/var(--segments))] translate-x-[calc(100%*var(--active))] bg-raised-hover shadow-subtle transition-[translate,opacity] duration-(--duration-layout) ease-fluid',
          pill ? 'rounded-full' : 'rounded-sm',
          activeIndex === -1 && 'opacity-0',
        )}
      />
      {options.map(({ value: optionValue, label, icon: OptionIcon }) => (
        <label
          key={optionValue}
          className={cx(
            // 1px down puts Plus Jakarta Sans (which sits high at this size)
            // and the icon centered on it on the thumb's middle.
            'relative flex h-8 items-center justify-center gap-1.5 pt-px text-sm font-medium text-text-faint transition-colors duration-(--duration) ease-fluid has-checked:text-text has-focus-visible:outline-2 has-focus-visible:outline-offset-1 has-focus-visible:outline-accent',
            pill ? 'rounded-full' : 'rounded-sm',
            disabled
              ? 'cursor-not-allowed'
              : 'cursor-pointer hover:not-has-checked:text-text-muted',
          )}
        >
          <input
            type="radio"
            name={name}
            value={optionValue}
            checked={optionValue === value}
            disabled={disabled}
            onChange={() => onChange(optionValue)}
            className="pointer-events-none absolute opacity-0"
          />
          {OptionIcon && <OptionIcon size={14} aria-hidden="true" />}
          {label}
        </label>
      ))}
    </div>
  );
}
