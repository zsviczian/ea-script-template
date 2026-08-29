import { build, transform } from "esbuild";
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
import { Script } from "vm";
import ts from "typescript";

const pkg = JSON.parse(readFileSync("./package.json", "utf8"));
const scriptsRoot = join(process.cwd(), "src", "scripts");
const outRoot = join(process.cwd(), "build");
const buildVersion = new Date().toISOString();

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
  <text x="86" y="130" fill="#1f2937" font-size="34" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace">${scriptSlug}.md</text>
  <text x="86" y="180" fill="#374151" font-size="24" font-family="ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif">Preview placeholder for ${title}</text>
  <text x="86" y="220" fill="#6b7280" font-size="20" font-family="ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif">Replace src/scripts/${scriptSlug}/preview.svg for production use.</text>
</svg>`;
}

/** Escapes block-comment terminators so README text cannot expose executable code. */
function escapeBlockComment(content) {
  return content.replaceAll("*/", "* /");
}

/**
 * Treats top-level UPPER_SNAKE_CASE constants as user-editable configuration.
 *
 * @param {string} sourceText
 * @returns {{ constantsSource: string, bundleSource: string }}
 */
function moveConfigurationConstants(sourceText) {
  const sourceFile = ts.createSourceFile(
    "main.ts",
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  const statements = [];
  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue;
    }

    const isConst = (statement.declarationList.flags & ts.NodeFlags.Const) === ts.NodeFlags.Const;
    if (!isConst) {
      continue;
    }

    const isConfiguration = statement.declarationList.declarations.every(
      (declaration) =>
        ts.isIdentifier(declaration.name) && /^[A-Z][A-Z0-9_]*$/.test(declaration.name.text),
    );
    if (!isConfiguration) {
      continue;
    }

    statements.push({
      start: statement.getStart(sourceFile),
      end: statement.end,
      source: sourceText.slice(statement.getStart(sourceFile), statement.end),
    });
  }

  let bundleSource = sourceText;
  for (const statement of statements.toReversed()) {
    bundleSource = bundleSource.slice(0, statement.start) + bundleSource.slice(statement.end);
  }

  return {
    constantsSource: statements
      .map((statement) => statement.source)
      .join("\n\n")
      .trim(),
    bundleSource,
  };
}

/**
 * @param {object} args
 * @param {string} args.readme
 * @param {string} args.buildVersion
 * @param {string} args.constantsJs
 * @param {string} args.bundleJs
 * @returns {string}
 */
function createScriptMarkdown({ readme, buildVersion, constantsJs, bundleJs }) {
  const lines = ["/*"];
  const readmeContent = escapeBlockComment(readme).trim();
  if (readmeContent) {
    lines.push(readmeContent, "");
  }
  lines.push(`Build version: ${buildVersion}`, "", "```javascript", "*/", "");

  if (constantsJs.trim()) {
    lines.push("// Configuration constants");
    lines.push(constantsJs.trim());
    lines.push("");
  }

  lines.push("// Script bundle");
  lines.push(bundleJs.trim());

  return `${lines.join("\n")}\n`;
}

if (!existsSync(scriptsRoot)) {
  throw new Error(`Scripts directory not found: ${scriptsRoot}`);
}

const scriptSlugs = readdirSync(scriptsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

if (!scriptSlugs.length) {
  throw new Error(
    "No script directories found under src/scripts. Add at least one script folder with main.ts.",
  );
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

  const sourceText = readFileSync(entryPoint, "utf8");
  const readmePath = join(scriptDir, "README.md");
  const readme = existsSync(readmePath) ? readFileSync(readmePath, "utf8") : "";
  const { constantsSource, bundleSource } = moveConfigurationConstants(sourceText);
  const constDeclarationsJs = constantsSource
    ? (
        await transform(constantsSource, {
          loader: "ts",
          format: "esm",
          target: "es2022",
        })
      ).code
    : "";

  const buildResult = await build({
    stdin: {
      contents: bundleSource,
      loader: "ts",
      resolveDir: scriptDir,
      sourcefile: entryPoint,
    },
    bundle: true,
    outfile: join(scriptOutDir, `${slug}.js`),
    format: "iife",
    platform: "browser",
    target: "es2022",
    minify: false,
    sourcemap: false,
    write: false,
    logLevel: "warning",
  });

  const bundleFile = buildResult.outputFiles?.find((file) => file.path.endsWith(".js"));
  if (!bundleFile) {
    throw new Error(`Failed to build script bundle for ${slug}`);
  }

  const markdownScript = createScriptMarkdown({
    readme,
    buildVersion,
    constantsJs: constDeclarationsJs,
    bundleJs: `/* EA Script — ${slug} | ${pkg.name} v${pkg.version} */\n${bundleFile.text}\n/* end of bundle */`,
  });

  writeFileSync(join(scriptOutDir, `${slug}.md`), markdownScript, "utf8");
  new Script(markdownScript, { filename: `${slug}.md` });

  const previewSource = join(scriptDir, "preview.svg");
  const previewTarget = join(scriptOutDir, `${slug}.svg`);
  if (existsSync(previewSource)) {
    copyFileSync(previewSource, previewTarget);
  } else {
    writeFileSync(previewTarget, placeholderPreviewSvg(slug), "utf8");
  }
}

console.log(`Built ${scriptSlugs.length} script target(s) into ${outRoot}`);
