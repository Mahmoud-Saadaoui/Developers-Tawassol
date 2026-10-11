import { createContext, useContext, useState, type ReactNode } from 'react';
import { translate, type Locale, type TranslationParams } from '../i18n';

type Dir = 'ltr' | 'rtl';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dir: Dir;
  t: (key: string, params?: TranslationParams) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const stored = localStorage.getItem('locale');
    return stored === 'ar' ? 'ar' : 'en';
  });

  const setLocale = (next: Locale) => {
    localStorage.setItem('locale', next);
    setLocaleState(next);
  };

  const dir: Dir = locale === 'ar' ? 'rtl' : 'ltr';
  const t = (key: string, params?: TranslationParams) => translate(locale, key, params);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, dir, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}