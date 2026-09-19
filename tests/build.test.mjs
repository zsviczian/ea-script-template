import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
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
import { runInNewContext } from "node:vm";
import { test } from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

test("bundles type imports, retains computed constants, and rejects unavailable runtime imports", (t) => {
  const workspace = mkdtempSync(join(tmpdir(), "ea-build-test-"));
  t.after(() => rmSync(workspace, { recursive: true, force: true }));
  copyFileSync(join(root, "esbuild.config.mjs"), join(workspace, "esbuild.config.mjs"));
  writeFileSync(join(workspace, "package.json"), JSON.stringify({ name: "fixture", version: "1" }));
  symlinkSync(join(root, "node_modules"), join(workspace, "node_modules"), "junction");
  const script = join(workspace, "src/scripts/example");
  mkdirSync(script, { recursive: true });
  writeFileSync(join(script, "helper.ts"), "export const value = 7;");
  writeFileSync(
    join(script, "main.ts"),
    `
    import type { TFile } from "obsidian";
    import { value } from "./helper";
    const SETTINGS = { amount: 3 } as const;
    const COMPUTED = value * 2;
    ea.result = COMPUTED + SETTINGS.amount;
  `,
  );
  const build = () =>
    spawnSync(process.execPath, ["esbuild.config.mjs"], { cwd: workspace, encoding: "utf8" });
  let result = build();
  assert.equal(result.status, 0, result.stderr);
  const output = readFileSync(join(workspace, "build/example/example.md"), "utf8");
  const ea = {};
  runInNewContext(output, { ea });
  assert.equal(ea.result, 17);
  assert.ok(output.indexOf("const SETTINGS") < output.indexOf("// Script bundle"));
  writeFileSync(join(script, "main.ts"), 'import { Notice } from "obsidian"; new Notice("hello");');
  result = build();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Runtime import of obsidian is unavailable/);
});
