import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

export function getGeminiClient() {
  if (!client) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  return client;
}

export async function generateGeminiContent(contents: string) {
  const ai = getGeminiClient();

  const models = [
    "gemini-3.8-flash",
    "gemini-3.7-flash",
  ];

  let lastError: unknown;

  for (const model of models) {
    try {
      console.log(`Trying Gemini model: ${model}`);

      return await ai.models.generateContent({
        model,
        contents,
      });
    } catch (error) {
      lastError = error;

      console.warn(
        `Gemini model ${model} failed:`,
        error
      );
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("All Gemini models failed");
}