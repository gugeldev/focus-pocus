// Small toast for the extension pages. Its look lives in static/shared/base.css
// (.toast, .toast-region); it only needs a page that links that stylesheet and
// the Phosphor fill icons.

const VISIBLE_MS = 2400;

function getToastRegion() {
  const existing = document.querySelector<HTMLElement>('.toast-region');
  if (existing) return existing;

  const region = document.createElement('div');
  region.className = 'toast-region';
  region.setAttribute('aria-live', 'polite');
  document.body.appendChild(region);
  return region;
}

function toast(text: string, error = false) {
  const element = document.createElement('div');
  element.className = error ? 'toast toast-error' : 'toast';
  element.setAttribute('role', error ? 'alert' : 'status');

  const icon = document.createElement('i');
  icon.className = error ? 'ph-fill ph-warning-circle' : 'ph-fill ph-check-circle';
  icon.setAttribute('aria-hidden', 'true');

  const label = document.createElement('span');
  label.textContent = text;

  element.append(icon, label);
  getToastRegion().appendChild(element);

  setTimeout(() => {
    element.classList.add('toast-leaving');
    element.addEventListener('animationend', () => element.remove(), { once: true });
  }, VISIBLE_MS);
}

export default toast;
