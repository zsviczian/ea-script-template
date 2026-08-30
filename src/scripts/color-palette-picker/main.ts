/**
 * @file main.ts
 * @overview Color palette picker script entrypoint example.
 *
 * Build output: build/color-palette-picker/color-palette-picker.md
 */

import { showNotice } from "../../sharedUtils/notice";
import { createColorPalettePickerTranslator } from "./lang";
import { runColorPalettePicker } from "./run";

/**
 * Script-engine entrypoint.
 */
async function main(): Promise<void> {
  const t = createColorPalettePickerTranslator(ea.obsidian.moment.locale());

  if (!ea.verifyMinAppVersion("2.0.0")) {
    new Notice(t("requiresVersion"));
    return;
  }

  const api = ea.getExcalidrawAPI();
  if (!api) {
    showNotice(t("apiUnavailable"));
    return;
  }

  await runColorPalettePicker(ea, api, t);
}

void main();
