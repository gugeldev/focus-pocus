'use client';

import { getNativeName, LOCALES, type Locale } from '@focus-pocus/locales';
import { Button } from '@focus-pocus/ui/button';
import { cx } from '@focus-pocus/ui/cx';
import { IconButton } from '@focus-pocus/ui/icon-button';
import { IconAdd, IconAllowlist, IconBlocklist, IconRemove } from '@focus-pocus/ui/icons';
import { Input } from '@focus-pocus/ui/input';
import { Segmented } from '@focus-pocus/ui/segmented';
import { Switch } from '@focus-pocus/ui/switch';
import { type FormEvent, type ReactNode, useState } from 'react';
import { useCopy } from '@/lib/i18n-provider';

// The settings page's two kinds of tab, drawn from
// apps/extension/src/screens/options/partials/ with the same classes. Plain
// elements instead of the page's sections and headings: inside the drawing
// they are a picture, not landmarks of the website.

export type ListType = 'blocklist' | 'allowlist';

/** The General tab's switches, by their key in the extension's `options` storage. */
export type Switches = Partial<Record<SwitchKey, boolean>>;

type SwitchKey =
  | 'button-sound'
  | 'victorious-sound'
  | 'give-up-sound'
  | 'victorious-notification'
  | 'allowlist-mode';

const listIcons = { blocklist: IconBlocklist, allowlist: IconAllowlist };

type TabPageProps = {
  title: string;
  description: string;
  badge?: ReactNode;
  children: ReactNode;
};

/** tab-page.tsx: title, description and content in one centered column. */
function TabPage({ title, description, badge, children }: TabPageProps) {
  return (
    <div className="mx-auto flex w-full max-w-160 animate-page-in flex-col gap-7 px-5 py-8 wide:px-8 wide:py-10">
      <div>
        <div className="flex items-center gap-3.5">
          <p className="text-2xl leading-title font-bold tracking-title">{title}</p>
          {badge}
        </div>
        <p className={cx('text-md text-text-muted', badge ? 'mt-3' : 'mt-2')}>{description}</p>
      </div>
      {children}
    </div>
  );
}

/** settings-section.tsx: a titled group of rows under a hairline. */
function SettingsSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 not-first-of-type:border-t not-first-of-type:border-border not-first-of-type:pt-7">
      <p className="text-xs font-semibold tracking-label text-text-faint uppercase">{title}</p>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}

type SettingRowProps = {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

/** setting-row.tsx: a switch with its label and description; the whole row toggles it. */
function SettingRow({ label, description, checked, onCheckedChange }: SettingRowProps) {
  return (
    <label className="-mx-3 flex cursor-pointer items-center justify-between gap-6 rounded-lg px-3 py-3.5 transition-colors duration-(--duration) ease-fluid hover:bg-item-hover">
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-md font-medium">{label}</span>
        <span className="text-sm text-text-muted">{description}</span>
      </span>
      <Switch checked={checked} onChange={(event) => onCheckedChange(event.target.checked)} />
    </label>
  );
}

type GeneralPaneProps = {
  switches: Switches;
  onChange: (switches: Switches) => void;
};

/** general-tab.tsx: the language, sounds, notifications and the blocking mode. */
export function GeneralPane({ switches, onChange }: GeneralPaneProps) {
  const { app } = useCopy();
  const copy = app.options.general;
  const [language, setLanguage] = useState<'auto' | Locale>('auto');
  const row = (key: SwitchKey, { label, description }: { label: string; description: string }) => (
    <SettingRow
      checked={Boolean(switches[key])}
      description={description}
      label={label}
      onCheckedChange={(checked) => onChange({ ...switches, [key]: checked })}
    />
  );

  return (
    <TabPage description={copy.description} title={copy.title}>
      <SettingsSection title={copy.language.title}>
        <div className="flex flex-col gap-2.5">
          <Segmented<'auto' | Locale>
            name="demo-language"
            onChange={setLanguage}
            options={[
              { value: 'auto', label: copy.language.auto },
              ...LOCALES.map((locale) => ({ value: locale, label: getNativeName(locale) })),
            ]}
            value={language}
          />
          <p className="text-sm text-text-muted">{copy.language.description}</p>
        </div>
      </SettingsSection>
      <SettingsSection title={copy.sounds.title}>
        {row('button-sound', copy.sounds.button)}
        {row('victorious-sound', copy.sounds.victory)}
        {row('give-up-sound', copy.sounds.giveUp)}
      </SettingsSection>
      <SettingsSection title={copy.notifications.title}>
        {row('victorious-notification', copy.notifications.finished)}
      </SettingsSection>
      <SettingsSection title={copy.blocking.title}>
        {row('allowlist-mode', copy.blocking.allowlistMode)}
      </SettingsSection>
    </TabPage>
  );
}

type ListPaneProps = {
  type: ListType;
  urls: string[];
  onChange: (urls: string[]) => void;
  isActiveMode: boolean;
};

/** site-list-tab.tsx: add an entry, see them all, remove one. */
export function ListPane({ type, urls, onChange, isActiveMode }: ListPaneProps) {
  const { app } = useCopy();
  const copy = app.options.siteLists[type];
  const [draft, setDraft] = useState('');
  const Icon = listIcons[type];

  const add = (event: FormEvent) => {
    event.preventDefault();
    const url = draft.trim();
    if (!url || urls.includes(url)) return;
    onChange([...urls, url]);
    setDraft('');
  };

  return (
    <TabPage
      badge={
        isActiveMode && (
          <span className="inline-flex animate-page-in items-center gap-1.5 rounded-full border border-accent-dim bg-accent-wash px-2.5 py-1 text-xs leading-none font-semibold text-accent before:size-1.5 before:rounded-full before:bg-current">
            {app.options.siteList.activeMode}
          </span>
        )
      }
      description={copy.description}
      title={copy.title}
    >
      <form className="flex gap-2" onSubmit={add}>
        <Input
          aria-label={copy.inputLabel}
          autoComplete="off"
          className="flex-1"
          onChange={(event) => setDraft(event.target.value)}
          placeholder={copy.placeholder}
          value={draft}
        />
        <Button type="submit" variant="secondary">
          <IconAdd aria-hidden="true" size={18} />
          {copy.addLabel}
        </Button>
      </form>
      {urls.length === 0 ? (
        <div className="flex animate-page-in flex-col items-center px-6 py-10 text-center">
          <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-accent-wash text-accent inset-ring inset-ring-accent-dim">
            <Icon aria-hidden="true" size={24} />
          </span>
          <strong className="text-md font-semibold">{copy.emptyTitle}</strong>
          <p className="mt-1 max-w-80 text-text-muted">{copy.emptyText}</p>
        </div>
      ) : (
        <ul aria-label={copy.listLabel} className="flex flex-col border-t border-border">
          {urls.map((url) => (
            <li
              className="group flex min-h-14 animate-site-in items-center gap-3 border-b border-border py-2"
              key={url}
            >
              {/* site-icon.tsx's letter tile; the drawing never fetches the sites' favicons. */}
              <span
                aria-hidden="true"
                className="flex size-8 shrink-0 items-center justify-center rounded-md bg-raised-hover text-sm font-bold text-text-muted uppercase"
              >
                {url.charAt(0)}
              </span>
              <span className="min-w-0 flex-1 truncate text-md font-medium">{url}</span>
              <IconButton
                aria-label={app.options.siteList.remove(url)}
                className="opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
                icon={IconRemove}
                onClick={() => onChange(urls.filter((entry) => entry !== url))}
                tone="danger"
              />
            </li>
          ))}
        </ul>
      )}
    </TabPage>
  );
}
