# CLAUDE.md

## Project structure

- src/scripts/{slug}/main.ts: executable script bootstrap; do not import in tests
- src/scripts/{slug}/run.ts: import-safe orchestration suitable for tests
- src/scripts/{slug}/**tests**/: co-located Vitest suites
- src/scripts/{slug}/lang/: per-language catalogs and typed translator registry
- src/scripts/{slug}/preview.svg: preview asset source
- src/sharedUtils/: shared utilities used across scripts
- src/types/ea.d.ts: ambient script-engine globals and API stubs

## Build behavior

- npm run build discovers all src/scripts/*/main.ts entrypoints
- each script is bundled to build/{slug}/{slug}.md
- each script emits build/{slug}/{slug}.svg (copied from preview.svg or generated placeholder)

## Release behavior

- npm run package copies build outputs into release/{slug}/
- release output is a transport artifact; do not edit by hand

## Script authoring

- keep main.ts focused on orchestration
- keep reusable functions in src/sharedUtils
- prefer typed helpers and avoid runtime dependencies not available in Obsidian
- keep English strings in each script's lang/en.ts and use the shared i18n helper

## Test behavior

- npm test runs every `src/**/__tests__/**/*.test.ts` suite
- npm run test:watch provides the development watch loop
- npm run check is the universal pre-commit gate: types + lint + tests
- tests live beside their owning script or shared utility, not in a mirrored root tree

## References

- canonical skill: .ai/excalidraw-automate/SKILL.md
- canonical upstream docs for plugin workflows live in obsidian-excalidraw-plugin
