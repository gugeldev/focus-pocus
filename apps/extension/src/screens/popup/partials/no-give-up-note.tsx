import { useMessages } from '@/lib/use-messages';

/**
 * Takes Give up's place during a session when No giving up is on. As tall as
 * the button, so the popup keeps its height.
 */
export function NoGiveUpNote() {
  const t = useMessages();

  return (
    <p className="flex h-11 animate-fade-up items-center justify-center text-center text-sm font-medium text-text-muted">
      {t.popup.noGiveUp}
    </p>
  );
}
