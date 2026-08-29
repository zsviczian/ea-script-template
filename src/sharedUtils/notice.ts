/**
 * @file notice.ts
 * @overview Shared notice helpers for multi-script workspaces.
 */

/**
 * Shows a user-facing notice inside Obsidian.
 *
 * @param message  The message to display.
 */
export function showNotice(message: string): void {
  new Notice(message);
}

/**
 * Shows an error notice with a consistent prefix.
 *
 * @param message  Error detail text.
 */
export function showError(message: string): void {
  new Notice(`Error: ${message}`);
}
