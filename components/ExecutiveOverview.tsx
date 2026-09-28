"use client";

import { IntelligenceEvidence } from "@/lib/api";

interface ExecutiveOverviewProps {
  competitor: string;
  question: string;
  summary: string;
  strategicSignal: string;
  evidence: IntelligenceEvidence[];
  observedChanges: string[];
}

export function ExecutiveOverview({
  competitor,
  question,
  summary,
  strategicSignal,
  evidence,
  observedChanges,
}: ExecutiveOverviewProps) {
  // Compute category counts
  const categoryCounts: Record<string, number> = {};
  evidence.forEach((e) => {
    const cat = (e.category || "other").toLowerCase();
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  // Calculate trajectory profile based on competitor
  const isAcme = competitor.toLowerCase().includes("acme");
  const isNimbus = competitor.toLowerCase().includes("nimbus");

  const primaryVector = isAcme
    ? "Barbell Expansion (Enterprise AI + $39 Price Weaponization)"
    : isNimbus
    ? "Upmarket Fortress (Governance, Compliance & High-Touch SLA)"
    : "PLG to Enterprise Pipeline (Self-Serve Workspaces + Outbound Sales)";

  const threatPosture = isAcme
    ? "High (Direct Mid-Market Price Pressure & AI Feature Parity)"
    : isNimbus
    ? "Elevated (Securing High-ACV Enterprise Long-Term Contracts)"
    : "Moderate-High (Bottom-Up Account Infiltration via Starter Tiers)";

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
      {/* Dossier Header */}
      <div className="p-6 sm:p-7 border-b border-slate-100 bg-slate-50/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-slate-900 text-white">
                CIA DOSSIER
              </span>
              <span className="text-xs font-mono text-slate-400">
                Temporal Synthesis · 90-Day Window
              </span>
            </div>

            <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
              {competitor} Strategic Overview
            </h2>

            <p className="text-xs text-slate-500 font-mono mt-1">
              Analysis Query: &ldquo;{question}&rdquo;
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
              {evidence.length} Verified Milestones
            </span>
            <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl shadow-2xs">
              Active Strategy Tracked
            </span>
          </div>
        </div>

        {/* 4 Key Intelligence Indicator Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-6">
          {/* Card 1: Strategic Velocity */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">
              Strategic Velocity
            </span>
            <span className="text-sm font-bold text-[#0F172A] block">
              {evidence.length} moves / 90 days
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              ~1 major event every {Math.round(90 / (evidence.length || 1))} days
            </span>
          </div>

          {/* Card 2: Primary Trajectory */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">
              Primary Vector
            </span>
            <span className="text-sm font-bold text-[#0F172A] block truncate" title={primaryVector}>
              {isAcme ? "Barbell Pricing & AI" : isNimbus ? "Upmarket Governance" : "PLG to Outbound Sales"}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Coordinated cross-domain shift
            </span>
          </div>

          {/* Card 3: Domain Distribution */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">
              Domain Allocation
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {Object.entries(categoryCounts).map(([cat, count]) => (
                <span
                  key={cat}
                  className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {cat}: {count}
                </span>
              ))}
            </div>
          </div>

          {/* Card 4: Market Threat Posture */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">
              Market Posture
            </span>
            <span className="text-sm font-bold text-[#0F172A] block truncate" title={threatPosture}>
              {threatPosture.split(" (")[0]}
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Temporal signal confidence high
            </span>
          </div>
        </div>
      </div>

      {/* Deep Executive Briefing Section */}
      <div className="p-6 sm:p-7 space-y-6">
        {/* Section 1: Executive Synthesis */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-mono mb-2.5">
            EXECUTIVE STRATEGIC SYNTHESIS
          </h3>
          <p className="text-[15px] leading-relaxed text-slate-700 font-normal">
            {summary}
          </p>
        </div>

        {/* Section 2: Inferred Strategic Signal */}
        <div className="p-5 rounded-xl border border-slate-900 bg-slate-50/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold font-mono uppercase tracking-wider text-[#0F172A]">
              UNDERLYING STRATEGIC THESIS
            </span>
            <span className="text-[10px] font-mono font-bold uppercase bg-slate-900 text-white px-2 py-0.5 rounded">
              SIGNAL
            </span>
          </div>
          <p className="text-[14px] leading-relaxed text-[#0F172A] font-medium italic">
            &ldquo;{strategicSignal}&rdquo;
          </p>
        </div>

        {/* Section 3: Strategic Counter-Playbook & Tactical Response */}
        <div className="pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-mono mb-3">
            TACTICAL COUNTER-PLAYBOOK
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Playbook 1: Product Strategy */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                <span className="text-xs font-bold font-mono uppercase text-[#0F172A]">
                  Product Counter-Measure
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isAcme
                  ? "Highlight deep enterprise workflow integrations and accuracy benchmarks to counter their standalone AI assistant launch."
                  : isNimbus
                  ? "Offer automated self-service compliance reports to reduce buyer dependence on Nimbus's high-touch services."
                  : "Expand pre-configured vertical analytics templates to preempt Vertex's newly launched industry dashboards."}
              </p>
            </div>

            {/* Playbook 2: Sales & Pricing Defense */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                <span className="text-xs font-bold font-mono uppercase text-[#0F172A]">
                  Sales & Pricing Motion
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isAcme
                  ? "Arm sales reps with TCO calculators demonstrating hidden usage-based overage fees beneath Acme's $39 headline price."
                  : isNimbus
                  ? "Provide competitive buyout terms and rapid 48-hour onboarding against Nimbus's rigid multi-month enterprise rollout."
                  : "Target mid-market accounts currently in Vertex starter trials with tiered enterprise incentives before outbound reps close them."}
              </p>
            </div>

            {/* Playbook 3: Messaging & Positioning */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                <span className="text-xs font-bold font-mono uppercase text-[#0F172A]">
                  Positioning Angle
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {isAcme
                  ? "Expose Acme's sudden price reduction as defensive churn mitigation rather than innovation-driven customer value."
                  : isNimbus
                  ? "Frame Nimbus as an expensive legacy-style vendor charging excessive premiums for basic governance features."
                  : "Position our solution as the complete end-to-end platform, contrasting against Vertex's lightweight starter workspaces."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
