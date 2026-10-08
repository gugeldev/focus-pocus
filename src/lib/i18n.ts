import browser from 'webextension-polyfill';
import { en, type Messages } from '@/locales/en';
import { es } from '@/locales/es';
import { ptBR } from '@/locales/pt-br';
import { getStorage } from './storage';

// The extension's languages. Every context (popup, options, focus screen,
// background) reads the copy through here, in the language stored under
// `language`, or the browser's own when that is "auto" or unset.

/**
 * One row per language: its copy, its name in its own words (for the picker,
 * never translated) and the browser language prefix it answers to.
 */
const languages = {
  en: { messages: en, nativeName: 'English', browserPrefix: 'en' },
  'pt-BR': { messages: ptBR, nativeName: 'Português', browserPrefix: 'pt' },
  es: { messages: es, nativeName: 'Español', browserPrefix: 'es' },
} satisfies Record<string, { messages: Messages; nativeName: string; browserPrefix: string }>;

type Locale = keyof typeof languages;
type LanguageSetting = 'auto' | Locale;

const LOCALES = Object.keys(languages) as Locale[];

function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && Object.hasOwn(languages, value);
}

// "pt-PT" and "es-419" get the closest language we have; anything else, English.
function getBrowserLocale(): Locale {
  const language = browser.i18n.getUILanguage().toLowerCase();
  return LOCALES.find((locale) => language.startsWith(languages[locale].browserPrefix)) ?? 'en';
}

function resolveLocale(setting: LanguageSetting | undefined): Locale {
  return isLocale(setting) ? setting : getBrowserLocale();
}

function getMessages(locale: Locale): Messages {
  return languages[locale].messages;
}

function getNativeName(locale: Locale) {
  return languages[locale].nativeName;
}

/** The copy in the stored language, for the contexts outside React. */
function loadMessages() {
  return getStorage('language').then((res) => getMessages(resolveLocale(res.language)));
}

export type { LanguageSetting, Locale, Messages };
export { getMessages, getNativeName, LOCALES, loadMessages, resolveLocale };
