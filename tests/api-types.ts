/// <reference path="../src/types/ea.d.ts" />

// These must produce real types, not silently become any through unresolved declarations.
const id: string = ea.addRect(0, 0, 100, 100);
const saved: Promise<boolean> = ea.addElementsToView(false, true);
const width: number = ea.getBoundingBox(ea.getViewElements()).width;
const name: Promise<string | undefined> = utils.inputPrompt({ header: "Name" });
const choice: Promise<number | undefined> = utils.suggester(["One"], [1]);
const applicationSupported: boolean = ea.obsidian.requireApiVersion("1.8.7");
const cleanup: () => void = ea.registerCleanup(() => {});
// @ts-expect-error EA has no such method.
ea.notAnExcalidrawMethod();
// @ts-expect-error Real API requires a numeric width.
ea.addRect(0, 0, "wide", 100);
// @ts-expect-error Prompt belongs to utils.
ea.inputPrompt("Wrong host");
// @ts-expect-error No such application-version helper exists on EA.
ea.verifyMinAppVersion("1.0.0");
// @ts-expect-error Obsidian must also retain its real types.
ea.obsidian.notAnObsidianMethod();
// @ts-expect-error Bounding box must not degrade to any.
const invalidWidth: string = ea.getBoundingBox([]).width;
void [id, saved, width, name, choice, applicationSupported, cleanup, invalidWidth];

export {};
