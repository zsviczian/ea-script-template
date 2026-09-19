// Generated scripting API. No plugin implementation declarations.
import type { TFile } from "obsidian";
export type Point = [
    number,
    number
];
export type ObsidianDraggable = {
    type?: "file" | "files" | "link" | "text" | "unknown";
    file?: TFile;
    files?: TFile[];
    title?: string;
    [key: string]: unknown;
};
export type ConnectionPoint = "top" | "bottom" | "left" | "right" | null;
export type ValueOf<T> = T[keyof T];
export type DeviceType = {
    isDesktop: boolean;
    isPhone: boolean;
    isTablet: boolean;
    isMobile: boolean;
    isLinux: boolean;
    isMacOS: boolean;
    isWindows: boolean;
    isIOS: boolean;
    isAndroid: boolean;
};
export {};
