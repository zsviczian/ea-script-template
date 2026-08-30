import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createMinimalStarterTranslator } from "../lang";
import { runMinimalStarter } from "../run";

describe("minimal starter", () => {
  const notices: string[] = [];

  beforeEach(() => {
    notices.length = 0;
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

  it("reports the selected element count through the script translator", async () => {
    const fakeEa = {
      getViewSelectedElements: () => [{ id: "one" }, { id: "two" }],
    } as unknown as ExcalidrawAutomate;

    await runMinimalStarter(fakeEa, {} as ExcalidrawAPI, createMinimalStarterTranslator("en"));

    expect(notices).toEqual(["Minimal starter: selected 2 element(s)."]);
  });

  it("falls back from a regional locale to its base language", () => {
    const t = createMinimalStarterTranslator("de-DE");
    expect(t("selectedElements", { count: 3 })).toBe("Minimal Starter: 3 Element(e) ausgewählt.");
  });
});
