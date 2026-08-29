# ExcalidrawAutomate Authoring Guide

This guide covers best practices for writing high-quality EA scripts using this template.

## Workspace model

This repository is designed to host multiple scripts in one workspace.

- Put each script in `src/scripts/{slug}/`.
- Keep script entrypoint in `src/scripts/{slug}/main.ts`.
- Store per-script preview in `src/scripts/{slug}/preview.svg`.
- Keep reusable helpers in `src/sharedUtils/`.
- Build outputs are emitted to `build/{slug}/{slug}.js` and `build/{slug}/{slug}.svg`.

Use `npm run new-script -- --name "My Script"` to scaffold a new script folder.

---

## 1. The Immutable Scene Workflow (EA Workbench)

ExcalidrawAutomate uses a **workbench** pattern: you stage new elements before writing them to the live canvas.

```ts
// 1. Reset the workbench (clear any previously staged elements)
ea.reset();

// 2. Configure styles BEFORE calling add*
ea.style.strokeColor = "#e03131";
ea.style.backgroundColor = "#ffa8a8";
ea.style.strokeWidth = 2;

// 3. Stage one or more elements
const id = ea.addRect(100, 100, 200, 80);

// 4. Commit staged elements to the live scene
await ea.addElementsToView(false, true);
```

**Never** push half-baked elements to the scene and then mutate them afterwards — always build the complete set of staged elements before calling `addElementsToView`.

---

## 2. ea vs Excalidraw API vs window.ExcalidrawLib

| Object | When to use |
|---|---|
| `ea` | Adding new elements, showing prompts, reading/writing script settings, accessing the workbench |
| `ea.getExcalidrawAPI()` | Reading or bulk-updating the **existing** scene (`getSceneElements`, `updateScene`) |
| `window.ExcalidrawLib` | Low-level geometry helpers (`intersectElementWithLine`, `getCommonBounds`, etc.) — only when `ea` and the React API do not expose what you need |

As a rule of thumb: reach for `ea` first, then the API, and only touch `ExcalidrawLib` as a last resort.

---

## 3. Modal and Sidepanel Patterns

### Simple text input

```ts
import { showNotice } from "../../sharedUtils/notice";

const label = await utils.inputPrompt("Enter a label", "my label", "");
if (!label) {
  showNotice("Cancelled");
  return;
}
```

### Choice list

```ts
const options = ["Red", "Green", "Blue"];
const choice = await utils.suggester(options, options);

if (!choice) return;
```

### Custom React sidepanel

For complex UI (multi-field forms, previews) you can render a React component into the Excalidraw sidepanel. See the official plugin docs for the `renderSidepanel` API — it is beyond the scope of this template.

---

## 4. Script Settings and customData Best Practices

**Script settings** are persisted in Obsidian's plugin data across sessions:

```ts
const settings = ea.getScriptSettings() ?? {};
if (!settings.strokeWidth) settings.strokeWidth = 2;
if (!settings.colour) settings.colour = "#000000";

// ... user interaction ...

settings.colour = newColour;
await ea.setScriptSettings(settings);
```

**customData** is stored on individual Excalidraw elements and travels with the `.excalidraw` file. Use it to tag elements that your script created or needs to recognise later:

```ts
// Writing
(el as any).customData = { myScript: { version: 1, role: "header" } };

// Reading
const role = (el.customData as any)?.myScript?.role;
```

---

## 5. Image Export and File Handling Caveats

- **`ea.createPNG` / `ea.createSVG`** render the current workbench elements, not the live canvas. Make sure you have the right elements staged.
- Always `await` these methods — they are asynchronous and will silently return nothing if called without `await`.
- File paths must be vault-relative when using the Obsidian `app.vault` API. Do not use absolute filesystem paths.
- When saving a new file, check for existing files first to avoid silent overwrites.

---

## 6. Script Overview Block

Every `main.ts` (and feature module) must open with a `@file` / `@overview` JSDoc block:

```ts
/**
 * @file my-feature.ts
 * @overview
 *   One or two sentence description of what this module does.
 *
 * @author  Your Name
 * @version 1.0.0
 */
```

This is enforced via the `jsdoc/require-file-overview` rule (can be added to ESLint config).

---

## 7. Function Documentation Comments

Every exported (and complex internal) function must have a JSDoc block:

```ts
/**
 * Short one-line description.
 *
 * @param ea     ExcalidrawAutomate instance.
 * @param label  Text to display inside the new box.
 * @returns      The element ID of the newly created text box.
 */
export async function createLabelledBox(ea: ExcalidrawAutomate, label: string): Promise<string> {
  // ...
}
```
