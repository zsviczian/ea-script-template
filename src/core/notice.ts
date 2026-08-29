/**
 * @file notice.ts
 * @overview Thin wrappers around Obsidian's Notice class.
 *   Centralises how messages are surfaced so the display style can be
 *   changed in one place (e.g., switching to a toast library later).
 */

/** Default duration for informational notices in milliseconds. */
const DEFAULT_NOTICE_DURATION = 4000;

/**
 * Shows a transient notice at the bottom of the Obsidian window.
 *
 * @param message  Human-visible text to display.
 * @param duration Duration in milliseconds (default 4 s).
 */
export function showNotice(message: string, duration = DEFAULT_NOTICE_DURATION): void {
  new Notice(message, duration);
}

/**
 * Shows a persistent error notice. Displayed for twice the default duration.
 *
 * @param message  Error description to surface to the user.
 */
export function showError(message: string): void {
  new Notice(`⚠️ ${message}`, DEFAULT_NOTICE_DURATION * 2);
}
