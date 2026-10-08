'use client';

import { getNativeName } from '@focus-pocus/locales';
import type { ReactNode } from 'react';
import { Brand } from '@/components/brand';
import { LOCALES } from '@/lib/i18n';
import { useCopy, useLocale } from '@/lib/i18n-provider';
import { links } from '@/lib/links';
import { homeRoute } from '@/lib/routes';

const link =
  'focus-ring rounded-sm text-text-muted transition-colors duration-(--duration) ease-fluid hover:text-text';

/** The brand and what it is, where to get it, the project's links, the languages, the credits. */
export function SiteFooter() {
  const { site } = useCopy();
  const locale = useLocale();

  return (
    <footer className="mt-8 border-t border-border">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-8 gap-y-10 px-4 py-14 sm:px-6 md:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
        <div className="col-span-2 flex flex-col items-start gap-4 md:col-span-1">
          <Brand size="lg" />
          <p className="max-w-xs text-text-muted">{site.footer.tagline}</p>
        </div>
        <Column title={site.footer.get}>
          <a className={link} href={links.chrome}>
            Chrome Web Store
          </a>
          <a className={link} href={links.firefox}>
            Firefox Add-ons
          </a>
        </Column>
        <Column title={site.footer.project}>
          <a className={link} href={links.github}>
            {site.footer.source}
          </a>
          <a className={link} href={links.issues}>
            {site.footer.issues}
          </a>
          <a className={link} href={links.support}>
            {site.footer.support}
          </a>
          <a className={link} href={links.license}>
            {site.footer.license}
          </a>
        </Column>
        <Column title={site.footer.languages}>
          {LOCALES.map((other) => (
            <a
              aria-current={other === locale ? 'page' : undefined}
              className={`${link} aria-[current=page]:text-text`}
              href={homeRoute(other)}
              hrefLang={other}
              key={other}
              lang={other}
            >
              {getNativeName(other)}
            </a>
          ))}
        </Column>
      </div>
      <p className="mx-auto max-w-6xl px-4 pb-10 text-sm text-text-faint sm:px-6">
        {site.footer.madeBy}{' '}
        <a className={link} href={links.maintainer}>
          @gugeldev
        </a>{' '}
        {site.footer.andContributors}
      </p>
    </footer>
  );
}

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <nav aria-label={title} className="flex flex-col items-start gap-3">
      <h2 className="mb-1 text-xs font-medium tracking-label text-text-faint uppercase">{title}</h2>
      {children}
    </nav>
  );
}
