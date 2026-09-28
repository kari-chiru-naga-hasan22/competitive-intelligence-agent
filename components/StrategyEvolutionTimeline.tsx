"use client";

import { useState } from "react";
import { IntelligenceEvidence } from "@/lib/api";

interface StrategyEvolutionTimelineProps {
  evidence: IntelligenceEvidence[];
  competitor: string;
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

function getShortTitle(item: IntelligenceEvidence): string {
  const evt = item.event.toLowerCase();
  if (evt.includes("assistant") || evt.includes("ai-powered")) return "AI Assistant Launch";
  if (evt.includes("security") || evt.includes("access controls")) return "Security Package";
  if (evt.includes("ai-first") || evt.includes("messaging")) return "AI-First Messaging";
  if (evt.includes("usage-based")) return "Usage Pricing";
  if (evt.includes("reduced") || evt.includes("$39") || evt.includes("$49")) return "Price ↓ $39";
  if (evt.includes("anomaly")) return "Anomaly Detection";
  if (evt.includes("customer success") || evt.includes("enterprise plan")) return "Enterprise Support";
  if (evt.includes("trusted enterprise ai")) return "Trusted AI Positioning";
  if (evt.includes("executive reports")) return "Executive AI Reports";
  if (evt.includes("partnership")) return "Data Partnership";
  if (evt.includes("self-service") || evt.includes("workspace")) return "Self-Service Launch";
  if (evt.includes("starter package") || evt.includes("lower-cost")) return "Starter Tier Pricing";
  if (evt.includes("ease of deployment") || evt.includes("time to value")) return "Speed Positioning";
  if (evt.includes("dashboards")) return "Vertical Dashboards";
  if (evt.includes("hiring") || evt.includes("sales")) return "Enterprise Hiring";
  return item.category.toUpperCase();
}

export function StrategyEvolutionTimeline({
  evidence,
  competitor,
}: StrategyEvolutionTimelineProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  if (!evidence || evidence.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs relative">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-mono">
            STRATEGY EVOLUTION
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {competitor} · Last 90 Days
          </p>
        </div>

        <span className="text-xs font-mono text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
          {evidence.length} events recorded
        </span>
      </div>

      {/* Month Markers directly above the timeline */}
      <div className="pt-6 pb-2 max-w-[760px] mx-auto hidden md:flex items-center justify-between text-xs font-mono font-bold text-slate-400 px-10">
        <span>JUL</span>
        <span className="translate-x-4">AUG</span>
        <span>SEP</span>
      </div>

      {/* Horizontal Timeline Container */}
      <div className="pt-8 pb-4 overflow-x-auto">
        <div className="min-w-[740px] relative px-8">
          {/* Horizontal Connecting Rail */}
          <div className="absolute top-[14px] left-12 right-12 h-[2px] bg-slate-200 rounded-full -z-0"></div>

          {/* Timeline Nodes */}
          <div className="flex items-start justify-between relative z-10">
            {evidence.map((item, index) => {
              const shortDate = formatShortDate(item.date);
              const title = getShortTitle(item);
              const isActive = activeIdx === index;

              return (
                <div
                  key={index}
                  className="flex flex-col items-center relative group"
                  onMouseEnter={() => setActiveIdx(index)}
                  onMouseLeave={() => setActiveIdx(null)}
                  onClick={() => setActiveIdx(isActive ? null : index)}
                >
                  {/* Floating Popover Tooltip (Above Node) */}
                  <div
                    className={`absolute bottom-full mb-3 w-64 p-3.5 bg-[#0F172A] text-white rounded-xl shadow-xl transition-all duration-200 z-30 pointer-events-none ${
                      isActive
                        ? "opacity-100 transform translate-y-0 scale-100"
                        : "opacity-0 transform translate-y-2 scale-95 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-slate-700/80 pb-2 mb-2">
                      <span className="text-[11px] font-mono font-bold text-slate-300">
                        {item.date}
                      </span>
                      <span className="text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 leading-snug font-sans">
                      {item.event}
                    </p>

                    {item.source && (
                      <p className="text-[10px] text-slate-400 font-mono mt-2 pt-1.5 border-t border-slate-800">
                        Source: {item.source}
                      </p>
                    )}

                    {/* Tooltip downward caret */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#0F172A]"></div>
                  </div>

                  {/* Marker Node Dot */}
                  <button
                    type="button"
                    className={`w-7 h-7 rounded-full border-4 border-white flex items-center justify-center transition-all duration-200 shadow-xs cursor-pointer ${
                      isActive
                        ? "bg-[#0F172A] scale-125 ring-2 ring-slate-900/20"
                        : "bg-[#0F172A] group-hover:scale-110"
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </button>

                  {/* Date Label */}
                  <span className="mt-2.5 text-xs font-bold font-mono text-[#0F172A]">
                    {shortDate}
                  </span>

                  {/* Short Title Label */}
                  <span className="mt-1 text-xs text-slate-500 font-medium text-center max-w-[110px] leading-tight group-hover:text-[#0F172A] transition-colors">
                    {title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
