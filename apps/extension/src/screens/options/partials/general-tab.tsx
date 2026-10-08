import type { ThemeSetting } from '@focus-pocus/ui/theme';
import type { LanguageSetting } from '@/lib/i18n';
import { useMessages } from '@/lib/use-messages';
import { LanguagePicker } from '@/screens/options/partials/language-picker';
import { LockedNotice } from '@/screens/options/partials/locked-notice';
import { SettingRow } from '@/screens/options/partials/setting-row';
import { SettingsSection } from '@/screens/options/partials/settings-section';
import { TabPage } from '@/screens/options/partials/tab-page';
import { ThemePicker } from '@/screens/options/partials/theme-picker';

type Options = Record<string, boolean>;

type Props = {
  options: Options;
  onChange: (options: Options) => void;
  language: LanguageSetting;
  onLanguageChange: (language: LanguageSetting) => void;
  theme: ThemeSetting;
  onThemeChange: (theme: ThemeSetting) => void;
  /** Locks the allowlist mode: the content scripts already decided what to block. */
  isRunning: boolean;
};

/** The appearance, language, sounds, notifications and the blocking mode. Every switch starts off. */
export function GeneralTab({
  options,
  onChange,
  language,
  onLanguageChange,
  theme,
  onThemeChange,
  isRunning,
}: Props) {
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

      <SettingsSection title={copy.appearance.title}>
        <ThemePicker theme={theme} onChange={onThemeChange} />
      </SettingsSection>

      <SettingsSection title={copy.language.title}>
        <LanguagePicker language={language} onChange={onLanguageChange} />
      </SettingsSection>

      <SettingsSection title={copy.sounds.title}>
        <SettingRow
          {...bind('button-sound')}
          label={copy.sounds.button.label}
          description={copy.sounds.button.description}
        />
        <SettingRow
          {...bind('victorious-sound')}
          label={copy.sounds.victory.label}
          description={copy.sounds.victory.description}
        />
        <SettingRow
          {...bind('give-up-sound')}
          label={copy.sounds.giveUp.label}
          description={copy.sounds.giveUp.description}
        />
      </SettingsSection>

      <SettingsSection title={copy.notifications.title}>
        <SettingRow
          {...bind('victorious-notification')}
          label={copy.notifications.finished.label}
          description={copy.notifications.finished.description}
        />
      </SettingsSection>

      <SettingsSection title={copy.blocking.title}>
        <SettingRow
          {...bind('allowlist-mode')}
          label={copy.blocking.allowlistMode.label}
          description={copy.blocking.allowlistMode.description}
          disabled={isRunning}
        />
      </SettingsSection>
    </TabPage>
  );
}
