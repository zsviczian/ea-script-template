/**
 * @file element-utils.ts
 * @overview Utility functions for working with ExcalidrawElements.
 *   Pure helpers — no side effects, no direct scene mutations.
 */

import type { BoundingBox } from "../types/script-types";

/**
 * Computes the axis-aligned bounding box that encloses all given elements.
 *
 * @param elements  Array of Excalidraw elements to measure.
 * @returns         Combined bounding box, or null when the array is empty.
 */
export function getBoundingBox(elements: ExcalidrawElement[]): BoundingBox | null {
  if (elements.length === 0) return null;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const el of elements) {
    minX = Math.min(minX, el.x);
    minY = Math.min(minY, el.y);
    maxX = Math.max(maxX, el.x + el.width);
    maxY = Math.max(maxY, el.y + el.height);
  }

  return { minX, minY, maxX, maxY };
}

/**
 * Returns the center point of a bounding box.
 *
 * @param box  Bounding box produced by {@link getBoundingBox}.
 * @returns    Center { x, y } coordinates.
 */
export function getCenter(box: BoundingBox): { x: number; y: number } {
  return {
    x: (box.minX + box.maxX) / 2,
    y: (box.minY + box.maxY) / 2,
  };
}
