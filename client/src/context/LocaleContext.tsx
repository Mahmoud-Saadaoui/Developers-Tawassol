import { createContext, useContext, useState, type ReactNode } from 'react';

type Locale = 'fr' | 'ar';

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dir: 'ltr' | 'rtl';
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'fr',
  setLocale: () => {},
  dir: 'ltr',
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(
    () => (localStorage.getItem('locale') as Locale) || 'fr',
  );

  const setLocale = (next: Locale) => {
    localStorage.setItem('locale', next);
    setLocaleState(next);
  };

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <LocaleContext.Provider value={{ locale, setLocale, dir }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
