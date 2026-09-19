/** Script Engine globals. The EA API is generated from the plugin, not maintained by hand. */
import type { ExcalidrawAutomate as PluginEA } from "../../.template/types/shared/ExcalidrawAutomate";
import type ScriptEngine from "../../.template/types/shared/Scripts";
import type { ScriptExecutionSource } from "../../.template/types/shared/Scripts";
import type { InputPromptOptions } from "../../.template/types/types/promptTypes";
import type { ExcalidrawElement as Element } from "@zsviczian/excalidraw/element/types";
import type { ExcalidrawImperativeAPI } from "@zsviczian/excalidraw/types";
import type { ExcalidrawLib } from "../../.template/types/types/excalidrawLib";
import type { TFile } from "obsidian";

type PromptArguments =
  Parameters<typeof ScriptEngine.inputPrompt> extends [
    unknown,
    unknown,
    unknown,
    ...infer Arguments,
  ]
    ? Arguments
    : never;

declare global {
  type ExcalidrawAutomate = PluginEA;
  type ExcalidrawElement = Element;
  type ExcalidrawAPI = ExcalidrawImperativeAPI;
  interface ScriptUtils {
    // The plugin compiles without strictNullChecks; cancellation still returns undefined.
    inputPrompt(...args: PromptArguments): Promise<string | undefined>;
    inputPrompt(options: InputPromptOptions): Promise<string | undefined>;
    suggester<T>(
      displayItems: string[],
      items: T[],
      hint?: string,
      instructions?: Parameters<typeof ScriptEngine.suggester>[4],
    ): Promise<T | undefined>;
    readonly scriptFile: TFile;
    readonly executionSource: ScriptExecutionSource;
  }
  interface Window {
    ExcalidrawLib: typeof ExcalidrawLib;
  }
  const ea: ExcalidrawAutomate;
  const utils: ScriptUtils;
  const app: import("obsidian").App;
}
export {};
