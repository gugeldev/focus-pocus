'use client';

import { ButtonLink } from '@focus-pocus/ui/button';
import { Brand } from '@/components/brand';
import { IconGithub } from '@/components/icons';
import { useCopy, useLocale } from '@/lib/i18n-provider';
import { links } from '@/lib/links';
import { anchors, homeRoute } from '@/lib/routes';

/** Sticky, over a blur of the page: the brand, the sections, the code and the install. */
export function SiteHeader() {
  const { site } = useCopy();
  const locale = useLocale();
  const sections = [
    { anchor: anchors.settings, label: site.nav.settings },
    { anchor: anchors.focusScreen, label: site.nav.focusScreen },
    { anchor: anchors.features, label: site.nav.features },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <a aria-label={site.nav.home} className="focus-ring rounded-sm" href={homeRoute(locale)}>
          <Brand size="md" />
        </a>
        <nav className="hidden items-center gap-1 md:flex">
          {sections.map(({ anchor, label }) => (
            <a
              className="focus-ring rounded-full px-3 py-1.5 text-base font-medium text-text-muted transition-colors duration-(--duration) ease-fluid hover:bg-item-hover hover:text-text"
              href={homeRoute(locale, anchor)}
              key={anchor}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a
            aria-label={site.nav.github}
            className="focus-ring inline-flex size-10 items-center justify-center rounded-full text-text-muted transition-colors duration-(--duration) ease-fluid hover:bg-raised-hover hover:text-text"
            href={links.github}
            title={site.nav.github}
          >
            <IconGithub aria-hidden="true" size={20} />
          </a>
          <ButtonLink href={homeRoute(locale, anchors.install)} pill variant="primary">
            {site.nav.install}
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
