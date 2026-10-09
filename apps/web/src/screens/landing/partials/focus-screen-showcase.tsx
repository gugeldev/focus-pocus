'use client';

import { FocusScreenMock } from '@/components/mocks/focus-screen-mock';
import { Reveal } from '@/components/motion';
import { useCopy } from '@/lib/i18n-provider';
import { anchors } from '@/lib/routes';
import { Section } from './section';
import { SectionHeading } from './section-heading';

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
