import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { notFound } from 'next/navigation';
import { getCopy, isLocale, LOCALES } from '@/lib/i18n';
import { I18nProvider } from '@/lib/i18n-provider';
import '../globals.css';

// The extension's typeface, self-hosted by next/font at build time.
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-jakarta',
});

// Only the three locales exist; any other first segment is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const { meta } = getCopy(locale).site;
  // The deployed origin. The language alternates need absolute URLs, so
  // without it (a local build) they are left out rather than relative.
  const siteUrl = process.env.SITE_URL;
  return {
    metadataBase: siteUrl ? new URL(siteUrl) : undefined,
    title: meta.title,
    description: meta.description,
    alternates: siteUrl
      ? {
          languages: {
            ...Object.fromEntries(LOCALES.map((other) => [other, `/${other}`])),
            'x-default': '/',
          },
        }
      : undefined,
    openGraph: { title: meta.title, description: meta.description, type: 'website' },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    // `.js` lands on <html> before the first paint, so React finds a class it did not render.
    <html className={`${jakarta.variable} theme-light`} lang={locale} suppressHydrationWarning>
      <head>
        {/* Marks a page running scripts, so `Reveal` hides only what it will reveal. */}
        <script>{"document.documentElement.classList.add('js')"}</script>
      </head>
      <body>
        <I18nProvider locale={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}
