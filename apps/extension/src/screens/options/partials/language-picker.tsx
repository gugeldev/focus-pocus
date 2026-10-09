import { Segmented } from '@focus-pocus/ui/segmented';
import { getNativeName, type LanguageSetting, LOCALES } from '@/lib/i18n';
import { useMessages } from '@/lib/use-messages';

type Props = {
  language: LanguageSetting;
  onChange: (language: LanguageSetting) => void;
};

/** Automatic (the browser's language), then each language named in its own words. */
export function LanguagePicker({ language, onChange }: Props) {
  const t = useMessages();
  const copy = t.options.general.language;
  const options = [
    { value: 'auto' as const, label: copy.auto },
    ...LOCALES.map((locale) => ({ value: locale, label: getNativeName(locale) })),
  ];

  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="sr-only">{copy.title}</legend>
      <Segmented<LanguageSetting>
        name="language"
        options={options}
        value={language}
        onChange={onChange}
      />
      <p className="text-sm text-text-muted">{copy.description}</p>
    </fieldset>
  );
}
