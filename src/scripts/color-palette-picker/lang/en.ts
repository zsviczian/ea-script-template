export const en = {
  requiresVersion: "This script requires Excalidraw 2.0.0 or newer.",
  apiUnavailable: "Color palette picker: could not obtain Excalidraw API.",
  strokeColorSet: "Color palette picker: stroke color set to {color}.",
} as const;

export type ColorPalettePickerTranslationKey = keyof typeof en;
