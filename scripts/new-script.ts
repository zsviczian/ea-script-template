#!/usr/bin/env tsx
/**
 * @file new-script.ts
 * @overview Script scaffolder — generates a new script workspace under src/scripts/{slug}.
 *
 * Usage:
 *   npm run new-script -- --name "My Feature"
 */

import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

// ---------------------------------------------------------------------------
// Arg parsing
// ---------------------------------------------------------------------------

/**
 * Parses a named CLI argument.
 *
 * @param flag  Argument name without leading dashes (for example "name").
 * @returns     The string value, or null if not present.
 */
function getArg(flag: string): string | null {
  const idx = process.argv.indexOf(`--${flag}`);
  if (idx === -1) return null;
  return process.argv[idx + 1] ?? null;
}

// ---------------------------------------------------------------------------
// Slug helpers
// ---------------------------------------------------------------------------

/**
 * Converts a display name to a lowercase hyphenated slug.
 * Only a-z, 0-9, and hyphens are preserved.
 *
 * @param name  Human-readable script name.
 * @returns     URL-safe slug.
 */
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Converts a slug to PascalCase for use as a TypeScript identifier.
 *
 * @param slug  Hyphenated slug string.
 * @returns     PascalCase variant.
 */
function toPascalCase(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/**
 * Escapes XML entities for safe SVG text rendering.
 *
 * @param input  Raw text.
 * @returns      Escaped XML-safe text.
 */
function escapeXml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// ---------------------------------------------------------------------------
// Template
// ---------------------------------------------------------------------------

/**
 * Returns the script entrypoint source content for the given name.
 *
 * @param displayName  Human-readable script name.
 * @param slug         Hyphenated identifier.
 * @param funcName     PascalCase prefix for the exported run function.
 */
// eslint-disable-next-line max-lines-per-function -- Template emitters are long string factories by design.
function scriptMainTemplate(displayName: string, slug: string, funcName: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `/**
 * @file main.ts
 * @overview
 *   ${displayName} script entrypoint.
 *
 *   Folder: src/scripts/${slug}
 *   Build output: build/${slug}/${slug}.js
 *
 * @author  Your Name
 * @version 1.0.0
 * @created ${date}
 */

import { showNotice } from "../../sharedUtils/notice";

/**
 * Runs the ${displayName} script.
 *
 * @param ea   The ExcalidrawAutomate instance.
 * @param _api The live Excalidraw React API.
 * @returns    Promise resolving when execution completes.
 */
export async function run${funcName}(
  ea: ExcalidrawAutomate,
  _api: ExcalidrawAPI,
): Promise<void> {
  const selected = ea.getViewSelectedElements();

  if (selected.length === 0) {
    showNotice("Please select at least one element.");
    return;
  }

  // TODO: implement ${displayName}
  // Suggested structure:
  // - Keep reusable logic in src/sharedUtils/
  // - Keep script-local constants/types under this folder
  // - Commit scene changes via await ea.addElementsToView(...)

  showNotice("Done. Replace this with your real workflow.");
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
    showNotice("Could not obtain Excalidraw API.");
    return;
  }

  await run${funcName}(ea, api);
}

void main();
`;
}

/**
 * Returns a starter SVG preview for the script.
 *
 * @param displayName  Human-readable script name.
 * @param slug         Hyphenated identifier.
 */
function previewTemplate(displayName: string, slug: string): string {
  const safeTitle = escapeXml(displayName);
  const safeSlug = escapeXml(slug);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450" role="img" aria-label="${safeSlug} preview">
  <rect width="800" height="450" fill="#f6f8fb" />
  <rect x="52" y="52" width="696" height="346" rx="18" fill="#ffffff" stroke="#c6ceda" />
  <text x="88" y="138" fill="#1f2937" font-size="36" font-family="ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif">${safeTitle}</text>
  <text x="88" y="188" fill="#4b5563" font-size="22" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace">scripts-${safeSlug}.svg</text>
  <text x="88" y="228" fill="#6b7280" font-size="20" font-family="ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif">Replace this preview with a real screenshot before publishing.</text>
</svg>`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const name = getArg("name");
if (!name) {
  console.error("Usage: npm run new-script -- --name \"My Script\"");
  process.exit(1);
}

const slug = toSlug(name);
const funcName = toPascalCase(slug);
const scriptDir = join(process.cwd(), "src", "scripts", slug);
const mainPath = join(scriptDir, "main.ts");
const previewPath = join(scriptDir, "preview.svg");

if (existsSync(scriptDir)) {
  console.error(`Script directory already exists: ${scriptDir}`);
  process.exit(1);
}

mkdirSync(scriptDir, { recursive: true });
writeFileSync(mainPath, scriptMainTemplate(name, slug, funcName), "utf8");
writeFileSync(previewPath, previewTemplate(name, slug), "utf8");

console.log(`Created script workspace: ${scriptDir}`);
console.log(`- Entry point: ${mainPath}`);
console.log(`- Preview: ${previewPath}`);
console.log(`- Exported runner: run${funcName}(ea, api)`);
