# Minimal starter

A minimal ExcalidrawAutomate script showing the standard TypeScript entrypoint,
minimum-version check, active-view API lookup, and shared notice helper.

## Localization

The `lang/` folder contains a typed English source catalog and German, Spanish,
French, Russian, and Simplified Chinese catalogs. `main.ts` reads Obsidian's
locale and passes the translator to the import-safe runner. Add UI copy to
`lang/en.ts` first so TypeScript requires the other complete sample catalogs to
stay in sync.

## Testing

`__tests__/run.test.ts` demonstrates testing the runner without importing the
executable `main.ts`. Run it with
`npx vitest run src/scripts/minimal-starter/__tests__`, or run all scripts with
`npm test`.
