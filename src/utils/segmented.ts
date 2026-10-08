// Moves a segmented control's thumb (static/shared/base.css) under its checked
// radio. With nothing checked the control gets `.no-selection` and the thumb
// fades out.
function syncSegmented(control: HTMLElement) {
  const inputs = Array.from(control.querySelectorAll<HTMLInputElement>('input[type="radio"]'));
  const activeIndex = inputs.findIndex((input) => input.checked);

  control.classList.toggle('no-selection', activeIndex === -1);
  if (activeIndex !== -1) control.style.setProperty('--active', activeIndex.toString());
}

// Checks the radio with this value. Returns whether one matched.
function checkSegmentedValue(control: HTMLElement, value: string) {
  let matched = false;
  for (const input of control.querySelectorAll<HTMLInputElement>('input[type="radio"]')) {
    input.checked = input.value === value;
    matched ||= input.checked;
  }
  syncSegmented(control);
  return matched;
}

export { checkSegmentedValue, syncSegmented };
