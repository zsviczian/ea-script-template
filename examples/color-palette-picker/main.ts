/**
 * @file main.ts  (color-palette-picker example)
 * @overview
 *   Lets the user pick a named colour palette from a curated list and
 *   recolours every selected element's stroke and fill to match.
 *
 *   This example shows:
 *   - Using ea.suggestionPrompt for structured user input
 *   - Staging elements in the EA workbench before writing to the scene
 *   - Keeping UI strings in a constants object
 *   - Breaking the work into small, documented functions
 *
 * @author  Your Name
 * @version 1.0.0
 */

// ---------------------------------------------------------------------------
// Constants (normally live in src/constants/)
// ---------------------------------------------------------------------------

const SCRIPT_NAME = "Color Palette Picker";

const PALETTES: Record<string, { stroke: string; fill: string }[]> = {
  Sunset: [
    { stroke: "#c92a2a", fill: "#ffa8a8" },
    { stroke: "#e67700", fill: "#ffd8a8" },
    { stroke: "#5c940d", fill: "#d8f5a2" },
  ],
  Ocean: [
    { stroke: "#1864ab", fill: "#a5d8ff" },
    { stroke: "#0b7285", fill: "#99e9f2" },
    { stroke: "#2b8a3e", fill: "#b2f2bb" },
  ],
  Mono: [
    { stroke: "#212529", fill: "#f8f9fa" },
    { stroke: "#495057", fill: "#dee2e6" },
    { stroke: "#868e96", fill: "#f1f3f5" },
  ],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Prompts the user to select a palette name.
 *
 * @returns The chosen palette name, or null if cancelled.
 */
async function choosePalette(): Promise<string | null> {
  return ea.suggestionPrompt(
    `${SCRIPT_NAME} — Choose a palette`,
    Object.keys(PALETTES),
    "Arrow keys to navigate, Enter to select.",
  );
}

/**
 * Applies palette colours cyclically to the given elements.
 *
 * @param elements  Elements to recolour.
 * @param colours   Colour pairs from the chosen palette.
 */
function applyPalette(
  elements: ExcalidrawElement[],
  colours: { stroke: string; fill: string }[],
): void {
  elements.forEach((el, index) => {
    // noUncheckedIndexedAccess widens the type to T | undefined; the modulo
    // guarantees the index is always in-bounds, so the non-null assertion is safe.
    const colour = colours[index % colours.length] as { stroke: string; fill: string };
    // Cast needed because ExcalidrawElement is mutable during scene update
    (el as Record<string, unknown>)["strokeColor"] = colour.stroke;
    (el as Record<string, unknown>)["backgroundColor"] = colour.fill;
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

/** Entry point called by the Excalidraw Script Engine. */
async function main(): Promise<void> {
  if (!ea.verifyMinAppVersion("2.0.0")) {
    new Notice("This script requires Excalidraw 2.0.0 or newer.");
    return;
  }

  const selected = ea.getViewSelectedElements();
  if (selected.length === 0) {
    new Notice(`${SCRIPT_NAME}: Please select at least one element.`);
    return;
  }

  const paletteName = await choosePalette();
  if (!paletteName) {
    new Notice(`${SCRIPT_NAME}: Cancelled.`);
    return;
  }

  const colours = PALETTES[paletteName];
  if (!colours) {
    new Notice(`${SCRIPT_NAME}: Unknown palette "${paletteName}".`);
    return;
  }

  const api = ea.getExcalidrawAPI();
  if (!api) {
    new Notice(`${SCRIPT_NAME}: Could not obtain Excalidraw API.`);
    return;
  }

  // Work on a mutable copy; never mutate the live scene array directly
  const mutableElements = api.getSceneElements().map((el) => ({ ...el }));
  const selectedIds = new Set(selected.map((el) => el.id));
  const targets = mutableElements.filter((el) => selectedIds.has(el.id));

  applyPalette(targets, colours);

  api.updateScene({ elements: mutableElements as ExcalidrawElement[] });
  new Notice(`${SCRIPT_NAME}: Applied "${paletteName}" palette to ${targets.length} element(s).`);
}

void main();
