'use client';

import { ButtonLink } from '@focus-pocus/ui/button';
import { cx } from '@focus-pocus/ui/cx';
import { Brand } from '@/components/brand';
import { IconGithub } from '@/components/icons';
import { useCopy, useLocale } from '@/lib/i18n-provider';
import { links } from '@/lib/links';
import { anchors, homeRoute } from '@/lib/routes';
import { useScrolled } from '@/lib/use-scrolled';

const bar = {
  top: 'h-17 max-w-6xl rounded-none bg-canvas/0 px-4 sm:px-6',
  scrolled:
    'h-15 max-w-5xl rounded-full bg-raised/80 pr-2.5 pl-5 shadow-header backdrop-blur-xl backdrop-saturate-150',
};

/**
 * Sticky. At the top it is part of the page; once the page scrolls it pulls in
 * to a floating pill over a blur of the page. On a narrow screen the section
 * links go, and it keeps the brand, GitHub and the install. The blur is the pill's
 * only: at the top it would cut a box out of the page's glow.
 */
export function SiteHeader() {
  const { site } = useCopy();
  const locale = useLocale();
  const scrolled = useScrolled(24);
  const sections = [
    { anchor: anchors.focusScreen, label: site.nav.focusScreen },
    { anchor: anchors.features, label: site.nav.features },
    { anchor: anchors.reviews, label: site.nav.reviews },
  ];

  return (
    <header
      className={cx(
        'sticky top-0 z-50 transition-[padding] duration-450 ease-settle',
        scrolled ? 'px-3 pt-3' : 'p-0',
      )}
    >
      <div
        className={cx(
          'mx-auto flex items-center justify-between gap-5 transition-all duration-450 ease-settle',
          scrolled ? bar.scrolled : bar.top,
        )}
      >
        <a
          aria-label={site.nav.home}
          className="focus-ring flex-none rounded-sm"
          href={homeRoute(locale)}
        >
          <Brand size="md" />
        </a>
        <nav className="hidden min-w-0 flex-1 justify-center gap-1 md:flex">
          {sections.map(({ anchor, label }) => (
            <a
              className="focus-ring rounded-full px-3.5 py-1.5 text-base text-text-muted transition-colors duration-(--duration) ease-fluid hover:text-text"
              href={homeRoute(locale, anchor)}
              key={anchor}
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex flex-none items-center gap-1.5">
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
