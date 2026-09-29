import { NextResponse } from "next/server";
import { generateGeminiContent, extractJsonObject } from "@/lib/gemini/client";
import {
  getHindsightClient,
  buildObservationMemoryContent,
  isHindsightConfigured,
} from "@/lib/hindsight";
import { getFile } from "@/lib/fileStore";
import { conductWebResearchAndIngest, getCachedWebEvidence } from "@/lib/webResearch";
import { computeSignalBreakdown, computeTrajectorySeries, computeStrategicMomentum } from "@/lib/reportAnalytics";

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

export interface AttachmentInput {
  id?: string;
  name: string;
  size?: number;
  type?: string;
  content?: string;
}

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
  const startTime = Date.now();
  const executionSteps: string[] = [];

  try {
    // 1. Validate Input & Security
    const body = await request.json().catch(() => ({}));
    const {
      competitor,
      question,
      attachments = [],
      fileIds = [],
      enableWebSearch = false,
    } = body;

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
    executionSteps.push(`Identified competitor: ${cleanCompetitor}`);

    // Process attached documents
    const processedAttachments: Array<{ name: string; text: string }> = [];
    if (Array.isArray(fileIds) && fileIds.length > 0) {
      for (const fId of fileIds) {
        const fileRef = getFile(fId);
        if (fileRef) {
          processedAttachments.push({ name: fileRef.name, text: fileRef.text });
        }
      }
    }

    if (Array.isArray(attachments)) {
      for (const att of attachments) {
        if (att.content && !processedAttachments.some(p => p.name === att.name)) {
          processedAttachments.push({ name: att.name, text: att.content });
        } else if (att.id) {
          const fileRef = getFile(att.id);
          if (fileRef && !processedAttachments.some(p => p.name === fileRef.name)) {
            processedAttachments.push({ name: fileRef.name, text: fileRef.text });
          }
        }
      }
    }

    if (processedAttachments.length > 0) {
      executionSteps.push(
        `Processed ${processedAttachments.length} attached document(s): ${processedAttachments.map(p => p.name).join(", ")}`
      );
    }

    // 2. Check Service Configurations
    const hindsightReady = isHindsightConfigured();
    let rawMemories: RawMemoryItem[] = [];

    if (hindsightReady) {
      const hindsight = getHindsightClient();
      console.log(`[intelligence] Recalling memory for: "${cleanCompetitor}" query: "${cleanQuestion}"`);

      try {
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

        rawMemories = [
          ...(eventRecall.results || []),
          ...(observationRecall.results || []),
        ];
        executionSteps.push(`Recalled ${rawMemories.length} memory records from Hindsight`);
      } catch (recallErr) {
        console.warn("[intelligence] Hindsight memory recall exception:", recallErr);
      }
    } else {
      console.warn("[intelligence] HINDSIGHT_API_KEY is not configured, checking local cache & web reconnaissance.");
    }

    // 3. Memory Isolation & Deduplication
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

    // 4. Partition into Factual Evidence vs Prior Strategic Observations
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

    // Also merge any runtime cached web evidence for this company
    const cachedWebEvents = getCachedWebEvidence(cleanCompetitor);
    for (const we of cachedWebEvents) {
      if (!evidenceList.some(e => e.date === we.date && getTextSimilarity(e.event, we.event) >= 0.65)) {
        evidenceList.push(we);
      }
    }

    // 5. LIVE WEB RESEARCH & INGESTION FOR UNDEFINED OR EMPTY COMPANIES
    let webReconPerformed = false;
    let webSourceSummary = "";

    if (evidenceList.length === 0 || enableWebSearch) {
      console.log(`[intelligence] Launching live web search reconnaissance for ${cleanCompetitor}...`);
      executionSteps.push(`Conducting live web reconnaissance across public domain for "${cleanCompetitor}"`);

      try {
        const webResearch = await conductWebResearchAndIngest(cleanCompetitor, cleanQuestion);
        if (webResearch.events.length > 0) {
          webReconPerformed = true;
          webSourceSummary = webResearch.sourceSummary;
          for (const we of webResearch.events) {
            if (!evidenceList.some(e => e.date === we.date && getTextSimilarity(e.event, we.event) >= 0.65)) {
              evidenceList.push(we);
            }
          }
          executionSteps.push(
            `Discovered ${webResearch.events.length} real-world events from public sources${
              webResearch.ingestedToHindsight ? " & retained into Hindsight memory" : ""
            }`
          );
        }
      } catch (searchErr) {
        console.warn(`[intelligence] Web search reconnaissance encountered error:`, searchErr);
      }
    }

    // Sort chronologically
    const datedEvidence = evidenceList
      .filter((e) => e.date !== "date unknown")
      .sort((a, b) => a.date.localeCompare(b.date));
    const undatedEvidence = evidenceList.filter((e) => e.date === "date unknown");
    const evidence = [...datedEvidence, ...undatedEvidence].slice(0, 16);

    // 6. Handle Zero Evidence & No Attachments
    if (evidence.length === 0 && processedAttachments.length === 0) {
      return NextResponse.json({
        success: true,
        status: "NO_EVIDENCE",
        competitor: cleanCompetitor,
        question: cleanQuestion,
        insight: {
          summary: `No public or historical evidence could be established for ${cleanCompetitor}.`,
          observed_changes: [],
          strategic_signal: `Insufficient data baseline to infer ${cleanCompetitor}'s strategy.`,
          watch_next: [
            `Attach relevant competitor PDFs, DOCX, or CSV files using the '📎 Add files' button.`,
            `Use the '+ Add Event' modal to manually log known company milestones.`,
            `Verify the company name spelling or target their parent organization.`,
          ],
          confidence: 0,
        },
        evidence: [],
        hasPriorObservation: false,
        agentExecution: {
          steps: executionSteps,
          durationMs: Date.now() - startTime,
        },
      });
    }

    // 7. Format Context for Gemini (incorporating Evidence, Attachments, & Prior Observations)
    const evidenceContext =
      evidence.length > 0
        ? evidence
            .map(
              (item, index) =>
                `[Event ${index + 1}] Date: ${item.date} | Category: ${item.category} | Source: ${item.source || "Web"}\nFact: ${item.event}`
            )
            .join("\n\n")
        : "No chronological event log on file (Relying on attached documentation).";

    const attachmentsContext =
      processedAttachments.length > 0
        ? `\n\nATTACHED USER DOCUMENTS / EVIDENCE (${processedAttachments.length} document${processedAttachments.length > 1 ? "s" : ""}):\n` +
          processedAttachments
            .map(
              (att, idx) =>
                `--- ATTACHMENT ${idx + 1}: ${att.name} ---\n${att.text.slice(0, 8000)}\n--- END ATTACHMENT ${idx + 1} ---`
            )
            .join("\n\n")
        : "";

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

    executionSteps.push(`Synthesizing strategic trajectory & inference with Gemini`);

    // 8. Synthesize with Gemini
    const prompt = `You are a Principal Competitive Intelligence Analyst.

Analyze the accumulated competitor intelligence and attached documents below.

TARGET COMPANY:
${cleanCompetitor}

USER INTELLIGENCE QUESTION:
${cleanQuestion}

HISTORICAL EVIDENCE LOG:
${evidenceContext}
${attachmentsContext}
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
1. Ground observed_changes EXCLUSIVELY in the provided evidence and attachments. Never fabricate dates or pricing.
2. strategic_signal MUST be an analytical inference, clearly distinguished from observed facts.
3. If attachments are provided, integrate their specific insights into the synthesis.
4. If previous strategic observations are provided, EXPLICITLY reference how newest moves evolve that baseline.
5. Calculate a realistic confidence score (0-100) based on evidence density and clarity.`;

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

    executionSteps.push(`Generated decision-ready intelligence dossier and visualizations`);

    // Ensure safe defaults
    const confidenceScore =
      typeof insight.confidence === "number" && insight.confidence > 0
        ? insight.confidence
        : Math.min(95, 50 + evidence.length * 7 + processedAttachments.length * 10);

    // 9. COMPLETE THE FEEDBACK LOOP: RETAIN THE GENERATED OBSERVATION (if Hindsight is configured)
    if (hindsightReady) {
      try {
        const hindsight = getHindsightClient();
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
    }

    // 10. Compute Structured Chart Payloads
    const breakdown = computeSignalBreakdown(evidence);
    const trajectory = computeTrajectorySeries(evidence);
    const momentum = computeStrategicMomentum(evidence);

    const charts = [
      {
        type: "trajectory",
        title: "Strategic Trajectory Over Time",
        data: trajectory.points,
        hasEnoughData: trajectory.hasEnoughData,
      },
      {
        type: "category_breakdown",
        title: "Category Signal Distribution",
        data: breakdown,
      },
      {
        type: "momentum",
        title: "Strategic Momentum Dimensions",
        data: momentum,
      },
    ];

    // 11. Return clean live intelligence with charts and agent execution metadata
    return NextResponse.json({
      success: true,
      status: webReconPerformed ? "LIVE_SEARCH" : "LIVE",
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
      charts,
      hasPriorObservation: priorObservations.length > 0,
      priorObservationCount: priorObservations.length,
      attachments: processedAttachments.map(p => ({ name: p.name })),
      agentExecution: {
        steps: executionSteps,
        durationMs: Date.now() - startTime,
        webReconPerformed,
        webSourceSummary,
      },
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