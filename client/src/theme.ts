import type { ThemeConfig } from 'antd';

/**
 * Tawassol brand palette.
 *
 * - `green`  → primary / actions / links (the brand color)
 * - `red`    → errors, danger actions
 * - `yellow`  → accent surfaces & highlights
 * - `black`  → base text in light mode
 */
export const palette = {
  black: '#000000',
  green: '#8DB355',
  yellow: '#FFEA93',
  red: '#D90000',
} as const;

/** Cairo first, then system + Arabic-capable fallbacks. */
export const fontFamily =
  "'Cairo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans Arabic', 'Tahoma', sans-serif";

/** Ant Design design tokens per color scheme. */
export const brand: Record<'light' | 'dark', ThemeConfig['token']> = {
  light: {
    colorPrimary: palette.green,
    colorInfo: palette.green,
    colorLink: palette.green,
    colorSuccess: palette.green,
    colorError: palette.red,
    colorTextBase: palette.black,
    borderRadius: 8,
    fontFamily,
  },
  dark: {
    // Slightly lighter green so links/actions stay legible on dark surfaces.
    colorPrimary: '#A6CC74',
    colorInfo: '#A6CC74',
    colorLink: '#A6CC74',
    colorSuccess: '#A6CC74',
    colorError: '#FF5C5C',
    colorWarning: '#FFD666',
    borderRadius: 8,
    fontFamily,
  },
};
