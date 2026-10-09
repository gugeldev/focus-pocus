import browser from 'webextension-polyfill';

// Messages sent to the background (src/background/index.ts).
const TIMER_MESSAGE_TYPES = ['TIMER_STARTED', 'TIMER_FINISHED', 'TIMER_GIVEN_UP'] as const;
type TimerMessageType = (typeof TIMER_MESSAGE_TYPES)[number];
type TimerMessage = { type: TimerMessageType };

function isTimerMessage(message: unknown): message is TimerMessage {
  const type = (message as Partial<TimerMessage> | null)?.type;
  return (TIMER_MESSAGE_TYPES as readonly unknown[]).includes(type);
}

function sendTimerMessage(type: TimerMessageType) {
  return browser.runtime.sendMessage({ type });
}

function onTimerMessage(listener: (type: TimerMessageType) => void) {
  browser.runtime.onMessage.addListener((message: unknown) => {
    if (isTimerMessage(message)) listener(message.type);
  });
}

export { onTimerMessage, sendTimerMessage };
