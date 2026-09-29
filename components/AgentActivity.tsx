"use client";

import { useState, useEffect } from "react";

export interface AgentActivityProps {
  competitor: string;
  files?: Array<{ name: string; size?: number }>;
  isComplete?: boolean;
  durationMs?: number;
  steps?: string[];
  enableWebSearch?: boolean;
}

export function AgentActivity({
  competitor,
  files = [],
  isComplete = false,
  durationMs = 0,
  steps = [],
  enableWebSearch = false,
}: AgentActivityProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [isExpanded, setIsExpanded] = useState(true);

  // Dynamic default steps if not explicitly provided
  const dynamicSteps = steps.length > 0 ? steps : [
    `Identified competitor: ${competitor}`,
    ...(files.length > 0
      ? [`Extracted textual context from ${files.length} attached document(s): ${files.map(f => f.name).join(", ")}`]
      : []),
    ...(enableWebSearch
      ? [`Conducting live web reconnaissance across public domain & news archives`, `Ingesting real-world events into persistent Hindsight memory`]
      : [`Recalling chronological event stream from Vectorize Hindsight memory`]),
    `Cross-referencing category vectors (Product, Pricing, Enterprise, Messaging)`,
    `Tracing 90-day trajectory and identifying inflection points`,
    `Synthesizing strategic inference & forward watchpoints with Gemini`,
    `Preparing interactive visualizations and grounded intelligence dossier`,
  ];

  // Simulated live step progression during active synthesis
  useEffect(() => {
    if (isComplete) {
      setCurrentStepIndex(dynamicSteps.length);
      return;
    }

    const interval = setInterval(() => {
      setElapsed((prev) => prev + 100);
      setCurrentStepIndex((prev) => {
        if (prev < dynamicSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 600);

    return () => clearInterval(interval);
  }, [isComplete, dynamicSteps.length]);

  const displayTime = isComplete && durationMs > 0
    ? (durationMs / 1000).toFixed(1)
    : (elapsed / 1000).toFixed(1);

  return (
    <div className="w-full rounded-xl bg-[#090D16] border border-slate-700/60 shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden font-mono text-xs">
      {/* Activity Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between px-4 py-3 bg-[#0E1524] border-b border-slate-800/80 cursor-pointer select-none hover:bg-[#121B2D] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-2 h-2 rounded-full ${
                isComplete
                  ? "bg-emerald-400 shadow-[0_0_8px_#34D399]"
                  : "bg-[#C6A15B] animate-pulse shadow-[0_0_8px_#C6A15B]"
              }`}
            />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-200">
              COMPETE INTEL AGENT
            </span>
          </div>

          <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
            {isComplete ? "SYNTHESIS COMPLETE" : "EXECUTION IN PROGRESS"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-400">
            {isComplete ? `Completed in ${displayTime}s` : `${displayTime}s elapsed`}
          </span>
          <span className="text-slate-500 hover:text-slate-300">
            {isExpanded ? "▲" : "▼"}
          </span>
        </div>
      </div>

      {/* Activity Step Stream */}
      {isExpanded && (
        <div className="p-4 space-y-2 bg-[#080C14]/90 backdrop-blur-md">
          {dynamicSteps.map((stepText, idx) => {
            const isFinished = isComplete || idx < currentStepIndex;
            const isCurrent = !isComplete && idx === currentStepIndex;
            const isPending = !isComplete && idx > currentStepIndex;

            return (
              <div
                key={idx}
                className={`flex items-start gap-3 transition-opacity duration-300 ${
                  isPending ? "opacity-35" : "opacity-100"
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isFinished ? (
                    <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px]">
                      ✓
                    </span>
                  ) : isCurrent ? (
                    <span className="flex items-center justify-center w-4 h-4 rounded-full bg-amber-500/15 text-[#C6A15B] border border-[#C6A15B]/40 text-[10px] animate-spin">
                      ●
                    </span>
                  ) : (
                    <span className="flex items-center justify-center w-4 h-4 rounded-full bg-slate-800 text-slate-600 text-[10px]">
                      ○
                    </span>
                  )}
                </div>

                <div className="flex-1 leading-relaxed">
                  <span
                    className={`${
                      isFinished
                        ? "text-slate-300"
                        : isCurrent
                        ? "text-white font-semibold"
                        : "text-slate-500"
                    }`}
                  >
                    {stepText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
