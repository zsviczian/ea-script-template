// Generated scripting API. No plugin implementation declarations.
import type { FrameRenderingOptions } from "./utilTypes";
export interface ExportSettings {
    withBackground: boolean;
    withTheme: boolean;
    isMask: boolean;
    frameRendering?: FrameRenderingOptions;
    skipInliningFonts?: boolean;
}
export interface PDFPageProperties {
    dimensions?: {
        width: number;
        height: number;
    };
    backgroundColor?: string;
    margin: PDFMargin;
    alignment: PDFPageAlignment;
}
export type PDFPageAlignment = "center" | "top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right" | "center-left" | "center-right";
export interface PDFMargin {
    left: number;
    right: number;
    top: number;
    bottom: number;
}
export interface PDFExportScale {
    fitToPage: number;
    zoom?: number;
}
export interface PageDimensions {
    width: number;
    height: number;
}
export type PageOrientation = "portrait" | "landscape";
export type PageSize = keyof typeof STANDARD_PAGE_SIZES;
export declare const STANDARD_PAGE_SIZES: {
    readonly A0: {
        readonly width: 3179.52;
        readonly height: 4494.96;
    };
    readonly A1: {
        readonly width: 2245.76;
        readonly height: 3179.52;
    };
    readonly A2: {
        readonly width: 1587.76;
        readonly height: 2245.76;
    };
    readonly A3: {
        readonly width: 1122.56;
        readonly height: 1587.76;
    };
    readonly A4: {
        readonly width: 794.56;
        readonly height: 1122.56;
    };
    readonly A5: {
        readonly width: 559.37;
        readonly height: 794.56;
    };
    readonly A6: {
        readonly width: 397.28;
        readonly height: 559.37;
    };
    readonly Legal: {
        readonly width: 816;
        readonly height: 1344;
    };
    readonly Letter: {
        readonly width: 816;
        readonly height: 1056;
    };
    readonly Tabloid: {
        readonly width: 1056;
        readonly height: 1632;
    };
    readonly Ledger: {
        readonly width: 1056;
        readonly height: 1632;
    };
    readonly "HD Screen": {
        readonly width: 1920;
        readonly height: 1080;
    };
    readonly "MATCH IMAGE": {
        readonly width: 0;
        readonly height: 0;
    };
};
export {};
