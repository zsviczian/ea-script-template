/**
 * @file main.ts
 * @overview Color palette picker script entrypoint example.
 *
 * Build output: build/color-palette-picker/color-palette-picker.js
 */

import { showNotice } from "../../sharedUtils/notice";

const PALETTE = ["#e03131", "#1971c2", "#2b8a3e", "#f08c00"] as const;

/**
 * Updates the global style color to a random palette value.
 *
 * @param ea   ExcalidrawAutomate instance.
 * @param _api Excalidraw API for the active view.
 */
export async function runColorPalettePicker(
  ea: ExcalidrawAutomate,
  _api: ExcalidrawAPI,
): Promise<void> {
  const nextColor = PALETTE[Math.floor(Math.random() * PALETTE.length)] ?? PALETTE[0];
  ea.style.strokeColor = nextColor;
  showNotice(`color-palette-picker: stroke color set to ${nextColor}.`);
}

/**
 * Script-engine entrypoint.
 */
async function main(): Promise<void> {
  if (!ea.verifyMinAppVersion("2.0.0")) {
    new Notice("This script requires Excalidraw 2.0.0 or newer.");
    return;
  }

  const api = ea.getExcalidrawAPI();
  if (!api) {
    showNotice("color-palette-picker: could not obtain Excalidraw API.");
    return;
  }

  await runColorPalettePicker(ea, api);
}

void main();
