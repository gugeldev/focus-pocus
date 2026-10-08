'use client';

import { createContext, type ReactNode, use } from 'react';
import { type Copy, getCopy, type Locale } from '@/lib/i18n';

const LocaleContext = createContext<Locale | null>(null);

/** Mounted once by the root layout with the locale from the URL. */
export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext value={locale}>{children}</LocaleContext>;
}

export function useLocale(): Locale {
  const locale = use(LocaleContext);
  if (!locale) throw new Error('useLocale: no I18nProvider above this component');
  return locale;
}

/**
 * The copy in the page's language: `site` for the page, `app` for the drawings
 * of the extension. A component reads it here, in whichever component shows it.
 */
export function useCopy(): Copy {
  return getCopy(useLocale());
}
