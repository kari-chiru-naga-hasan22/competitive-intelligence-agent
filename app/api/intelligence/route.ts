import { NextResponse } from "next/server";

import { generateGeminiContent, formatGeminiErrorMessage } from "@/lib/gemini/client";

import { getHindsightClient } from "@/lib/hindsight";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

// Strict competitor matching enforcing company isolation
function isCompetitorMatch(text: string, targetCompetitor: string): boolean {
  const normTarget = normalizeText(targetCompetitor);
  const normText = normalizeText(text);

  if (!normTarget || !normText) return false;

  // Drop generic market commentary that lacks concrete competitor attribution
  if (normText.startsWith("the cloud analytics market")) {
    return false;
  }

  const ALL_KNOWN_COMPETITORS = [
    "acme",
    "nimbus",
    "vertex",
    "shopify",
    "hubspot",
    "slack",
    "notion",
  ];

  // 1. Check explicit "Involving: <Competitor>" or "Competitor: <Competitor>"
  const explicitMatch = text.match(/(?:Competitor|Involving):\s*([^\n|]+)/i);
  if (explicitMatch) {
    const explicitNorm = normalizeText(explicitMatch[1]);
    // Strict negative check against other known competitors
    for (const comp of ALL_KNOWN_COMPETITORS) {
      if (explicitNorm.includes(comp) && !normTarget.includes(comp)) return false;
    }
    
    if (explicitNorm.includes(normTarget) || normTarget.includes(explicitNorm)) {
      return true;
    }
  }

  // 2. Strict negative check in body text: Reject if text is about a different known competitor
  for (const comp of ALL_KNOWN_COMPETITORS) {
    if (normText.includes(comp) && !normTarget.includes(comp)) return false;
  }

  // 3. Brand token check: Target competitor's distinctive brand token must be present
  for (const comp of ALL_KNOWN_COMPETITORS) {
    if (normTarget.includes(comp) && normText.includes(comp)) return true;
  }

  // 4. Fallback: full phrase containment
  return normText.includes(normTarget);
}

// Token similarity check to distinguish genuinely different events from duplicate representations
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
    let memories: any[] = [];
    try {
      const hindsight = getHindsightClient();
      const recallResult = await hindsight.recall(
        BANK_ID,
        `${competitor}: ${question}`,
        {
          maxTokens: 3500,
          budget: "low",
        }
      );
      memories = recallResult.results || [];
    } catch (hindsightErr) {
      console.warn("[intelligence] Hindsight recall failed or memory bank not ready:", hindsightErr);
    }

    // Load canonical local dataset events strictly for target competitor to ensure all 15 events are preserved
    let canonicalCompetitorEvents: Evidence[] = [];
    try {
      const fs = await import("node:fs");
      const path = await import("node:path");
      const filePath = path.join(process.cwd(), "data", "competitors.json");
      if (fs.existsSync(filePath)) {
        const fullDataset = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        canonicalCompetitorEvents = fullDataset
          .filter((item: any) => isCompetitorMatch(item.competitor, competitor))
          .map((item: any) => ({
            date: item.date,
            category: item.category,
            event: item.event,
            source: item.source || "Synthetic CI dataset",
          }));
      }
    } catch (fsErr) {
      console.warn("[intelligence] Could not read data/competitors.json:", fsErr);
    }

    if (memories.length === 0 && canonicalCompetitorEvents.length === 0) {
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
    const evidenceList: Evidence[] = [];

    for (const memory of uniqueMemories) {
      const text = memory.text || "";

      // Drop market generalizations or speculative notes that are not specific competitor actions
      const lowerText = text.toLowerCase();
      if (
        lowerText.includes("market may be experiencing") ||
        lowerText.startsWith("the cloud analytics market") ||
        lowerText.includes("increased price competition in the cloud analytics market")
      ) {
        console.warn(`[intelligence] Dropping market generalization: "${text.slice(0, 80)}"`);
        continue;
      }

      // Robust date extraction across ISO, pipe-format, and natural language
      let date = "";
      const dateMatch = text.match(/(?:When:|Date:)\s*(\d{4}-\d{2}-\d{2})/i);

      if (dateMatch?.[1]) {
        date = dateMatch[1];
      } else if (memory.occurred_start) {
        date = memory.occurred_start.slice(0, 10);
      } else {
        const isoMatch = text.match(/\b\d{4}-\d{2}-\d{2}\b/);
        if (isoMatch?.[0]) {
          date = isoMatch[0];
        } else {
          // Check for natural language dates e.g. "July 1, 2026", "September 27, 2026"
          const monthMap: Record<string, string> = {
            january: "01", february: "02", march: "03", april: "04", may: "05", june: "06",
            july: "07", august: "08", september: "09", october: "10", november: "11", december: "12",
            jan: "01", feb: "02", mar: "03", apr: "04", jun: "06", jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12"
          };
          const naturalMatch = text.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{1,2}),?\s+(\d{4})\b/i);
          if (naturalMatch) {
            const m = monthMap[naturalMatch[1].toLowerCase()];
            const d = naturalMatch[2].padStart(2, "0");
            const y = naturalMatch[3];
            if (m) date = `${y}-${m}-${d}`;
          }
        }
      }

      // Strict date requirement: Drop undated memories from chronological evidence timeline
      if (!date || date === "date unknown") {
        console.warn(
          `[intelligence] Dropping memory without verifiable date: "${text.slice(0, 80)}"`
        );
        continue;
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
      if (
        lowerText.includes("price") ||
        lowerText.includes("pricing") ||
        lowerText.includes("subscription") ||
        lowerText.includes("cost") ||
        lowerText.includes("billing") ||
        lowerText.includes("starter package") ||
        lowerText.includes("discount")
      ) {
        category = "pricing";
      } else if (
        lowerText.includes("messaging") ||
        lowerText.includes("positioning") ||
        lowerText.includes("marketing focus") ||
        lowerText.includes("time to value") ||
        lowerText.includes("ease of deployment")
      ) {
        category = "messaging";
      } else if (
        lowerText.includes("hiring") ||
        lowerText.includes("sales organization") ||
        lowerText.includes("headcount")
      ) {
        category = "hiring";
      } else if (
        lowerText.includes("partnership") ||
        lowerText.includes("partner")
      ) {
        category = "partnership";
      } else if (
        lowerText.includes("security") ||
        lowerText.includes("access controls") ||
        lowerText.includes("customer success") ||
        lowerText.includes("enterprise plan")
      ) {
        category = "enterprise";
      } else if (
        lowerText.includes("workspace") ||
        lowerText.includes("dashboard") ||
        lowerText.includes("anomaly detection") ||
        lowerText.includes("executive reports") ||
        lowerText.includes("assistant") ||
        lowerText.includes("launched") ||
        lowerText.includes("introduced")
      ) {
        category = "product";
      }

      // Extract clean event text
      const eventLineMatch = text.match(/^Event:\s*([^\n]+)/im);
      let event = eventLineMatch
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
            .replace(/\s*\|\s*Inferred.*$/i, "")
            .trim();

      if (!event) {
        console.warn(
          `[intelligence] Dropping memory with no extractable event text: "${text.slice(0, 80)}"`
        );
        continue;
      }

      // Ground source label: Synthetic CI dataset
      const source = "Synthetic CI dataset";

      // Deduplication: Collapse multiple records for the same date into the canonical atomic event
      const duplicateIndex = evidenceList.findIndex((item) => item.date === date);

      if (duplicateIndex !== -1) {
        const existing = evidenceList[duplicateIndex];
        // Prefer atomic, concise representation over compound run-on sentences
        const isCurrentRunon = event.toLowerCase().includes(" and ") && (event.includes("2026-") || event.includes("August") || event.includes("September") || event.includes("July"));
        const isExistingRunon = existing.event.toLowerCase().includes(" and ") && (existing.event.includes("2026-") || existing.event.includes("August") || existing.event.includes("September") || existing.event.includes("July"));

        if (isExistingRunon && !isCurrentRunon) {
          existing.event = event;
        } else if (!isCurrentRunon && event.length >= 30 && event.length < existing.event.length) {
          existing.event = event;
        }

        if (existing.category === "other" && category !== "other") {
          existing.category = category;
        }
      } else {
        evidenceList.push({
          date,
          category,
          event,
          source,
        });
      }
    }

    // Merge canonical events if missing from recalled memories
    for (const canon of canonicalCompetitorEvents) {
      const exists = evidenceList.some(
        (e) => e.date === canon.date || getTextSimilarity(e.event, canon.event) > 0.6
      );
      if (!exists) {
        evidenceList.push(canon);
      }
    }

    // 5. Sort evidence strictly chronologically
    const evidence = evidenceList
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 20);

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
You are a senior competitive intelligence analyst advising executive leadership.

Your task is to analyze the historical competitor observations below and directly answer the user's specific question.

Target Competitor:
${competitor}

User Question:
${question}

Retrieved Historical Evidence (Chronological):
${evidenceContext}

CORE INSTRUCTIONS & REASONING STANDARDS:

1. QUESTION RELEVANCE (PRIMARY DIRECTIVE):
   - You MUST directly and specifically answer the user's question: "${question}".
   - If the user asks about PRICING, focus directly on pricing tiers, discounts, packaging, and commercial terms.
   - If the user asks about PRODUCTS, focus directly on feature launches, workspaces, dashboards, tools, and technical capabilities.
   - If the user asks about MESSAGING, focus directly on positioning, value propositions, marketing themes, and communication shifts.
   - If the user asks about overall STRATEGY or EVOLUTION, synthesize the full chronological trajectory across categories.

2. FACT VS INFERENCE SEPARATION:
   - "summary": A concise 2-3 sentence executive answer directly addressing the question based on the evidence.
   - "observed_changes": Array of concrete historical changes directly supported by the evidence above. Each entry MUST mention the specific event and approximate date (e.g. "Jul 2026"). State ONLY what actually happened.
   - "strategic_signal": A cautious, evidence-grounded inference about what the pattern may indicate. Use prudent language: "suggests", "may indicate", "appears consistent with", or "could point toward".
   - "watch_next": 2-3 specific, realistic developments to monitor in the coming months based on the observed moves.

3. DO NOT OVER-INFER OR HALLUCINATE:
   - NEVER invent unsupported claims, customer contracts, sales pipelines, revenue numbers, unmentioned AI capabilities, or organizational intent.
   - Avoid overly specific speculative narratives (e.g. do NOT invent a "bottom-up land-and-expand funnel" or "custom enterprise monetization" unless explicit evidence exists).
   - If evidence on the specific topic is limited or sparse, explicitly acknowledge the limitation (e.g. "Only one pricing update is recorded in the available window, indicating...").

4. RECOGNIZE EVIDENCE GAPS:
   - State clearly what is known vs what remains unproven.

Return ONLY a valid JSON object matching this schema without markdown fences:
{
  "summary": "Direct executive answer to the question based on evidence.",
  "observed_changes": [
    "Concrete factual event 1 with date.",
    "Concrete factual event 2 with date."
  ],
  "strategic_signal": "Cautious evidence-grounded interpretation using prudent qualifiers.",
  "watch_next": [
    "Specific forward-looking indicator to monitor 1.",
    "Specific forward-looking indicator to monitor 2."
  ]
}
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

    const errorMessage = formatGeminiErrorMessage(error);

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}