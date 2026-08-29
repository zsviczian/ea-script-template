/**
 * @file ea.d.ts
 * @overview Ambient type declarations for the ExcalidrawAutomate globals
 *   injected by the Excalidraw Script Engine at runtime.
 *
 *   These are minimal stubs — add more signatures as your script grows.
 *   For the authoritative API see:
 *   https://zsviczian.github.io/obsidian-excalidraw-plugin/
 */

// ---------------------------------------------------------------------------
// Minimal ExcalidrawAutomate surface
// ---------------------------------------------------------------------------

declare interface ExcalidrawAutomate {
  /** Returns true when the running plugin version meets the minimum. */
  verifyMinAppVersion(version: string): boolean;

  /** Returns the live Excalidraw React API for the active canvas. */
  getExcalidrawAPI(): ExcalidrawAPI | null;

  /** Opens the EA workbench so elements can be staged before insertion. */
  reset(): void;

  /**
   * Copies staged elements to the live scene.
   *
   * @param repositionToCursor                 When true, elements are placed at the cursor position.
   * @param finalizeWhenFallbackIsAvailable    When true, the scene is finalised even if the
   *                                           canvas API falls back to a compatibility path.
   */
  addElementsToView(repositionToCursor?: boolean, finalizeWhenFallbackIsAvailable?: boolean): Promise<void>;

  /** The currently selected element IDs on the canvas. */
  getViewSelectedElements(): ExcalidrawElement[];

  /** Gets the current script's settings object from Obsidian data. */
  getScriptSettings(): Record<string, unknown>;

  /** Persists updated script settings. */
  setScriptSettings(settings: Record<string, unknown>): Promise<void>;

  /** Shows a native Obsidian input prompt modal. */
  inputPrompt(
    header: string,
    placeholder?: string,
    value?: string,
  ): Promise<string | null>;

  /** Shows a native Obsidian suggestion modal. */
  suggestionPrompt(
    header: string,
    displayItems: string[],
    hint?: string,
  ): Promise<string | null>;

  // Element creation helpers
  addRect(topX: number, topY: number, width: number, height: number): string;
  addEllipse(topX: number, topY: number, width: number, height: number): string;
  addText(topX: number, topY: number, text: string, formatting?: TextFormatting): string;
  addLine(points: [number, number][]): string;
  addArrow(points: [number, number][], formatting?: ArrowFormatting): string;

  // Style setters (apply before calling add*)
  style: ElementStyle;
}

declare interface ElementStyle {
  strokeColor: string;
  backgroundColor: string;
  strokeWidth: number;
  fillStyle: "hachure" | "cross-hatch" | "solid" | "dots" | "dashed" | "zigzag";
  roughness: number;
  opacity: number;
  fontSize: number;
  fontFamily: 1 | 2 | 3 | 4;
  textAlign: "left" | "center" | "right";
  verticalAlign: "top" | "middle" | "bottom";
}

declare interface TextFormatting {
  width?: number;
  height?: number;
  textAlign?: "left" | "center" | "right";
  box?: boolean;
  boxPadding?: number;
}

declare interface ArrowFormatting {
  startArrowHead?: string;
  endArrowHead?: string;
}

declare interface ExcalidrawElement {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  strokeColor: string;
  backgroundColor: string;
  opacity: number;
  [key: string]: unknown;
}

declare interface ExcalidrawAPI {
  getSceneElements(): readonly ExcalidrawElement[];
  getAppState(): Record<string, unknown>;
  updateScene(sceneData: {
    elements?: ExcalidrawElement[];
    appState?: Record<string, unknown>;
  }): void;
  refresh(): void;
}

// ---------------------------------------------------------------------------
// Globals injected by the Script Engine
// ---------------------------------------------------------------------------

/** The ExcalidrawAutomate instance for the currently active canvas. */
declare const ea: ExcalidrawAutomate;

/** Obsidian's Notice class — available globally in the plugin context. */
declare class Notice {
  constructor(message: string, timeout?: number);
}
