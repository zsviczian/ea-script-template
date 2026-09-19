// Generated scripting API. No plugin implementation declarations.
import type { Modal } from "obsidian";
import type { App } from "obsidian";
export declare class FloatingModal extends Modal {
    constructor(app: App);
    open(): void;
    close(): void;
    enableKeyCapture(): void;
    disableKeyCaptureFn(): void;
}
export {};
