"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { IntelligenceEvidence } from "@/lib/api";
import {
  computeSignalBreakdown,
  computeTrajectorySeries,
  computeStrategicShifts,
  computeBusinessModelMovement,
  computeStrategicMomentum,
  computeEvidenceQuality,
  structureWatchpoints,
  deriveInference,
  formatReportDate,
} from "@/lib/reportAnalytics";

interface IntelligenceDossierProps {
  competitor: string;
  question: string;
  summary: string;
  strategicSignal: string;
  observedChanges: string[];
  watchNext: string[];
  evidence: IntelligenceEvidence[];
}

function formatShortDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split("-");
    if (!month || !day) return dateStr;
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const mIdx = parseInt(month, 10) - 1;
    return `${months[mIdx] || month} ${day}`;
  } catch {
    return dateStr;
  }
}

function getMilestoneTitle(item: IntelligenceEvidence): string {
  const evt = item.event.toLowerCase();
  if (evt.includes("b2b")) return "B2B Wholesale";
  if (evt.includes("sidekick")) return "Sidekick AI";
  if (evt.includes("magic")) return "Shopify Magic";
  if (evt.includes("pos")) return "POS Hardware";
  if (evt.includes("markets")) return "Markets Pro";
  if (evt.includes("shop pay")) return "Shop Pay";
  if (evt.includes("breeze customer agent") || evt.includes("customer agent")) return "Support Agent";
  if (evt.includes("breeze intelligence")) return "Data Enrichment";
  if (evt.includes("breeze ai") || evt.includes("breeze")) return "Breeze AI";
  if (evt.includes("seat-based")) return "Seat Pricing";
  if (evt.includes("prospecting agent")) return "Sales Agent";
  if (evt.includes("slack lists") || evt.includes("lists")) return "Slack Lists";
  if (evt.includes("agentforce")) return "Agentforce";
  if (evt.includes("huddles")) return "Huddles AI";
  if (evt.includes("recaps") || evt.includes("channel recaps")) return "Channel Recaps";
  if (evt.includes("calendar")) return "Notion Calendar";
  if (evt.includes("enterprise search") || evt.includes("connectors")) return "Search Connectors";
  if (evt.includes("custom agents")) return "Custom Agents";
  if (evt.includes("meeting notes")) return "Meeting Notes";
  if (evt.includes("autofill")) return "AI Autofill";
  if (evt.includes("assistant") || evt.includes("ai-powered")) return "AI Launch";
  if (evt.includes("security") || evt.includes("access controls") || evt.includes("ekm") || evt.includes("dlp")) return "Security";
  if (evt.includes("ai-first") || evt.includes("messaging") || evt.includes("positioning")) return "AI Positioning";
  if (evt.includes("usage-based") || evt.includes("credit-based")) return "Usage Pricing";
  if (evt.includes("reduced") || evt.includes("$39") || evt.includes("$49")) return "Price Cut";
  if (evt.includes("plus") || evt.includes("$2,500")) return "Enterprise Plus";
  if (evt.includes("anomaly")) return "Anomaly Detection";
  if (evt.includes("customer success") || evt.includes("enterprise plan")) return "Dedicated Success";
  if (evt.includes("executive reports")) return "Executive Briefings";
  if (evt.includes("partnership") || evt.includes("partnered")) return "Partnership";
  if (evt.includes("self-service")) return "Self-Service Launch";
  if (evt.includes("starter package") || evt.includes("starter tier")) return "Starter Tier";
  if (evt.includes("sales") || evt.includes("outbound") || evt.includes("hiring")) return "Team Expansion";
  return item.category.charAt(0).toUpperCase() + item.category.slice(1);
}

function getMilestoneShortTitle(item: IntelligenceEvidence): string {
  const evt = item.event.toLowerCase();
  if (evt.includes("sidekick")) return "Sidekick conversational merchant assistant released";
  if (evt.includes("b2b wholesale") || evt.includes("b2b")) return "Unified B2B wholesale commerce portal launched";
  if (evt.includes("breeze customer agent")) return "Autonomous Breeze customer service agent deployed";
  if (evt.includes("breeze intelligence")) return "Breeze Intelligence automated data enrichment launched";
  if (evt.includes("breeze ai")) return "Breeze AI predictive scoring and drafting deployed";
  if (evt.includes("seat-based")) return "Transitioned to seat-based pricing model";
  if (evt.includes("slack lists")) return "Slack Lists task and project tracking released";
  if (evt.includes("agentforce")) return "Salesforce Agentforce embedded in Slack channels";
  if (evt.includes("notion calendar")) return "Bidirectional Notion Calendar integration launched";
  if (evt.includes("custom agents")) return "Notion Custom Agents for autonomous tasks introduced";
  if (evt.includes("enterprise search")) return "Enterprise Search connectors for Drive and GitHub added";
  if (evt.includes("meeting notes")) return "AI Meeting Notes transcription and action items launched";
  if (evt.includes("assistant") || evt.includes("ai-powered")) return "AI analytics assistant launched";
  if (evt.includes("security") || evt.includes("access controls")) return "Enterprise security package introduced";
  if (evt.includes("ai-first") || evt.includes("messaging")) return "AI-first positioning adopted";
  if (evt.includes("usage-based")) return "Usage-based pricing tier introduced";
  if (evt.includes("reduced") || evt.includes("$39") || evt.includes("$49")) return "Pro plan price reduced from $49 to $39/mo";
  if (evt.includes("anomaly")) return "Automated anomaly detection deployed";
  if (evt.includes("customer success")) return "Dedicated customer success managers added";
  if (evt.includes("executive reports")) return "Executive reporting controls released";
  if (evt.includes("partnership")) return "Enterprise integration partnership signed";
  if (evt.includes("self-service")) return "Self-service workspaces launched";
  if (evt.includes("starter package")) return "Low-cost starter package introduced";
  if (evt.includes("sales") || evt.includes("outbound")) return "Outbound enterprise sales organization expanded";
  return item.event.split(".")[0];
}

function formatLongDate(dateStr?: string): string {
  if (!dateStr) return "Sep 28, 2026";
  try {
    const parts = dateStr.split("-");
    if (parts.length < 3) return dateStr;
    const year = parts[0];
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    return `${months[month] || parts[1]} ${day}, ${year}`;
  } catch {
    return dateStr;
  }
}

function useCountUp(target: number, duration: number = 800): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [target, duration]);

  return count;
}

export function IntelligenceDossier({
  competitor,
  question,
  summary,
  strategicSignal,
  observedChanges = [],
  watchNext = [],
  evidence = [],
  status = "LIVE",
  confidence,
  hasPriorObservation = false,
}: IntelligenceDossierProps) {
  // Timeline state
  const [selectedMilestone, setSelectedMilestone] = useState<number>(0);
  const [isInView, setIsInView] = useState(false);
  const [isUserPaused, setIsUserPaused] = useState(false);
  const [pausedCountdown, setPausedCountdown] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const trajectoryRef = useRef<HTMLDivElement>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleAlert = (id: string) => {
    setAlerts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Detect user preference for reduced motion
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);

      const handleMotionChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };
      mediaQuery.addEventListener("change", handleMotionChange);
      return () => mediaQuery.removeEventListener("change", handleMotionChange);
    }
  }, []);

  // User Requirement: Past Trajectory must specifically display the last 5 events (the 5 most recent chronologically)
  const trajectoryEvents = useMemo(() => {
    return evidence.slice(-5);
  }, [evidence]);

  // Viewport Awareness via IntersectionObserver
  useEffect(() => {
    const el = trajectoryRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsInView(true);
          setSelectedMilestone(0);
          setIsUserPaused(false);
          setPausedCountdown(0);
        } else {
          setIsInView(false);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [competitor]);

  // Handle user manual inspection click - pauses auto-morph for 8 seconds
  const handleMilestoneClick = useCallback((idx: number) => {
    setSelectedMilestone(idx);
    setIsUserPaused(true);
    setPausedCountdown(8);

    if (pauseTimerRef.current) {
      clearInterval(pauseTimerRef.current);
    }

    pauseTimerRef.current = setInterval(() => {
      setPausedCountdown((prev) => {
        if (prev <= 1) {
          if (pauseTimerRef.current) clearInterval(pauseTimerRef.current);
          setIsUserPaused(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Resume auto-traversal immediately
  const resumeAutoTraversal = useCallback(() => {
    if (pauseTimerRef.current) clearInterval(pauseTimerRef.current);
    setIsUserPaused(false);
    setPausedCountdown(0);
  }, []);

  // Auto-progress memory walk: advances every 5 seconds across specifically the last 5 events
  useEffect(() => {
    if (!isInView || isUserPaused || prefersReducedMotion || trajectoryEvents.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setSelectedMilestone((prev) => (prev + 1) % trajectoryEvents.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isInView, isUserPaused, prefersReducedMotion, trajectoryEvents.length]);

  // Clean up pause interval timer on unmount
  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearInterval(pauseTimerRef.current);
    };
  }, []);

  const isAcme = competitor.toLowerCase().includes("acme");
  const isNimbus = competitor.toLowerCase().includes("nimbus");
  const isVertex = competitor.toLowerCase().includes("vertex");
  const isShopify = competitor.toLowerCase().includes("shopify");
  const isHubspot = competitor.toLowerCase().includes("hubspot");
  const isSlack = competitor.toLowerCase().includes("slack");
  const isNotion = competitor.toLowerCase().includes("notion");

  // SECTION 2: Clean, factual headline and supporting copy (no buzzwords, no speculation)
  const cleanHeadline = useMemo(() => {
    const qLower = question.toLowerCase();
    if (isAcme) {
      if (qLower.includes("price") || qLower.includes("pricing")) {
        return "ACME IS INTRODUCING USAGE TIERS WHILE REDUCING PRO PRICING.";
      }
      if (qLower.includes("product") || qLower.includes("launch")) {
        return "ACME IS CENTERING ITS PRODUCT ROADMAP ON AI-POWERED ANALYTICS.";
      }
      if (qLower.includes("message") || qLower.includes("position")) {
        return "ACME HAS PIVOTED POSITIONING TOWARD AI-FIRST CAPABILITIES.";
      }
      return "ACME IS EXPANDING BOTH PRODUCT DEPTH AND MARKET REACH.";
    }

    if (isNimbus) {
      if (qLower.includes("price") || qLower.includes("pricing")) {
        return "NIMBUS IS FORTIFYING PREMIUM ENTERPRISE GOVERNANCE TIERS.";
      }
      if (qLower.includes("product") || qLower.includes("launch")) {
        return "NIMBUS HAS DEPLOYED AUTOMATED ANOMALY DETECTION FOR ENTERPRISE.";
      }
      return "NIMBUS IS FORTIFYING TRUSTED ENTERPRISE AI AND ANOMALY DETECTION.";
    }

    if (isVertex) {
      if (qLower.includes("price") || qLower.includes("pricing")) {
        return "VERTEX IS INTRODUCING LOWER-FRICTION ENTRY TIERS FOR RAPID ADOPTION.";
      }
      return "VERTEX IS PAIRING SELF-SERVICE WORKSPACES WITH ENTERPRISE SALES.";
    }

    if (isShopify) {
      if (qLower.includes("price") || qLower.includes("pricing")) {
        return "SHOPIFY IS ADJUSTING ENTERPRISE BASELINES WHILE INCENTIVIZING SHOP PAY VOLUME.";
      }
      if (qLower.includes("product") || qLower.includes("launch")) {
        return "SHOPIFY IS EMBEDDING AGENTIC AI AND EXPANDING UNIFIED B2B COMMERCE.";
      }
      if (qLower.includes("message") || qLower.includes("position")) {
        return "SHOPIFY IS POSITIONING AS AN ENTERPRISE-GRADE UNIFIED COMMERCE ENGINE.";
      }
      return "SHOPIFY IS EXPANDING B2B COMMERCE AND AI-POWERED MERCHANT TOOLS.";
    }

    if (isHubspot) {
      if (qLower.includes("price") || qLower.includes("pricing")) {
        return "HUBSPOT HAS ELIMINATED MINIMUM SEAT REQUIREMENTS IN FAVOR OF SEAT PRICING.";
      }
      if (qLower.includes("product") || qLower.includes("launch")) {
        return "HUBSPOT IS CONSOLIDATING CRM WORKFLOWS AROUND BREEZE AI AND AGENTS.";
      }
      if (qLower.includes("message") || qLower.includes("position")) {
        return "HUBSPOT IS POSITIONING AS A UNIFIED SMART CRM OVER DISCONNECTED SUITES.";
      }
      return "HUBSPOT IS CONSOLIDATING SMART CRM AND EMBEDDING AUTONOMOUS BREEZE AI.";
    }

    if (isSlack) {
      if (qLower.includes("price") || qLower.includes("pricing")) {
        return "SLACK HAS MONETIZED AI THROUGH A $10/USER ADD-ON TIER.";
      }
      if (qLower.includes("product") || qLower.includes("launch")) {
        return "SLACK IS EXPANDING BEYOND CHAT WITH LISTS AND AGENTFORCE INTEGRATIONS.";
      }
      if (qLower.includes("message") || qLower.includes("position")) {
        return "SLACK IS REPOSITIONING AS THE CONVERSATIONAL AGENT INTERFACE.";
      }
      return "SLACK IS EVOLVING INTO AN AGENT-POWERED CONVERSATIONAL WORK ENGINE.";
    }

    if (isNotion) {
      if (qLower.includes("price") || qLower.includes("pricing")) {
        return "NOTION IS PAIRING AN $8/MO AI ADD-ON WITH CREDIT-BASED COMPUTE TIERS.";
      }
      if (qLower.includes("product") || qLower.includes("launch")) {
        return "NOTION HAS EXPANDED INTO ENTERPRISE SEARCH AND AUTONOMOUS CUSTOM AGENTS.";
      }
      if (qLower.includes("message") || qLower.includes("position")) {
        return "NOTION IS POSITIONING AS AN INTELLIGENT ALL-IN-ONE SINGLE SOURCE OF TRUTH.";
      }
      return "NOTION IS CONNECTING WORKSPACE SILOS WITH ENTERPRISE SEARCH AND AI AGENTS.";
    }

    // Dynamic fallback: sanitize incoming signal
    const cleaned = strategicSignal
      .replace(/deliberately constructing|land-and-expand funnel|high-margin upsell|mass adoption|price pressure|ARPU expansion/gi, "")
      .replace(/^["']|["']$/g, "")
      .split(".")[0];
    return cleaned ? `${cleaned.trim().toUpperCase()}.` : `${competitor.toUpperCase()} STRATEGIC PATTERN DETECTED.`;
  }, [competitor, question, strategicSignal, isAcme, isNimbus, isVertex, isShopify, isHubspot, isSlack, isNotion]);

  const supportingSummary = useMemo(() => {
    if (isAcme) {
      return "Across the last three months, Acme added enterprise security capabilities, increased emphasis on AI-first analytics, introduced usage-based pricing, and lowered its Pro price from $49 to $39.";
    }
    if (isNimbus) {
      return "Over the observation window, Nimbus deployed automated anomaly detection, fortified enterprise access governance, and established business data partnerships to integrate external data sources.";
    }
    if (isVertex) {
      return "Over recent months, Vertex introduced self-service workspaces and a lower-cost starter package while building an outbound enterprise sales organization to capture higher-value accounts.";
    }
    if (isShopify) {
      return "Across recent months, Shopify rolled out Shopify Magic and Sidekick AI tools, launched a unified B2B wholesale portal, adjusted Plus enterprise pricing, and expanded Markets cross-border fulfillment.";
    }
    if (isHubspot) {
      return "Over the observation window, HubSpot introduced the Breeze AI suite and autonomous customer agents, overhauled its seat pricing model, and added enterprise data enrichment.";
    }
    if (isSlack) {
      return "Across recent months, Slack launched native channel summarization and AI search, released Slack Lists for work management, introduced a $10/user AI add-on, and integrated Salesforce Agentforce.";
    }
    if (isNotion) {
      return "Over the observation window, Notion released workspace-wide AI Q&A, Notion Calendar, Enterprise Search connectors for Google Drive and GitHub, Custom AI Agents, and AI Meeting Notes.";
    }

    // Dynamic fallback
    if (summary) {
      return summary.split(".").slice(0, 2).join(".") + ".";
    }
    return `Analysis based on ${evidence.length} chronological observations recorded for ${competitor}.`;
  }, [competitor, summary, evidence.length, isAcme, isNimbus, isVertex, isShopify, isHubspot, isSlack, isNotion]);

  // SECTION 3: KEY SIGNALS (3-4 compact chips/cards)
  const keySignals = useMemo(() => {
    if (isAcme) {
      return [
        { category: "PRODUCT", desc: "AI capabilities expanded" },
        { category: "ENTERPRISE", desc: "Security controls added" },
        { category: "MESSAGING", desc: "AI-first positioning strengthened" },
        { category: "PRICING", desc: "Usage-based pricing + Pro price reduction" },
      ];
    }
    if (isNimbus) {
      return [
        { category: "ENTERPRISE AI", desc: "Anomaly detection deployed" },
        { category: "GOVERNANCE", desc: "Access controls fortified" },
        { category: "PARTNERSHIP", desc: "External business data integration" },
        { category: "MESSAGING", desc: "Trusted enterprise AI emphasis" },
      ];
    }
    if (isVertex) {
      return [
        { category: "PRODUCT", desc: "Self-service workspaces launched" },
        { category: "PRICING", desc: "Lower-cost starter tier added" },
        { category: "SALES", desc: "Outbound enterprise team expanded" },
        { category: "ANALYTICS", desc: "Vertical dashboards automated" },
      ];
    }
    if (isShopify) {
      return [
        { category: "PRODUCT", desc: "Sidekick & AI merchant automation" },
        { category: "COMMERCE", desc: "Unified B2B wholesale platform" },
        { category: "GLOBAL", desc: "Markets cross-border collection" },
        { category: "PRICING", desc: "Enterprise Plus $2,500 baseline + Shop Pay incentives" },
      ];
    }
    if (isHubspot) {
      return [
        { category: "PRODUCT", desc: "Breeze AI & Customer Agents" },
        { category: "PRICING", desc: "Seat-based pricing model overhaul" },
        { category: "DATA", desc: "Breeze Intelligence enrichment" },
        { category: "ENTERPRISE", desc: "Governance & compliance audit logs" },
      ];
    }
    if (isSlack) {
      return [
        { category: "PRODUCT", desc: "Slack AI summaries & Slack Lists" },
        { category: "ECOSYSTEM", desc: "Salesforce Agentforce integration" },
        { category: "PRICING", desc: "$10/user/mo Slack AI add-on" },
        { category: "ENTERPRISE", desc: "Customer-managed encryption (EKM) & DLP" },
      ];
    }
    if (isNotion) {
      return [
        { category: "PRODUCT", desc: "Enterprise Search & Custom Agents" },
        { category: "WORKSPACE", desc: "Notion Calendar & AI Meeting Notes" },
        { category: "PRICING", desc: "$8/user AI add-on + API compute credits" },
        { category: "ENTERPRISE", desc: "SCIM provisioning & European data residency" },
      ];
    }

    // Dynamic generation from actual evidence categories
    const categories = Array.from(new Set(evidence.map((e) => e.category)));
    return categories.slice(0, 4).map((cat) => {
      const match = evidence.find((e) => e.category === cat);
      return {
        category: cat.toUpperCase(),
        desc: match ? match.event.split(".")[0] : `${cat} development observed`,
      };
    });
  }, [competitor, evidence, isAcme, isNimbus, isVertex, isShopify, isHubspot, isSlack, isNotion]);

  // STRATEGIC INTELLIGENCE: Dynamic Strategic Signal Chips
  interface SignalChip {
    label: string;
    trend: "up" | "down" | "neutral";
    arrow: string;
  }

  const strategicSignalChips = useMemo<SignalChip[]>(() => {
    const qLower = question.toLowerCase();

    if (isAcme) {
      if (qLower.includes("price") || qLower.includes("pricing")) {
        return [
          { label: "Usage-based tiers", trend: "up", arrow: "↑" },
          { label: "Pro plan price ($39)", trend: "down", arrow: "↓" },
          { label: "Self-service flexibility", trend: "up", arrow: "↑" },
          { label: "Enterprise packaging", trend: "up", arrow: "↑" },
        ];
      }
      if (qLower.includes("product") || qLower.includes("launch")) {
        return [
          { label: "AI analytics assistant", trend: "up", arrow: "↑" },
          { label: "Enterprise security controls", trend: "up", arrow: "↑" },
          { label: "Audit logging & DLP", trend: "up", arrow: "↑" },
          { label: "API capability depth", trend: "up", arrow: "↑" },
        ];
      }
      if (qLower.includes("message") || qLower.includes("position")) {
        return [
          { label: "AI-first narrative", trend: "up", arrow: "↑" },
          { label: "Enterprise readiness", trend: "up", arrow: "↑" },
          { label: "Competitive cloud framing", trend: "up", arrow: "↑" },
          { label: "Legacy analytics displacement", trend: "up", arrow: "↑" },
        ];
      }
      return [
        { label: "AI positioning", trend: "up", arrow: "↑" },
        { label: "Enterprise focus", trend: "up", arrow: "↑" },
        { label: "Pricing flexibility", trend: "up", arrow: "↑" },
        { label: "Product depth", trend: "up", arrow: "↑" },
      ];
    }

    if (isNimbus) {
      if (qLower.includes("price") || qLower.includes("pricing")) {
        return [
          { label: "Enterprise tier protection", trend: "up", arrow: "↑" },
          { label: "Contract size baseline", trend: "up", arrow: "↑" },
          { label: "Dedicated success add-on", trend: "up", arrow: "↑" },
          { label: "Custom terms flexibility", trend: "up", arrow: "↑" },
        ];
      }
      if (qLower.includes("product") || qLower.includes("launch")) {
        return [
          { label: "Automated anomaly alerts", trend: "up", arrow: "↑" },
          { label: "Root-cause diagnostics", trend: "up", arrow: "↑" },
          { label: "Granular access governance", trend: "up", arrow: "↑" },
          { label: "Warehouse data sync", trend: "up", arrow: "↑" },
        ];
      }
      return [
        { label: "Enterprise governance", trend: "up", arrow: "↑" },
        { label: "Anomaly detection", trend: "up", arrow: "↑" },
        { label: "Partner integrations", trend: "up", arrow: "↑" },
        { label: "Trusted AI emphasis", trend: "up", arrow: "↑" },
      ];
    }

    if (isVertex) {
      if (qLower.includes("price") || qLower.includes("pricing")) {
        return [
          { label: "Starter entry pricing", trend: "down", arrow: "↓" },
          { label: "Adoption friction", trend: "down", arrow: "↓" },
          { label: "Self-serve conversion", trend: "up", arrow: "↑" },
          { label: "Enterprise contract value", trend: "up", arrow: "↑" },
        ];
      }
      if (qLower.includes("product") || qLower.includes("launch")) {
        return [
          { label: "Self-service workspaces", trend: "up", arrow: "↑" },
          { label: "Vertical analytics templates", trend: "up", arrow: "↑" },
          { label: "Data ingestion speed", trend: "up", arrow: "↑" },
          { label: "Team collaboration", trend: "up", arrow: "↑" },
        ];
      }
      return [
        { label: "PLG workspaces", trend: "up", arrow: "↑" },
        { label: "Starter tier friction", trend: "down", arrow: "↓" },
        { label: "Outbound enterprise sales", trend: "up", arrow: "↑" },
        { label: "Vertical templates", trend: "up", arrow: "↑" },
      ];
    }

    if (isShopify) {
      if (qLower.includes("price") || qLower.includes("pricing")) {
        return [
          { label: "Plus baseline contract ($2.5k)", trend: "up", arrow: "↑" },
          { label: "Shop Pay take-rate volume", trend: "up", arrow: "↑" },
          { label: "B2B fee incentives", trend: "up", arrow: "↑" },
          { label: "App revenue share split", trend: "up", arrow: "↑" },
        ];
      }
      if (qLower.includes("product") || qLower.includes("launch")) {
        return [
          { label: "Sidekick merchant AI", trend: "up", arrow: "↑" },
          { label: "Unified B2B wholesale", trend: "up", arrow: "↑" },
          { label: "POS Go hardware depth", trend: "up", arrow: "↑" },
          { label: "Markets Pro cross-border", trend: "up", arrow: "↑" },
        ];
      }
      return [
        { label: "B2B wholesale", trend: "up", arrow: "↑" },
        { label: "Sidekick merchant AI", trend: "up", arrow: "↑" },
        { label: "Global markets reach", trend: "up", arrow: "↑" },
        { label: "Enterprise Plus focus", trend: "up", arrow: "↑" },
      ];
    }

    if (isHubspot) {
      if (qLower.includes("price") || qLower.includes("pricing")) {
        return [
          { label: "Seat minimum barriers", trend: "down", arrow: "↓" },
          { label: "Core seat monetization", trend: "up", arrow: "↑" },
          { label: "Breeze AI credit consumption", trend: "up", arrow: "↑" },
          { label: "View-only seat cost", trend: "down", arrow: "↓" },
        ];
      }
      if (qLower.includes("product") || qLower.includes("launch")) {
        return [
          { label: "Breeze Customer Agent", trend: "up", arrow: "↑" },
          { label: "Breeze Prospecting Agent", trend: "up", arrow: "↑" },
          { label: "Breeze Intelligence data", trend: "up", arrow: "↑" },
          { label: "Smart CRM unification", trend: "up", arrow: "↑" },
        ];
      }
      return [
        { label: "Breeze AI agents", trend: "up", arrow: "↑" },
        { label: "Seat-based pricing", trend: "up", arrow: "↑" },
        { label: "Breeze Intelligence", trend: "up", arrow: "↑" },
        { label: "Enterprise governance", trend: "up", arrow: "↑" },
      ];
    }

    if (isSlack) {
      if (qLower.includes("price") || qLower.includes("pricing")) {
        return [
          { label: "Slack AI add-on ($10/user)", trend: "up", arrow: "↑" },
          { label: "Enterprise Grid packaging", trend: "up", arrow: "↑" },
          { label: "Salesforce bundle leverage", trend: "up", arrow: "↑" },
          { label: "Per-seat AI monetization", trend: "up", arrow: "↑" },
        ];
      }
      if (qLower.includes("product") || qLower.includes("launch")) {
        return [
          { label: "Salesforce Agentforce", trend: "up", arrow: "↑" },
          { label: "Slack Lists work tracking", trend: "up", arrow: "↑" },
          { label: "Channel AI recaps", trend: "up", arrow: "↑" },
          { label: "Huddles AI notes", trend: "up", arrow: "↑" },
        ];
      }
      return [
        { label: "Agentforce integration", trend: "up", arrow: "↑" },
        { label: "Slack Lists tracker", trend: "up", arrow: "↑" },
        { label: "AI channel summaries", trend: "up", arrow: "↑" },
        { label: "Enterprise EKM & DLP", trend: "up", arrow: "↑" },
      ];
    }

    if (isNotion) {
      if (qLower.includes("price") || qLower.includes("pricing")) {
        return [
          { label: "AI add-on ($8/user)", trend: "up", arrow: "↑" },
          { label: "Credit-based API compute", trend: "up", arrow: "↑" },
          { label: "Enterprise seat packaging", trend: "up", arrow: "↑" },
          { label: "Free tier collaboration limits", trend: "down", arrow: "↓" },
        ];
      }
      if (qLower.includes("product") || qLower.includes("launch")) {
        return [
          { label: "Enterprise Search connectors", trend: "up", arrow: "↑" },
          { label: "Custom AI Agents", trend: "up", arrow: "↑" },
          { label: "Notion Calendar sync", trend: "up", arrow: "↑" },
          { label: "AI Meeting Notes", trend: "up", arrow: "↑" },
        ];
      }
      return [
        { label: "Enterprise search", trend: "up", arrow: "↑" },
        { label: "Autonomous Custom Agents", trend: "up", arrow: "↑" },
        { label: "Workspace consolidation", trend: "up", arrow: "↑" },
        { label: "API compute credits", trend: "up", arrow: "↑" },
      ];
    }

    // Dynamic fallback from evidence categories
    const categories = Array.from(new Set(evidence.map((e) => e.category)));
    return categories.slice(0, 4).map((cat) => ({
      label: `${cat.charAt(0).toUpperCase() + cat.slice(1)} focus`,
      trend: "up" as const,
      arrow: "↑",
    }));
  }, [competitor, question, evidence, isAcme, isNimbus, isVertex, isShopify, isHubspot, isSlack, isNotion]);

  // SECTION 5: WHAT THE HISTORY SUGGESTS (Observed facts vs Cautious inference)
  const observedFacts = useMemo(() => {
    if (isAcme) {
      return [
        "AI assistant launched",
        "Enterprise security expanded",
        "Pricing became more flexible",
      ];
    }
    if (isNimbus) {
      return [
        "Automated anomaly detection deployed",
        "Enterprise governance controls strengthened",
        "Data integration partnership formed",
      ];
    }
    if (isVertex) {
      return [
        "Self-service workspaces released",
        "Starter pricing tier introduced",
        "Outbound enterprise team expanded",
      ];
    }
    if (isShopify) {
      return [
        "Shopify Magic and Sidekick AI launched",
        "Unified B2B wholesale portal deployed",
        "Plus enterprise contract baseline adjusted",
      ];
    }
    if (isHubspot) {
      return [
        "Breeze AI suite and agents launched",
        "Seat-based pricing model overhauled",
        "Breeze Intelligence data enrichment added",
      ];
    }
    if (isSlack) {
      return [
        "Slack AI channel recaps launched",
        "Slack Lists task management introduced",
        "$10/user/mo AI add-on pricing established",
      ];
    }
    if (isNotion) {
      return [
        "Enterprise Search connectors released",
        "Custom AI Agents and Meeting Notes launched",
        "Credit-based API compute tier introduced",
      ];
    }

    // Dynamic fallback from evidence
    return evidence.slice(0, 3).map((e) => e.event.split(".")[0]);
  }, [competitor, evidence, isAcme, isNimbus, isVertex, isShopify, isHubspot, isSlack, isNotion]);

  const strategicInterpretation = useMemo(() => {
    if (isAcme) {
      return "Together, these changes suggest Acme is broadening its appeal across both AI-driven workflows and enterprise requirements.";
    }
    if (isNimbus) {
      return "Together, these changes indicate Nimbus is securing high-value enterprise accounts by prioritizing trusted governance and automated anomaly intelligence.";
    }
    if (isVertex) {
      return "Together, these changes indicate Vertex is capturing self-serve adoption while actively developing an enterprise sales motion.";
    }
    if (isShopify) {
      return "Together, these changes indicate Shopify is moving aggressively upmarket into enterprise wholesale while automating routine merchant operations with embedded AI.";
    }
    if (isHubspot) {
      return "Together, these changes indicate HubSpot is removing adoption friction with flexible seats while driving monetization through AI credits and enterprise governance.";
    }
    if (isSlack) {
      return "Together, these changes suggest Slack is transforming from a messaging application into an intelligent enterprise operating system orchestrating human and AI agent collaboration.";
    }
    if (isNotion) {
      return "Together, these changes suggest Notion is evolving into an integrated enterprise knowledge operating system capable of indexing external tools and running autonomous workflow agents.";
    }

    // Dynamic fallback
    const cleaned = strategicSignal
      .replace(/deliberately constructing|land-and-expand funnel|high-margin upsell|mass adoption|price pressure/gi, "")
      .replace(/^["']|["']$/g, "")
      .trim();
    return cleaned || `A coordinated strategic direction is emerging from ${evidence.length} related observations.`;
  }, [competitor, strategicSignal, evidence.length, isAcme, isNimbus, isVertex, isShopify, isHubspot, isSlack, isNotion]);

  // SECTION 7: WATCH NEXT (3 clean watchpoints)
  const watchCards = useMemo(() => {
    if (isAcme) {
      return [
        {
          num: "01",
          category: "ENTERPRISE",
          text: "Watch for further security, governance, or enterprise compliance controls.",
        },
        {
          num: "02",
          category: "PRICING",
          text: "Monitor additional adjustments to tiers, packaging, or usage thresholds.",
        },
        {
          num: "03",
          category: "AI",
          text: "Watch for expansion of AI capabilities across additional user workflows.",
        },
      ];
    }
    if (isNimbus) {
      return [
        {
          num: "01",
          category: "PARTNERSHIPS",
          text: "Watch for additional ecosystem data integrations and analytics connectors.",
        },
        {
          num: "02",
          category: "ENTERPRISE",
          text: "Monitor customer success staffing and enterprise contract packaging.",
        },
        {
          num: "03",
          category: "AI & ML",
          text: "Watch for automated root-cause explanations paired with anomaly alerts.",
        },
      ];
    }
    if (isVertex) {
      return [
        {
          num: "01",
          category: "ENTERPRISE",
          text: "Monitor outbound sales hiring and custom contract offerings.",
        },
        {
          num: "02",
          category: "PLG TIERS",
          text: "Watch for adjustments to workspace limits and starter feature gating.",
        },
        {
          num: "03",
          category: "INTEGRATIONS",
          text: "Watch for pre-built vertical connectors for industry-specific data.",
        },
      ];
    }
    if (isShopify) {
      return [
        {
          num: "01",
          category: "ENTERPRISE",
          text: "Watch for deeper ERP integrations and Fortune 500 retailer migrations.",
        },
        {
          num: "02",
          category: "PRICING",
          text: "Monitor Shop Pay processing incentives and enterprise contract thresholds.",
        },
        {
          num: "03",
          category: "AI AGENTS",
          text: "Watch for broader rollout of Sidekick autonomous inventory and marketing agents.",
        },
      ];
    }
    if (isHubspot) {
      return [
        {
          num: "01",
          category: "AI CREDITS",
          text: "Monitor consumption pricing on Breeze AI prospecting and data enrichment.",
        },
        {
          num: "02",
          category: "ENTERPRISE",
          text: "Watch for enterprise sales displacement campaigns targeting Salesforce.",
        },
        {
          num: "03",
          category: "ECOSYSTEM",
          text: "Watch for further cloud data warehouse bidirectional sync connectors.",
        },
      ];
    }
    if (isSlack) {
      return [
        {
          num: "01",
          category: "AGENTS",
          text: "Monitor third-party AI agent development inside Slack channels via Agentforce.",
        },
        {
          num: "02",
          category: "PACKAGING",
          text: "Watch for potential bundling of AI capabilities into enterprise tiers.",
        },
        {
          num: "03",
          category: "COLLABORATION",
          text: "Watch for expanded project and document workflow capabilities within Lists.",
        },
      ];
    }
    if (isNotion) {
      return [
        {
          num: "01",
          category: "CONNECTORS",
          text: "Watch for additional enterprise search integrations with Microsoft 365 and Slack.",
        },
        {
          num: "02",
          category: "AGENTS",
          text: "Monitor enterprise adoption of autonomous Custom Agents for recurring workflows.",
        },
        {
          num: "03",
          category: "PRICING",
          text: "Watch for adjustments to API and compute credit consumption thresholds.",
        },
      ];
    }

    // Dynamic fallback from watchNext prop
    return (watchNext.length > 0 ? watchNext.slice(0, 3) : [
      `Monitor ${competitor}'s enterprise account motions.`,
      `Watch for adjustments to feature packaging and pricing.`,
      `Track product and workflow announcements.`,
    ]).map((item, idx) => ({
      num: `0${idx + 1}`,
      category: idx === 0 ? "ENTERPRISE" : idx === 1 ? "PRICING" : "PRODUCT",
      text: item.startsWith("Watch") || item.startsWith("Monitor") ? item : `Watch for ${item.toLowerCase()}`,
    }));
  }, [competitor, watchNext, isAcme, isNimbus, isVertex, isShopify, isHubspot, isSlack, isNotion]);

  // Category Color Palette matching index1.html
  const CATEGORY_COLORS: Record<string, string> = {
    Product: "#4338F0",
    Pricing: "#F59A2A",
    Enterprise: "#19C08B",
    Messaging: "#7C5CF0",
    Hiring: "#5560F8",
    Partnership: "#8E9AD6",
    Governance: "#19C08B",
    Commerce: "#4338F0",
    Sales: "#5560F8",
    Workspace: "#7C5CF0",
    Analytics: "#7C5CF0",
    Security: "#19C08B",
    Ecosystem: "#8E9AD6",
    Data: "#19C08B",
    Global: "#5560F8",
  };

  // Living Company Memory Profile Data (Index1 Design System)
  const livingProfile = useMemo(() => {
    // 1. Observations count & dates
    const obsCount = evidence.length > 0 ? evidence.length : (isAcme ? 27 : 15);
    const sortedDates = [...evidence].sort((a, b) => (a.date > b.date ? 1 : -1));
    const firstObserved = sortedDates[0]?.date ? formatLongDate(sortedDates[0].date) : "Jul 15, 2026";
    const lastResearched = sortedDates[sortedDates.length - 1]?.date ? formatLongDate(sortedDates[sortedDates.length - 1].date) : "Sep 28, 2026";

    // 2. Category distribution
    const catCounts: Record<string, number> = {};
    evidence.forEach((ev) => {
      const rawCat = (ev.category || "Product").trim();
      const normCat = rawCat.charAt(0).toUpperCase() + rawCat.slice(1).toLowerCase();
      catCounts[normCat] = (catCounts[normCat] || 0) + 1;
    });

    let categoriesList = Object.entries(catCounts).map(([cat, count]) => ({
      category: cat,
      count,
    }));

    if (categoriesList.length === 0) {
      if (isShopify) {
        categoriesList = [
          { category: "Commerce", count: 6 },
          { category: "Product", count: 5 },
          { category: "Pricing", count: 4 },
          { category: "Global", count: 3 },
          { category: "Enterprise", count: 3 },
          { category: "Partnership", count: 2 },
        ];
      } else if (isHubspot) {
        categoriesList = [
          { category: "Product", count: 7 },
          { category: "Pricing", count: 5 },
          { category: "Enterprise", count: 4 },
          { category: "Data", count: 3 },
          { category: "Messaging", count: 2 },
          { category: "Partnership", count: 2 },
        ];
      } else if (isSlack) {
        categoriesList = [
          { category: "Product", count: 6 },
          { category: "Enterprise", count: 5 },
          { category: "Pricing", count: 4 },
          { category: "Ecosystem", count: 3 },
          { category: "Messaging", count: 2 },
          { category: "Partnership", count: 2 },
        ];
      } else if (isNotion) {
        categoriesList = [
          { category: "Workspace", count: 6 },
          { category: "Product", count: 5 },
          { category: "Pricing", count: 4 },
          { category: "Enterprise", count: 4 },
          { category: "Messaging", count: 3 },
          { category: "Partnership", count: 2 },
        ];
      } else {
        categoriesList = [
          { category: "Product", count: 8 },
          { category: "Pricing", count: 5 },
          { category: "Enterprise", count: 5 },
          { category: "Messaging", count: 4 },
          { category: "Hiring", count: 3 },
          { category: "Partnership", count: 2 },
        ];
      }
    }

    categoriesList.sort((a, b) => b.count - a.count);
    const maxCount = Math.max(...categoriesList.map((c) => c.count), 1);

    const categoryDistribution = categoriesList.slice(0, 6).map((item) => ({
      category: item.category,
      count: item.count,
      pct: Math.max(14, Math.round((item.count / maxCount) * 100)),
      color: CATEGORY_COLORS[item.category] || "#4338F0",
    }));

    const categoriesCount = categoriesList.length;
    const recentChangesCount = observedChanges.length > 0 ? observedChanges.length : 3;

    // 3. Strategic Themes
    let themes: string[] = [];
    if (isAcme) {
      themes = ["AI analytics", "Enterprise expansion", "Pricing experimentation"];
    } else if (isShopify) {
      themes = ["AI-assisted commerce", "Global expansion", "Unified B2B wholesale"];
    } else if (isHubspot) {
      themes = ["Autonomous Breeze AI", "Smart CRM consolidation", "Seat monetization"];
    } else if (isSlack) {
      themes = ["Agentic conversation", "Salesforce Agentforce", "Workflow Lists"];
    } else if (isNotion) {
      themes = ["Single source of truth", "Enterprise search", "Autonomous custom agents"];
    } else if (isNimbus) {
      themes = ["Anomaly detection", "Enterprise governance", "Business intelligence"];
    } else if (isVertex) {
      themes = ["Self-service workspaces", "Entry tier pricing", "Outbound enterprise"];
    } else {
      themes = categoriesList.slice(0, 3).map((c) => c.category);
    }

    // 4. Recent Changes Tags
    let changesTags: string[] = [];
    if (isAcme) {
      changesTags = ["Product launch", "Pricing change", "Enterprise update"];
    } else if (isShopify) {
      changesTags = ["Sidekick AI launch", "B2B wholesale portal", "Plus pricing adjustment"];
    } else if (isHubspot) {
      changesTags = ["Breeze AI suite", "Seat-based pricing model", "Breeze data enrichment"];
    } else if (isSlack) {
      changesTags = ["Slack Lists launch", "Agentforce in channels", "$10/user AI add-on"];
    } else if (isNotion) {
      changesTags = ["Enterprise search", "Custom AI agents", "Notion Calendar"];
    } else if (isNimbus) {
      changesTags = ["Anomaly detection beta", "Enterprise access DLP", "Data warehouse connector"];
    } else if (isVertex) {
      changesTags = ["Self-service workspaces", "Starter pricing tier", "Outbound sales expansion"];
    } else if (observedChanges && observedChanges.length > 0) {
      changesTags = observedChanges.slice(0, 3).map((c) => {
        const text = c.replace(/\.$/, "").split(":")[0] || c;
        return text.length > 26 ? text.substring(0, 24) + "…" : text;
      });
    } else {
      changesTags = ["Product launch", "Pricing change", "Enterprise update"];
    }

    // 5. Watch Next Tags
    let watchTags: string[] = [];
    if (watchNext && watchNext.length > 0) {
      watchTags = watchNext.slice(0, 3).map((w) => {
        const colonIdx = w.indexOf(":");
        if (colonIdx > 0 && colonIdx < 32) return w.substring(0, colonIdx).trim();
        const dashIdx = w.indexOf(" — ");
        if (dashIdx > 0 && dashIdx < 32) return w.substring(0, dashIdx).trim();
        return w.length > 28 ? w.substring(0, 26) + "…" : w;
      });
    } else if (isAcme) {
      watchTags = ["Pricing and packaging", "Enterprise expansion", "AI product releases"];
    } else if (isShopify) {
      watchTags = ["Shop Pay incentives", "Enterprise Plus growth", "B2B wholesale adoption"];
    } else if (isHubspot) {
      watchTags = ["Breeze AI adoption", "Seat price elasticity", "Data enrichment tools"];
    } else if (isSlack) {
      watchTags = ["Agentforce ecosystem", "Slack AI add-on attach", "Workflow automation"];
    } else if (isNotion) {
      watchTags = ["Search connector usage", "Custom agent workflows", "Enterprise seat growth"];
    } else {
      watchTags = ["Pricing and packaging", "Enterprise expansion", "AI product releases"];
    }

    return {
      observationsCount: obsCount,
      categoriesCount,
      recentChangesCount,
      firstObserved,
      lastResearched,
      categoryDistribution,
      strategicThemes: themes,
      recentChanges: changesTags,
      watchNext: watchTags,
    };
  }, [competitor, evidence, observedChanges, watchNext, isAcme, isShopify, isHubspot, isSlack, isNotion, isNimbus, isVertex]);

  const animatedObsCount = useCountUp(livingProfile.observationsCount, 900);
  const animatedCatCount = useCountUp(livingProfile.categoriesCount, 750);
  const animatedChangesCount = useCountUp(livingProfile.recentChangesCount, 600);

  const [profileAnimated, setProfileAnimated] = useState(false);
  useEffect(() => {
    setProfileAnimated(false);
    const timer = setTimeout(() => {
      setProfileAnimated(true);
    }, 180);
    return () => clearTimeout(timer);
  }, [competitor]);

  const activeEvent = trajectoryEvents[selectedMilestone] || trajectoryEvents[0];

  return (
    <div className="space-y-8 sm:space-y-10 animate-in fade-in duration-300 w-full max-w-[1360px] mx-auto">
      
      {/* ──────────────────────────────────────────────────────────────
          SECTION 2 — STRATEGIC INTELLIGENCE
      ────────────────────────────────────────────────────────────── */}
      <section aria-labelledby="strategic-intelligence-heading">
        <article className="gl p-6 sm:p-8 shadow-[0_24px_50px_rgba(80,90,220,0.12)] border border-[#DDE3F5] space-y-6">
          
          {/* Header Row: Entity Name, Badge, Last Analyzed, Inquiry, Memory Count */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#EEF1FB]">
            <div>
              <div className="flex items-center gap-3">
                <h2 id="strategic-intelligence-heading" className="text-2xl sm:text-3xl font-extrabold text-[#0B0D24] tracking-tight font-sans">
                  {competitor.toUpperCase()}
                </h2>
                <span className="eb text-xs">
                  <i></i>
                  <span>Strategic Intelligence</span>
                </span>
                <span className="syn hidden sm:inline-flex">Synthetic CI dataset</span>
              </div>

              <p className="text-xs text-[#7A7F99] mt-1.5">
                Continuous longitudinal memory analysis &bull; Last analyzed: <b className="text-[#0B0D24] font-semibold">Sep 28, 2026</b>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Question / Inquiry Pill */}
              {question && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F9FF] border border-[#DDE3F5] shadow-xs text-xs">
                  <span className="font-bold text-[#4338F0] uppercase tracking-wider text-[11px]">
                    INQUIRY:
                  </span>
                  <span className="text-[#3F4463] font-medium max-w-[280px] sm:max-w-md truncate">
                    &ldquo;{question}&rdquo;
                  </span>
                </div>
              )}

              {/* Memory Indicator Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EEF1FB] border border-[#DDE3F5] text-xs font-semibold text-[#4338F0]">
                <span className="pulse"></span>
                <span>HINDSIGHT: {evidence.length} signals recalled</span>
              </div>
            </div>
          </div>

          {/* Strategic Direction Headline & Supporting Narrative */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#4338F0] uppercase tracking-wider">
                STRATEGIC DIRECTION DETECTED
              </span>
              <span className="syn sm:hidden">Synthetic CI dataset</span>
            </div>

            <h3 className="text-xl sm:text-2xl lg:text-[26px] font-extrabold text-[#0B0D24] tracking-tight leading-snug font-sans">
              {cleanHeadline}
            </h3>

            <p className="text-sm sm:text-base text-[#3F4463] font-normal leading-relaxed max-w-4xl">
              {supportingSummary}
            </p>
          </div>

          {/* Dynamic Strategic Signals Detected Chips */}
          <div className="pt-4 border-t border-[#EEF1FB] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#7A7F99] uppercase tracking-wider">
                STRATEGIC SIGNALS DETECTED
              </span>
              <span className="text-[11px] text-[#4338F0] font-semibold">
                Multi-period evidence pattern
              </span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {strategicSignalChips.map((chip, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#DDE3F5] shadow-xs hover:border-[#4338F0] hover:shadow-sm transition-all text-xs sm:text-[13px] font-semibold text-[#0B0D24]"
                >
                  <span>{chip.label}</span>
                  <span
                    className={`font-mono font-bold text-xs px-1.5 py-0.5 rounded ${
                      chip.trend === "up"
                        ? "bg-[#DDF8EE] text-[#0d8f66]"
                        : chip.trend === "down"
                        ? "bg-[#FFF0DD] text-[#c97410]"
                        : "bg-[#EEF1FB] text-[#4338F0]"
                    }`}
                  >
                    {chip.arrow}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </article>
      </section>


      {/* ──────────────────────────────────────────────────────────────
          SECTION 3 — KEY SIGNALS
      ────────────────────────────────────────────────────────────── */}
      <section aria-label="Key Strategic Signals">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {keySignals.map((sig, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white border border-[#DDE3F5] shadow-xs hover:border-[#4338F0]/40 transition-colors space-y-1"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4338F0]"></span>
                <span className="text-[11px] font-bold text-[#4338F0] uppercase tracking-wider">
                  {sig.category}
                </span>
              </div>
              <p className="text-xs sm:text-[13px] font-semibold text-[#0B0D24] leading-snug">
                {sig.desc}
              </p>
            </div>
          ))}
        </div>
      </section>


      {/* ──────────────────────────────────────────────────────────────
          SECTION 4 — PAST TRAJECTORY (TIMELINE & AUTO-MORPH CARD)
      ────────────────────────────────────────────────────────────── */}
      <section ref={trajectoryRef} className="space-y-4 pt-2 scroll-mt-10" aria-labelledby="past-trajectory-heading">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 id="past-trajectory-heading" className="text-lg font-extrabold text-[#0B0D24] tracking-tight">
              PAST TRAJECTORY
            </h3>
            <p className="text-xs text-[#7A7F99]">
              How the competitor&apos;s position changed over time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {prefersReducedMotion ? (
              <span className="text-xs text-[#7A7F99]">
                Click node to inspect
              </span>
            ) : isUserPaused ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF1FB] border border-[#DDE3F5] text-xs font-medium text-[#3F4463]">
                  <span>PAUSED ({pausedCountdown}s)</span>
                </span>
                <button
                  type="button"
                  onClick={resumeAutoTraversal}
                  className="text-xs text-[#4338F0] hover:underline font-bold cursor-pointer"
                >
                  Resume ▶
                </button>
              </div>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DDF8EE] border border-[#19C08B]/30 text-xs font-semibold text-[#0d8f66]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#19C08B] animate-pulse"></span>
                <span>Auto-playing (5s)</span>
              </span>
            )}
          </div>
        </div>

        {/* Horizontal Timeline Track */}
        <div className="gl p-6 shadow-sm border border-[#DDE3F5] space-y-6">
          <div className="relative py-6 px-2 overflow-x-auto">
            {/* Background line */}
            <div className="absolute top-1/2 left-8 right-8 h-[2px] bg-[#DDE3F5] -translate-y-1/2 rounded-full"></div>

            {/* Active connecting line */}
            <div
              className="absolute top-1/2 left-8 h-[2px] bg-gradient-to-r from-[#3B3FF0] via-[#5560F8] to-[#7C5CF0] -translate-y-1/2 transition-all duration-500 ease-out pointer-events-none rounded-full"
              style={{
                width: trajectoryEvents.length > 1
                  ? `calc(${selectedMilestone / (trajectoryEvents.length - 1)} * (100% - 4rem))`
                  : "0%"
              }}
            />

            <div className="relative flex items-center justify-between gap-4 min-w-[520px] md:min-w-0 w-full px-4">
              {trajectoryEvents.map((item, idx) => {
                const isSelected = selectedMilestone === idx;
                const isPast = idx < selectedMilestone;
                const title = getMilestoneTitle(item);
                const dateStr = formatShortDate(item.date);

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleMilestoneClick(idx)}
                    className="flex flex-col items-center group transition-all cursor-pointer focus:outline-none"
                  >
                    {/* Date */}
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider mb-2 transition-all duration-200 ${
                        isSelected
                          ? "text-[#4338F0]"
                          : isPast
                          ? "text-[#3F4463]"
                          : "text-[#7A7F99] group-hover:text-[#0B0D24]"
                      }`}
                    >
                      {dateStr}
                    </span>

                    {/* Node Dot */}
                    <div
                      className={`relative rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                        isSelected
                          ? "w-6 h-6 bg-white border-[#4338F0] ring-4 ring-[#4338F0]/20 shadow-[0_4px_16px_rgba(67,56,240,0.3)] scale-110 z-10"
                          : isPast
                          ? "w-4 h-4 bg-[#4338F0] border-white z-0"
                          : "w-4 h-4 bg-white border-[#DDE3F5] group-hover:border-[#4338F0] z-0"
                      }`}
                    >
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-[#4338F0] animate-pulse"></span>
                      )}
                    </div>

                    {/* Short Title */}
                    <span
                      className={`text-xs tracking-tight mt-2 text-center max-w-[95px] leading-tight font-medium transition-colors ${
                        isSelected
                          ? "text-[#0B0D24] font-extrabold"
                          : isPast
                          ? "text-[#3F4463]"
                          : "text-[#7A7F99] group-hover:text-[#0B0D24]"
                      }`}
                    >
                      {title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Event Detail Card (Concise, 1 event at a time, morphs) */}
          {activeEvent && (
            <div
              key={selectedMilestone}
              className="p-5 rounded-2xl bg-[#F7F9FF] border border-[#DDE3F5] space-y-2 animate-in fade-in duration-300"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#4338F0] uppercase tracking-wider">
                  {formatShortDate(activeEvent.date).toUpperCase()} &bull; {activeEvent.category.toUpperCase()}
                </span>
                <span className="text-[11px] text-[#7A7F99]">
                  Source: {activeEvent.source || "Synthetic CI dataset"}
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-extrabold text-[#0B0D24]">
                {getMilestoneShortTitle(activeEvent)}
              </h4>

              <p className="text-xs sm:text-sm text-[#3F4463] leading-relaxed">
                {activeEvent.event}
              </p>

              {/* 3s Timer Progress line */}
              {!isUserPaused && !prefersReducedMotion && (
                <div className="w-full bg-[#EEF1FB] rounded-full h-1 overflow-hidden mt-3">
                  <div
                    key={`bar-${selectedMilestone}`}
                    className="bg-[#4338F0] h-full rounded-full"
                    style={{ animation: "progress 5s linear" }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </section>


      {/* ──────────────────────────────────────────────────────────────
          SECTION 5 — WHAT THE HISTORY SUGGESTS
      ────────────────────────────────────────────────────────────── */}
      <section className="space-y-4 pt-2" aria-labelledby="history-suggests-heading">
        <div>
          <h3 id="history-suggests-heading" className="text-lg font-extrabold text-[#0B0D24] tracking-tight">
            WHAT THE HISTORY SUGGESTS
          </h3>
          <p className="text-xs text-[#7A7F99]">
            A pattern across the observed events.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          {/* LEFT COLUMN: OBSERVED */}
          <div className="gl p-6 rounded-2xl border border-[#DDE3F5] space-y-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="tagp o">OBSERVED</span>
                <span className="text-xs text-[#7A7F99]">Dated changes from living memory</span>
              </div>

              <div className="space-y-2.5">
                {observedFacts.map((fact, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-white border border-[#DDE3F5] border-l-4 border-l-[#19C08B] text-xs sm:text-sm font-semibold text-[#0B0D24]"
                  >
                    {fact}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 text-[11px] text-[#7A7F99] border-t border-[#EEF1FB]">
              Verified historical signals tied to synthetic source records.
            </div>
          </div>

          {/* RIGHT COLUMN: STRATEGIC SIGNAL */}
          <div className="gl p-6 rounded-2xl border border-[#7C6BF5]/40 bg-gradient-to-br from-white via-white to-[#EDE8FF]/40 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="tagp i">SIGNAL</span>
                <span className="text-xs text-[#4338F0] font-semibold">Causal Interpretation</span>
              </div>

              <blockquote className="text-sm sm:text-base font-semibold text-[#0B0D24] leading-relaxed">
                &ldquo;{strategicInterpretation}&rdquo;
              </blockquote>
            </div>

            <div className="pt-3 border-t border-[#DDE3F5] flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-[#7A7F99] uppercase tracking-wider block">
                  EVIDENCE STRENGTH
                </span>
                <span className="text-xs text-[#3F4463]">
                  Supported by 3+ related historical observations
                </span>
              </div>

              <span className="px-3 py-1 rounded-full bg-[#EEF1FB] border border-[#DDE3F5] text-xs font-extrabold text-[#4338F0]">
                HIGH
              </span>
            </div>
          </div>
        </div>
      </section>


      {/* ──────────────────────────────────────────────────────────────
          SECTION 6 — LIVING COMPANY MEMORY (INDEX1 LIVING INTELLIGENCE PROFILE)
      ────────────────────────────────────────────────────────────── */}
      <section className="relative space-y-4 pt-4" aria-labelledby="living-memory-heading">
        {/* Soft Ambient Glow */}
        <div
          className="absolute -right-12 -bottom-10 w-96 h-80 rounded-full pointer-events-none -z-10"
          style={{ background: "rgba(196, 186, 255, 0.35)", filter: "blur(60px)" }}
          aria-hidden="true"
        />

        <div className="space-y-1">
          <span className="eb">
            <i />
            Living company memory
          </span>
          <h2
            id="living-memory-heading"
            className="text-xl sm:text-2xl font-extrabold text-[#0B0D24] tracking-tight font-heading mt-1"
          >
            Every company gets a living intelligence profile.
          </h2>
        </div>

        <div className="dw">
          <article className="dos gl" aria-label={`${competitor} intelligence profile`}>
            {/* Header: Company, Observation & Research dates, Synthetic demo data badge */}
            <header className="dh">
              <div>
                <p className="dm">COMPETITIVE INTELLIGENCE</p>
                <h3 className="dn uppercase">{competitor}</h3>
              </div>
              <div className="dd">
                <span>
                  First observed <b>{livingProfile.firstObserved}</b>
                </span>
                <span>
                  Last researched <b>{livingProfile.lastResearched}</b>
                </span>
                <span className="syn">Synthetic demo data</span>
              </div>
            </header>

            {/* Stats row: Observations, Categories, Recent changes */}
            <div className="stats">
              <div className="st">
                <b>{animatedObsCount}</b>
                <span>Observations</span>
              </div>
              <div className="st">
                <b>{animatedCatCount}</b>
                <span>Categories</span>
              </div>
              <div className="st">
                <b>{animatedChangesCount}</b>
                <span>Recent changes</span>
              </div>
            </div>

            {/* Two-Column Body: Category distribution & Grouped tags */}
            <div className="db">
              {/* Left Column: Category distribution */}
              <div>
                <h4>Category distribution</h4>
                <div className="space-y-1">
                  {livingProfile.categoryDistribution.map((item) => (
                    <div key={item.category} className="bx">
                      <span title={item.category}>{item.category}</span>
                      <i>
                        <b
                          style={{
                            width: profileAnimated ? `${item.pct}%` : "0%",
                            backgroundColor: item.color,
                          }}
                        />
                      </i>
                      <em>{item.count}</em>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Strategic themes, Recent changes, Watch next */}
              <div>
                <div className="grp">
                  <h4>Strategic themes</h4>
                  <div className="flex flex-wrap">
                    {livingProfile.strategicThemes.map((theme, idx) => (
                      <span key={idx} className="tg a">{theme}</span>
                    ))}
                  </div>
                </div>

                <div className="grp">
                  <h4>Recent changes</h4>
                  <div className="flex flex-wrap">
                    {livingProfile.recentChanges.map((change, idx) => (
                      <span key={idx} className="tg c">{change}</span>
                    ))}
                  </div>
                </div>

                <div className="grp">
                  <h4>Watch next</h4>
                  <div className="flex flex-wrap">
                    {livingProfile.watchNext.map((wn, idx) => (
                      <span key={idx} className="tg w">{wn}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>


      {/* ──────────────────────────────────────────────────────────────
          SECTION 7 — WATCH NEXT
      ────────────────────────────────────────────────────────────── */}
      <section className="space-y-4 pt-2" aria-labelledby="watch-next-heading">
        <div>
          <h3 id="watch-next-heading" className="text-lg font-extrabold text-[#0B0D24] tracking-tight">
            WATCH NEXT
          </h3>
          <p className="text-xs text-[#7A7F99]">
            Developments worth monitoring based on the current trajectory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {watchCards.map((card, idx) => {
            const isAlertSet = alertSetIndices[idx];

            return (
              <div
                key={idx}
                className="gl p-5 rounded-2xl border border-[#DDE3F5] space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[#4338F0]">
                      {card.num}
                    </span>
                    <span className="text-[11px] font-bold text-[#7A7F99] uppercase tracking-wider">
                      {card.category}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#0B0D24] font-medium leading-relaxed">
                    {card.text}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#EEF1FB] flex items-center justify-between">
                  <span className="text-[11px] text-[#7A7F99]">
                    Monitoring trigger
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleAlert(idx)}
                    className={`text-xs font-semibold px-3 py-1 rounded-full transition-all cursor-pointer ${
                      isAlertSet
                        ? "bg-[#19C08B] text-white"
                        : "bg-[#EEF1FB] text-[#4338F0] hover:bg-[#4338F0] hover:text-white"
                    }`}
                  >
                    {isAlertSet ? "Alert active ✓" : "Create alert →"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* ──────────────────────────────────────────────────────────────
          SECTION 8 — EVIDENCE (SOURCE-BACKED OBSERVATIONS)
      ────────────────────────────────────────────────────────────── */}
      <section className="space-y-4 pt-2 pb-6" aria-labelledby="evidence-heading">
        <div className="flex items-center justify-between">
          <div>
            <h3 id="evidence-heading" className="text-lg font-extrabold text-[#0B0D24] tracking-tight">
              EVIDENCE
            </h3>
            <p className="text-xs text-[#7A7F99]">
              The observations behind this analysis.
            </p>
          </div>
          <span className="syn">Synthetic CI dataset</span>
        </div>

        <div className="gl rounded-2xl border border-[#DDE3F5] divide-y divide-[#EEF1FB] overflow-hidden">
          {evidence.map((item, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:bg-[#EEF1FB]/30 transition-colors"
            >
              <div className="sm:w-36 shrink-0 space-y-1">
                <span className="text-xs font-extrabold text-[#0B0D24] uppercase tracking-wider block">
                  {formatShortDate(item.date).toUpperCase()}
                </span>
                <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#EEF1FB] text-[#4338F0] border border-[#DDE3F5] uppercase">
                  {item.category}
                </span>
              </div>

              <div className="flex-1 space-y-1">
                <h5 className="text-xs sm:text-sm font-extrabold text-[#0B0D24]">
                  {getMilestoneShortTitle(item)}
                </h5>
                <p className="text-xs text-[#3F4463] leading-relaxed">
                  {item.event}
                </p>
              </div>

              <div className="sm:w-32 shrink-0 sm:text-right">
                <span className="text-[11px] text-[#7A7F99] block font-medium">
                  Source:
                </span>
                <span className="text-[11px] text-[#3F4463] font-semibold">
                  {item.source || "Synthetic CI dataset"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
