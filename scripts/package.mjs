/**
 * @file package.mjs
 * @overview Copies all built script artefacts to release/.
 *   Run via: npm run package
 */

import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync } from "fs";
import { join } from "path";

const buildDir = join(process.cwd(), "build");
const releaseDir = join(process.cwd(), "release");

if (!existsSync(buildDir)) {
  console.error("build/ not found - run npm run build first.");
  process.exit(1);
}

const scriptDirs = readdirSync(buildDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

if (!scriptDirs.length) {
  console.error("No built scripts found under build/. Run npm run build first.");
  process.exit(1);
}

rmSync(releaseDir, { recursive: true, force: true });
mkdirSync(releaseDir, { recursive: true });

for (const slug of scriptDirs) {
  const sourceDir = join(buildDir, slug);
  const targetDir = join(releaseDir, slug);
  mkdirSync(targetDir, { recursive: true });

  const scriptMd = join(sourceDir, `${slug}.md`);
  const previewSvg = join(sourceDir, `${slug}.svg`);

  if (existsSync(scriptMd)) {
    copyFileSync(scriptMd, join(targetDir, `${slug}.md`));
  }
  if (existsSync(previewSvg)) {
    copyFileSync(previewSvg, join(targetDir, `${slug}.svg`));
  }
}

console.log(`Packaged ${scriptDirs.length} script(s) into ${releaseDir}`);
