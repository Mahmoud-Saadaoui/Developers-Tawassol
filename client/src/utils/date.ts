import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
// Locale data is loaded once in main.tsx (`dayjs.locale(...)`).
import 'dayjs/locale/ar';

dayjs.extend(localizedFormat);

/** Locale-aware medium date (e.g. "Oct 12, 2026" or its Arabic equivalent). */
export function formatDate(value: string | Date): string {
  return dayjs(value).format('ll');
}

/** Locale-aware short month + year (e.g. "Oct 2026"). */
export function formatMonthYear(value: string | Date): string {
  return dayjs(value).format('MMM YYYY');
}
