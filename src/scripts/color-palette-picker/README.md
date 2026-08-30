# Color palette picker

An example ExcalidrawAutomate script that selects a random color from a small
editable palette and applies it as the current stroke color.

## Localization

The script owns its six language files under `lang/`. The English catalog defines
the key type, and the shared translator provides locale normalization, English
fallback, and safe `{color}` interpolation.

## Testing

`__tests__/run.test.ts` fixes the random choice, verifies the style change and
notice, and samples a translated catalog. Use `npm test` to run this and every
other script suite in the workspace.
