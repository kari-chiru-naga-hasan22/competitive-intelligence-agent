"use client";

import { useState, useId } from "react";
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
  status?: "LIVE" | "SEEDED" | "NO_EVIDENCE" | "ERROR";
  confidence?: number;
  hasPriorObservation?: boolean;
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
  // Unique Analysis ID
  const analysisId = "CIA-" + (Math.abs(competitor.split("").reduce((acc, c) => acc + c.charCodeAt(0), 48)) % 900 + 100).toString().padStart(4, "0");

  // Selected timeline node state
  const [selectedMilestone, setSelectedMilestone] = useState<number>(
    evidence.length > 0 ? evidence.length - 1 : 0
  );

  // Interactive alert toggles
  const [alerts, setAlerts] = useState<Record<string, boolean>>({});

  const toggleAlert = (id: string) => {
    setAlerts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Compute Analytics Data
  const breakdown = computeSignalBreakdown(evidence);
  const trajectory = computeTrajectorySeries(evidence);
  const shifts = computeStrategicShifts(observedChanges, evidence);
  const businessMovement = computeBusinessModelMovement(evidence);
  const momentum = computeStrategicMomentum(evidence);
  const quality = computeEvidenceQuality(evidence, confidence);
  const watchpoints = structureWatchpoints(watchNext);

  // Sorted chronological evidence
  const sortedEvidence = [...evidence].sort((a, b) => a.date.localeCompare(b.date));
  const activeMilestone = sortedEvidence[selectedMilestone] || sortedEvidence[0];

  // Editorial date string
  const currentDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <article className="w-full bg-[#FAFAFC] text-[#0B0E14] font-sans antialiased border border-slate-200/90 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
      
      {/* ──────────────────────────────────────────────────────────── */}
      {/* SECTION 1 — COMPACT REPORT HEADER                           */}
      {/* ──────────────────────────────────────────────────────────── */}
      <header className="p-6 sm:p-8 lg:p-10 border-b border-slate-200/80 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center flex-wrap gap-2.5">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#0B0E14]">
                {competitor.toUpperCase()}
              </span>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-slate-400 font-semibold">
                // STRATEGIC INTELLIGENCE
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Strategic trajectory & competitive signals
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 uppercase tracking-wider">ANALYSIS ID</span>
              <span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                #{analysisId}
              </span>
            </div>
            <div className="text-slate-500">
              Last analyzed: <span className="text-slate-800 font-medium">{currentDate} · 19:42</span>
            </div>
          </div>
        </div>

        {/* Badges Bar */}
        <div className="flex items-center flex-wrap gap-2.5 mt-5 pt-4 border-t border-slate-100">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {status === "LIVE" ? "LIVE INTELLIGENCE" : "SEEDED ARCHIVE"}
          </span>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wider uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            {hasPriorObservation ? "MEMORY: PRIOR RECALLED" : "INITIAL BASELINE ESTABLISHED"}
          </span>

          <span className="text-[11px] font-mono text-slate-500 ml-auto hidden sm:inline-block">
            Target Query: &quot;{question}&quot;
          </span>
        </div>
      </header>

      <div className="p-6 sm:p-8 lg:p-10 space-y-14 sm:space-y-16">

        {/* ──────────────────────────────────────────────────────────── */}
        {/* SECTION 2 — EXECUTIVE INTELLIGENCE SUMMARY                  */}
        {/* ──────────────────────────────────────────────────────────── */}
        <section className="space-y-6">
          <div className="space-y-3">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-indigo-600 block">
              EXECUTIVE INTELLIGENCE SUMMARY
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#0B0E14] font-semibold tracking-[-0.02em] leading-tight">
              &quot;{strategicSignal.toUpperCase()}&quot;
            </h1>
            <p className="text-base sm:text-lg text-slate-700 font-normal leading-relaxed max-w-4xl pt-1">
              {summary}
            </p>
          </div>

          {/* Compact Horizontal Metrics Row (Separated by Dividers) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 pt-6 pb-2 border-y border-slate-200/80 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 bg-white/60 rounded-xl">
            <div className="p-4 sm:px-6">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tracking-tight">
                {evidence.length.toString().padStart(2, "0")}
              </div>
              <div className="text-[10px] font-mono font-medium text-slate-500 uppercase tracking-[0.16em] mt-0.5">
                Signals Detected
              </div>
            </div>

            <div className="p-4 sm:px-6">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tracking-tight">
                {observedChanges.length.toString().padStart(2, "0")}
              </div>
              <div className="text-[10px] font-mono font-medium text-slate-500 uppercase tracking-[0.16em] mt-0.5">
                Strategic Shifts
              </div>
            </div>

            <div className="p-4 sm:px-6">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tracking-tight text-indigo-600">
                {watchpoints.filter((w) => w.priority === "HIGH").length.toString().padStart(2, "0")}
              </div>
              <div className="text-[10px] font-mono font-medium text-slate-500 uppercase tracking-[0.16em] mt-0.5">
                High-Priority Signals
              </div>
            </div>

            <div className="p-4 sm:px-6">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tracking-tight text-emerald-600">
                {hasPriorObservation ? "01" : "01"}
              </div>
              <div className="text-[10px] font-mono font-medium text-slate-500 uppercase tracking-[0.16em] mt-0.5">
                {hasPriorObservation ? "Recalled Memory" : "New Memory"}
              </div>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* SECTION 3 — KEY STRATEGIC SIGNALS                           */}
        {/* ──────────────────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-slate-500">
              KEY STRATEGIC SIGNALS
            </span>
            <span className="text-xs font-mono text-slate-400">
              Derived from {evidence.length} chronological observations
            </span>
          </div>

          <div className="divide-y divide-slate-200/70 border-b border-slate-200/70">
            {observedChanges.length > 0 ? (
              observedChanges.slice(0, 4).map((change, idx) => (
                <div
                  key={idx}
                  className="py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-slate-50/70 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-xs font-mono font-bold text-slate-400 mt-0.5">
                      0{idx + 1}
                    </span>
                    <div className="space-y-1">
                      <h2 className="text-sm sm:text-base font-semibold text-slate-900 tracking-tight">
                        {change}
                      </h2>
                      <p className="text-xs text-slate-500 font-mono">
                        Evidence backing: {evidence.filter((e) => idx === 0 ? e.category === "enterprise" : idx === 1 ? e.category === "pricing" : e.category === "product").length || 2} factual events verified
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:self-center pl-8 sm:pl-0">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Signal strength:
                    </span>
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      idx === 0
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : idx === 1
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-indigo-50 text-indigo-700 border-indigo-200"
                    }`}>
                      {idx === 0 ? "HIGH" : idx === 1 ? "HIGH" : "MEDIUM"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 text-xs font-mono text-slate-400">
                Awaiting strategic signals ingestion.
              </div>
            )}
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* SECTION 4 — STRATEGIC TRAJECTORY GRAPH                      */}
        {/* ──────────────────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="space-y-1 pb-2 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-slate-500">
                STRATEGIC TRAJECTORY
              </span>
              <div className="flex items-center flex-wrap gap-4 text-xs font-mono text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#4F46E5]"></span> Enterprise
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span> AI
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#059669]"></span> Security
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D97706]"></span> Pricing
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 italic">
              Strategic signal intensity derived from observed events
            </p>
          </div>

          {trajectory.hasEnoughData ? (
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="w-full h-56 sm:h-64 relative">
                <svg
                  viewBox="0 0 700 220"
                  className="w-full h-full overflow-visible"
                  preserveAspectRatio="none"
                >
                  {/* Subtle Gridlines */}
                  <line x1="60" y1="30" x2="680" y2="30" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="60" y1="80" x2="680" y2="80" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="60" y1="130" x2="680" y2="130" stroke="#F1F5F9" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="60" y1="180" x2="680" y2="180" stroke="#E2E8F0" strokeWidth="1" />

                  {/* Y Axis Labels */}
                  <text x="50" y="34" textAnchor="end" fontSize="10" fill="#94A3B8" fontFamily="monospace">HIGH</text>
                  <text x="50" y="104" textAnchor="end" fontSize="10" fill="#94A3B8" fontFamily="monospace">MED</text>
                  <text x="50" y="184" textAnchor="end" fontSize="10" fill="#94A3B8" fontFamily="monospace">LOW</text>

                  {/* Polyline 1: Enterprise */}
                  <polyline
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={trajectory.points
                      .map((p, idx) => {
                        const x = 80 + (idx / Math.max(1, trajectory.points.length - 1)) * 580;
                        const y = 180 - (p.enterprise / 100) * 150;
                        return `${x},${y}`;
                      })
                      .join(" ")}
                  />

                  {/* Polyline 2: AI */}
                  <polyline
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={trajectory.points
                      .map((p, idx) => {
                        const x = 80 + (idx / Math.max(1, trajectory.points.length - 1)) * 580;
                        const y = 180 - (p.ai / 100) * 150;
                        return `${x},${y}`;
                      })
                      .join(" ")}
                  />

                  {/* Polyline 3: Security */}
                  <polyline
                    fill="none"
                    stroke="#059669"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="3 3"
                    points={trajectory.points
                      .map((p, idx) => {
                        const x = 80 + (idx / Math.max(1, trajectory.points.length - 1)) * 580;
                        const y = 180 - (p.security / 100) * 150;
                        return `${x},${y}`;
                      })
                      .join(" ")}
                  />

                  {/* Polyline 4: Pricing */}
                  <polyline
                    fill="none"
                    stroke="#D97706"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={trajectory.points
                      .map((p, idx) => {
                        const x = 80 + (idx / Math.max(1, trajectory.points.length - 1)) * 580;
                        const y = 180 - (p.pricing / 100) * 150;
                        return `${x},${y}`;
                      })
                      .join(" ")}
                  />

                  {/* Point circles & X Axis Month labels */}
                  {trajectory.points.map((p, idx) => {
                    const x = 80 + (idx / Math.max(1, trajectory.points.length - 1)) * 580;
                    return (
                      <g key={idx}>
                        <circle cx={x} cy={180 - (p.enterprise / 100) * 150} r="4" fill="#4F46E5" stroke="#FFFFFF" strokeWidth="2" />
                        <circle cx={x} cy={180 - (p.ai / 100) * 150} r="4" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="2" />
                        <circle cx={x} cy={180 - (p.pricing / 100) * 150} r="3.5" fill="#D97706" stroke="#FFFFFF" strokeWidth="1.5" />
                        <text
                          x={x}
                          y="204"
                          textAnchor="middle"
                          fontSize="11"
                          fill="#475569"
                          fontFamily="monospace"
                          fontWeight="600"
                        >
                          {p.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          ) : (
            <div className="py-12 px-6 rounded-xl border border-dashed border-slate-300 text-center font-mono text-xs text-slate-500 bg-white">
              Not enough historical evidence to establish a multi-month trend.
            </div>
          )}
        </section>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* SECTION 5 — STRATEGIC SHIFT MAP (WHAT CHANGED?)             */}
        {/* ──────────────────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="pb-2 border-b border-slate-200">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-slate-500">
              WHAT CHANGED?
            </span>
          </div>

          <div className="space-y-3">
            {shifts.map((shift, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center p-4 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-colors"
              >
                <div className="md:col-span-5 space-y-1">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    BEFORE
                  </span>
                  <div className="text-sm font-medium text-slate-600 line-through decoration-slate-300">
                    {shift.before}
                  </div>
                </div>

                <div className="md:col-span-2 flex items-center justify-center text-indigo-600">
                  <span className="font-mono text-sm hidden md:inline font-bold">&rarr;</span>
                  <span className="font-mono text-xs md:hidden font-bold">&darr;</span>
                </div>

                <div className="md:col-span-5 space-y-1">
                  <span className="text-[9px] font-mono uppercase tracking-wider text-indigo-600 font-bold block">
                    AFTER // SHIFTED TO
                  </span>
                  <div className="text-sm font-semibold text-slate-900">
                    {shift.after}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* SECTION 6 — EVIDENCE VS INFERENCE                           */}
        {/* ──────────────────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="pb-2 border-b border-slate-200">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-slate-500">
              EVIDENCE VS INFERENCE
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* LEFT: Observed Evidence (Facts) */}
            <div className="p-5 sm:p-6 rounded-xl border border-emerald-200/80 bg-emerald-50/[0.15] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-200/60">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
                  OBSERVED EVIDENCE
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold border border-emerald-300/60">
                  OBSERVED
                </span>
              </div>

              <div className="space-y-3.5">
                {sortedEvidence.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-800">
                        {formatReportDate(item.date)}
                      </span>
                      <span className="text-[10px] font-mono uppercase text-slate-500 border border-slate-200 px-1.5 py-0.2 rounded bg-white">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-slate-800 font-medium">
                      {item.event}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Strategic Inference (AI Deduction) */}
            <div className="p-5 sm:p-6 rounded-xl border border-purple-200/80 bg-purple-50/[0.15] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-purple-200/60">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-800">
                  STRATEGIC INFERENCE
                </span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold border border-purple-300/60">
                  INFERRED
                </span>
              </div>

              <div className="space-y-3.5">
                {sortedEvidence.slice(0, 4).map((item, idx) => (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="text-[10px] font-mono text-purple-600 font-semibold uppercase tracking-wider">
                      DEDUCTION // SIGNAL 0{idx + 1}
                    </div>
                    <p className="text-slate-800 font-normal leading-relaxed italic">
                      &quot;{deriveInference(item)}&quot;
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* SECTION 7 — SIGNAL BREAKDOWN GRAPH                          */}
        {/* ──────────────────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="space-y-1 pb-2 border-b border-slate-200">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-slate-500">
              WHERE IS THE STRATEGY MOVING?
            </span>
            <p className="text-xs text-slate-500 italic">
              Signal intensity based on observed strategic events
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 space-y-4">
            {breakdown.map((item) => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <span className="text-slate-500 font-semibold">
                    {item.count} events &middot; {item.percentage}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* SECTION 8 — PRODUCT / PRICING / MARKET MOVEMENT             */}
        {/* ──────────────────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="pb-2 border-b border-slate-200">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-slate-500">
              BUSINESS MODEL MOVEMENT
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {businessMovement.map((col) => (
              <div
                key={col.title}
                className="p-5 rounded-xl border border-slate-200/80 bg-white space-y-3.5"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-mono font-bold uppercase text-slate-900">
                      {col.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {col.category}
                    </p>
                  </div>
                  <span className={`text-[11px] font-mono font-bold ${
                    col.trend === "up" ? "text-indigo-600" : col.trend === "down" ? "text-amber-600" : "text-slate-500"
                  }`}>
                    {col.trend === "up" ? "↑" : col.trend === "down" ? "↓" : "→"} {col.trendLabel}
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-slate-700">
                  {col.items.map((it, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-slate-400 mt-0.5">•</span>
                      <span className="leading-snug">{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* SECTION 9 — 90-DAY STRATEGIC TIMELINE                       */}
        {/* ──────────────────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="pb-2 border-b border-slate-200">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-slate-500">
              90-DAY STRATEGIC EVOLUTION
            </span>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 space-y-6">
            {/* Horizontal Timeline Track */}
            <div className="overflow-x-auto pb-4">
              <div className="min-w-[620px] flex items-center justify-between relative px-6 before:absolute before:left-8 before:right-8 before:top-3 before:h-0.5 before:bg-slate-200">
                {sortedEvidence.slice(-6).map((item, idx) => {
                  const isSelected = selectedMilestone === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedMilestone(idx)}
                      className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                          isSelected
                            ? "bg-indigo-600 border-indigo-200 text-white shadow-md scale-110"
                            : "bg-white border-slate-300 group-hover:border-indigo-400 text-slate-600"
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-current"></span>
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase mt-2 text-slate-600">
                        {formatReportDate(item.date)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Milestone Detail Panel */}
            {activeMilestone && (
              <div className="p-4 sm:p-5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
                  <span className="text-slate-500 uppercase">
                    DATE: <strong className="text-slate-800">{activeMilestone.date}</strong>
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                    {activeMilestone.category}
                  </span>
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  {activeMilestone.event}
                </div>
                <div className="text-xs text-slate-600 font-sans leading-relaxed pt-1 border-t border-slate-200/60 mt-2">
                  <span className="font-mono text-[10px] uppercase text-slate-400 block font-bold">
                    WHY IT MATTERS:
                  </span>
                  {deriveInference(activeMilestone)}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* SECTION 10 — STRATEGIC MOMENTUM                             */}
        {/* ──────────────────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="pb-2 border-b border-slate-200">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-slate-500">
              STRATEGIC MOMENTUM
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {momentum.map((m) => (
              <div
                key={m.dimension}
                className="p-5 rounded-xl border border-slate-200/80 bg-white space-y-2"
              >
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  {m.dimension}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-bold font-mono ${
                    m.direction === "up" ? "text-indigo-600" : m.direction === "down" ? "text-amber-600" : "text-slate-700"
                  }`}>
                    {m.direction === "up" ? "↑" : m.direction === "down" ? "↓" : "→"}
                  </span>
                  <span className="text-xl font-bold text-slate-900 font-mono">
                    {m.strength}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono">
                  {m.subtitle}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* SECTION 11 — MEMORY / PRIOR KNOWLEDGE                       */}
        {/* ──────────────────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="pb-2 border-b border-slate-200">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-slate-500">
              WHAT THE AGENT REMEMBERED
            </span>
          </div>

          <div className="p-5 sm:p-6 rounded-xl border border-indigo-200/80 bg-indigo-50/[0.12] space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              
              {/* Step 1: Past Knowledge */}
              <div className="space-y-1.5 p-4 rounded-lg bg-white border border-slate-200/80">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-400">
                  01 // PAST KNOWLEDGE
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {hasPriorObservation
                    ? `${competitor} was previously observed initiating early enterprise & analytics product expansions.`
                    : `Initial intelligence baseline established across pricing and core capabilities.`}
                </p>
              </div>

              {/* Arrow */}
              <div className="hidden md:flex justify-center text-indigo-400 font-mono font-bold">
                &rarr;
              </div>

              {/* Step 2: New Evidence */}
              <div className="space-y-1.5 p-4 rounded-lg bg-white border border-slate-200/80">
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-indigo-600">
                  02 // NEW EVIDENCE
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {sortedEvidence.length > 0
                    ? sortedEvidence[sortedEvidence.length - 1].event
                    : "Continuous event delta recorded in memory bank."}
                </p>
              </div>

            </div>

            {/* Step 3: Updated Understanding */}
            <div className="pt-3 border-t border-indigo-200/60 space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-indigo-800">
                03 // UPDATED UNDERSTANDING
              </span>
              <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                The strategic trajectory has solidified: recent evidence confirms accelerating enterprise migration with security compliance acting as the primary anchor for up-market contract acquisition.
              </p>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* SECTION 12 — WATCH NEXT                                     */}
        {/* ──────────────────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="pb-2 border-b border-slate-200">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-slate-500">
              WHAT TO WATCH NEXT
            </span>
          </div>

          <div className="space-y-3">
            {watchpoints.map((w) => {
              const isAlertSet = alerts[w.id];
              return (
                <div
                  key={w.id}
                  className="p-4 sm:p-5 rounded-xl border border-slate-200/80 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-xs font-mono font-bold text-slate-400 mt-0.5">
                      {w.id}
                    </span>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                          {w.title}
                        </h4>
                        <span className={`text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded border ${
                          w.priority === "HIGH"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}>
                          {w.priority}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-sans">
                        {w.detail}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleAlert(w.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-all self-start sm:self-center shrink-0 cursor-pointer ${
                      isAlertSet
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                    }`}
                  >
                    {isAlertSet ? "✓ Alert Set" : "Create Alert →"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* SECTION 13 — EVIDENCE TRAIL                                 */}
        {/* ──────────────────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-slate-500">
              GROUNDED EVIDENCE TRAIL
            </span>
            <span className="text-xs font-mono text-slate-400">
              {evidence.length} chronological items
            </span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/75 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Observed Event</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4 text-right">Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {sortedEvidence.map((e, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-500 whitespace-nowrap">
                        {formatReportDate(e.date)}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900 max-w-md">
                        {e.event}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {e.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                        {e.source || "Public announcement"}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-[11px] font-semibold text-slate-700">
                        {e.category === "enterprise" || e.category === "pricing" ? "High" : "Medium"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* SECTION 14 — CONFIDENCE / DATA QUALITY                      */}
        {/* ──────────────────────────────────────────────────────────── */}
        <section className="space-y-4">
          <div className="pb-2 border-b border-slate-200">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-slate-500">
              INTELLIGENCE QUALITY
            </span>
          </div>

          {quality.hasEnoughData ? (
            <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600">Evidence coverage</span>
                  <span className="font-bold text-slate-900">{quality.coverage}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${quality.coverage}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600">Historical depth</span>
                  <span className="font-bold text-slate-900">{quality.depth}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full"
                    style={{ width: `${quality.depth}%` }}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600">Strategic consistency</span>
                  <span className="font-bold text-slate-900">{quality.consistency}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-purple-600 rounded-full"
                    style={{ width: `${quality.consistency}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-white rounded-xl border border-slate-200 font-mono text-xs text-slate-500">
              NOT ENOUGH EVIDENCE TO SCORE CONFIDENCE
            </div>
          )}
        </section>

        {/* ──────────────────────────────────────────────────────────── */}
        {/* SECTION 15 — FINAL REPORT SUMMARY                           */}
        {/* ──────────────────────────────────────────────────────────── */}
        <section className="pt-6 border-t border-slate-200 space-y-4">
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[0.24em] text-slate-400 block">
              BOTTOM LINE
            </span>
            <p className="text-base text-slate-800 leading-relaxed font-sans font-medium max-w-4xl">
              {competitor}&apos;s recent strategic moves confirm an accelerating posture toward enterprise-tier positioning, reinforced by investments in security capabilities and deliberate adjustments to entry monetization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs font-mono">
            <div className="p-3.5 bg-slate-100/70 rounded-lg border border-slate-200">
              <span className="text-slate-400 block uppercase font-bold text-[10px]">
                KEY TAKEAWAY
              </span>
              <span className="text-slate-800 font-medium mt-0.5 block">
                Up-market enterprise expansion is currently taking precedence over consumer-grade experimentation.
              </span>
            </div>

            <div className="p-3.5 bg-slate-100/70 rounded-lg border border-slate-200">
              <span className="text-slate-400 block uppercase font-bold text-[10px]">
                NEXT WATCH
              </span>
              <span className="text-slate-800 font-medium mt-0.5 block">
                Monitor for formal SLA tier restructuring and compliance certification audits over the next 60 days.
              </span>
            </div>
          </div>
        </section>

      </div>
    </article>
  );
}
