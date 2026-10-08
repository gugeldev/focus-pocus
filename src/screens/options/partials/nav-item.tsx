import type { ReactNode } from 'react';
import type { IconComponent } from '@/components/ui/icons';

/** Shared by the tabs and the sidebar footer's rows. */
export const navItemClasses =
  'focus-ring relative flex h-10 w-full items-center gap-3 rounded-md px-3 text-left text-base font-medium text-text-muted transition-colors duration-(--duration) ease-fluid';

/** The row's text, cut with an ellipsis when the sidebar is narrow. */
export function NavLabel({ children }: { children: ReactNode }) {
  return <span className="min-w-0 flex-1 truncate">{children}</span>;
}

/** What clicking a secondary row does, shown only when you reach for it (the row is the group). */
export function NavHint({ icon: Icon }: { icon: IconComponent }) {
  return (
    <Icon
      size={14}
      aria-hidden="true"
      className="shrink-0 text-text-faint opacity-0 transition-opacity duration-(--duration) ease-fluid group-hover:opacity-100 group-focus-visible:opacity-100"
    />
  );
}
