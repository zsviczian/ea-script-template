/**
 * @file modal.ts
 * @overview Helpers for presenting modal dialogs via ExcalidrawAutomate.
 *   Prefer these wrappers over calling ea.inputPrompt directly so that
 *   null-handling and cancellation are handled consistently.
 */

/**
 * Prompts the user for a text value.
 * Returns `null` when the dialog is dismissed without a value.
 *
 * @param header       Dialog title.
 * @param placeholder  Hint text shown inside the input field.
 * @param defaultValue Initial value pre-filled in the field.
 */
export async function askText(
  header: string,
  placeholder = "",
  defaultValue = "",
): Promise<string | null> {
  return ea.inputPrompt(header, placeholder, defaultValue);
}

/**
 * Asks the user to choose one item from a list.
 * Returns `null` when the dialog is dismissed.
 *
 * @param header  Dialog title.
 * @param items   Display strings presented as selectable options.
 * @param hint    Optional hint shown below the list.
 */
export async function askChoice(
  header: string,
  items: string[],
  hint = "",
): Promise<string | null> {
  return ea.suggestionPrompt(header, items, hint);
}
