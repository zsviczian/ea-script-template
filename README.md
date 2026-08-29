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
│   │   │   ├── main.ts
│   │   │   └── preview.svg
│   │   ├── color-palette-picker/
│   │   │   ├── main.ts
│   │   │   └── preview.svg
│   │   └── script-n/
│   │       ├── main.ts
│   │       └── preview.svg
│   ├── sharedUtils/
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
| `npm run new-script -- --name "My Script"` | Creates `src/scripts/{slug}/main.ts` and `preview.svg`                                                                                                                                             |
| `npm run check`                            | Typecheck + lint                                                                                                                                                                                   |
| `npm run sync-refs`                        | Copies the full generated skill snapshot from sibling `obsidian-excalidraw-plugin/docs/AITrainingData/excalidraw-automate/` into `.ai/excalidraw-automate/` and renames reference scripts to `.js` |

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
