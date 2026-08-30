import { showNotice } from "../../sharedUtils/notice";
import { createMinimalStarterTranslator } from "./lang";
import { runMinimalStarter } from "./run";

/**
 * Script-engine entrypoint.
 */
async function main(): Promise<void> {
  const t = createMinimalStarterTranslator(ea.obsidian.moment.locale());

  if (!ea.verifyMinimumPluginVersion("2.0.0")) {
    new Notice(t("requiresVersion"));
    return;
  }

  const api = ea.getExcalidrawAPI();
  if (!api) {
    showNotice(t("apiUnavailable"));
    return;
  }

  await runMinimalStarter(ea, api, t);
}

void main();
