import { showNotice } from "../../sharedUtils/notice";
import type { MinimalStarterTranslator } from "./lang";

/** Runs the import-safe, testable portion of the minimal starter script. */
export async function runMinimalStarter(
  ea: ExcalidrawAutomate,
  _api: ExcalidrawAPI,
  t: MinimalStarterTranslator,
): Promise<void> {
  const selected = ea.getViewSelectedElements();
  showNotice(t("selectedElements", { count: selected.length }));
}
