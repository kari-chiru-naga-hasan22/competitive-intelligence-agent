export interface IntelligenceEvidence {
  date: string;
  category: string;
  event: string;
  source?: string;
}

export interface IntelligenceInsight {
  summary: string;
  observed_changes: string[];
  strategic_signal: string;
  watch_next: string[];
  confidence?: number;
}

export type IntelligenceStatus = "LIVE" | "SEEDED" | "NO_EVIDENCE" | "ERROR";

export interface IntelligenceResponse {
  success: boolean;
  status: IntelligenceStatus;
  competitor: string;
  question: string;
  insight: IntelligenceInsight;
  evidence: IntelligenceEvidence[];
  hasPriorObservation?: boolean;
  priorObservationCount?: number;
  error?: string;
  code?: string;
}

export interface IngestEventInput {
  competitor?: string;
  company?: string;
  event: string;
  category?: string;
  source?: string;
  date?: string;
}

export interface IngestEventResponse {
  success: boolean;
  event?: {
    competitor: string;
    category: string;
    event: string;
    source: string;
    date: string;
  };
  stored?: boolean;
  error?: string;
  code?: string;
}

export interface HistoryItem {
  id: string;
  competitor: string;
  question: string;
  summary: string;
  timestamp: string;
  status: "LIVE" | "SEEDED";
  response: IntelligenceResponse;
}

// Pre-seeded archive data for explicit offline evaluation / fallback
export const SEEDED_ARCHIVES: Record<string, IntelligenceResponse> = {
  "Acme Cloud": {
    success: true,
    status: "SEEDED",
    competitor: "Acme Cloud",
    question: "What changed in their strategy?",
    insight: {
      summary:
        "Over the past 90 days, Acme Cloud executed a coordinated barbell strategy: fortifying its high-margin enterprise base with dedicated security controls and an AI analytics assistant, while slashing its self-serve Pro tier from $49 down to $39/mo (-20.4%) to defend against mid-market churn.",
      observed_changes: [
        "Launched AI-powered analytics assistant for business users (Jul 01)",
        "Introduced enterprise security package with advanced access controls & audit logs (Jul 15)",
        "Overhauled brand messaging to emphasize 'AI-first analytics' (Aug 05)",
        "Rolled out usage-based pricing tier for high-volume customers (Aug 22)",
        "Aggressively discounted Pro tier from $49/mo down to $39/mo to combat churn (Sep 27)"
      ],
      strategic_signal:
        "Chronological movements indicate deliberate margin defense up-market coupled with price weaponization at the bottom to choke off competing entry-level alternatives.",
      watch_next: [
        "Potential migration of previously free AI assistant features into higher-priced add-on bundles",
        "Introduction of minimum annual commitment thresholds on the newly discounted $39 Pro tier",
        "Expansion of enterprise compliance certifications (SOC2 Type II, ISO 27001)"
      ],
      confidence: 88
    },
    evidence: [
      {
        date: "2026-07-01",
        category: "product",
        event: "Acme Cloud launched an AI-powered analytics assistant for business users.",
        source: "Company website"
      },
      {
        date: "2026-07-15",
        category: "enterprise",
        event: "Acme Cloud introduced an enterprise security package with advanced access controls.",
        source: "Company website"
      },
      {
        date: "2026-08-05",
        category: "messaging",
        event: "Acme Cloud began emphasizing AI-first analytics in its product messaging.",
        source: "Company website"
      },
      {
        date: "2026-08-22",
        category: "pricing",
        event: "Acme Cloud introduced a usage-based pricing option for high-volume customers.",
        source: "Pricing page"
      },
      {
        date: "2026-09-27",
        category: "pricing",
        event: "Acme Cloud reduced its Pro plan from $49 to $39 per month.",
        source: "Company website"
      }
    ]
  },
  "Nimbus Analytics": {
    success: true,
    status: "SEEDED",
    competitor: "Nimbus Analytics",
    question: "What is Nimbus Analytics' enterprise and AI strategy?",
    insight: {
      summary:
        "Nimbus Analytics has systematically repositioned itself around trusted, compliant enterprise AI. They deployed automated anomaly detection and AI-generated executive summaries directly into their platform, backing it with mandatory customer success SLAs and third-party data integration partnerships to lock in high-contract-value enterprise accounts.",
      observed_changes: [
        "Released automated anomaly detection to proactively flag irregularities (Jul 04)",
        "Expanded enterprise tier with dedicated customer success managers & SLAs (Jul 20)",
        "Reframed value proposition around trusted, compliant, and auditable enterprise AI (Aug 10)",
        "Integrated AI-generated executive briefings for C-suite reporting (Aug 28)",
        "Forged strategic integration partnership with external business data providers (Sep 12)"
      ],
      strategic_signal:
        "Nimbus is executing an unyielding upmarket migration. By focusing on governance, white-glove operational support, and turnkey executive reporting, they are insulating margins from commoditization.",
      watch_next: [
        "Acquisition of vertical regulatory compliance certifications (HIPAA, FedRAMP, GDPR audit trail)",
        "Announcement of formal systems integrator (SI) partnerships for global enterprise deployments",
        "Tiering of automated anomaly detection into specialized vertical industry models"
      ],
      confidence: 86
    },
    evidence: [
      {
        date: "2026-07-04",
        category: "product",
        event: "Nimbus Analytics launched automated anomaly detection for its analytics platform.",
        source: "Product announcement"
      },
      {
        date: "2026-07-20",
        category: "packaging",
        event: "Nimbus Analytics expanded its enterprise plan with dedicated customer success support.",
        source: "Company website"
      },
      {
        date: "2026-08-10",
        category: "messaging",
        event: "Nimbus Analytics began positioning its platform around trusted enterprise AI.",
        source: "Company website"
      },
      {
        date: "2026-08-28",
        category: "product",
        event: "Nimbus Analytics added AI-generated executive reports to its platform.",
        source: "Product announcement"
      },
      {
        date: "2026-09-12",
        category: "partnership",
        event: "Nimbus Analytics announced a partnership focused on integrating external business data.",
        source: "Company announcement"
      }
    ]
  },
  "Vertex Data": {
    success: true,
    status: "SEEDED",
    competitor: "Vertex Data",
    question: "How has Vertex Data positioned its products and pricing?",
    insight: {
      summary:
        "Vertex Data is executing an aggressive Product-Led Growth (PLG) to enterprise expansion playbook. They introduced self-service workspaces and lower-cost starter tiers, reinforced rapid time-to-value messaging, shipped pre-built vertical dashboards, and launched a hiring expansion for dedicated outbound enterprise sales reps.",
      observed_changes: [
        "Launched self-service analytics workspaces for developer and small-team adoption (Jul 08)",
        "Introduced low-cost starter packages to remove friction and undercut alternatives (Jul 25)",
        "Pivoted messaging toward rapid ease of deployment and faster time to value (Aug 12)",
        "Shipped pre-built vertical dashboards tailored to retail and financial services (Aug 30)",
        "Announced aggressive hiring expansion for dedicated enterprise sales organization (Sep 15)"
      ],
      strategic_signal:
        "Vertex is deliberately constructing a bottom-up land-and-expand funnel. They use low-friction self-serve pricing to seed organizational adoption, creating an active pipeline for their rapidly expanding outbound enterprise sales organization to monetize with custom contracts.",
      watch_next: [
        "Conversion and expansion rates of starter-tier accounts into annual enterprise license agreements",
        "Rollout of pre-packaged industry vertical solutions into healthcare, supply chain, and logistics",
        "Possible introduction of seat-based minimums once enterprise adoption is secured"
      ],
      confidence: 84
    },
    evidence: [
      {
        date: "2026-07-08",
        category: "product",
        event: "Vertex Data launched a self-service analytics workspace for smaller teams.",
        source: "Product announcement"
      },
      {
        date: "2026-07-25",
        category: "pricing",
        event: "Vertex Data introduced a lower-cost starter package for growing businesses.",
        source: "Pricing page"
      },
      {
        date: "2026-08-12",
        category: "messaging",
        event: "Vertex Data increased its messaging around ease of deployment and faster time to value.",
        source: "Company website"
      },
      {
        date: "2026-08-30",
        category: "product",
        event: "Vertex Data added pre-built industry dashboards for retail and financial services.",
        source: "Product announcement"
      },
      {
        date: "2026-09-15",
        category: "hiring",
        event: "Vertex Data announced additional hiring for its enterprise sales organization.",
        source: "Careers page"
      }
    ]
  }
};

/**
 * Perform competitive analysis.
 * NEVER silently substitutes mock data as live intelligence (Phase 3 requirement).
 */
export async function analyzeCompetitor(
  competitor: string,
  question: string,
  options?: { forceSeededArchive?: boolean }
): Promise<IntelligenceResponse> {
  // If user explicitly requests to load the pre-seeded benchmark archive
  if (options?.forceSeededArchive && SEEDED_ARCHIVES[competitor]) {
    const seeded = {
      ...SEEDED_ARCHIVES[competitor],
      question,
      status: "SEEDED" as const,
    };
    saveHistoryItem(seeded);
    return seeded;
  }

  try {
    const res = await fetch("/api/intelligence", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ competitor, question }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      const err = new Error(data.error || "Failed to analyze competitor intelligence");
      (err as { code?: string }).code = data.code || "PIPELINE_ERROR";
      throw err;
    }

    // Persist real analysis to client-side localStorage history
    saveHistoryItem(data);

    return data;
  } catch (err: unknown) {
    console.error("[api] Intelligence request failed:", err);
    throw err;
  }
}

/**
 * Ingest a competitor event into Hindsight memory
 */
export async function ingestEvent(input: IngestEventInput): Promise<IngestEventResponse> {
  try {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        competitor: input.competitor || input.company,
        event: input.event,
        category: input.category,
        source: input.source,
        date: input.date,
      }),
    });

    const data = await res.json();
    return data;
  } catch (err: unknown) {
    console.error("[api] Failed to ingest event:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to connect to /api/events",
      code: "NETWORK_ERROR",
    };
  }
}

/**
 * Check diagnostics for Gemini & Hindsight
 */
export async function checkDiagnostics() {
  const results = {
    gemini: { status: "unknown", message: "" },
    hindsight: { status: "unknown", message: "" },
  };

  try {
    const geminiRes = await fetch("/api/gemini-test");
    const geminiData = await geminiRes.json();
    results.gemini = {
      status: geminiData.success ? "connected" : "error",
      message: geminiData.success ? (geminiData.response || "OK") : (geminiData.error || "Failed"),
    };
  } catch (e: unknown) {
    results.gemini = { status: "offline", message: e instanceof Error ? e.message : "Connection failed" };
  }

  try {
    const hindsightRes = await fetch("/api/hindsight-test");
    const hindsightData = await hindsightRes.json();
    results.hindsight = {
      status: hindsightData.success ? "connected" : "error",
      message: hindsightData.success ? "Memory bank verified" : (hindsightData.error || "Failed"),
    };
  } catch (e: unknown) {
    results.hindsight = { status: "offline", message: e instanceof Error ? e.message : "Connection failed" };
  }

  return results;
}

// ==========================================
// CLIENT-SIDE LOCAL STORAGE PERSISTENCE
// (Phase 11 & 12 requirement for history)
// ==========================================
const HISTORY_STORAGE_KEY = "cia_intelligence_history_v1";

export function getHistoryItems(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.warn("[api] Failed to read history from localStorage:", e);
    return [];
  }
}

export function saveHistoryItem(response: IntelligenceResponse): void {
  if (typeof window === "undefined" || !response || !response.competitor) return;
  try {
    const current = getHistoryItems();
    const item: HistoryItem = {
      id: `${response.competitor}-${Date.now()}`,
      competitor: response.competitor,
      question: response.question,
      summary: response.insight.summary,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", month: "short", day: "numeric" }),
      status: response.status === "SEEDED" ? "SEEDED" : "LIVE",
      response,
    };

    // Keep up to 25 items, prepend newest
    const updated = [item, ...current.filter((c) => c.competitor !== item.competitor || c.question !== item.question)].slice(0, 25);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("[api] Failed to save history to localStorage:", e);
  }
}

export function clearHistoryItems(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch (e) {
    console.warn("[api] Failed to clear history:", e);
  }
}

export function deleteHistoryItem(id: string): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getHistoryItems().filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(current));
    return current;
  } catch (e) {
    console.warn("[api] Failed to delete history item:", e);
    return [];
  }
}
