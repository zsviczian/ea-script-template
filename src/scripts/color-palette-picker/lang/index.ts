import {
  createTranslator,
  type TranslationCatalog,
  type Translator,
} from "../../../sharedUtils/i18n";
import { de } from "./de";
import { en, type ColorPalettePickerTranslationKey } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { ru } from "./ru";
import { zhCn } from "./zh-cn";

const CATALOGS = { en, de, es, fr, ru, "zh-cn": zhCn } satisfies Record<
  string,
  TranslationCatalog<ColorPalettePickerTranslationKey>
>;

export type ColorPalettePickerTranslator = Translator<ColorPalettePickerTranslationKey>;

/** Creates the color palette picker's locale-aware translator. */
export function createColorPalettePickerTranslator(locale: string): ColorPalettePickerTranslator {
  return createTranslator(locale, CATALOGS);
}
