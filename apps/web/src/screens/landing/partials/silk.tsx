/** How many threads run along the ribbon. */
const THREADS = 60;

/** One thread across the whole width, rising then falling; `t` is 0 (upper edge) to 1 (lower). */
function threadPath(t: number) {
  const y = 180 + t * 260;
  return `M -60 ${y + 220} C 380 ${y - 160 + t * 60}, 1000 ${y + 360 - t * 40}, 1560 ${y - 40}`;
}

/** The band: the upper thread, then the lower edge drawn back from right to left. */
const bandPath = `${threadPath(0)} L 1560 400 C 1000 760, 380 340, -60 660 Z`;

/**
 * The silk behind the demo: a ribbon in the brand's violets, pink and blue
 * sweeping across, with fine white threads along it, its ends fading into the
 * page. It drifts slowly; under reduced motion it holds still.
 */
export function Silk({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none motion-safe:animate-silk ${className ?? ''}`}
      preserveAspectRatio="none"
      viewBox="0 0 1500 900"
    >
      <defs>
        <linearGradient
          gradientUnits="userSpaceOnUse"
          id="silk-color"
          x1="0"
          x2="1500"
          y1="0"
          y2="0"
        >
          <stop offset="0" stopColor="#93c5fd" />
          <stop offset="0.3" stopColor="#8b5cf6" />
          <stop offset="0.55" stopColor="#c084fc" />
          <stop offset="0.78" stopColor="#f0abfc" />
          <stop offset="1" stopColor="#fb7185" />
        </linearGradient>
        <linearGradient id="silk-fade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="white" stopOpacity="0" />
          <stop offset="0.18" stopColor="white" stopOpacity="1" />
          <stop offset="0.82" stopColor="white" stopOpacity="1" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <mask id="silk-mask">
          <rect fill="url(#silk-fade)" height="900" width="1500" />
        </mask>
        <filter
          filterUnits="userSpaceOnUse"
          height="1100"
          id="silk-soft"
          width="1700"
          x="-100"
          y="-100"
        >
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      <g mask="url(#silk-mask)">
        <path d={bandPath} fill="url(#silk-color)" filter="url(#silk-soft)" opacity="0.85" />
        {Array.from({ length: THREADS }, (_, index) => (
          <path
            d={threadPath(index / (THREADS - 1))}
            fill="none"
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed threads, never reordered
            key={index}
            stroke="white"
            strokeOpacity={0.22 + (index % 4) * 0.07}
            strokeWidth="1"
          />
        ))}
      </g>
    </svg>
  );
}
