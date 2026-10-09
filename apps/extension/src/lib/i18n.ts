import {
  findLocaleForTag,
  getMessages,
  getNativeName,
  isLocale,
  LOCALES,
  type Locale,
  type Messages,
} from '@focus-pocus/locales';
import browser from 'webextension-polyfill';
import { getStorage } from './storage';

// The extension's language. Every context (popup, options, focus screen,
// background) reads the copy through here, in the language stored under
// `language`, or the browser's own when that is "auto" or unset. The copy
// itself lives in packages/locales, which the website shares.

type LanguageSetting = 'auto' | Locale;

// "pt-PT" and "es-419" get the closest language we have; anything else, English.
function getBrowserLocale(): Locale {
  return findLocaleForTag(browser.i18n.getUILanguage()) ?? 'en';
}

function resolveLocale(setting: LanguageSetting | undefined): Locale {
  return isLocale(setting) ? setting : getBrowserLocale();
}

/** The copy in the stored language, for the contexts outside React. */
function loadMessages() {
  return getStorage('language').then((res) => getMessages(resolveLocale(res.language)));
}

export type { LanguageSetting, Locale, Messages };
export { getMessages, getNativeName, LOCALES, loadMessages, resolveLocale };
