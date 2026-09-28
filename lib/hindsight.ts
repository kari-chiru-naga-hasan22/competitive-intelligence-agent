import { HindsightClient } from "@vectorize-io/hindsight-client";

let client: HindsightClient | null = null;

export function getHindsightClient(): HindsightClient {
  if (!client) {
    const apiKey = process.env.HINDSIGHT_API_KEY;
    if (!apiKey || apiKey.trim() === "") {
      const err = new Error("HINDSIGHT_API_KEY is not configured");
      (err as { code?: string }).code = "HINDSIGHT_UNAVAILABLE";
      throw err;
    }

    client = new HindsightClient({
      baseUrl:
        process.env.HINDSIGHT_BASE_URL ||
        "https://api.hindsight.vectorize.io",
      apiKey: apiKey.trim(),
    });
  }

  return client;
}

export function isHindsightConfigured(): boolean {
  return Boolean(process.env.HINDSIGHT_API_KEY && process.env.HINDSIGHT_API_KEY.trim() !== "");
}

export interface CanonicalMemoryInput {
  competitor: string;
  category: string;
  event: string;
  source?: string;
  date: string;
  strategicSignal?: string;
  strategic_signal?: string;
}

// Canonical memory-content-building helper ensuring consistent field set [Competitor/Category/Event/Source/Date]
export function buildMemoryContent(input: CanonicalMemoryInput): string {
  return [
    `Competitor: ${input.competitor}`,
    `Category: ${input.category}`,
    `Event: ${input.event}`,
    `Source: ${input.source || "unknown"}`,
    `Date: ${input.date}`,
  ].join("\n");
}

export interface StrategicObservationMemoryInput {
  competitor: string;
  question: string;
  summary: string;
  strategicSignal: string;
  observedChanges: string[];
  date?: string;
}

// Phase 6 requirement: Canonical memory block for retaining generated strategic observations in Hindsight
export function buildObservationMemoryContent(input: StrategicObservationMemoryInput): string {
  const dateStr = input.date || new Date().toISOString().split("T")[0];
  const changes = input.observedChanges.slice(0, 5).join(" | ");
  return [
    `Competitor: ${input.competitor}`,
    `Category: strategic-observation`,
    `Question: ${input.question}`,
    `Strategic Signal: ${input.strategicSignal}`,
    `Observation Summary: ${input.summary}`,
    `Supported Changes: ${changes}`,
    `Date: ${dateStr}`,
  ].join("\n");
}