import { NextResponse } from "next/server";
import { generateGeminiContent } from "@/lib/gemini/client";
import { getHindsightClient } from "@/lib/hindsight";

const BANK_ID = "competitive-intelligence";

export async function POST(request: Request) {
  try {
    // 1. Read the incoming competitor event
    const body = await request.json();

    const {
      competitor,
      event,
      category,
      source,
      date,
    } = body;

    // 2. Validate required fields
    if (!competitor || !event) {
      return NextResponse.json(
        {
          success: false,
          error: "competitor and event are required",
        },
        { status: 400 }
      );
    }

    // 3. Ask Gemini to normalize the event
    const geminiResponse = await generateGeminiContent(`
You are a competitive intelligence analyst.

Normalize the following competitor event into concise structured intelligence.

Competitor: ${competitor}
Event: ${event}
Category: ${category || "unknown"}
Source: ${source || "unknown"}
Date: ${date || new Date().toISOString().split("T")[0]}

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

    // 4. Get Gemini's response
    const rawText = geminiResponse.text?.trim();

    if (!rawText) {
      throw new Error("Gemini returned an empty response");
    }

    // 5. Remove markdown code fences if Gemini adds them
    const cleanedText = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    // 6. Convert Gemini response into an object
    const intelligence = JSON.parse(cleanedText);

    // 7. Get Hindsight client
    const hindsight = getHindsightClient();

    // 8. Make sure the memory bank exists
    try {
      await hindsight.createBank(BANK_ID, {
        name: "Competitive Intelligence",
        background:
          "A memory bank for tracking competitor products, pricing, launches, hiring, messaging, and strategic changes over time.",
      });
    } catch {
      // Bank probably already exists.
      // Continue without failing the request.
    }

    // 9. Build the memory that will be stored
    const memoryContent = [
      `Competitor: ${intelligence.competitor}`,
      `Category: ${intelligence.category}`,
      `Event: ${intelligence.event}`,
      `Strategic signal: ${intelligence.strategic_signal}`,
      `Source: ${intelligence.source}`,
      `Date: ${intelligence.date}`,
    ].join("\n");

    // 10. Store the event in Hindsight
    await hindsight.retain(BANK_ID, memoryContent, {
      context: "competitive-intelligence-event",
      timestamp: new Date(intelligence.date),
    });

    // 11. Return the result
    return NextResponse.json({
      success: true,
      intelligence,
      stored: true,
    });
  } catch (error) {
    console.error("Event ingestion failed:", error);

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