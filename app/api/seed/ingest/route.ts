import { NextResponse } from "next/server";
import { generateGeminiContent } from "@/lib/gemini/client";
import { getHindsightClient } from "@/lib/hindsight";

const BANK_ID = "competitive-intelligence";

const EVENTS = [
  {
    id: "acme-2026-07-01",
    competitor: "Acme Cloud",
    event: "Acme Cloud launched an AI-powered analytics assistant for business users.",
    category: "product",
    source: "Company product announcement",
    date: "2026-07-01",
  },
  {
    id: "acme-2026-07-15",
    competitor: "Acme Cloud",
    event: "Acme Cloud introduced an enterprise security package with advanced access controls.",
    category: "product",
    source: "Company website",
    date: "2026-07-15",
  },
  {
    id: "acme-2026-08-05",
    competitor: "Acme Cloud",
    event: "Acme Cloud began emphasizing AI-first analytics in its product messaging.",
    category: "messaging",
    source: "Company website",
    date: "2026-08-05",
  },
  {
    id: "acme-2026-08-22",
    competitor: "Acme Cloud",
    event: "Acme Cloud introduced a usage-based pricing option for high-volume customers.",
    category: "pricing",
    source: "Company pricing page",
    date: "2026-08-22",
  },
  {
    id: "acme-2026-09-27",
    competitor: "Acme Cloud",
    event: "Acme Cloud reduced its Pro plan from $49 to $39 per month.",
    category: "pricing",
    source: "Company website",
    date: "2026-09-27",
  },

  {
    id: "nimbus-2026-07-04",
    competitor: "Nimbus Analytics",
    event: "Nimbus Analytics launched automated anomaly detection for its analytics platform.",
    category: "product",
    source: "Company product announcement",
    date: "2026-07-04",
  },
  {
    id: "nimbus-2026-07-20",
    competitor: "Nimbus Analytics",
    event: "Nimbus Analytics expanded its enterprise plan with dedicated customer success support.",
    category: "packaging",
    source: "Company website",
    date: "2026-07-20",
  },
  {
    id: "nimbus-2026-08-10",
    competitor: "Nimbus Analytics",
    event: "Nimbus Analytics began positioning its platform around trusted enterprise AI.",
    category: "messaging",
    source: "Company website",
    date: "2026-08-10",
  },
  {
    id: "nimbus-2026-08-28",
    competitor: "Nimbus Analytics",
    event: "Nimbus Analytics added AI-generated executive reports to its platform.",
    category: "product",
    source: "Company product announcement",
    date: "2026-08-28",
  },
  {
    id: "nimbus-2026-09-12",
    competitor: "Nimbus Analytics",
    event: "Nimbus Analytics announced a partnership focused on integrating external business data.",
    category: "partnership",
    source: "Company announcement",
    date: "2026-09-12",
  },

  {
    id: "vertex-2026-07-08",
    competitor: "Vertex Data",
    event: "Vertex Data launched a self-service analytics workspace for smaller teams.",
    category: "product",
    source: "Company product announcement",
    date: "2026-07-08",
  },
  {
    id: "vertex-2026-07-25",
    competitor: "Vertex Data",
    event: "Vertex Data introduced a lower-cost starter package for growing businesses.",
    category: "pricing",
    source: "Company pricing page",
    date: "2026-07-25",
  },
  {
    id: "vertex-2026-08-12",
    competitor: "Vertex Data",
    event: "Vertex Data increased its messaging around ease of deployment and faster time to value.",
    category: "messaging",
    source: "Company website",
    date: "2026-08-12",
  },
  {
    id: "vertex-2026-08-30",
    competitor: "Vertex Data",
    event: "Vertex Data added pre-built industry dashboards for retail and financial services.",
    category: "product",
    source: "Company product announcement",
    date: "2026-08-30",
  },
  {
    id: "vertex-2026-09-15",
    competitor: "Vertex Data",
    event: "Vertex Data announced additional hiring for its enterprise sales organization.",
    category: "hiring",
    source: "Company careers page",
    date: "2026-09-15",
  },
];

export async function POST() {
  try {
    const hindsight = getHindsightClient();

    try {
      await hindsight.createBank(BANK_ID, {
        name: "Competitive Intelligence",
        background:
          "A memory bank for tracking competitor products, pricing, launches, hiring, messaging, and strategic changes over time.",
      });
    } catch {
      // Bank already exists.
    }

    const results = [];

    for (const item of EVENTS) {
      console.log(
        `Processing ${item.id}: ${item.event}`
      );

      /*
       * Check Hindsight first.
       *
       * If this event was already stored during an earlier
       * partial run, skip it.
       */
      const existing = await hindsight.recall(
        BANK_ID,
        `"${item.event}"`,
        {
          maxTokens: 300,
          budget: "low",
        }
      );

      const alreadyStored = existing.results?.some((memory) =>
        memory.text?.toLowerCase().includes(item.event.toLowerCase())
      );

      if (alreadyStored) {
        console.log(`Skipping already stored event: ${item.id}`);

        results.push({
          id: item.id,
          competitor: item.competitor,
          status: "skipped",
          reason: "already stored",
        });

        continue;
      }

      // Ask Gemini to normalize the event.
      const geminiResponse = await generateGeminiContent(`
You are a competitive intelligence analyst.

Normalize the following competitor event into concise structured intelligence.

Competitor: ${item.competitor}
Event: ${item.event}
Category: ${item.category}
Source: ${item.source}
Date: ${item.date}

Return ONLY valid JSON with these fields:

{
  "competitor": string,
  "category": string,
  "event": string,
  "strategic_signal": string,
  "source": string,
  "date": string
}

Do not invent facts that are not present in the input.
`);

      const rawText = geminiResponse.text?.trim();

      if (!rawText) {
        throw new Error(
          `Gemini returned an empty response for ${item.id}`
        );
      }

      const cleanedText = rawText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      const intelligence = JSON.parse(cleanedText);

      const memoryContent = [
        `Competitor: ${intelligence.competitor}`,
        `Category: ${intelligence.category}`,
        `Event: ${intelligence.event}`,
        `Strategic signal: ${intelligence.strategic_signal}`,
        `Source: ${intelligence.source}`,
        `Date: ${intelligence.date}`,
      ].join("\n");

      await hindsight.retain(BANK_ID, memoryContent, {
        context: "competitive-intelligence-seed",
        timestamp: new Date(intelligence.date),
      });

      results.push({
        id: item.id,
        competitor: intelligence.competitor,
        date: intelligence.date,
        category: intelligence.category,
        event: intelligence.event,
        status: "stored",
      });
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("Seed ingestion failed:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}