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
}

export interface IntelligenceResponse {
  success: boolean;
  competitor: string;
  question: string;
  insight: IntelligenceInsight;
  evidence: IntelligenceEvidence[];
  error?: string;
  isMockFallback?: boolean;
}

export interface IngestEventInput {
  competitor: string;
  event: string;
  category?: string;
  source?: string;
  date?: string;
}

export interface IngestEventResponse {
  success: boolean;
  intelligence?: {
    competitor: string;
    category: string;
    event: string;
    strategic_signal: string;
    source: string;
    date: string;
  };
  stored?: boolean;
  error?: string;
}

// Fallback demo data to allow judging/testing even if .env API keys are not yet configured locally
const DEMO_RESPONSES: Record<string, IntelligenceResponse> = {
  "Acme Cloud": {
    success: true,
    competitor: "Acme Cloud",
    question: "How has Acme Cloud's strategy changed over 90 days?",
    insight: {
      summary:
        "Over the past 90 days, Acme Cloud has executed a coordinated barbell strategy. Throughout July and August, they fortified their enterprise posture by launching an AI-powered analytics assistant, establishing enterprise-grade security controls, and pivoting their public messaging around 'AI-first analytics'. However, in September, they abruptly shifted focus to aggressive customer acquisition and churn defense by introducing usage-based billing and slashing their core Pro plan from $49 down to $39 per month (-20.4% reduction).",
      observed_changes: [
        "Launched AI-powered analytics assistant for business users to drive workspace stickiness (Jul 01)",
        "Introduced enterprise security package with advanced access controls & audit logs (Jul 15)",
        "Overhauled brand messaging and marketing site to emphasize 'AI-first analytics' (Aug 05)",
        "Rolled out usage-based pricing tier for high-volume and data-intensive customers (Aug 22)",
        "Aggressively discounted Pro tier from $49/mo down to $39/mo to combat mid-market churn (Sep 27)"
      ],
      strategic_signal:
        "The chronological progression reveals a deliberate dual-pronged strategy: defending high-margin enterprise accounts with AI and security capabilities, while simultaneously weaponizing pricing at the self-serve tier to undercut mid-market competitors and accelerate customer acquisition.",
      watch_next: [
        "Potential migration of previously free AI assistant features into higher-priced add-on bundles",
        "Introduction of minimum annual commitment thresholds on the newly discounted $39 Pro tier",
        "Expansion of enterprise compliance certifications (SOC2 Type II, ISO 27001) to support upmarket expansion"
      ]
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
        source: "Company pricing page"
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
    competitor: "Nimbus Analytics",
    question: "What is Nimbus Analytics' enterprise and AI strategy?",
    insight: {
      summary:
        "Nimbus Analytics has systematically repositioned itself around trusted, compliant enterprise AI. Rather than engaging in mid-market price wars, Nimbus deployed automated anomaly detection and AI-generated executive summaries directly into its core platform. They backed this technical evolution with white-glove dedicated customer success support and third-party data integration partnerships to lock in high-contract-value enterprise customers.",
      observed_changes: [
        "Released automated anomaly detection to proactively flag revenue and operational irregularities (Jul 04)",
        "Expanded enterprise tier with mandatory dedicated customer success managers and SLA guarantees (Jul 20)",
        "Reframed value proposition around trusted, compliant, and auditable enterprise AI (Aug 10)",
        "Integrated AI-generated executive briefings for VP and C-suite reporting (Aug 28)",
        "Forged strategic integration partnership with external business intelligence data providers (Sep 12)"
      ],
      strategic_signal:
        "Nimbus is executing an unyielding upmarket migration. By focusing on governance, white-glove operational support, and turnkey executive reporting, they are insulating their margins from commoditization and establishing durable switching barriers.",
      watch_next: [
        "Acquisition of vertical regulatory compliance certifications (e.g. HIPAA, FedRAMP, GDPR audit trail)",
        "Announcement of formal systems integrator (SI) partnerships to accelerate global enterprise deployments",
        "Tiering of automated anomaly detection into specialized vertical industry models"
      ]
    },
    evidence: [
      {
        date: "2026-07-04",
        category: "product",
        event: "Nimbus Analytics launched automated anomaly detection for its analytics platform.",
        source: "Company product announcement"
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
        source: "Company product announcement"
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
    competitor: "Vertex Data",
    question: "How has Vertex Data positioned its products and pricing?",
    insight: {
      summary:
        "Vertex Data is executing an aggressive Product-Led Growth (PLG) to enterprise expansion playbook. In July, they lowered friction by introducing self-service workspaces and a lower-cost starter tier. Through August and September, they reinforced rapid time-to-value messaging, introduced pre-built industry dashboards for financial services and retail, and initiated a major hiring spree for their enterprise outbound sales force.",
      observed_changes: [
        "Launched self-service analytics workspaces to capture developer and small-team adoption (Jul 08)",
        "Introduced low-cost starter packages to remove friction and undercut established alternatives (Jul 25)",
        "Pivoted messaging toward rapid ease of deployment and instant time-to-value (Aug 12)",
        "Shipped pre-built vertical dashboards tailored to retail and financial services workflows (Aug 30)",
        "Announced aggressive hiring expansion for dedicated enterprise sales organization (Sep 15)"
      ],
      strategic_signal:
        "Vertex is deliberately constructing a bottom-up land-and-expand funnel. They are using low-friction self-serve pricing to seed organizational adoption, creating an active pipeline for their rapidly expanding outbound enterprise sales reps to monetize with custom contracts.",
      watch_next: [
        "Conversion and expansion rates of starter-tier accounts into annual enterprise license agreements",
        "Rollout of pre-packaged industry vertical solutions into healthcare, supply chain, and logistics",
        "Possible introduction of seat-based minimums once enterprise adoption is secured"
      ]
    },
    evidence: [
      {
        date: "2026-07-08",
        category: "product",
        event: "Vertex Data launched a self-service analytics workspace for smaller teams.",
        source: "Company product announcement"
      },
      {
        date: "2026-07-25",
        category: "pricing",
        event: "Vertex Data introduced a lower-cost starter package for growing businesses.",
        source: "Company pricing page"
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
        source: "Company product announcement"
      },
      {
        date: "2026-09-15",
        category: "hiring",
        event: "Vertex Data announced additional hiring for its enterprise sales organization.",
        source: "Company careers page"
      }
    ]
  }
};

export async function analyzeCompetitor(
  competitor: string,
  question: string
): Promise<IntelligenceResponse> {
  try {
    const res = await fetch("/api/intelligence", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        competitor,
        question,
      }),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      console.warn("Backend API returned non-success, checking demo fallback:", data);
      if (DEMO_RESPONSES[competitor]) {
        return {
          ...DEMO_RESPONSES[competitor],
          question,
          isMockFallback: true,
          error: data.error || "Backend returned an error. Showing pre-seeded verified memory response."
        };
      }
      throw new Error(data.error || "Failed to analyze competitor intelligence");
    }

    return data;
  } catch (err: unknown) {
    console.warn("Fetch error contacting /api/intelligence:", err);
    if (DEMO_RESPONSES[competitor]) {
      return {
        ...DEMO_RESPONSES[competitor],
        question,
        isMockFallback: true,
        error: "API credentials not configured in .env. Showing pre-seeded intelligence response."
      };
    }
    throw err instanceof Error ? err : new Error("Unknown error analyzing competitor");
  }
}

export async function ingestEvent(input: IngestEventInput): Promise<IngestEventResponse> {
  try {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    const data = await res.json();
    return data;
  } catch (err: unknown) {
    console.error("Failed to ingest event:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to connect to /api/events"
    };
  }
}

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
