import { IconThemeAuto, IconThemeDark, IconThemeLight } from '@focus-pocus/ui/icons';
import { Segmented } from '@focus-pocus/ui/segmented';
import type { ThemeSetting } from '@focus-pocus/ui/theme';
import { useMessages } from '@/lib/use-messages';

type Props = {
  theme: ThemeSetting;
  onChange: (theme: ThemeSetting) => void;
};

/** Automatic (the system's mode), light or dark. */
export function ThemePicker({ theme, onChange }: Props) {
  const t = useMessages();
  const copy = t.options.general.appearance;
  const options = [
    { value: 'auto' as const, label: copy.auto, icon: IconThemeAuto },
    { value: 'light' as const, label: copy.light, icon: IconThemeLight },
    { value: 'dark' as const, label: copy.dark, icon: IconThemeDark },
  ];

  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="sr-only">{copy.title}</legend>
      <Segmented<ThemeSetting> name="theme" options={options} value={theme} onChange={onChange} />
      <p className="text-sm text-text-muted">{copy.description}</p>
    </fieldset>
  );
}
