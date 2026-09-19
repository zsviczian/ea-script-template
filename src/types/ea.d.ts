/**
 * Script Engine globals generated from the plugin; do not modify this file.
 * Local edits cause conflicts during `npm run update-template`; put repository-specific
 * ambient declarations and type augmentations in `src/types/local.d.ts` instead.
 */
import type { ExcalidrawAutomate as PluginEA } from "../../.template/types/excalidrawAutomate";
import type { ScriptUtils as PluginScriptUtils } from "../../.template/types/scriptUtils";
import type { ExcalidrawElement as Element } from "@zsviczian/excalidraw/element/types";
import type { ExcalidrawImperativeAPI } from "@zsviczian/excalidraw/types";
import type { ExcalidrawLib } from "../../.template/types/excalidrawLib";

declare global {
  type ExcalidrawAutomate = PluginEA;
  type ExcalidrawElement = Element;
  type ExcalidrawAPI = ExcalidrawImperativeAPI;
  interface ScriptUtils extends PluginScriptUtils {}
  interface Window {
    ExcalidrawLib: typeof ExcalidrawLib;
  }
  const ea: ExcalidrawAutomate;
  const utils: ScriptUtils;
  const app: import("obsidian").App;
}
export {};
