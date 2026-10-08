import { type ListType, siteListIcons } from '@/components/site-lists';
import { Segmented } from '@/components/ui/segmented';
import { useMessages } from '@/lib/use-messages';
import { presets } from '@/screens/popup/presets';

type Props = {
  mode: ListType;
  selectedTime: number;
  /** Both controls lock during a session. */
  disabled: boolean;
  onModeChange: (mode: ListType) => void;
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
  const t = useMessages();
  const modes = (['blocklist', 'allowlist'] as const).map((value) => ({
    value,
    label: t.popup.modes[value],
    icon: siteListIcons[value],
  }));

  return (
    <fieldset className="flex min-w-0 flex-col gap-2" disabled={disabled}>
      <legend className="sr-only">{t.popup.sessionSettings}</legend>
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
