import type { MinimalStarterTranslationKey } from "./en";

export const fr = {
  requiresVersion: "Ce script nécessite Excalidraw 2.0.0 ou une version ultérieure.",
  apiUnavailable: "Démarrage minimal : impossible d’obtenir l’API Excalidraw.",
  selectedElements: "Démarrage minimal : {count} élément(s) sélectionné(s).",
} satisfies Record<MinimalStarterTranslationKey, string>;
