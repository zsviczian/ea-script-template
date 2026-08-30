export const en = {
  requiresVersion: "This script requires Excalidraw 2.0.0 or newer.",
  apiUnavailable: "Minimal starter: could not obtain Excalidraw API.",
  selectedElements: "Minimal starter: selected {count} element(s).",
} as const;

export type MinimalStarterTranslationKey = keyof typeof en;
