# Contributing Guide

Thank you for wanting to contribute an EA script to the [obsidian-excalidraw-plugin](https://github.com/zsviczian/obsidian-excalidraw-plugin) community!

---

## Publishing a script to obsidian-excalidraw-plugin

### Step 1 - Build and test your script locally

```bash
npm run check   # typecheck + lint + all Vitest suites
npm run build   # produces build/{slug}/{slug}.md and build/{slug}/{slug}.svg
```

Load the target `build/{slug}/{slug}.md` in your Obsidian vault via Excalidraw -> Script Engine and verify it works end-to-end.

Since obsidian-excalidraw-plugin 2.27.0, both `.js` and `.md` script files are supported.
If both are present for the same script name, `.md` takes precedence.
The `.md` format is recommended because it is easy to inspect and edit using Obsidian's markdown editor.

### Step 2 - Add the script file

Copy your final script into the plugin repo:

```
ea-scripts/{Your Script Name}.md
```

The build output already includes the script metadata comment and fenced code block wrapper.
Copy it as-is to preserve formatting:

```bash
cp build/{slug}/{slug}.md ../obsidian-excalidraw-plugin/ea-scripts/{Your Script Name}.md
```

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
- [ ] Behavior changes include focused co-located Vitest coverage
- [ ] Every function has a JSDoc comment
- [ ] No UI strings are hard-coded inside script logic
- [ ] English and applicable translated strings live in the script's `lang/` folder
- [ ] Script tested in Obsidian against the latest Excalidraw plugin version
- [ ] Preview image follows the naming policy

---

## Development Workflow

```bash
npm run new-script -- --name "My Script"    # scaffold src/scripts/{slug}/
npm run test:watch                          # focused development feedback
npm run build                               # compile
npm run check                               # typecheck + lint + all tests
npm run package                             # copies build/ -> release/
```
