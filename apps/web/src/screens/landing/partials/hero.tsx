'use client';

import { IconExternal, IconGithub } from '@/components/icons';
import { StoreButtons } from '@/components/store-buttons';
import { Rise } from '@/components/ui/rise';
import { useCopy } from '@/lib/i18n-provider';
import { links } from '@/lib/links';
import { anchors } from '@/lib/routes';
import { OptionsMock } from '../mocks/options-mock';
import { PopupMock } from '../mocks/popup-mock';
import { Section } from './section';

/**
 * The first screen, centered: what it is and the stores, then the extension
 * itself, working: the settings page in a browser, the popup hanging off its
 * right edge the way it opens from the toolbar.
 */
export function Hero() {
  const { site } = useCopy();

  return (
    <Section className="flex flex-col items-center pt-10 text-center md:pt-16">
      <Rise>
        <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 py-1.5 pr-3.5 pl-2.5 text-sm text-text-muted backdrop-blur">
          <span aria-hidden="true" className="relative flex size-2">
            <span className="absolute inset-0 animate-ripple rounded-full bg-accent" />
            <span className="relative size-2 rounded-full bg-accent" />
          </span>
          {site.hero.badge}
        </p>
      </Rise>
      <Rise className="mt-7 max-w-4xl" order={1}>
        <h1 className="text-balance text-hero font-medium tracking-hero">
          {site.hero.titleLead}{' '}
          <span className="bg-linear-100 from-accent via-lilac to-accent bg-clip-text pr-[0.06em] text-transparent">
            {site.hero.titleAccent}
          </span>
        </h1>
      </Rise>
      <Rise className="mt-6 max-w-2xl" order={2}>
        <p className="text-pretty text-lead text-text-muted">{site.hero.lead}</p>
      </Rise>
      <Rise className="mt-9 flex flex-wrap justify-center gap-3" order={3}>
        <StoreButtons />
      </Rise>
      <Rise className="mt-6" order={4}>
        <a
          className="focus-ring group inline-flex items-center gap-2 rounded-sm text-base text-text-muted transition-colors duration-(--duration) ease-fluid hover:text-text"
          href={links.github}
        >
          <IconGithub aria-hidden="true" size={18} />
          {site.hero.github}
          <IconExternal
            aria-hidden="true"
            className="text-text-faint transition-[color,translate] duration-(--duration) ease-fluid group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-text"
            size={14}
          />
        </a>
      </Rise>
      <Rise className="mt-16 w-full text-left md:mt-20" order={5}>
        <Demo />
      </Rise>
    </Section>
  );
}

/**
 * The browser and the popup. From `lg` the popup overlaps the browser's top
 * right corner and sticks out past it, up and right. Below, the settings page
 * would not fit beside it, so only the popup shows.
 */
function Demo() {
  return (
    <div className="relative scroll-mt-24 lg:pr-24" id={anchors.demo}>
      {/* A violet halo under both, so they read as lit from the page. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -inset-y-24 -z-10 rounded-full bg-radial-[closest-side] from-glow to-transparent"
      />
      <div className="hidden lg:block">
        <OptionsMock />
      </div>
      <div className="relative z-10 flex justify-center lg:absolute lg:-top-12 lg:right-0">
        <div className="motion-safe:animate-float">
          <PopupMock />
        </div>
      </div>
    </div>
  );
}
