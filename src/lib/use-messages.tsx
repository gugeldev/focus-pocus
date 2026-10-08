import { createContext, type ReactNode, useContext, useEffect } from 'react';
import { getMessages, resolveLocale } from '@/lib/i18n';
import { useStorage } from '@/lib/use-storage';
import { en, type Messages } from '@/locales/en';

const MessagesContext = createContext<Messages>(en);

/**
 * Provides the copy in the stored language to every component below it, and
 * switches it live when the language changes. mount() wraps every page in it.
 * Renders nothing until the language is read, so the page never flashes English.
 */
export function MessagesProvider({ children }: { children: ReactNode }) {
  const [state] = useStorage('language');
  const locale = state && resolveLocale(state.language);

  useEffect(() => {
    if (locale) document.documentElement.lang = locale;
  }, [locale]);

  if (!state) return null;

  return <MessagesContext value={getMessages(state.language)}>{children}</MessagesContext>;
}

/** The copy in the user's language (src/locales/). */
export function useMessages() {
  return useContext(MessagesContext);
}
