import { type NextRequest, NextResponse } from 'next/server';
import { LOCALES, preferredLocale } from '@/lib/i18n';

/**
 * Every page lives under its locale. A path without one is sent to the same
 * path under the browser's best match; a locale in the wrong case (`/pt-br`)
 * to its own spelling.
 */
export function proxy(request: NextRequest) {
  const [, first = '', ...rest] = request.nextUrl.pathname.split('/');
  const named = LOCALES.find((locale) => locale.toLowerCase() === first.toLowerCase());
  if (named === first) return;

  const url = request.nextUrl.clone();
  url.pathname = named
    ? ['', named, ...rest].join('/')
    : `/${preferredLocale(request.headers.get('accept-language'))}${url.pathname === '/' ? '' : url.pathname}`;
  const response = NextResponse.redirect(url);
  // The target depends on the browser's languages: a cache must not hand one visitor's to the next.
  response.headers.set('Vary', 'Accept-Language');
  return response;
}

export const config = {
  // Not Next's own files, nor anything with an extension (images, the icon).
  matcher: ['/((?!_next|.*\\..*).*)'],
};
