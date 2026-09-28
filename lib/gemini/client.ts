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

export function formatGeminiErrorMessage(error: unknown): string {
  if (!error) return "Unknown AI service error";
  const raw = error instanceof Error ? error.message : String(error);

  try {
    const parsed = typeof raw === "string" && raw.startsWith("{") ? JSON.parse(raw) : null;
    if (parsed?.error) {
      const code = parsed.error.code;
      const status = parsed.error.status;
      const message = parsed.error.message;

      if (code === 503 || status === "UNAVAILABLE") {
        return "The AI reasoning model is currently experiencing high demand. Please try again in a moment.";
      }
      if (code === 429 || status === "RESOURCE_EXHAUSTED") {
        return "API rate limit reached. Please wait a few seconds and try again.";
      }
      if (message) {
        return message;
      }
    }
  } catch {
    // ignore json parse error
  }

  if (raw.includes("503") || raw.includes("high demand") || raw.includes("UNAVAILABLE")) {
    return "The AI reasoning model is currently experiencing high demand. Please try again in a moment.";
  }
  if (raw.includes("429") || raw.includes("quota") || raw.includes("RESOURCE_EXHAUSTED")) {
    return "API rate limit reached. Please wait a few seconds and try again.";
  }

  return raw;
}

export async function generateGeminiContent(contents: string) {
  const ai = getGeminiClient();
  const model = getGeminiModel();

  // Prioritize active models with available quota and high throughput
  const models = [
    "gemini-3.1-flash-lite-preview",
    "gemini-3.6-flash",
    "gemini-3.1-flash-lite",
    "gemma-4-26b-a4b-it",
    "gemini-3.5-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-3.7-flash",
    "gemini-3.8-flash",
    "gemini-2.5-flash-lite",
  ];

  let lastError: unknown;

  for (const model of models) {
    // Up to 2 attempts for transient 503 errors; 1 attempt for 429 (immediate failover to next model)
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        console.log(`[Gemini] Attempting model: ${model} (attempt ${attempt + 1})`);

        return await ai.models.generateContent({
          model,
          contents,
        });
      } catch (error: any) {
        lastError = error;
        const statusCode = error?.status || error?.statusCode || error?.status_code;
        const msg = String(error?.message || error || "");
        const is503 = statusCode === 503 || msg.includes("503") || msg.includes("UNAVAILABLE") || msg.includes("high demand");
        const is429 = statusCode === 429 || msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED");

        console.warn(
          `[Gemini] Model ${model} (attempt ${attempt + 1}) failed with status ${statusCode || "unknown"}:`,
          error?.message || error
        );

        // For 429 quota exhaustion on this specific model, don't retry - immediately advance to next model
        if (is429) {
          break;
        }

        // For 503 transient spike on first attempt, pause briefly and retry once
        if (is503 && attempt === 0) {
          await new Promise((resolve) => setTimeout(resolve, 800));
        } else {
          break;
        }
      }
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