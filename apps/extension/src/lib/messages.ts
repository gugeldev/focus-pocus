import browser from 'webextension-polyfill';

// Messages sent to the background (src/background/index.ts).
type TimerMessageType = 'TIMER_STARTED' | 'TIMER_FINISHED';
type TimerMessage = { type: TimerMessageType };

function isTimerMessage(message: unknown): message is TimerMessage {
  const type = (message as Partial<TimerMessage> | null)?.type;
  return type === 'TIMER_STARTED' || type === 'TIMER_FINISHED';
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
