import type { IconComponent } from '@focus-pocus/ui/icons';
import type { ReactNode } from 'react';

type Props = {
  icon: IconComponent;
  title: string;
  text: string;
  /** Below the text, like a hint or an action. */
  children?: ReactNode;
};

/** A centered icon, title and line of text, with optional content below. */
export function EmptyState({ icon: Icon, title, text, children }: Props) {
  return (
    <div className="flex animate-page-in flex-col items-center px-6 py-10 text-center">
      <span className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-accent-wash text-accent inset-ring inset-ring-accent-dim">
        <Icon size={24} aria-hidden="true" />
      </span>
      <strong className="text-md font-semibold">{title}</strong>
      <p className="mt-1 max-w-80 text-text-muted">{text}</p>
      {children}
    </div>
  );
}
