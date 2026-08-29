#!/usr/bin/env tsx
/**
 * @file new-script.ts
 * @overview Script scaffolder — generates a new feature module from a template.
 *
 * Usage:
 *   npm run new-script -- --name "My Feature"
 *   npm run new-script -- --name "My Feature" --out src/features
 */

import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

// ---------------------------------------------------------------------------
// Arg parsing
// ---------------------------------------------------------------------------

/**
 * Parses a named CLI argument.
 *
 * @param flag  Argument name without leading dashes (e.g. "name").
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

// ---------------------------------------------------------------------------
// Template
// ---------------------------------------------------------------------------

/**
 * Returns the feature module source file content for the given name.
 *
 * @param displayName  Human-readable script name.
 * @param slug         Hyphenated identifier.
 * @param funcName     PascalCase prefix for the exported run function.
 */
function featureTemplate(displayName: string, slug: string, funcName: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `/**
 * @file ${slug}.ts
 * @overview
 *   ${displayName} — describe what this feature does in one or two sentences.
 *
 * @author  Your Name
 * @version 1.0.0
 * @created ${date}
 */

import { showNotice } from "../core/notice";
import { MSG } from "../constants/strings";
import type { FeatureResult } from "../types/script-types";

/**
 * Runs the ${displayName} feature.
 *
 * @param ea   The ExcalidrawAutomate instance.
 * @param _api The live Excalidraw React API.
 * @returns    A FeatureResult describing the outcome.
 */
export async function run${funcName}(
  ea: ExcalidrawAutomate,
  _api: ExcalidrawAPI,
): Promise<FeatureResult> {
  const selected = ea.getViewSelectedElements();

  if (selected.length === 0) {
    showNotice(MSG.NO_SELECTION);
    return { success: false, message: MSG.NO_SELECTION };
  }

  // TODO: implement ${displayName}

  showNotice(MSG.SUCCESS);
  return { success: true };
}
`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const name = getArg("name");
if (!name) {
  console.error("Usage: npm run new-script -- --name \"My Feature\" [--out src/features]");
  process.exit(1);
}

const outDir = getArg("out") ?? "src/features";
const slug = toSlug(name);
const funcName = toPascalCase(slug);
const outPath = join(process.cwd(), outDir, `${slug}.ts`);

if (existsSync(outPath)) {
  console.error(`File already exists: ${outPath}`);
  process.exit(1);
}

if (!existsSync(join(process.cwd(), outDir))) {
  mkdirSync(join(process.cwd(), outDir), { recursive: true });
}

writeFileSync(outPath, featureTemplate(name, slug, funcName), "utf8");

console.log(`✅  Created ${outPath}`);
console.log(`   Export: run${funcName}(ea, api)`);
console.log(`   Import it in src/main.ts to wire it up.`);
