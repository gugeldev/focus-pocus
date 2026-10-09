import { cx } from '@focus-pocus/ui/cx';

/** The two glows' size and strength: `lg` for the slides and the marquee, `sm` for a small tile. */
const glows = {
  lg: {
    top: '-top-60 -left-60 size-180 from-accent-solid/17',
    bottom: '-right-60 -bottom-60 size-180 from-accent-solid/17',
  },
  sm: {
    top: '-top-24 -left-24 size-64 from-accent-solid/8',
    bottom: '-right-24 -bottom-24 size-64 from-accent-solid/8',
  },
};

/** The site's backdrop behind a store image: a dot grid fading down and two violet glows. */
export function Backdrop({ size = 'lg' }: { size?: keyof typeof glows }) {
  const glow = glows[size];

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-dots mask-radial-[70%_60%] mask-radial-at-top mask-radial-from-10%" />
      <div
        className={cx('absolute rounded-full bg-radial-[closest-side] to-transparent', glow.top)}
      />
      <div
        className={cx('absolute rounded-full bg-radial-[closest-side] to-transparent', glow.bottom)}
      />
    </div>
  );
}
