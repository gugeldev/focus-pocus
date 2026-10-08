'use client';

import { IconBlocklist, type IconComponent, IconStreak } from '@focus-pocus/ui/icons';
import { IconAlerts, IconLanguages, IconPrivate, IconTimer } from '@/components/icons';
import { Reveal } from '@/components/ui/reveal';
import { useCopy } from '@/lib/i18n-provider';
import { anchors } from '@/lib/routes';
import type { SiteCopy } from '@/locales/en';
import { Section } from './section';
import { SectionHeading } from './section-heading';

type FeatureKey = keyof SiteCopy['features']['items'];

/** Each feature's icon, in page order. */
const features: [FeatureKey, IconComponent][] = [
  ['lists', IconBlocklist],
  ['timer', IconTimer],
  ['streak', IconStreak],
  ['alerts', IconAlerts],
  ['languages', IconLanguages],
  ['private', IconPrivate],
];

/** What it does, in six cards. */
export function Features() {
  const { site } = useCopy();

  return (
    <Section id={anchors.features}>
      <SectionHeading eyebrow={site.features.eyebrow} title={site.features.title} />
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(([key, Icon], index) => (
          <li key={key}>
            <Reveal className="h-full" order={index % 3}>
              <div className="group flex h-full flex-col gap-2 rounded-2xl border border-border/60 bg-surface p-7 transition-[border-color,translate] duration-(--duration-layout) ease-fluid hover:-translate-y-1 hover:border-border-strong">
                {/* The tile of the settings page's empty lists. */}
                <span className="mb-4 flex size-11 items-center justify-center rounded-lg bg-accent-wash text-accent inset-ring inset-ring-accent-dim transition-transform duration-(--duration-layout) ease-spring group-hover:scale-110">
                  <Icon aria-hidden="true" size={22} />
                </span>
                <h3 className="text-lg font-medium">{site.features.items[key].title}</h3>
                <p className="text-pretty text-text-muted">{site.features.items[key].body}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
