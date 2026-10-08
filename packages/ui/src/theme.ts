// The look of the extension's pages and the focus screen. The kit's colors are
// light-dark() pairs (./theme.css): "auto" leaves the choice to the system's
// mode, "light" and "dark" pin it with data-theme.

export type ThemeSetting = 'auto' | 'light' | 'dark';

/** Pins `element` (and everything inside it) to `theme`, or lets it follow the system. */
export function applyTheme(element: HTMLElement, theme: ThemeSetting | undefined) {
  if (theme === 'light' || theme === 'dark') element.dataset.theme = theme;
  else delete element.dataset.theme;
}
