/** The site's backdrop behind a store image: a dot grid fading down and two violet glows. */
export function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-dots mask-radial-[70%_60%] mask-radial-at-top mask-radial-from-10%" />
      <div className="absolute -top-60 -left-60 size-180 rounded-full bg-radial-[closest-side] from-accent-solid/17 to-transparent" />
      <div className="absolute -right-60 -bottom-60 size-180 rounded-full bg-radial-[closest-side] from-accent-solid/17 to-transparent" />
    </div>
  );
}
