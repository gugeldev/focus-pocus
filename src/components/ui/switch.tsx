import type { ComponentProps } from 'react';

/**
 * A real checkbox under the track, so the keyboard and a wrapping <label> work
 * for free. The knob is the track's ::after.
 */
export function Switch(props: Omit<ComponentProps<'input'>, 'type' | 'className'>) {
  return (
    <span className="relative inline-flex h-6 w-10 shrink-0">
      <input
        type="checkbox"
        className="peer absolute inset-0 z-1 m-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
        {...props}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full bg-border-strong transition-[background-color,opacity] duration-(--duration-enter) ease-fluid peer-checked:bg-accent-strong peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent peer-disabled:opacity-45 after:absolute after:top-0.75 after:left-0.75 after:size-4.5 after:rounded-full after:bg-text after:shadow-subtle after:transition-[translate,width] after:duration-(--duration-layout) after:ease-spring peer-checked:after:translate-x-4 peer-enabled:peer-active:after:w-5.5 peer-checked:peer-enabled:peer-active:after:translate-x-3"
      />
    </span>
  );
}
