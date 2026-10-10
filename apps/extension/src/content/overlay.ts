import { CONFIRM_WINDOW_MS, MIN_CONFIRM_DELAY_MS } from '@focus-pocus/ui/confirm-timing';
import { formatTime } from '@focus-pocus/ui/format-time';
import { RING_LENGTH, RING_RADIUS } from '@focus-pocus/ui/progress-ring-geometry';
import { applyTheme, type ThemeSetting } from '@focus-pocus/ui/theme';
import browser from 'webextension-polyfill';
import { getMessages, type Locale, type Messages } from '@/lib/i18n';
import overlayStyles from './overlay.css?raw';

// The focus screen. It is a shadow root on a host appended to <html>, so the
// page's styles cannot restyle it and its styles cannot leak into the page.

const HOST_ID = 'focus-pocus-overlay';
const FONT_FAMILY = 'FocusPocus Jakarta';
const FONT_PATH = 'assets/fonts/plus-jakarta-sans-latin-wght-normal.woff2';

const LOGO_PATH = 'assets/logo/icon-128.png';

type OverlayOptions = {
  /** Seconds elapsed in the session (storage's `timer`). */
  timer: number;
  /** The session's length (`selectedTime`): the ring measures the time left against it. */
  totalSeconds: number;
  /** The user's language, which the page around it may not share. */
  locale: Locale;
  theme: ThemeSetting | undefined;
  /** The No giving up switch: the card says so instead of offering Give up. */
  noGiveUp: boolean;
  /** Runs on the confirming second click of Give up. */
  onGiveUp: () => void;
};

let fontLoaded = false;

// A shadow root cannot declare @font-face, so the font is registered on the
// page's document under a name no site will use.
function loadFont() {
  if (fontLoaded) return;
  fontLoaded = true;

  const font = new FontFace(FONT_FAMILY, `url(${browser.runtime.getURL(FONT_PATH)})`, {
    weight: '200 800',
  });
  font
    .load()
    .then((loaded) => document.fonts.add(loaded))
    .catch(() => {
      // The system font stack in overlay.css takes over.
    });
}

// The overlay that is on screen and not on its way out.
function getActiveOverlay() {
  return (
    document
      .getElementById(HOST_ID)
      ?.shadowRoot?.querySelector<HTMLElement>('.overlay:not(.leaving)') ?? null
  );
}

function updateOverlayTime(timer: number, totalSeconds: number) {
  const overlay = getActiveOverlay();
  if (!overlay) return;

  const left = Math.max(totalSeconds - timer, 0);
  const progress = totalSeconds > 0 ? Math.min(left / totalSeconds, 1) : 0;
  const time = overlay.querySelector('.time');
  const arc = overlay.querySelector('.ring-arc');

  if (time) time.textContent = formatTime(left);
  arc?.setAttribute('stroke-dashoffset', String(RING_LENGTH * (1 - progress)));
}

function setOverlayTheme(theme: ThemeSetting | undefined) {
  const overlay = getActiveOverlay();
  if (overlay) applyTheme(overlay, theme);
}

/**
 * Give up takes two clicks, like the popup's button (AGENTS.md section 2.1):
 * the first arms it, a second one inside the confirm window (but not the tail
 * of a double-click) runs `onGiveUp`. It disarms on its own and on blur.
 */
function bindGiveUpButton(
  button: HTMLButtonElement,
  labels: Pick<Messages['overlay'], 'giveUp' | 'confirmGiveUp'>,
  onGiveUp: () => void,
) {
  // Stays in place, so screen readers announce the swap to the armed label.
  const liveRegion = button.querySelector('.give-up-live');
  let armedAt: number | null = null;
  let disarmTimeout: ReturnType<typeof setTimeout> | undefined;

  function render(armed: boolean) {
    button.classList.toggle('armed', armed);
    // A new label, so its entrance plays again and the swap reads as a change.
    const label = document.createElement('span');
    label.className = 'give-up-label swap';
    label.textContent = armed ? labels.confirmGiveUp : labels.giveUp;
    liveRegion?.replaceChildren(label);
  }

  function disarm() {
    clearTimeout(disarmTimeout);
    if (armedAt === null) return;
    armedAt = null;
    render(false);
  }

  button.addEventListener('click', () => {
    if (armedAt === null) {
      armedAt = Date.now();
      disarmTimeout = setTimeout(disarm, CONFIRM_WINDOW_MS);
      return render(true);
    }
    if (Date.now() - armedAt < MIN_CONFIRM_DELAY_MS) return;
    disarm();
    // Stays enabled: the overlay fades out once the session stops, and if the
    // message never lands the user can try again.
    onGiveUp();
  });
  button.addEventListener('blur', disarm);
}

// Give up and its warning, or only a note when No giving up is on.
function renderActions(copy: Messages['overlay'], noGiveUp: boolean) {
  if (noGiveUp) return `<p class="note">${copy.noGiveUp}</p>`;

  return `
    <button class="give-up" type="button">
      <span class="give-up-live" aria-live="polite"><span class="give-up-label">${copy.giveUp}</span></span>
    </button>
    <p class="warning">${copy.warning}</p>`;
}

function showOverlay({ timer, totalSeconds, locale, theme, noGiveUp, onGiveUp }: OverlayOptions) {
  if (getActiveOverlay()) return updateOverlayTime(timer, totalSeconds);

  document.getElementById(HOST_ID)?.remove();
  loadFont();

  const copy = getMessages(locale).overlay;

  const host = document.createElement('div');
  host.id = HOST_ID;
  const shadow = host.attachShadow({ mode: 'open' });
  // Each part of the card rises in turn: --order is its place in the line.
  shadow.innerHTML = `
    <style>${overlayStyles}</style>
    <div class="overlay" lang="${locale}" role="dialog" aria-modal="true" aria-labelledby="title">
      <div class="aura" aria-hidden="true"><span></span><span></span></div>
      <div class="card">
        <img class="logo" style="--order: 0" src="${browser.runtime.getURL(LOGO_PATH)}" alt="" />
        <p class="eyebrow" style="--order: 1"><span class="live-dot"></span>${copy.eyebrow}</p>
        <h1 id="title" style="--order: 2">${copy.title}</h1>
        <p class="lead" style="--order: 3">${copy.lead}</p>
        <div class="clock" style="--order: 4">
          <svg class="spell" viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="99" />
          </svg>
          <svg class="ring" viewBox="0 0 200 200" aria-hidden="true">
            <circle class="ring-track" cx="100" cy="100" r="${RING_RADIUS}" />
            <circle class="ring-arc" cx="100" cy="100" r="${RING_RADIUS}"
              stroke-dasharray="${RING_LENGTH}" stroke-dashoffset="0" />
          </svg>
          <div class="clock-face">
            <p class="time" aria-live="off"></p>
            <p class="time-label">${copy.timeLabel}</p>
          </div>
        </div>
        <div class="actions" style="--order: 5">${renderActions(copy, noGiveUp)}</div>
      </div>
    </div>`;

  const overlay = shadow.querySelector<HTMLElement>('.overlay');
  const giveUpButton = shadow.querySelector<HTMLButtonElement>('.give-up');
  if (overlay) applyTheme(overlay, theme);
  if (giveUpButton) bindGiveUpButton(giveUpButton, copy, onGiveUp);

  document.documentElement.appendChild(host);
  updateOverlayTime(timer, totalSeconds);
}

function hideOverlay() {
  const host = document.getElementById(HOST_ID);
  const overlay = host?.shadowRoot?.querySelector('.overlay');
  if (!host || !overlay) return host?.remove();

  overlay.classList.add('leaving');
  // The card's own entrance animations bubble up here too; only the
  // overlay's fade-out may remove the host.
  overlay.addEventListener('animationend', (event) => {
    if (event.target === overlay) host.remove();
  });
}

export { hideOverlay, setOverlayTheme, showOverlay, updateOverlayTime };
