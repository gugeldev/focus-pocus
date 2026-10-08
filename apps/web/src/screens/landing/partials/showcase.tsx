'use client';

import { Reveal } from '@/components/ui/reveal';
import { useCopy } from '@/lib/i18n-provider';
import { anchors } from '@/lib/routes';
import { FocusScreenMock } from '../mocks/focus-screen-mock';
import { OptionsMock } from '../mocks/options-mock';
import { Section } from './section';
import { SectionHeading } from './section-heading';

/** The settings page, working, under its heading. */
export function SettingsShowcase() {
  const { site } = useCopy();

  return (
    <Section id={anchors.settings}>
      <SectionHeading
        eyebrow={site.settings.eyebrow}
        intro={site.settings.intro}
        title={site.settings.title}
      />
      <Reveal order={1}>
        <OptionsMock />
      </Reveal>
    </Section>
  );
}

/** The focus screen over a blocked site, beside what it does. */
export function FocusScreenShowcase() {
  const { site } = useCopy();

  return (
    <Section
      className="grid items-center gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16"
      id={anchors.focusScreen}
    >
      <SectionHeading
        eyebrow={site.focusScreen.eyebrow}
        intro={site.focusScreen.intro}
        spaced={false}
        title={site.focusScreen.title}
      />
      <Reveal order={1}>
        <FocusScreenMock />
      </Reveal>
    </Section>
  );
}
