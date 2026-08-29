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
  readFileSync,
  renameSync,
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

/**
 * Converts reference script filenames from .md to .js for semantic clarity.
 * README.md stays markdown. A generated .js.md script replaces a same-named
 * .js placeholder so the full script remains available in the local snapshot.
 */
function normalizeReferenceScriptExtensions() {
  const scriptRefsDir = join(targetRoot, "references", "scripts");
  if (!existsSync(scriptRefsDir)) {
    return;
  }

  const entries = readdirSync(scriptRefsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }

    const fileName = entry.name;
    if (!fileName.endsWith(".md") || fileName === "README.md") {
      continue;
    }

    const baseName = fileName.slice(0, -3);
    const targetName = baseName.endsWith(".js") ? baseName : `${baseName}.js`;
    const sourcePath = join(scriptRefsDir, fileName);
    const targetPath = join(scriptRefsDir, targetName);

    if (existsSync(targetPath)) {
      rmSync(targetPath, { force: true });
    }

    renameSync(sourcePath, targetPath);
  }
}

/**
 * Rewrites local markdown links that still point at script *.md names so they
 * resolve after script-reference normalization to *.js.
 */
function rewriteScriptReferenceLinks() {
  const markdownFiles = [];
  const stack = [targetRoot];
  while (stack.length) {
    const currentDir = stack.pop();
    if (!currentDir) {
      continue;
    }
    const entries = readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }
      if (entry.isFile() && fullPath.endsWith(".md")) {
        markdownFiles.push(fullPath);
      }
    }
  }

  for (const markdownFile of markdownFiles) {
    if (!existsSync(markdownFile)) {
      continue;
    }

    const original = readFileSync(markdownFile, "utf8");
    const rewritten = original.replace(
      /\[([^\]\n]+)\]\(((?:\.\/)?scripts\/[^\n)]+)\.md\)/g,
      (_match, label, target) => {
        const normalizedLabelBase = String(label).replace(/\.md$/, "");
        const normalizedLabel = normalizedLabelBase.endsWith(".js")
          ? normalizedLabelBase
          : `${normalizedLabelBase}.js`;
        const normalizedTarget = String(target).endsWith(".js") ? String(target) : `${target}.js`;
        return `[${normalizedLabel}](${normalizedTarget})`;
      },
    );
    if (rewritten !== original) {
      writeFileSync(markdownFile, rewritten, "utf8");
    }
  }
}

if (!existsSync(sourceRoot)) {
  console.error("sync-refs failed: plugin reference directory not found.");
  console.error(`Expected: ${sourceRoot}`);
  process.exit(1);
}

rmSync(targetRoot, { recursive: true, force: true });
copyDirectory(sourceRoot, targetRoot);
normalizeReferenceScriptExtensions();
rewriteScriptReferenceLinks();
writeFileSync(
  join(targetRoot, "README.md"),
  `# ExcalidrawAutomate skill snapshot

This directory is synchronized from the plugin repository:
https://github.com/zsviczian/obsidian-excalidraw-plugin/tree/master/docs/AITrainingData/excalidraw-automate

Update source content by running npm run doc in the plugin repository.
`,
  "utf8",
);

console.log(`Synced full skill snapshot from ${sourceRoot}`);
console.log(`Updated local workspace skill package at ${targetRoot}`);
