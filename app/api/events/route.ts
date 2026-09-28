import { NextResponse } from "next/server";
import { generateGeminiContent, extractJsonObject } from "@/lib/gemini/client";
import { getHindsightClient, buildMemoryContent, isHindsightConfigured } from "@/lib/hindsight";

import competitorsData from "@/data/competitors.json";

const BANK_ID = "competitive-intelligence";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const competitor = searchParams.get("competitor");

    if (competitor) {
      const filtered = (competitorsData as Array<{ competitor: string; [key: string]: unknown }>).filter(
        (e) => e.competitor.toLowerCase() === competitor.toLowerCase()
      );
      return NextResponse.json({
        success: true,
        count: filtered.length,
        events: filtered,
      });
    }

    return NextResponse.json({
      success: true,
      count: (competitorsData as Array<unknown>).length,
      events: competitorsData,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch events",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const targetCompetitor = (body.competitor || body.company || "").trim();
    const rawEvent = (body.event || "").trim();
    const category = (body.category || "product").trim();
    const source = (body.source || "Public Documentation").trim();
    const date = (body.date || new Date().toISOString().split("T")[0]).trim();

    // 1. Validate Input (Phase 16 Security)
    if (!targetCompetitor) {
      return NextResponse.json(
        { success: false, error: "Company name is required", code: "INVALID_INPUT" },
        { status: 400 }
      );
    }

    if (!rawEvent) {
      return NextResponse.json(
        { success: false, error: "Event description is required", code: "INVALID_INPUT" },
        { status: 400 }
      );
    }

    if (targetCompetitor.length > 100 || rawEvent.length > 1500) {
      return NextResponse.json(
        { success: false, error: "Payload exceeds allowed character limits", code: "INVALID_INPUT" },
        { status: 400 }
      );
    }

    // 2. Check Hindsight
    if (!isHindsightConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: "Hindsight memory engine is not configured. Add HINDSIGHT_API_KEY to store persistent events.",
          code: "HINDSIGHT_UNAVAILABLE",
        },
        { status: 503 }
      );
    }

    // 3. Optional Normalization with Gemini (if available)
    let normalizedEvent = rawEvent;
    let normalizedCategory = category;

    try {
      if (process.env.GEMINI_API_KEY) {
        const geminiResponse = await generateGeminiContent(`
Normalize this competitor event into clean structured intelligence.

Company: ${targetCompetitor}
Event: ${rawEvent}
Category: ${category}
Date: ${date}

Return ONLY JSON:
{
  "event": "Concise factual statement of what occurred without subjective fluff",
  "category": "product | pricing | messaging | enterprise | partnership | hiring"
}`, { responseMimeType: "application/json" });

        const parsed = extractJsonObject<{ event?: string; category?: string }>(geminiResponse.text || "");
        if (parsed.event) normalizedEvent = parsed.event;
        if (parsed.category) normalizedCategory = parsed.category;
      }
    } catch (normErr) {
      console.warn("[events] Gemini event normalization bypassed:", normErr);
      // Fallback to raw inputs
    }

    // 4. Retain in Hindsight
    const hindsight = getHindsightClient();

    try {
      await hindsight.createBank(BANK_ID, {
        name: "Competitive Intelligence",
        background:
          "Memory bank tracking competitor moves across pricing, product features, security, messaging, and leadership.",
      });
    } catch {
      // Bank already created
    }

    const memoryContent = buildMemoryContent({
      competitor: targetCompetitor,
      category: normalizedCategory,
      event: normalizedEvent,
      source,
      date,
    });

    await hindsight.retain(BANK_ID, memoryContent, {
      context: "competitive-intelligence-event",
      timestamp: new Date(date),
    });

    console.log(`[events] Ingested event for ${targetCompetitor}: "${normalizedEvent}"`);

    return NextResponse.json({
      success: true,
      stored: true,
      event: {
        competitor: targetCompetitor,
        category: normalizedCategory,
        event: normalizedEvent,
        source,
        date,
      },
    });
  } catch (error) {
    console.error("[events] Ingestion failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal error storing competitor event",
        code: (error as { code?: string })?.code || "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}