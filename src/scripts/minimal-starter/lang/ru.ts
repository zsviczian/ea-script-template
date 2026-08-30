import type { MinimalStarterTranslationKey } from "./en";

export const ru = {
  requiresVersion: "Для этого скрипта требуется Excalidraw 2.0.0 или новее.",
  apiUnavailable: "Минимальный пример: не удалось получить API Excalidraw.",
  selectedElements: "Минимальный пример: выбрано элементов: {count}.",
} satisfies Record<MinimalStarterTranslationKey, string>;
