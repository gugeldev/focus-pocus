/**
 * The website's languages: the extension's three, from packages/locales. The
 * locale is the first segment of the URL (`/pt-BR`), so a page renders on the
 * server in one language and a shared link opens in the language it was shared
 * in; `proxy.ts` sends `/` to the best match for the browser's languages.
 */
import {
  findLocaleForTag,
  getMessages,
  isLocale,
  LOCALES,
  type Locale,
  type Messages,
} from '@focus-pocus/locales';
import { en, type SiteCopy } from '@/locales/en';
import { es } from '@/locales/es';
import { ptBR } from '@/locales/pt-br';

const siteCopy: Record<Locale, SiteCopy> = { en, 'pt-BR': ptBR, es };

/** The page's copy, and the extension's own for the drawings of its screens. */
export type Copy = { site: SiteCopy; app: Messages };

export function getCopy(locale: Locale): Copy {
  return { site: siteCopy[locale], app: getMessages(locale) };
}

/**
 * The best locale for an `Accept-Language` header: its languages in the
 * browser's order of preference (by `q`), the first one we have. A browser set
 * to [fr, pt] gets Portuguese rather than falling all the way to English.
 */
export function preferredLocale(acceptLanguage: string | null): Locale {
  const ranked = (acceptLanguage ?? '')
    .split(',')
    .map((part) => {
      const [tag = '', ...params] = part.trim().split(';');
      const q = params.find((param) => param.trim().startsWith('q='));
      return { tag, q: q ? Number(q.trim().slice(2)) : 1 };
    })
    .filter(({ tag, q }) => tag !== '' && q > 0)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const locale = findLocaleForTag(tag);
    if (locale) return locale;
  }

  return 'en';
}

export { isLocale, LOCALES, type Locale };
