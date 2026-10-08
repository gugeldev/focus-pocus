import { cx } from '@focus-pocus/ui/cx';
import { IconSparkle } from '@/components/icons';

/**
 * Where each sparkle sits around the title (as a share of its box), how big
 * it is and when it twinkles, so they never light up together.
 */
const sparkles = [
  { top: '-6%', left: '6%', size: 18, delay: '0s', tone: 'text-accent' },
  { top: '30%', left: '-3%', size: 11, delay: '1.4s', tone: 'text-fuchsia' },
  { top: '92%', left: '14%', size: 14, delay: '2.6s', tone: 'text-accent' },
  { top: '-10%', left: '78%', size: 12, delay: '0.8s', tone: 'text-fuchsia' },
  { top: '46%', left: '101%', size: 17, delay: '2s', tone: 'text-accent' },
  { top: '96%', left: '86%', size: 10, delay: '3.2s', tone: 'text-fuchsia' },
];

/**
 * The spell over the title: the wand logo's four-pointed sparkles, twinkling
 * one after another around it. Decorative; under reduced motion they stay
 * hidden.
 */
export function Sparkles() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden motion-safe:block"
    >
      {sparkles.map(({ top, left, size, delay, tone }) => (
        <IconSparkle
          className={cx('absolute animate-twinkle opacity-0', tone)}
          key={`${top}-${left}`}
          size={size}
          style={{ top, left, animationDelay: delay }}
          weight="fill"
        />
      ))}
    </span>
  );
}
