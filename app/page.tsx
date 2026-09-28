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
    <div className="min-h-screen bg-[#F4F0E8] text-[#182027] flex flex-col font-sans selection:bg-[#C6A15B]/30 selection:text-[#071824]">
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
          {/* SECTION 2 & 3: Hero Section with Centered Chatbox and LeasingOne Styling */}
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
              className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-8 py-12 pb-24 space-y-10 scroll-mt-6 animate-in fade-in duration-500"
            >
              {/* Error Banner */}
              {errorMsg && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-800 font-mono">
                  <p className="font-semibold">Pipeline Alert:</p>
                  <p className="text-xs mt-1 text-rose-700">{errorMsg}</p>
                </div>
              )}

              {/* Loading Indicator */}
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
        <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-8 py-8 pb-24">
          <CompetitorsView
            onSelectCompetitor={handleSelectFromCompetitorsView}
            onOpenAddEvent={() => setIsAddEventOpen(true)}
          />
        </main>
      )}

      {/* TAB 3: INSIGHTS */}
      {activeTab === "insights" && (
        <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-8 py-8 pb-24">
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

      {/* Footer */}
      <footer className="border-t border-[#DDD8CE] bg-[#EAE5DC] py-8 mt-auto">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#687078]">
          <div className="flex items-center gap-2.5">
            <img
              src="/cia-logo.png"
              alt="CIA Logo"
              className="w-5 h-5 object-contain"
            />
            <span className="font-mono font-bold text-[#071824] uppercase text-xs tracking-wider">CIA</span>
            <span className="text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-[#C6A15B]/15 text-[#8C6D2C] border border-[#C6A15B]/30">
              AGENT
            </span>
            <span className="text-[#DDD8CE]">&bull;</span>
            <span>Competitive Intelligence Command Center</span>
          </div>
          <div className="font-mono text-[11px] text-[#687078]">
            Vectorize Hindsight + Google Gemini
          </div>
        </div>
      </footer>
    </div>
  );
}
