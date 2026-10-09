import { useSyncExternalStore } from 'react';

// Small toasts for the extension pages: toast('Saved') from anywhere, drawn by
// the <Toaster /> that mount() adds to every page (src/components/toaster.tsx).

const VISIBLE_MS = 2400;

type Toast = {
  id: number;
  message: string;
  error: boolean;
  // Set when its time is up; the Toaster removes it after the exit animation.
  leaving: boolean;
};

let toasts: Toast[] = [];
let nextId = 0;
const listeners = new Set<() => void>();

function setToasts(next: Toast[]) {
  toasts = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function toast(message: string, error = false) {
  const id = nextId++;
  setToasts([...toasts, { id, message, error, leaving: false }]);

  setTimeout(() => {
    setToasts(toasts.map((item) => (item.id === id ? { ...item, leaving: true } : item)));
  }, VISIBLE_MS);
}

function removeToast(id: number) {
  setToasts(toasts.filter((item) => item.id !== id));
}

function useToasts() {
  return useSyncExternalStore(subscribe, () => toasts);
}

export type { Toast };
export { removeToast, toast, useToasts };
