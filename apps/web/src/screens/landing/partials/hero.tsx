'use client';

import { OptionsMock } from '@/components/mocks/options-mock';
import { PopupMock } from '@/components/mocks/popup-mock';
import { Rise } from '@/components/motion';
import { StoreButtons } from '@/components/store-buttons';
import { useCopy } from '@/lib/i18n-provider';
import { Section } from './section';
import { Silk } from './silk';
import { Sparkles } from './sparkles';

/**
 * The first screen, centered: what it is and the stores, then the extension
 * itself, working: the settings page in a browser, the popup hanging off its
 * right edge the way it opens from the toolbar.
 */
export function Hero() {
  const { site } = useCopy();

  return (
    <Section className="flex flex-col items-center text-center">
      <Rise className="max-w-4xl">
        <h1 className="relative text-balance text-hero font-medium tracking-hero">
          {site.hero.titleLead} <span className="text-text-muted">{site.hero.titleAccent}</span>
          <Sparkles />
        </h1>
      </Rise>
      <Rise className="mt-6 max-w-2xl" order={1}>
        <p className="text-pretty text-lead text-text-muted">{site.hero.lead}</p>
      </Rise>
      <Rise className="mt-9 flex w-full justify-center" order={2}>
        <StoreButtons />
      </Rise>
      <Rise className="mt-16 w-full text-left md:mt-20" order={3}>
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
    <div className="relative lg:pr-24">
      {/* The silk sweeping behind both, wider than the page's column. */}
      <Silk className="absolute top-1/2 left-1/2 -z-10 h-[150%] w-[180%] -translate-x-1/2 -translate-y-[45%]" />
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
