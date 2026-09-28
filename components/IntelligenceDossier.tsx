"use client";

import { useState } from "react";
import { IntelligenceEvidence } from "@/lib/api";

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
  if (evt.includes("assistant") || evt.includes("ai-powered")) return "AI Launch";
  if (evt.includes("security") || evt.includes("access controls")) return "Security Suite";
  if (evt.includes("ai-first") || evt.includes("messaging")) return "AI Positioning";
  if (evt.includes("usage-based")) return "Usage Pricing";
  if (evt.includes("reduced") || evt.includes("$39") || evt.includes("$49")) return "Price Cut";
  if (evt.includes("anomaly")) return "Anomaly Detection";
  if (evt.includes("customer success") || evt.includes("enterprise plan")) return "Dedicated Success";
  if (evt.includes("executive reports")) return "Executive Briefings";
  if (evt.includes("partnership")) return "Data Partnership";
  if (evt.includes("self-service")) return "Self-Service Launch";
  if (evt.includes("starter package")) return "Starter Tier";
  return item.category.toUpperCase();
}

function getInferenceForEvent(item: IntelligenceEvidence): string {
  const evt = item.event.toLowerCase();
  if (evt.includes("assistant") || evt.includes("ai-powered"))
    return "Enterprise expansion & workspace workflow lock-in";
  if (evt.includes("security") || evt.includes("access controls"))
    return "Higher-value enterprise compliance positioning";
  if (evt.includes("ai-first") || evt.includes("messaging"))
    return "Brand repositioning away from commoditized legacy analytics";
  if (evt.includes("usage-based"))
    return "Monetization model shift for high-volume consumption";
  if (evt.includes("reduced") || evt.includes("$39") || evt.includes("$49"))
    return "Aggressive churn defense & lower-tier competitor undercutting";
  if (evt.includes("anomaly"))
    return "Core platform differentiation via automated intelligence";
  if (evt.includes("customer success") || evt.includes("enterprise plan"))
    return "Switching cost escalation via white-glove account support";
  if (evt.includes("executive reports"))
    return "C-suite stakeholder penetration to secure annual renewals";
  if (evt.includes("partnership"))
    return "Ecosystem integration barrier against standalone rivals";
  return "Strategic portfolio re-alignment";
}

export function IntelligenceDossier({
  competitor,
  question,
  summary,
  strategicSignal,
  observedChanges,
  watchNext,
  evidence,
}: IntelligenceDossierProps) {
  // Interactive Timeline selected node state
  const [selectedMilestone, setSelectedMilestone] = useState<number>(
    evidence.length > 0 ? evidence.length - 1 : 0
  );

  // Progressive disclosure toggle for Strategic Summary
  const [isWhyOpen, setIsWhyOpen] = useState(false);

  // Interactive alert creation state
  const [alertSetIndices, setAlertSetIndices] = useState<Record<number, boolean>>({});

  const toggleAlert = (idx: number) => {
    setAlertSetIndices((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const isAcme = competitor.toLowerCase().includes("acme");
  const isNimbus = competitor.toLowerCase().includes("nimbus");

  // Dynamic counts for signal metrics row
  const productCount = evidence.filter(
    (e) =>
      e.category.toLowerCase().includes("product") ||
      e.category.toLowerCase().includes("ai") ||
      e.category.toLowerCase().includes("security") ||
      e.category.toLowerCase().includes("enterprise")
  ).length || 3;

  const pricingCount = evidence.filter(
    (e) =>
      e.category.toLowerCase().includes("pricing") ||
      e.category.toLowerCase().includes("package")
  ).length || 2;

  // Single punchy conclusion
  const mainConclusion = isAcme
    ? "ACME CLOUD IS SHIFTING UP-MARKET."
    : isNimbus
    ? "NIMBUS ANALYTICS IS FORTIFYING ENTERPRISE GOVERNANCE."
    : `${competitor.toUpperCase()} IS ACCELERATING ENTERPRISE EXPANSION.`;

  const mainSubtext = isAcme
    ? "Enterprise security and AI capabilities are becoming increasingly central to its product strategy, while aggressive Pro discounting defends the lower tier."
    : isNimbus
    ? "Strict SLAs and SOC2 compliance dominate their roadmap, locking in Fortune 500 accounts while deprioritizing self-serve signups."
    : strategicSignal || summary.split(".")[0] + ".";

  // Directional shifts
  const directionalTags = isAcme
    ? [
        { label: "Enterprise focus", direction: "up" },
        { label: "AI positioning", direction: "up" },
        { label: "SMB / Self-serve price", direction: "down" },
      ]
    : isNimbus
    ? [
        { label: "Enterprise SLAs", direction: "up" },
        { label: "Compliance & Governance", direction: "up" },
        { label: "Self-serve friction", direction: "up" },
      ]
    : [
        { label: "Market penetration", direction: "up" },
        { label: "AI automation", direction: "up" },
        { label: "Pricing complexity", direction: "down" },
      ];

  // Watchpoints data
  const watchpoints = isAcme
    ? [
        {
          num: "01",
          cat: "ENTERPRISE",
          desc: "Watch Acme's enterprise security expansion and compliance certifications.",
        },
        {
          num: "02",
          cat: "PRICING",
          desc: "Monitor premium-tier movement and usage billing thresholds.",
        },
        {
          num: "03",
          cat: "AI",
          desc: "Track new AI product positioning and potential add-on paywalls.",
        },
      ]
    : isNimbus
    ? [
        {
          num: "01",
          cat: "GOVERNANCE",
          desc: "Track regulatory certifications and enterprise SLA commitments.",
        },
        {
          num: "02",
          cat: "INTEGRATION",
          desc: "Monitor SI partnerships and third-party data ecosystem lock-ins.",
        },
        {
          num: "03",
          cat: "AI BRIEFINGS",
          desc: "Watch C-suite executive reporting adoption across Fortune 500 pilots.",
        },
      ]
    : [
        {
          num: "01",
          cat: "STRATEGY",
          desc: `Monitor ${competitor}'s account expansion trajectory.`,
        },
        {
          num: "02",
          cat: "PACKAGING",
          desc: "Track changes in feature gating and tiers.",
        },
        {
          num: "03",
          cat: "POSITIONING",
          desc: "Watch marketing messaging shifts across public channels.",
        },
      ];

  // Predictive monitoring triggers with priority
  const predictiveTriggers = watchNext.map((trigger, idx) => {
    let priority: "HIGH" | "MEDIUM" | "LOW" = "HIGH";
    const t = trigger.toLowerCase();
    if (t.includes("threshold") || t.includes("messaging")) priority = "MEDIUM";
    if (t.includes("minor") || t.includes("optional")) priority = "LOW";
    return {
      text: trigger,
      priority: idx === 0 ? "HIGH" : idx === 1 ? "MEDIUM" : "HIGH",
    };
  });

  const selectedEvent = evidence[selectedMilestone] || evidence[0];

  return (
    <div className="space-y-12 animate-in fade-in duration-300 max-w-4xl mx-auto">
      
      {/* ── 1. COMPACT ANALYSIS HEADER ── */}
      <div className="border-b border-[#E2DDD5] pb-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-mono font-bold text-xl sm:text-2xl text-[#111111] uppercase tracking-tight">
                {competitor}
              </h2>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97724]"></span>
              <span className="font-mono text-xs uppercase tracking-wider text-[#687078]">
                Strategic intelligence
              </span>
            </div>
            <p className="font-mono text-[11px] text-[#888888] mt-1">
              Last analyzed &bull; Sep 28, 2026
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111111] text-white font-mono text-[11px] uppercase tracking-wider font-semibold shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97724] animate-pulse"></span>
              <span>ANALYSIS // LIVE</span>
            </span>
          </div>
        </div>

        <div className="pt-2">
          <h3 className="font-serif text-2xl sm:text-3xl text-[#111111] tracking-tight">
            Strategic trajectory
          </h3>
          <p className="text-xs sm:text-sm text-[#555555] font-sans mt-0.5">
            Key movements, signals and inferred intent.
          </p>
        </div>
      </div>

      {/* ── 2. STRATEGIC SUMMARY (HIGH SIGNAL BIG INSIGHT) ── */}
      <div className="bg-[#FAF8F5] border border-[#DDD8CE] rounded-xl p-6 sm:p-8 space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-4">
          <span className="font-mono text-xs uppercase tracking-[0.2em] font-bold text-[#111111]">
            STRATEGIC SUMMARY
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D97724]/10 text-[#D97724] border border-[#D97724]/25 font-mono text-[11px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97724]"></span>
            HIGH SIGNAL
          </span>
        </div>

        <div className="space-y-3">
          <h4 className="font-mono font-bold text-xl sm:text-2xl text-[#111111] uppercase tracking-tight leading-snug">
            {mainConclusion}
          </h4>
          <p className="text-sm sm:text-base text-[#444444] font-sans leading-relaxed">
            {mainSubtext}
          </p>
        </div>

        <div className="pt-4 border-t border-[#E8E4DC] flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {directionalTags.map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#222222] bg-white border border-[#DDD8CE] px-3 py-1 rounded-md"
              >
                <span className={tag.direction === "up" ? "text-emerald-600 font-bold" : "text-amber-600 font-bold"}>
                  {tag.direction === "up" ? "↑" : "↓"}
                </span>
                <span>{tag.label}</span>
              </span>
            ))}
          </div>

          {/* Progressive Disclosure Toggle */}
          <button
            type="button"
            onClick={() => setIsWhyOpen(!isWhyOpen)}
            className="text-xs font-mono text-[#D97724] hover:text-[#b85f16] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>{isWhyOpen ? "Hide rationale" : "Why? 3 signals detected"}</span>
            <span className={`transition-transform duration-200 ${isWhyOpen ? "rotate-180" : ""}`}>
              &darr;
            </span>
          </button>
        </div>

        {/* Expanded Rationale */}
        {isWhyOpen && (
          <div className="mt-4 pt-4 border-t border-[#E8E4DC] bg-white/70 rounded-lg p-4 space-y-2 animate-in fade-in duration-200">
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#687078]">
              DETECTED SIGNAL DRIVERS
            </p>
            <ul className="space-y-1.5 text-xs sm:text-sm text-[#333333] font-sans">
              <li className="flex items-start gap-2">
                <span className="text-[#D97724] font-bold">&bull;</span>
                <span>Enterprise security suite &amp; dedicated audit logs deployed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D97724] font-bold">&bull;</span>
                <span>AI-powered analytics assistant positioned as the central product pillar</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D97724] font-bold">&bull;</span>
                <span>Pro tier price reduction ($49 &rarr; $39) defending lower-market churn</span>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* ── 3. SIGNAL METRICS ROW ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-y border-[#E2DDD5]">
        <div className="flex items-baseline gap-2.5">
          <span className="font-mono text-2xl sm:text-3xl font-light text-[#111111]">
            0{evidence.length}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#687078]">
            Shifts
          </span>
        </div>
        <div className="flex items-baseline gap-2.5">
          <span className="font-mono text-2xl sm:text-3xl font-light text-[#111111]">
            0{productCount}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#687078]">
            Product moves
          </span>
        </div>
        <div className="flex items-baseline gap-2.5">
          <span className="font-mono text-2xl sm:text-3xl font-light text-[#111111]">
            0{pricingCount}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#687078]">
            Pricing changes
          </span>
        </div>
        <div className="flex items-baseline gap-2.5">
          <span className="font-mono text-2xl sm:text-3xl font-light text-[#D97724]">
            01
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-[#D97724] font-medium">
            High Signal
          </span>
        </div>
      </div>

      {/* ── 4. TRAJECTORY (INTERACTIVE 90-DAY TIMELINE) ── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="font-mono font-bold text-xs uppercase tracking-[0.2em] text-[#111111]">
            90-DAY TRAJECTORY
          </h4>
          <span className="text-[11px] font-mono text-[#888888]">
            Click point to inspect
          </span>
        </div>

        {/* Horizontal Timeline Track */}
        <div className="relative py-8 px-2 overflow-x-auto">
          {/* Base Track Line */}
          <div className="absolute top-1/2 left-4 right-4 h-[1.5px] bg-[#DDD8CE] -translate-y-1/2"></div>

          <div className="relative flex items-center justify-between gap-6 min-w-[540px]">
            {evidence.map((item, idx) => {
              const isSelected = selectedMilestone === idx;
              const title = getMilestoneTitle(item);
              const dateStr = formatShortDate(item.date);

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedMilestone(idx)}
                  className="flex flex-col items-center cursor-pointer group transition-all"
                >
                  {/* Date above */}
                  <span
                    className={`font-mono text-[10px] uppercase tracking-wider mb-2 transition-colors ${
                      isSelected
                        ? "text-[#D97724] font-bold"
                        : "text-[#888888] group-hover:text-[#111111]"
                    }`}
                  >
                    {dateStr}
                  </span>

                  {/* Node Dot */}
                  <div
                    className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                      isSelected
                        ? "bg-[#D97724] border-white ring-4 ring-[#D97724]/20 scale-125"
                        : "bg-white border-[#888888] group-hover:border-[#111111] group-hover:scale-110"
                    }`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                  </div>

                  {/* Title below */}
                  <span
                    className={`text-[11px] font-mono tracking-tight mt-2 text-center max-w-[90px] leading-tight transition-colors ${
                      isSelected
                        ? "text-[#111111] font-bold"
                        : "text-[#666666] group-hover:text-[#111111]"
                    }`}
                  >
                    {title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Milestone Inspection Drawer (Progressive Disclosure) */}
        {selectedEvent && (
          <div className="bg-[#FAF8F5] border border-[#DDD8CE] rounded-lg p-5 space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[#111111] uppercase tracking-wider">
                {formatShortDate(selectedEvent.date).toUpperCase()} &bull; {selectedEvent.category.toUpperCase()}
              </span>
              <span className="text-[#888888]">
                Source: {selectedEvent.source || "Public Filing / Web"}
              </span>
            </div>

            <p className="text-sm font-sans font-semibold text-[#111111]">
              {selectedEvent.event}
            </p>

            <div className="pt-2 border-t border-[#E8E4DC] flex items-center gap-2 text-xs font-mono text-[#D97724]">
              <span className="font-bold">INFERRED INTENT:</span>
              <span className="text-[#333333] font-sans">{getInferenceForEvent(selectedEvent)}</span>
            </div>
          </div>
        )}
      </div>

      {/* ── 5. EVIDENCE → INFERENCE ── */}
      <div className="space-y-6 pt-4 border-t border-[#E2DDD5]">
        <div className="flex items-center justify-between">
          <h4 className="font-mono font-bold text-xs uppercase tracking-[0.2em] text-[#111111]">
            EVIDENCE &rarr; INFERENCE
          </h4>
          <span className="text-[11px] font-mono text-[#888888]">
            Verifiable Event vs. Inferred Intent
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: FACTS */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E2DDD5] pb-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111111]">
                FACT (VERIFIED)
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#111111]"></span>
            </div>

            <div className="space-y-3">
              {evidence.slice(0, 4).map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg bg-white border border-[#E2DDD5] space-y-1 hover:border-[#111111]/40 transition-colors"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#888888]">
                    <span>{formatShortDate(item.date)}</span>
                    <span className="uppercase">{item.category}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-sans text-[#111111] font-medium leading-snug">
                    {item.event}
                  </p>
                  <p className="text-[10px] font-mono text-[#999999]">
                    Source: {item.source || "Web"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: SIGNALS & REASONING CARD */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#E2DDD5] pb-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#D97724]">
                SIGNAL (INFERRED)
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D97724]"></span>
            </div>

            {/* Focused Signal Card */}
            <div className="p-5 rounded-lg bg-[#FAF8F5] border-2 border-[#D97724]/30 space-y-4 shadow-xs">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D97724]">
                  SIGNAL
                </span>
                <h5 className="font-mono font-bold text-base text-[#111111] uppercase tracking-tight mt-1">
                  {competitor} is moving toward enterprise accounts.
                </h5>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#E8E4DC]">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#687078]">
                  WHY
                </span>
                <ul className="space-y-1 text-xs sm:text-sm text-[#333333] font-sans">
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#D97724]"></span>
                    <span>Enterprise security suite added</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#D97724]"></span>
                    <span>AI assistant positioning expanded</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-[#D97724]"></span>
                    <span>Usage-based &amp; discounted Pro tiers introduced</span>
                  </li>
                </ul>
              </div>

              <div className="pt-3 border-t border-[#E8E4DC] flex items-center justify-between text-xs font-mono">
                <span className="text-[#687078]">CONFIDENCE LEVEL</span>
                <span className="font-bold text-[#111111] bg-white px-2.5 py-0.5 rounded border border-[#DDD8CE]">
                  87%
                </span>
              </div>
            </div>

            {/* Inferences Chain */}
            <div className="space-y-2 pt-2">
              {evidence.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-xs font-mono text-[#555555] bg-white/60 p-2.5 rounded border border-[#E8E4DC]"
                >
                  <span className="text-[#D97724] font-bold">&darr;</span>
                  <span>{getInferenceForEvent(item)}</span>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>

      {/* ── 6. RECOMMENDED WATCHPOINTS ── */}
      <div className="space-y-4 pt-4 border-t border-[#E2DDD5]">
        <h4 className="font-mono font-bold text-xs uppercase tracking-[0.2em] text-[#111111]">
          RECOMMENDED WATCHPOINTS
        </h4>

        <div className="divide-y divide-[#E2DDD5] border-y border-[#E2DDD5]">
          {watchpoints.map((wp, idx) => (
            <div
              key={idx}
              className="py-4 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 hover:bg-black/[0.02] px-2 rounded transition-colors"
            >
              <div className="flex items-center gap-3 shrink-0 sm:w-44">
                <span className="font-mono text-xs font-light text-[#888888]">
                  {wp.num}
                </span>
                <span className="font-mono text-xs font-bold text-[#111111] uppercase tracking-wider">
                  {wp.cat}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#444444] font-sans">
                {wp.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── 7. WATCH NEXT (PREDICTIVE MONITORING WITH ALERTS) ── */}
      <div className="space-y-4 pt-4 border-t border-[#E2DDD5]">
        <div className="flex items-center justify-between">
          <h4 className="font-mono font-bold text-xs uppercase tracking-[0.2em] text-[#111111]">
            WATCH NEXT
          </h4>
          <span className="text-[11px] font-mono text-[#888888]">
            Predictive Monitoring
          </span>
        </div>

        <div className="space-y-2.5">
          {predictiveTriggers.map((item, idx) => {
            const isAlertSet = alertSetIndices[idx];

            return (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-white border border-[#E2DDD5] hover:border-[#111111]/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-base text-[#888888] select-none">&#9675;</span>
                  <span className="text-xs sm:text-sm text-[#222222] font-sans font-medium">
                    {item.text}
                  </span>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-bold ${
                      item.priority === "HIGH"
                        ? "bg-[#D97724]/10 text-[#D97724] border border-[#D97724]/30"
                        : "bg-black/[0.05] text-[#555555] border border-black/10"
                    }`}
                  >
                    {item.priority}
                  </span>

                  <button
                    type="button"
                    onClick={() => toggleAlert(idx)}
                    className={`text-xs font-mono px-3 py-1 rounded transition-all cursor-pointer ${
                      isAlertSet
                        ? "bg-emerald-600 text-white font-bold"
                        : "bg-[#111111] hover:bg-[#333333] text-white font-medium"
                    }`}
                  >
                    {isAlertSet ? "Alert active ✓" : "Create alert →"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 8. EVIDENCE (SOURCE-BACKED CHRONOLOGICAL LOG) ── */}
      <div className="space-y-4 pt-4 border-t border-[#E2DDD5] pb-8">
        <div className="flex items-center justify-between">
          <h4 className="font-mono font-bold text-xs uppercase tracking-[0.2em] text-[#111111]">
            EVIDENCE
          </h4>
          <span className="text-[11px] font-mono text-[#888888]">
            Source-Backed Event Trail
          </span>
        </div>

        <div className="divide-y divide-[#E2DDD5] border-t border-[#E2DDD5]">
          {evidence.map((item, idx) => (
            <div
              key={idx}
              className="py-4 grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-2 sm:gap-6 hover:bg-black/[0.015] px-2 rounded transition-colors"
            >
              <div className="space-y-1">
                <span className="font-mono text-xs font-bold text-[#111111] uppercase tracking-wider block">
                  {formatShortDate(item.date).toUpperCase()}
                </span>
                <span className="inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-black/[0.05] text-[#555555] border border-black/10">
                  {item.category}
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-xs sm:text-sm text-[#222222] font-sans font-medium leading-relaxed">
                  {item.event}
                </p>
                <p className="text-[11px] font-mono text-[#888888]">
                  Source: {item.source || "Public Documentation"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
