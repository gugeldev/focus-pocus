import browser from 'webextension-polyfill';
import { formatTime } from '@/lib/format-time';
import { getMessages, type Locale } from '@/lib/i18n';
import overlayStyles from './overlay.css?raw';

// The focus screen. It is a shadow root on a host appended to <html>, so the
// page's styles cannot restyle it and its styles cannot leak into the page.

const HOST_ID = 'focus-pocus-overlay';
const FONT_FAMILY = 'FocusPocus Jakarta';
const FONT_PATH = 'assets/fonts/plus-jakarta-sans-latin-wght-normal.woff2';

const LOGO_PATH = 'assets/logo/icon-128.png';

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

function updateOverlayTime(secondsLeft: number) {
  const time = getActiveOverlay()?.querySelector('.time');
  if (time) time.textContent = formatTime(Math.max(secondsLeft, 0));
}

// `locale` is the user's language, which the page around it may not share.
function showOverlay(secondsLeft: number, locale: Locale) {
  if (getActiveOverlay()) return updateOverlayTime(secondsLeft);

  document.getElementById(HOST_ID)?.remove();
  loadFont();

  const copy = getMessages(locale).overlay;

  const host = document.createElement('div');
  host.id = HOST_ID;
  const shadow = host.attachShadow({ mode: 'open' });
  shadow.innerHTML = `
    <style>${overlayStyles}</style>
    <div class="overlay" lang="${locale}" role="dialog" aria-modal="true" aria-labelledby="title">
      <div class="card">
        <img class="logo" src="${browser.runtime.getURL(LOGO_PATH)}" alt="" />
        <p class="eyebrow">${copy.eyebrow}</p>
        <h1 id="title">${copy.title}</h1>
        <p class="lead">${copy.lead}</p>
        <p class="time" aria-live="off"></p>
        <p class="time-label">${copy.timeLabel}</p>
        <p class="warning">${copy.warning}</p>
      </div>
    </div>`;

  document.documentElement.appendChild(host);
  updateOverlayTime(secondsLeft);
}

function hideOverlay() {
  const host = document.getElementById(HOST_ID);
  const overlay = host?.shadowRoot?.querySelector('.overlay');
  if (!host || !overlay) return host?.remove();

  overlay.classList.add('leaving');
  // The card's own entrance animation bubbles up here too; only the
  // overlay's fade-out may remove the host.
  overlay.addEventListener('animationend', (event) => {
    if (event.target === overlay) host.remove();
  });
}

export { hideOverlay, showOverlay, updateOverlayTime };
