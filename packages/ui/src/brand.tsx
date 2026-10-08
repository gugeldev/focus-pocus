import { cx } from './cx';

const sizes = {
  sm: { gap: 'gap-2', logo: 'size-5.5', name: 'text-base' },
  md: { gap: 'gap-2.5', logo: 'size-6.5', name: 'text-md' },
  lg: { gap: 'gap-3', logo: 'size-8', name: 'text-lg' },
};

type Props = {
  /** `sm` in the popup's top bar, `md` in the options sidebar and the site header, `lg` in the site footer. */
  size: keyof typeof sizes;
  /** Where the page finds the wand logo: each app serves it from its own files. */
  logoSrc: string;
  className?: string;
};

/** The wand logo and the name, as the popup and the options page open with them. */
export function Brand({ size, logoSrc, className }: Props) {
  const { gap, logo, name } = sizes[size];

  return (
    <span className={cx('flex items-center', gap, className)}>
      <img className={cx('rounded-xs', logo)} src={logoSrc} alt="" />
      <span className={cx('font-semibold tracking-brand', name)}>FocusPocus</span>
    </span>
  );
}
