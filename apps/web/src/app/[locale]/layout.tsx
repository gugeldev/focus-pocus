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

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const { meta } = getCopy(locale).site;
  return {
    // The deployed origin, so the language alternates resolve to absolute URLs.
    metadataBase: process.env.SITE_URL ? new URL(process.env.SITE_URL) : undefined,
    title: meta.title,
    description: meta.description,
    alternates: {
      languages: {
        ...Object.fromEntries(LOCALES.map((other) => [other, `/${other}`])),
        'x-default': '/',
      },
    },
    openGraph: { title: meta.title, description: meta.description, type: 'website' },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html className={jakarta.variable} lang={locale}>
      <body>
        <I18nProvider locale={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}
