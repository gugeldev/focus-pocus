import { cx } from '@focus-pocus/ui/cx';
import logo from '@/assets/logo.png';

/** The extension's two sizes (apps/extension/src/components/brand.tsx), and the site footer's. */
const sizes = {
  sm: { gap: 'gap-2', logo: 'size-5.5', name: 'text-base' },
  md: { gap: 'gap-2.5', logo: 'size-6.5', name: 'text-md' },
  lg: { gap: 'gap-3', logo: 'size-8', name: 'text-lg' },
};

type Props = {
  size: keyof typeof sizes;
  className?: string;
};

/** The wand logo and the name, as the extension's popup and settings open with them. */
export function Brand({ size, className }: Props) {
  const { gap, logo: logoSize, name } = sizes[size];

  return (
    <span className={cx('flex items-center', gap, className)}>
      {/* A 128px PNG drawn at most 32px: next/image would add nothing. */}
      {/* biome-ignore lint/performance/noImgElement: see above */}
      <img alt="" className={cx('rounded-xs', logoSize)} src={logo.src} />
      <span className={cx('font-semibold tracking-brand', name)}>FocusPocus</span>
    </span>
  );
}
