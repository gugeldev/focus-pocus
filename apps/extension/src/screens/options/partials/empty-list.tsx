import type { IconComponent } from '@focus-pocus/ui/icons';

type Props = {
  icon: IconComponent;
  title: string;
  text: string;
};

/** What an empty list shows instead of its rows. */
export function EmptyList({ icon: Icon, title, text }: Props) {
  return (
    <div className="flex animate-page-in flex-col items-center px-6 py-10 text-center">
      <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-accent-wash text-accent inset-ring inset-ring-accent-dim">
        <Icon size={24} aria-hidden="true" />
      </span>
      <strong className="text-md font-semibold">{title}</strong>
      <p className="mt-1 max-w-80 text-text-muted">{text}</p>
    </div>
  );
}
