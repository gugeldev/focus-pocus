/** How many threads make up the spell. */
const THREADS = 28;

/**
 * The hero's spell: fine threads in the brand's colors, each an ellipse
 * turned a little further than the last, winding into a faint vortex behind
 * the top of the hero. Hollow in the middle so the title stays clear. The
 * whole SVG turns about its own center, barely perceptibly, and holds still
 * under reduced motion.
 */
export function Spell() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-275 overflow-hidden"
    >
      <svg
        aria-hidden="true"
        className="absolute -top-105 left-1/2 size-375 -translate-x-1/2 motion-safe:animate-spell [mask-image:radial-gradient(circle,transparent_30%,black_40%,black_44%,transparent_50%)]"
        viewBox="-750 -750 1500 1500"
      >
        <defs>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="spell-color"
            x1="-700"
            x2="700"
            y1="-700"
            y2="700"
          >
            <stop offset="0" stopColor="var(--color-silk-sky)" />
            <stop offset="0.35" stopColor="var(--color-silk-violet)" />
            <stop offset="0.65" stopColor="var(--color-fuchsia)" />
            <stop offset="1" stopColor="var(--color-silk-rose)" />
          </linearGradient>
        </defs>
        <g>
          {Array.from({ length: THREADS }, (_, index) => (
            <ellipse
              cx="0"
              cy="0"
              fill="none"
              // biome-ignore lint/suspicious/noArrayIndexKey: fixed threads, never reordered
              key={index}
              rx="690"
              ry={300 + (index % 8) * 14}
              stroke="url(#spell-color)"
              strokeOpacity={0.1 + (index % 3) * 0.05}
              strokeWidth="1"
              transform={`rotate(${(index * 180) / THREADS})`}
            />
          ))}
        </g>
      </svg>
      {/* The spell fades into the page before the demo. */}
      <div className="absolute inset-x-0 bottom-0 h-80 bg-linear-to-b from-transparent to-canvas" />
    </div>
  );
}
