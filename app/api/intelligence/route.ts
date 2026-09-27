import { NextResponse } from "next/server";

import { generateGeminiContent } from "@/lib/gemini/client";

import { getHindsightClient } from "@/lib/hindsight";

const BANK_ID = "competitive-intelligence";

type Evidence = {
  date: string;
  category: string;
  event: string;
  source?: string;
};

export async function POST(request: Request) {
  try {
    // 1. Read the intelligence question
    const body = await request.json();

    const { competitor, question } = body;

    if (!competitor || !question) {
      return NextResponse.json(
        {
          success: false,
          error: "competitor and question are required",
        },
        { status: 400 }
      );
    }

    // 2. Recall relevant historical memories from Hindsight
    const hindsight = getHindsightClient();

    const recallResult = await hindsight.recall(
      BANK_ID,
      `${competitor}: ${question}`,
      {
        maxTokens: 1800,
        budget: "low",
      }
    );

    const memories = recallResult.results || [];

    if (memories.length === 0) {
      return NextResponse.json({
        success: true,
        competitor,
        question,
        insight: {
          summary:
            "There is not enough historical memory to answer this question yet.",
          observed_changes: [],
          strategic_signal: "Insufficient historical evidence.",
          watch_next: [],
        },
        evidence: [],
      });
    }

    // 3. Remove duplicate memories
    const uniqueMemoryTexts = new Set<string>();

    const uniqueMemories = memories.filter((memory) => {
      const text = memory.text?.trim();

      if (!text) {
        return false;
      }

      // Only keep memories that are actually about the requested competitor.
      if (!text.toLowerCase().includes(competitor.toLowerCase())) {
        return false;
      }

      const normalized = text.toLowerCase();

      if (uniqueMemoryTexts.has(normalized)) {
        return false;
      }

      uniqueMemoryTexts.add(normalized);

      return true;
    });

    // 4. Convert memories into evidence candidates
    const evidenceMap = new Map<string, Evidence>();

    for (const memory of uniqueMemories) {
      const text = memory.text || "";

      const dateMatch = text.match(
        /(?:When:|Date:)\s*(\d{4}-\d{2}-\d{2})/i
      );

      const date =
        dateMatch?.[1] ||
        memory.occurred_start?.slice(0, 10) ||
        "";

      if (!date) {
        continue;
      }

      // Start with Hindsight's category/entity information.
      let category =
        memory.entities?.find((entity: string) =>
          [
            "pricing",
            "product",
            "messaging",
            "hiring",
            "partnership",
            "packaging",
          ].includes(entity.toLowerCase())
        ) || "other";

      // Normalize category using the actual event text.
      // This helps collapse duplicate Hindsight memories that
      // were classified differently.
      const lowerText = text.toLowerCase();

      if (
        lowerText.includes("price") ||
        lowerText.includes("pricing") ||
        lowerText.includes("subscription")
      ) {
        category = "pricing";
      } else if (
        lowerText.includes("messaging") ||
        lowerText.includes("positioning")
      ) {
        category = "messaging";
      } else if (
        lowerText.includes("security") ||
        lowerText.includes("access controls")
      ) {
        category = "enterprise";
      } else if (
        lowerText.includes("launched") ||
        lowerText.includes("introduced")
      ) {
        category = "product";
      }

      // Remove Hindsight metadata wording.
      let event = text
        .replace(/\s*\|\s*When:.*$/i, "")
        .replace(/\s*\|\s*Involving:.*$/i, "")
        .replace(/\s*\|\s*Strategic.*$/i, "")
        .trim();

      if (!event) {
        continue;
      }

      /*
       * Hindsight can return multiple representations of the same
       * underlying memory.
       *
       * Grouping by date + category gives the frontend one clean
       * evidence item per strategic change.
       */
      const key = `${date}|${category}`;

      const existing = evidenceMap.get(key);

      if (!existing) {
        evidenceMap.set(key, {
          date,
          category,
          event,
          source: memory.context || undefined,
        });

        continue;
      }

      // Prefer the shorter, cleaner representation.
      if (event.length < existing.event.length) {
        evidenceMap.set(key, {
          date,
          category,
          event,
          source: memory.context || existing.source,
        });
      }
    }

    // 5. Sort evidence chronologically
    const evidence = Array.from(evidenceMap.values())
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 12);

    // 6. Give Gemini the clean historical evidence
    const evidenceContext = evidence
      .map(
        (item, index) =>
          `Evidence ${index + 1}:
Date: ${item.date}
Category: ${item.category}
Event: ${item.event}`
      )
      .join("\n\n");

    // 7. Ask Gemini to reason over the accumulated history
    const geminiResponse = await generateGeminiContent(`
You are a senior competitive intelligence analyst.

Analyze the historical competitor evidence below.

Competitor:
${competitor}

User question:
${question}

Historical evidence:
${evidenceContext}

Return ONLY valid JSON using exactly this structure:

{
  "summary": "A concise 2-3 sentence summary of the observed strategic evolution.",
  "observed_changes": [
    "A concrete historical change supported directly by the evidence.",
    "Another concrete historical change supported directly by the evidence."
  ],
  "strategic_signal": "A cautious inference about what the combined pattern may indicate.",
  "watch_next": [
    "A specific future development worth monitoring.",
    "Another specific development worth monitoring."
  ]
}

Rules:

1. Separate facts from inference.
2. observed_changes must contain ONLY things directly supported by the evidence.
3. strategic_signal is an inference, so use cautious language such as:
   "may indicate", "could suggest", or "appears consistent with".
4. Do not invent competitors, dates, products, prices, customers, or outcomes.
5. Focus on change over time rather than describing isolated events.
6. Identify relationships between multiple events when the evidence supports them.
7. Keep the response concise and useful to a business decision-maker.
`);

    // 8. Parse Gemini response
    const rawText = geminiResponse.text?.trim();

    if (!rawText) {
      throw new Error("Gemini returned an empty response");
    }

    const cleanedText = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const insight = JSON.parse(cleanedText);

    // 9. Return clean intelligence + evidence
    return NextResponse.json({
      success: true,
      competitor,
      question,
      insight,
      evidence,
    });
  } catch (error) {
    console.error("Intelligence request failed:", error);

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