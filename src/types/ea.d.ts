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
  /** Obsidian APIs exposed to ExcalidrawAutomate scripts. */
  readonly obsidian: typeof import("obsidian");

  /** Returns true when the running Obsidian app version meets the minimum. */
  verifyMinAppVersion(version: string): boolean;

  /** Returns true when the running Excalidraw plugin version meets the minimum. */
  verifyMinimumPluginVersion(version: string): boolean;

  /** The drawing explicitly targeted by view-bound EA operations. */
  targetView: ExcalidrawView | null;

  /**
   * Selects a view for EA operations.
   *
   * Omit `view` or pass `"auto"` to select a sensible default. Pass an
   * Excalidraw view to bind explicitly. Pass `null` to clear `targetView`.
   */
  setView(
    view?: ExcalidrawView | "auto" | "first" | "active" | null,
    show?: boolean,
  ): ExcalidrawView | null;

  /** Requests autostart permission with an optional script-specific explanation. */
  registerAutostart(message?: string): Promise<"allow" | "deny" | "pending">;

  /**
   * Registers synchronous cleanup owned by this EA instance.
   * @returns A function that unregisters the callback without running it.
   */
  registerCleanup(cleanup: () => void): () => void;

  /** Returns the live Excalidraw React API for the active canvas. */
  getExcalidrawAPI(): ExcalidrawAPI | null;

  /** Opens the EA workbench so elements can be staged before insertion. */
  reset(): void;

  /**
   * Copies staged elements to the live scene.
   *
   * Saving is enabled by default. Await the result before assuming a persistent mutation completed.
   */
  addElementsToView(
    repositionToCursor?: boolean,
    save?: boolean,
    newElementsOnTop?: boolean,
    shouldRestoreElements?: boolean,
    captureUpdate?: "NEVER" | "EVENTUALLY" | "IMMEDIATELY",
  ): Promise<boolean>;

  /** The currently selected element IDs on the canvas. */
  getViewSelectedElements(): ExcalidrawElement[];

  /** Gets the current script's settings object from Obsidian data. */
  getScriptSettings(): Record<string, unknown>;

  /** Persists updated script settings. */
  setScriptSettings(settings: Record<string, unknown>): Promise<void>;

  /** Shows a native Obsidian input prompt modal. */
  inputPrompt(header: string, placeholder?: string, value?: string): Promise<string | null>;

  /** Shows a native Obsidian suggestion modal. */
  suggestionPrompt(header: string, displayItems: string[], hint?: string): Promise<string | null>;

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

/** Minimal view identity used by template lifecycle examples. */
declare interface ExcalidrawView {
  readonly file?: { readonly path: string };
}

declare type ScriptExecutionSource =
  | "manual"
  | "plugin-startup"
  | "view-autostart"
  | "sidepanel-restore"
  | "sidepanel-reload"
  | "drawing-onload";

declare interface ScriptUtils {
  /** The script file currently being executed. */
  readonly scriptFile: import("obsidian").TFile;
  /** The trigger for this invocation, independent of compilation-cache reuse. */
  readonly executionSource: ScriptExecutionSource;
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

/** Utilities and execution context injected by the Script Engine. */
declare const utils: ScriptUtils;

/** Obsidian's Notice class — available globally in the plugin context. */
declare class Notice {
  constructor(message: string, timeout?: number);
}
