/** Marks the list whose mode is on. */
export function ActiveModeBadge() {
  return (
    <span className="inline-flex animate-page-in items-center gap-1.5 rounded-full border border-accent-dim bg-accent-wash px-2.5 py-1 text-xs leading-none font-semibold text-accent before:size-1.5 before:rounded-full before:bg-current">
      Active mode
    </span>
  );
}
