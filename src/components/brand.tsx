import { cx } from '@/lib/cx';

const sizes = {
  sm: { gap: 'gap-2', logo: 'size-5.5', name: 'text-base' },
  md: { gap: 'gap-2.5', logo: 'size-6.5', name: 'text-md' },
};

type Props = {
  /** `sm` in the popup's top bar, `md` in the options sidebar. */
  size: keyof typeof sizes;
  className?: string;
};

/** The wand logo and the name, as the popup and the options page open with them. */
export function Brand({ size, className }: Props) {
  const { gap, logo, name } = sizes[size];

  return (
    <div className={cx('flex items-center', gap, className)}>
      <img className={cx('rounded-xs', logo)} src="../assets/logo/icon-64.png" alt="" />
      <span className={cx('font-semibold tracking-brand', name)}>FocusPocus</span>
    </div>
  );
}
