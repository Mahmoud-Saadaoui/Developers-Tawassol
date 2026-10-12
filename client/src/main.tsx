import { App as AntdApp, ConfigProvider, theme as antdTheme } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dayjs from 'dayjs';
import 'dayjs/locale/ar';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { LocaleProvider, useLocale } from './context/LocaleContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import enUS from 'antd/locale/en_US';
import arEG from 'antd/locale/ar_EG';
import { brand } from './theme';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Reads the active locale/theme and renders the antd ConfigProvider.
 * Also keeps `<html lang/dir>` and the dayjs locale in sync.
 */
function AppProviders({ children }: { children: React.ReactNode }) {
  const { locale, dir } = useLocale();
  const { isDark } = useTheme();

  React.useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
    dayjs.locale(locale === 'ar' ? 'ar' : 'en');
  }, [locale, dir, isDark]);

  return (
    <ConfigProvider
      locale={locale === 'ar' ? arEG : enUS}
      direction={dir}
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: isDark ? brand.dark : brand.light,
      }}
    >
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <LocaleProvider>
        <ThemeProvider>
          <AppProviders>
            <AuthProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </AuthProvider>
          </AppProviders>
        </ThemeProvider>
      </LocaleProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
