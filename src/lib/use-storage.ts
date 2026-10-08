import { useCallback, useEffect, useState } from 'react';
import { getStorage, onStorageChanged, type StorageState, setStorage } from '@/lib/storage';

type StorageSlice<K extends keyof StorageState> = Pick<StorageState, K>;

// Reads these storage keys and keeps them in sync with every other context
// (storage is the source of truth, AGENTS.md section 3.1). It is null until the
// first read resolves.
//
// `update` writes to storage and to the local copy at once, so a second click
// right after the first already sees the first one's result.
function useStorage<K extends keyof StorageState>(...keys: K[]) {
  const [state, setState] = useState<StorageSlice<K> | null>(null);
  // Callers pass literal keys, so the first render's are the keys for good.
  const [watchedKeys] = useState(keys);

  useEffect(() => {
    let active = true;

    getStorage(watchedKeys).then((values) => {
      if (active) setState(values);
    });

    const removeListener = onStorageChanged((changes) => {
      const changed = watchedKeys.filter((key) => key in changes);
      if (changed.length === 0) return;

      const values = Object.fromEntries(changed.map((key) => [key, changes[key]?.newValue]));
      setState((current) => current && { ...current, ...values });
    });

    return () => {
      active = false;
      removeListener();
    };
  }, [watchedKeys]);

  const update = useCallback((values: Partial<StorageSlice<K>>) => {
    setState((current) => current && { ...current, ...values });
    return setStorage(values);
  }, []);

  return [state, update] as const;
}

export { useStorage };
