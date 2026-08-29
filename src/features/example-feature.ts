/**
 * @file example-feature.ts
 * @overview Demonstrates the recommended feature-module pattern.
 *   Each feature receives `ea` and the Excalidraw API; it never
 *   reaches for globals directly.
 *
 *   Replace this file with your own feature once you are familiar
 *   with the pattern.
 */

import { showNotice, showError } from "../core/notice";
import { getBoundingBox, getCenter } from "../core/element-utils";
import { MSG } from "../constants/strings";
import { DEFAULT_STROKE_WIDTH } from "../constants/config";
import type { FeatureResult } from "../types/script-types";

/**
 * Draws a circle centred on the bounding box of the currently selected
 * elements and prints a success notice.
 *
 * @param ea   The ExcalidrawAutomate instance.
 * @param _api The live Excalidraw React API (unused in this example).
 * @returns    A {@link FeatureResult} describing the outcome.
 */
export async function runFeature(
  ea: ExcalidrawAutomate,
  _api: ExcalidrawAPI,
): Promise<FeatureResult> {
  const selected = ea.getViewSelectedElements();

  if (selected.length === 0) {
    showNotice(MSG.NO_SELECTION);
    return { success: false, message: MSG.NO_SELECTION };
  }

  const box = getBoundingBox(selected);
  if (!box) {
    showError(`${MSG.ERROR_PREFIX}Could not compute bounding box.`);
    return { success: false, message: "Bounding box computation failed." };
  }

  const center = getCenter(box);
  const radius = Math.max(box.maxX - box.minX, box.maxY - box.minY) / 2 + 20;

  ea.reset();
  ea.style.strokeColor = "#e03131";
  ea.style.backgroundColor = "transparent";
  ea.style.strokeWidth = DEFAULT_STROKE_WIDTH;
  ea.style.fillStyle = "solid";
  ea.style.roughness = 0;

  const id = ea.addEllipse(center.x - radius, center.y - radius, radius * 2, radius * 2);
  await ea.addElementsToView(false, true);

  showNotice(MSG.SUCCESS);
  return { success: true, elementIds: [id] };
}
