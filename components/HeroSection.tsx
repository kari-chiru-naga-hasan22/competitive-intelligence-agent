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

const COMPETITORS = [
  { name: "Acme Cloud", defaultQ: "What changed in their strategy?" },
  { name: "Nimbus Analytics", defaultQ: "What is Nimbus Analytics' enterprise and AI strategy?" },
  { name: "Vertex Data", defaultQ: "How has Vertex Data positioned its products and pricing?" },
];

const SUGGESTIONS = [
  "How is pricing changing?",
  "What products launched recently?",
  "How is their messaging evolving?",
  "What should we watch next?",
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSelect = (name: string, defaultQ: string) => {
    onCompetitorChange(name);
    onQuestionChange(defaultQ);
    setDropdownOpen(false);
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

  return (
    <section className="relative min-h-[660px] sm:min-h-[720px] flex items-center justify-center pt-14 pb-16 sm:pt-16 sm:pb-20 overflow-hidden border-b border-[#DDD8CE]">
      {/* 🌌 FULL BACKGROUND: Neural Agent Artistically Aligned */}
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

      <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-8 relative z-10">
        
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

        {/* ── CENTERED AGENT CHATBOX & CONTROLS (PRECISE, ALL WHITE TEXT) ── */}
        <div className="max-w-xl mx-auto mt-7 space-y-3.5">
          
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

                <svg
                  className={`w-4 h-4 text-white transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Options */}
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 right-0 mt-2 bg-black/90 border border-white/20 rounded-xl shadow-2xl z-40 overflow-hidden divide-y divide-white/10 backdrop-blur-2xl">
                    {COMPETITORS.map((c) => (
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
