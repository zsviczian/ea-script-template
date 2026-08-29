# Copilot instructions for ea-script-template

- Treat this repository as a multi-script workspace.
- Add new scripts under src/scripts/{slug}/ with main.ts and preview.svg.
- Keep shared logic under src/sharedUtils/.
- Keep build outputs deterministic: build/{slug}/{slug}.md and build/{slug}/{slug}.svg.
- For publication to obsidian-excalidraw-plugin, follow CONTRIBUTING.md and use scripts-{slug}.{ext} preview naming.
- Prefer ea APIs over window.ExcalidrawLib where both can solve the task.
