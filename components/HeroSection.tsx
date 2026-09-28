"use client";

import { useState, useRef, KeyboardEvent } from "react";

export interface HeroSectionProps {
  competitor: string;
  onCompetitorChange: (c: string) => void;
  question: string;
  onQuestionChange: (q: string) => void;
  onAnalyze: () => void;
  loading: boolean;
}

const PRESET_COMPETITORS = [
  { name: "Acme Cloud", defaultQ: "What changed in their strategy?" },
  { name: "Nimbus Analytics", defaultQ: "What is Nimbus Analytics' enterprise and AI strategy?" },
  { name: "Vertex Data", defaultQ: "How has Vertex Data positioned its products and pricing?" },
  { name: "Shopify", defaultQ: "What changed in Shopify's strategy?" },
  { name: "HubSpot", defaultQ: "How has HubSpot's enterprise and pricing strategy evolved?" },
  { name: "Slack", defaultQ: "What products and AI features did Slack prioritize recently?" },
  { name: "Notion", defaultQ: "How has Notion evolved its positioning and AI packaging?" },
];

const SUGGESTIONS = [
  "How is pricing changing?",
  "What products launched recently?",
  "How is their messaging evolving?",
  "What should we watch next?",
];

const MEMORY_PIPELINE = [
  {
    day: "Day 1",
    title: "Initial Research",
    detail: "27 market signals indexed",
    icon: (
      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    day: "Day 2",
    title: "New Updates",
    detail: "3 market shifts detected",
    icon: (
      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    day: "Day 3",
    title: "Strategy Analysis",
    detail: "Competitor intent inferred",
    icon: (
      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    day: "Ongoing",
    title: "Continuous Monitoring",
    detail: "Persistent memory active",
    active: true,
    icon: (
      <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

export function HeroSection({
  competitor,
  onCompetitorChange,
  question,
  onQuestionChange,
  onAnalyze,
  loading,
}: HeroSectionProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSelect = (name: string, defaultQ: string) => {
    onCompetitorChange(name);
    onQuestionChange(defaultQ);
    setDropdownOpen(false);
    setCustomInput("");
  };

  const handleChipClick = (chipText: string) => {
    onQuestionChange(chipText);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading && question.trim()) {
        onAnalyze();
      }
    }
  };

  const handleApplyCustom = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    handleSelect(trimmed, `What changed in ${trimmed}'s strategy?`);
  };

  return (
    <section className="relative min-h-[660px] sm:min-h-[720px] flex items-center justify-center pt-14 pb-16 sm:pt-16 sm:pb-20 overflow-hidden border-b border-[#DDD8CE]">
      {/* 🌌 FULL BACKGROUND: Neural Agent Artistically Aligned on the Right */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden bg-black">
        <img
          src="/hero-agent.png"
          alt="Competitive Intelligence Neural Agent"
          className="w-full h-full object-cover object-[70%_center] sm:object-center sm:translate-x-[260px] md:translate-x-[320px] lg:translate-x-[380px] opacity-40 sm:opacity-95 transition-transform duration-700"
        />

        {/* Directional gradient on left to blend seamlessly with pure black */}
        <div className="absolute inset-y-0 left-0 w-full sm:w-3/5 bg-gradient-to-r from-black via-black/85 to-transparent"></div>
        <div className="absolute inset-0 bg-radial-[at_center] from-black/10 via-black/35 to-transparent"></div>
      </div>

      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── LEFT FLANK: Dynamic Intelligence Telemetry HUD ── */}
        <div className="hidden xl:block absolute left-4 2xl:left-12 top-1/2 -translate-y-1/2 z-20 pointer-events-auto">
          <div className="relative w-[295px] 2xl:w-[320px] rounded-2xl bg-[#080C14]/90 backdrop-blur-2xl border border-white/15 p-5 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_20px_rgba(255,255,255,0.03)] space-y-4">
            
            {/* Top Amber Shimmer Border */}
            <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-[#C6A15B]/70 to-transparent" />

            {/* Corner Crosshair Marks */}
            <span className="absolute top-2 left-2 text-[9px] font-mono text-white/30 select-none">+</span>
            <span className="absolute top-2 right-2 text-[9px] font-mono text-white/30 select-none">+</span>
            <span className="absolute bottom-2 left-2 text-[9px] font-mono text-white/30 select-none">+</span>
            <span className="absolute bottom-2 right-2 text-[9px] font-mono text-white/30 select-none">+</span>

            {/* HUD Header with Target Lock & Live Visualizer */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10 pt-1">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B] shadow-[0_0_6px_#C6A15B] animate-pulse"></span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-[0.22em] text-[#C6A15B]">
                    TARGET LOCK
                  </span>
                </div>
                <div className="text-xs font-semibold text-white tracking-tight truncate max-w-[170px]">
                  {competitor}
                </div>
              </div>

              {/* Animated Signal Equalizer & Live Pill */}
              <div className="flex items-center gap-2">
                <div className="flex items-end gap-[3px] h-3.5 px-1 py-0.5">
                  <span className="w-[3px] bg-[#C6A15B] rounded-xs animate-[pulse_1s_ease-in-out_infinite] h-2"></span>
                  <span className="w-[3px] bg-white/80 rounded-xs animate-[pulse_1.4s_ease-in-out_infinite] h-3.5"></span>
                  <span className="w-[3px] bg-white/50 rounded-xs animate-[pulse_0.8s_ease-in-out_infinite] h-2"></span>
                  <span className="w-[3px] bg-emerald-400 rounded-xs animate-[pulse_1.2s_ease-in-out_infinite] h-3"></span>
                </div>
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                    SYNC
                  </span>
                </div>
              </div>
            </div>

            {/* Vertical Flow Track with Micro-Tags */}
            <div className="relative pl-6 space-y-3 before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gradient-to-b before:from-white/30 before:via-white/20 before:to-emerald-500/50">
              {MEMORY_PIPELINE.map((item) => (
                <div key={item.day} className="relative group cursor-default">
                  <div
                    className={`absolute -left-[19px] top-1.5 w-2.5 h-2.5 rounded-full border-2 transition-all duration-300 ${
                      item.active
                        ? "bg-emerald-500 border-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.9)]"
                        : "bg-[#080C14] border-white/40 group-hover:border-[#C6A15B] group-hover:scale-110"
                    }`}
                  />
                  <div className="flex items-baseline justify-between gap-1.5">
                    <span
                      className={`text-xs font-semibold tracking-tight transition-colors ${
                        item.active ? "text-emerald-300" : "text-white group-hover:text-white"
                      }`}
                    >
                      {item.title}
                    </span>
                    <span
                      className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                        item.active
                          ? "bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30"
                          : "bg-white/[0.05] text-white/50 border border-white/10"
                      }`}
                    >
                      {item.day}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/55 font-mono tracking-wide mt-0.5 leading-relaxed group-hover:text-white/80 transition-colors">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>

            {/* Segmented LED Memory Gauge & Horizon */}
            <div className="pt-3 border-t border-white/10 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
                <span className="uppercase tracking-wider">RETENTION BUFFER</span>
                <span className="text-white/80 font-bold">90 DAYS</span>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5, 6, 7].map((segment) => (
                  <span
                    key={segment}
                    className={`h-1.5 flex-1 rounded-xs transition-all ${
                      segment <= 5
                        ? "bg-[#C6A15B] shadow-[0_0_6px_rgba(198,161,91,0.5)]"
                        : segment === 6
                        ? "bg-white/30"
                        : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── CENTERED HERO HEADER (PRECISE, ICONIC, 100% PURE WHITE) ── */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          {/* Main Headline: UNDERSTAND THE MARKET. */}
          <h1 className="text-2xl sm:text-4xl lg:text-[44px] font-semibold text-white tracking-[-0.025em] leading-tight uppercase drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)] whitespace-normal sm:whitespace-nowrap">
            UNDERSTAND THE MARKET<span className="inline-block w-2.5 h-2.5 rounded-full bg-[#C6A15B] ml-2 align-baseline mb-0.5 sm:mb-1 shadow-[0_0_8px_#C6A15B]"></span>
          </h1>

          {/* Subtitle / Lead: Track competitor moves with persistent memory. */}
          <p className="text-sm sm:text-[15px] text-white/75 font-normal max-w-md mx-auto leading-relaxed tracking-wide drop-shadow-sm">
            Track competitor moves with persistent memory.
          </p>
        </div>

        {/* ── CENTERED AGENT CHATBOX & CONTROLS (PRECISE, 100% AS IT WAS BEFORE) ── */}
        <div className="max-w-lg xl:max-w-xl mx-auto mt-7 space-y-3.5">
          
          {/* 1. Competitor Selection (TARGET) */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <span className="text-[11px] font-mono font-medium uppercase tracking-[0.22em] text-white/70 drop-shadow-sm">
                TARGET
              </span>
            </div>

            <div className="relative">
              <button
                type="button"
                disabled={loading}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between px-5 py-3.5 rounded-xl border border-white/25 bg-black/60 backdrop-blur-xl hover:border-white/50 text-left text-sm font-medium text-white shadow-xl hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center text-white">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.8"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <span className="text-white font-medium text-sm sm:text-base">{competitor}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase text-white/50 border border-white/15 px-2 py-0.5 rounded">
                    Change &darr;
                  </span>
                </div>
              </button>

              {/* Dropdown Options (Preset + Custom Company Support) */}
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 right-0 mt-2 bg-black/95 border border-white/20 rounded-xl shadow-2xl z-40 overflow-hidden divide-y divide-white/10 backdrop-blur-2xl">
                    <div className="max-h-60 overflow-y-auto divide-y divide-white/10">
                      {PRESET_COMPETITORS.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => handleSelect(c.name, c.defaultQ)}
                          className={`w-full text-left px-5 py-3 text-xs font-medium uppercase tracking-wider hover:bg-white/15 transition-colors flex items-center justify-between cursor-pointer ${
                            c.name === competitor
                              ? "bg-white/20 text-white"
                              : "text-white/80"
                          }`}
                        >
                          <span className="text-white">{c.name}</span>
                          {c.name === competitor && (
                            <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_#fff]"></span>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Custom Company Input */}
                    <div className="p-3 bg-white/[0.04] space-y-2">
                      <div className="text-[10px] font-mono uppercase text-white/60 font-semibold tracking-wider">
                        + Enter Custom Company:
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={customInput}
                          onChange={(e) => setCustomInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleApplyCustom();
                            }
                          }}
                          placeholder="E.g. Stripe, Datadog..."
                          className="flex-1 px-3 py-1.5 rounded-lg bg-black/60 border border-white/20 text-white text-xs placeholder:text-white/40 focus:outline-none focus:border-white/60 font-sans"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCustom}
                          disabled={!customInput.trim()}
                          className="px-3 py-1.5 rounded-lg bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors disabled:opacity-40 cursor-pointer"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* 2. Chat / Question Interface (ASK) */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <span className="text-[11px] font-mono font-medium uppercase tracking-[0.22em] text-white/70 drop-shadow-sm">
                ASK
              </span>
            </div>

            <div className="bg-black/65 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-4 sm:p-5 focus-within:border-white/50 focus-within:ring-2 focus-within:ring-white/15 transition-all">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0 mt-0.5">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>

                <textarea
                  ref={textareaRef}
                  rows={2}
                  disabled={loading}
                  value={question}
                  onChange={(e) => onQuestionChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`What changed in ${competitor}'s strategy?`}
                  className="w-full text-sm sm:text-base text-white placeholder:text-white/40 focus:outline-none resize-none bg-transparent font-sans font-normal leading-relaxed tracking-wide"
                />
              </div>

              {/* Bottom Action Bar */}
              <div className="flex items-center justify-end pt-3 border-t border-white/15 mt-2">
                <button
                  type="button"
                  disabled={loading || !question.trim()}
                  onClick={onAnalyze}
                  className={`px-6 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#071824] font-mono font-semibold text-xs uppercase tracking-[0.14em] transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)] flex items-center gap-2 group cursor-pointer active:scale-98 ${
                    loading || !question.trim()
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:scale-[1.02]"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center gap-2 text-[#071824]">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#071824] animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#071824] animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#071824] animate-bounce"></span>
                      </div>
                      <span>Analyzing {competitor}...</span>
                    </div>
                  ) : (
                    <>
                      <span>Analyze</span>
                      <span className="font-mono font-bold group-hover:translate-x-1 transition-transform">&rarr;</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 3. Example Questions (SUGGESTIONS) */}
          <div className="space-y-1.5 pt-1 text-center">
            <span className="block text-[11px] font-mono font-medium uppercase tracking-[0.22em] text-white/70 drop-shadow-sm">
              SUGGESTIONS
            </span>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {SUGGESTIONS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className="text-xs font-mono font-normal sm:font-medium px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white hover:text-black hover:border-white text-white/85 transition-all cursor-pointer shadow-xs"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

