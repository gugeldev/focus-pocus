'use client';

import { createContext, type ReactNode, use, useMemo } from 'react';
import { type Copy, getCopy, type Locale } from '@/lib/i18n';

const LocaleContext = createContext<Locale>('en');

/** Mounted once by the root layout with the locale from the URL. */
export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext value={locale}>{children}</LocaleContext>;
}

export function useLocale(): Locale {
  return use(LocaleContext);
}

/**
 * The copy in the page's language: `site` for the page, `app` for the drawings
 * of the extension. A component reads it here, in whichever component shows it.
 */
export function useCopy(): Copy {
  const locale = useLocale();

  return useMemo(() => getCopy(locale), [locale]);
}
