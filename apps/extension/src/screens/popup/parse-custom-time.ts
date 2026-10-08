/**
 * Parses "ss", "mm:ss" or "hh:mm:ss" into seconds. Returns null for anything
 * that is not a positive duration.
 */
export function parseCustomTime(value: string) {
  const units = [1, 60, 3600];
  const parts = value.trim().split(':').reverse();
  if (parts.length > units.length) return null;

  let totalSeconds = 0;
  for (const [index, part] of parts.entries()) {
    if (!/^\d+$/.test(part)) return null;
    totalSeconds += parseInt(part, 10) * units[index];
  }

  return totalSeconds > 0 ? totalSeconds : null;
}
