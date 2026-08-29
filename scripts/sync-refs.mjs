/**
 * @file sync-refs.mjs
 * @overview Syncs AI/bootstrap references from a sibling plugin repository.
 *
 * Default plugin source path:
 *   ../obsidian-excalidraw-plugin/docs/AITrainingData/excalidraw-automate
 */

import {
  copyFileSync,
  existsSync,
  mkdirSync,
} from "fs";
import { join, resolve } from "path";

const templateRoot = process.cwd();
const pluginRoot = resolve(templateRoot, "..", "obsidian-excalidraw-plugin");
const sourceRoot = join(pluginRoot, "docs", "AITrainingData", "excalidraw-automate");
const sourceRefs = join(sourceRoot, "references");
const targetRoot = join(templateRoot, ".ai", "excalidraw-automate");
const targetRefs = join(targetRoot, "references");

const requiredFiles = [
  [join(sourceRoot, "SKILL.md"), join(targetRoot, "SKILL.md")],
  [join(sourceRefs, "type-definitions.md"), join(targetRefs, "type-definitions.md")],
  [join(sourceRefs, "api-usage-index.md"), join(targetRefs, "api-usage-index.md")],
  [join(sourceRefs, "excalidraw-lib-functions.md"), join(targetRefs, "excalidraw-lib-functions.md")],
  [join(sourceRefs, "startup-scripts.md"), join(targetRefs, "startup-scripts.md")],
];

if (!existsSync(sourceRoot)) {
  console.error("sync-refs failed: plugin reference directory not found.");
  console.error(`Expected: ${sourceRoot}`);
  process.exit(1);
}

mkdirSync(targetRefs, { recursive: true });

for (const [src, dest] of requiredFiles) {
  if (!existsSync(src)) {
    console.error(`sync-refs failed: missing source file ${src}`);
    process.exit(1);
  }
  copyFileSync(src, dest);
}

console.log(`Synced references from ${sourceRoot}`);
console.log(`Updated local bootstrap under ${targetRoot}`);
