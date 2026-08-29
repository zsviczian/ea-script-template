# Contributing Guide

Thank you for wanting to contribute an EA script to the [obsidian-excalidraw-plugin](https://github.com/zsviczian/obsidian-excalidraw-plugin) community!

---

## Publishing a Script to obsidian-excalidraw-plugin

### Step 1 — Build and test your script locally

```bash
npm run check   # typecheck + lint
npm run build   # produces dist/main.js
```

Load `dist/main.js` in your Obsidian vault via **Excalidraw → Script Engine** and verify it works end-to-end.

### Step 2 — Add the script file

Copy your final script into the plugin repo:

```
ea-scripts/{Your Script Name}.md
```

The `.md` file wraps the script in a fenced code block:

````md
## Your Script Name

```javascript
// paste the contents of dist/main.js here
```
````

### Step 3 — Add a preview image

Add a preview image to:

```
images/scripts-{slug}.{ext}
```

- `slug` — lowercase, hyphenated, only `a-z 0-9 -`
- Allowed extensions: `png`, `jpg`, `jpeg`, `gif`, `webp`, `svg`
- Recommended size: 800 × 450 px

Example: `images/scripts-color-palette-picker.png`

### Step 4 — Update the script index

Open `ea-scripts/index-new.md` and add an entry for your script in the appropriate alphabetical position:

```md
### Your Script Name

Short one-paragraph description.

![preview](images/scripts-your-script-name.png)
```

### Step 5 — Regenerate documentation

In the **plugin repo**, run:

```bash
npm run doc
```

This regenerates the machine-readable index. Do **not** edit the generated files by hand.

### Step 6 — Open a focused PR

- Title: `feat(scripts): add Your Script Name`
- Include only the files changed in steps 2–5
- Keep the PR focused on a single script addition
- Respond promptly to review comments

---

## Code Quality Checklist

Before opening a PR, confirm:

- [ ] `npm run check` passes with no errors
- [ ] Every function has a JSDoc comment
- [ ] No UI strings are hard-coded inside logic (use `src/constants/strings.ts`)
- [ ] Script tested in Obsidian against the latest Excalidraw plugin version
- [ ] Preview image follows the naming policy

---

## Development Workflow

```bash
npm run new-script -- --name "My Feature"  # scaffold a feature module
npm run build                               # compile
npm run check                               # typecheck + lint
npm run package                             # copies dist → release/
```
