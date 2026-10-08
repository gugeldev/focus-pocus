'use client';

import { getNativeName, LOCALES, type Locale } from '@focus-pocus/locales';
import { cx } from '@focus-pocus/ui/cx';
import {
  IconAllowlist,
  IconBlocklist,
  type IconComponent,
  IconStreak,
  IconSuccess,
} from '@focus-pocus/ui/icons';
import { Segmented } from '@focus-pocus/ui/segmented';
import { Switch } from '@focus-pocus/ui/switch';
import { type ReactNode, useState } from 'react';
import { IconAlerts, IconLanguages, IconPrivate, IconTimer } from '@/components/icons';
import { Reveal } from '@/components/ui/reveal';
import { useCopy } from '@/lib/i18n-provider';
import { anchors } from '@/lib/routes';
import type { SiteCopy } from '@/locales/en';
import { Section } from './section';
import { SectionHeading } from './section-heading';

type FeatureKey = keyof SiteCopy['features']['items'];

/** How much of the bento a card takes from `lg`, and how it lays out. */
const spans = {
  wide: 'md:col-span-2',
  narrow: '',
  full: 'md:col-span-2 lg:col-span-3',
};

type CardProps = {
  feature: FeatureKey;
  icon: IconComponent;
  span: keyof typeof spans;
  order: number;
  /** A working piece of the extension that shows the feature. */
  children?: ReactNode;
};

/** One feature: its icon, claim and line, over the piece of the extension it is about. */
function FeatureCard({ feature, icon: Icon, span, order, children }: CardProps) {
  const { site } = useCopy();
  const { title, body } = site.features.items[feature];

  return (
    <Reveal className={cx('min-w-0', spans[span])} order={order}>
      <div
        className={cx(
          'flex h-full flex-col justify-between gap-8 rounded-panel bg-surface p-8',
          span === 'full' && 'lg:flex-row lg:items-center',
        )}
      >
        <div className="flex max-w-md flex-col gap-2.5">
          <span className="mb-2 flex size-10 items-center justify-center rounded-lg bg-accent-wash text-accent">
            <Icon aria-hidden="true" size={20} />
          </span>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-pretty text-text-muted">{body}</p>
        </div>
        {children}
      </div>
    </Reveal>
  );
}

/** What it does, as a bento of cards, most of them holding a working piece of the extension. */
export function Features() {
  const { site } = useCopy();

  return (
    <Section id={anchors.features}>
      <SectionHeading eyebrow={site.features.eyebrow} title={site.features.title} />
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard feature="lists" icon={IconBlocklist} order={0} span="wide">
          <ListsPiece />
        </FeatureCard>
        <FeatureCard feature="streak" icon={IconStreak} order={1} span="narrow">
          <StreakPiece />
        </FeatureCard>
        <FeatureCard feature="timer" icon={IconTimer} order={0} span="narrow">
          <TimerPiece />
        </FeatureCard>
        <FeatureCard feature="alerts" icon={IconAlerts} order={1} span="narrow">
          <AlertsPiece />
        </FeatureCard>
        <FeatureCard feature="languages" icon={IconLanguages} order={2} span="narrow">
          <LanguagesPiece />
        </FeatureCard>
        <FeatureCard feature="private" icon={IconPrivate} order={0} span="full">
          <PrivatePiece />
        </FeatureCard>
      </div>
    </Section>
  );
}

const listSites = {
  blocklist: ['youtube.com', 'x.com'],
  allowlist: ['docs.google.com', 'github.com'],
};

/** The popup's mode switch over the list it picks. */
function ListsPiece() {
  const { app } = useCopy();
  const [mode, setMode] = useState<'blocklist' | 'allowlist'>('blocklist');

  return (
    <div className="flex flex-col gap-3">
      <Segmented
        name="feature-mode"
        onChange={setMode}
        options={[
          { value: 'blocklist', label: app.popup.modes.blocklist, icon: IconBlocklist },
          { value: 'allowlist', label: app.popup.modes.allowlist, icon: IconAllowlist },
        ]}
        pill
        value={mode}
      />
      <ul className="flex flex-col">
        {listSites[mode].map((url) => (
          <li
            className="flex animate-site-in items-center gap-3 border-b border-border py-2.5 last:border-b-0"
            key={url}
          >
            <span
              aria-hidden="true"
              className="flex size-7 shrink-0 items-center justify-center rounded-md bg-raised-hover text-xs font-bold text-text-muted uppercase"
            >
              {url.charAt(0)}
            </span>
            <span className="text-md font-medium">{url}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The streak, the way the popup's top bar shows it, grown. */
function StreakPiece() {
  const { app } = useCopy();

  return (
    <p className="flex items-baseline gap-3">
      <IconStreak aria-hidden="true" className="self-center text-streak" size={40} weight="fill" />
      <span className="text-overlay-time font-semibold tracking-overlay-time tabular-nums">12</span>
      <span className="text-text-muted">{app.options.inARow}</span>
    </p>
  );
}

const timerPresets = [
  { value: 900, label: '15m' },
  { value: 1500, label: '25m' },
  { value: 3600, label: '1h' },
];

/** A few of the popup's presets. */
function TimerPiece() {
  const [time, setTime] = useState(1500);

  return (
    <Segmented
      className="tabular-nums"
      name="feature-time"
      onChange={setTime}
      options={timerPresets}
      pill
      value={time}
    />
  );
}

/** Two of the settings page's switches, off until turned on. */
function AlertsPiece() {
  const { app } = useCopy();
  const { sounds, notifications } = app.options.general;
  const [on, setOn] = useState({ sound: false, notification: true });

  return (
    <div className="flex flex-col">
      {(
        [
          ['notification', notifications.finished.label],
          ['sound', sounds.victory.label],
        ] as const
      ).map(([key, label]) => (
        <label
          className="flex cursor-pointer items-center justify-between gap-4 border-b border-border py-2.5 last:border-b-0"
          key={key}
        >
          <span className="text-md font-medium">{label}</span>
          <Switch
            checked={on[key]}
            onChange={(event) => setOn({ ...on, [key]: event.target.checked })}
          />
        </label>
      ))}
    </div>
  );
}

/** The settings page's language picker, each language in its own words. */
function LanguagesPiece() {
  const [language, setLanguage] = useState<Locale>('pt-BR');

  return (
    <Segmented<Locale>
      name="feature-language"
      onChange={setLanguage}
      options={LOCALES.map((locale) => ({ value: locale, label: getNativeName(locale) }))}
      pill
      value={language}
    />
  );
}

/** What FocusPocus never asks for or sends, as checked chips. */
function PrivatePiece() {
  const { site } = useCopy();

  return (
    <ul className="flex flex-wrap gap-2">
      {site.features.items.private.tags.map((tag) => (
        <li
          className="inline-flex items-center gap-2 rounded-full bg-raised py-2 pr-4 pl-3 text-base text-text-muted"
          key={tag}
        >
          <IconSuccess aria-hidden="true" className="text-success" size={16} weight="fill" />
          {tag}
        </li>
      ))}
    </ul>
  );
}
