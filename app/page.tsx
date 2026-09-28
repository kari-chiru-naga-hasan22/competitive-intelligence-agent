"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { IntelligenceDossier } from "@/components/IntelligenceDossier";
import { CompetitorsView } from "@/components/CompetitorsView";
import { InsightsView } from "@/components/InsightsView";
import { AddEventModal } from "@/components/AddEventModal";
import { SettingsModal } from "@/components/SettingsModal";
import { LoadingState } from "@/components/LoadingState";
import { analyzeCompetitor, IntelligenceResponse } from "@/lib/api";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "competitors" | "insights">("dashboard");
  const [competitor, setCompetitor] = useState("Acme Cloud");
  const [question, setQuestion] = useState(
    "What changed in their strategy?"
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IntelligenceResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Modals state
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const runAnalysis = useCallback(
    async (targetComp: string, targetQuestion: string) => {
      setLoading(true);
      setErrorMsg(null);
      setResult(null); // Immediately clear previous response so old company data never lingers
      setHasSubmitted(true);
      try {
        const data = await analyzeCompetitor(targetComp, targetQuestion);
        setResult(data);
      } catch (err: unknown) {
        console.error("Analysis failed:", err);
        setErrorMsg(
          err instanceof Error
            ? err.message
            : "An unexpected error occurred during synthesis."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Auto-scroll to results after analysis
  useEffect(() => {
    if (hasSubmitted && (loading || result) && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hasSubmitted, result, loading]);

  const handleCompetitorChange = (newComp: string) => {
    setCompetitor(newComp);
    const defaultQ =
      newComp === "Nimbus Analytics"
        ? "What is Nimbus Analytics' enterprise and AI strategy?"
        : newComp === "Vertex Data"
        ? "How has Vertex Data positioned its products and pricing?"
        : newComp === "Shopify"
        ? "What is Shopify's B2B and AI commerce strategy?"
        : newComp === "HubSpot"
        ? "How is HubSpot evolving its Breeze AI and seat pricing?"
        : newComp === "Slack"
        ? "How is Slack positioning its AI and Agentforce integrations?"
        : newComp === "Notion"
        ? "What is Notion's product expansion into search and AI agents?"
        : "What changed in their strategy?";
    setQuestion(defaultQ);
  };

  const handleQuestionChange = (newQ: string) => {
    setQuestion(newQ);
  };

  const handleAnalyze = () => {
    runAnalysis(competitor, question);
  };

  const handleSelectFromCompetitorsView = (newComp: string) => {
    setCompetitor(newComp);
    const defaultQ = `What changed in their strategy?`;
    setQuestion(defaultQ);
    setActiveTab("dashboard");
    runAnalysis(newComp, defaultQ);
  };

  const handleSelectFromInsightsView = (newComp: string, promptQ: string) => {
    setCompetitor(newComp);
    setQuestion(promptQ);
    setActiveTab("dashboard");
    runAnalysis(newComp, promptQ);
  };

  const handleEventAdded = (targetComp: string) => {
    setCompetitor(targetComp);
    runAnalysis(targetComp, question);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FF] text-[#0B0D24] flex flex-col font-sans selection:bg-[#4338F0]/20 selection:text-[#4338F0]">
      {/* SECTION 1 — Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAddEvent={() => setIsAddEventOpen(true)}
      />

      {/* Main Content Body */}
      {activeTab === "dashboard" && (
        <>
          {/* SECTION 2 & 3: Hero Section with Living Intelligence Visual and Console */}
          <HeroSection
            competitor={competitor}
            onCompetitorChange={handleCompetitorChange}
            question={question}
            onQuestionChange={handleQuestionChange}
            onAnalyze={handleAnalyze}
            loading={loading}
          />

          {/* SECTION 4: Intelligence Results (Shown ONLY AFTER user submits question) */}
          {hasSubmitted && (
            <main
              ref={resultsRef}
              id="intelligence-results"
              className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-10 pb-24 space-y-10 scroll-mt-6 animate-in fade-in duration-500"
            >
              {/* Error Banner with Retry Action */}
              {errorMsg && (
                <div className="gl bg-rose-50/70 border border-rose-200 rounded-3xl p-6 sm:p-8 text-[#0B0D24] shadow-[0_20px_40px_rgba(220,50,50,0.08)]">
                  <div className="flex items-start justify-between gap-6 flex-wrap sm:flex-nowrap">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-rose-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                        <h3 className="font-extrabold text-base sm:text-lg text-rose-950 uppercase tracking-tight font-sans">
                          ANALYSIS UNAVAILABLE
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-rose-800 max-w-2xl leading-relaxed">
                        The backend intelligence service was unable to complete synthesis. Living memory records remain secure.
                      </p>
                      <div className="p-3 rounded-xl bg-white/80 border border-rose-200/80 text-xs text-rose-900 font-mono">
                        {errorMsg}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => runAnalysis(competitor, question)}
                      className="px-6 py-3 rounded-xl bg-gradient-to-b from-[#4B41F4] to-[#3F35EB] text-white font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md shrink-0 self-center hover:-translate-y-0.5 active:scale-98"
                    >
                      Retry Analysis
                    </button>
                  </div>
                </div>
              )}

              {/* Loading Indicator with ThinkingOrb */}
              {loading && <LoadingState competitor={competitor} />}

              {/* Live Intelligence Output */}
              {result && !loading && (
                <div className="animate-in fade-in duration-300">
                  <IntelligenceDossier
                    competitor={result.competitor}
                    question={result.question || question}
                    summary={result.insight.summary}
                    strategicSignal={result.insight.strategic_signal}
                    observedChanges={result.insight.observed_changes}
                    watchNext={result.insight.watch_next}
                    evidence={result.evidence}
                  />
                </div>
              )}
            </main>
          )}
        </>
      )}

      {/* TAB 2: COMPETITORS */}
      {activeTab === "competitors" && (
        <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-8 pb-24">
          <CompetitorsView
            onSelectCompetitor={handleSelectFromCompetitorsView}
            onOpenAddEvent={() => setIsAddEventOpen(true)}
          />
        </main>
      )}

      {/* TAB 3: INSIGHTS */}
      {activeTab === "insights" && (
        <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-8 pb-24">
          <InsightsView onAnalyzeCompetitor={handleSelectFromInsightsView} />
        </main>
      )}

      {/* Slideover / Modals */}
      <AddEventModal
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        onEventAdded={handleEventAdded}
        defaultCompetitor={competitor}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Footer from index1.html */}
      <footer className="ft mt-auto">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-12">
          <div className="ftg flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2.5">
                <svg width="24" height="24" viewBox="0 0 40 44" fill="none">
                  <polygon points="20,4 36,13 36,31 20,40 4,31 4,13" fill="#4338F0" stroke="#4338F0" strokeWidth="6" strokeLinejoin="round"/>
                  <polygon points="20,12 29,17 29,27 20,32 11,27 11,17" fill="none" stroke="#fff" strokeWidth="4" strokeLinejoin="round"/>
                </svg>
                <span className="font-extrabold text-base text-[#0B0D24] tracking-tight">
                  Competitive Intelligence Agent
                </span>
                <span className="syn">Hindsight Memory</span>
              </div>
              <p className="text-xs text-[#7A7F99]">
                Continuous longitudinal memory &amp; causal intelligence engine.
              </p>
            </div>

            <nav className="flex items-center gap-6 text-xs text-[#3F4463] font-medium" aria-label="Footer">
              <button type="button" onClick={() => setActiveTab("dashboard")} className="hover:text-[#4338F0] cursor-pointer">
                Dashboard
              </button>
              <button type="button" onClick={() => setActiveTab("competitors")} className="hover:text-[#4338F0] cursor-pointer">
                Entity Registry
              </button>
              <button type="button" onClick={() => setActiveTab("insights")} className="hover:text-[#4338F0] cursor-pointer">
                Cross-Entity Signals
              </button>
              <button type="button" onClick={() => setIsSettingsOpen(true)} className="hover:text-[#4338F0] cursor-pointer">
                System Status
              </button>
            </nav>
          </div>

          <div className="ftn flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#7A7F99] pt-6 border-t border-[#DDE3F5] mt-6">
            <span>Powered by Vectorize Hindsight + Google Gemini</span>
            <span className="syn">Synthetic demo dataset · For intelligence demonstrations</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
