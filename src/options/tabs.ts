import { nav, pages, tabs } from './elements';

// Each tab names its page with aria-controls and its location hash with
// data-hash, so "#blocklist" opens the blocklist directly.
function selectTab(tab: HTMLButtonElement) {
  const index = Array.from(tabs).indexOf(tab);

  for (const other of tabs) {
    if (other === tab) other.setAttribute('aria-current', 'page');
    else other.removeAttribute('aria-current');
  }

  for (const page of pages) {
    page.hidden = page.id !== tab.getAttribute('aria-controls');
  }

  nav.style.setProperty('--active-tab', index.toString());
  history.replaceState(null, '', `#${tab.dataset.hash}`);
}

for (const tab of tabs) {
  tab.addEventListener('click', () => selectTab(tab));
}

const initialTab = Array.from(tabs).find((tab) => `#${tab.dataset.hash}` === location.hash);
selectTab(initialTab ?? tabs[0]);
