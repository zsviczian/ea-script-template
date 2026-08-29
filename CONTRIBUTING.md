# Contributing Guide

Thank you for wanting to contribute an EA script to the [obsidian-excalidraw-plugin](https://github.com/zsviczian/obsidian-excalidraw-plugin) community!

---

## Publishing a script to obsidian-excalidraw-plugin

### Step 1 - Build and test your script locally

```bash
npm run check   # typecheck + lint
npm run build   # produces build/{slug}/{slug}.js and build/{slug}/{slug}.svg
```

Load the target `build/{slug}/{slug}.js` in your Obsidian vault via Excalidraw -> Script Engine and verify it works end-to-end.

### Step 2 - Add the script file

Copy your final script into the plugin repo:

```
ea-scripts/{Your Script Name}.md
```

The `.md` file wraps the script in a fenced code block:

````md
## Your Script Name

```javascript
// paste the contents of build/{slug}/{slug}.js here
```
````

### Step 3 - Add a preview image

Add a preview image to:

```
images/scripts-{slug}.{ext}
```

- `slug` — lowercase, hyphenated, only `a-z 0-9 -`
- Allowed extensions: `png`, `jpg`, `jpeg`, `gif`, `webp`, `svg`
- Recommended size: 800 × 450 px

Example: `images/scripts-color-palette-picker.png`

### Step 4 - Update the script index

Open `ea-scripts/index-new.md` and add an entry for your script in the appropriate alphabetical position:

```md
### Your Script Name

Short one-paragraph description.

![preview](images/scripts-your-script-name.png)
```

### Step 5 - Update directory info in the same PR

Update `ea-scripts/directory-info.json` in the same PR:

- for new scripts: add the script metadata entry
- for updates: refresh the existing script `mtime` value

### Step 6 - Open a focused PR

- Title: `feat(scripts): add Your Script Name`
- Include only the files changed in steps 2-5
- Keep the PR focused on a single script addition
- Respond promptly to review comments

---

## Code Quality Checklist

Before opening a PR, confirm:

- [ ] `npm run check` passes with no errors
- [ ] Every function has a JSDoc comment
- [ ] No UI strings are hard-coded inside script logic
- [ ] Script tested in Obsidian against the latest Excalidraw plugin version
- [ ] Preview image follows the naming policy

---

## Development Workflow

```bash
npm run new-script -- --name "My Script"    # scaffold src/scripts/{slug}/
npm run build                               # compile
npm run check                               # typecheck + lint
npm run package                             # copies build/ -> release/
```
