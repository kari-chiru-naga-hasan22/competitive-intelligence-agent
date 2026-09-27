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

// Helper: normalize string for fuzzy comparison (trim, lowercase, strip punctuation)
function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Issue 1: Lightweight Levenshtein distance for typo matching without external NLP packages
function getLevenshteinDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i;
    for (let j = 1; j <= b.length; j++) {
      const val = a[i - 1] === b[j - 1] ? row[j - 1] : Math.min(row[j - 1], row[j], prev) + 1;
      row[j - 1] = prev;
      prev = val;
    }
    row[b.length] = prev;
  }
  return row[b.length];
}

// Issue 1: Normalized/fuzzy competitor matching handling containment, tokens, and typos
function isCompetitorMatch(text: string, competitorQuery: string): boolean {
  const normQuery = normalizeText(competitorQuery);
  const normText = normalizeText(text);

  if (!normQuery || !normText) return false;

  // Direct normalized substring match (e.g. query "Acme" in "Acme Cloud launched...")
  if (normText.includes(normQuery)) return true;

  // Extract explicit competitor field if present in canonical memory text
  const storedMatch = text.match(/^Competitor:\s*([^\n|]+)/im);
  const normStored = storedMatch ? normalizeText(storedMatch[1]) : "";

  if (normStored) {
    if (normQuery.includes(normStored) || normStored.includes(normQuery)) {
      return true;
    }
  }

  // Token-level overlap and distance check for close variants/typos
  const queryTokens = normQuery.split(" ").filter(Boolean);
  const candidateTokens = (normStored || normText).split(" ").filter((t) => t.length > 2);

  if (queryTokens.length === 0 || candidateTokens.length === 0) return false;

  const matchedCount = queryTokens.filter((qToken) =>
    candidateTokens.some((cToken) => {
      if (cToken === qToken) return true;
      if (Math.min(qToken.length, cToken.length) >= 3) {
        return getLevenshteinDistance(qToken, cToken) <= 1;
      }
      return false;
    })
  ).length;

  return matchedCount / queryTokens.length >= 0.5;
}

// Issue 2: Token similarity check to distinguish genuinely different events from duplicate representations
function getTextSimilarity(strA: string, strB: string): number {
  const normA = normalizeText(strA);
  const normB = normalizeText(strB);
  if (normA === normB) return 1.0;
  if (!normA || !normB) return 0.0;

  const wordsA = new Set(normA.split(" ").filter((w) => w.length > 2));
  const wordsB = new Set(normB.split(" ").filter((w) => w.length > 2));
  if (wordsA.size === 0 || wordsB.size === 0) return 0.0;

  let intersection = 0;
  for (const word of wordsA) {
    if (wordsB.has(word)) intersection++;
  }
  const union = new Set([...wordsA, ...wordsB]).size;
  return union === 0 ? 0 : intersection / union;
}

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

      // Issue 1 fix: Fuzzy/normalized competitor matching (supports token sequence, typos, and punctuation variants)
      if (!isCompetitorMatch(text, competitor)) {
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
    // Issue 2 fix: Collapse duplicate representations via text similarity rather than discarding distinct events on same date|category
    const evidenceList: Evidence[] = [];

    for (const memory of uniqueMemories) {
      const text = memory.text || "";

      // Issue 3 fix: Robust date extraction across both memory formats with ISO fallback and "date unknown" preservation
      let date = "";
      const dateMatch = text.match(
        /(?:When:|Date:)\s*(\d{4}-\d{2}-\d{2})/i
      );

      if (dateMatch?.[1]) {
        date = dateMatch[1];
      } else if (memory.occurred_start) {
        date = memory.occurred_start.slice(0, 10);
      } else {
        const isoMatch = text.match(/\b\d{4}-\d{2}-\d{2}\b/);
        if (isoMatch?.[0]) {
          date = isoMatch[0];
        }
      }

      if (!date) {
        console.warn(
          `[intelligence] Memory missing valid date, marking as date unknown: "${text.slice(0, 80)}"`
        );
        date = "date unknown";
      }

      // Start with Hindsight's category/entity information.
      const categoryMatch = text.match(/^Category:\s*([^\n|]+)/im);
      let category =
        categoryMatch?.[1]?.trim().toLowerCase() ||
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

      // Extract clean event text
      const eventLineMatch = text.match(/^Event:\s*([^\n]+)/im);
      const event = eventLineMatch
        ? eventLineMatch[1].trim()
        : text
            .replace(/^Competitor:.*$/im, "")
            .replace(/^Category:.*$/im, "")
            .replace(/^Source:.*$/im, "")
            .replace(/^Date:.*$/im, "")
            .replace(/^Strategic signal:.*$/im, "")
            .replace(/\s*\|\s*When:.*$/i, "")
            .replace(/\s*\|\s*Involving:.*$/i, "")
            .replace(/\s*\|\s*Strategic.*$/i, "")
            .trim();

      if (!event) {
        console.warn(
          `[intelligence] Dropping memory with no extractable event text: "${text.slice(0, 80)}"`
        );
        continue;
      }

      const sourceLineMatch = text.match(/^Source:\s*([^\n]+)/im);
      const source = sourceLineMatch?.[1]?.trim() || memory.context || undefined;

      // Issue 2 fix: Only collapse entries whose event text is near-identical (similarity >= 0.65)
      const duplicateIndex = evidenceList.findIndex((item) => {
        if (item.category !== category || item.date !== date) {
          return false;
        }
        return getTextSimilarity(item.event, event) >= 0.65;
      });

      if (duplicateIndex !== -1) {
        // Near-duplicate: prefer the shorter, cleaner representation
        if (event.length < evidenceList[duplicateIndex].event.length) {
          evidenceList[duplicateIndex].event = event;
        }
        if (!evidenceList[duplicateIndex].source && source) {
          evidenceList[duplicateIndex].source = source;
        }
      } else {
        // Materially distinct event: preserve as separate evidence entry
        evidenceList.push({
          date,
          category,
          event,
          source,
        });
      }
    }

    // 5. Sort evidence: chronological for dated items, undated items at end (Issue 3 fix)
    const datedEvidence = evidenceList
      .filter((item) => item.date !== "date unknown")
      .sort((a, b) => a.date.localeCompare(b.date));

    const undatedEvidence = evidenceList.filter(
      (item) => item.date === "date unknown"
    );

    const evidence = [...datedEvidence, ...undatedEvidence].slice(0, 12);

    // Issue 4 fix: Guardrail for sparse/insufficient evidence
    if (evidence.length === 0) {
      return NextResponse.json({
        success: true,
        competitor,
        question,
        insight: {
          summary: `There is not enough historical memory for ${competitor} to answer this question yet.`,
          observed_changes: [],
          strategic_signal: "Insufficient historical evidence.",
          watch_next: [],
        },
        evidence: [],
      });
    }

    // Direct low-evidence return for single isolated event without calling Gemini
    if (evidence.length < 2) {
      const single = evidence[0];
      return NextResponse.json({
        success: true,
        competitor,
        question,
        insight: {
          summary: `Only a single event is recorded for ${competitor}: ${single.event} (${single.date}). Insufficient historical data to establish a strategic pattern or trend.`,
          observed_changes: [single.event],
          strategic_signal:
            "Single data point; insufficient history to infer strategic direction.",
          watch_next: [
            `Monitor for subsequent moves by ${competitor} to determine whether this indicates a broader shift.`,
          ],
        },
        evidence,
      });
    }

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

    const isSparseEvidence = evidence.length < 3;

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
${
  isSparseEvidence
    ? `5. Evidence is sparse (${evidence.length} events). Frame findings with explicit low confidence and insufficient-history caveats.
6. Summarize only what is directly known; do NOT extrapolate broad strategic trends or fabricate multi-event patterns.`
    : `5. Focus on change over time rather than describing isolated events.
6. Identify relationships between multiple events when the evidence supports them.`
}
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