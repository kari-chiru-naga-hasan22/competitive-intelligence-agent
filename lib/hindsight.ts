import { HindsightClient } from "@vectorize-io/hindsight-client";

let client: HindsightClient | null = null;

export function getHindsightClient() {
  if (!client) {
    if (!process.env.HINDSIGHT_API_KEY) {
      throw new Error("HINDSIGHT_API_KEY is not configured");
    }

    client = new HindsightClient({
      baseUrl:
        process.env.HINDSIGHT_BASE_URL ||
        "https://api.hindsight.vectorize.io",
      apiKey: process.env.HINDSIGHT_API_KEY,
    });
  }

  return client;
}

export interface CanonicalMemoryInput {
  competitor: string;
  category: string;
  event: string;
  source?: string;
  date: string;
  // Optional field accepted for compatibility, but omitted from canonical memory block
  strategicSignal?: string;
  strategic_signal?: string;
}

// Issue 5 fix: Canonical memory-content-building helper ensuring consistent field set [Competitor/Category/Event/Source/Date]
export function buildMemoryContent(input: CanonicalMemoryInput): string {
  return [
    `Competitor: ${input.competitor}`,
    `Category: ${input.category}`,
    `Event: ${input.event}`,
    `Source: ${input.source || "unknown"}`,
    `Date: ${input.date}`,
  ].join("\n");
}