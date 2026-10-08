import '@/styles/theme.css';

import { applyTheme } from '@focus-pocus/ui/theme';
import { type ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from '@/components/toaster';
import { getStorage, onStorageChanged } from '@/lib/storage';
import { MessagesProvider } from '@/lib/use-messages';

/**
 * Puts the page in the stored theme and keeps it there. Resolves once the
 * theme is applied, so the first render is already in it.
 */
function syncDocumentTheme() {
  const root = document.documentElement;
  onStorageChanged((changes) => {
    if (changes.theme) applyTheme(root, changes.theme.newValue);
  });
  return getStorage('theme').then(({ theme }) => applyTheme(root, theme));
}

/**
 * Renders a screen into its page's #root, with the toasts every page can show,
 * in the user's language and theme.
 */
function mount(screen: ReactNode) {
  const root = document.getElementById('root');
  if (!root) throw new Error('FocusPocus: the page has no #root element');

  syncDocumentTheme().then(() =>
    createRoot(root).render(
      <StrictMode>
        <MessagesProvider>
          {screen}
          <Toaster />
        </MessagesProvider>
      </StrictMode>,
    ),
  );
}

export { mount };
