# Agent guide for ea-script-template

## Purpose

This repository is a multi-script authoring workspace for ExcalidrawAutomate scripts.
Treat it as a script portfolio repo, not a single-script starter.

## Operating model

- Each script lives under src/scripts/{slug}/.
- Each script has a thin main.ts bootstrap, import-safe behavior modules, a README,
  a preview, co-located tests, and a script-local lang folder.
- Build output is shared under build/{slug}/{slug}.md and build/{slug}/{slug}.svg.
- Shared helpers belong under src/sharedUtils/.

## Tests

- Use Vitest.
- Put script-owned tests in `src/scripts/{slug}/__tests__/*.test.ts` and shared
  utility tests in `src/sharedUtils/__tests__/*.test.ts`.
- Never import an executable `main.ts` from a test. Move behavior into `run.ts`
  or another side-effect-free module and test that module.
- Add or update focused tests with every behavior change. Regressions should get
  a failing test before the fix when practical.
- Run the focused suite while iterating, then run `npm run check`; `check` includes
  typechecking, linting, and every test in the workspace.

## Localization

- Keep each script's strings in its own `lang/` folder; never create one catalog
  shared by unrelated scripts.
- Treat `lang/en.ts` as the typed source of truth. Maintain `de.ts`, `es.ts`,
  `fr.ts`, `ru.ts`, and `zh-cn.ts`; incomplete translations may fall back to English.
- Use the shared `createTranslator` helper and named placeholders for dynamic values.
- Do not hard-code user-visible strings in orchestration or domain logic.

## Publishing expectations

When preparing a script for obsidian-excalidraw-plugin:

- script code goes to ea-scripts/{Script Name}.md in the plugin repo
- preview image follows scripts-{slug}.{ext}
- update ea-scripts/index-new.md manually
- update ea-scripts/directory-info.json and refresh mtime on updates

## API guidance

- Prefer ea methods first.
- Use ea.getExcalidrawAPI() for scene-level reads/writes.
- Use window.ExcalidrawLib only when needed for low-level helpers.

## Auto-discovery files

- AGENTS.md: this file
- CLAUDE.md: implementation notes and build conventions
- .ai/excalidraw-automate/SKILL.md: link-first skill bootstrap to canonical references
