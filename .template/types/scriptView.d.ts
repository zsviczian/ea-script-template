// Generated scripting API. No plugin implementation declarations.
import type { TFile } from "obsidian";
import type { WorkspaceLeaf } from "obsidian";
/** View identity and UI ownership for EA hooks. Use EA for drawing operations. */
export default interface ExcalidrawView {
    readonly file: TFile | null;
    readonly leaf: WorkspaceLeaf;
    readonly contentEl: HTMLDivElement;
    readonly ownerDocument: Document;
    readonly ownerWindow: Window;
}
export {};
