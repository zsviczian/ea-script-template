/**
 * @file settings.ts
 * @overview Script settings helpers — load, merge defaults, and save.
 *   Wraps ea.getScriptSettings / ea.setScriptSettings with type safety.
 */

/**
 * Loads the persisted script settings and merges them with the provided
 * defaults so callers always receive a fully-populated object.
 *
 * @param defaults  The default values for every known setting key.
 * @returns         Merged settings with caller-defined type.
 */
export function loadSettings<T extends Record<string, unknown>>(defaults: T): T {
  const persisted = ea.getScriptSettings() as Partial<T>;
  return { ...defaults, ...persisted };
}

/**
 * Persists the current settings object via the EA API.
 *
 * @param settings  The settings object to persist.
 */
export async function saveSettings(settings: Record<string, unknown>): Promise<void> {
  await ea.setScriptSettings(settings);
}
