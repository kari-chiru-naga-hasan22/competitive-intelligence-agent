import { NextResponse } from "next/server";
import { getHindsightClient, isHindsightConfigured } from "@/lib/hindsight";

export async function GET() {
  if (!isHindsightConfigured()) {
    return NextResponse.json(
      {
        success: false,
        error: "HINDSIGHT_API_KEY is not configured",
        code: "HINDSIGHT_UNAVAILABLE",
      },
      { status: 503 }
    );
  }

  try {
    const hindsight = getHindsightClient();
    const bankId = "competitive-intelligence";

    try {
      await hindsight.createBank(bankId, {
        name: "Competitive Intelligence",
        background:
          "A memory bank for tracking competitor products, pricing, launches, hiring, messaging, and strategic changes over time.",
      });
    } catch {
      // Bank may already exist
    }

    // Store test memory
    await hindsight.retain(
      bankId,
      "Acme Cloud reduced its Pro plan price from $49 to $39 per month on September 27, 2026. This may indicate increased price competition in the cloud analytics market.",
      {
        context: "competitive-intelligence-test",
        timestamp: new Date(),
      }
    );

    // Search the memory
    const recallResult = await hindsight.recall(
      bankId,
      "What changed in Acme Cloud pricing?",
      {
        maxTokens: 500,
        budget: "low",
      }
    );

    return NextResponse.json({
      success: true,
      bankId,
      memories: recallResult.results,
    });
  } catch (error) {
    console.error("Hindsight test failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        code: (error as { code?: string })?.code || "HINDSIGHT_UNAVAILABLE",
      },
      { status: 500 }
    );
  }
}