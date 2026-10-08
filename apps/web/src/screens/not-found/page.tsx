'use client';

import { ButtonLink } from '@focus-pocus/ui/button';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { useCopy, useLocale } from '@/lib/i18n-provider';
import { homeRoute } from '@/lib/routes';

/** A path under a locale that is not a page: the frame, one line and the way home. */
export default function NotFoundPage() {
  const { site } = useCopy();
  const locale = useLocale();

  return (
    <>
      <SiteHeader />
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-8 px-4 text-center">
        <h1 className="text-balance text-section font-medium tracking-section">
          {site.notFound.title}
        </h1>
        <ButtonLink href={homeRoute(locale)} pill size="lg" variant="primary">
          {site.notFound.back}
        </ButtonLink>
      </main>
      <SiteFooter />
    </>
  );
}
