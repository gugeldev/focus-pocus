import { getStorage, onStorageChanged, setStorage } from '../utils/storage';

import { options } from './elements';

// Every switch's input id is its key in `options` (AGENTS.md section 2.4).
function renderOptions(settings: Record<string, boolean>) {
  for (const option of options) {
    option.checked = Boolean(settings[option.id]);
  }
  document.body.classList.toggle('allowlist-mode', Boolean(settings['allowlist-mode']));
}

getStorage(['options']).then((data) => renderOptions(data.options ?? {}));

for (const option of options) {
  option.addEventListener('change', () => {
    getStorage('options').then((data) => {
      setStorage({ options: { ...data.options, [option.id]: option.checked } });
    });
  });
}

onStorageChanged((changes) => {
  if (changes.options?.newValue) renderOptions(changes.options.newValue);
});
