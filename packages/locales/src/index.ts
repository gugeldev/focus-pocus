import { en, type Messages } from './en';
import { es } from './es';
import { ptBR } from './pt-br';

// The extension's languages: its UI copy in each one. The extension picks one
// from the user's setting or the browser; the website, from the URL, so its
// drawings of the extension speak the visitor's language.

/**
 * One row per language: its copy, its name in its own words (for the pickers,
 * never translated) and the language-tag prefix it answers to.
 */
const languages = {
  en: { messages: en, nativeName: 'English', tagPrefix: 'en' },
  'pt-BR': { messages: ptBR, nativeName: 'Português', tagPrefix: 'pt' },
  es: { messages: es, nativeName: 'Español', tagPrefix: 'es' },
} satisfies Record<string, { messages: Messages; nativeName: string; tagPrefix: string }>;

type Locale = keyof typeof languages;

const LOCALES = Object.keys(languages) as Locale[];

function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && Object.hasOwn(languages, value);
}

/**
 * The language a tag like "pt-PT" or "es-419" gets: the closest one we have,
 * or undefined when we have none.
 */
function findLocaleForTag(tag: string): Locale | undefined {
  const lowerTag = tag.toLowerCase();
  return LOCALES.find((locale) => lowerTag.startsWith(languages[locale].tagPrefix));
}

function getMessages(locale: Locale): Messages {
  return languages[locale].messages;
}

function getNativeName(locale: Locale) {
  return languages[locale].nativeName;
}

export type { Locale, Messages };
export { findLocaleForTag, getMessages, getNativeName, isLocale, LOCALES };
