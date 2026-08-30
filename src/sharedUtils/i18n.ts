/** Values accepted by named placeholders such as `{count}`. */
export type TranslationParams = Readonly<Record<string, string | number>>;

/** A possibly incomplete translation catalog for a script. */
export type TranslationCatalog<Key extends string> = Readonly<Partial<Record<Key, string>>>;

/** A script-local, key-safe translation function. */
export type Translator<Key extends string> = (key: Key, params?: TranslationParams) => string;

/** Replaces named placeholders without interpreting parameters as regular expressions. */
export function interpolateTranslation(template: string, params: TranslationParams = {}): string {
  return Object.entries(params).reduce(
    (result, [key, value]) => result.split(`{${key}}`).join(String(value)),
    template,
  );
}

/** Creates a translator with exact-locale, base-language, and English fallback. */
export function createTranslator<Key extends string>(
  requestedLocale: string,
  catalogs: Readonly<Record<string, TranslationCatalog<Key>>>,
  fallbackLocale = "en",
): Translator<Key> {
  const locale = requestedLocale.toLowerCase().replaceAll("_", "-");
  const baseLocale = locale.split("-")[0] ?? locale;

  return (key, params = {}) => {
    const template =
      catalogs[locale]?.[key] ??
      catalogs[baseLocale]?.[key] ??
      catalogs[fallbackLocale]?.[key] ??
      key;
    return interpolateTranslation(template, params);
  };
}
