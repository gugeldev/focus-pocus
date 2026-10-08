'use client';

import { IconBlocklist, type IconComponent, IconStreak } from '@focus-pocus/ui/icons';
import { IconAlerts, IconLanguages, IconPrivate, IconTimer } from '@/components/icons';
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
        {features.map(([key, Icon]) => (
          <li className="flex flex-col gap-2 rounded-xl bg-surface p-6 shadow-card" key={key}>
            {/* The tile of the settings page's empty lists. */}
            <span className="mb-3 flex size-11 items-center justify-center rounded-lg bg-accent-wash text-accent inset-ring inset-ring-accent-dim">
              <Icon aria-hidden="true" size={22} />
            </span>
            <h3 className="text-lg font-semibold">{site.features.items[key].title}</h3>
            <p className="text-pretty text-text-muted">{site.features.items[key].body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
