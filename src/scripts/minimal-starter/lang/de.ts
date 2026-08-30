import type { MinimalStarterTranslationKey } from "./en";

export const de = {
  requiresVersion: "Dieses Skript benötigt Excalidraw 2.0.0 oder neuer.",
  apiUnavailable: "Minimal Starter: Die Excalidraw-API konnte nicht abgerufen werden.",
  selectedElements: "Minimal Starter: {count} Element(e) ausgewählt.",
} satisfies Record<MinimalStarterTranslationKey, string>;
