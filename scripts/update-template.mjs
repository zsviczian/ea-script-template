import { execFileSync } from "node:child_process";
import {
  existsSync,
  lstatSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { allowedPath, hash, json, packageSections } from "./template-manifest.mjs";

const upstream = "https://github.com/zsviczian/ea-script-template.git";
const root = process.cwd();
const args = process.argv.slice(2);
const keep = new Set();
const accept = new Set();
let source;
let check = false;
for (let index = 0; index < args.length; index++) {
  const arg = args[index];
  if (arg === "--check") check = true;
  else if (["--source", "--keep-local", "--accept-upstream"].includes(arg)) {
    const value = args[++index];
    if (!value || value.startsWith("--")) throw new Error(`Missing value for ${arg}`);
    if (arg === "--source") source = resolve(value);
    else (arg === "--keep-local" ? keep : accept).add(value);
  } else throw new Error(`Unknown option: ${arg}`);
}
for (const name of keep) if (accept.has(name)) throw new Error(`Conflicting choices: ${name}`);

// Check every ancestor, including directories: a managed file must never escape via a symlink.
function safePath(base, name) {
  let current = base;
  for (const part of name.split("/")) {
    current = join(current, part);
    let stat;
    try {
      stat = lstatSync(current);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    if (stat?.isSymbolicLink()) throw new Error(`Refusing symlink: ${current}`);
  }
  return current;
}
function read(base, name) {
  const path = safePath(base, name);
  return existsSync(path) ? readFileSync(path) : null;
}
function readJson(base, name) {
  const bytes = read(base, name);
  return bytes === null ? null : JSON.parse(bytes.toString());
}
function validate(manifest) {
  if (manifest?.version !== 1 || !manifest.files || !manifest.package) {
    throw new Error(
      "Unsupported or missing template manifest. Update the bootstrap updater first.",
    );
  }
  for (const [name, digest] of Object.entries(manifest.files)) {
    if (!allowedPath(name) || !/^[a-f0-9]{64}$/.test(digest))
      throw new Error(`Invalid manifest entry: ${name}`);
  }
  for (const section of Object.keys(manifest.package)) {
    if (!packageSections.includes(section)) throw new Error(`Invalid package section: ${section}`);
    for (const [key, value] of Object.entries(manifest.package[section])) {
      if (["__proto__", "constructor", "prototype"].includes(key) || typeof value !== "string") {
        throw new Error(`Invalid package entry: ${section}.${key}`);
      }
    }
  }
}
const fingerprint = (value) => (value === null ? null : hash(value));
const localFingerprint = (value) =>
  value === null ? null : hash(value.toString().replaceAll("\r\n", "\n"));
let temporary;
try {
  if (!source) {
    temporary = mkdtempSync(join(tmpdir(), "ea-template-"));
    source = join(temporary, "upstream");
    execFileSync(
      "git",
      ["clone", "--quiet", "--depth", "1", upstream, source],
      { stdio: "inherit" },
    );
  }
  if (resolve(source) === resolve(root))
    throw new Error("The update source must be a separate checkout.");
  const incoming = readJson(source, ".template/manifest.json");
  validate(incoming);
  const sourcePackage = readJson(source, "package.json");
  for (const section of packageSections) {
    if (json(sourcePackage?.[section] ?? {}) !== json(incoming.package[section] ?? {})) {
      throw new Error(
        `Stale upstream manifest: package.json#${section}. Run npm run template:manifest in the template.`,
      );
    }
  }
  const state = readJson(root, ".template/state.json");
  const baseline = state?.manifest ?? readJson(root, ".template/manifest.json");
  if (baseline) validate(baseline);
  const changes = new Map();
  const conflicts = [];
  const seen = new Set();
  function choose(name, local, previous, next) {
    seen.add(name);
    if (local === next) return false;
    if (keep.has(name)) return false;
    if (accept.has(name)) return true;
    if (next === previous) return false; // No upstream change; retain local customization.
    if (local === previous) return true;
    conflicts.push(name);
    return false;
  }
  for (const name of new Set([
    ...Object.keys(baseline?.files ?? {}),
    ...Object.keys(incoming.files),
  ])) {
    const next = incoming.files[name] ? read(source, name) : null;
    if (fingerprint(next) !== (incoming.files[name] ?? null))
      throw new Error(
        `Stale upstream manifest: ${name}. Run npm run template:manifest in the template.`,
      );
    const local = read(root, name);
    if (choose(name, localFingerprint(local), baseline?.files[name] ?? null, fingerprint(next)))
      changes.set(name, next);
  }
  const pkg = readJson(root, "package.json");
  if (!pkg) throw new Error("Run this command from your script repository root.");
  const originalPackage = json(pkg);
  for (const section of packageSections) {
    const oldValues = baseline?.package[section] ?? {};
    const nextValues = incoming.package[section] ?? {};
    for (const key of new Set([...Object.keys(oldValues), ...Object.keys(nextValues)])) {
      const next = nextValues[key] ?? null;
      if (
        choose(
          `package.json#${section}.${key}`,
          pkg[section]?.[key] ?? null,
          oldValues[key] ?? null,
          next,
        )
      ) {
        pkg[section] ??= {};
        if (next === null) delete pkg[section][key];
        else pkg[section][key] = next;
      }
    }
  }
  for (const name of [...keep, ...accept])
    if (!seen.has(name)) throw new Error(`Unknown resolution: ${name}`);
  if (json(pkg) !== originalPackage) changes.set("package.json", Buffer.from(json(pkg)));
  if (conflicts.length) {
    console.error("No files changed. Review these locally customized paths/keys:");
    for (const name of conflicts) console.error(`  ${name}`);
    console.error(
      "Rerun with --keep-local <path/key> or --accept-upstream <path/key> for each conflict. Repeat options as needed. Compare with the source checkout before deciding.",
    );
    process.exitCode = 1;
  } else {
    for (const [name, content] of changes)
      console.log(`${content === null ? "Delete" : "Update"} ${name}`);
    console.log(`${check ? "Preview:" : "Applying"} ${changes.size} change(s).`);
    if (!check) {
      let revision = "local checkout";
      try {
        revision = execFileSync("git", ["-C", source, "rev-parse", "HEAD"], {
          encoding: "utf8",
        }).trim();
      } catch {
        /* Local fixtures need not be Git repositories. */
      }
      changes.set(".template/manifest.json", Buffer.from(json(incoming)));
      changes.set(
        ".template/state.json",
        Buffer.from(json({ version: 1, upstream, revision, manifest: incoming })),
      );
      // Preflight every destination and save originals before the first write.
      const originals = new Map([...changes.keys()].map((name) => [name, read(root, name)]));
      const written = [];
      const write = (name, bytes) => {
        const target = safePath(root, name);
        if (bytes === null) rmSync(target, { force: true });
        else {
          mkdirSync(dirname(target), { recursive: true });
          writeFileSync(target, bytes);
        }
      };
      try {
        for (const [name, bytes] of changes) {
          written.push(name);
          write(name, bytes);
        }
      } catch (error) {
        for (const name of written.reverse()) write(name, originals.get(name));
        throw error;
      }
      console.log(
        "Review git diff, then run npm install, npm run check, and npm run build. Commit the lockfile and .template state with the update.",
      );
    }
  }
} catch (error) {
  console.error(`Template update failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (temporary) rmSync(temporary, { recursive: true, force: true });
}
