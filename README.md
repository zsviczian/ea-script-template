# ExcalidrawAutomate script workspace

Create and maintain multiple scripts for the Obsidian Excalidraw Script Engine.

## Start your own repository

Select **Use this template → Create a new repository** on GitHub, then clone **your
new repository**. This is the recommended route for your own script collection.
Fork the template when you want to contribute improvements to the template itself.
Both support `npm run update-template`; shared Git history is not required.

Use Node 22.13 or newer and npm:

```sh
git clone https://github.com/YOUR-NAME/YOUR-SCRIPTS.git
cd YOUR-SCRIPTS
npm install
npm run new-script -- --name "My Script"
npm run check
npm run build
```

Each `src/scripts/{slug}/main.ts` builds to `build/{slug}/{slug}.md`, accompanied by
its preview SVG. Copy the script into the vault folder configured under
**Excalidraw settings → Script Engine** and run it from an Excalidraw drawing.
Build output is executable JavaScript stored as Markdown, not an Obsidian plugin.
No runtime npm imports are available in the Script Engine.

## Keep up to date

```sh
npm run update-template -- --check
npm run update-template
npm install
npm run check
npm run build
```

Updates bring shared tooling, EA types, and agent references from the template's
`master`, preserving your scripts, helpers, repository identity, and custom guidance.
Conflicting customizations stop the update for review.

Read **[the update guide](.template/README.md)** for file ownership, conflict
resolution, adopting the updater in an older repository, and the maintainer's
plugin → template → personal repository workflow.

## Layout

- `src/scripts/{slug}/`: your script entrypoint, modules, preview, and optional README,
  tests, and translations. The two included scripts are removable starter examples.
- `src/sharedUtils/`: your reusable script helpers.
- `src/types/ea.d.ts`: injected globals backed by generated API declarations.
- `examples/`: additional authoring examples; not built automatically.
- `.template/`: upstream guidance, generated types, and update metadata.
- `.ai/excalidraw-automate/`: local API documentation and agent reference examples.
- `scripts/`: development tools. `repo:update` imports files returned by a chat;
  **`update-template`** receives upstream template improvements.
- `build/`, `release/`: generated output, never source files.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run new-script -- --name "My Script"` | Scaffold a script and preview |
| `npm run check` | Typecheck and lint |
| `npm run build` | Bundle every script independently |
| `npm run package` | Build and copy artifacts into release/ |
| `npm run update-template -- --check` | Preview an upstream template update |
| `npm run update-template` | Apply a reviewed update |
| `npm run test:template` | Verify updater behavior and API typing |
| `npm run repo:export` | Export repository.zip for a chat session |
| `npm run repo:update` | Import returned files from ~/Downloads/update/ |
| `npm run sync-refs` | Maintainers only: refresh from a sibling plugin checkout |

For chat-based edits, upload `repository.zip`, request only changed files with
repository-relative paths, extract them into `~/Downloads/update/`, then run
`repo:update`. This overwrites returned paths; review the diff and run check/build.
`REPO_UPDATE_DIR` overrides the import directory.

Read [AUTHORING_GUIDE.md](AUTHORING_GUIDE.md) before authoring and
[CONTRIBUTING.md](CONTRIBUTING.md) before submitting scripts to the plugin library.
Customize this README for your collection. Put repository-specific agent rules in
[LOCAL_GUIDE.md](LOCAL_GUIDE.md); upstream rules live in [.template/AGENTS.md](.template/AGENTS.md).

MIT. See [LICENSE](LICENSE).
