import type { ThemeSetting } from '@focus-pocus/ui/theme';
import { type Locale, resolveLocale } from '@/lib/i18n';
import { sendTimerMessage } from '@/lib/messages';
import { playSound } from '@/lib/play-sound';
import { getStorage, onStorageChanged } from '@/lib/storage';
import { hideOverlay, setOverlayTheme, showOverlay, updateOverlayTime } from './overlay';

let blocklist: string[] = [];
let allowlist: string[] = [];
let allowlistMode = false;
let selectedTime = 0;
let locale: Locale = resolveLocale('auto');
let theme: ThemeSetting | undefined;

function shouldBlock() {
  const url = window.location.href;
  return allowlistMode
    ? !allowlist.some((entry) => url.includes(entry))
    : blocklist.some((entry) => url.includes(entry));
}

// The background stops the session and resets the streak (it owns the
// toolbar icon, which a content script cannot reach); the sound plays here,
// where the click was.
function giveUp() {
  sendTimerMessage('TIMER_GIVEN_UP');
  playSound('giveup');
}

function applyFocusMode(timer: number) {
  if (!shouldBlock()) return hideOverlay();

  showOverlay({
    timer,
    totalSeconds: selectedTime,
    locale,
    theme,
    onGiveUp: giveUp,
  });
}

function initialize() {
  getStorage([
    'blocklist',
    'allowlist',
    'isRunning',
    'options',
    'selectedTime',
    'timer',
    'language',
    'theme',
  ]).then((res) => {
    blocklist = res.blocklist ?? [];
    allowlist = res.allowlist ?? [];
    allowlistMode = Boolean(res.options?.['allowlist-mode']);
    selectedTime = res.selectedTime;
    locale = resolveLocale(res.language);
    theme = res.theme;

    if (res.isRunning) applyFocusMode(res.timer);
  });
}

onStorageChanged((changes) => {
  if (changes.blocklist) blocklist = changes.blocklist.newValue ?? [];
  if (changes.allowlist) allowlist = changes.allowlist.newValue ?? [];
  if (changes.options) allowlistMode = Boolean(changes.options.newValue?.['allowlist-mode']);
  if (changes.selectedTime?.newValue) selectedTime = changes.selectedTime.newValue;
  if (changes.language) locale = resolveLocale(changes.language.newValue);
  if (changes.theme) {
    theme = changes.theme.newValue;
    setOverlayTheme(theme);
  }

  if (changes.isRunning) {
    if (changes.isRunning.newValue) applyFocusMode(0);
    else hideOverlay();
  }

  if (changes.timer?.newValue !== undefined)
    updateOverlayTime(changes.timer.newValue, selectedTime);
});

initialize();
