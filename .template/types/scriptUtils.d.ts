// Generated scripting API. No plugin implementation declarations.
import type { ButtonDefinition } from "./support/types/promptTypes";
import type { InputPromptOptions } from "./support/types/promptTypes";
import type { Instruction } from "obsidian";
import type { TFile } from "obsidian";
export type ScriptExecutionSource = "manual" | "plugin-startup" | "view-autostart" | "sidepanel-restore" | "sidepanel-reload" | "drawing-onload";
export interface ScriptUtils {
    inputPrompt(header: string, placeholder?: string, value?: string, buttons?: ButtonDefinition[], lines?: number, displayEditorButtons?: boolean, customComponents?: (container: HTMLElement) => void, blockPointerInputOutsideModal?: boolean, controlsOnTop?: boolean, draggable?: boolean): Promise<string | undefined>;
    inputPrompt(options: InputPromptOptions): Promise<string | undefined>;
    suggester<T>(displayItems: string[], items: T[], hint?: string, instructions?: Instruction[]): Promise<T | undefined>;
    readonly scriptFile: TFile;
    readonly executionSource: ScriptExecutionSource;
}
export {};
