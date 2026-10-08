import { getStorage, onStorageChanged, setStorage } from '../utils/storage';

import { focusSettings, options } from './elements';

getStorage(['options', 'isRunning']).then((data) => {
  const settings = data.options;
  if (settings) {
    options.forEach((option) => {
      option.checked = settings[option.id];
    });
  }

  hiddenFocusSettings(data.isRunning);
});

function hiddenFocusSettings(isRunning: boolean) {
  if (isRunning) {
    focusSettings.style.display = 'none';
  } else {
    focusSettings.style.display = 'block';
  }
}

options.forEach((option) => {
  option.addEventListener('change', () => {
    getStorage('options').then((data) => {
      const options = data.options || {};
      options[option.id] = option.checked;
      setStorage({ options });
    });
  });
});

onStorageChanged((changes) => {
  if (changes.isRunning?.newValue) {
    hiddenFocusSettings(true);
  }

  if (changes.isRunning && !changes.isRunning.newValue) {
    hiddenFocusSettings(false);
  }

  const settings = changes.options?.newValue;
  if (settings) {
    options.forEach((option) => {
      option.checked = settings[option.id];
    });
  }
});
