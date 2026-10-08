import { IconStreak } from '@/components/ui/icons';
import { cx } from '@/lib/cx';
import { shareStreak } from '@/lib/share-streak';

type Props = {
  streak: number;
  /** Bumps the pill once; onCelebrated fires when the bump is over. */
  isCelebrating: boolean;
  onCelebrated: () => void;
};

/** The flame pill in the top bar. Clicking it copies the streak to share it. */
export function StreakButton({ streak, isCelebrating, onCelebrated }: Props) {
  return (
    <button
      type="button"
      className={cx(
        'focus-ring inline-flex h-8 items-center gap-1 rounded-full pr-3 pl-2.5 text-sm font-semibold text-text-muted tabular-nums transition-colors duration-(--duration) ease-fluid hover:bg-raised-hover hover:text-text',
        isCelebrating && 'animate-bump',
      )}
      title="Copy your streak"
      onClick={() => shareStreak(streak)}
      onAnimationEnd={onCelebrated}
    >
      <IconStreak weight="fill" size={15} className="text-streak" aria-hidden="true" />
      <span>{streak}</span>
      <span className="sr-only">sessions in a row, copy to share</span>
    </button>
  );
}
