import { createHash } from "node:crypto";
import { lstatSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const hash = (value) => createHash("sha256").update(value).digest("hex");
export const json = (value) => `${JSON.stringify(value, null, 2)}\n`;
export const packageSections = ["scripts", "devDependencies", "engines"];
const files = [
  "AUTHORING_GUIDE.md",
  "CONTRIBUTING.md",
  "esbuild.config.mjs",
  "eslint.config.mjs",
  "tsconfig.json",
  "tsconfig.eslint.json",
  "src/types/ea.d.ts",
];

export function allowedPath(name) {
  return (
    typeof name === "string" &&
    !/[\\:]/.test(name) &&
    name.split("/").every((part) => part && part !== "." && part !== "..") &&
    (files.includes(name) ||
      /^(scripts|tests)\/[\w.-]+\.(mjs|ts)$/.test(name) ||
      name.startsWith(".ai/excalidraw-automate/") ||
      name.startsWith(".template/types/") ||
      [
        ".template/AGENTS.md",
        ".template/README.md",
        ".template/api-source.json",
        ".template/tsconfig.paths.json",
      ].includes(name))
  );
}

export function walk(root, prefix) {
  return readdirSync(join(root, prefix), { withFileTypes: true }).flatMap((entry) => {
    const name = `${prefix}/${entry.name}`;
    if (entry.isSymbolicLink()) throw new Error(`Symlinks are not supported: ${name}`);
    return entry.isDirectory() ? walk(root, name) : [name];
  });
}

export function createManifest(root) {
  const managed = [
    ...files,
    ...walk(root, "scripts"),
    ...walk(root, "tests"),
    ...walk(root, ".template"),
    ...walk(root, ".ai/excalidraw-automate"),
  ]
    .filter(allowedPath)
    .sort();
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  return {
    version: 1,
    files: Object.fromEntries(
      managed.map((name) => {
        if (!lstatSync(join(root, name)).isFile()) throw new Error(`Not a regular file: ${name}`);
        return [name, hash(readFileSync(join(root, name)))];
      }),
    ),
    package: Object.fromEntries(packageSections.map((key) => [key, pkg[key] ?? {}])),
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  writeFileSync(".template/manifest.json", json(createManifest(process.cwd())));
  console.log("Updated .template/manifest.json. Commit it with the template changes.");
}
