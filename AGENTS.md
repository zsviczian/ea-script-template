# Agent guide for ea-script-template

## Purpose

This repository is a multi-script authoring workspace for ExcalidrawAutomate scripts.
Treat it as a script portfolio repo, not a single-script starter.

## Operating model

- Each script lives under src/scripts/{slug}/.
- Each script has at least main.ts and preview.svg.
- Build output is shared under build/{slug}/{slug}.md and build/{slug}/{slug}.svg.
- Shared helpers belong under src/sharedUtils/.

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
