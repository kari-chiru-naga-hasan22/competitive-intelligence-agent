import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === "") {
      const err = new Error("GEMINI_API_KEY is not configured");
      (err as { code?: string }).code = "GEMINI_UNAVAILABLE";
      throw err;
    }

    client = new GoogleGenAI({
      apiKey: apiKey.trim(),
    });
  }

  return client;
}

export function getGeminiModel(): string {
  return process.env.GEMINI_MODEL?.trim() || "gemini-2.0-flash";
}

export async function generateGeminiContent(contents: string, options?: { responseMimeType?: string }) {
  const ai = getGeminiClient();
  const model = getGeminiModel();

  try {
    console.log(`[Gemini] Generating content with configured model: ${model}`);

    const config: Record<string, unknown> = {};
    if (options?.responseMimeType) {
      config.responseMimeType = options.responseMimeType;
    }

    const response = await ai.models.generateContent({
      model,
      contents,
      config: Object.keys(config).length > 0 ? config : undefined,
    });

    return response;
  } catch (error) {
    console.error(`[Gemini] Generation failed with model ${model}:`, error instanceof Error ? error.message : error);
    const failureErr = error instanceof Error ? error : new Error(`Gemini model ${model} failed`);
    (failureErr as { code?: string }).code = "GEMINI_UNAVAILABLE";
    throw failureErr;
  }
}

/**
 * Robust JSON extraction helper that parses JSON objects even when surrounded by markdown fences or conversational preambles
 */
export function extractJsonObject<T = unknown>(raw: string): T {
  if (!raw || typeof raw !== "string") {
    throw new Error("Empty or non-string response to extract JSON from");
  }

  const trimmed = raw.trim();

  // Try direct parse first
  try {
    return JSON.parse(trimmed);
  } catch {
    // Continue to regex extraction
  }

  // Match outermost curly braces
  const match = trimmed.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("No JSON object found in response");
  }

  try {
    return JSON.parse(match[0]);
  } catch (err) {
    throw new Error(`Failed to parse extracted JSON object: ${err instanceof Error ? err.message : String(err)}`);
  }
}