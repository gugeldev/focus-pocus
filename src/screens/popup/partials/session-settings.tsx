import { IconAllowlist, IconBlocklist } from '@/components/ui/icons';
import { Segmented } from '@/components/ui/segmented';
import { presets } from '@/screens/popup/presets';

type Mode = 'blocklist' | 'allowlist';

const modes = [
  { value: 'blocklist' as const, label: 'Blocklist', icon: IconBlocklist },
  { value: 'allowlist' as const, label: 'Allowlist', icon: IconAllowlist },
];

type Props = {
  mode: Mode;
  selectedTime: number;
  /** Both controls lock during a session. */
  disabled: boolean;
  onModeChange: (mode: Mode) => void;
  onTimeChange: (seconds: number) => void;
};

/** The blocking mode and the duration presets. A custom time checks no preset. */
export function SessionSettings({
  mode,
  selectedTime,
  disabled,
  onModeChange,
  onTimeChange,
}: Props) {
  return (
    <fieldset className="flex min-w-0 flex-col gap-2" disabled={disabled}>
      <legend className="sr-only">Session settings</legend>
      <Segmented
        pill
        name="mode"
        options={modes}
        value={mode}
        disabled={disabled}
        onChange={onModeChange}
      />
      <Segmented
        pill
        name="duration"
        className="tabular-nums"
        options={presets}
        value={selectedTime}
        disabled={disabled}
        onChange={onTimeChange}
      />
    </fieldset>
  );
}
