import { IntelligenceEvidence } from "./api";

export interface SignalCategoryMetric {
  category: string;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export interface TrajectoryPoint {
  label: string;
  enterprise: number;
  ai: number;
  security: number;
  pricing: number;
  product: number;
}

export interface StrategicShift {
  before: string;
  after: string;
  category: string;
}

export interface EvidenceInferencePair {
  date: string;
  event: string;
  category: string;
  source: string;
  impact: "High" | "Medium" | "Low";
  inference: string;
}

export interface BusinessMovementColumn {
  title: string;
  category: string;
  trend: "up" | "stable" | "down";
  trendLabel: string;
  items: string[];
}

export interface QualityMetrics {
  coverage: number;
  depth: number;
  consistency: number;
  hasEnoughData: boolean;
}

export interface StructuredWatchpoint {
  id: string;
  title: string;
  detail: string;
  priority: "HIGH" | "MEDIUM" | "WATCH";
}

// Format short date helper (e.g. 2026-09-27 -> 27 Sep)
export function formatReportDate(dateStr: string): string {
  if (!dateStr || dateStr === "date unknown") return "Recent";
  try {
    const parts = dateStr.split("-");
    if (parts.length < 3) return dateStr;
    const [, month, day] = parts;
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const mIdx = parseInt(month, 10) - 1;
    return `${day} ${months[mIdx] || month}`;
  } catch {
    return dateStr;
  }
}

// 1. Compute Category Signal Breakdown (Section 7)
export function computeSignalBreakdown(evidence: IntelligenceEvidence[]): SignalCategoryMetric[] {
  if (!evidence || evidence.length === 0) return [];

  const counts: Record<string, number> = {
    enterprise: 0,
    ai: 0,
    security: 0,
    product: 0,
    pricing: 0,
  };

  evidence.forEach((item) => {
    const cat = (item.category || "").toLowerCase();
    const evt = (item.event || "").toLowerCase();

    if (evt.includes("security") || evt.includes("sso") || evt.includes("soc2") || evt.includes("access")) {
      counts.security += 1;
    } else if (cat === "enterprise" || evt.includes("enterprise") || cat === "packaging") {
      counts.enterprise += 1;
    } else if (cat === "pricing" || evt.includes("price") || evt.includes("$") || evt.includes("plan")) {
      counts.pricing += 1;
    } else if (evt.includes("ai") || evt.includes("assistant") || evt.includes("anomaly")) {
      counts.ai += 1;
    } else {
      counts.product += 1;
    }
  });

  const total = Object.values(counts).reduce((acc, c) => acc + c, 0) || 1;

  const categories = [
    { category: "enterprise", label: "Enterprise Expansion", color: "#4F46E5" },
    { category: "ai", label: "AI & Intelligence", color: "#8B5CF6" },
    { category: "security", label: "Security & Compliance", color: "#059669" },
    { category: "pricing", label: "Pricing & Packaging", color: "#D97706" },
    { category: "product", label: "Core Capabilities", color: "#2563EB" },
  ];

  return categories
    .map((c) => ({
      category: c.category,
      label: c.label,
      count: counts[c.category] || 0,
      percentage: Math.round(((counts[c.category] || 0) / total) * 100),
      color: c.color,
    }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);
}

// 2. Compute Strategic Trajectory Over Time (Section 4)
export function computeTrajectorySeries(evidence: IntelligenceEvidence[]): {
  points: TrajectoryPoint[];
  hasEnoughData: boolean;
} {
  if (!evidence || evidence.length < 3) {
    return { points: [], hasEnoughData: false };
  }

  // Sort chronological
  const sorted = [...evidence].sort((a, b) => a.date.localeCompare(b.date));

  // Determine months
  const monthsMap = new Map<string, IntelligenceEvidence[]>();
  sorted.forEach((item) => {
    const monthKey = item.date ? item.date.slice(0, 7) : "2026-08";
    if (!monthsMap.has(monthKey)) monthsMap.set(monthKey, []);
    monthsMap.get(monthKey)!.push(item);
  });

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const sortedMonths = Array.from(monthsMap.keys()).sort();

  if (sortedMonths.length < 2) {
    // Artificial 3 intervals across dates for clean line
    return { points: [], hasEnoughData: false };
  }

  let runningEnterprise = 15;
  let runningAI = 10;
  let runningSecurity = 10;
  let runningPricing = 40;
  let runningProduct = 30;

  const points: TrajectoryPoint[] = sortedMonths.map((mKey) => {
    const items = monthsMap.get(mKey) || [];
    const [, mNum] = mKey.split("-");
    const mLabel = monthNames[parseInt(mNum, 10) - 1] || mKey;

    items.forEach((item) => {
      const cat = (item.category || "").toLowerCase();
      const evt = (item.event || "").toLowerCase();
      if (evt.includes("security") || evt.includes("sso") || evt.includes("soc2")) {
        runningSecurity = Math.min(95, runningSecurity + 16);
      } else if (cat === "enterprise" || evt.includes("enterprise")) {
        runningEnterprise = Math.min(95, runningEnterprise + 18);
      } else if (evt.includes("ai") || evt.includes("assistant")) {
        runningAI = Math.min(95, runningAI + 15);
      } else if (cat === "pricing" || evt.includes("price") || evt.includes("$")) {
        runningPricing = Math.max(15, runningPricing - 8);
      } else {
        runningProduct = Math.min(85, runningProduct + 10);
      }
    });

    return {
      label: mLabel.toUpperCase(),
      enterprise: runningEnterprise,
      ai: runningAI,
      security: runningSecurity,
      pricing: runningPricing,
      product: runningProduct,
    };
  });

  return { points, hasEnoughData: true };
}

// 3. Compute Strategic Shifts Before -> After (Section 5)
export function computeStrategicShifts(
  observedChanges: string[] = [],
  evidence: IntelligenceEvidence[] = []
): StrategicShift[] {
  const shifts: StrategicShift[] = [];

  // Derive from observed changes if provided
  if (observedChanges.length >= 2) {
    const beforeDefaults = [
      "Product-led mid-market posture",
      "Standard tier-based fixed pricing",
      "Basic standalone utility features",
      "Organic self-serve acquisition",
    ];

    observedChanges.slice(0, 4).forEach((change, idx) => {
      shifts.push({
        before: beforeDefaults[idx] || "Legacy single-tier focus",
        after: change,
        category: idx === 0 ? "Enterprise" : idx === 1 ? "Pricing" : "Product & AI",
      });
    });

    return shifts;
  }

  // Fallback to chronological evidence comparison
  const sorted = [...evidence].sort((a, b) => a.date.localeCompare(b.date));
  if (sorted.length >= 4) {
    const early = sorted.slice(0, 2);
    const recent = sorted.slice(-2);
    shifts.push({
      before: early[0].event,
      after: recent[1].event,
      category: "Positioning & Enterprise",
    });
    shifts.push({
      before: early[1].event,
      after: recent[0].event,
      category: "Commercial Model",
    });
  } else {
    shifts.push({
      before: "Standard market baseline",
      after: "Recent strategic modifications under active observation",
      category: "Strategy",
    });
  }

  return shifts;
}

// 4. Derive Inferences for Evidence (Section 6 & 13)
export function deriveInference(item: IntelligenceEvidence): string {
  const cat = (item.category || "").toLowerCase();
  const evt = (item.event || "").toLowerCase();

  if (evt.includes("reduce") || evt.includes("discount") || evt.includes("$39") || evt.includes("price cut")) {
    return "Aggressive entry monetization designed to defend mid-market account acquisition against budget alternatives.";
  }
  if (evt.includes("usage-based") || evt.includes("consumption")) {
    return "Monetization shift to align with high-volume enterprise customer growth and reduce upfront contract friction.";
  }
  if (evt.includes("sso") || evt.includes("soc2") || evt.includes("security") || evt.includes("access control")) {
    return "Up-market compliance fortification enabling IT procurement approval and enterprise contract expansion.";
  }
  if (evt.includes("customer success") || evt.includes("account executive")) {
    return "Outbound organizational pivot establishing dedicated infrastructure for high-ACV multi-year enterprise agreements.";
  }
  if (evt.includes("ai") || evt.includes("assistant") || evt.includes("report")) {
    return "Embedding AI workflow intelligence directly into core product surfaces to create platform stickiness and defend against generative challengers.";
  }
  if (evt.includes("partner") || evt.includes("connector") || evt.includes("integration")) {
    return "Ecosystem distribution expansion creating defensive switching barriers and data workflow lock-in.";
  }
  if (cat === "messaging") {
    return "Repositioning public category narrative to capture enterprise buyer mindshare ahead of broader product expansion.";
  }
  return "Operational reallocation signaling continuous optimization of market distribution.";
}

// 5. Compute Business Model Movement 3-Column Grid (Section 8)
export function computeBusinessModelMovement(
  evidence: IntelligenceEvidence[] = []
): BusinessMovementColumn[] {
  const productItems: string[] = [];
  const pricingItems: string[] = [];
  const marketItems: string[] = [];

  evidence.forEach((item) => {
    const cat = (item.category || "").toLowerCase();
    const evt = (item.event || "").toLowerCase();

    if (cat === "pricing" || evt.includes("price") || evt.includes("$") || evt.includes("packaging")) {
      pricingItems.push(item.event);
    } else if (cat === "enterprise" || cat === "messaging" || evt.includes("enterprise") || evt.includes("security")) {
      marketItems.push(item.event);
    } else {
      productItems.push(item.event);
    }
  });

  return [
    {
      title: "PRODUCT CAPABILITIES",
      category: "Capabilities, AI, and Architecture",
      trend: productItems.length >= 3 ? "up" : "stable",
      trendLabel: productItems.length >= 3 ? "Accelerating" : "Stable",
      items: productItems.slice(0, 3).length > 0
        ? productItems.slice(0, 3)
        : ["Continuous product iteration observed across core workflows"],
    },
    {
      title: "PRICING & PACKAGING",
      category: "Monetization and Tier Structure",
      trend: pricingItems.some((e) => e.toLowerCase().includes("reduce") || e.toLowerCase().includes("cut"))
        ? "down"
        : "stable",
      trendLabel: pricingItems.some((e) => e.toLowerCase().includes("reduce")) ? "Pressure // Adjusting" : "Consistent",
      items: pricingItems.slice(0, 3).length > 0
        ? pricingItems.slice(0, 3)
        : ["No disruptive pricing adjustments detected in current window"],
    },
    {
      title: "MARKET SEGMENTATION",
      category: "Target Customer and Positioning",
      trend: marketItems.some((e) => e.toLowerCase().includes("enterprise")) ? "up" : "stable",
      trendLabel: marketItems.some((e) => e.toLowerCase().includes("enterprise")) ? "Moving Up-Market" : "Neutral",
      items: marketItems.slice(0, 3).length > 0
        ? marketItems.slice(0, 3)
        : ["Maintaining steady segment coverage across target audience"],
    },
  ];
}

// 6. Compute Strategic Momentum (Section 10)
export function computeStrategicMomentum(evidence: IntelligenceEvidence[]): {
  dimension: string;
  direction: "up" | "stable" | "down";
  strength: "HIGH" | "MEDIUM" | "LOW";
  subtitle: string;
}[] {
  let enterpriseCount = 0;
  let aiCount = 0;
  let pricingPressureCount = 0;

  evidence.forEach((e) => {
    const text = (e.event + " " + e.category).toLowerCase();
    if (text.includes("enterprise") || text.includes("security") || text.includes("soc2") || text.includes("sso")) {
      enterpriseCount++;
    }
    if (text.includes("ai") || text.includes("assistant") || text.includes("anomaly")) {
      aiCount++;
    }
    if (text.includes("reduce") || text.includes("pricing") || text.includes("$") || text.includes("cut")) {
      pricingPressureCount++;
    }
  });

  return [
    {
      dimension: "ENTERPRISE EXPANSION",
      direction: enterpriseCount >= 3 ? "up" : "stable",
      strength: enterpriseCount >= 4 ? "HIGH" : enterpriseCount >= 2 ? "MEDIUM" : "LOW",
      subtitle: `${enterpriseCount} security & governance shifts observed`,
    },
    {
      dimension: "AI MONETIZATION & FEATURES",
      direction: aiCount >= 2 ? "up" : "stable",
      strength: aiCount >= 3 ? "HIGH" : aiCount >= 1 ? "MEDIUM" : "LOW",
      subtitle: `${aiCount} artificial intelligence rollouts indexed`,
    },
    {
      dimension: "PRICING PRESSURE & VALUE DEFENSE",
      direction: pricingPressureCount > 0 ? "down" : "stable",
      strength: pricingPressureCount >= 2 ? "HIGH" : "MEDIUM",
      subtitle: pricingPressureCount > 0 ? "Entry price adjusted downward" : "Tier margins held steady",
    },
  ];
}

// 7. Compute Quality Metrics (Section 14)
export function computeEvidenceQuality(
  evidence: IntelligenceEvidence[] = [],
  llmConfidence?: number
): QualityMetrics {
  if (!evidence || evidence.length === 0) {
    return { coverage: 0, depth: 0, consistency: 0, hasEnoughData: false };
  }

  // Coverage: based on distinct categories and sources present
  const categories = new Set(evidence.map((e) => e.category.toLowerCase()));
  const coverage = Math.min(95, Math.max(35, categories.size * 18 + evidence.length * 3));

  // Depth: based on date spread across evidence
  const dates = evidence.map((e) => e.date).filter(Boolean).sort();
  let depth = 50;
  if (dates.length >= 2) {
    const earliest = new Date(dates[0]).getTime();
    const latest = new Date(dates[dates.length - 1]).getTime();
    const daysDiff = Math.max(1, Math.round((latest - earliest) / (1000 * 60 * 60 * 24)));
    depth = Math.min(94, Math.max(40, Math.round((daysDiff / 90) * 100)));
  }

  // Consistency: based on LLM confidence or category alignment
  const consistency = llmConfidence
    ? Math.round(llmConfidence * 100)
    : Math.min(93, 75 + Math.round(evidence.length * 1.2));

  return {
    coverage,
    depth,
    consistency,
    hasEnoughData: evidence.length >= 3,
  };
}

// 8. Structure Watchpoints (Section 12)
export function structureWatchpoints(watchNext: string[] = []): StructuredWatchpoint[] {
  if (!watchNext || watchNext.length === 0) {
    return [
      {
        id: "01",
        title: "ENTERPRISE PACKAGING EVOLUTION",
        detail: "Watch for formal SLA tiering and dedicated enterprise tenant pricing.",
        priority: "HIGH",
      },
      {
        id: "02",
        title: "SECURITY COMPLIANCE AUDITING",
        detail: "Monitor additional regulatory certifications (FedRAMP, HIPAA, ISO 27001).",
        priority: "HIGH",
      },
      {
        id: "03",
        title: "AI FEATURE MONETIZATION",
        detail: "Track whether generative tools remain included or shift to add-on seat costs.",
        priority: "MEDIUM",
      },
    ];
  }

  return watchNext.slice(0, 4).map((w, idx) => {
    const text = w.toLowerCase();
    let title = "STRATEGIC VECTOR";
    let priority: "HIGH" | "MEDIUM" | "WATCH" = "MEDIUM";

    if (text.includes("pricing") || text.includes("cost") || text.includes("$") || text.includes("tier")) {
      title = "PRICING & REVENUE STRUCTURE";
      priority = "HIGH";
    } else if (text.includes("security") || text.includes("compliance") || text.includes("enterprise")) {
      title = "ENTERPRISE & GOVERNANCE EXPANSION";
      priority = "HIGH";
    } else if (text.includes("ai") || text.includes("assistant") || text.includes("model")) {
      title = "AI MONETIZATION & PACKAGING";
      priority = "HIGH";
    } else if (text.includes("partner") || text.includes("ecosystem")) {
      title = "ECOSYSTEM & PARTNERSHIPS";
      priority = "MEDIUM";
    }

    return {
      id: `0${idx + 1}`,
      title,
      detail: w,
      priority,
    };
  });
}
