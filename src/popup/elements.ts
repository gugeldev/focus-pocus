const configButton = document.querySelector('#config') as HTMLButtonElement;
const timerDisplay = document.querySelector('#timer-counter') as HTMLButtonElement;
const customInput = document.querySelector('#custom-input') as HTMLInputElement;
const dialCaption = document.querySelector('#dial-caption') as HTMLParagraphElement;
const dialHint = document.querySelector('#dial-hint') as HTMLParagraphElement;
const ringProgress = document.querySelector('#ring-progress') as SVGCircleElement;
const controls = document.querySelector('#controls') as HTMLFieldSetElement;
const presets = document.querySelector('#presets') as HTMLDivElement;
const modeControl = document.querySelector('#mode') as HTMLDivElement;
const startButton = document.querySelector('#start') as HTMLButtonElement;
const startLabel = document.querySelector('#start-label') as HTMLSpanElement;
const streakButton = document.querySelector('#streak-button') as HTMLButtonElement;
const streakCounter = document.querySelector('#streak-counter') as HTMLSpanElement;

export {
  configButton,
  controls,
  customInput,
  dialCaption,
  dialHint,
  modeControl,
  presets,
  ringProgress,
  startButton,
  startLabel,
  streakButton,
  streakCounter,
  timerDisplay,
};
