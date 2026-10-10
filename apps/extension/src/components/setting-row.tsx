import { Switch } from '@focus-pocus/ui/switch';
import type { ReactNode } from 'react';

type Props = {
  /** Before the label, like a site's icon. */
  icon?: ReactNode;
  label: string;
  description: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
};

/** A switch with its label and description; the whole row toggles it. */
export function SettingRow({
  icon,
  label,
  description,
  checked,
  onCheckedChange,
  disabled,
}: Props) {
  return (
    <label className="-mx-3 flex cursor-pointer items-center justify-between gap-6 rounded-lg px-3 py-3.5 transition-colors duration-(--duration) ease-fluid hover:bg-item-hover has-disabled:cursor-not-allowed has-disabled:hover:bg-transparent">
      <span className="flex min-w-0 items-center gap-3">
        {icon}
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-md font-medium">{label}</span>
          <span className="text-sm text-text-muted">{description}</span>
        </span>
      </span>
      <Switch
        checked={checked}
        disabled={disabled}
        onChange={(event) => onCheckedChange(event.target.checked)}
      />
    </label>
  );
}
