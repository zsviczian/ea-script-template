// Generated scripting API. No plugin implementation declarations.
export type AIUsageData = {
    textModels: Record<string, AITextUsageEntry>;
    imageModels: Record<string, AIImageUsageEntry>;
    totalInputTokens: number;
    totalOutputTokens: number;
    totalImageGenerations: number;
};
export type AIImageUsageEntry = {
    generations: number;
};
export type AITextUsageEntry = {
    inputTokens: number;
    outputTokens: number;
};
export type AIRequestMessagePart = {
    type: "text";
    text: string;
} | {
    type: "image";
    image: AIImageInput;
} | {
    type: "file";
    file: AIFileInput;
} | {
    type: "audio";
    audio: AIFileInput;
};
export type AIFileInput = string | {
    url: string;
    filename?: string;
    mimeType?: string;
} | {
    dataURL: string;
    filename?: string;
    mimeType?: string;
};
export type AIImageInput = string | {
    url: string;
    detail?: "low" | "high" | "auto";
    filename?: string;
    mimeType?: string;
} | {
    dataURL: string;
    detail?: "low" | "high" | "auto";
    filename?: string;
    mimeType?: string;
};
export type AIRequestMessage = {
    role: "system" | "user" | "assistant";
    content: string | AIRequestMessagePart[];
};
export type ExcalidrawAISettings = {
    enabled: boolean;
    providerProfiles: Record<string, {
        provider: AIProvider;
        baseURL: string;
        hasApiKey: boolean;
    }>;
    textModels: Record<string, AIModelConfig>;
    imageModels: Record<string, AIImageModelConfig>;
    defaultTextModel: string;
    defaultMultimodalTextModel: string;
    defaultImageModel: string;
    defaultMaxOutgoingTokens: number;
    defaultMaxResponseTokens: number;
};
export type AIImageModelConfig = AIModelConfig & AIImageModelCapability;
export type AIImageModelCapability = {
    supportedSizes: string[];
    supportsPromptImageTransforms: boolean;
    supportsMaskImageEdits: boolean;
};
export type AIModelConfig = {
    providerId: string;
    model: string;
    endpoint?: string;
    multimodalSupport?: boolean;
};
export type AIProvider = "openai" | "anthropic" | "google" | "xai" | "openai-compatible";
export type AIRequest = {
    provider?: AIProvider;
    baseURL?: string;
    apiKey?: string;
    model?: string;
    textModelId?: string;
    imageModelId?: string;
    image?: AIImageInput;
    text?: string;
    instruction?: string;
    systemPrompt?: string;
    messages?: AIRequestMessage[];
    temperature?: number;
    maxOutgoingTokens?: number;
    maxTokens?: number;
    imageGenerationProperties?: {
        size?: string;
        quality?: "standard" | "hd";
        n?: number;
        mask?: AIImageInput;
    };
};
export {};
