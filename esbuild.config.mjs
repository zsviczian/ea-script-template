import { build } from "esbuild";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "fs";
import { join } from "path";

const pkg = JSON.parse(readFileSync("./package.json", "utf8"));
const scriptsRoot = join(process.cwd(), "src", "scripts");
const outRoot = join(process.cwd(), "build");

/**
 * @param {string} scriptSlug
 * @returns {string}
 */
function placeholderPreviewSvg(scriptSlug) {
  const title = scriptSlug.replace(/-/g, " ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450" role="img" aria-label="${scriptSlug} preview placeholder">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#f8f9fb" />
      <stop offset="100%" stop-color="#eef2f7" />
    </linearGradient>
  </defs>
  <rect width="800" height="450" fill="url(#bg)" />
  <rect x="56" y="56" width="688" height="338" rx="20" fill="#ffffff" stroke="#c4ceda" />
  <text x="86" y="130" fill="#1f2937" font-size="34" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace">${scriptSlug}.js</text>
  <text x="86" y="180" fill="#374151" font-size="24" font-family="ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif">Preview placeholder for ${title}</text>
  <text x="86" y="220" fill="#6b7280" font-size="20" font-family="ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif">Replace src/scripts/${scriptSlug}/preview.svg for production use.</text>
</svg>`;
}

if (!existsSync(scriptsRoot)) {
  throw new Error(`Scripts directory not found: ${scriptsRoot}`);
}

const scriptSlugs = readdirSync(scriptsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

if (!scriptSlugs.length) {
  throw new Error("No script directories found under src/scripts. Add at least one script folder with main.ts.");
}

rmSync(outRoot, { recursive: true, force: true });
mkdirSync(outRoot, { recursive: true });

for (const slug of scriptSlugs) {
  const scriptDir = join(scriptsRoot, slug);
  const entryPoint = join(scriptDir, "main.ts");
  if (!existsSync(entryPoint)) {
    console.warn(`Skipping ${slug}: missing main.ts`);
    continue;
  }

  const scriptOutDir = join(outRoot, slug);
  mkdirSync(scriptOutDir, { recursive: true });

  await build({
    entryPoints: [entryPoint],
    bundle: true,
    outfile: join(scriptOutDir, `${slug}.js`),
    format: "iife",
    platform: "browser",
    target: "es2022",
    minify: false,
    sourcemap: false,
    banner: {
      js: `/* EA Script — ${slug} | ${pkg.name} v${pkg.version} */`,
    },
    footer: {
      js: "/* end of bundle */",
    },
    logLevel: "info",
  });

  const previewSource = join(scriptDir, "preview.svg");
  const previewTarget = join(scriptOutDir, `${slug}.svg`);
  if (existsSync(previewSource)) {
    copyFileSync(previewSource, previewTarget);
  } else {
    writeFileSync(previewTarget, placeholderPreviewSvg(slug), "utf8");
  }
}

console.log(`Built ${scriptSlugs.length} script target(s) into ${outRoot}`);
