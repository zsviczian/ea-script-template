// Generated scripting API. No plugin implementation declarations.
import type { AIRequestMessage } from "../types/AIUtilTypes";
import type { AIRequestMessagePart } from "../types/AIUtilTypes";
import type { AIRequest } from "../types/AIUtilTypes";
import type { RequestUrlResponse } from "obsidian";
export type AIChatSession = {
    getMessages: () => AIRequestMessage[];
    reset: () => void;
    send: (message: string | AIRequestMessage | AIRequestMessagePart[], requestOverrides?: Omit<AIRequest, "messages">) => Promise<GenerateAITextResult>;
};
type GenerateAITextResult = {
    response: RequestUrlResponse;
    json: Record<string, unknown>;
    content: string;
    rateLimit: number | null;
    rateLimitRemaining: number | null;
};
export type GenerateAIImageResult = {
    response: RequestUrlResponse;
    json: Record<string, unknown>;
    images: AIGeneratedImage[];
    firstImage: AIGeneratedImage | null;
    revisedPrompt: string;
};
export type AIGeneratedImage = {
    url?: string;
    b64_json?: string;
    dataURL?: string;
    mimeType?: string;
    revisedPrompt?: string;
};
export {};
