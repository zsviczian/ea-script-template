# Shared script workspace guidance

- Read the root AGENTS.md and LOCAL_GUIDE.md (and FORK_RULES.md when present).
  Local repository conventions supplement this shared baseline.
- Read AUTHORING_GUIDE.md and `.ai/excalidraw-automate/SKILL.md`; use `.ai/excalidraw-automate/references/api-usage-index.md`
  to find relevant reference scripts before guessing an API.
- This is a multi-script workspace. Each script belongs under `src/scripts/{slug}/`.
  Keep main.ts focused on orchestration; put reusable behavior in import-safe
  modules and cross-script helpers in src/sharedUtils/.
- The Script Engine injects ea and utils. Obtain runtime Obsidian classes from
  ea.obsidian; use `import type` for Obsidian and Excalidraw declarations.
- Prefer EA methods, then ea.getExcalidrawAPI(), then low-level ExcalidrawLib helpers.
  Use utils.inputPrompt and utils.suggester; cancellation yields undefined.
- Check the Excalidraw version with ea.verifyMinimumPluginVersion. Check Obsidian
  with ea.obsidian.requireApiVersion. Do not invent verifyMinAppVersion or renderSidepanel.
- Treat EA as a stateful workbench: clear, copyViewElementsToEAforEditing, modify
  getElement(id), then await addElementsToView. Cloning creates new IDs and is for
  duplicates. Do not mutate immutable scene elements or interleave EA transactions.
- Use ea.registerCleanup for external listeners, timers, observers, and subscriptions.
  Its lifetime follows the EA instance. Persistent sidepanels may start with no
  targetView; bind via setView(view), clear via setView(null), and handle focus changes.
- Use utils.executionSource for manual/autostart/startup/sidepanel/drawing triggers.
  Explain permission requests with registerAutostart(message). Action-provider icons
  are Obsidian/Lucide names, not SVG markup.
- Use the owning view document/window for UI and validate popouts and physical mobile
  devices for affected interactions. Use Obsidian modals instead of browser dialogs.
- Keep script-specific strings together. Follow the local repository's localization
  policy; the template does not require a particular translation framework.
- Keep script icons simple and recognizable at small sizes. Prefer an existing
  icon from lucide.dev, which matches Obsidian's icon language. If a custom icon is
  necessary, make it square (1:1) and ensure it remains recognizable at 64 by 64 px;
  do not use elaborate illustrations.
- Test meaningful script behavior in import-safe modules, never by importing an
  executable main.ts. Run npm run check and npm run build after changes, plus relevant
  local tests. Exercise runtime behavior in Obsidian; typechecking cannot prove it.
- Generated types in .template/types and src/types/ea.d.ts come from the plugin
  declaration graph. Never patch them or restore handwritten EA stubs. Put
  repository-specific ambient declarations and type augmentations in
  src/types/local.d.ts; fix the source or generator when the shared API is wrong.
- At the start of work in a script workspace, proactively run
  `node scripts/update-template.mjs --check` once when the updater is available.
  Repeat
  only after a long-lived context when it has not yet been checked; never run it
  before every command. If the preview has a clean update, review its paths and
  apply it with `npm run update-template`, then run npm install and the relevant
  checks. If the workspace has local changes or the preview reports conflicts, do
  not force an update: report the paths and resolve each with the repository owner.
- Template updates must preserve src/scripts, src/sharedUtils, local guidance,
  repository identity, and custom package keys. Follow .template/README.md. Never
  resolve all updater conflicts by blindly accepting upstream files.
- Script publication belongs in obsidian-excalidraw-plugin, not this workspace or
  ea-script-template: script Markdown, scripts-{slug}.{ext} preview, manual index
  entry, and directory-info metadata/mtime. Follow CONTRIBUTING.md.
