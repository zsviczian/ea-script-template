# ea-script-template

A professional starter project for building high-quality [ExcalidrawAutomate](https://zsviczian.github.io/obsidian-excalidraw-plugin/) scripts for [Obsidian Excalidraw](https://github.com/zsviczian/obsidian-excalidraw-plugin).

---

## Quick Start (3 steps)

```bash
# 1. Clone and install dependencies
git clone https://github.com/zsviczian/ea-script-template.git my-ea-script
cd my-ea-script
npm install

# 2. Build the distributable script
npm run build

# 3. Copy dist/main.js into your Obsidian vault's script folder and run it
```

---

## Project Structure

```
ea-script-template/
├── src/
│   ├── main.ts               ← orchestrator only (keep thin)
│   ├── features/             ← one file per feature
│   ├── ui/                   ← modal and sidepanel helpers
│   ├── core/                 ← shared utilities (notices, element helpers, settings)
│   ├── constants/            ← all strings and numeric config
│   └── types/                ← script-local TypeScript types + ea.d.ts stubs
├── examples/
│   ├── minimal-starter/      ← smallest possible EA script
│   └── color-palette-picker/ ← realistic multi-step example
├── scripts/
│   ├── new-script.ts         ← scaffolder: npm run new-script
│   ├── package.mjs           ← copies dist → release/
│   └── sync-refs.mjs         ← future: sync API types from plugin repo
├── dist/                     ← generated build output (git-ignored)
├── release/                  ← packaged artefact ready to ship
├── esbuild.config.mjs
├── eslint.config.mjs
├── tsconfig.json
└── .prettierrc
```

---

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Compiles `src/main.ts` → `dist/main.js` (IIFE bundle) |
| `npm run lint` | Runs ESLint across all TypeScript source |
| `npm run lint:fix` | Auto-fixes lint issues |
| `npm run format` | Formats code with Prettier |
| `npm run typecheck` | TypeScript type-check without emitting files |
| `npm run check` | Runs typecheck **and** lint (use before committing) |
| `npm run package` | Builds and copies the artefact to `release/` |
| `npm run new-script` | Generates a new feature module from a template |
| `npm run sync-refs` | (Placeholder) Syncs API type stubs from the plugin repo |

### Scaffold a new feature

```bash
npm run new-script -- --name "My Awesome Feature"
# Creates: src/features/my-awesome-feature.ts
```

---

## Writing Your Script

1. **Keep `src/main.ts` thin.** It should only import feature modules, initialise EA, and delegate work. Aim for < 40 lines.

2. **One feature per file** in `src/features/`. Export a single `run*` async function that accepts `(ea, api)`.

3. **No magic strings.** Put every UI-visible string in `src/constants/strings.ts`.

4. **Document every function** with a JSDoc comment (enforced by ESLint).

5. **Use the workbench.** Call `ea.reset()`, stage elements with `ea.add*()`, then commit with `ea.addElementsToView()`. Never mutate the live scene array directly without going through the API.

See [AUTHORING_GUIDE.md](./AUTHORING_GUIDE.md) for deeper guidance.

---

## Publishing to obsidian-excalidraw-plugin

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full workflow.

---

## Image Naming Policy

Preview images must follow this naming convention:

```
scripts-{slug}.{ext}
```

- `slug` — lowercase, hyphenated, only `a-z`, `0-9`, and `-`
- `ext` — one of: `png`, `jpg`, `jpeg`, `gif`, `webp`, `svg`

**Examples:** `scripts-color-palette-picker.png`, `scripts-my-script-v2.svg`

---

## License

MIT — see [LICENSE](./LICENSE).
