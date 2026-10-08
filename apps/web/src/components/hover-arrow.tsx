/** A caret that grows a shaft and slides right when its link (the `group`) is hovered or focused. */
export function HoverArrow() {
  return (
    <svg
      aria-hidden="true"
      className="overflow-visible"
      fill="none"
      height="10"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="2"
      viewBox="0 0 10 10"
      width="10"
    >
      <path
        className="opacity-0 transition-opacity duration-(--duration) group-hover:opacity-100 group-focus-visible:opacity-100"
        d="M0 5h7"
      />
      <path
        className="transition-transform duration-(--duration) group-hover:translate-x-0.75 group-focus-visible:translate-x-0.75"
        d="M1 1l4 4-4 4"
      />
    </svg>
  );
}
