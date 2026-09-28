import { NextResponse } from "next/server";
import { generateGeminiContent, extractJsonObject } from "@/lib/gemini/client";
import {
  getHindsightClient,
  buildObservationMemoryContent,
  isHindsightConfigured,
} from "@/lib/hindsight";

const BANK_ID = "competitive-intelligence";

const MAX_COMPETITOR_LEN = 100;
const MAX_QUESTION_LEN = 500;

export type Evidence = {
  date: string;
  category: string;
  event: string;
  source?: string;
};

export type PriorObservation = {
  date: string;
  question?: string;
  signal: string;
  summary: string;
};

function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

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

function isCompetitorMatch(text: string, competitorQuery: string): boolean {
  const normQuery = normalizeText(competitorQuery);
  const normText = normalizeText(text);

  if (!normQuery || !normText) return false;

  // Direct normalized match
  if (normText.includes(normQuery)) return true;

  // Extract explicit competitor field if present in canonical memory text
  const storedMatch = text.match(/^Competitor:\s*([^\n|]+)/im);
  const normStored = storedMatch ? normalizeText(storedMatch[1]) : "";

  if (normStored) {
    if (normQuery.includes(normStored) || normStored.includes(normQuery)) {
      return true;
    }
  }

  // Token-level overlap
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

interface RawMemoryItem {
  text?: string | null;
  context?: string | null;
  occurred_start?: string | null;
  entities?: string[] | null;
  [key: string]: unknown;
}

export async function POST(request: Request) {
  try {
    // 1. Validate Input & Security
    const body = await request.json().catch(() => ({}));
    const { competitor, question } = body;

    if (!competitor || typeof competitor !== "string" || !competitor.trim()) {
      return NextResponse.json(
        { success: false, error: "Competitor name is required", code: "INVALID_INPUT" },
        { status: 400 }
      );
    }

    if (!question || typeof question !== "string" || !question.trim()) {
      return NextResponse.json(
        { success: false, error: "Intelligence question is required", code: "INVALID_INPUT" },
        { status: 400 }
      );
    }

    const cleanCompetitor = competitor.trim().slice(0, MAX_COMPETITOR_LEN);
    const cleanQuestion = question.trim().slice(0, MAX_QUESTION_LEN);

    // 2. Check Service Configurations
    if (!isHindsightConfigured()) {
      console.warn("[intelligence] HINDSIGHT_API_KEY is not configured.");
      return NextResponse.json(
        {
          success: false,
          error: "Hindsight memory engine is not configured. Set HINDSIGHT_API_KEY in .env.local to enable live recall.",
          code: "HINDSIGHT_UNAVAILABLE",
        },
        { status: 503 }
      );
    }

    const hindsight = getHindsightClient();

    // 3. Multi-Query Temporal Recall from Hindsight
    console.log(`[intelligence] Recalling memory for: "${cleanCompetitor}" query: "${cleanQuestion}"`);

    const [eventRecall, observationRecall] = await Promise.all([
      hindsight.recall(
        BANK_ID,
        `${cleanCompetitor}: ${cleanQuestion} pricing product launch packaging strategy`,
        { maxTokens: 2000, budget: "low" }
      ).catch((err) => {
        console.error("[intelligence] Event recall failed:", err);
        return { results: [] };
      }),
      hindsight.recall(
        BANK_ID,
        `${cleanCompetitor}: strategic observation previous analysis history trajectory`,
        { maxTokens: 1200, budget: "low" }
      ).catch((err) => {
        console.error("[intelligence] Observation recall failed:", err);
        return { results: [] };
      }),
    ]);

    const rawMemories: RawMemoryItem[] = [
      ...(eventRecall.results || []),
      ...(observationRecall.results || []),
    ];

    // 4. Memory Isolation & Deduplication
    const uniqueMemoryTexts = new Set<string>();
    const competitorMemories = rawMemories.filter((mem) => {
      const text = mem.text?.trim();
      if (!text) return false;
      if (!isCompetitorMatch(text, cleanCompetitor)) return false;
      const lower = text.toLowerCase();
      if (uniqueMemoryTexts.has(lower)) return false;
      uniqueMemoryTexts.add(lower);
      return true;
    });

    // 5. Partition into Factual Evidence vs Prior Strategic Observations
    const evidenceList: Evidence[] = [];
    const priorObservations: PriorObservation[] = [];

    for (const mem of competitorMemories) {
      const text = mem.text || "";

      // Check if this memory is a previously stored strategic observation
      const isObservation =
        text.includes("Category: strategic-observation") ||
        mem.context === "competitive-intelligence-observation" ||
        text.includes("Strategic Signal:");

      if (isObservation) {
        const signalMatch = text.match(/Strategic Signal:\s*([^\n]+)/i);
        const summaryMatch = text.match(/Observation Summary:\s*([^\n]+)/i);
        const dateMatch = text.match(/Date:\s*(\d{4}-\d{2}-\d{2})/i);
        const qMatch = text.match(/Question:\s*([^\n]+)/i);

        if (signalMatch?.[1] || summaryMatch?.[1]) {
          priorObservations.push({
            date: dateMatch?.[1] || "earlier",
            signal: signalMatch?.[1]?.trim() || "",
            summary: summaryMatch?.[1]?.trim() || "",
            question: qMatch?.[1]?.trim(),
          });
          continue;
        }
      }

      // Factual Event Parsing
      let date = "";
      const dateMatch = text.match(/(?:When:|Date:)\s*(\d{4}-\d{2}-\d{2})/i);
      if (dateMatch?.[1]) {
        date = dateMatch[1];
      } else if (mem.occurred_start) {
        date = mem.occurred_start.slice(0, 10);
      } else {
        const isoMatch = text.match(/\b\d{4}-\d{2}-\d{2}\b/);
        date = isoMatch?.[0] || "date unknown";
      }

      const catMatch = text.match(/^Category:\s*([^\n|]+)/im);
      let category = catMatch?.[1]?.trim().toLowerCase() || "product";

      const lowerText = text.toLowerCase();
      if (lowerText.includes("price") || lowerText.includes("pricing") || lowerText.includes("tier")) {
        category = "pricing";
      } else if (lowerText.includes("messaging") || lowerText.includes("positioning") || lowerText.includes("rebrand")) {
        category = "messaging";
      } else if (lowerText.includes("security") || lowerText.includes("enterprise") || lowerText.includes("audit")) {
        category = "enterprise";
      } else if (lowerText.includes("partnership") || lowerText.includes("integration")) {
        category = "partnership";
      }

      const eventLineMatch = text.match(/^Event:\s*([^\n]+)/im);
      const event = eventLineMatch
        ? eventLineMatch[1].trim()
        : text
            .replace(/^Competitor:.*$/im, "")
            .replace(/^Category:.*$/im, "")
            .replace(/^Source:.*$/im, "")
            .replace(/^Date:.*$/im, "")
            .replace(/^Strategic signal:.*$/im, "")
            .trim();

      if (!event) continue;

      const sourceMatch = text.match(/^Source:\s*([^\n]+)/im);
      const source = sourceMatch?.[1]?.trim() || mem.context || "Public Company Channels";

      // Deduplicate near-identical events
      const isDuplicate = evidenceList.some(
        (e) => e.date === date && e.category === category && getTextSimilarity(e.event, event) >= 0.65
      );

      if (!isDuplicate) {
        evidenceList.push({ date, category, event, source });
      }
    }

    // Sort chronologically
    const datedEvidence = evidenceList
      .filter((e) => e.date !== "date unknown")
      .sort((a, b) => a.date.localeCompare(b.date));
    const undatedEvidence = evidenceList.filter((e) => e.date === "date unknown");
    const evidence = [...datedEvidence, ...undatedEvidence].slice(0, 12);

    // 6. Handle Zero Evidence (Phase 9 requirement)
    if (evidence.length === 0) {
      return NextResponse.json({
        success: true,
        status: "NO_EVIDENCE",
        competitor: cleanCompetitor,
        question: cleanQuestion,
        insight: {
          summary: `No company-specific historical evidence is currently stored for ${cleanCompetitor}.`,
          observed_changes: [],
          strategic_signal: `Insufficient historical baseline to infer ${cleanCompetitor}'s strategy.`,
          watch_next: [
            `Add events for ${cleanCompetitor} using the '+ Add Event' modal to establish persistent memory.`,
            `Monitor public product announcements and pricing pages for initial baseline data.`,
          ],
          confidence: 0,
        },
        evidence: [],
        hasPriorObservation: false,
      });
    }

    // 7. Format Context for Gemini (incorporating Prior Knowledge from Hindsight!)
    const evidenceContext = evidence
      .map(
        (item, index) =>
          `[Event ${index + 1}] Date: ${item.date} | Category: ${item.category} | Source: ${item.source || "Web"}\nFact: ${item.event}`
      )
      .join("\n\n");

    const priorKnowledgeContext =
      priorObservations.length > 0
        ? `\n\nPREVIOUS STRATEGIC OBSERVATIONS RECALLED FROM MEMORY:
${priorObservations
  .slice(0, 3)
  .map(
    (obs, i) =>
      `Observation ${i + 1} (${obs.date}):
Question Analyzed: "${obs.question || "N/A"}"
Prior Inferred Signal: ${obs.signal}
Prior Summary: ${obs.summary}`
  )
  .join("\n\n")}`
        : "\n\nPREVIOUS STRATEGIC OBSERVATIONS: None on file (Initial baseline analysis).";

    // 8. Synthesize with Gemini
    const prompt = `You are a Principal Competitive Intelligence Analyst.

Analyze the accumulated chronological competitor intelligence below.

TARGET COMPANY:
${cleanCompetitor}

USER INTELLIGENCE QUESTION:
${cleanQuestion}

HISTORICAL EVIDENCE LOG (Factual Grounding):
${evidenceContext}
${priorKnowledgeContext}

Analyze the trajectory and return ONLY a valid JSON object matching this exact schema:
{
  "summary": "Concise 2-3 sentence executive synthesis directly addressing the user's question, contrasting earlier moves with recent actions.",
  "observed_changes": [
    "Factual change 1 directly evidenced above with date/detail",
    "Factual change 2 directly evidenced above with date/detail",
    "Factual change 3 directly evidenced above with date/detail"
  ],
  "strategic_signal": "A single cautious, high-conviction strategic inference explaining what the pattern indicates (use 'indicates', 'suggests', or 'appears consistent with').",
  "watch_next": [
    "Specific forward-looking indicator or milestone to monitor",
    "Specific pricing or feature barrier to track"
  ],
  "confidence": 85
}

CRITICAL RULES:
1. Ground observed_changes EXCLUSIVELY in the provided evidence. Never fabricate dates, pricing, or product names.
2. strategic_signal MUST be an analytical inference, clearly distinguished from observed facts.
3. If previous strategic observations are provided, EXPLICITLY reference how the newest evidence confirms, shifts, or evolves that prior baseline trajectory.
4. Calculate a realistic confidence score (0-100) based on evidence density and clarity.`;

    let insight;
    try {
      const geminiResponse = await generateGeminiContent(prompt, {
        responseMimeType: "application/json",
      });

      const rawText = geminiResponse.text?.trim() || "";
      insight = extractJsonObject<{
        summary: string;
        observed_changes: string[];
        strategic_signal: string;
        watch_next: string[];
        confidence?: number;
      }>(rawText);
    } catch (llmErr) {
      console.error("[intelligence] Gemini generation/parsing failed:", llmErr);
      return NextResponse.json(
        {
          success: false,
          error: "Strategic reasoning engine failed to synthesize intelligence.",
          code: (llmErr as { code?: string })?.code || "LLM_PARSE_ERROR",
        },
        { status: 502 }
      );
    }

    // Ensure safe defaults
    const confidenceScore =
      typeof insight.confidence === "number" && insight.confidence > 0
        ? insight.confidence
        : Math.min(95, 50 + evidence.length * 8);

    // 9. COMPLETE THE FEEDBACK LOOP: RETAIN THE GENERATED OBSERVATION (Phase 6 requirement)
    try {
      const observationMemory = buildObservationMemoryContent({
        competitor: cleanCompetitor,
        question: cleanQuestion,
        summary: insight.summary,
        strategicSignal: insight.strategic_signal,
        observedChanges: insight.observed_changes || [],
      });

      await hindsight.retain(BANK_ID, observationMemory, {
        context: "competitive-intelligence-observation",
        timestamp: new Date(),
      });
      console.log(`[intelligence] Successfully retained strategic observation for ${cleanCompetitor} in Hindsight.`);
    } catch (retainErr) {
      console.warn("[intelligence] Non-critical: Failed to retain observation in Hindsight:", retainErr);
    }

    // 10. Return clean live intelligence
    return NextResponse.json({
      success: true,
      status: "LIVE",
      competitor: cleanCompetitor,
      question: cleanQuestion,
      insight: {
        summary: insight.summary,
        observed_changes: insight.observed_changes || [],
        strategic_signal: insight.strategic_signal,
        watch_next: insight.watch_next || [],
        confidence: confidenceScore,
      },
      evidence,
      hasPriorObservation: priorObservations.length > 0,
      priorObservationCount: priorObservations.length,
    });
  } catch (error) {
    console.error("[intelligence] Unexpected error in intelligence route:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error processing intelligence query",
        code: "INTERNAL_ERROR",
      },
      { status: 500 }
    );
  }
}