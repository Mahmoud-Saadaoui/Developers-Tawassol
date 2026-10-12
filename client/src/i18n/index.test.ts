import { describe, expect, it } from 'vitest';
import { translate } from './index';

describe('translate', () => {
  it('resolves a dotted key in the requested locale', () => {
    expect(translate('en', 'home.title')).toBe('Questions');
    expect(translate('ar', 'home.title')).toBe('الأسئلة');
  });

  it('interpolates {param} placeholders', () => {
    expect(translate('en', 'common.answers', { count: 3 })).toBe('3 answer(s)');
    expect(translate('en', 'common.views', { count: 12 })).toBe('12 views');
  });

  it('leaves unknown placeholders untouched', () => {
    expect(translate('en', 'common.answers', {})).toBe('{count} answer(s)');
  });

  it('falls back to the key when it is missing', () => {
    expect(translate('en', 'does.not.exist')).toBe('does.not.exist');
  });
});
