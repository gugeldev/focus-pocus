'use client';

import { ButtonLink } from '@focus-pocus/ui/button';
import { IconGithub } from '@/components/icons';
import { StoreButtons } from '@/components/store-buttons';
import { Reveal } from '@/components/ui/reveal';
import { useCopy } from '@/lib/i18n-provider';
import { links } from '@/lib/links';
import { anchors } from '@/lib/routes';
import { Section } from './section';

/** The last ask: the stores, and the way to the code. */
export function Install() {
  const { site } = useCopy();

  return (
    <Section id={anchors.install}>
      <Reveal className="relative isolate flex flex-col items-center gap-6 overflow-hidden rounded-panel bg-surface px-6 py-16 text-center md:py-24">
        <div
          aria-hidden="true"
          className="absolute -top-1/2 left-1/2 -z-10 h-full w-4/5 -translate-x-1/2 rounded-full bg-radial-[closest-side] from-glow to-transparent"
        />
        <h2 className="text-balance text-section font-medium tracking-section">
          {site.install.title}
        </h2>
        <p className="text-lead text-text-muted">{site.install.body}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <StoreButtons />
        </div>
        <div className="mt-6 flex w-full max-w-md flex-col items-center gap-4 border-t border-border pt-8">
          <p className="text-pretty text-text-muted">{site.install.openSource}</p>
          <ButtonLink href={links.github} pill variant="secondary">
            <IconGithub aria-hidden="true" size={18} />
            {site.install.contribute}
          </ButtonLink>
        </div>
      </Reveal>
    </Section>
  );
}
