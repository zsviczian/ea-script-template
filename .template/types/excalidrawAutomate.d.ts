// Generated scripting API. No plugin implementation declarations.
import type * as obsidian_module from "obsidian";
import type { FloatingModal } from "./floatingModal";
import type { DeviceType } from "./support/types/types";
import type { ExcalidrawCustomDataPatch } from "./support/utils/elementCustomDataUtils";
import type { ExcalidrawElement } from "@zsviczian/excalidraw/element/types";
import type { AIRequest } from "./support/types/AIUtilTypes";
import type { RequestUrlResponse } from "obsidian";
import type { ExcalidrawAISettings } from "./support/types/AIUtilTypes";
import type { TFolder } from "obsidian";
import type { TFile } from "obsidian";
import type { PaneTarget } from "./support/types/utilTypes";
import type { WorkspaceLeaf } from "obsidian";
import type ExcalidrawView from "./scriptView";
import type { View } from "obsidian";
import type { Editor } from "obsidian";
import type { ObsidianCanvasNode } from "./embeddedCanvasNode";
import type ExcalidrawPlugin from "./scriptPlugin";
import type { FileId } from "@zsviczian/excalidraw/element/types";
import type { ImageInfo } from "./support/types/excalidrawAutomateTypes";
import type { FillStyle } from "@zsviczian/excalidraw/element/types";
import type { StrokeStyle } from "@zsviczian/excalidraw/element/types";
import type { StrokeRoundness } from "@zsviczian/excalidraw/element/types";
import type { RoundnessType } from "@zsviczian/excalidraw/element/types";
import type { ExcalidrawSidepanelTab } from "./sidepanelTab";
import type { KeyBlocker } from "./support/types/excalidrawAutomateTypes";
import type { AppState } from "@zsviczian/excalidraw/types";
import type { Mutable } from "@zsviczian/excalidraw/common/utility-types";
import type { ExcalidrawTextElement } from "@zsviczian/excalidraw/element/types";
import type { PageSize } from "./support/types/exportUtilTypes";
import type { PageOrientation } from "./support/types/exportUtilTypes";
import type { PageDimensions } from "./support/types/exportUtilTypes";
import type { PDFExportScale } from "./support/types/exportUtilTypes";
import type { PDFPageProperties } from "./support/types/exportUtilTypes";
import type { ViewSVGExportOptions } from "./support/types/excalidrawAutomateTypes";
import type { ViewPNGExportOptions } from "./support/types/excalidrawAutomateTypes";
import type { ExportSettings } from "./support/types/exportUtilTypes";
import type { EmbeddedFilesLoader } from "./embeddedFilesLoader";
import type { EmbeddableMDCustomProps } from "./support/shared/Dialogs/EmbeddableSettings";
import type { AddImageOptions } from "./support/types/excalidrawAutomateTypes";
import type { MathJaxRenderOptions } from "./support/types/mathJaxTypes";
import type { MimeType } from "./support/types/embeddedFileLoaderTypes";
import type { DataURL } from "@zsviczian/excalidraw/types";
import type { ConnectionPoint } from "./support/types/types";
import type { ExcalidrawImperativeAPI } from "@zsviczian/excalidraw/types";
import type { ColorMap } from "./support/types/embeddedFileLoaderTypes";
import type { ExcalidrawImageElement } from "@zsviczian/excalidraw/element/types";
import type { SVGColorInfo } from "./support/types/excalidrawAutomateTypes";
import type { BinaryFiles } from "@zsviczian/excalidraw/types";
import type { SceneData } from "@zsviczian/excalidraw/types";
import type { CaptureUpdateActionType } from "@zsviczian/excalidraw/element/index";
import type { SelectedElementMenuAction } from "./support/types/elementActionTypes";
import type React from "react";
import type { ObsidianDraggable } from "./support/types/types";
import type { ClipboardData } from "@zsviczian/excalidraw/clipboard";
import type { AutoexportConfig } from "./support/types/excalidrawViewTypes";
import type { SceneArea } from "./support/types/excalidrawAutomateTypes";
import type { ElementsInAreaOptions } from "./support/types/excalidrawAutomateTypes";
import type { ExcalidrawBindableElement } from "@zsviczian/excalidraw/element/types";
import type { Point } from "./support/types/types";
import type { ScriptSettingValue } from "./support/types/excalidrawAutomateTypes";
import type { OpenViewState } from "obsidian";
import type { TInput } from "@zsviczian/colormaster/types";
import type { ColorMaster } from "@zsviczian/colormaster";
import type PolyBool from "polybooljs";
import type { EditorView } from "@codemirror/view";
import type { EditorState } from "@codemirror/state";
import type { keymap } from "@codemirror/view";
import type { defaultKeymap } from "@codemirror/commands";
import type { history } from "@codemirror/commands";
import type { historyKeymap } from "@codemirror/commands";
import type { LRLanguage } from "@codemirror/language";
import type { Extension } from "@codemirror/state";
/**
 * ExcalidrawAutomate is a utility class that provides a simplified API to interact with Excalidraw elements and the Excalidraw canvas.
 * Elements in the Excalidraw Scene are immutable. You should never directly change element properties in the scene object.
 * ExcalidrawAutomate provides a stateful, in-memory "workbench" where you can create, modify, and delete elements independently of the Excalidraw Scene.
 * Begin each independent transaction with clear(). To modify existing scene elements while preserving their identity, copy them to the workbench with
 * copyViewElementsToEAforEditing() and modify the copies returned by getElement(originalId). Commit persistent edits with addElementsToView(),
 * or use the modified workbench elements for a temporary EA operation such as export and then discard them with clear() without committing.
 * cloneElement() and cloneElements() deliberately generate new IDs and are only for creating genuine duplicates, never for editing an existing scene element.
 * Do not interleave asynchronous operations that mutate the same EA workbench; await the operation, then clear before starting another transaction.
 * To delete an element from the view set element.isDeleted = true and commit the changes to the scene using addElementsToView().
 *
 * At a very high level, EA has 3 type of functions:
 * - functions that modify elements in the EA workbench
 * - functions that access elements and properties of the Scene
 *   - these only work if targetView is set using setView()
 *   - Scripts executed by the Excalidraw ScritpEngine will have the targetView set automatically
 *   - These functions include the word view in their name e.g. getViewSelectedElements()
 * - utility functions that do not modify eleeemnts in the EA workbench or access the scene e.g.
 *   - ea.obsidian is a utility function that returns the Obsidian Module object.
 *   - eg.getCM() returns the ColorMaster object for manipulationg colors,
 *   - ea.help() provides information about functions and properties in the ExcalidrawAutomate class intended for use in Developer Console
 *   - checkAndCreateFolder (thought this has been superceeded by app.vault.createFolder in the Obsidian API)
 *   - etc.
 *
 * Note that some actions are asynchronous and require await to complete. e.g.:
 *   - addImage()
 *   - convertStringToDataURL()
 *   - etc.
 *
 * About the Excalidraw Automate Script Engine:
 * --------------------------------------------
 * Excalidraw Scripts utilize ExcalidrawAutomate. When the script is invoked Excalidraw passes an ExcalidrawAutomate instance to the script.
 * you may access this object via the variable `ea`. e.g. ea.addImage(); This ea object is already set to the targetView.
 * Through ea.obsidian all of the Obsidian API is available to the script. Thus you can create modal views, open files, etc.
 * You can access Obsidian type definitions here: https://github.com/obsidianmd/obsidian-api/blob/master/obsidian.d.ts
 * In addition to the ea instance, the script also receives the `utils` object. utils includes to utility functions: suggester and inputPrompt.
 * You may access these via the variable `utils`. e.g. utils.suggester(...);
 *   - inputPrompt(inputPrompt: (
 *       header: string,
 *       placeholder?: string,
 *       value?: string,
 *       buttons?: ButtonDefinition[],
 *       lines?: number,
 *       displayEditorButtons?: boolean,
 *       customComponents?: (container: HTMLElement) => void,
 *       blockPointerInputOutsideModal?: boolean,
 *     ) => Promise<string>;
 *   -  displayItems: string[],
 *       items: any[],
 *       hint?: string,
 *       instructions?: Instruction[],
 *     ) => Promise<any>;
 */
export declare class ExcalidrawAutomate {
    /**
     * Utility function that returns the Obsidian Module object.
     * @returns {typeof obsidian_module} The Obsidian module object.
     */
    get obsidian(): typeof obsidian_module;
    /**
     * This is a modified version of the Obsidian.Modal class
     * that allows the modal to be dragged around the screen
     * and that does not dim the background.
     */
    get FloatingModal(): typeof FloatingModal;
    /**
     * Retrieves the laser pointer settings from the plugin.
     * @returns {Object} The laser pointer settings.
     */
    get LASERPOINTER(): {
        DECAY_TIME: number;
        DECAY_LENGTH: number;
        COLOR: string;
    };
    /**
     * Retrieves the device type information.
     * @returns {DeviceType} The device type.
     */
    get DEVICE(): DeviceType;
    /**
     * Prints a detailed breakdown of the startup time.
     */
    printStartupBreakdown(): void;
    /**
     * Prints all URLs grouped by their respective justifications.
     * Useful for auditing and generating scanner exception reports.
     * @returns {void}
     */
    printURLsInCodebase(): void;
    /**
     * Add or modify keys in an element's customData while preserving existing keys.
     * Creates customData={} if it does not exist.
     * @param {string} id - The element ID in elementsDict to modify.
     * @param {ExcalidrawCustomDataPatch} newData - Object containing key-value pairs to add/update. Set value to undefined to delete a key.
     * @returns {Mutable<ExcalidrawElement> | undefined} The modified element, or undefined if element does not exist.
     */
    addAppendUpdateCustomData(id: string, newData: ExcalidrawCustomDataPatch): ExcalidrawElement;
    /**
     * Displays help information for EA functions and properties intended to be used in Obsidian developer console.
     * @param {ExcalidrawAutomateHelpTarget} target - Function reference or property name as string.
     * Usage examples:
     * - ea.help(ea.functionName)
     * - ea.help('propertyName')
     * - ea.help('utils.functionName')
     */
    help(target: ExcalidrawAutomateHelpTarget): void;
    /**
     * Posts an AI request to the currently configured provider and returns the response.
     * @param {AIRequest} request - The AI request configuration.
     * @returns {Promise<RequestUrlResponse>} Promise resolving to the provider-normalized API response.
     */
    postAI(request: AIRequest): Promise<RequestUrlResponse>;
    /**
     * Posts an AI request to the OpenAI API and returns the response.
     * @param {AIRequest} request - The AI request configuration.
     * @returns {Promise<RequestUrlResponse>} Promise resolving to the API response.
     */
    postOpenAI(request: AIRequest): Promise<RequestUrlResponse>;
    /**
     * Returns the sanitized Excalidraw AI configuration currently available to scripts.
     */
    getAISettings(): ExcalidrawAISettings | null;
    /**
     * Sends a text or multimodal chat request to the configured AI text model.
     */
    generateAIText(request: AIRequest): Promise<{
        response: RequestUrlResponse;
        json: Record<string, unknown>;
        content: string;
        rateLimit: number | null;
        rateLimitRemaining: number | null;
    }>;
    /**
     * Sends an image-analysis request to the configured multimodal text model.
     */
    analyzeAIImage(request: AIRequest): Promise<{
        response: RequestUrlResponse;
        json: Record<string, unknown>;
        content: string;
        rateLimit: number | null;
        rateLimitRemaining: number | null;
    }>;
    /**
     * Generates a new image using the configured AI image model.
     */
    generateAIImage(request: AIRequest): Promise<import("./support/utils/AIUtils").GenerateAIImageResult>;
    /**
     * Applies a prompt-driven edit to an input image using the configured AI image model.
     */
    transformAIImage(request: AIRequest): Promise<import("./support/utils/AIUtils").GenerateAIImageResult>;
    /**
     * Applies a mask-based edit to an input image using the configured AI image model.
     */
    maskEditAIImage(request: AIRequest): Promise<import("./support/utils/AIUtils").GenerateAIImageResult>;
    /**
     * Creates a lightweight chat session wrapper that preserves prior messages between calls.
     */
    createAIChatSession(initialRequest?: Omit<AIRequest, "messages">): import("./support/utils/AIUtils").AIChatSession;
    /**
     * Returns the accumulated AI token usage for the current Obsidian session.
     * Usage is keyed by model identifier and tracks input/output tokens for text
     * models and generation counts for image models.
     * Data is not persisted and resets when Obsidian is restarted.
     */
    getAIUsage(): import("./support/types/AIUtilTypes").AIUsageData;
    /**
     * Opens a modal dialog showing per-model AI token usage for the current session.
     * The dialog includes a "Copy as Markdown" button so the table can be pasted elsewhere.
     */
    showAIUsageModal(): void;
    /**
     * Returns a compact label string summarising total session token usage.
     * Format: "AI Usage: 355k/23k" (input tokens / output tokens).
     * Appends image generation count when present, e.g. "+ 3 imgs".
     */
    formatAIUsageLabel(): string;
    /**
     * Extracts code blocks from markdown text.
     * @param {string} markdown - The markdown string to parse.
     * @returns {Array<{ data: string, type: string }>} Array of objects containing code block contents and types.
     */
    extractCodeBlocks(markdown: string): {
        data: string;
        type: string;
    }[];
    /**
     * Converts a string to a data URL with specified MIME type.
     * @param {string} data - The string to convert.
     * @param {string} [type="text/html"] - MIME type (default: "text/html").
     * @returns {Promise<string>} Promise resolving to the data URL string.
     */
    convertStringToDataURL(data: string, type?: string): Promise<string>;
    /**
     * Creates a folder if it doesn't exist.
     * @param {string} folderpath - Path of folder to create.
     * @returns {Promise<TFolder>} Promise resolving to the created/existing TFolder.
     */
    checkAndCreateFolder(folderpath: string): Promise<TFolder>;
    /**
     * @param filepath - The file path to split into folder and filename.
     * @returns object containing folderpath, filename, basename, and extension.
     */
    splitFolderAndFilename(filepath: string): {
        folderpath: string;
        filename: string;
        basename: string;
        extension: string;
    };
    /**
     * Generates a unique filepath by appending a number if file already exists.
     * @param {string} filename - Base filename.
     * @param {string} folderpath - Target folder path.
     * @returns {string} Unique filepath string.
     */
    getNewUniqueFilepath(filename: string, folderpath: string): string;
    /**
     * Gets list of available Excalidraw template files.
     * @returns {TFile[] | null} Array of template TFiles or null if none found.
     */
    getListOfTemplateFiles(): TFile[] | null;
    /**
     * Gets all embedded images in a drawing recursively.
     * @param {TFile} [excalidrawFile] - Optional file to check, defaults to ea.targetView.file.
     * @returns {TFile[]} Array of embedded image TFiles.
     */
    getEmbeddedImagesFiletree(excalidrawFile?: TFile): TFile[];
    /**
     * Returns a new unique attachment filepath for the filename provided based on Obsidian settings.
     * @param {string} filename - The filename for the attachment.
     * @returns {Promise<string>} Promise resolving to the unique attachment filepath.
     */
    getAttachmentFilepath(filename: string): Promise<string>;
    /**
     * Compresses a string to base64 using LZString.
     * @param {string} str - The string to compress.
     * @returns {string} The compressed base64 string.
     */
    compressToBase64(str: string): string;
    /**
     * Decompresses a string from base64 using LZString.
     * @param {string} data - The base64 string to decompress.
     * @returns {string} The decompressed string.
     */
    decompressFromBase64(data: string): string;
    /**
     * Prompts the user with a dialog to select new file action.
     * - create markdown file
     * - create excalidraw file
     * - cancel action
     * The new file will be relative to this.targetView.file.path, unless parentFile is provided.
     * If shouldOpenNewFile is true, the new file will be opened in a workspace leaf.
     * targetPane control which leaf will be used for the new file.
     * Returns the TFile for the new file or null if the user cancelled the action.
     * @param {string} newFileNameOrPath - The new file name or path.
     * @param {boolean} shouldOpenNewFile - Whether to open the new file.
     * @param {PaneTarget} [targetPane] - The target pane for the new file.
     * @param {TFile} [parentFile] - The parent file for the new file.
     * @returns {Promise<TFile | null>} Promise resolving to the new TFile or null if cancelled.
     */
    newFilePrompt(newFileNameOrPath: string, shouldOpenNewFile: boolean, targetPane?: PaneTarget, parentFile?: TFile): Promise<TFile | null>;
    /**
     * Generates a new Obsidian Leaf following Excalidraw plugin settings such as open in Main Workspace or not, open in adjacent pane if available, etc.
     * @param {WorkspaceLeaf} origo - The currently active leaf, the origin of the new leaf.
     * @param {PaneTarget} [targetPane] - The target pane for the new leaf.
     * @returns {WorkspaceLeaf} The new or adjacent workspace leaf.
     */
    getLeaf(origo: WorkspaceLeaf, targetPane?: PaneTarget): WorkspaceLeaf;
    /**
     * Returns the editor or leaf.view of the currently active embedded obsidian file.
     * If view is not provided, ea.targetView is used.
     * If the embedded file is a markdown document the function will return
     * {file:TFile, editor:Editor} otherwise it will return {view:any}. You can check view type with view.getViewType();
     * @param {ExcalidrawView} [view] - The view to check.
     * @returns {{view:any}|{file:TFile, editor:Editor}|null} The active embeddable view or editor.
     */
    getActiveEmbeddableViewOrEditor(view?: ExcalidrawView): {
        view: View;
    } | {
        file: TFile;
        editor: Editor;
    } | {
        node: ObsidianCanvasNode;
    } | null;
    /**
     * Checks if the Excalidraw File is a mask file.
     * @param {TFile} [file] - The file to check.
     * @returns {boolean} True if the file is a mask file, false otherwise.
     */
    isExcalidrawMaskFile(file?: TFile): boolean;
    plugin: ExcalidrawPlugin;
    elementsDict: {
        [key: string]: MutableElementMapEntry;
    };
    imagesDict: {
        [key: FileId]: ImageInfo;
    };
    mostRecentMarkdownSVG: SVGSVGElement;
    style: {
        strokeColor: string;
        backgroundColor: string;
        angle: number;
        fillStyle: FillStyle;
        strokeWidth: number;
        strokeStyle: StrokeStyle;
        roughness: number;
        opacity: number;
        strokeSharpness?: StrokeRoundness;
        roundness: null | {
            type: RoundnessType;
            value?: number;
        };
        fontFamily: number;
        fontSize: number;
        textAlign: string;
        verticalAlign: string;
        startArrowHead: string;
        endArrowHead: string;
    };
    setStyle(style: Partial<ExcalidrawAutomate["style"]>): void;
    canvas: {
        theme: string;
        viewBackgroundColor: string;
        gridSize: number;
    };
    colorPalette: object;
    sidepanelTab: ExcalidrawSidepanelTab | null;
    /**
     * Registers synchronous cleanup owned by this EA instance. Use this for
     * external listeners, observers, timers, and subscriptions that EA cannot
     * release itself. Cleanup runs when this EA is destroyed.
     * @param cleanup - Synchronous cleanup callback.
     * @returns A function that unregisters this callback without running it.
     */
    registerCleanup(cleanup: () => void): () => void;
    /**
     * Return the active sidepanel tab for a script, if one exists.
     * If scriptName is omitted the function checks ea.activeScript.
     * At most one sidepanel tab may be open per script. If a tab exists this
     * returns the corresponding ExcalidrawSidepanelTab; otherwise it returns
     * undefined.
     * The returned tab may be hosted by a different ExcalidrawAutomate instance.
     * To determine whether the tab belongs to the current ea instance compare:
     * sidepanelTab.getHostEA() === ea.
     * In this case the script may wish to reuse the existing tab rather than create a new one.
     * @param scriptName - Optional script name to query. Defaults to ea.activeScript.
     * @returns The ExcalidrawSidepanelTab for the script, or undefined if none exists.
     */
    checkForActiveSidepanelTabForScript(scriptName?: string): ExcalidrawSidepanelTab | null;
    /**
     * Creates a new sidepanel tab associated with this ExcalidrawAutomate instance.
     * If a sidepanel tab already exists for this instance, it will be closed first.
     * @param title - The title of the sidepanel tab.
     * @param options
     * @returns
     */
    createSidepanelTab(title: string, persist?: boolean, reveal?: boolean): Promise<ExcalidrawSidepanelTab | null>;
    /**
     * Returns the WorkspaceLeaf hosting the Excalidraw sidepanel view.
     * @returns {WorkspaceLeaf | null} The sidepanel leaf or null if not found.
     */
    getSidepanelLeaf(): WorkspaceLeaf | null;
    /**
     * Queues the script to be skipped once during persisted sidepanel restoration.
     * This is useful at startup when a script is launched via Command Palette/hotkey
     * before the sidepanel view has opened and run its restoration sequence.
     *
     * The script is queued only if the sidepanel leaf is not yet available.
     * @param scriptName - Optional script name. Defaults to ea.activeScript.
     * @returns {boolean} True if a skip marker was queued, false otherwise.
     */
    skipSidepanelScriptRestore(scriptName?: string): boolean;
    /**
     * Toggles the visibility of the Excalidraw sidepanel view.
     * If the sidepanel is not in a leaf attached to the left or right split, no action is taken.
     */
    toggleSidepanelView(): void;
    /**
     * Pins the active script's sidepanel tab to be persistent across Obsidian restarts.
     * @param options
     * @returns {Promise<ExcalidrawSidepanelTab | null>} The persisted sidepanel tab or null on error.
     */
    persistSidepanelTab(): ExcalidrawSidepanelTab | null;
    /**
     * Attaches an inline link suggester to the provided input element. The suggester reacts to
     * "[[" typing, offers vault link choices (including aliases and unresolved links), and inserts
     * the selected link using relative linktext when the active Excalidraw view is known.
     * @param {HTMLInputElement} inputEl - The input element to enhance.
     * @param {HTMLElement} [widthWrapper] - Optional element to determine suggester width.
     * @returns {KeyBlocker} The suggester instance; call close() to detach; call .isBlockingKeys() to check if suggester dropdown is open.
     */
    attachInlineLinkSuggester(inputEl: HTMLInputElement, widthWrapper?: HTMLElement): KeyBlocker;
    /**
     * Parses text using the target view's ExcalidrawData parser.
     *
     * This reuses ExcalidrawData parsing logic directly, including transclusion
     * resolution, link bracket rendering, and link/url prefixes based on the
     * target file's frontmatter.
     *
     * @param {string} text - Raw text to parse.
     * @returns {Promise<string | undefined>} Parsed text, or undefined when input/view is unavailable.
     */
    parseText(text: string): Promise<string | undefined>;
    /**
     * Returns the last recorded pointer position on the Excalidraw canvas.
     * @returns {{x:number, y:number}} The last recorded pointer position.
     */
    getViewLastPointerPosition(): {
        x: number;
        y: number;
    };
    /**
     * Returns the center position of the current view in Excalidraw coordinates.
     * @returns {{x:number, y:number}} The center position of the view.
     */
    getViewCenterPosition(): {
        x: number;
        y: number;
    };
    /**
     * Returns the Excalidraw API for the current view or the view provided.
     * @param {ExcalidrawView} [view] - The view to get the API for.
     * @returns {ExcalidrawAutomate} The Excalidraw API.
     */
    getAPI(view?: ExcalidrawView): ExcalidrawAutomate;
    /**
     * Sets the fill style for new elements.
     * @param {number} val - The fill style value (0: "hachure", 1: "cross-hatch", 2: "solid").
     * @returns {"hachure"|"cross-hatch"|"solid"} The fill style string.
     */
    setFillStyle(val: number): "hachure" | "cross-hatch" | "solid";
    /**
     * Sets the stroke style for new elements.
     * @param {number} val - The stroke style value (0: "solid", 1: "dashed", 2: "dotted").
     * @returns {"solid"|"dashed"|"dotted"} The stroke style string.
     */
    setStrokeStyle(val: number): "solid" | "dashed" | "dotted";
    /**
     * Sets the stroke sharpness for new elements.
     * @param {number} val - The stroke sharpness value (0: "round", 1: "sharp").
     * @returns {"round"|"sharp"} The stroke sharpness string.
     */
    setStrokeSharpness(val: number): "round" | "sharp";
    /**
     * Sets the font family for new text elements.
     * @param {number} val - The font family value (1: Virgil, 2: Helvetica, 3: Cascadia).
     * @returns {string} The font family string.
     */
    setFontFamily(val: number): string;
    /**
     * Sets the theme for the canvas.
     * @param {number} val - The theme value (0: "light", 1: "dark").
     * @returns {"light"|"dark"} The theme string.
     */
    setTheme(val: number): "light" | "dark";
    /**
     * Generates a groupID and adds the groupId to all the elements in the objectIds array. Essentially grouping the elements in the view.
     * @param {string[]} objectIds - Array of element IDs to group.
     * @returns {string} The generated group ID.
     */
    addToGroup(objectIds: string[]): string;
    /**
     * Copies elements from ExcalidrawAutomate to the clipboard as a valid Excalidraw JSON string.
     * @param {string} [templatePath] - Optional template path to include in the clipboard data.
     */
    toClipboard(templatePath?: string): Promise<void>;
    /**
     * Extracts the Excalidraw Scene from an Excalidraw File.
     * @param {TFile} file - The Excalidraw file to extract the scene from.
     * @returns {Promise<{elements: ExcalidrawElement[]; appState: Partial<AppState>;}>} Promise resolving to the Excalidraw scene.
     */
    getSceneFromFile(file: TFile): Promise<{
        elements: ExcalidrawElement[];
        appState: Partial<AppState>;
    }>;
    /**
     * Gets all elements from ExcalidrawAutomate elementsDict.
     * @returns {Mutable<ExcalidrawElement>[]} Array of elements from elementsDict.
     */
    getElements(): MutableElementMapEntry[];
    /**
     * Gets a single element from ExcalidrawAutomate elementsDict.
     * @param {string} id - The element ID to retrieve.
     * @returns {Mutable<ExcalidrawElement>} The element with the specified ID.
     */
    getElement(id: string): MutableElementMapEntry;
    /**
     * Returns an object describing the bound text element.
     *
     * IMPORTANT: The returned object contains EITHER `eaElement` OR `sceneElement`, never both.
     *
     * If a text element is provided:
     *  - returns { eaElement } if the element is in ea.elementsDict
     *  - else (if searchInView is true) returns { sceneElement } if found in the targetView scene
     * If a container element is provided, searches for the bound text element:
     *  - returns { eaElement } if found in ea.elementsDict
     *  - else (if searchInView is true) returns { sceneElement } if found in the targetView scene
     * If not found, returns {}.
     * Does not add the text element to elementsDict.
     *
     * Recommended usage pattern for editing:
     * const boundText = ea.getBoundTextElement(container, true);
     * let textEl = boundText.eaElement;
     * if (!textEl && boundText.sceneElement) {
     *   ea.copyViewElementsToEAforEditing([boundText.sceneElement]);
     *   textEl = ea.getElement(boundText.sceneElement.id);
     * }
     * if (textEl) { ... safely modify textEl ... }
     * @param element: ExcalidrawElement | ExcalidrawElement[] - The selected container with text (an array of 2 elements) to check.
     * @param searchInView - If true, searches in the targetView elements if not found in elementsDict.
     * @returns Object containing either eaElement or sceneElement or empty if not found.
     */
    getBoundTextElement(element: ExcalidrawElement | ExcalidrawElement[], searchInView?: boolean): {
        eaElement?: Mutable<ExcalidrawTextElement>;
        sceneElement?: ExcalidrawTextElement;
    };
    /**
     * Creates a new Excalidraw drawing file from current EA state and optional template.
     * @param params - Optional creation parameters.
     * @param {string} [params.plaintext] - Text to insert above the `# Text Elements` section.
     * @returns {Promise<string>} Promise resolving to the path of the created drawing.
     */
    create(params?: {
        filename?: string;
        foldername?: string;
        templatePath?: string;
        onNewPane?: boolean;
        silent?: boolean;
        frontmatterKeys?: {
            [key: string]: string | number | boolean | undefined;
            "excalidraw-plugin"?: "raw" | "parsed";
            "excalidraw-link-prefix"?: string;
            "excalidraw-link-brackets"?: boolean;
            "excalidraw-url-prefix"?: string;
            "excalidraw-export-transparent"?: boolean;
            "excalidraw-export-dark"?: boolean;
            "excalidraw-export-padding"?: number;
            "excalidraw-export-pngscale"?: number;
            "excalidraw-export-embed-scene"?: boolean;
            "excalidraw-default-mode"?: "view" | "zen";
            "excalidraw-onload-script"?: string;
            "excalidraw-linkbutton-opacity"?: number;
            "excalidraw-autoexport"?: boolean;
            "excalidraw-mask"?: boolean;
            "excalidraw-open-md"?: boolean;
            "excalidraw-export-internal-links"?: boolean;
            cssclasses?: string;
        };
        plaintext?: string;
    }): Promise<string>;
    /**
     * Returns the dimensions of a standard page size in pixels.
     *
     * @param {PageSize} pageSize - The standard page size. Possible values are "A0", "A1", "A2", "A3", "A4", "A5", "Letter", "Legal", "Tabloid".
     * @param {PageOrientation} orientation - The orientation of the page. Possible values are "portrait" and "landscape".
     * @returns {PageDimensions} - An object containing the width and height of the page in pixels.
     *
     * @typedef {Object} PageDimensions
     * @property {number} width - The width of the page in pixels.
     * @property {number} height - The height of the page in pixels.
     *
     * @example
     * const dimensions = getPageDimensions("A4", "portrait");
     * console.log(dimensions); // { width: 794.56, height: 1122.56 }
     */
    getPagePDFDimensions(pageSize: PageSize, orientation: PageOrientation): PageDimensions;
    /**
     * Creates a PDF from the provided SVG elements with specified scaling and page properties.
     *
     * @param {Object} params - The parameters for creating the PDF.
     * @param {SVGSVGElement[]} params.SVG - An array of SVG elements to be included in the PDF.
     * @param {PDFExportScale} [params.scale={ fitToPage: 1, zoom: 1 }] - The scaling options for the SVG elements.
     * @param {PDFPageProperties} [params.pageProps] - The properties for the PDF pages.
     * @returns {Promise<ArrayBuffer>} - A promise that resolves to an ArrayBuffer containing the PDF data.
     *
     * @example
     * const pdfData = await createToPDF({
     *   SVG: [svgElement1, svgElement2],
     *   scale: { fitToPage: 1 },
     *   pageProps: {
     *     dimensions: { width: 794.56, height: 1122.56 },
     *     backgroundColor: "#ffffff",
     *     margin: { left: 20, right: 20, top: 20, bottom: 20 },
     *     alignment: "center",
     *   }
     *   filename: "example.pdf",
     * });
     */
    createPDF({ SVG, scale, pageProps, filename, }: {
        SVG: SVGSVGElement[];
        scale?: PDFExportScale;
        pageProps?: PDFPageProperties;
        filename: string;
    }): Promise<void>;
    /**
     * Creates an SVG representation of the current view.
     *
     * @param options - View export options. `elementsOverride`, when supplied, is
     * a complete replacement rather than a patch. `exportArea` filters that
     * candidate set and anchors the result to an exact scene rectangle.
     * @returns A promise resolving to the exported SVG, or `undefined` when no
     * loaded target view is available.
     */
    createViewSVG(options?: ViewSVGExportOptions): Promise<SVGSVGElement>;
    /**
     * Creates a PNG representation of the current view without using or mutating
     * the EA workbench.
     *
     * @param options - View export options. `elementsOverride`, when supplied, is
     * a complete replacement rather than a patch. `exportArea` filters that
     * candidate set and anchors the result to an exact scene rectangle.
     * @returns A promise resolving to a PNG blob, or `undefined` when no loaded
     * target view is available.
     */
    createViewPNG(options?: ViewPNGExportOptions): Promise<Blob>;
    /**
     * Creates an SVG image from the ExcalidrawAutomate elements and the template provided.
     * @param {string} [templatePath] - The template path to use for the SVG.
     * @param {boolean} [embedFont=false] - Whether to embed the font in the SVG.
     * @param {ExportSettings} [exportSettings] - Export settings for the SVG.
     * @param {EmbeddedFilesLoader} [loader] - Embedded files loader for the SVG.
     * @param {string} [theme] - The theme to use for the SVG.
     * @param {number} [padding] - The padding to use for the SVG.
     * @returns {Promise<SVGSVGElement>} Promise resolving to the created SVG element.
     */
    createSVG(templatePath?: string, embedFont?: boolean, exportSettings?: ExportSettings, loader?: EmbeddedFilesLoader, theme?: string, padding?: number, convertMarkdownLinksToObsidianURLs?: boolean, includeInternalLinks?: boolean): Promise<SVGSVGElement>;
    /**
     * Creates a PNG image from the ExcalidrawAutomate elements and the template provided.
     * @param {string} [templatePath] - The template path to use for the PNG.
     * @param {number} [scale=1] - The scale factor for the PNG.
     * @param {ExportSettings} [exportSettings] - Export settings for the PNG.
     * @param {EmbeddedFilesLoader} [loader] - Embedded files loader for the PNG.
     * @param {string} [theme] - The theme to use for the PNG.
     * @param {number} [padding] - The padding to use for the PNG.
     * @returns {Promise<any>} Promise resolving to the created PNG image.
     */
    createPNG(templatePath?: string, scale?: number, exportSettings?: ExportSettings, loader?: EmbeddedFilesLoader, theme?: string, padding?: number): Promise<Blob>;
    /**
     * Wrapper for createPNG() that returns a base64 encoded string designed to support LLM workflows.
     * @param {string} [templatePath] - The template path to use for the PNG.
     * @param {number} [scale=1] - The scale factor for the PNG.
     * @param {ExportSettings} [exportSettings] - Export settings for the PNG.
     * @param {EmbeddedFilesLoader} [loader] - Embedded files loader for the PNG.
     * @param {string} [theme] - The theme to use for the PNG.
     * @param {number} [padding] - The padding to use for the PNG.
     * @returns {Promise<string>} Promise resolving to the base64 encoded PNG string.
     */
    createPNGBase64(templatePath?: string, scale?: number, exportSettings?: ExportSettings, loader?: EmbeddedFilesLoader, theme?: string, padding?: number): Promise<string>;
    /**
     * Wraps text to a specified line length.
     * @param {string} text - The text to wrap.
     * @param {number} lineLen - The maximum line length.
     * @returns {string} The wrapped text.
     */
    wrapText(text: string, lineLen: number): string;
    /**
     * Use addEmbeddable() instead, unless you specifically need to pass HTML content and create a custom iframe.
     * Retained for backward compatibility.
     * @param {number} topX - The x-coordinate of the top-left corner.
     * @param {number} topY - The y-coordinate of the top-left corner.
     * @param {number} width - The width of the iframe.
     * @param {number} height - The height of the iframe.
     * @param {string} [url] - The URL of the iframe.
     * @param {TFile} [file] - The file associated with the iframe.
     * @param {string} [html] - The HTML content for the iframe.
     * @returns {string} The ID of the added iframe element.
     */
    addIFrame(topX: number, topY: number, width: number, height: number, url?: string, file?: TFile, html?: string): string;
    /**
     * Adds an embeddable element to the ExcalidrawAutomate instance.
     * In case of urls, if the width and or height is set to 0 ExcalidrawAutomate will attempt to determine the dimensions based on the aspect ratio of the content.
     * If both width and height are set to 0 the default size for youtube and vimeo embeddables (560x315) will be used. YouTube shorts will have a default size of 315x560.
     * If only the width or height is set to 0 the other dimension will be calculated based on the aspect ratio of the content.
     * If the calculated width is less than 560 or the calculated height is less than 315 the element will be scaled down proportionally, setting element.scale accordingly.
     * @param {number} topX - The x-coordinate of the top-left corner.
     * @param {number} topY - The y-coordinate of the top-left corner.
     * @param {number} width - The width of the embeddable element.
     * @param {number} height - The height of the embeddable element.
     * @param {string} [url] - The URL of the embeddable element. The URL may be a dataURL as well (however such elements are not supported by Excalidraw.com).
     * @param {TFile} [file] - The file associated with the embeddable element.
     * @param {EmbeddableMDCustomProps} [embeddableCustomData] - Custom properties for the embeddable element.
     * @returns {string} The ID of the added embeddable element.
     */
    addEmbeddable(topX: number, topY: number, width: number, height: number, url?: string, file?: TFile, embeddableCustomData?: EmbeddableMDCustomProps): string;
    /**
     * Add elements to frame.
     * @param {string} frameId - The ID of the frame element.
     * @param {string[]} elementIDs - Array of element IDs to add to the frame.
     */
    addElementsToFrame(frameId: string, elementIDs: string[]): void;
    /**
     * Adds a frame element to the ExcalidrawAutomate instance.
     * @param {number} topX - The x-coordinate of the top-left corner.
     * @param {number} topY - The y-coordinate of the top-left corner.
     * @param {number} width - The width of the frame.
     * @param {number} height - The height of the frame.
     * @param {string} [name] - The display name of the frame.
     * @returns {string} The ID of the added frame element.
     */
    addFrame(topX: number, topY: number, width: number, height: number, name?: string): string;
    /**
     * Adds a rectangle element to the ExcalidrawAutomate instance.
     * @param {number} topX - The x-coordinate of the top-left corner.
     * @param {number} topY - The y-coordinate of the top-left corner.
     * @param {number} width - The width of the rectangle.
     * @param {number} height - The height of the rectangle.
     * @param {string} [id] - The ID of the rectangle element.
     * @returns {string} The ID of the added rectangle element.
     */
    addRect(topX: number, topY: number, width: number, height: number, id?: string): string;
    /**
     * Adds a sticky note and its optional fitted label to the ExcalidrawAutomate
     * instance. Width and height default to Excalidraw's sticky-note size.
     * @param {number} topX - The x-coordinate of the top-left corner.
     * @param {number} topY - The y-coordinate of the top-left corner.
     * @param {string} text - The sticky-note text. An empty string creates an unlabeled note.
     * @param {Object} [formatting] - Sticky-note size and label formatting.
     * @param {number} [formatting.width] - The initial width of the note.
     * @param {number} [formatting.height] - The initial height of the note.
     * @param {number} [formatting.fontSize] - The label's maximum font size.
     * @param {number} [formatting.fontFamily] - The label font family.
     * @param {"left" | "center" | "right"} [formatting.textAlign] - The label's horizontal alignment.
     * @param {"top" | "middle" | "bottom"} [formatting.textVerticalAlign] - The label's vertical alignment.
     * @param {string} [id] - The ID of the sticky-note element.
     * @returns {string} The ID of the added sticky note.
     */
    addStickyNote(topX: number, topY: number, text: string, formatting?: {
        width?: number;
        height?: number;
        fontSize?: number;
        fontFamily?: number;
        textAlign?: "left" | "center" | "right";
        textVerticalAlign?: "top" | "middle" | "bottom";
    }, id?: string): string;
    /**
     * Adds a diamond element to the ExcalidrawAutomate instance.
     * @param {number} topX - The x-coordinate of the top-left corner.
     * @param {number} topY - The y-coordinate of the top-left corner.
     * @param {number} width - The width of the diamond.
     * @param {number} height - The height of the diamond.
     * @param {string} [id] - The ID of the diamond element.
     * @returns {string} The ID of the added diamond element.
     */
    addDiamond(topX: number, topY: number, width: number, height: number, id?: string): string;
    /**
     * Adds an ellipse element to the ExcalidrawAutomate instance.
     * @param {number} topX - The x-coordinate of the top-left corner.
     * @param {number} topY - The y-coordinate of the top-left corner.
     * @param {number} width - The width of the ellipse.
     * @param {number} height - The height of the ellipse.
     * @param {string} [id] - The ID of the ellipse element.
     * @returns {string} The ID of the added ellipse element.
     */
    addEllipse(topX: number, topY: number, width: number, height: number, id?: string): string;
    /**
     * Adds a blob element to the ExcalidrawAutomate instance.
     * @param {number} topX - The x-coordinate of the top-left corner.
     * @param {number} topY - The y-coordinate of the top-left corner.
     * @param {number} width - The width of the blob.
     * @param {number} height - The height of the blob.
     * @param {string} [id] - The ID of the blob element.
     * @returns {string} The ID of the added blob element.
     */
    addBlob(topX: number, topY: number, width: number, height: number, id?: string): string;
    /**
     * Refreshes the size of a text element to fit its contents.
     * @param {string} id - The ID of the text element.
     */
    refreshTextElementSize(id: string): void;
    /**
     * Adds a text element to the ExcalidrawAutomate instance.
     * @param {number} topX - The x-coordinate of the top-left corner.
     * @param {number} topY - The y-coordinate of the top-left corner.
     * @param {string} text - The text content of the element.
     * @param {Object} [formatting] - Formatting options for the text element.
     * @param {boolean} [formatting.autoResize=true] - Whether to auto-resize the text element.
     * @param {number} [formatting.wrapAt] - The character length to wrap the text at.
     * @param {number} [formatting.width] - The width of the text element.
     * @param {number} [formatting.height] - The height of the text element.
     * @param {"left" | "center" | "right"} [formatting.textAlign] - The text alignment.
     * @param {boolean | "box" | "blob" | "ellipse" | "diamond"} [formatting.box] - Whether to add a box around the text.
     * @param {number} [formatting.boxPadding] - The padding inside the box.
     * @param {string} [formatting.boxStrokeColor] - The stroke color of the box.
     * @param {"top" | "middle" | "bottom"} [formatting.textVerticalAlign] - The vertical alignment of the text.
     * @param {string} [id] - The ID of the text element.
     * @returns {string} The ID of the added text element.
     */
    addText(topX: number, topY: number, text: string, formatting?: {
        autoResize?: boolean;
        wrapAt?: number;
        width?: number;
        height?: number;
        textAlign?: "left" | "center" | "right";
        box?: boolean | "box" | "blob" | "ellipse" | "diamond";
        boxPadding?: number;
        boxStrokeColor?: string;
        textVerticalAlign?: "top" | "middle" | "bottom";
    }, id?: string): string;
    /**
     * Adds a line element to the ExcalidrawAutomate instance.
     * @param {[[x: number, y: number]]} points - Array of points defining the line.
     * @param {string} [id] - The ID of the line element.
     * @returns {string} The ID of the added line element.
     */
    addLine(points: [
        x: number,
        y: number
    ][], id?: string): string;
    /**
     * Adds an arrow element to the ExcalidrawAutomate instance.
     * @param {[x: number, y: number][]} points - Array of points defining the arrow.
     * @param {Object} [formatting] - Formatting options for the arrow element.
     * @param {"arrow"|"bar"|"circle"|"circle_outline"|"triangle"|"triangle_outline"|"diamond"|"diamond_outline"|null} [formatting.startArrowHead] - The start arrowhead type.
     * @param {"arrow"|"bar"|"circle"|"circle_outline"|"triangle"|"triangle_outline"|"diamond"|"diamond_outline"|null} [formatting.endArrowHead] - The end arrowhead type.
     * @param {string} [formatting.startObjectId] - The ID of the start object. When omitted, the arrow start is unbound.
     * @param {string} [formatting.endObjectId] - The ID of the end object. When omitted, the arrow end is unbound.
     * BindMode Determines whether the arrow remains outside the shape or is allowed to
     * go all the way inside the shape up to the exact fixed point.
     * @param {"inside" | "orbit"} [formatting.startBindMode] - The binding mode for the start object.
     * @param {"inside" | "orbit"} [formatting.endBindMode] - The binding mode for the end object.
     * FixedPoint represents the fixed point binding information in form of a vertical and
     * horizontal ratio (i.e. a percentage value in the 0.0-1.0 range). This ratio
     * gives the user selected fixed point by multiplying the bound element width
     * with fixedPoint[0] and the bound element height with fixedPoint[1] to get the
     * bound element-local point coordinate.
     * @param {[number, number]} [formatting.startFixedPoint] - The fixed point for the start object.
     * @param {[number, number]} [formatting.endFixedPoint] - The fixed point for the end object.
     * @param {string} [id] - The ID of the arrow element.
     * @returns {string} The ID of the added arrow element.
     */
    addArrow(points: [
        x: number,
        y: number
    ][], formatting?: {
        startArrowHead?: "arrow" | "bar" | "circle" | "circle_outline" | "triangle" | "triangle_outline" | "diamond" | "diamond_outline" | null;
        endArrowHead?: "arrow" | "bar" | "circle" | "circle_outline" | "triangle" | "triangle_outline" | "diamond" | "diamond_outline" | null;
        startObjectId?: string;
        endObjectId?: string;
        startBindMode?: "inside" | "orbit";
        endBindMode?: "inside" | "orbit";
        startFixedPoint?: [
            number,
            number
        ];
        endFixedPoint?: [
            number,
            number
        ];
        elbowed?: boolean;
    }, id?: string): string;
    /**
     * Adds a mermaid diagram to ExcalidrawAutomate elements.
     * @param {string} diagram - The mermaid diagram string.
     * @param {boolean} [groupElements=true] - Whether to group the elements.
     * @returns {Promise<string[]|string>} Promise resolving to the IDs of the created elements or an error message.
     */
    addMermaid(diagram: string, groupElements?: boolean): Promise<string[] | string>;
    /**
     * Adds an image element to the ExcalidrawAutomate instance.
     * @param {number | AddImageOptions} topXOrOpts - The x-coordinate of the top-left corner or an options object.
     * @param {number} topY - The y-coordinate of the top-left corner.
     * @param {TFile | string} imageFile - The image file, hyperlink, vault path, PDF++ reference, or data URL.
     * @param {boolean} [scale=true] - Whether to scale the image to MAX_IMAGE_SIZE.
     * @param {boolean} [anchor=true] - Whether to anchor the image at 100% size.
     * @returns {Promise<string>} Promise resolving to the ID of the added image element.
     */
    addImage(topXOrOpts: number | AddImageOptions, topY: number, imageFile: TFile | string, //string may also be an Obsidian filepath with a reference such as folder/path/my.pdf#page=2
    scale?: boolean, //default is true which will scale the image to MAX_IMAGE_SIZE, false will insert image at 100% of its size
    anchor?: boolean): Promise<string>;
    /**
     * Adds a LaTeX equation as an image element to the ExcalidrawAutomate instance.
     * @param {number} topX - The x-coordinate of the top-left corner.
     * @param {number} topY - The y-coordinate of the top-left corner.
     * @param {string} tex - The LaTeX equation string.
     * @param {number} [scaleX=1] - The x-scaling factor (post mathjax creation)
     * @param {number} [scaleY=1] - The y-scaling factor (post mathjax creation)
     * @param {MathJaxRenderOptions} [options] - MathJax rendering options. Set `throwOnError` to propagate invalid LaTeX errors.
     * @returns {Promise<string>} Promise resolving to the ID of the added LaTeX image element.
     */
    addLaTex(topX: number, topY: number, tex: string, scaleX?: number, scaleY?: number, options?: MathJaxRenderOptions): Promise<string>;
    /**
     * Returns the base64 dataURL of the LaTeX equation rendered as an SVG.
     * @param {string} tex - The LaTeX equation string.
     * @param {number} [scale=4] - The scale factor for the image.
     * @param {MathJaxRenderOptions} [options] - MathJax rendering options. Set `throwOnError` to propagate invalid LaTeX errors.
     * @returns {Promise<{mimeType: MimeType; fileId: FileId; dataURL: DataURL; created: number; size: { height: number; width: number };}>} Promise resolving to the LaTeX image data.
     */
    tex2dataURL(tex: string, scale?: number, // Default scale value, adjust as needed
    options?: MathJaxRenderOptions): Promise<{
        mimeType: MimeType;
        fileId: FileId;
        dataURL: DataURL;
        created: number;
        size: {
            height: number;
            width: number;
        };
    }>;
    /**
     * Connects two objects with an arrow.
     * @param {string} objectA - The ID of the first object.
     * @param {ConnectionPoint | null} connectionA - The connection point on the first object.
     * @param {string} objectB - The ID of the second object.
     * @param {ConnectionPoint | null} connectionB - The connection point on the second object.
     * @param {Object} [formatting] - Formatting options for the arrow.
     * @param {number} [formatting.numberOfPoints=0] - The number of points on the arrow.
     * @param {"arrow"|"bar"|"circle"|"circle_outline"|"triangle"|"triangle_outline"|"diamond"|"diamond_outline"|null} [formatting.startArrowHead] - The start arrowhead type.
     * @param {"arrow"|"bar"|"circle"|"circle_outline"|"triangle"|"triangle_outline"|"diamond"|"diamond_outline"|null} [formatting.endArrowHead] - The end arrowhead type.
     * @param {number} [formatting.padding=10] - The padding around the arrow.
     * @returns {string} The ID of the added arrow element.
     */
    connectObjects(objectA: string, connectionA: ConnectionPoint | null, objectB: string, connectionB: ConnectionPoint | null, formatting?: {
        numberOfPoints?: number;
        startArrowHead?: "arrow" | "bar" | "circle" | "circle_outline" | "triangle" | "triangle_outline" | "diamond" | "diamond_outline" | null;
        endArrowHead?: "arrow" | "bar" | "circle" | "circle_outline" | "triangle" | "triangle_outline" | "diamond" | "diamond_outline" | null;
        padding?: number;
    }): string;
    /**
     * Adds a text label to a line or arrow. Currently only works with a straight (2 point - start & end - line).
     * @param {string} lineId - The ID of the line or arrow object.
     * @param {string} label - The label text.
     * @returns {string} The ID of the added text element.
     */
    addLabelToLine(lineId: string, label: string): string;
    /**
     * Clears the EA workbench (`elementsDict` and `imagesDict`) without changing
     * the scene, target view, or current style. Call this before each independent
     * workbench transaction and before repurposing an EA instance.
     */
    clear(): void;
    /**
     * Clears elementsDict and imagesDict, and resets all style values to default.
     */
    reset(): void;
    /**
     * Returns true if the provided file is an Excalidraw file.
     * @param {TFile} f - The file to check.
     * @returns {boolean} True if the file is an Excalidraw file, false otherwise.
     */
    isExcalidrawFile(f: TFile): boolean;
    targetView: ExcalidrawView | null;
    /**
     * Sets the target view for EA. All view operations and all access to the Excalidraw API
     * will be performed on this view.
     *
     * Typical usage:
     * - `setView()` to pick a sensible default automatically
     * - `setView(excalidrawView)` to explicitly target a specific view
     * - `setView(null)` to explicitly clear `targetView`
     *
     * Selectors:
     * - If `view` is `undefined` (or `"auto"`), EA will pick a sensible default:
     *   1) the currently active Excalidraw view (if any),
     *   2) otherwise the last active Excalidraw view (if it is still available),
     *   3) otherwise the `"first"` Excalidraw view in the workspace.
     * - If `view` is explicitly `null`, EA clears `targetView`. This is useful for
     *   sidepanels when focus moves to a Markdown view or no drawing is eligible.
     * - If `show` is `true`, the view will be revealed (brought to front) and focused.
     *
     * Deprecated selectors (kept for backward compatibility):
     * - If `"active"` is provided, the currently active Excalidraw view will be used. If no
     *   active Excalidraw view is available, the last active Excalidraw view will be used.
     * - If `"first"` is provided, the target will be the first Excalidraw view returned by
     *   Obsidian's workspace leaf collection (i.e., the first item in the current
     *   `getExcalidrawViews()` result). **This ordering is managed by Obsidian and does not
     *   necessarily match what a user would consider the “first”/“leftmost”/“topmost” view;
     *   from a user's perspective it may appear effectively random.**
     *
     * @param {ExcalidrawView | "auto" | "first" | "active" | null | undefined} [view] - The view or selector to set as target. Pass `null` to clear the target.
     * @param {boolean} [show=false] - Whether to reveal/focus the target view.
     * @returns {ExcalidrawView | null} The ExcalidrawView that was set as `targetView`, or `null` when cleared or none was found.
     */
    setView(view?: ExcalidrawView | "auto" | "first" | "active" | null, show?: boolean): ExcalidrawView | null;
    /**
     * Returns the Excalidraw API for the current view.
     * @returns {ExcalidrawImperativeAPI} The Excalidraw API.
     */
    getExcalidrawAPI(): ExcalidrawImperativeAPI;
    /**
     * Gets elements in the current view.
     * @returns {readonly ExcalidrawElement[]} Array of elements in the view.
     */
    getViewElements(): readonly ExcalidrawElement[];
    /**
     * Deletes elements in the view by removing them from the scene (not by setting isDeleted to true).
     * @param {ExcalidrawElement[]} elToDelete - Array of elements to delete.
     * @returns {boolean} True if elements were deleted, false otherwise.
     */
    deleteViewElements(elToDelete: ExcalidrawElement[]): boolean;
    /**
     * Adds a back of the note card to the current active view.
     * @param {string} sectionTitle - The title of the section.
     * @param {boolean} [activate=true] - Whether to activate the new Embedded Element after creation.
     * @param {string} [sectionBody] - The body of the section.
     * @param {EmbeddableMDCustomProps} [embeddableCustomData] - Custom properties for the embeddable element.
     * @returns {Promise<string>} Promise resolving to the ID of the embeddable element.
     */
    addBackOfTheCardNoteToView(sectionTitle: string, activate?: boolean, sectionBody?: string, embeddableCustomData?: EmbeddableMDCustomProps): Promise<string>;
    /**
     * Gets the selected element in the view. If more are selected, gets the first.
     * @returns {ExcalidrawElement | null} The selected element or null if none selected.
     */
    getViewSelectedElement(): ExcalidrawElement | null;
    /**
     * Gets the selected elements in the view.
     * @param {boolean} [includeFrameChildren=true] - Whether to include frame children in the selection.
     * @returns {ExcalidrawElement[]} Array of selected elements.
     */
    getViewSelectedElements(includeFrameChildren?: boolean): ExcalidrawElement[];
    /**
     * Gets the file associated with an image element in the view.
     * @param {ExcalidrawElement} el - The image element.
     * @returns {TFile | null} The file associated with the image element or null if not found.
     */
    getViewFileForImageElement(el: ExcalidrawElement): TFile | null;
    /**
     * Returns the vault or external URI path for an image file identified by its Excalidraw fileId.
     *
     * Note: Excalidraw does not maintain a persistent index of fileIds to paths.
     * The `filesMaster` cache is populated at runtime as images appear in open drawings,
     * and is used to support copy/paste of image references between drawings without
     * duplicating files. This function will only return a path for images that have
     * been seen in a drawing during the current Obsidian session.
     *
     * @param {FileId} fileId - The Excalidraw fileId of the image.
     * @returns {string | null} The vault path of the image file, or null if not cached.
     */
    getPathForImageFileId(fileId: FileId): string | null;
    /**
     * Gets the color map associated with an image element in the view.
     * @param {ExcalidrawElement} el - The image element.
     * @returns {ColorMap} The color map associated with the image element.
     */
    getColorMapForImageElement(el: ExcalidrawElement): ColorMap;
    /**
     * Updates the color map of SVG images in the view.
     * @param {ExcalidrawImageElement | ExcalidrawImageElement[]} elements - The image elements to update.
     * @param {ColorMap | SVGColorInfo | ColorMap[] | SVGColorInfo[]} colors - The new color map(s) for the images.
     * @returns {Promise<void>} Promise resolving when the update is complete.
     */
    updateViewSVGImageColorMap(elements: ExcalidrawImageElement | ExcalidrawImageElement[], colors: ColorMap | SVGColorInfo | ColorMap[] | SVGColorInfo[]): Promise<void>;
    /**
     * Gets the SVG color information for an image element in the view.
     * @param {ExcalidrawElement} el - The image element.
     * @returns {Promise<SVGColorInfo>} Promise resolving to the SVG color information.
     */
    getSVGColorInfoForImgElement(el: ExcalidrawElement): Promise<SVGColorInfo>;
    /**
     * Gets the color information from an Excalidraw file.
     * @param {TFile} file - The Excalidraw file.
     * @param {ExcalidrawImageElement} img? - Optional, if not provided, the function returns colors from all elements.
     * @returns {Promise<SVGColorInfo>} Promise resolving to the SVG color information.
     */
    getColosFromExcalidrawFile(file: TFile, img?: ExcalidrawImageElement): Promise<SVGColorInfo>;
    /**
     * Extracts color information from an SVG string.
     * @param {string} svgString - The SVG string.
     * @returns {SVGColorInfo} The extracted color information.
     */
    getColorsFromSVGString(svgString: string): SVGColorInfo;
    /**
     * Copies existing scene elements to the workbench as mutable, identity-preserving copies.
     * The copies can be committed with `addElementsToView()` to update the original
     * scene elements, or used temporarily by another EA operation and discarded with
     * `clear()` without modifying the scene.
     * @param {ExcalidrawElement[]} elements - Array of elements to copy.
     * @param {boolean} [copyImages=false] - Whether to copy images as well.
     */
    copyViewElementsToEAforEditing(elements: readonly ExcalidrawElement[], copyImages?: boolean): void;
    /**
     * Toggles full screen mode for the target view.
     * @param {boolean} [forceViewMode=false] - Whether to force view mode.
     */
    viewToggleFullScreen(forceViewMode?: boolean): void;
    /**
     * Sets view mode enabled or disabled for the target view.
     * @param {boolean} enabled - Whether to enable view mode.
     */
    setViewModeEnabled(enabled: boolean): void;
    /**
     * Updates the scene in the target view.
     * @param {Object} scene - The scene to load to Excalidraw.
     * @param {ExcalidrawElement[]} [scene.elements] - Array of elements in the scene.
     * @param {AppState} [scene.appState] - The app state of the scene.
     * @param {BinaryFiles} [scene.files] - The files in the scene.
     * @param {boolean} [scene.commitToHistory] - Deprecated: Use scene.storageOption instead.
     * @param {"capture" | "none" | "update"} [scene.storeAction] - Deprecated: Use scene.storageOption instead
     * @param {"IMMEDIATELY" | "NEVER" | "EVENTUALLY"} [scene.captureUpdate] - The capture update action for the scene.
     * @param {boolean} [restore=false] - Whether to restore legacy elements in the scene.
     */
    viewUpdateScene(scene: {
        elements?: ExcalidrawElement[];
        appState?: AppState | object;
        files?: BinaryFiles;
        commitToHistory?: boolean;
        storeAction?: "capture" | "none" | "update";
        captureUpdate?: SceneData["captureUpdate"];
    }, restore?: boolean): void;
    /**
     * Connects an object to the selected element in the view.
     * @param {string} objectA - The ID of the first object.
     * @param {ConnectionPoint | null} connectionA - The connection point on the first object.
     * @param {ConnectionPoint | null} connectionB - The connection point on the selected element.
     * @param {Object} [formatting] - Formatting options for the arrow.
     * @param {number} [formatting.numberOfPoints=0] - The number of points on the arrow.
     * @param {"arrow"|"bar"|"circle"|"circle_outline"|"triangle"|"triangle_outline"|"diamond"|"diamond_outline"|null} [formatting.startArrowHead] - The start arrowhead type.
     * @param {"arrow"|"bar"|"circle"|"circle_outline"|"triangle"|"triangle_outline"|"diamond"|"diamond_outline"|null} [formatting.endArrowHead] - The end arrowhead type.
     * @param {number} [formatting.padding=10] - The padding around the arrow.
     * @returns {boolean} True if the connection was successful, false otherwise.
     */
    connectObjectWithViewSelectedElement(objectA: string, connectionA: ConnectionPoint | null, connectionB: ConnectionPoint | null, formatting?: {
        numberOfPoints?: number;
        startArrowHead?: "arrow" | "bar" | "circle" | "circle_outline" | "triangle" | "triangle_outline" | "diamond" | "diamond_outline" | null;
        endArrowHead?: "arrow" | "bar" | "circle" | "circle_outline" | "triangle" | "triangle_outline" | "diamond" | "diamond_outline" | null;
        padding?: number;
    }): boolean;
    /**
     * Zooms the target view to fit the specified elements.
     * @param {boolean} selectElements - Whether to select the elements after zooming.
     * @param {ExcalidrawElement[]} elements - Array of elements to zoom to.
     * @param {number} [margin=0.05] - The margin around the elements when zooming.
     */
    viewZoomToElements(selectElements: boolean, elements: ExcalidrawElement[], margin?: number): void;
    /**
     * Adds elements from elementsDict to the current view.
     * @param {boolean} [repositionToCursor=false] - Whether to reposition the elements to the cursor.
     * @param {boolean} [save=true] - Whether to save the changes.
     * @param {boolean} [newElementsOnTop=false] - Whether to add new elements on top of existing elements.
     * @param {boolean} [shouldRestoreElements=false] - Whether to restore legacy elements in the scene.
     * @returns {Promise<boolean>} Promise resolving to true if elements were added, false otherwise.
     */
    addElementsToView(repositionToCursor?: boolean, save?: boolean, newElementsOnTop?: boolean, shouldRestoreElements?: boolean, captureUpdate?: CaptureUpdateActionType): Promise<boolean>;
    /**
     * Registers this instance of EA to use for hooks with the target view.
     * By default, ExcalidrawViews will check window.ExcalidrawAutomate for event hooks.
     * Using this method, you can set a different instance of Excalidraw Automate for hooks.
     * @returns {boolean} True if successful, false otherwise.
     */
    registerThisAsViewEA(): boolean;
    /**
     * Sets the target view EA to window.ExcalidrawAutomate.
     * @returns {boolean} True if successful, false otherwise.
     */
    deregisterThisAsViewEA(): boolean;
    /**
     * Registers a provider of custom action buttons for the selected-element
     * context menu (the small toolbar shown above a single selected element).
     * `getActions` is called with the currently selected element whenever the
     * selection, element type, fileId, or customData changes, and should
     * return the buttons to show for that element (an empty array shows
     * nothing). The menu is temporarily hidden while the selected frame's
     * title is being edited, so custom actions do not obstruct the title editor.
     * Registration is tied to the current view: it is automatically
     * cleared when the view closes, and cleared for this script specifically
     * if the script's file is deleted while the view is still open. Calling
     * this a second time for the same script in the same view (e.g. running
     * the script again while it is already registered) does not create a
     * duplicate registration - it logs a message and returns null instead.
     * @param getActions - Given the selected element, returns the action
     * buttons to display, or an empty array to show none.
     * @returns A cleanup function that unregisters the provider, or null if
     * there is no active target view to register against, or if this script
     * has already registered a provider in this view.
     */
    registerElementActionProvider(getActions: (element: ExcalidrawElement) => readonly SelectedElementMenuAction[]): (() => void) | null;
    /**
     * Requests permission for the active script to be automatically re-run
     * every time a new Excalidraw view is opened (see
     * `ScriptEngine.runAutostartScripts()`). The first time a given script
     * calls this, the user is prompted to Allow, Deny, or decide later; the
     * decision persists in plugin settings (viewable/editable via the
     * "Autostart scripts" command and settings section) and is not asked
     * again unless the user changes it or previously picked "Ask me later".
     * A fresh "allow" also immediately re-runs the script in every other
     * currently-open Excalidraw view, so it attaches everywhere right away
     * instead of only the next time each view is opened.
     * @param {string} [message] - Optional script-provided explanation displayed as the second paragraph of the permission prompt.
     * @returns "allow" if the script is permitted to autostart, "deny" if
     * the user has denied it, or "pending" if there is no active script or
     * the user has not yet made a decision.
     */
    registerAutostart(message?: string): Promise<"allow" | "deny" | "pending">;
    /**
     * If set, this callback is triggered when the user closes an Excalidraw view.
     */
    onViewUnloadHook: (view: ExcalidrawView) => void;
    /**
     * If set, this callback is triggered, when the user changes the view mode.
     * You can use this callback in case you want to do something additional when the user switches to view mode and back.
     */
    onViewModeChangeHook: (isViewModeEnabled: boolean, view: ExcalidrawView, ea: ExcalidrawAutomate) => void;
    /**
     * If set, this callback is triggered, when the user hovers a link in the scene.
     * You can use this callback in case you want to do something additional when the onLinkHover event occurs.
     * This callback must return a boolean value.
     * In case you want to prevent the excalidraw onLinkHover action you must return false, it will stop the native excalidraw onLinkHover management flow.
     */
    onLinkHoverHook: (element: ExcalidrawElement, linkText: string, view: ExcalidrawView, ea: ExcalidrawAutomate) => boolean;
    /**
     * If set, this callback is triggered, when the user clicks a link in the scene.
     * You can use this callback in case you want to do something additional when the onLinkClick event occurs.
     * This callback must return a boolean value.
     * In case you want to prevent the excalidraw onLinkClick action you must return false, it will stop the native excalidraw onLinkClick management flow.
     */
    onLinkClickHook: (element: ExcalidrawElement, linkText: string, event: MouseEvent, view: ExcalidrawView, ea: ExcalidrawAutomate) => boolean;
    /**
     * If set, this callback is triggered, when Excalidraw receives an onDrop event.
     * You can use this callback in case you want to do something additional when the onDrop event occurs.
     * This callback must return a boolean value.
     * In case you want to prevent the excalidraw onDrop action you must return false, it will stop the native excalidraw onDrop management flow.
     */
    onDropHook: (data: {
        ea: ExcalidrawAutomate;
        event: React.DragEvent<HTMLDivElement>;
        draggable: ObsidianDraggable;
        type: "file" | "text" | "unknown";
        payload: {
            files: TFile[];
            text: string;
        };
        excalidrawFile: TFile;
        view: ExcalidrawView;
        pointerPosition: {
            x: number;
            y: number;
        };
    }) => boolean;
    /**
     * If set, this callback is triggered, when Excalidraw receives an onPaste event.
     * You can use this callback in case you want to do something additional when the
     * onPaste event occurs.
     * This callback must return a boolean value.
     * In case you want to prevent the excalidraw onPaste action you must return false,
     * it will stop the native excalidraw onPaste management flow.
     */
    onPasteHook: (data: {
        ea: ExcalidrawAutomate;
        payload: ClipboardData;
        event: ClipboardEvent;
        excalidrawFile: TFile;
        view: ExcalidrawView;
        pointerPosition: {
            x: number;
            y: number;
        };
    }) => boolean;
    /**
     * If set, this callback is triggered when a image is being saved in Excalidraw.
     * You can use this callback to customize the naming and path of pasted images to avoid
     * default names like "Pasted image 123147170.png" being saved in the attachments folder,
     * and instead use more meaningful names based on the Excalidraw file or other criteria,
     * plus save the image in a different folder.
     *
     * If the function returns null or undefined, the normal Excalidraw operation will continue
     * with the excalidraw generated name and default path.
     * If a filepath is returned, that will be used. Include the full Vault filepath and filename
     * with the file extension.
     * The currentImageName is the name of the image generated by excalidraw or provided during paste.
     *
     * @param data - An object containing the following properties:
     *   @property {string} [currentImageName] - Default name for the image.
     *   @property {string} drawingFilePath - The file path of the Excalidraw file where the image is being used.
     *
     * @returns {string} - The new filepath for the image including full vault path and extension.
     *
     * Example usage:
     * ```
     * onImageFilePathHook: (data) => {
     *   const { currentImageName, drawingFilePath } = data;
     *   // Generate a new filepath based on the drawing file name and other criteria
     *   const ext = currentImageName.split('.').pop();
     *   return `${drawingFileName} - ${currentImageName || 'image'}.${ext}`;
     * }
     * ```
     */
    onImageFilePathHook: (data: {
        currentImageName: string;
        drawingFilePath: string;
    }) => string | null;
    /**
     * If set, this callback is triggered when the Excalidraw image is being exported to
     * .svg, .png, or .excalidraw.
     * You can use this callback to customize the naming and path of the images. This allows
     * you to place images into an assets folder.
     *
     * If the function returns null or undefined, the normal Excalidraw operation will continue
     * with the currentImageName and in the same folder as the Excalidraw file
     * If a filepath is returned, that will be used. Include the full Vault filepath and filename
     * with the file extension.
     * If the new folder path does not exist, excalidraw will create it - you don't need to worry about that.
     * ⚠️⚠️If an image already exists on the path, that will be overwritten. When returning
     * your own image path, you must take care of unique filenames (if that is a requirement) ⚠️⚠️
     * The current image name is the name generated by Excalidraw:
     * - my-drawing.png
     * - my-drawing.svg
     * - my-drawing.excalidraw
     * - my-drawing.dark.svg
     * - my-drawing.light.svg
     * - my-drawing.dark.png
     * - my-drawing.light.png
     *
     * @param data - An object containing the following properties:
     *   @property {string} exportFilepath - Default export filepath for the image.
     *   @property {string} exportExtension - The file extension of the export (e.g., .dark.svg, .png, .excalidraw).
     *   @property {string} excalidrawFile - TFile: The Excalidraw file being exported.
     *   @property {string} oldExcalidrawPath - If action === "move" The old path of the Excalidraw file, else undefined
     *   @property {string} action - The action being performed: "export", "move", or "delete". move and delete reference the change to the Excalidraw file.
     *
     * @returns {string} - The new filepath for the image including full vault path and extension.
     *
     * Example usage:
     * ```
     * onImageFilePathHook: (data) => {
     *   const { currentImageName, drawingFilePath, frontmatter } = data;
     *   // Generate a new filepath based on the drawing file name and other criteria
     *   const ext = currentImageName.split('.').pop();
     *   if(frontmatter && frontmatter["my-custom-field"]) {
     *   }
     *   return `${drawingFileName} - ${currentImageName || 'image'}.${ext}`;
     * }
     * ```
     */
    onImageExportPathHook: (data: {
        exportFilepath: string;
        exportExtension: string;
        excalidrawFile: TFile;
        oldExcalidrawPath?: string;
        action: "export" | "move" | "delete";
    }) => string | null;
    /**
     * Excalidraw supports auto-export of Excalidraw files to .png, .svg, and .excalidraw formats.
     *
     * Auto-export of Excalidraw files can be controlled at multiple levels.
     * 1) In plugin settings where you can set up default auto-export applicable to all your Excalidraw files.
     * 2) However, if you do not want to auto-export every file, you can also control auto-export
     *    at the file level using the 'excalidraw-autoexport' frontmatter property.
     * 3) This hook gives you an additional layer of control over the auto-export process.
     *
     * This hook is triggered when an Excalidraw file is being saved.
     *
     * interface AutoexportConfig {
     *   png: boolean; // Whether to auto-export to PNG
     *   svg: boolean; // Whether to auto-export to SVG
     *   excalidraw: boolean; // Whether to auto-export to Excalidraw format
     *   theme: "light" | "dark" | "both"; // The theme to use for the export
     * }
     *
     * @param {Object} data - The data for the hook.
     * @param {AutoexportConfig} data.autoexportConfig - The current autoexport configuration.
     * @param {TFile} data.excalidrawFile - The Excalidraw file being auto-exported.
     * @returns {AutoexportConfig | null} - Return a modified AutoexportConfig to override the export behavior, or null to use the default.
     */
    onTriggerAutoexportHook: (data: {
        autoexportConfig: AutoexportConfig;
        excalidrawFile: TFile;
    }) => AutoexportConfig | null;
    /**
     * If set, this callback is triggered when the scene changes in the target view.
     * You can use this to react to appState or element changes.
     * Any script can sign up for updates via this hook.
     * Because this hook fires extremely frequently (on every mouse move during drawing),
     * you MUST specify which appState keys you are interested in OR set trackElements to true.
     * If trackElements is falsy and appStateKeys is empty or undefined, the callback will NOT be triggered to prevent performance issues.
     * For sidepanel tabs, there is an additional filter feature: if triggerWhenInvisible is false,
     * the callback will only trigger when the sidepanel is visible and the tab is active.
     */
    onSceneChangeHook: {
        appStateKeys?: (keyof AppState)[];
        trackElements?: boolean;
        triggerWhenInvisible?: boolean;
        callback: (elements: readonly ExcalidrawElement[], appState: AppState, files: BinaryFiles, view: ExcalidrawView, ea: ExcalidrawAutomate) => void;
    } | null;
    /**
     * if set, this callback is triggered, when an Excalidraw file is opened
     * You can use this callback in case you want to do something additional when the file is opened.
     * This will run before the file level script defined in the `excalidraw-onload-script` frontmatter.
     */
    onFileOpenHook: (data: {
        ea: ExcalidrawAutomate;
        excalidrawFile: TFile;
        view: ExcalidrawView;
    }) => Promise<void>;
    /**
     * if set, this callback is triggered, when an Excalidraw file is created
     * see also: https://github.com/zsviczian/obsidian-excalidraw-plugin/issues/1124
     */
    onFileCreateHook: (data: {
        ea: ExcalidrawAutomate;
        excalidrawFile: TFile;
        view: ExcalidrawView;
    }) => Promise<void>;
    /**
     * If set, this callback is triggered whenever the active canvas color changes.
     * @param {ExcalidrawAutomate} ea - The ExcalidrawAutomate instance.
     * @param {ExcalidrawView} view - The Excalidraw view.
     * @param {string} color - The new canvas color.
     */
    onCanvasColorChangeHook: (ea: ExcalidrawAutomate, view: ExcalidrawView, //the excalidraw view
    color: string) => void;
    /**
     * If set, this callback is triggered whenever a drawing is exported to SVG.
     * The string returned will replace the link in the exported SVG.
     * The hook is only executed if the link is to a file internal to Obsidian.
     * @param {Object} data - The data for the hook.
     * @param {string} data.originalLink - The original link in the SVG.
     * @param {string} data.obsidianLink - The Obsidian link in the SVG.
     * @param {TFile | null} data.linkedFile - The linked file in Obsidian.
     * @param {TFile} data.hostFile - The host file in Obsidian.
     * @returns {string} The updated link for the SVG.
     */
    onUpdateElementLinkForExportHook: (data: {
        originalLink: string;
        obsidianLink: string;
        linkedFile: TFile | null;
        hostFile: TFile;
    }) => string;
    /**
     * Utility function to generate EmbeddedFilesLoader object.
     * @param {boolean} [isDark] - Whether to use dark mode.
     * @returns {EmbeddedFilesLoader} The EmbeddedFilesLoader object.
     */
    getEmbeddedFilesLoader(isDark?: boolean): EmbeddedFilesLoader;
    /**
     * Utility function to generate ExportSettings object.
     * @param {boolean} withBackground - Whether to include the background in the export.
     * @param {boolean} withTheme - Whether to include the theme in the export.
     * @param {boolean} [isMask=false] - Whether the export is a mask.
     * @returns {ExportSettings} The ExportSettings object.
     */
    getExportSettings(withBackground: boolean, withTheme: boolean, isMask?: boolean): ExportSettings;
    /**
     * Gets elements whose rendered bounds intersect a scene area.
     *
     * @param elements - Elements to test, in scene stacking order.
     * @param area - Rectangle or element defining the scene area.
     * @param options - Optional margin, marker-frame, and binding expansion rules.
     * @returns Intersecting elements in their original stacking order.
     */
    getElementsInArea(elements: readonly ExcalidrawElement[], area: SceneArea, options?: ElementsInAreaOptions): ExcalidrawElement[];
    /**
     * Gets elements whose rendered bounds intersect a scene area.
     *
     * @remarks
     * This explicit name is preferred for new code. `getElementsInArea()` remains
     * available as a backward-compatible alias and uses the same implementation.
     *
     * @param elements - Elements to test, in scene stacking order.
     * @param area - Rectangle or element defining the scene area.
     * @param options - Optional margin, marker-frame, and binding expansion rules.
     * @returns Intersecting elements in their original stacking order.
     */
    getElementsIntersectionArea(elements: readonly ExcalidrawElement[], area: SceneArea, options?: ElementsInAreaOptions): ExcalidrawElement[];
    /**
     * Gets the bounding box of the specified elements.
     * The bounding box is the box encapsulating all of the elements completely.
     * @param {ExcalidrawElement[]} elements - Array of elements to get the bounding box for.
     * @returns {{topX: number; topY: number; width: number; height: number}} The bounding box of the elements.
     */
    getBoundingBox(elements: readonly ExcalidrawElement[]): {
        topX: number;
        topY: number;
        width: number;
        height: number;
    };
    /**
     * Gets elements grouped by the highest level groups.
     * @param {ExcalidrawElement[]} elements - Array of elements to group.
     * @returns {ExcalidrawElement[][]} Array of arrays of grouped elements.
     */
    getMaximumGroups(elements: ExcalidrawElement[]): ExcalidrawElement[][];
    /**
     * Gets the largest element from a group.
     * Useful when a text element is grouped with a box, and you want to connect an arrow to the box.
     * @param {ExcalidrawElement[]} elements - Array of elements in the group.
     * @returns {ExcalidrawElement} The largest element in the group.
     */
    getLargestElement(elements: ExcalidrawElement[]): ExcalidrawElement;
    /**
     * Intersects an element with a line.
     * @param {ExcalidrawBindableElement} element - The element to intersect.
     * @param {readonly [number, number]} a - The start point of the line.
     * @param {readonly [number, number]} b - The end point of the line.
     * @param {number} [gap] - The gap between the element and the line.
     * @returns {Point[]} Array of intersection points (2 or 0).
     */
    intersectElementWithLine(element: ExcalidrawBindableElement, a: readonly [
        number,
        number
    ], b: readonly [
        number,
        number
    ], gap?: number): Point[];
    /**
     * Gets the groupId for the group that contains all the elements, or null if such a group does not exist.
     * @param {ExcalidrawElement[]} elements - Array of elements to check.
     * @returns {string | null} The groupId or null if not found.
     */
    getCommonGroupForElements(elements: ExcalidrawElement[]): string;
    /**
     * This is a convenience method to get the release notes for the plugin.
     * @returns {Object} The release notes object.
     */
    getReleaseNotes(): {
        [k: string]: string;
    };
    /**
     * Gets all the elements from elements[] that share one or more groupIds with the specified element.
     * @param {ExcalidrawElement} element - The element to check.
     * @param {ExcalidrawElement[]} elements - Array of elements to search.
     * @param {boolean} [includeFrameElements=false] - Whether to include frame elements in the search.
     * @returns {ExcalidrawElement[]} Array of elements in the same group as the specified element.
     */
    getElementsInTheSameGroupWithElement(element: ExcalidrawElement, elements: readonly ExcalidrawElement[], includeFrameElements?: boolean): ExcalidrawElement[];
    /**
     * Gets all the elements from elements[] that are contained in the specified frame.
     * @param {ExcalidrawElement} frameElement - The frame element.
     * @param {ExcalidrawElement[]} elements - Array of elements to search.
     * @param {boolean} [shouldIncludeFrame=false] - Whether to include the frame element in the result.
     * @returns {ExcalidrawElement[]} Array of elements contained in the frame.
     */
    getElementsInFrame(frameElement: ExcalidrawElement, elements: readonly ExcalidrawElement[], shouldIncludeFrame?: boolean): ExcalidrawElement[];
    /**
     * Sets the active script for the ScriptEngine.
     * @param {string} scriptName - The name of the active script.
     */
    activeScript: string;
    /**
     * Gets the script settings for the active script.
     * Saves settings in plugin settings, under the activeScript key.
     * @returns {Object} The script settings.
     */
    getScriptSettings(): object;
    /**
     * Sets the script settings for the active script.
     * @param {Object} settings - The script settings to set.
     * @returns {Promise<void>} Promise resolving when the settings are saved.
     */
    setScriptSettings(settings: Record<string, unknown>): Promise<void>;
    setScriptSettingValue(key: string, value: ScriptSettingValue): void;
    getScriptSettingValue(key: string, defaultValue: ScriptSettingValue): ScriptSettingValue;
    saveScriptSettings(): Promise<void>;
    /**
     * Opens a file in a new workspace leaf or reuses an existing adjacent leaf depending on Excalidraw Plugin Settings.
     * @param {TFile} file - The file to open.
     * @param {OpenViewState} [openState] - The open state for the file.
     * @returns {WorkspaceLeaf} The new or adjacent workspace leaf.
     */
    openFileInNewOrAdjacentLeaf(file: TFile, openState?: OpenViewState): WorkspaceLeaf;
    /**
     * Measures the size of the specified text based on current style settings.
     * @param {string} text - The text to measure.
     * @returns {{width: number; height: number}} The width and height of the text.
     */
    measureText(text: string): {
        width: number;
        height: number;
    };
    /**
     * Returns the size of the image element at 100% (i.e. the original size), or undefined if the data URL is not available.
     * @param {ExcalidrawImageElement} imageElement - The image element from the active scene on targetView.
     * @param {boolean} [shouldWaitForImage=false] - Whether to wait for the image to load before returning the size.
     * @returns {Promise<{width: number; height: number}>} Promise resolving to the original size of the image.
     */
    getOriginalImageSize(imageElement: ExcalidrawImageElement, shouldWaitForImage?: boolean): Promise<{
        width: number;
        height: number;
    }>;
    /**
     * Resets the image to its original aspect ratio.
     * If the image is resized then the function returns true.
     * If the image element is not in EA (only in the view), then if image is resized, the element is copied to EA for Editing using copyViewElementsToEAforEditing([imgEl]).
     * Note you need to run await ea.addElementsToView(false); to add the modified image to the view.
     * @param {ExcalidrawImageElement} imgEl - The EA image element to be resized.
     * @returns {Promise<boolean>} Promise resolving to true if the image was changed, false otherwise.
     */
    resetImageAspectRatio(imgEl: ExcalidrawImageElement): Promise<boolean>;
    /**
     * Verifies if the plugin version is greater than or equal to the required version.
     * Excample usage in a script: if (!ea.verifyMinimumPluginVersion("1.5.20")) { console.error("Please update the Excalidraw Plugin to the latest version."); return; }
     * @param {string} requiredVersion - The required plugin version.
     * @returns {boolean} True if the plugin version is greater than or equal to the required version, false otherwise.
     */
    verifyMinimumPluginVersion(requiredVersion: string): boolean;
    /**
     * Checks if the provided view is an instance of ExcalidrawView.
     * @param {ExcalidrawView | null | undefined} view - The view to check.
     * @returns {boolean} True if the view is an instance of ExcalidrawView, false otherwise.
     */
    isExcalidrawView(view: ExcalidrawView | null | undefined): boolean;
    /**
     * Sets the selection in the view.
     * @param {ExcalidrawElement[] | string[]} elements - Array of elements or element IDs to select.
     */
    selectElementsInView(elements: ExcalidrawElement[] | string[]): void;
    /**
     * Generates a random 8-character long element ID.
     * @returns {string} The generated element ID.
     */
    generateElementId(): string;
    /**
     * Clones the specified element with a new ID for insertion as a genuine duplicate.
     * Do not use this to edit an existing scene element; use
     * `copyViewElementsToEAforEditing()` and retrieve the workbench copy by its
     * original ID instead.
     * @param {ExcalidrawElement} element - The element to clone.
     * @returns {ExcalidrawElement} The cloned element with a new ID.
     */
    cloneElement(element: ExcalidrawElement): ExcalidrawElement;
    /**
     * Clones an array of Excalidraw elements or a clipboard string.
     * Ensures that relationships (containers, bound elements, groups, bindings)
     * are correctly remapped to the newly generated IDs.
     *
     * @param {ExcalidrawElement[] | string} elementsOrClipboard - The elements array or Excalidraw clipboard string.
     * @returns {ExcalidrawElement[]} An array of cloned elements with new IDs and updated relationships.
     */
    cloneElements(elementsOrClipboard: ExcalidrawElement[] | string): ExcalidrawElement[];
    /**
     * Moves the specified element to a specific position in the z-index.
     * * Operates directly on the Excalidraw Scene in targetView, not through ExcalidrawAutomate elements.
     * @param {string} elementId - The ID of the element to move.
     * @param {number} newZIndex - The new z-index position for the element.
     */
    moveViewElementToZIndex(elementId: string, newZIndex: number): void;
    /**
     * Converts a hex color string to an RGB array.
     * @deprecated Use getCM / ColorMaster instead.
     * @param {string} color - The hex color string.
     * @returns {number[]} The RGB array.
     */
    hexStringToRgb(color: string): number[];
    /**
     * Converts an RGB array to a hex color string.
     * @deprecated Use getCM / ColorMaster instead.
     * @param {number[]} color - The RGB array.
     * @returns {string} The hex color string.
     */
    rgbToHexString(color: number[]): string;
    /**
     * Converts an HSL array to an RGB array.
     * @deprecated Use getCM / ColorMaster instead.
     * @param {number[]} color - The HSL array.
     * @returns {number[]} The RGB array.
     */
    hslToRgb(color: number[]): number[];
    /**
     * Converts an RGB array to an HSL array.
     * @deprecated Use getCM / ColorMaster instead.
     * @param {number[]} color - The RGB array.
     * @returns {number[]} The HSL array.
     */
    rgbToHsl(color: number[]): number[];
    /**
     * Converts a color name to a hex color string.
     * @param {string} color - The color name.
     * @returns {string} The hex color string.
     */
    colorNameToHex(color: string): string;
    /**
     * Creates a ColorMaster object for manipulating colors.
     * @param {TInput} color - The color input.
     * @returns {ColorMaster} The ColorMaster object.
     */
    getCM(color: TInput): ColorMaster;
    /**
     * Get color palette for scene. If no palette is found, returns default Excalidraw color palette.
     * @param {("canvasBackground"|"elementBackground"|"elementStroke")} palette - The palette type.
     * @returns {([string, string, string, string, string][] | string[])} The color palette.
     */
    getViewColorPalette(palette: "canvasBackground" | "elementBackground" | "elementStroke"): (string[] | string)[];
    /**
     * Opens a palette popover anchored to the provided element and resolves with the selected color.
     * @param {HTMLElement} anchorElement - The element to anchor the popover to.
     * @param {"canvasBackground"|"elementBackground"|"elementStroke"} palette - Which palette to show.
     * @param {boolean} [includeSceneColors=true] - Whether to include scene stroke/background colors in the palette.
     * @returns {Promise<string|null>} Selected color or null if cancelled.
     * example usage:
     * const selected = await ea.showColorPicker(button.buttonEl, "elementStroke");
     * if(selected) {
     *   console.log("User selected color: " + selected);
     * } else {
     *   console.log("User cancelled color selection");
     * }
     */
    showColorPicker(anchorElement: HTMLElement, palette: "canvasBackground" | "elementBackground" | "elementStroke", includeSceneColors?: boolean): Promise<string | null>;
    /**
     * Gets the PolyBool class from https://github.com/velipso/polybooljs.
     * @returns {PolyBool} The PolyBool class.
     */
    getPolyBool(): typeof PolyBool;
    /**
     * Imports an SVG string into ExcalidrawAutomate elements.
     * @param {string} svgString - The SVG string to import.
     * @returns {boolean} True if the import was successful, false otherwise.
     */
    importSVG(svgString: string): boolean;
    /**
     * Returns CodeMirror 6 constructor classes and utilities for creating advanced embedded editors.
     * Includes EditorView, EditorState, keymap, history, LRLanguage, Tree, and NodeType.
     * Useful when building custom sidepanels or modals that require rich text editing features.
     * @returns {Object} An object containing CodeMirror 6 and Lezer classes/functions.
     */
    getCM6(): {
        EditorView: typeof EditorView;
        EditorState: typeof EditorState;
        keymap: typeof keymap;
        defaultKeymap: typeof defaultKeymap;
        history: typeof history;
        historyKeymap: typeof historyKeymap;
        LRLanguage: typeof LRLanguage;
    };
    /**
     * Returns the pre-configured CodeMirror 6 extensions used by Excalidraw's native LaTeX editor.
     * Includes the internal math parser required to trick 'obsidian-latex-suite' into thinking
     * it is operating inside a math block, along with standard history and default keymaps.
     * @returns { (LRLanguage | Extension)[]} An array of CodeMirror 6 extensions ready to be passed to EditorState.create().
     */
    getMathEditorExtensions(): (LRLanguage | Extension)[];
    /**
     * Destroys this EA once, first releasing registered external resources and
     * then clearing the ordinary EA state and references.
     */
    destroy(): void;
}
type MutableElementMapEntry = Mutable<ExcalidrawElement> & Record<string, unknown>;
type ExcalidrawAutomateHelpTarget = ((...args: unknown[]) => unknown) | string;
export {};
