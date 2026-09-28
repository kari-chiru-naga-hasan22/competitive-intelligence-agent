"use client";

import { useState } from "react";

interface AnalysisBoxProps {
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
    subtitle: "AI Assistant, Usage Pricing, Security Package",
    defaultQuestion: "How has Acme Cloud's strategy changed over the last 90 days?",
    tag: "5 Events",
  },
  {
    name: "Nimbus Analytics",
    subtitle: "Enterprise Support, Trusted AI, Data Integrations",
    defaultQuestion: "What is Nimbus Analytics' enterprise and AI strategy?",
    tag: "5 Events",
  },
  {
    name: "Vertex Data",
    subtitle: "Self-Service PLG, Starter Packages, Sales Hiring",
    defaultQuestion: "How has Vertex Data positioned its products and pricing?",
    tag: "5 Events",
  },
];

export function AnalysisBox({
  competitor,
  onCompetitorChange,
  question,
  onQuestionChange,
  onAnalyze,
  loading,
}: AnalysisBoxProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSelect = (name: string, defaultQ: string) => {
    onCompetitorChange(name);
    onQuestionChange(defaultQ);
    setDropdownOpen(false);
  };

  return (
    <div className="bg-[#0D1322] border border-slate-800/90 rounded-2xl p-6 shadow-xl relative overflow-visible backdrop-blur-sm">
      {/* Top subtle highlight border */}
      <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent"></div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Competitor Selector Dropdown */}
        <div className="md:col-span-4 relative">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-2">
            Target Competitor
          </label>
          <div className="relative">
            <button
              type="button"
              disabled={loading}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-slate-700/80 bg-slate-900/90 text-left text-sm font-semibold text-white hover:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all cursor-pointer shadow-inner"
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.6)]"></span>
                <span className="truncate">{competitor}</span>
              </div>
              <svg
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  dropdownOpen ? "rotate-180 text-indigo-400" : ""
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
                ></path>
              </svg>
            </button>

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-30 overflow-hidden divide-y divide-slate-800">
                  {COMPETITORS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => handleSelect(c.name, c.defaultQuestion)}
                      className={`w-full text-left px-4 py-3.5 hover:bg-slate-800/80 transition-colors flex flex-col cursor-pointer ${
                        c.name === competitor ? "bg-indigo-950/40 border-l-2 border-indigo-400" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm text-white">
                          {c.name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-semibold border border-slate-700">
                          {c.tag}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 mt-1 line-clamp-1">
                        {c.subtitle}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5 mt-2 text-[11px] font-mono text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Hindsight memory bank connected</span>
          </div>
        </div>

        {/* Question Input */}
        <div className="md:col-span-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="intel-question-input"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono"
              >
                Ask your intelligence question
              </label>
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline-block">
                CIA evaluates multi-event trajectory
              </span>
            </div>

            <div className="relative">
              <textarea
                id="intel-question-input"
                rows={2}
                disabled={loading}
                value={question}
                onChange={(e) => onQuestionChange(e.target.value)}
                placeholder={`Ask anything about ${competitor}'s pricing, moves, positioning, or hiring...`}
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900/90 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/80 transition-all resize-none shadow-inner"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="font-mono text-[10px] bg-slate-800 text-indigo-300 px-2 py-0.5 rounded border border-slate-700 uppercase font-semibold">
                CIA Prompt:
              </span>
              <span className="text-xs text-slate-300">
                Probe pricing reductions, enterprise security, or messaging pivots.
              </span>
            </div>

            <button
              type="button"
              disabled={loading || !question.trim()}
              onClick={onAnalyze}
              className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 px-6 py-2.5 text-sm font-semibold text-white transition-all shadow-lg shadow-indigo-600/25 shrink-0 ${
                loading || !question.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : "active:scale-[0.98] cursor-pointer"
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
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <span>Analyze Strategy</span>
                  <span className="text-indigo-200 font-mono">→</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
