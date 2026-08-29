/**
 * @file strings.ts
 * @overview Human-visible strings and configuration literals.
 *   Never scatter UI strings inside logic modules — put them here.
 */

/** Display name shown in notices and modal titles. */
export const SCRIPT_NAME = "My EA Script";

/** Prefix used for script settings keys in Obsidian. */
export const SETTINGS_KEY_PREFIX = "ea-my-script";

export const MSG = {
  NO_SELECTION: "Please select at least one element.",
  SUCCESS: "Done! Scene updated.",
  CANCELLED: "Script cancelled.",
  ERROR_PREFIX: "Error: ",
} as const;
