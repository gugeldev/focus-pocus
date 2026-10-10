import { cx } from '@focus-pocus/ui/cx';
import { IconSelected } from '@focus-pocus/ui/icons';
import { SiteIcon } from '@/components/site-icon';
import type { SuggestedSite } from '@/screens/welcome/suggested-sites';

type Props = {
  site: SuggestedSite;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

/** One suggestion: a checkbox drawn as a tile, with the site's icon, name and address. */
export function SiteOption({ site, checked, onCheckedChange }: Props) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border bg-raised px-3 py-2.5 transition-colors duration-(--duration) ease-fluid hover:bg-raised-hover has-checked:border-accent has-checked:bg-accent-wash has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent">
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(event) => onCheckedChange(event.target.checked)}
      />
      <SiteIcon url={site.url} />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-md font-semibold">{site.name}</span>
        <span className="truncate text-sm text-text-muted">{site.url}</span>
      </span>
      <span
        aria-hidden="true"
        className={cx(
          'flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-(--duration) ease-fluid',
          checked ? 'border-transparent bg-accent-solid text-white' : 'border-border-strong',
        )}
      >
        {checked && <IconSelected size={12} weight="bold" />}
      </span>
    </label>
  );
}
