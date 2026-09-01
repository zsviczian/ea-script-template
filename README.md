# ea-script-template

Professional workspace template for building and maintaining multiple ExcalidrawAutomate scripts in one repository.

## Template or Fork?

Use this repository as a template when:

- you want one workspace containing many scripts
- you want shared lint/build/tooling and shared utilities
- you are building script PRs for obsidian-excalidraw-plugin

Fork this repository when:

- you want to publish your own long-lived script workspace publicly
- you need to customize lint/build/release policy while retaining this baseline

Create one repo per script only when strict isolation is required.

## Quick start

```bash
git clone https://github.com/zsviczian/ea-script-template.git my-ea-scripts
cd my-ea-scripts
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

For each script PR to obsidian-excalidraw-plugin:

- copy `build/{slug}/{slug}.md` into `ea-scripts/{Script Name}.md`
- copy or export preview image using `scripts-{slug}.{ext}` naming
- update `ea-scripts/index-new.md` manually
- update `ea-scripts/directory-info.json` including `mtime` for updates

See [CONTRIBUTING.md](./CONTRIBUTING.md) for full details.

## Agent auto-discovery

This repository includes agent guidance surfaces:

- [AGENTS.md](./AGENTS.md) for cross-agent behavior and workflow constraints
- [CLAUDE.md](./CLAUDE.md) for implementation architecture notes
- [.ai/excalidraw-automate/SKILL.md](./.ai/excalidraw-automate/SKILL.md) plus local references and script examples synchronized from plugin outputs

## Development dependencies

The template includes dev dependencies for:

- Obsidian typings/runtime interfaces via `obsidian`
- Excalidraw type surface via `@zsviczian/excalidraw`
- Direct plugin repository access via `obsidian-excalidraw-plugin` Git dependency for reference workflows

These are for authoring and type/reference workflows, not runtime script execution inside Obsidian.

## License

MIT. See [LICENSE](./LICENSE).
