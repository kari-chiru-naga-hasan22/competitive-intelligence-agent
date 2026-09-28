"use client";

import { useState } from "react";
import Image from "next/image";

interface HeroProps {
  competitor: string;
  onCompetitorChange: (c: string) => void;
  question: string;
  onQuestionChange: (q: string) => void;
  onAnalyze: () => void;
  loading: boolean;
}

const COMPETITORS = [
  {
    name: "Acme Cloud",
    question: "How has Acme Cloud's strategy changed over 90 days?",
  },
  {
    name: "Nimbus Analytics",
    question: "What is Nimbus Analytics' enterprise and AI strategy?",
  },
  {
    name: "Vertex Data",
    question: "How has Vertex Data positioned its products and pricing?",
  },
];

export function Hero({
  competitor,
  onCompetitorChange,
  question,
  onQuestionChange,
  onAnalyze,
  loading,
}: HeroProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSelect = (name: string, defaultQ: string) => {
    onCompetitorChange(name);
    onQuestionChange(defaultQ);
    setDropdownOpen(false);
  };

  return (
    <section className="relative pt-12 pb-10 overflow-hidden">
      {/* Background Mountain Image on the Right with Gradient Fade & Radar Circles */}
      <div className="absolute right-0 top-0 bottom-0 w-full sm:w-[58%] lg:w-[52%] pointer-events-none -z-10 select-none overflow-hidden">
        {/* Mountain Image */}
        <div className="relative w-full h-full">
          <Image
            src="/mountain.jpg"
            alt="Alpine mountain peak"
            fill
            priority
            className="object-cover object-top opacity-85 sm:opacity-95"
          />

          {/* Left Gradient Mask: seamless fade into white/off-white background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FBFBFC] via-[#FBFBFC]/70 to-transparent w-full"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#FBFBFC]/40 via-transparent to-[#FBFBFC]"></div>

          {/* Radar / Target Coordinate Geometric Overlay */}
          <div className="absolute right-[20%] top-[30%] -translate-y-1/2 w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] rounded-full border border-slate-400/25 pointer-events-none">
            {/* Inner concentric ring */}
            <div className="absolute inset-8 rounded-full border border-slate-400/20"></div>

            {/* Crosshair lines */}
            <div className="absolute top-1/2 left-[-40px] right-[-40px] h-[1px] bg-slate-400/25"></div>
            <div className="absolute left-1/2 top-[-40px] bottom-[-40px] w-[1px] bg-slate-400/25"></div>

            {/* Coordinate dot */}
            <div className="absolute top-[28px] right-[28px] w-2 h-2 rounded-full border border-slate-500 bg-white"></div>
            <div className="absolute bottom-[28px] left-[28px] w-1.5 h-1.5 rounded-full bg-slate-400"></div>
          </div>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 sm:px-8">
        {/* Left Headline Section */}
        <div className="max-w-xl">
          {/* Overline */}
          <span className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase font-mono block mb-3.5">
            COMPETITIVE INTELLIGENCE
          </span>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#0F172A] tracking-tight leading-[1.08]">
            Stay informed. <br />
            Stay ahead.
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-base sm:text-lg text-slate-500 leading-relaxed font-normal">
            Track competitor moves, uncover strategic signals, and make better decisions.
          </p>
        </div>

        {/* Floating Analysis Card matching screenshot */}
        <div className="mt-8 max-w-[820px] bg-white rounded-2xl border border-slate-200/90 shadow-[0_12px_36px_rgba(0,0,0,0.06)] p-3.5 sm:p-4 relative z-20">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Field 1: Competitor Selector */}
            <div className="sm:w-56 relative shrink-0">
              <label className="block text-[11px] font-medium text-slate-400 mb-1 pl-1">
                Competitor
              </label>

              <button
                type="button"
                disabled={loading}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 text-left text-sm font-semibold text-[#0F172A] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 truncate">
                  {/* Building / Business icon */}
                  <svg
                    className="w-4 h-4 text-slate-400 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span className="truncate">{competitor}</span>
                </div>
                <svg
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
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

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-40 overflow-hidden divide-y divide-slate-100">
                    {COMPETITORS.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => handleSelect(c.name, c.question)}
                        className={`w-full text-left px-3.5 py-2.5 text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer ${
                          c.name === competitor ? "bg-slate-50 text-[#0F172A]" : "text-slate-600"
                        }`}
                      >
                        <span>{c.name}</span>
                        {c.name === competitor && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0F172A]"></span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Field 2: Ask a question */}
            <div className="flex-1 min-w-0">
              <label
                htmlFor="search-question-input"
                className="block text-[11px] font-medium text-slate-400 mb-1 pl-1"
              >
                Ask a question
              </label>

              <input
                id="search-question-input"
                type="text"
                disabled={loading}
                value={question}
                onChange={(e) => onQuestionChange(e.target.value)}
                placeholder={`How has ${competitor}'s strategy changed over 90 days?`}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-[#0F172A] text-sm text-[#0F172A] placeholder-slate-400 transition-all font-medium"
              />
            </div>

            {/* Field 3: Analyze Button */}
            <div className="sm:self-end pt-1 sm:pt-0">
              <button
                type="button"
                disabled={loading || !question.trim()}
                onClick={onAnalyze}
                className={`w-full sm:w-auto h-[42px] px-6 rounded-xl bg-[#0F172A] hover:bg-black text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                  loading || !question.trim() ? "opacity-60 cursor-not-allowed" : "active:scale-[0.98]"
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze</span>
                    <span className="font-mono text-slate-300">→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 4 Value Proposition Features Row matching screenshot */}
        <div className="mt-6 max-w-[820px] flex flex-wrap items-center justify-between gap-y-2 gap-x-4 text-xs font-medium text-slate-600 px-1">
          {/* Feature 1: Real-time updates */}
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span>Real-time updates</span>
          </div>

          <span className="hidden sm:inline text-slate-300">|</span>

          {/* Feature 2: Historical context */}
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Historical context</span>
          </div>

          <span className="hidden sm:inline text-slate-300">|</span>

          {/* Feature 3: Strategic insights */}
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span>Strategic insights</span>
          </div>

          <span className="hidden sm:inline text-slate-300">|</span>

          {/* Feature 4: Market opportunities */}
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <span>Market opportunities</span>
          </div>
        </div>
      </div>
    </section>
  );
}
