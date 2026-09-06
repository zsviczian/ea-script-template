# ea-script-template

Professional workspace template for building and maintaining multiple ExcalidrawAutomate scripts in one repository.

## Recommended: Fork and Keep in Sync

For a long-lived collection of ExcalidrawAutomate scripts, we recommend
forking this repository. Add and maintain your scripts in the fork, and
regularly update it from `ea-script-template` so that you receive API, tooling,
and documentation updates. A fork preserves the GitHub fork relationship and
shared history, making the upstream relationship clear.

Keep the shared agent and authoring files aligned with the master repository:

- `AGENTS.md` is the main guide for agents working in the repository.
- `CLAUDE.md` points to `AGENTS.md` for tools that discover it.
- Put rules that are specific to your fork in `FORK_RULES.md` rather than
  modifying `AGENTS.md`, `AUTHORING_GUIDE.md`, or `CLAUDE.md`.

This repository is not the publishing target for scripts. Do not open pull
requests to `ea-script-template` to publish a script. Publish scripts
separately in the `obsidian-excalidraw-plugin` repository as described in
[`CONTRIBUTING.md`](./CONTRIBUTING.md).

### Alternative: Use this repository as a GitHub template

Use GitHub's **Use this template** action when you specifically want an
independent repository, cannot create a fork in your organization, or prefer
not to have a GitHub fork relationship. A template-created repository is not
automatically connected to this repository, but you can still receive future
updates by adding this repository as an `upstream` remote:

```bash
git remote add upstream https://github.com/zsviczian/ea-script-template.git
git fetch upstream
git merge upstream/main
```

Use the template repository's default branch if it is not `main`. If the
template-created repository has unrelated Git history, the first merge may
need:

```bash
git merge upstream/main --allow-unrelated-histories
```

Resolve any conflicts once, then continue syncing with `git fetch upstream`
and `git merge upstream/main`. Whether you fork this repository or create a
repository from its template, keep fork-specific rules in `FORK_RULES.md` and
keep shared guidance aligned with this repository. The template workflow works,
but requires this manual upstream setup.

## Quick start

```bash
git clone https://github.com/your-account/your-ea-scripts.git
cd your-ea-scripts
npm install
npm run build
```

Build output lands in a shared folder with one subfolder per script:

```text
build/{script-slug}/{script-slug}.md
build/{script-slug}/{script-slug}.svg
```

Script extension semantics in Obsidian Excalidraw (since plugin 2.27.0):

- both `.js` and `.md` script files are supported
- if both extensions exist for the same script name, `.md` takes precedence
- this template emits `.md` so scripts remain easy to view and edit in Obsidian's markdown editor

Generated scripts start with the script's local `README.md` and a UTC build timestamp, followed by editable top-level `UPPER_SNAKE_CASE` configuration constants and then the bundled script. If a script has no `README.md`, the documentation section is left empty.

## Recommended workspace layout

```text
ea-script-template/
├── src/
│   ├── scripts/
│   │   ├── minimal-starter/
│   │   │   ├── __tests__/run.test.ts
│   │   │   ├── lang/{en,de,es,fr,ru,zh-cn}.ts
│   │   │   ├── lang/index.ts
│   │   │   ├── main.ts
│   │   │   ├── run.ts
│   │   │   └── preview.svg
│   │   ├── color-palette-picker/
│   │   │   ├── __tests__/run.test.ts
│   │   │   ├── lang/
│   │   │   ├── main.ts
│   │   │   ├── run.ts
│   │   │   └── preview.svg
│   │   └── script-n/
│   │       ├── main.ts
│   │       └── preview.svg
│   ├── sharedUtils/
│   │   ├── i18n.ts
│   │   └── notice.ts
│   └── types/
│       └── ea.d.ts
├── build/                  # generated, one folder per script slug
├── release/                # packaged output copied from build/
├── scripts/
│   ├── new-script.ts
│   ├── package.mjs
│   └── sync-refs.mjs
├── AGENTS.md
├── FORK_RULES.md
├── CLAUDE.md
└── .ai/
	└── excalidraw-automate/
```

## Commands

| Command                                    | Description                                                                                                                                                                                        |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run build`                            | Discovers `src/scripts/*/main.ts` and emits `build/{slug}/{slug}.md` plus `build/{slug}/{slug}.svg`                                                                                                |
| `npm run package`                          | Copies all built script artefacts into `release/{slug}/`                                                                                                                                           |
| `npm run new-script -- --name "My Script"` | Creates a complete script workspace with bootstrap, runner, language catalogs, test, README, and preview                                                                                           |
| `npm test`                                 | Runs every co-located `src/**/__tests__/**/*.test.ts` suite once with Vitest                                                                                                                       |
| `npm run test:watch`                       | Re-runs affected Vitest suites while developing                                                                                                                                                    |
| `npm run check`                            | Typecheck + lint + all tests                                                                                                                                                                       |
| `npm run sync-refs`                        | Copies the full generated skill snapshot from sibling `obsidian-excalidraw-plugin/docs/AITrainingData/excalidraw-automate/` into `.ai/excalidraw-automate/` and renames reference scripts to `.js` |

## Testing convention

Tests are co-located with the code they own:

- script tests: `src/scripts/{slug}/__tests__/*.test.ts`
- shared utility tests: `src/sharedUtils/__tests__/*.test.ts`

This keeps each script portable as the workspace grows and avoids maintaining a
second, mirrored directory tree. Vitest discovers all suites through one root
configuration. Keep `main.ts` as the executable bootstrap and put behavior in
import-safe modules such as `run.ts`; importing `main.ts` in a test would execute
the script against missing Obsidian globals.

Run a focused suite while iterating with
`npx vitest run src/scripts/{slug}/__tests__`, then run `npm run check` before
committing.

## Localization convention

Every script owns its strings under `src/scripts/{slug}/lang/`. `en.ts` is the
typed source of truth; `de.ts`, `es.ts`, `fr.ts`, `ru.ts`, and `zh-cn.ts` contain
language-specific catalogs. `lang/index.ts` registers them with the shared
translator. Lookup tries the exact locale, its base language, then English, so a
partial reviewed catalog is safer than copying unreviewed English text.

Use named placeholders (`{count}`) for dynamic values and obtain the runtime
locale with `ea.obsidian.moment.locale()`. UI strings belong in the catalog, not
in script logic.

## Excalidraw Automate API conventions

- Use `verifyMinimumPluginVersion()` for plugin requirements and
  `verifyMinAppVersion()` only for Obsidian application requirements.
- Use `ea.setView()` for automatic view selection, `ea.setView(view)` for an
  explicit binding, and `ea.setView(null)` to represent an unbound sidepanel.
- Branch on `utils.executionSource` when automatic executions should only
  register lifecycle behavior while manual invocation performs the action.
  The trigger values are `manual`, `plugin-startup`, `view-autostart`,
  `sidepanel-restore`, `sidepanel-reload`, and `drawing-onload`.
- Use `ea.registerAutostart(message)` to explain what autostart registers. The
  message appears between the permission question and permission-management hint.
- Use `ea.registerCleanup(cleanup)` for external listeners, timers, observers,
  and subscriptions. The callback runs when the EA instance that registered it
  is destroyed; the returned function unregisters it without running it.
- Element-action providers receive an icon name; custom DOM buttons should use
  `ea.obsidian.getIcon()`.
- Prefer awaited EA mutation/save operations over direct unpublished view APIs.

## Publishing model

This template supports multiple scripts in one workspace, but publication is still script-by-script.

For each script PR to `obsidian-excalidraw-plugin`:

- copy `build/{slug}/{slug}.md` into `ea-scripts/{Script Name}.md`
- copy or export preview image using `scripts-{slug}.{ext}` naming
- update `ea-scripts/index-new.md` manually
- update `ea-scripts/directory-info.json` including `mtime` for updates

Do not open this PR against `ea-script-template`; the script publication PR
belongs in the separate plugin repository. See
[`CONTRIBUTING.md`](./CONTRIBUTING.md) for full details.

## Agent auto-discovery

This repository includes agent guidance surfaces:

- [AGENTS.md](./AGENTS.md) for the canonical agent behavior, architecture, and workflow guidance
- [FORK_RULES.md](./FORK_RULES.md) for rules specific to your fork
- [CLAUDE.md](./CLAUDE.md) as a compatibility pointer to `AGENTS.md`
- [.ai/excalidraw-automate/SKILL.md](./.ai/excalidraw-automate/SKILL.md) plus local references and script examples synchronized from plugin outputs

## Development dependencies

The template includes dev dependencies for:

- Obsidian typings/runtime interfaces via `obsidian`
- Excalidraw type surface via `@zsviczian/excalidraw`
- Direct plugin repository access via `obsidian-excalidraw-plugin` Git dependency for reference workflows

These are for authoring and type/reference workflows, not runtime script execution inside Obsidian.

## License

MIT. See [LICENSE](./LICENSE).
