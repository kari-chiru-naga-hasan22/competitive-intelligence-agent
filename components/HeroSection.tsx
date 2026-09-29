"use client";

import { useState, useRef, KeyboardEvent, ChangeEvent } from "react";
import { uploadDocument } from "@/lib/api";

export interface AttachedDoc {
  id: string;
  name: string;
  size: number;
  type: string;
  snippet?: string;
}

export interface HeroSectionProps {
  competitor: string;
  onCompetitorChange: (c: string) => void;
  question: string;
  onQuestionChange: (q: string) => void;
  onAnalyze: () => void;
  loading: boolean;
  attachments?: AttachedDoc[];
  onAddAttachment?: (file: AttachedDoc) => void;
  onRemoveAttachment?: (id: string) => void;
  enableWebSearch?: boolean;
  onToggleWebSearch?: (enabled: boolean) => void;
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
  "Pricing changes",
  "Product launches",
  "Messaging & positioning",
  "What should we watch?",
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

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function HeroSection({
  competitor,
  onCompetitorChange,
  question,
  onQuestionChange,
  onAnalyze,
  loading,
  attachments = [],
  onAddAttachment,
  onRemoveAttachment,
  enableWebSearch = false,
  onToggleWebSearch,
}: HeroSectionProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [customInput, setCustomInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (comp: string, defaultQ: string) => {
    onCompetitorChange(comp);
    onQuestionChange(defaultQ);
    setDropdownOpen(false);
  };

  const handleApplyCustom = () => {
    if (!customInput.trim()) return;
    const clean = customInput.trim();
    onCompetitorChange(clean);
    onQuestionChange(`What changed in ${clean}'s strategy and recent product announcements?`);
    setCustomInput("");
    setDropdownOpen(false);
    // If not in pre-seeded list, automatically activate web search option
    if (onToggleWebSearch && !PRESET_COMPETITORS.some(p => p.name.toLowerCase() === clean.toLowerCase())) {
      onToggleWebSearch(true);
    }
  };

  const handleChipClick = (chip: string) => {
    let newQ = "";
    if (chip === "Pricing changes") {
      newQ = `How has ${competitor}'s pricing and packaging changed over time?`;
    } else if (chip === "Product launches") {
      newQ = `What core products or AI features did ${competitor} launch recently?`;
    } else if (chip === "Messaging & positioning") {
      newQ = `How has ${competitor} shifted its positioning and market messaging?`;
    } else {
      newQ = `What strategic moves should we watch next for ${competitor}?`;
    }
    onQuestionChange(newQ);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading && question.trim()) {
        onAnalyze();
      }
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const result = await uploadDocument(file);
        if (result.success && result.file && onAddAttachment) {
          onAddAttachment({
            id: result.file.id,
            name: result.file.name,
            size: result.file.size,
            type: result.file.type,
            snippet: result.file.snippet,
          });
        } else if (!result.success) {
          setUploadError(result.error || `Failed to process ${file.name}`);
        }
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : `Upload failed for ${file.name}`);
      }
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <section className="relative w-full min-h-[580px] lg:min-h-[640px] flex items-center justify-center overflow-hidden py-14 sm:py-20 select-none">
      
      {/* ── BACKGROUND IMAGE LAYER ── */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105 filter brightness-[0.70] contrast-[1.15]"
        style={{
          backgroundImage: "url('/radar-dish.jpg')",
          backgroundPosition: "center 40%",
        }}
      />

      {/* ── DEEP EDITORIAL CINEMATIC OVERLAYS ── */}
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-[#040810]/80 via-transparent to-[#040810]/95" />
      <div className="absolute inset-0 z-1 bg-black/45 backdrop-blur-[0.5px]" />
      <div className="absolute inset-0 z-1 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(4,8,16,0.85)_100%)]" />

      {/* ── MAIN CONTAINER ── */}
      <div className="relative z-10 w-full max-w-[1240px] mx-auto px-4 sm:px-8">

        {/* ── APPROVED TELEMETRY HUD (RIGHT SIDE) ── */}
        <div className="hidden xl:block absolute right-4 2xl:right-8 top-1/2 -translate-y-1/2 z-20 pointer-events-auto">
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

        {/* ── CENTERED HERO HEADER ── */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <h1 className="text-2xl sm:text-4xl lg:text-[44px] font-semibold text-white tracking-[-0.025em] leading-tight uppercase drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)] whitespace-normal sm:whitespace-nowrap">
            UNDERSTAND THE MARKET<span className="inline-block w-2.5 h-2.5 rounded-full bg-[#C6A15B] ml-2 align-baseline mb-0.5 sm:mb-1 shadow-[0_0_8px_#C6A15B]"></span>
          </h1>

          <p className="text-sm sm:text-[15px] text-white/75 font-normal max-w-md mx-auto leading-relaxed tracking-wide drop-shadow-sm">
            Track competitor moves with persistent memory.
          </p>
        </div>

        {/* ── AGENT WORKSPACE & INPUT INTERFACE ── */}
        <div className="max-w-lg xl:max-w-xl mx-auto mt-7 space-y-3.5">
          
          {/* 1. Competitor Selection (WHO ARE YOU ANALYZING?) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-mono font-medium uppercase tracking-[0.22em] text-white/70 drop-shadow-sm">
                WHO ARE YOU ANALYZING?
              </span>

              {/* Web Search Reconnaissance Toggle */}
              {onToggleWebSearch && (
                <button
                  type="button"
                  onClick={() => onToggleWebSearch(!enableWebSearch)}
                  className={`flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
                    enableWebSearch
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold"
                      : "bg-white/5 text-white/50 border-white/10 hover:text-white/80"
                  }`}
                  title="Search Google, news, and official blogs for unindexed competitor moves and ingest to memory"
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${enableWebSearch ? "bg-emerald-400 animate-pulse" : "bg-white/40"}`}></span>
                  <span>{enableWebSearch ? "WEB RECON ACTIVE" : "+ Web Recon"}</span>
                </button>
              )}
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
                  <div className="flex flex-col">
                    <span className="text-white font-medium text-sm sm:text-base leading-tight">{competitor}</span>
                    {enableWebSearch && (
                      <span className="text-[10px] font-mono text-emerald-400 leading-none mt-0.5">
                        Will search Google & web for real-time moves
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase text-white/50 border border-white/15 px-2 py-0.5 rounded">
                    Change &darr;
                  </span>
                </div>
              </button>

              {/* Dropdown Options */}
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

                    {/* Custom Company Input with Web Recon */}
                    <div className="p-3 bg-white/[0.04] space-y-2">
                      <div className="text-[10px] font-mono uppercase text-white/60 font-semibold tracking-wider">
                        + Analyze Any Company (Google / Web Search & Ingest):
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
                          placeholder="E.g. Stripe, Datadog, Figma, Snowflake..."
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

          {/* 2. Chat / Question Interface (ASK YOUR INTELLIGENCE AGENT) */}
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <span className="text-[11px] font-mono font-medium uppercase tracking-[0.22em] text-white/70 drop-shadow-sm">
                ASK YOUR INTELLIGENCE AGENT
              </span>
            </div>

            <div className="bg-black/65 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-4 sm:p-5 focus-within:border-white/50 focus-within:ring-2 focus-within:ring-white/15 transition-all">
              
              {/* Question Textarea */}
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
                  placeholder={`How has ${competitor}'s strategy changed over the last 90 days?`}
                  className="w-full text-sm sm:text-base text-white placeholder:text-white/40 focus:outline-none resize-none bg-transparent font-sans font-normal leading-relaxed tracking-wide"
                />
              </div>

              {/* Uploaded File Chips Preview */}
              {attachments.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-white/50">
                    ATTACHED EVIDENCE ({attachments.length}):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-white text-xs font-mono"
                      >
                        <span className="text-[11px]">📄</span>
                        <span className="truncate max-w-[160px] font-medium">{file.name}</span>
                        <span className="text-[10px] text-white/50">({formatBytes(file.size)})</span>
                        {onRemoveAttachment && (
                          <button
                            type="button"
                            onClick={() => onRemoveAttachment(file.id)}
                            className="text-white/60 hover:text-white transition-colors cursor-pointer ml-0.5"
                            title="Remove attachment"
                          >
                            &times;
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Error Alert */}
              {uploadError && (
                <div className="mt-2 text-[11px] font-mono text-rose-300 bg-rose-950/50 border border-rose-800/60 rounded px-2.5 py-1">
                  {uploadError}
                </div>
              )}

              {/* Bottom Action Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-white/15 mt-3">
                {/* File Attachment Trigger */}
                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.docx,.txt,.csv,.md,.json"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={loading || isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/15 text-white/80 hover:text-white text-xs font-mono transition-all cursor-pointer disabled:opacity-50"
                  >
                    <span>📎</span>
                    <span>{isUploading ? "Uploading..." : "Add files"}</span>
                    <span className="text-[10px] text-white/40 font-mono hidden sm:inline">(PDF, DOCX, CSV)</span>
                  </button>
                </div>

                {/* Analyze Button */}
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

          {/* 3. Example Questions (TRY ASKING) */}
          <div className="space-y-1.5 pt-1 text-center">
            <span className="block text-[11px] font-mono font-medium uppercase tracking-[0.22em] text-white/70 drop-shadow-sm">
              TRY ASKING
            </span>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {SUGGESTIONS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className="text-xs font-mono font-normal sm:font-medium px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white hover:text-black hover:border-white text-white/85 transition-all cursor-pointer shadow-xs"
                >
                  [ {chip} ]
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
