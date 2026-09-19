// Generated scripting API. No plugin implementation declarations.
import type { ValueOf } from "./types";
export interface ColorMap {
    [color: string]: string;
}
export declare type MimeType = ValueOf<typeof IMAGE_MIME_TYPES> | "application/octet-stream";
export declare const IMAGE_MIME_TYPES: {
    readonly svg: "image/svg+xml";
    readonly png: "image/png";
    readonly jpg: "image/jpeg";
    readonly jpeg: "image/jpeg";
    readonly gif: "image/gif";
    readonly webp: "image/webp";
    readonly bmp: "image/bmp";
    readonly ico: "image/x-icon";
    readonly avif: "image/avif";
    readonly jfif: "image/jfif";
};
export type PDFPageViewProps = {
    left: number;
    bottom: number;
    right: number;
    top: number;
    rotate?: number;
};
export type Size = {
    height: number;
    width: number;
};
export {};
