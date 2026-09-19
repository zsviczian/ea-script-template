// Generated scripting API. No plugin implementation declarations.
export type ExcalidrawCustomDataPatch = Partial<ExcalidrawCustomData>;
export type ExcalidrawCustomData = Record<string, ExcalidrawCustomDataValue | undefined>;
export type ExcalidrawCustomDataValue = string | number | boolean | null | ExcalidrawCustomDataValue[] | {
    [key: string]: ExcalidrawCustomDataValue;
};
export {};
