import { cx } from './cx';

const RADIUS = 94;
const LENGTH = 2 * Math.PI * RADIUS;

type Props = {
  /** From 1 (full) to 0 (empty). */
  progress: number;
  /** The accent ring only shows during a session; the track is always there. */
  isRunning: boolean;
};

/** The track and the accent arc that empties as the session runs. */
export function ProgressRing({ progress, isRunning }: Props) {
  return (
    <svg className="size-full -rotate-90" viewBox="0 0 200 200" aria-hidden="true">
      <circle className="fill-none stroke-border stroke-2" cx="100" cy="100" r={RADIUS} />
      <circle
        className={cx(
          'fill-none stroke-accent stroke-3 transition-[stroke-dashoffset,opacity] duration-[1s,var(--duration-enter)] ease-[linear,var(--ease-fluid)] [stroke-linecap:round]',
          !isRunning && 'opacity-0',
        )}
        cx="100"
        cy="100"
        r={RADIUS}
        strokeDasharray={LENGTH}
        strokeDashoffset={LENGTH * (1 - progress)}
      />
    </svg>
  );
}
