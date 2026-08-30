import { showNotice } from "../../sharedUtils/notice";
import type { ColorPalettePickerTranslator } from "./lang";

const PALETTE = ["#e03131", "#1971c2", "#2b8a3e", "#f08c00"] as const;

/** Updates the current ExcalidrawAutomate stroke color to a random palette value. */
export async function runColorPalettePicker(
  ea: ExcalidrawAutomate,
  _api: ExcalidrawAPI,
  t: ColorPalettePickerTranslator,
): Promise<void> {
  const nextColor = PALETTE[Math.floor(Math.random() * PALETTE.length)] ?? PALETTE[0];
  ea.style.strokeColor = nextColor;
  showNotice(t("strokeColorSet", { color: nextColor }));
}
