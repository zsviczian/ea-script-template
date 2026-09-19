# Writing ExcalidrawAutomate scripts

Keep one script per `src/scripts/{slug}/` with a thin `main.ts` entrypoint and a
`preview.svg`. Shared helpers belong in `src/sharedUtils/`; script-specific modules,
README, tests, and translations belong beside that script. `examples/` is reference
source, not an additional build input.

## Runtime and types

The Script Engine injects `ea` and `utils`. Use `ea.obsidian` for runtime Obsidian
classes and functions. For example, `new ea.obsidian.Notice("Done")`. Use
`import type { TFile } from "obsidian"` for types; do not bundle a runtime import
from Obsidian or the plugin. The build rejects those unavailable runtime modules.

`src/types/ea.d.ts` derives the EA API from `.template/types/`, generated from the
plugin declarations. Do not edit either path: template updates replace them. Put
repository-specific ambient declarations and type augmentations in
`src/types/local.d.ts`, which remains local to your workspace. `utils` also supports
object-form inputPrompt, generic suggester, scriptFile, and executionSource. Both
prompts can return undefined on cancellation; an empty string can be valid input.

```ts
const label = await utils.inputPrompt({ header: "Enter a label", value: "" });
if (label === undefined) return;
const choice = await utils.suggester(["Red", "Blue"], ["#e03131", "#1971c2"]);
if (choice === undefined) return;
```

Check plugin requirements with `ea.verifyMinimumPluginVersion("2.27.0")` and
Obsidian requirements with `ea.obsidian.requireApiVersion("1.8.7")`. Generated
types describe the recorded source revision, not necessarily the user's runtime.
The plugin's declarations currently compile without strict null checking, so still
check view/API availability and documented cancellation/failure cases at runtime.

For undocumented Obsidian behavior, consult
[obsidian-typings](https://github.com/obsidian-typings/obsidian-typings), verify the
actual runtime, and keep local augmentations narrow. It is a reference for internal
APIs, not a required runtime dependency for scripts.

## Edit existing elements through the workbench

```ts
ea.clear();
const selected = ea.getViewSelectedElements();
ea.copyViewElementsToEAforEditing(selected);
for (const original of selected) {
  const editable = ea.getElement(original.id);
  if (editable) editable.strokeColor = "#e03131";
}
await ea.addElementsToView(false, true);
ea.clear();
```

Scene elements are immutable. Preserve their IDs by copying them into EA for
editing. `cloneElement`/`cloneElements` create new IDs and are for duplicates.
Await one transaction before starting another. `clear()` empties the workbench;
`reset()` also resets styles. Set styles before creating new elements.

Prefer EA methods first, then `ea.getExcalidrawAPI()` for component-level operations,
then low-level ExcalidrawLib helpers when needed. Use `ea.addAppendUpdateCustomData`
to merge metadata safely. `getScriptSettings()` / `setScriptSettings()` persist
script settings; follow existing script examples for settings metadata and values.

## Long-lived scripts and UI

Use `ea.createSidepanelTab()` and its returned tab's lifecycle hooks for persistent
UI. There is no `renderSidepanel` API. A restored tab can begin without a target
view: bind with `ea.setView(view)` on focus and clear with `ea.setView(null)` when
unbound. Use the view's owning document/window for DOM, events, and timers.

Use `utils.executionSource` to distinguish manual, plugin-startup, view-autostart,
sidepanel-restore, sidepanel-reload, and drawing-onload invocations. Register external
listeners/timers/observers with `ea.registerCleanup()`; cleanup follows that EA's
lifetime. Give `registerAutostart(message)` a clear explanation of what is registered.

Use Obsidian modal UI rather than browser alert/confirm/prompt. Prefer Obsidian DOM
helpers such as createDiv/createEl, accessible controls, and named icon identifiers
for element-action providers. Read the local skill's sidepanel and modal examples.

## Export and files

Use `createViewSVG` / `createViewPNG` for the current view, and `createSVG(null, ...)`
/ `createPNG(null, ...)` for the EA workbench. A template path exports an existing
drawing through the plugin's loader. `elementsOverride` is a complete replacement
export set, not a patch. Await export operations. Use vault-relative paths and
Obsidian's Vault API; check for existing files before overwriting them.

## Bundling and testing

The build discovers `src/scripts/*/main.ts`, bundles each independently, and writes
executable JavaScript as `.md`, plus its preview. If `.md` and `.js` share a script
name, the plugin prefers `.md`. Copy output into the configured Script Engine folder.

Only literal, self-contained top-level `UPPER_SNAKE_CASE` constants are extracted
as editable configuration. Values that depend on imports, runtime globals, or
other computed initialization must remain inside the bundle. Keep those variable
names in lowerCamelCase. Do not put runtime imports in the extracted constants.

Document entrypoints with @file and @overview and explain exported or complex
helpers with JSDoc. This is guidance, not a claim that ESLint enforces all JSDoc.
Keep strings together and follow your repository's localization conventions.

Run `npm run check` and `npm run build`; test reusable behavior without importing
an executable main.ts. Test actual scripts in Obsidian, including cancellation,
empty selection, undo/save, and view changes. UI/lifecycle scripts need a popout and
a physical mobile test; desktop emulation does not establish touch behavior.

Start API research with `.ai/excalidraw-automate/references/api-usage-index.md`, then
read the matching script and generated type declaration. Use `npm run update-template`
to receive updated types and guidance; see [.template/README.md](.template/README.md).
