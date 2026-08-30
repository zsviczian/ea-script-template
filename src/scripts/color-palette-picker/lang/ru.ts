import type { ColorPalettePickerTranslationKey } from "./en";

export const ru = {
  requiresVersion: "Для этого скрипта требуется Excalidraw 2.0.0 или новее.",
  apiUnavailable: "Палитра цветов: не удалось получить API Excalidraw.",
  strokeColorSet: "Палитра цветов: цвет обводки изменён на {color}.",
} satisfies Record<ColorPalettePickerTranslationKey, string>;
