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
- Use `verifyMinimumPluginVersion()` for the Excalidraw plugin and
  `verifyMinAppVersion()` only for the Obsidian application version.
- `ea.setView()` and `ea.setView("auto")` select a sensible default;
  `ea.setView(view)` binds explicitly; `ea.setView(null)` deliberately clears
  `ea.targetView`. Clear the target when a multi-view sidepanel becomes unbound.
- Use `utils.executionSource` to distinguish `manual`, `plugin-startup`,
  `view-autostart`, `sidepanel-restore`, `sidepanel-reload`, and
  `drawing-onload` executions. View autostart should register view-local
  behavior and return without launching interactive work.
- Pass a concise explanation to `ea.registerAutostart(message)` when autostart
  only registers tools or providers; state explicitly that the main action will
  not start when a drawing opens.
- Use `ea.registerCleanup()` for listeners, timers, observers, and subscriptions
  owned by a script EA. Cleanup runs when that specific EA is destroyed, so its
  lifetime follows the trigger that created it.
- `registerElementActionProvider()` expects an Obsidian/Lucide icon name, not
  SVG markup. For buttons you render yourself, resolve icons with
  `ea.obsidian.getIcon()` and recreate the markup in the owning document.
- Pass the known typed element to element-specific Excalidraw API calls such as
  `startLineEditor()`; do not re-read selection state when the element is known.
- Await `ea.addElementsToView(..., true)` when the mutation must be saved. Avoid
  unpublished `ExcalidrawView` save methods unless no public EA operation fits.
- Treat EA as a stateful workbench: `ea.clear()`, read scene elements, use
  `ea.copyViewElementsToEAforEditing()` to preserve their IDs, edit the
  workbench copies, then either commit persistent changes once with
  `await ea.addElementsToView()` or use them for a temporary EA operation and
  discard them with `ea.clear()` without committing.
- `ea.cloneElement()` and `ea.cloneElements()` deliberately create new IDs and
  are only for genuine duplicates. Never use them to edit an existing element,
  normalize read-only data, or prepare a temporary preview override.
- Do not overlap independent async operations through one EA workbench. Await
  the operation, then clear the workbench before starting another transaction.
- Treat `createViewSVG({ elementsOverride })` as a complete replacement for the
  exported scene elements, never as an additive list or a patch by ID. Include
  every element that should appear in the SVG; for temporary scene changes,
  copying the complete export set into EA is usually the simplest safe path.

## Auto-discovery files

- AGENTS.md: this file
- CLAUDE.md: implementation notes and build conventions
- .ai/excalidraw-automate/SKILL.md: link-first skill bootstrap to canonical references
