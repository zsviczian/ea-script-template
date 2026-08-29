/**
 * @file main.ts
 * @overview Minimal starter script entrypoint.
 *
 * Build output: build/minimal-starter/minimal-starter.js
 */

import { showNotice } from "../../sharedUtils/notice";

/**
 * Minimal starter runner.
 *
 * @param ea   ExcalidrawAutomate instance.
 * @param _api Excalidraw API for the active view.
 */
export async function runMinimalStarter(
  ea: ExcalidrawAutomate,
  _api: ExcalidrawAPI,
): Promise<void> {
  const selected = ea.getViewSelectedElements();
  showNotice(`minimal-starter: selected ${selected.length} element(s).`);
}

/**
 * Script-engine entrypoint.
 */
async function main(): Promise<void> {
  if (!ea.verifyMinAppVersion("2.0.0")) {
    new Notice("This script requires Excalidraw 2.0.0 or newer.");
    return;
  }

  const api = ea.getExcalidrawAPI();
  if (!api) {
    showNotice("minimal-starter: could not obtain Excalidraw API.");
    return;
  }

  await runMinimalStarter(ea, api);
}

void main();
