import { cx } from '@/lib/cx';
import { formatTime } from '@/lib/format-time';
import { useMessages } from '@/lib/use-messages';
import { ProgressRing } from '@/screens/popup/partials/progress-ring';
import { TimeField } from '@/screens/popup/partials/time-field';

type Props = {
  secondsLeft: number;
  selectedTime: number;
  isRunning: boolean;
  /** The line above the time; empty for a preset while idle. */
  caption: string;
  onCustomTime: (seconds: number) => void;
};

/** The countdown inside its progress ring, with a caption above it. */
export function Dial({ secondsLeft, selectedTime, isRunning, caption, onCustomTime }: Props) {
  const t = useMessages();

  return (
    <section className="group relative mx-auto mt-2 mb-1 size-49" aria-label={t.popup.timer}>
      <ProgressRing progress={secondsLeft / selectedTime} isRunning={isRunning} />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-center">
        <p
          // A new message slides in each time it changes.
          key={isRunning ? caption : undefined}
          className={cx(
            'min-h-4.5 max-w-37.5 truncate text-xs font-medium',
            isRunning ? 'animate-fade-up text-accent' : 'text-text-faint',
          )}
        >
          {caption}
        </p>
        <TimeField
          time={formatTime(secondsLeft)}
          isRunning={isRunning}
          onCustomTime={onCustomTime}
        />
      </div>
    </section>
  );
}
