"use client";

import { useEffect, useState } from "react";
import { ThinkingOrb, OrbState } from "thinking-orbs";

interface LoadingStateProps {
  competitor: string;
}

interface StageInfo {
  state: OrbState;
  stepNumber: string;
  badge: string;
  headline: string;
  desc: string;
  sourceText: string;
}

const STAGES: StageInfo[] = [
  {
    state: "searching",
    stepNumber: "01",
    badge: "RESEARCHING",
    headline: "Researching competitor history",
    desc: "Scanning competitor archives and dated milestones across the landscape.",
    sourceText: "Competitor History Scan",
  },
  {
    state: "connecting",
    stepNumber: "02",
    badge: "RECALLING",
    headline: "Recalling relevant observations from memory",
    desc: "Retrieving longitudinal observations and dated records from Hindsight memory.",
    sourceText: "Hindsight Memory Recall",
  },
  {
    state: "working",
    stepNumber: "03",
    badge: "CONNECTING",
    headline: "Connecting historical signals",
    desc: "Detecting multi-period shifts across pricing, product releases, and market moves.",
    sourceText: "Temporal Signal Filtering",
  },
  {
    state: "solving",
    stepNumber: "04",
    badge: "SYNTHESIZING",
    headline: "Synthesizing strategic intelligence",
    desc: "Synthesizing executive summary, key signals, and trajectory observations with Gemini.",
    sourceText: "Gemini Strategic Reasoning",
  },
];

export function LoadingState({ competitor }: LoadingStateProps) {
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

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

  // Semantic stage progression: researching (0-1.8s) -> recalling (1.8-3.6s) -> connecting (3.6-5.5s) -> synthesizing (5.5s+)
  useEffect(() => {
    setStageIndex(0);

    const timer1 = setTimeout(() => {
      setStageIndex(1); // recalling
    }, 1800);

    const timer2 = setTimeout(() => {
      setStageIndex(2); // connecting
    }, 3600);

    const timer3 = setTimeout(() => {
      setStageIndex(3); // synthesizing
    }, 5500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [competitor]);

  const currentStage = STAGES[stageIndex];
  const targetName = (competitor || "Competitor").toUpperCase();

  return (
    <div className="gl max-w-xl mx-auto p-6 sm:p-7 relative overflow-hidden text-center shadow-[0_24px_50px_rgba(80,90,220,0.12)] border border-[#DDE3F5] transition-all">
      {/* Background ambient lighting from index1.html */}
      <div className="absolute -top-20 -right-20 w-52 h-52 rounded-full bg-[rgba(196,186,255,0.35)] blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-52 h-52 rounded-full bg-[rgba(206,216,255,0.4)] blur-3xl pointer-events-none" />

      <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4 relative z-10">
        
        {/* Libraries.dev ThinkingOrb Component (64px, Light Theme, Semantic State) */}
        <div className="relative flex items-center justify-center p-3 rounded-full bg-white/85 border border-[#DDE3F5] shadow-xs">
          <ThinkingOrb
            state={currentStage.state}
            size={64}
            speed={1}
            theme="light"
            paused={prefersReducedMotion}
            aria-label={`AI analysis status: ${currentStage.badge}`}
          />
        </div>

        {/* Dynamic Title & Stage Badge */}
        <div className="space-y-1.5 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#EEF1FB] border border-[#DDE3F5] text-[11px] font-bold text-[#4338F0] uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4338F0] animate-pulse"></span>
            <span>{currentStage.badge}</span>
          </div>

          <h3 className="font-extrabold text-xl sm:text-2xl text-[#0B0D24] tracking-tight font-sans">
            ANALYZING {targetName}...
          </h3>

          <p className="text-sm sm:text-base font-bold text-[#4338F0] tracking-tight">
            &ldquo;{currentStage.headline}&rdquo;
          </p>

          <p className="text-xs sm:text-sm text-[#3F4463] font-normal leading-relaxed min-h-[38px] flex items-center justify-center px-2">
            {currentStage.desc}
          </p>
        </div>

        {/* Pipeline Progression Breadcrumb: SEARCHING → WORKING → SOLVING */}
        <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
          {STAGES.map((stg, idx) => {
            const isCurrent = stageIndex === idx;
            const isDone = stageIndex > idx;

            return (
              <div key={stg.state} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                    isCurrent
                      ? "bg-[#4338F0] text-white border-[#4338F0] shadow-[0_4px_12px_rgba(67,56,240,0.25)] scale-105"
                      : isDone
                      ? "bg-[#DDF8EE] text-[#0d8f66] border-[#19C08B]/40"
                      : "bg-white/70 text-[#7A7F99] border-[#DDE3F5]"
                  }`}
                >
                  <span className="font-mono text-[10px]">
                    {isDone ? "✓" : stg.stepNumber}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider">
                    {stg.badge}
                  </span>
                </div>

                {idx < STAGES.length - 1 && (
                  <span className="text-xs text-[#C4CEF2] font-bold">
                    &rarr;
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* System Source Footnote */}
        <div className="flex items-center gap-4 text-xs text-[#7A7F99] pt-3 border-t border-[#EEF1FB] w-full justify-center">
          <span className="flex items-center gap-1.5 text-[#3F4463] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#19C08B]"></span>
            Hindsight Recall (Vectorize)
          </span>
          <span className="text-[#DDE3F5]">&bull;</span>
          <span className="flex items-center gap-1.5 text-[#3F4463] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#4338F0]"></span>
            Gemini Reasoning
          </span>
        </div>
      </div>
    </div>
  );
}
