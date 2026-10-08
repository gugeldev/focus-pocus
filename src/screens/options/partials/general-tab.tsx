import type { LanguageSetting } from '@/lib/i18n';
import { useMessages } from '@/lib/use-messages';
import { LanguagePicker } from '@/screens/options/partials/language-picker';
import { LockedNotice } from '@/screens/options/partials/locked-notice';
import { SettingRow } from '@/screens/options/partials/setting-row';
import { SettingsSection } from '@/screens/options/partials/settings-section';
import { TabPage } from '@/screens/options/partials/tab-page';

type Options = Record<string, boolean>;

type Props = {
  options: Options;
  onChange: (options: Options) => void;
  language: LanguageSetting;
  onLanguageChange: (language: LanguageSetting) => void;
  /** Locks the allowlist mode: the content scripts already decided what to block. */
  isRunning: boolean;
};

/** The language, sounds, notifications and the blocking mode. Every switch starts off. */
export function GeneralTab({ options, onChange, language, onLanguageChange, isRunning }: Props) {
  const t = useMessages();
  const copy = t.options.general;
  // Each row is bound to one key in storage's `options` (AGENTS.md section 2.4).
  const bind = (key: string) => ({
    checked: Boolean(options[key]),
    onCheckedChange: (checked: boolean) => onChange({ ...options, [key]: checked }),
  });

  return (
    <TabPage id="general-page" title={copy.title} description={copy.description}>
      <LockedNotice isRunning={isRunning}>{copy.locked}</LockedNotice>

      <SettingsSection title={copy.language.title}>
        <LanguagePicker language={language} onChange={onLanguageChange} />
      </SettingsSection>

      <SettingsSection title={copy.sounds.title}>
        <SettingRow {...bind('button-sound')} {...copy.sounds.button} />
        <SettingRow {...bind('victorious-sound')} {...copy.sounds.victory} />
        <SettingRow {...bind('give-up-sound')} {...copy.sounds.giveUp} />
      </SettingsSection>

      <SettingsSection title={copy.notifications.title}>
        <SettingRow {...bind('victorious-notification')} {...copy.notifications.finished} />
      </SettingsSection>

      <SettingsSection title={copy.blocking.title}>
        <SettingRow
          {...bind('allowlist-mode')}
          {...copy.blocking.allowlistMode}
          disabled={isRunning}
        />
      </SettingsSection>
    </TabPage>
  );
}
