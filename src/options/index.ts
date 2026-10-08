import './tabs';
import './options';

import bindStreakButton from '../utils/share-streak';
import { getStorage, setStorage } from '../utils/storage';
import toast from '../utils/toast';
import { streakButton, streakCounter } from './elements';
import { isSessionRunning, makeLockable } from './session-lock';

type ListType = 'blocklist' | 'allowlist';

interface SiteList {
  form: HTMLFormElement;
  input: HTMLInputElement;
  list: HTMLUListElement;
  count: HTMLSpanElement;
  urls: string[];
}

const STAGGER_MS = 30;

bindStreakButton(streakButton, streakCounter);

// Each list's elements follow one id pattern: #<type>-form, -input, -list and
// -count.
function createSiteList(type: ListType): SiteList {
  const byId = <T extends HTMLElement>(part: string) =>
    document.querySelector(`#${type}-${part}`) as T;

  return {
    form: byId<HTMLFormElement>('form'),
    input: byId<HTMLInputElement>('input'),
    list: byId<HTMLUListElement>('list'),
    count: byId<HTMLSpanElement>('count'),
    urls: [],
  };
}

const siteLists: Record<ListType, SiteList> = {
  blocklist: createSiteList('blocklist'),
  allowlist: createSiteList('allowlist'),
};

// The host part of an entry, without the scheme or "www.". Entries are free
// substrings, so this is a best guess.
function getHost(url: string) {
  return url
    .trim()
    .replace(/^[a-z]+:\/\//i, '')
    .replace(/^www\./i, '')
    .split(/[/?#]/)[0];
}

// The row's tile: the first letter of the host, covered by the site's own
// /favicon.ico when the entry looks like a domain and the icon loads.
function createSiteIcon(url: string) {
  const host = getHost(url);
  const icon = document.createElement('span');
  icon.className = 'site-monogram';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = host.charAt(0) || '?';

  if (/^[a-z0-9-]+(\.[a-z0-9-]+)+(:\d+)?$/i.test(host)) {
    const favicon = document.createElement('img');
    favicon.className = 'site-favicon';
    favicon.alt = '';
    favicon.referrerPolicy = 'no-referrer';
    favicon.addEventListener('load', () => icon.classList.add('has-favicon'), { once: true });
    favicon.src = `https://${host}/favicon.ico`;
    icon.append(favicon);
  }

  return icon;
}

function saveList(type: ListType) {
  const siteList = siteLists[type];
  siteList.count.textContent = siteList.urls.length.toString();
  setStorage({ [type]: siteList.urls });
}

function removeSite(type: ListType, url: string, item: HTMLLIElement) {
  if (isSessionRunning())
    return toast("You can't remove a website while a focus session is running.", true);

  const siteList = siteLists[type];
  siteList.urls = siteList.urls.filter((u) => u !== url);
  saveList(type);

  // Freeze the row at its real height so the exit animation can collapse it.
  item.style.height = `${item.offsetHeight}px`;
  item.classList.add('leaving');
  item.addEventListener('animationend', (event) => {
    if (event.target === item) item.remove();
  });
}

function createSiteItem(type: ListType, url: string, delay = 0) {
  const item = document.createElement('li');
  item.className = 'site';
  if (delay) item.style.animationDelay = `${delay}ms`;

  const label = document.createElement('span');
  label.className = 'site-url';
  label.textContent = url;
  label.title = url;

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'icon-btn';
  removeButton.setAttribute('aria-label', `Remove ${url}`);
  removeButton.innerHTML = '<i class="ph ph-x" aria-hidden="true"></i>';
  makeLockable(removeButton);
  removeButton.addEventListener('click', () => removeSite(type, url, item));

  item.append(createSiteIcon(url), label, removeButton);
  return item;
}

function renderList(type: ListType, urls: string[]) {
  const siteList = siteLists[type];
  siteList.urls = urls;
  siteList.count.textContent = urls.length.toString();
  siteList.list.replaceChildren(
    ...urls.map((url, index) => createSiteItem(type, url, index * STAGGER_MS)),
  );
}

function addSite(type: ListType) {
  const siteList = siteLists[type];
  const url = siteList.input.value.trim();

  if (isSessionRunning())
    return toast("You can't add a website while a focus session is running.", true);
  if (!url) return toast('Enter a website first.', true);
  if (siteList.urls.includes(url)) return toast(`This website is already in your ${type}.`, true);

  siteList.urls = [...siteList.urls, url];
  saveList(type);
  siteList.list.appendChild(createSiteItem(type, url));
  siteList.input.value = '';
}

for (const type of Object.keys(siteLists) as ListType[]) {
  siteLists[type].form.addEventListener('submit', (event) => {
    event.preventDefault();
    addSite(type);
  });
}

getStorage(['blocklist', 'allowlist']).then((data) => {
  renderList('blocklist', data.blocklist ?? []);
  renderList('allowlist', data.allowlist ?? []);
});
