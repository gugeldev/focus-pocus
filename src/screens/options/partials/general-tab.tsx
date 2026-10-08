import { LockedNotice } from '@/screens/options/partials/locked-notice';
import { SettingRow } from '@/screens/options/partials/setting-row';
import { SettingsSection } from '@/screens/options/partials/settings-section';
import { TabPage } from '@/screens/options/partials/tab-page';

type Options = Record<string, boolean>;

type Props = {
  options: Options;
  onChange: (options: Options) => void;
  /** Locks the allowlist mode: the content scripts already decided what to block. */
  isRunning: boolean;
};

/** Sounds, notifications and the blocking mode. Every switch starts off. */
export function GeneralTab({ options, onChange, isRunning }: Props) {
  // Each row is bound to one key in storage's `options` (AGENTS.md section 2.4).
  const bind = (key: string) => ({
    checked: Boolean(options[key]),
    onCheckedChange: (checked: boolean) => onChange({ ...options, [key]: checked }),
  });

  return (
    <TabPage
      id="general-page"
      title="General"
      description="Choose how FocusPocus sounds, notifies and blocks while you focus."
    >
      <LockedNotice isRunning={isRunning}>
        A focus session is running. Blocking settings unlock when it ends.
      </LockedNotice>

      <SettingsSection title="Sounds">
        <SettingRow
          {...bind('button-sound')}
          label="Start and give up"
          description="A soft click when you start or stop a session."
        />
        <SettingRow
          {...bind('victorious-sound')}
          label="Victory"
          description="Plays when a session finishes while the popup is open."
        />
        <SettingRow
          {...bind('give-up-sound')}
          label="Giving up"
          description="A reminder that quitting costs your streak."
        />
      </SettingsSection>

      <SettingsSection title="Notifications">
        <SettingRow
          {...bind('victorious-notification')}
          label="Session finished"
          description="A system notification telling you it's time for a break."
        />
      </SettingsSection>

      <SettingsSection title="Blocking">
        <SettingRow
          {...bind('allowlist-mode')}
          label="Allowlist mode"
          description="Block every site except the ones on your allowlist, instead of only the ones on your blocklist."
          disabled={isRunning}
        />
      </SettingsSection>
    </TabPage>
  );
}
