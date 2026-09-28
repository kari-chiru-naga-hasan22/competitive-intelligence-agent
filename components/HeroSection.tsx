"use client";

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import { BorderBeam } from "border-beam";
import { IntelligenceProcessVisual } from "@/components/IntelligenceProcessVisual";

export interface HeroSectionProps {
  competitor: string;
  onCompetitorChange: (c: string) => void;
  question: string;
  onQuestionChange: (q: string) => void;
  onAnalyze: () => void;
  loading: boolean;
}

const COMPETITORS = [
  { name: "Acme Cloud", defaultQ: "What changed in their strategy?", category: "Cloud Analytics & Security" },
  { name: "Nimbus Analytics", defaultQ: "What is Nimbus Analytics' enterprise and AI strategy?", category: "Enterprise BI & Governance" },
  { name: "Vertex Data", defaultQ: "How has Vertex Data positioned its products and pricing?", category: "PLG & Data Infrastructure" },
  { name: "Shopify", defaultQ: "What is Shopify's B2B and AI commerce strategy?", category: "E-Commerce & Retail" },
  { name: "HubSpot", defaultQ: "How is HubSpot evolving its Breeze AI and seat pricing?", category: "CRM & Customer Platform" },
  { name: "Slack", defaultQ: "How is Slack positioning its AI and Agentforce integrations?", category: "Workplace Collaboration" },
  { name: "Notion", defaultQ: "What is Notion's product expansion into search and AI agents?", category: "Connected Workspace" },
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
  const [dropdownCoords, setDropdownCoords] = useState<{ top: number; left: number; width: number } | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const updateCoords = useCallback(() => {
    if (dropdownTriggerRef.current) {
      const rect = dropdownTriggerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const targetWidth = Math.max(rect.width, 280);
      let left = rect.left;

      // Ensure dropdown does not overflow the right edge of viewport
      if (left + targetWidth > viewportWidth - 16) {
        left = Math.max(16, viewportWidth - targetWidth - 16);
      }

      setDropdownCoords({
        top: rect.bottom + 6,
        left,
        width: Math.min(targetWidth, viewportWidth - 32),
      });
    }
  }, []);

  const handleToggleDropdown = () => {
    if (!dropdownOpen) {
      updateCoords();
      setDropdownOpen(true);
    } else {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (!dropdownOpen) return;
    updateCoords();

    const handleUpdate = () => {
      updateCoords();
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        dropdownMenuRef.current &&
        !dropdownMenuRef.current.contains(target) &&
        dropdownTriggerRef.current &&
        !dropdownTriggerRef.current.contains(target)
      ) {
        setDropdownOpen(false);
      }
    };

    window.addEventListener("scroll", handleUpdate, { passive: true });
    window.addEventListener("resize", handleUpdate);
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      window.removeEventListener("scroll", handleUpdate);
      window.removeEventListener("resize", handleUpdate);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, [dropdownOpen, updateCoords]);

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
    <section className="relative flex items-center justify-center py-4 sm:py-6 overflow-hidden border-b border-[#DDE3F5] bg-[#F7F9FF]">
      {/* 🌌 Ambient Pastel Radiance from index1.html */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        {/* Soft violet radial blur on right */}
        <div className="absolute right-[-5%] top-1/4 w-[600px] h-[600px] bg-radial from-[rgba(196,186,255,0.4)] via-[rgba(206,216,255,0.18)] to-transparent rounded-full blur-3xl pointer-events-none" />
        {/* Soft sky blue radial blur on left */}
        <div className="absolute left-[-5%] top-1/3 w-[460px] h-[460px] bg-radial from-[rgba(206,214,255,0.45)] via-[rgba(226,233,255,0.2)] to-transparent rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="max-w-[1200px] w-full mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        {/* 2-Column Responsive Layout: Left Controls (55%) + Right Floating Process Visual (45%) */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 xl:gap-12">
          
          {/* ── LEFT COLUMN: EDITORIAL HEADLINE & INTELLIGENCE CONSOLE ── */}
          <div className="w-full lg:w-[54%] xl:w-[55%] max-w-2xl mx-auto lg:mx-0 flex flex-col space-y-3.5 text-left">
            
            {/* Tag / Eyebrow */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="eb h-7 px-3 text-xs">
                <i></i>
                <span>Track • Remember • Understand • Stay Ahead</span>
              </span>
            </div>

            {/* Editorial Headline */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl lg:text-[32px] xl:text-[36px] font-extrabold text-[#0B0D24] tracking-[-0.03em] leading-[1.1] font-sans">
                A living intelligence{" "}
                <span className="block text-[#0B0D24]">
                  file for every{" "}
                  <span className="bg-gradient-to-r from-[#3B3FF0] to-[#5560F8] bg-clip-text text-transparent">
                    competitor.
                  </span>
                </span>
              </h1>

              <p className="text-xs sm:text-[13.5px] text-[#3F4463] font-normal max-w-lg leading-normal">
                Hindsight automatically researches, remembers, and analyzes competitor developments — so you can see how their strategy changes over time.
              </p>
            </div>

            {/* Interactive Research Console with Libraries.dev BorderBeam */}
            <BorderBeam
              size="md"
              colorVariant="colorful"
              strength={0.6}
              theme="light"
              borderRadius={24}
              active={!prefersReducedMotion}
              className="w-full"
            >
              <div className="gl p-3.5 sm:p-4 shadow-[0_16px_36px_rgba(80,90,220,0.09)] space-y-2.5">
                
                {/* 1. Target Selector Header */}
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-[0.06em] text-[#3F4463]">
                    TARGET COMPETITOR
                  </label>
                  <span className="syn text-[11px] h-5 px-2">Synthetic CI dataset</span>
                </div>

                {/* Target Dropdown Button */}
                <div className="relative">
                  <button
                    ref={dropdownTriggerRef}
                    type="button"
                    disabled={loading}
                    onClick={handleToggleDropdown}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-[#DDE3F5] bg-white hover:border-[#4338F0] text-left text-sm font-medium text-[#0B0D24] shadow-xs hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#EEF1FB] border border-[#DDE3F5] flex items-center justify-center text-[#4338F0] group-hover:scale-105 transition-transform">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <span className="font-bold text-[#0B0D24] text-sm tracking-tight block">
                          {competitor}
                        </span>
                      </div>
                    </div>

                    <svg
                      className={`w-3.5 h-3.5 text-[#7A7F99] transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180 text-[#4338F0]" : "group-hover:text-[#0B0D24]"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

              {/* 2. Question / Inquiry Input (.fld style) */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-[0.06em] text-[#3F4463]">
                  INVESTIGATION PROMPT
                </label>

                <div className="p-2.5 sm:p-3 rounded-xl bg-white border border-[#DDE3F5] shadow-[0_4px_14px_rgba(80,90,220,0.05)] focus-within:border-[#4338F0] focus-within:ring-3 focus-within:ring-[#4338F0]/10 transition-all">
                  <div className="flex items-start gap-2.5">
                    <svg className="w-4 h-4 text-[#7A7F99] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="7" strokeWidth="2" />
                      <path d="M20 20l-3.5-3.5" strokeWidth="2" strokeLinecap="round" />
                    </svg>

                    <textarea
                      ref={textareaRef}
                      rows={2}
                      disabled={loading}
                      value={question}
                      onChange={(e) => onQuestionChange(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={`Ask anything about ${competitor}'s moves, pricing, or roadmap...`}
                      className="w-full text-xs sm:text-sm text-[#0B0D24] placeholder:text-[#7A7F99] focus:outline-none resize-none bg-transparent font-medium leading-snug"
                    />
                  </div>

                  {/* Bottom Action Bar inside Ask box */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#EEF1FB] mt-1.5">
                    <div className="flex items-center gap-2 text-[11px] text-[#7A7F99]">
                      <span className="hidden sm:inline">Press Enter ↵ to synthesize</span>
                    </div>

                    <button
                      type="button"
                      disabled={loading || !question.trim()}
                      onClick={onAnalyze}
                      className={`h-8.5 px-4 sm:px-5 rounded-lg bg-gradient-to-b from-[#4B41F4] to-[#3F35EB] text-white font-semibold text-xs shadow-[0_6px_16px_rgba(67,56,240,0.24)] hover:-translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer active:scale-98 ${
                        loading || !question.trim()
                          ? "opacity-50 cursor-not-allowed hover:translate-y-0 shadow-none"
                          : ""
                      }`}
                    >
                      {loading ? (
                        <div className="flex items-center gap-1.5 text-white">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.3s]"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.15s]"></span>
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce"></span>
                          <span>Synthesizing...</span>
                        </div>
                      ) : (
                        <>
                          <span>Analyze</span>
                          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 12h16M14 6l6 6-6 6" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Indicator Bar */}
              <div className="flex items-center justify-between text-[11px] text-[#3F4463] pt-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="pulse"></span>
                  <span className="font-medium">Living Hindsight memory active</span>
                </div>
                <span className="text-[#7A7F99]">4-stage causal synthesis</span>
              </div>

              {/* Suggestions Chips */}
              <div className="pt-1.5 border-t border-[#EEF1FB]">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] font-semibold text-[#7A7F99] uppercase tracking-wider">
                    Quick Inquiries:
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleChipClick(chip)}
                      className="chip text-[11px] sm:text-xs h-7 px-3 py-0.5"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Example Competitor Chips */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#7A7F99] pt-0.5">
                <span className="font-medium text-[#3F4463]">Try examples:</span>
                {COMPETITORS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleSelect(c.name, c.defaultQ)}
                    className={`px-2.5 py-0.5 rounded-full border text-[11px] font-medium transition-all cursor-pointer ${
                      c.name === competitor
                        ? "bg-[#4338F0] text-white border-[#4338F0]"
                        : "bg-white text-[#3F4463] border-[#DDE3F5] hover:border-[#4338F0] hover:text-[#4338F0]"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

            </div>
          </BorderBeam>

          {/* Fixed Floating Dropdown Options */}
          {dropdownOpen && dropdownCoords && (
            <>
              <div
                className="fixed inset-0 z-[9990]"
                onClick={() => setDropdownOpen(false)}
              />
              <div
                ref={dropdownMenuRef}
                className="fixed bg-white border border-[#DDE3F5] rounded-2xl shadow-[0_20px_50px_rgba(11,13,36,0.22)] z-[9999] overflow-hidden divide-y divide-[#EEF1FB] backdrop-blur-xl max-h-[340px] overflow-y-auto animate-in fade-in zoom-in-95 duration-150"
                style={{
                  top: `${dropdownCoords.top}px`,
                  left: `${dropdownCoords.left}px`,
                  width: `${dropdownCoords.width}px`,
                }}
              >
                <div className="px-4 py-2 bg-[#F7F9FF] border-b border-[#EEF1FB] text-[10px] font-bold uppercase tracking-wider text-[#7A7F99] flex items-center justify-between">
                  <span>Select Target Competitor</span>
                  <span>7 Entities</span>
                </div>
                {COMPETITORS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => handleSelect(c.name, c.defaultQ)}
                    className={`w-full text-left px-4 py-3 hover:bg-[#EEF1FB] transition-colors flex items-center justify-between cursor-pointer ${
                      c.name === competitor ? "bg-[#EEF1FB]/80 text-[#4338F0]" : "text-[#0B0D24]"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-sm block">
                        {c.name}
                      </span>
                      <span className="text-xs text-[#7A7F99] block">
                        {c.category}
                      </span>
                    </div>
                    {c.name === competitor && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#4338F0] shadow-[0_0_8px_#4338F0]"></span>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

          {/* ── RIGHT COLUMN: FLOATING INTELLIGENCE-PROCESS VISUAL ── */}
          <div className="w-full lg:w-[44%] xl:w-[45%] flex items-center justify-center lg:justify-end overflow-visible">
            <IntelligenceProcessVisual />
          </div>

        </div>
      </div>
    </section>
  );
}
