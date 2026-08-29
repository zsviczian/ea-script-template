/**
 * @file package.mjs
 * @overview Copies the built artefact to the release/ folder.
 *   Run via: npm run package
 */

import { copyFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const src = join(process.cwd(), "dist", "main.js");
const releaseDir = join(process.cwd(), "release");
const dest = join(releaseDir, "main.js");

if (!existsSync(src)) {
  console.error("dist/main.js not found — run `npm run build` first.");
  process.exit(1);
}

if (!existsSync(releaseDir)) {
  mkdirSync(releaseDir, { recursive: true });
}

copyFileSync(src, dest);
console.log(`✅  Packaged: ${dest}`);
