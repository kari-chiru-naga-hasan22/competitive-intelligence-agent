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