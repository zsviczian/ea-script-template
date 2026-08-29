/**
 * @file script-types.ts
 * @overview Script-local shared types.
 *   Add interfaces and type aliases here that are used across multiple
 *   feature modules. Avoid importing from this file in constants/.
 */

/** A colour value accepted by ExcalidrawAutomate style properties. */
export type HexColor = `#${string}`;

/** Bounding box of an element or group of elements. */
export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/** Result returned by feature functions. */
export interface FeatureResult {
  success: boolean;
  message?: string;
  elementIds?: string[];
}
