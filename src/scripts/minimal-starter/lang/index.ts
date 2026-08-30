import {
  createTranslator,
  type TranslationCatalog,
  type Translator,
} from "../../../sharedUtils/i18n";
import { de } from "./de";
import { en, type MinimalStarterTranslationKey } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { ru } from "./ru";
import { zhCn } from "./zh-cn";

const CATALOGS = { en, de, es, fr, ru, "zh-cn": zhCn } satisfies Record<
  string,
  TranslationCatalog<MinimalStarterTranslationKey>
>;

export type MinimalStarterTranslator = Translator<MinimalStarterTranslationKey>;

/** Creates the minimal starter's locale-aware translator. */
export function createMinimalStarterTranslator(locale: string): MinimalStarterTranslator {
  return createTranslator(locale, CATALOGS);
}
