import { describe, expect, it } from 'vitest';
import { formatDate, formatMonthYear } from './date';

describe('date utils', () => {
  it('formats a date in a locale-aware medium format', () => {
    expect(formatDate('2026-10-12')).toMatch(/Oct/);
    expect(formatDate('2026-10-12')).toMatch(/2026/);
  });

  it('formats a month + year', () => {
    expect(formatMonthYear('2026-10-12')).toBe('Oct 2026');
  });
});
