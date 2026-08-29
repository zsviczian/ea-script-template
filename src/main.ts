/**
 * @file main.ts
 * @overview
 *   Orchestrator for the EA script. Imports feature modules, initialises
 *   ExcalidrawAutomate, runs the main workflow, and cleans up.
 *
 *   Keep this file thin — delegate all real work to src/features/*.
 *
 * @author  Your Name
 * @version 1.0.0
 */

import { runFeature } from "./features/example-feature";
import { showNotice } from "./core/notice";
import { SCRIPT_NAME } from "./constants/strings";

/**
 * Entry point called by the Excalidraw Script Engine.
 * Must be async; top-level await is not supported in IIFE bundles.
 */
async function main(): Promise<void> {
  if (!ea.verifyMinAppVersion("2.0.0")) {
    new Notice("This script requires Excalidraw 2.0.0 or newer.");
    return;
  }

  const api = ea.getExcalidrawAPI();
  if (!api) {
    showNotice(`${SCRIPT_NAME}: Could not obtain Excalidraw API.`);
    return;
  }

  await runFeature(ea, api);
}

void main();
