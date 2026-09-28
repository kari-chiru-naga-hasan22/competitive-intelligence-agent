"use client";

import { useState, useMemo } from "react";
import competitorsData from "@/data/competitors.json";

interface InsightsViewProps {
  onAnalyzeCompetitor: (competitor: string, question: string) => void;
}

interface StoredEvent {
  competitor: string;
  date: string;
  category: string;
  event: string;
  source: string;
}

const ENTITY_INSIGHT_SUMMARIES: Record<
  string,
  {
    theme: string;
    thesis: string;
    strategicSignal: string;
    defaultQuestion: string;
    color: string;
    iconColor: string;
  }
> = {
  "Acme Cloud": {
    theme: "Dual-Pronged Barbell Strategy",
    thesis:
      "Acme fortified enterprise accounts in July/August with advanced security and an AI assistant, then aggressively weaponized a -20.4% price cut ($49 to $39) and usage billing in September to trigger mid-market competitor churn.",
    strategicSignal:
      "Enterprise posture defense paired with aggressive low-end customer acquisition to counter mid-market margin compression.",
    defaultQuestion: "What changed in their strategy?",
    color: "#E6EAFB",
    iconColor: "#4338F0",
  },
  "Nimbus Analytics": {
    theme: "Enterprise Trust & Anomaly Governance",
    thesis:
      "Nimbus is intentionally ignoring the self-serve price wars, doubling down on enterprise governance, automated anomaly detection, and business data integration partnerships.",
    strategicSignal:
      "Upmarket consolidation focused on enterprise compliance and automated intelligence over volume customer acquisition.",
    defaultQuestion: "What is Nimbus Analytics' enterprise and AI strategy?",
    color: "#DDF8EE",
    iconColor: "#19C08B",
  },
  "Vertex Data": {
    theme: "PLG Entry Feeding Outbound Enterprise",
    thesis:
      "Vertex introduced low-friction self-service workspaces and starter packages in mid-summer to feed a rapidly expanding outbound enterprise sales organization.",
    strategicSignal:
      "High-velocity top-of-funnel conversion designed to funnel enterprise expansion accounts to their sales team.",
    defaultQuestion: "How has Vertex Data positioned its products and pricing?",
    color: "#FFF0DD",
    iconColor: "#F59A2A",
  },
  Shopify: {
    theme: "Unified B2B Commerce & Agentic Merchants",
    thesis:
      "Shopify is aggressively expanding beyond retail into wholesale B2B commerce while embedding Sidekick conversational AI across all merchant workflows.",
    strategicSignal:
      "Capturing higher-GMV B2B transactions while insulating existing merchant retention with native AI workflow tools.",
    defaultQuestion: "What is Shopify's B2B and AI commerce strategy?",
    color: "#E8F5E9",
    iconColor: "#2E7D32",
  },
  HubSpot: {
    theme: "Seat-Based Pricing & Breeze AI Ecosystem",
    thesis:
      "HubSpot eliminated legacy seat minimums, transitioning to flexible seat-based billing while rolling out Breeze AI agents and Breeze Intelligence enrichment.",
    strategicSignal:
      "Lowering entry barriers to increase workspace adoption while monetizing premium intelligence and automated agents.",
    defaultQuestion: "How is HubSpot evolving its Breeze AI and seat pricing?",
    color: "#FFF3E0",
    iconColor: "#E65100",
  },
  Slack: {
    theme: "Conversational Agent Hub & Agentforce",
    thesis:
      "Slack is positioning itself as the interactive operating system for AI agents via Salesforce Agentforce integration and native Slack Lists.",
    strategicSignal:
      "Transforming workplace chat from human communication into an autonomous agent orchestration console.",
    defaultQuestion: "How is Slack positioning its AI and Agentforce integrations?",
    color: "#F3E5F5",
    iconColor: "#7B1FA2",
  },
  Notion: {
    theme: "Connected Workspaces & Enterprise Search",
    thesis:
      "Notion added cross-tool enterprise search connectors, modular AI agents, and credit-based compute tiers to become the single knowledge surface.",
    strategicSignal:
      "Consolidating fragmented enterprise SaaS tools into an extensible, AI-searchable document and database system.",
    defaultQuestion: "What is Notion's product expansion into search and AI agents?",
    color: "#EDE7F6",
    iconColor: "#512DA8",
  },
};

export function InsightsView({ onAnalyzeCompetitor }: InsightsViewProps) {
  const [selectedEntity, setSelectedEntity] = useState<string>("all");

  const typedEvents = competitorsData as StoredEvent[];

  // Compute category statistics for the selected entity
  const entityStats = useMemo(() => {
    if (selectedEntity === "all") return null;
    const events = typedEvents.filter(
      (e) => e.competitor.toLowerCase() === selectedEntity.toLowerCase()
    );
    const categoryCounts: Record<string, number> = {};
    events.forEach((e) => {
      categoryCounts[e.category] = (categoryCounts[e.category] || 0) + 1;
    });
    return {
      total: events.length,
      firstDate: events[0]?.date || "2026-07-01",
      lastDate: events[events.length - 1]?.date || "2026-09-27",
      categoryCounts,
    };
  }, [selectedEntity, typedEvents]);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="pb-5 border-b border-[#DDE3F5] space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="eb">
            <i></i>
            <span>Cross-Entity &bull; Strategic Signal Synthesis</span>
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B0D24] tracking-tight">
          Strategic Market Insights
        </h2>
        <p className="text-sm text-[#7A7F99]">
          Longitudinal strategic patterns and entity-specific insights synthesized from Hindsight memory
        </p>
      </div>

      {/* Entity Selection Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#EEF1FB]">
        <span className="text-[11px] font-bold uppercase text-[#7A7F99] mr-2 shrink-0">
          Scope View:
        </span>
        <button
          onClick={() => setSelectedEntity("all")}
          className={`px-3.5 py-1.5 rounded-full text-xs font-heading font-semibold transition-all shrink-0 cursor-pointer ${
            selectedEntity === "all"
              ? "bg-[#4338F0] text-white shadow-xs"
              : "bg-[#EEF1FB] text-[#3F4463] hover:text-[#4338F0]"
          }`}
        >
          All Market Themes
        </button>

        {Object.keys(ENTITY_INSIGHT_SUMMARIES).map((compName) => (
          <button
            key={compName}
            onClick={() => setSelectedEntity(compName)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-heading font-semibold transition-all shrink-0 cursor-pointer ${
              selectedEntity === compName
                ? "bg-[#4338F0] text-white shadow-xs"
                : "bg-white text-[#3F4463] border border-[#DDE3F5] hover:text-[#4338F0]"
            }`}
          >
            {compName}
          </button>
        ))}
      </div>

      {/* VIEW A: Cross-Entity Market Themes */}
      {selectedEntity === "all" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Signal 1: AI Race */}
          <div className="gl p-6 sm:p-7 shadow-[0_16px_36px_rgba(80,90,220,0.08)] space-y-4 hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEF1FB]">
              <span className="text-[11px] font-bold uppercase text-[#4338F0] bg-[#EEF1FB] border border-[#DDE3F5] px-2.5 py-1 rounded-full">
                MARKET THEME
              </span>
              <span className="text-xs text-[#7A7F99]">7 Competitors Tracked</span>
            </div>

            <h3 className="text-xl font-extrabold text-[#0B0D24]">
              The AI-First Repositioning Wave
            </h3>

            <p className="text-xs sm:text-sm text-[#3F4463] leading-relaxed">
              Every tracked competitor shifted core positioning to include AI between July and August. Acme launched an AI assistant, Nimbus deployed automated anomaly detection, and Vertex introduced automated vertical dashboards.
            </p>

            <button
              type="button"
              onClick={() =>
                onAnalyzeCompetitor(
                  "Acme Cloud",
                  "How has AI repositioning changed Acme Cloud's market strategy?"
                )
              }
              className="text-xs font-bold text-[#4338F0] hover:text-[#3B3FF0] uppercase tracking-wider pt-2 block cursor-pointer transition-colors"
            >
              Probe Acme AI Strategy &rarr;
            </button>
          </div>

          {/* Signal 2: Enterprise Barricades */}
          <div className="gl p-6 sm:p-7 shadow-[0_16px_36px_rgba(80,90,220,0.08)] space-y-4 hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEF1FB]">
              <span className="text-[11px] font-bold uppercase text-[#0d8f66] bg-[#DDF8EE] border border-[#19C08B]/30 px-2.5 py-1 rounded-full">
                GO-TO-MARKET
              </span>
              <span className="text-xs text-[#7A7F99]">Nimbus &bull; Vertex</span>
            </div>

            <h3 className="text-xl font-extrabold text-[#0B0D24]">
              Upmarket Enterprise Consolidation
            </h3>

            <p className="text-xs sm:text-sm text-[#3F4463] leading-relaxed">
              While Acme lowered Pro pricing ($49 to $39), Nimbus and Vertex actively fortified upmarket tiers with dedicated customer success managers and enterprise sales expansion.
            </p>

            <button
              type="button"
              onClick={() =>
                onAnalyzeCompetitor(
                  "Nimbus Analytics",
                  "What is Nimbus Analytics' enterprise and AI strategy?"
                )
              }
              className="text-xs font-bold text-[#4338F0] hover:text-[#3B3FF0] uppercase tracking-wider pt-2 block cursor-pointer transition-colors"
            >
              Probe Nimbus Strategy &rarr;
            </button>
          </div>

          {/* Signal 3: Pricing Experimentation */}
          <div className="gl p-6 sm:p-7 shadow-[0_16px_36px_rgba(80,90,220,0.08)] space-y-4 hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEF1FB]">
              <span className="text-[11px] font-bold uppercase text-[#F59A2A] bg-[#FFF0DD] border border-[#F59A2A]/30 px-2.5 py-1 rounded-full">
                MONETIZATION
              </span>
              <span className="text-xs text-[#7A7F99]">Acme &bull; Vertex &bull; HubSpot</span>
            </div>

            <h3 className="text-xl font-extrabold text-[#0B0D24]">
              Self-Serve Land &amp; Expand Squeeze
            </h3>

            <p className="text-xs sm:text-sm text-[#3F4463] leading-relaxed">
              Both Acme and Vertex introduced lower-friction pricing tiers (Acme $39 price point and Vertex self-service starter packages) to capture early user intent, while HubSpot overhauled seat minimums.
            </p>

            <button
              type="button"
              onClick={() =>
                onAnalyzeCompetitor(
                  "Vertex Data",
                  "How has Vertex Data positioned its products and pricing?"
                )
              }
              className="text-xs font-bold text-[#4338F0] hover:text-[#3B3FF0] uppercase tracking-wider pt-2 block cursor-pointer transition-colors"
            >
              Probe Vertex Strategy &rarr;
            </button>
          </div>
        </div>
      )}

      {/* VIEW B: Entity-Specific Strategic Synthesis */}
      {selectedEntity !== "all" && ENTITY_INSIGHT_SUMMARIES[selectedEntity] && (
        <div className="space-y-6">
          <div className="gl p-7 sm:p-8 shadow-[0_16px_36px_rgba(80,90,220,0.08)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EEF1FB] gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold"
                  style={{
                    background: ENTITY_INSIGHT_SUMMARIES[selectedEntity].color,
                    color: ENTITY_INSIGHT_SUMMARIES[selectedEntity].iconColor,
                  }}
                >
                  {selectedEntity.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-extrabold text-[#0B0D24]">
                      {selectedEntity}
                    </h3>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#EEF1FB] text-[#4338F0] border border-[#DDE3F5]">
                      ENTITY MEMORY ACTIVE
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#4338F0]">
                    {ENTITY_INSIGHT_SUMMARIES[selectedEntity].theme}
                  </p>
                </div>
              </div>

              {entityStats && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-[#EEF1FB] text-[#4338F0] font-mono font-bold">
                    {entityStats.total} Events Retained
                  </span>
                  <span className="text-[#7A7F99]">
                    ({entityStats.firstDate} &ndash; {entityStats.lastDate})
                  </span>
                </div>
              )}
            </div>

            {/* Strategic Thesis */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A7F99]">
                Strategic Thesis &bull; Longitudinal Interpretation
              </span>
              <p className="text-sm sm:text-base text-[#0B0D24] leading-relaxed font-medium">
                {ENTITY_INSIGHT_SUMMARIES[selectedEntity].thesis}
              </p>
            </div>

            {/* Core Signal Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#EEF1FB] to-white border border-[#DDE3F5] flex items-start gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4338F0] mt-1 shrink-0"></span>
              <div>
                <span className="text-xs font-heading font-extrabold uppercase text-[#4338F0] tracking-wider block mb-1">
                  Synthesized Strategic Signal
                </span>
                <p className="text-xs sm:text-sm text-[#3F4463] leading-relaxed">
                  {ENTITY_INSIGHT_SUMMARIES[selectedEntity].strategicSignal}
                </p>
              </div>
            </div>

            {/* Category Breakdown Bar */}
            {entityStats && (
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A7F99] block">
                  Observed Event Distribution in Hindsight:
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  {Object.entries(entityStats.categoryCounts).map(([cat, count]) => (
                    <span
                      key={cat}
                      className="px-3 py-1 rounded-lg bg-white border border-[#DDE3F5] font-semibold text-[#3F4463] flex items-center gap-1.5"
                    >
                      <span className="capitalize">{cat}:</span>
                      <span className="font-mono font-bold text-[#4338F0]">{count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Direct Probe Action */}
            <div className="pt-3 border-t border-[#EEF1FB] flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-[#7A7F99] italic">
                Derived directly from {selectedEntity}&apos;s persistent memory bank.
              </p>
              <button
                type="button"
                onClick={() =>
                  onAnalyzeCompetitor(
                    selectedEntity,
                    ENTITY_INSIGHT_SUMMARIES[selectedEntity].defaultQuestion
                  )
                }
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-heading font-bold uppercase tracking-wider text-white bg-[#4338F0] hover:bg-[#3730A3] rounded-xl transition-all shadow-[0_4px_12px_rgba(67,56,240,0.2)] cursor-pointer"
              >
                Synthesize Strategic Dossier on Dashboard &rarr;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
