"use client";

import { useState } from "react";
import Image from "next/image";

interface CompetitorOverviewProps {
  competitor: string;
  onCompetitorChange: (c: string) => void;
  onQuestionChange: (q: string) => void;
  disabled?: boolean;
}

const COMPETITORS = [
  {
    name: "Acme Cloud",
    subtitle: "AI Assistant, Usage Pricing, Security Package",
    defaultQuestion: "How has Acme Cloud's strategy changed over the last 90 days?",
  },
  {
    name: "Nimbus Analytics",
    subtitle: "Enterprise Support, Trusted AI, Data Integrations",
    defaultQuestion: "What is Nimbus Analytics' enterprise and AI strategy?",
  },
  {
    name: "Vertex Data",
    subtitle: "Self-Service PLG, Starter Packages, Sales Hiring",
    defaultQuestion: "How has Vertex Data positioned its products and pricing?",
  },
];

export function CompetitorOverview({
  competitor,
  onCompetitorChange,
  onQuestionChange,
  disabled,
}: CompetitorOverviewProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSelect = (name: string, defaultQ: string) => {
    onCompetitorChange(name);
    onQuestionChange(defaultQ);
    setDropdownOpen(false);
  };

  return (
    <section className="relative pt-8 pb-4 overflow-hidden border-b border-slate-200/60">
      {/* Background Mountain Image on the Right */}
      <div className="absolute right-0 top-0 bottom-0 w-[45%] lg:w-[40%] pointer-events-none -z-10 select-none overflow-hidden hidden sm:block">
        <div className="relative w-full h-full">
          <Image
            src="/mountain.jpg"
            alt="Alpine mountain peak"
            fill
            priority
            className="object-cover object-top opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FBFBFC] via-[#FBFBFC]/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#FBFBFC]/50 via-transparent to-[#FBFBFC]"></div>
          {/* Subtle radar circle */}
          <div className="absolute right-12 top-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-slate-300/30"></div>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        {/* Left: Heading & Value Proposition */}
        <div className="max-w-xl">
          <span className="text-[11px] font-bold tracking-[0.2em] text-slate-400 uppercase font-mono block mb-1.5">
            COMPETITIVE INTELLIGENCE
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
            Know what changed. <br />
            Understand why it matters.
          </h1>
        </div>

        {/* Right: Compact Competitor Selector Card */}
        <div className="relative w-full sm:w-72 shrink-0 pb-1">
          <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-xs">
            <span className="block text-[11px] font-medium text-slate-400 mb-1">
              Competitor
            </span>
            <button
              type="button"
              disabled={disabled}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/70 text-left text-sm font-bold text-[#0F172A] transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-[#0F172A]"></span>
                <span className="truncate">{competitor}</span>
              </div>
              <svg
                className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
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

            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-40 overflow-hidden divide-y divide-slate-100">
                  {COMPETITORS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => handleSelect(c.name, c.defaultQuestion)}
                      className={`w-full text-left px-3.5 py-2.5 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer ${
                        c.name === competitor ? "bg-slate-100 text-[#0F172A]" : "text-slate-600"
                      }`}
                    >
                      <div>
                        <span className="block font-bold">{c.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal line-clamp-1">{c.subtitle}</span>
                      </div>
                      {c.name === competitor && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0F172A]"></span>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
