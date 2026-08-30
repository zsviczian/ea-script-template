import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createColorPalettePickerTranslator } from "../lang";
import { runColorPalettePicker } from "../run";

describe("color palette picker", () => {
  const notices: string[] = [];

  beforeEach(() => {
    notices.length = 0;
    vi.spyOn(Math, "random").mockReturnValue(0);
    vi.stubGlobal(
      "Notice",
      class {
        constructor(message: string) {
          notices.push(message);
        }
      },
    );
  });

  afterEach(() => vi.unstubAllGlobals());

  it("sets a palette color and reports it through the translator", async () => {
    const style = { strokeColor: "#000000" };
    const fakeEa = { style } as unknown as ExcalidrawAutomate;

    await runColorPalettePicker(
      fakeEa,
      {} as ExcalidrawAPI,
      createColorPalettePickerTranslator("en"),
    );

    expect(style.strokeColor).toBe("#e03131");
    expect(notices).toEqual(["Color palette picker: stroke color set to #e03131."]);
  });

  it("uses the Simplified Chinese catalog", () => {
    const t = createColorPalettePickerTranslator("zh-CN");
    expect(t("strokeColorSet", { color: "#1971c2" })).toBe(
      "调色板选择器：描边颜色已设为 #1971c2。",
    );
  });
});
