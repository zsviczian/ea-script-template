# Keeping your script repository up to date

Use **Use this template → Create a new repository** for a personal script portfolio.
A template gives you an independent history. Fork when you intend to contribute to
`ea-script-template` itself or deliberately want Git's upstream merge workflow.
Both can use the updater below; it does not require shared Git history or an
`upstream` remote. GitHub's **Sync fork** is not the update mechanism for a
repository created from a template.

See [GitHub's template documentation](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template)
for the history differences.

## Routine updates

Start with a committed working tree so you can inspect and undo the update easily.
Use Node 22.13 or newer, npm, and Git.

```sh
npm run update-template:check
npm run update-template
npm install
npm run check
npm run test:template
npm run build
```

If npm does not forward command arguments correctly in your shell, the equivalent
preview command is `node scripts/update-template.mjs --check`.

The updater downloads `zsviczian/ea-script-template`'s default branch into a temporary
checkout, verifies its manifest, and updates only the managed files and individual
package settings. `--check` previews without writing. No merge, commit, push,
dependency installation, or downloaded script execution happens inside the updater.
`npm install` refreshes your own lockfile after you review the dependency changes.
Commit that lockfile, `.template/manifest.json`, and `.template/state.json` with the update.

A template update includes its last published EA declaration and agent-reference
snapshot. It does not fetch newer plugin changes that the template maintainer has
not yet published, upgrade the plugin installed in Obsidian, or rewrite your scripts
to use new APIs. Check `.template/api-source.json` for the plugin revision and version.
Choose and test each script's minimum supported plugin version separately.

## What belongs to you?

| Path | Ownership and update behavior |
| --- | --- |
| `src/scripts/` | Your scripts, previews, translations, tests, and READMEs; never updated |
| `src/sharedUtils/`, `examples/` | Starter code you may customize or delete; never restored by updates |
| `README.md`, `AGENTS.md`, `CLAUDE.md`, `LOCAL_GUIDE.md` | Your repository identity and agent entry points; never replaced |
| `FORK_RULES.md` | Optional legacy repository rules; preserved |
| `.template/AGENTS.md`, `.template/README.md` | Shared agent guidance and update documentation |
| `.template/types/`, `.template/api-source.json` | Generated EA declaration graph and provenance |
| `.ai/excalidraw-automate/` | Generated agent skill, API reference, and script examples |
| `src/types/ea.d.ts` | Managed Script Engine globals derived from generated declarations; do not edit |
| `src/types/local.d.ts` | Your optional ambient declarations and type augmentations; never managed or overwritten |
| `scripts/`, `tests/`, build/lint/TypeScript configs, `AUTHORING_GUIDE.md`, `CONTRIBUTING.md` | Only files explicitly listed in the manifest are managed; local edits are checked |
| `package.json` | Managed scripts, dev dependencies, and engines merged by key; name, description, custom commands/dependencies, and other fields preserved |
| `package-lock.json` | Yours; regenerate with npm install, never copy from the template |
| `build/`, `release/`, `node_modules/`, `.git/`, vault files | Never touched by the updater |

The checked-in manifest records SHA-256 hashes and package defaults. The last
accepted upstream versions become the next baseline. Identical files and
unchanged upstream values preserve local edits. If both you and upstream changed
a managed file or the same package key, the whole update stops before writing.
Upstream deletions remove only unchanged managed files. Unknown local files stay.

## Resolving customization conflicts

Compare your file with a separate checkout of the template. Merge the changes you
want into your local version, then acknowledge that choice:

```sh
npm run update-template -- --keep-local esbuild.config.mjs
npm run update-template -- --accept-upstream src/types/ea.d.ts
npm run update-template -- --keep-local 'package.json#scripts.check'
```

Supply all required resolutions in **one invocation**, repeating either option.
`--keep-local` preserves the current file/value and records the new upstream
baseline; a later upstream change can conflict again. `--accept-upstream` replaces
that specific file/value. There is no blanket force switch. The updater does not
insert conflict markers into runnable files. Invalid manifests, missing snapshot
files, and symlinks abort the update.

For an offline or unpublished integration test, add `--source /path/to/ea-script-template`.
The source manifest must match its current files. This option reads a local
checkout; it does not run its scripts.

## Adopting updates in a repository created before this command existed

1. Commit your current work. Clone the current template into a separate directory.
2. Copy only `scripts/update-template.mjs` and `scripts/template-manifest.mjs` from
   that checkout into your repository. Do **not** copy its manifest as a baseline:
   it would incorrectly claim your older files already match the current template.
3. Run `node scripts/update-template.mjs --source /path/to/ea-script-template --check`.
   Without a baseline, differing existing managed files/keys require explicit
   review. Use the conflict options above to adopt or merge them. In particular,
   preserve your custom `check`/test commands and build features.
4. Remove the old `obsidian-excalidraw-plugin` Git dev dependency from package.json.
   Remove `allow-git=all` from .npmrc if no other dependency needs it. Old dependencies
   unknown to the new manifest are intentionally preserved until you remove them.
5. Add a link in your existing AGENTS.md to `.template/AGENTS.md`, and move
   repository-only guidance into LOCAL_GUIDE.md (or retain FORK_RULES.md). Keep
   CLAUDE.md and other agent entry points pointing to your root AGENTS.md.
6. Apply the reviewed update, run npm install, check, test:template, and build.
   Resolve newly reported script typing errors against the real API; do not restore
   the old handwritten EA stubs. Review and commit the resulting files.

An existing workspace such as `ea-scripts` may have customized ambient types,
sidepanel behavior, build transforms, tests, and localization conventions. Those
need an intentional first migration; an updater cannot safely infer their intent.

## Template maintainer workflow

The plugin is the API source of truth. In a sibling `obsidian-excalidraw-plugin`:

```sh
npm run doc
# or npm run skill: both run npm run lib and full documentation generation
```

When a sibling `ea-script-template` exists, full generation copies the skill
snapshot, generates the reachable declaration graph from `lib/`, rewrites internal
module paths, aligns its type dependencies, records the plugin revision, and
refreshes the template manifest. No plugin runtime is copied. The old Git package
is unnecessary and no consumer needs to build the plugin.

`npm run sync-refs` in the template is a maintainer convenience for copying
already-generated docs and declarations from the sibling plugin. Run `npm run doc`
in the plugin first so they describe the same source revision.

After changing any managed template file or package default:

```sh
npm install
npm run check
npm run build
npm run template:manifest
npm run test:template
```

Review and publish both repositories' changes separately. Users receive only
committed and pushed `master` content. Keep `.template/manifest.json` synchronized;
the updater refuses mismatched file hashes. Do not run `template:manifest` in a
personal script repository: it would replace the upstream baseline with local edits.
