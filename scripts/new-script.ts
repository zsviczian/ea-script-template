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
function scriptMainTemplate(displayName: string, slug: string, funcName: string): string {
  const date = new Date().toISOString().slice(0, 10);
  return `/**
 * @file main.ts
 * @overview
 *   ${displayName} script entrypoint.
 *
 *   Folder: src/scripts/${slug}
 *   Build output: build/${slug}/${slug}.md
 *
 * @author  Your Name
 * @version 1.0.0
 * @created ${date}
 */

import { showNotice } from "../../sharedUtils/notice";
import { create${funcName}Translator } from "./lang";
import { run${funcName} } from "./run";

/**
 * Script-engine entrypoint.
 */
async function main(): Promise<void> {
  const t = create${funcName}Translator(ea.obsidian.moment.locale());

  if (!ea.verifyMinAppVersion("2.0.0")) {
    new Notice(t("requiresVersion"));
    return;
  }

  const api = ea.getExcalidrawAPI();
  if (!api) {
    showNotice(t("apiUnavailable"));
    return;
  }

  await run${funcName}(ea, api, t);
}

void main();
`;
}

/** Returns the import-safe runner used by the script and its tests. */
function scriptRunnerTemplate(displayName: string, funcName: string): string {
  return `import { showNotice } from "../../sharedUtils/notice";
import type { ${funcName}Translator } from "./lang";

/** Runs ${displayName}. */
export async function run${funcName}(
  ea: ExcalidrawAutomate,
  _api: ExcalidrawAPI,
  t: ${funcName}Translator,
): Promise<void> {
  const selected = ea.getViewSelectedElements();
  if (selected.length === 0) {
    showNotice(t("selectElement"));
    return;
  }

  // TODO: implement ${displayName}.
  showNotice(t("done"));
}
`;
}

/** Returns the English source-of-truth catalog. */
function englishCatalogTemplate(funcName: string): string {
  return `export const en = {
  requiresVersion: "This script requires Excalidraw 2.0.0 or newer.",
  apiUnavailable: "Could not obtain Excalidraw API.",
  selectElement: "Please select at least one element.",
  done: "Done. Replace this with your real workflow.",
} as const;

export type ${funcName}TranslationKey = keyof typeof en;
`;
}

/** Returns an intentionally partial catalog that falls back to English. */
function partialCatalogTemplate(localeIdentifier: string, funcName: string): string {
  return `import type { ${funcName}TranslationKey } from "./en";

// Add reviewed translations here; missing keys fall back to English.
export const ${localeIdentifier} = {} satisfies Partial<Record<${funcName}TranslationKey, string>>;
`;
}

/** Returns the script-local catalog registry. */
function catalogIndexTemplate(funcName: string): string {
  return `import {
  createTranslator,
  type TranslationCatalog,
  type Translator,
} from "../../../sharedUtils/i18n";
import { de } from "./de";
import { en, type ${funcName}TranslationKey } from "./en";
import { es } from "./es";
import { fr } from "./fr";
import { ru } from "./ru";
import { zhCn } from "./zh-cn";

const CATALOGS = { en, de, es, fr, ru, "zh-cn": zhCn } satisfies Record<
  string,
  TranslationCatalog<${funcName}TranslationKey>
>;

export type ${funcName}Translator = Translator<${funcName}TranslationKey>;

/** Creates this script's locale-aware translator. */
export function create${funcName}Translator(locale: string): ${funcName}Translator {
  return createTranslator(locale, CATALOGS);
}
`;
}

/** Returns a small behavior test for the generated runner. */
function testTemplate(funcName: string): string {
  return `import { afterEach, describe, expect, it, vi } from "vitest";

import { create${funcName}Translator } from "../lang";
import { run${funcName} } from "../run";

describe("${funcName}", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("asks for a selection when the scene selection is empty", async () => {
    const notices: string[] = [];
    vi.stubGlobal("Notice", class {
      constructor(message: string) { notices.push(message); }
    });
    const fakeEa = { getViewSelectedElements: () => [] } as unknown as ExcalidrawAutomate;

    await run${funcName}(fakeEa, {} as ExcalidrawAPI, create${funcName}Translator("en"));

    expect(notices).toEqual(["Please select at least one element."]);
  });
});
`;
}

/** Returns starter documentation for the generated script. */
function readmeTemplate(displayName: string): string {
  return `# ${displayName}

Describe what the script does and how to use it.

## Development

- Put executable bootstrap logic in \`main.ts\` and testable behavior in \`run.ts\`.
- Put UI strings in \`lang/en.ts\`; add reviewed translations to the other catalogs.
- Put script-owned tests in \`__tests__/*.test.ts\` and run \`npm test\`.
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
  console.error('Usage: npm run new-script -- --name "My Script"');
  process.exit(1);
}

const slug = toSlug(name);
const funcName = toPascalCase(slug);
const scriptDir = join(process.cwd(), "src", "scripts", slug);
const mainPath = join(scriptDir, "main.ts");
const runPath = join(scriptDir, "run.ts");
const readmePath = join(scriptDir, "README.md");
const previewPath = join(scriptDir, "preview.svg");
const langDir = join(scriptDir, "lang");
const testsDir = join(scriptDir, "__tests__");

if (existsSync(scriptDir)) {
  console.error(`Script directory already exists: ${scriptDir}`);
  process.exit(1);
}

mkdirSync(langDir, { recursive: true });
mkdirSync(testsDir, { recursive: true });
writeFileSync(mainPath, scriptMainTemplate(name, slug, funcName), "utf8");
writeFileSync(runPath, scriptRunnerTemplate(name, funcName), "utf8");
writeFileSync(readmePath, readmeTemplate(name), "utf8");
writeFileSync(previewPath, previewTemplate(name, slug), "utf8");
writeFileSync(join(langDir, "en.ts"), englishCatalogTemplate(funcName), "utf8");
writeFileSync(join(langDir, "de.ts"), partialCatalogTemplate("de", funcName), "utf8");
writeFileSync(join(langDir, "es.ts"), partialCatalogTemplate("es", funcName), "utf8");
writeFileSync(join(langDir, "fr.ts"), partialCatalogTemplate("fr", funcName), "utf8");
writeFileSync(join(langDir, "ru.ts"), partialCatalogTemplate("ru", funcName), "utf8");
writeFileSync(join(langDir, "zh-cn.ts"), partialCatalogTemplate("zhCn", funcName), "utf8");
writeFileSync(join(langDir, "index.ts"), catalogIndexTemplate(funcName), "utf8");
writeFileSync(join(testsDir, "run.test.ts"), testTemplate(funcName), "utf8");

console.log(`Created script workspace: ${scriptDir}`);
console.log(`- Entry point: ${mainPath}`);
console.log(`- Testable runner: ${runPath}`);
console.log(`- Locales: ${langDir}`);
console.log(`- Tests: ${testsDir}`);
console.log(`- Preview: ${previewPath}`);
console.log(`- Exported runner: run${funcName}(ea, api)`);
