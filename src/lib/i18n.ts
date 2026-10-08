import browser from 'webextension-polyfill';
import { en, type Messages } from '@/locales/en';
import { es } from '@/locales/es';
import { ptBR } from '@/locales/pt-br';
import { getStorage } from './storage';

// The extension's languages. Every context (popup, options, focus screen,
// background) reads the copy through here, in the language stored under
// `language`, or the browser's own when that is "auto" or unset.

const dictionaries = { en, 'pt-BR': ptBR, es } satisfies Record<string, Messages>;

type Locale = keyof typeof dictionaries;
type LanguageSetting = 'auto' | Locale;

const LOCALES = Object.keys(dictionaries) as Locale[];

/** Each language in its own words, for the picker: they are never translated. */
const LANGUAGE_NAMES: Record<Locale, string> = {
  en: 'English',
  'pt-BR': 'Português',
  es: 'Español',
};

function isLocale(value: unknown): value is Locale {
  return LOCALES.includes(value as Locale);
}

// "pt-PT" and "es-419" get the closest language we have; anything else, English.
function getBrowserLocale(): Locale {
  const language = browser.i18n.getUILanguage().toLowerCase();
  if (language.startsWith('pt')) return 'pt-BR';
  if (language.startsWith('es')) return 'es';
  return 'en';
}

function resolveLocale(setting: LanguageSetting | undefined): Locale {
  return isLocale(setting) ? setting : getBrowserLocale();
}

function getMessages(setting: LanguageSetting | undefined) {
  return dictionaries[resolveLocale(setting)];
}

/** The copy in the stored language, for the contexts outside React. */
function loadMessages() {
  return getStorage('language').then((res) => getMessages(res.language));
}

export type { LanguageSetting, Locale, Messages };
export { getMessages, LANGUAGE_NAMES, LOCALES, loadMessages, resolveLocale };
