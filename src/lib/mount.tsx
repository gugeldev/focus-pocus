import '@/styles/theme.css';

import { type ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from '@/components/toaster';

/** Renders a screen into its page's #root, with the toasts every page can show. */
function mount(screen: ReactNode) {
  const root = document.getElementById('root');
  if (!root) throw new Error('FocusPocus: the page has no #root element');

  createRoot(root).render(
    <StrictMode>
      {screen}
      <Toaster />
    </StrictMode>,
  );
}

export { mount };
