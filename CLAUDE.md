# CLAUDE.md

## Project structure

- src/scripts/{slug}/main.ts: script entrypoint
- src/scripts/{slug}/preview.svg: preview asset source
- src/sharedUtils/: shared utilities used across scripts
- src/types/ea.d.ts: ambient script-engine globals and API stubs

## Build behavior

- npm run build discovers all src/scripts/*/main.ts entrypoints
- each script is bundled to build/{slug}/{slug}.js
- each script emits build/{slug}/{slug}.svg (copied from preview.svg or generated placeholder)

## Release behavior

- npm run package copies build outputs into release/{slug}/
- release output is a transport artifact; do not edit by hand

## Script authoring

- keep main.ts focused on orchestration
- keep reusable functions in src/sharedUtils
- prefer typed helpers and avoid runtime dependencies not available in Obsidian

## References

- canonical skill: .ai/excalidraw-automate/SKILL.md
- canonical upstream docs for plugin workflows live in obsidian-excalidraw-plugin
