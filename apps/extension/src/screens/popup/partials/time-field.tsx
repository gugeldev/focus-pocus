import { cx } from '@focus-pocus/ui/cx';
import { type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useMessages } from '@/lib/use-messages';
import { parseCustomTime } from '@/screens/popup/parse-custom-time';

const SHORT_TIME_LENGTH = 5; // "mm:ss"

// The digits sit low in their line box (the font keeps room for descenders),
// so the bottom padding is larger to center them on the hover background.
const TIME_CLASSES =
  'w-41 rounded-full pt-1 pb-1.5 text-center font-semibold leading-none tracking-display tabular-nums';

/** Times with hours ("1:30:00") would overflow the ring at full size. */
function timeSize(text: string) {
  return text.length > SHORT_TIME_LENGTH ? 'text-display-sm' : 'text-display';
}

/**
 * Whether the custom-time input is open, and its draft. A session that starts
 * while it is open closes it.
 */
function useTimeEditor(time: string, isRunning: boolean, onSave: (seconds: number) => void) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState('');
  // Removing the focused input can fire one last blur; this keeps it from
  // saving a draft that Esc already cancelled.
  const isEditingRef = useRef(false);

  const open = () => {
    isEditingRef.current = true;
    setDraft(time);
    setIsEditing(true);
  };

  const close = (save: boolean) => {
    if (!isEditingRef.current) return;
    isEditingRef.current = false;
    setIsEditing(false);

    const totalSeconds = save ? parseCustomTime(draft) : null;
    if (totalSeconds !== null) onSave(totalSeconds);
  };

  useEffect(() => {
    if (isRunning) {
      isEditingRef.current = false;
      setIsEditing(false);
    }
  }, [isRunning]);

  return { isEditing, draft, setDraft, open, close };
}

type Props = {
  /** The formatted time on display. */
  time: string;
  isRunning: boolean;
  onCustomTime: (seconds: number) => void;
};

/**
 * The time and the hint under it. While idle, clicking the time swaps it for
 * an input: Enter or blur saves, Esc cancels.
 */
export function TimeField({ time, isRunning, onCustomTime }: Props) {
  const t = useMessages();
  const editor = useTimeEditor(time, isRunning, onCustomTime);
  const timeButtonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') editor.close(true);
    if (event.key === 'Escape') {
      event.preventDefault();
      editor.close(false);
      requestAnimationFrame(() => timeButtonRef.current?.focus());
    }
  };

  return (
    <>
      {editor.isEditing ? (
        <input
          className={cx(
            TIME_CLASSES,
            timeSize(editor.draft),
            'bg-sunken text-text outline-none inset-ring inset-ring-border-focus placeholder:text-text-placeholder',
          )}
          type="text"
          inputMode="numeric"
          placeholder="mm:ss"
          maxLength={8}
          aria-label={t.popup.customTimeLabel}
          value={editor.draft}
          onChange={(event) => editor.setDraft(event.target.value)}
          onFocus={(event) => event.target.select()}
          onBlur={() => editor.close(true)}
          onKeyDown={handleKeyDown}
          // biome-ignore lint/a11y/noAutofocus: the input only appears because the user clicked the time
          autoFocus
        />
      ) : (
        <button
          ref={timeButtonRef}
          type="button"
          className={cx(
            TIME_CLASSES,
            timeSize(time),
            'focus-ring text-text transition-colors duration-(--duration) ease-fluid enabled:hover:bg-raised disabled:cursor-default',
          )}
          title={t.popup.customTimeTitle}
          disabled={isRunning}
          onClick={editor.open}
        >
          {time}
        </button>
      )}

      {/* The hint only shows up when you reach for the time (the Dial is the group). */}
      <p
        className={cx(
          'min-h-4.5 text-xs text-text-faint opacity-0 transition-opacity duration-(--duration) ease-fluid',
          !isRunning && 'group-focus-within:opacity-100 group-hover:opacity-100',
        )}
      >
        {editor.isEditing ? t.popup.customTimeEditingHint : t.popup.customTimeHint}
      </p>
    </>
  );
}
