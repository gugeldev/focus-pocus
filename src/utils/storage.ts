import browser from 'webextension-polyfill';

// Keys the background seeds on load (seedStorageDefaults), so they are always present.
interface SeededState {
  timer: number;
  selectedTime: number;
  isRunning: boolean;
  streak: number;
}

// Shape of browser.storage.local. Keys outside SeededState only exist once set.
interface StorageState extends SeededState {
  timeLabel?: string;
  blocklist?: string[];
  allowlist?: string[];
  options?: Record<string, boolean>;
}

type StorageChanges = {
  [K in keyof StorageState]?: {
    oldValue?: StorageState[K];
    newValue?: StorageState[K];
  };
};

const SEEDED_DEFAULTS: SeededState = { timer: 0, selectedTime: 900, isRunning: false, streak: 0 };

// Keeps any stored value and fills in the missing seeded keys.
async function seedStorageDefaults() {
  const stored = await browser.storage.local.get(Object.keys(SEEDED_DEFAULTS));
  await browser.storage.local.set({ ...SEEDED_DEFAULTS, ...stored });
}

function getStorage<K extends keyof StorageState>(keys: K | K[]) {
  return browser.storage.local.get(keys) as Promise<Pick<StorageState, K>>;
}

function setStorage(values: Partial<StorageState>) {
  return browser.storage.local.set(values);
}

function onStorageChanged(listener: (changes: StorageChanges) => void) {
  browser.storage.onChanged.addListener((changes) => listener(changes as StorageChanges));
}

export { getStorage, onStorageChanged, seedStorageDefaults, setStorage };
