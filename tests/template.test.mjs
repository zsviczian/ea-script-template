import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import ts from "typescript";
import { createManifest, hash, json, walk } from "../scripts/template-manifest.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const updater = join(root, "scripts/update-template.mjs");
const put = (base, name, content) => {
  const target = join(base, name);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, content);
};
function fixture(t) {
  const temp = mkdtempSync(join(tmpdir(), "ea-update-test-"));
  t.after(() => rmSync(temp, { recursive: true, force: true }));
  const source = join(temp, "source");
  const target = join(temp, "target");
  mkdirSync(source);
  mkdirSync(target);
  const manifest = {
    version: 1,
    files: { "AUTHORING_GUIDE.md": hash("old") },
    package: {
      scripts: { build: "old" },
      devDependencies: { example: "1" },
      engines: { node: ">=22" },
    },
  };
  for (const dir of [source, target]) {
    put(dir, "AUTHORING_GUIDE.md", "old");
    put(dir, ".template/manifest.json", json(manifest));
    put(
      dir,
      "package.json",
      json({ name: dir === target ? "my-scripts" : "template", ...manifest.package }),
    );
  }
  function publish(content = "new") {
    put(source, "package.json", json({ name: "template", ...manifest.package }));
    put(source, "AUTHORING_GUIDE.md", content);
    manifest.files["AUTHORING_GUIDE.md"] = hash(content);
    put(source, ".template/manifest.json", json(manifest));
  }
  function run(...args) {
    return spawnSync(process.execPath, [updater, "--source", source, ...args], {
      cwd: target,
      encoding: "utf8",
    });
  }
  return { source, target, manifest, publish, run };
}

test("updates and repeats safely; preview preserves files and package identity/custom keys", (t) => {
  const f = fixture(t);
  put(f.target, "src/scripts/mine/main.ts", "personal script");
  const pkg = JSON.parse(readFileSync(join(f.target, "package.json")));
  pkg.scripts.test = "my test";
  put(f.target, "package.json", json(pkg));
  f.manifest.package.scripts.build = "new build";
  f.publish();
  assert.equal(f.run("--check").status, 0);
  assert.equal(readFileSync(join(f.target, "AUTHORING_GUIDE.md"), "utf8"), "old");
  assert.equal(existsSync(join(f.target, ".template/state.json")), false);
  assert.equal(f.run().status, 0);
  assert.equal(readFileSync(join(f.target, "AUTHORING_GUIDE.md"), "utf8"), "new");
  const result = JSON.parse(readFileSync(join(f.target, "package.json")));
  assert.equal(result.name, "my-scripts");
  assert.equal(result.scripts.test, "my test");
  assert.equal(result.scripts.build, "new build");
  assert.equal(readFileSync(join(f.target, "src/scripts/mine/main.ts"), "utf8"), "personal script");
  assert.match(f.run().stdout, /Applying 0 change/);
});

test("conflicts abort all writes; explicit local resolution survives repeated updates", (t) => {
  const f = fixture(t);
  put(f.target, "AUTHORING_GUIDE.md", "custom");
  f.publish();
  const before = readFileSync(join(f.target, "package.json"), "utf8");
  assert.equal(f.run().status, 1);
  assert.equal(existsSync(join(f.target, ".template/state.json")), false);
  assert.equal(readFileSync(join(f.target, "package.json"), "utf8"), before);
  assert.equal(f.run("--keep-local", "AUTHORING_GUIDE.md").status, 0);
  assert.equal(f.run().status, 0);
  assert.equal(readFileSync(join(f.target, "AUTHORING_GUIDE.md"), "utf8"), "custom");
  f.publish("newer");
  assert.equal(f.run().status, 1);
  assert.equal(f.run("--accept-upstream", "AUTHORING_GUIDE.md").status, 0);
});

test("upstream deletions preserve modified files until explicitly resolved", (t) => {
  const f = fixture(t);
  delete f.manifest.files["AUTHORING_GUIDE.md"];
  delete f.manifest.package.devDependencies.example;
  put(f.source, "package.json", json({ name: "template", ...f.manifest.package }));
  put(f.source, ".template/manifest.json", json(f.manifest));
  put(f.target, "AUTHORING_GUIDE.md", "customized before deletion");
  assert.equal(f.run().status, 1);
  assert.equal(readFileSync(join(f.target, "AUTHORING_GUIDE.md"), "utf8"), "customized before deletion");
  assert.equal(f.run("--accept-upstream", "AUTHORING_GUIDE.md").status, 0);
  assert.equal(existsSync(join(f.target, "AUTHORING_GUIDE.md")), false);
  assert.equal(
    JSON.parse(readFileSync(join(f.target, "package.json"))).devDependencies.example,
    undefined,
  );
});

test("legacy adoption does not assume differing existing files match upstream", (t) => {
  const f = fixture(t);
  rmSync(join(f.target, ".template/manifest.json"));
  f.publish();
  assert.equal(f.run().status, 1);
  assert.equal(f.run("--accept-upstream", "AUTHORING_GUIDE.md").status, 0);
});

test("rejects invalid paths, stale content, and symlink destinations before writing", (t) => {
  const f = fixture(t);
  f.publish();
  put(f.source, "AUTHORING_GUIDE.md", "unpublished edit");
  assert.match(f.run().stderr, /Stale upstream manifest/);
  f.manifest.files["../outside"] = hash("bad");
  put(f.source, ".template/manifest.json", json(f.manifest));
  assert.match(f.run().stderr, /Invalid manifest entry/);
  delete f.manifest.files["../outside"];
  f.publish();
  rmSync(join(f.target, "AUTHORING_GUIDE.md"));
  symlinkSync(join(f.source, "AUTHORING_GUIDE.md"), join(f.target, "AUTHORING_GUIDE.md"));
  assert.match(f.run().stderr, /Refusing symlink/);
});

test("package-key conflicts preserve custom commands and accept only the named value", (t) => {
  const f = fixture(t);
  const pkg = JSON.parse(readFileSync(join(f.target, "package.json")));
  pkg.scripts.build = "custom build";
  put(f.target, "package.json", json(pkg));
  f.manifest.package.scripts.build = "new build";
  f.publish();
  assert.match(f.run().stderr, /package.json#scripts.build/);
  assert.equal(f.run("--keep-local", "package.json#scripts.build").status, 0);
  assert.equal(
    JSON.parse(readFileSync(join(f.target, "package.json"))).scripts.build,
    "custom build",
  );
});

test("generated declaration imports resolve and public API errors are caught", () => {
  const config = ts.readConfigFile(join(root, "tsconfig.json"), ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
  const options = {
    ...parsed.options,
    rootDir: root,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
    strict: true,
    skipLibCheck: true,
    noEmit: true,
  };
  for (const name of walk(root, ".template/types")) {
    const file = join(root, name);
    for (const { fileName: specifier } of ts.preProcessFile(readFileSync(file, "utf8"))
      .importedFiles) {
      if (specifier === "polybooljs") continue; // Ambient module is compiled explicitly below.
      assert.ok(
        ts.resolveModuleName(specifier, file, options, ts.sys).resolvedModule,
        `${name}: unresolved ${specifier}`,
      );
    }
  }
  const program = ts.createProgram(
    [join(root, "tests/api-types.ts"), join(root, ".template/types/polybooljs.d.ts")],
    options,
  );
  const diagnostics = ts.getPreEmitDiagnostics(program);
  assert.equal(
    diagnostics.length,
    0,
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCanonicalFileName: (f) => f,
      getCurrentDirectory: () => root,
      getNewLine: () => "\n",
    }),
  );
});

test("checked-in template manifest matches managed content", () => {
  // In downstream workspaces this checks the stored upstream baseline, not local customizations.
  const pkg = JSON.parse(readFileSync(join(root, "package.json")));
  if (pkg.name !== "ea-script-template" || existsSync(join(root, ".template/state.json"))) return;
  assert.deepEqual(
    JSON.parse(readFileSync(join(root, ".template/manifest.json"))),
    createManifest(root),
  );
});
