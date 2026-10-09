'use client';

import { useEffect, useRef } from 'react';

/** Calls `callback` every `delay` ms while `delay` is not null; the latest callback, always. */
export function useInterval(callback: () => void, delay: number | null) {
  const latest = useRef(callback);

  useEffect(() => {
    latest.current = callback;
  });

  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => latest.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
