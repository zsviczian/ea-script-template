/**
 * @file main.ts  (minimal-starter example)
 * @overview
 *   The smallest possible EA script that follows the template conventions.
 *   Copy this file into src/main.ts when starting a brand-new script.
 *
 * @author  Your Name
 * @version 1.0.0
 */

/** Entry point called by the Excalidraw Script Engine. */
async function main(): Promise<void> {
  if (!ea.verifyMinAppVersion("2.0.0")) {
    new Notice("This script requires Excalidraw 2.0.0 or newer.");
    return;
  }

  new Notice("Hello from your EA script! 🎉");
}

void main();
