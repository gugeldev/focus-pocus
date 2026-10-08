import { useEffect, useMemo, useRef, useState } from 'react';
import { handleStartTimer } from '@/background/services/timer';
import { sendTimerMessage } from '@/lib/messages';
import { playSound } from '@/lib/play-popup-sounds';
import { useMessages } from '@/lib/use-messages';
import { useStorage } from '@/lib/use-storage';
import { Dial } from '@/screens/popup/partials/dial';
import { SessionSettings } from '@/screens/popup/partials/session-settings';
import { StartButton } from '@/screens/popup/partials/start-button';
import { TopBar } from '@/screens/popup/partials/top-bar';
import { presets } from '@/screens/popup/presets';

/**
 * Re-sends TIMER_STARTED when the popup opens mid-session, which recreates the
 * background's interval if Chrome unloaded the service worker. Runs once, on
 * the first read of storage.
 */
function useWakeBackground(isRunning: boolean | undefined) {
  const hasChecked = useRef(false);

  useEffect(() => {
    if (isRunning === undefined || hasChecked.current) return;
    hasChecked.current = true;
    if (isRunning) sendTimerMessage('TIMER_STARTED');
  }, [isRunning]);
}

/**
 * Plays the victory sound and bumps the streak when it goes up while the popup
 * is open. Returns whether it is bumping, and how to end it.
 */
function useCelebration(streak: number | undefined) {
  const previous = useRef(streak);
  const [isCelebrating, setIsCelebrating] = useState(false);

  useEffect(() => {
    if (previous.current !== undefined && streak !== undefined && streak > previous.current) {
      playSound('finished');
      setIsCelebrating(true);
    }
    previous.current = streak;
  }, [streak]);

  return [isCelebrating, () => setIsCelebrating(false)] as const;
}

function pickRandom(items: string[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function startOrGiveUp() {
  playSound('button');
  handleStartTimer();
}

/**
 * The toolbar popup: the countdown, the mode and duration, and the button that
 * starts a session or gives it up.
 */
export default function PopupScreen() {
  const [state, update] = useStorage('timer', 'selectedTime', 'isRunning', 'options', 'streak');
  const t = useMessages();
  const isRunning = Boolean(state?.isRunning);
  // A new one each time a session starts, or when the popup opens mid-session
  // (or the language changes).
  // biome-ignore lint/correctness/useExhaustiveDependencies: isRunning and the language pick a new message
  const runningCaption = useMemo(() => pickRandom(t.popup.encouragements), [isRunning, t]);
  const [isCelebrating, endCelebration] = useCelebration(state?.streak);
  useWakeBackground(state?.isRunning);

  if (!state) return null;

  const { timer, selectedTime, options, streak } = state;
  const isPreset = presets.some((preset) => preset.value === selectedTime);
  const idleCaption = isPreset ? '' : t.popup.customSession;

  return (
    <>
      <TopBar streak={streak} isCelebrating={isCelebrating} onCelebrated={endCelebration} />
      <main className="flex flex-col gap-4 px-4 pt-2 pb-4">
        <Dial
          secondsLeft={isRunning ? Math.max(selectedTime - timer, 0) : selectedTime}
          selectedTime={selectedTime}
          isRunning={isRunning}
          caption={isRunning ? runningCaption : idleCaption}
          onCustomTime={(seconds) => update({ selectedTime: seconds })}
        />
        <SessionSettings
          mode={options?.['allowlist-mode'] ? 'allowlist' : 'blocklist'}
          selectedTime={selectedTime}
          disabled={isRunning}
          onModeChange={(mode) =>
            update({ options: { ...options, 'allowlist-mode': mode === 'allowlist' } })
          }
          onTimeChange={(seconds) => update({ selectedTime: seconds })}
        />
        <StartButton isRunning={isRunning} onPress={startOrGiveUp} />
      </main>
    </>
  );
}
