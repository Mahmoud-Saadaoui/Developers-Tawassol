import en from './en.json';
import ar from './ar.json';

export type Locale = 'en' | 'ar';
export type TranslationParams = Record<string, string | number>;

const dictionaries: Record<Locale, typeof en> = { en, ar };

/** Resolve a dotted key (e.g. `'nav.tags'`) against a dictionary. */
function lookup(dict: typeof en, key: string): string | undefined {
  const value = key.split('.').reduce<unknown>((acc, part) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, dict);

  return typeof value === 'string' ? value : undefined;
}

/**
 * Translate a dotted key for the given locale.
 * Falls back to English, then to the raw key when missing.
 * Interpolates `{param}` placeholders from the optional params object.
 */
export function translate(
  locale: Locale,
  key: string,
  params?: TranslationParams,
): string {
  const value = lookup(dictionaries[locale], key) ?? lookup(dictionaries.en, key);
  if (value === undefined) return key;
  if (!params) return value;

  return value.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in params ? String(params[name]) : match,
  );
}