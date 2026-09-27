import { NextResponse } from "next/server";
import { getHindsightClient, buildMemoryContent } from "@/lib/hindsight";

const BANK_ID = "competitive-intelligence";

const EVENTS = [
  {
    competitor: "Acme Cloud",
    category: "product",
    event: "Acme Cloud launched an AI-powered analytics assistant for business users.",
    source: "Company product announcement",
    date: "2026-07-01",
  },
  {
    competitor: "Acme Cloud",
    category: "product",
    event: "Acme Cloud introduced an enterprise security package with advanced access controls.",
    source: "Company website",
    date: "2026-07-15",
  },
  {
    competitor: "Acme Cloud",
    category: "messaging",
    event: "Acme Cloud began emphasizing AI-first analytics in its product messaging.",
    source: "Company website",
    date: "2026-08-05",
  },
  {
    competitor: "Acme Cloud",
    category: "pricing",
    event: "Acme Cloud introduced a usage-based pricing option for high-volume customers.",
    source: "Company pricing page",
    date: "2026-08-22",
  },
  {
    competitor: "Acme Cloud",
    category: "pricing",
    event: "Acme Cloud reduced its Pro plan from $49 to $39 per month.",
    source: "Company website",
    date: "2026-09-27",
  },

  {
    competitor: "Nimbus Analytics",
    category: "product",
    event: "Nimbus Analytics launched automated anomaly detection for its analytics platform.",
    source: "Company product announcement",
    date: "2026-07-04",
  },
  {
    competitor: "Nimbus Analytics",
    category: "packaging",
    event: "Nimbus Analytics expanded its enterprise plan with dedicated customer success support.",
    source: "Company website",
    date: "2026-07-20",
  },
  {
    competitor: "Nimbus Analytics",
    category: "messaging",
    event: "Nimbus Analytics began positioning its platform around trusted enterprise AI.",
    source: "Company website",
    date: "2026-08-10",
  },
  {
    competitor: "Nimbus Analytics",
    category: "product",
    event: "Nimbus Analytics added AI-generated executive reports to its platform.",
    source: "Company product announcement",
    date: "2026-08-28",
  },
  {
    competitor: "Nimbus Analytics",
    category: "partnership",
    event: "Nimbus Analytics announced a partnership focused on integrating external business data.",
    source: "Company announcement",
    date: "2026-09-12",
  },

  {
    competitor: "Vertex Data",
    category: "product",
    event: "Vertex Data launched a self-service analytics workspace for smaller teams.",
    source: "Company product announcement",
    date: "2026-07-08",
  },
  {
    competitor: "Vertex Data",
    category: "pricing",
    event: "Vertex Data introduced a lower-cost starter package for growing businesses.",
    source: "Company pricing page",
    date: "2026-07-25",
  },
  {
    competitor: "Vertex Data",
    category: "messaging",
    event: "Vertex Data increased its messaging around ease of deployment and faster time to value.",
    source: "Company website",
    date: "2026-08-12",
  },
  {
    competitor: "Vertex Data",
    category: "product",
    event: "Vertex Data added pre-built industry dashboards for retail and financial services.",
    source: "Company product announcement",
    date: "2026-08-30",
  },
  {
    competitor: "Vertex Data",
    category: "hiring",
    event: "Vertex Data announced additional hiring for its enterprise sales organization.",
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
      // Issue 5 fix: Canonical memory content helper
      const memoryContent = buildMemoryContent({
        competitor: item.competitor,
        category: item.category,
        event: item.event,
        source: item.source,
        date: item.date,
      });

      await hindsight.retain(BANK_ID, memoryContent, {
        context: "competitive-intelligence-seed",
        timestamp: new Date(item.date),
      });

      results.push({
        competitor: item.competitor,
        date: item.date,
        category: item.category,
        stored: true,
      });

      console.log(
        `Stored: ${item.competitor} - ${item.date}`
      );
    }

    return NextResponse.json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("Fast seed failed:", error);

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