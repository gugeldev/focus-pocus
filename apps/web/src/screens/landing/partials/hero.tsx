'use client';

import { IconExternal, IconGithub } from '@/components/icons';
import { StoreButtons } from '@/components/store-buttons';
import { Rise } from '@/components/ui/rise';
import { useCopy } from '@/lib/i18n-provider';
import { links } from '@/lib/links';
import { PopupMock } from '../mocks/popup-mock';
import { Section } from './section';

/** The first screen: what it is, the stores, and the popup itself, working. */
export function Hero() {
  const { site } = useCopy();

  return (
    <Section className="grid items-center gap-16 pt-10 md:pt-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20">
      <div className="flex flex-col items-start gap-7">
        <Rise>
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 py-1.5 pr-3.5 pl-2.5 text-sm text-text-muted backdrop-blur">
            <span aria-hidden="true" className="relative flex size-2">
              <span className="absolute inset-0 animate-ripple rounded-full bg-accent" />
              <span className="relative size-2 rounded-full bg-accent" />
            </span>
            {site.hero.badge}
          </p>
        </Rise>
        <Rise order={1}>
          <h1 className="text-balance text-hero font-medium tracking-hero">
            {site.hero.titleLead}{' '}
            <span className="bg-linear-100 from-accent via-lilac to-accent bg-clip-text pr-[0.06em] text-transparent">
              {site.hero.titleAccent}
            </span>
          </h1>
        </Rise>
        <Rise order={2}>
          <p className="max-w-xl text-pretty text-lead text-text-muted">{site.hero.lead}</p>
        </Rise>
        <Rise className="flex flex-wrap gap-3" order={3}>
          <StoreButtons />
        </Rise>
        <Rise order={4}>
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
      </div>
      <Rise className="flex flex-col items-center gap-5 justify-self-center" order={2}>
        <div className="relative motion-safe:animate-float">
          {/* A violet halo under the popup, so it reads as lit from the page. */}
          <div
            aria-hidden="true"
            className="absolute -inset-16 -z-10 rounded-full bg-radial from-glow to-transparent to-70%"
          />
          <PopupMock />
        </div>
        <p className="max-w-72 text-center text-sm text-text-faint">{site.hero.tryIt}</p>
      </Rise>
    </Section>
  );
}
