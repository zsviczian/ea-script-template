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
  readdirSync,
  rmSync,
  writeFileSync,
} from "fs";
import { join, resolve } from "path";

const templateRoot = process.cwd();
const pluginRoot = resolve(templateRoot, "..", "obsidian-excalidraw-plugin");
const sourceRoot = join(pluginRoot, "docs", "AITrainingData", "excalidraw-automate");
const targetRoot = join(templateRoot, ".ai", "excalidraw-automate");

/**
 * Recursively copies one directory tree into another.
 *
 * @param {string} sourceDir
 * @param {string} targetDir
 */
function copyDirectory(sourceDir, targetDir) {
  mkdirSync(targetDir, { recursive: true });
  const entries = readdirSync(sourceDir, { withFileTypes: true });
  for (const entry of entries) {
    const src = join(sourceDir, entry.name);
    const dst = join(targetDir, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(src, dst);
      continue;
    }
    copyFileSync(src, dst);
  }
}

if (!existsSync(sourceRoot)) {
  console.error("sync-refs failed: plugin reference directory not found.");
  console.error(`Expected: ${sourceRoot}`);
  process.exit(1);
}

rmSync(targetRoot, { recursive: true, force: true });
copyDirectory(sourceRoot, targetRoot);
writeFileSync(
  join(targetRoot, "README.md"),
  `# ExcalidrawAutomate skill snapshot

This directory is synchronized from:
${sourceRoot}

Canonical upstream source:
https://github.com/zsviczian/obsidian-excalidraw-plugin/tree/master/docs/AITrainingData/excalidraw-automate
`,
  "utf8",
);

console.log(`Synced full skill snapshot from ${sourceRoot}`);
console.log(`Updated local workspace skill package at ${targetRoot}`);
