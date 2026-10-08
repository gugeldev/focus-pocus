'use client';

import { IconExternal, IconGithub } from '@/components/icons';
import { StoreButtons } from '@/components/store-buttons';
import { useCopy } from '@/lib/i18n-provider';
import { links } from '@/lib/links';
import { PopupMock } from '../mocks/popup-mock';
import { Section } from './section';

/** The first screen: what it is, the stores, and the popup itself, working. */
export function Hero() {
  const { site } = useCopy();

  return (
    <Section className="grid items-center gap-14 pt-12 md:pt-20 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-20">
      <div className="flex flex-col items-start gap-6">
        <p className="inline-flex items-center gap-2 rounded-full bg-surface py-1.5 pr-3.5 pl-2.5 text-sm font-medium text-text-muted">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
          {site.hero.badge}
        </p>
        <h1 className="text-balance text-hero font-bold tracking-hero">{site.hero.title}</h1>
        <p className="max-w-xl text-pretty text-lead text-text-muted">{site.hero.lead}</p>
        <div className="flex flex-wrap gap-3">
          <StoreButtons />
        </div>
        <a
          className="focus-ring group inline-flex items-center gap-2 rounded-sm text-base font-medium text-text-muted transition-colors duration-(--duration) ease-fluid hover:text-text"
          href={links.github}
        >
          <IconGithub aria-hidden="true" size={18} />
          {site.hero.github}
          <IconExternal
            aria-hidden="true"
            className="text-text-faint transition-colors duration-(--duration) ease-fluid group-hover:text-text"
            size={14}
          />
        </a>
      </div>
      <div className="flex flex-col items-center gap-4 justify-self-center">
        <PopupMock />
        <p className="max-w-72 text-center text-sm text-text-faint">{site.hero.tryIt}</p>
      </div>
    </Section>
  );
}
