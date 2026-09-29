"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { HeroSection, AttachedDoc } from "@/components/HeroSection";
import { IntelligenceDossier } from "@/components/IntelligenceDossier";
import { AgentActivity } from "@/components/AgentActivity";
import { HistoryView } from "@/components/HistoryView";
import { InsightsView } from "@/components/InsightsView";
import { AddEventModal } from "@/components/AddEventModal";
import { SettingsModal } from "@/components/SettingsModal";
import { LoadingState } from "@/components/LoadingState";
import {
  analyzeCompetitor,
  IntelligenceResponse,
  HistoryItem,
  SEEDED_ARCHIVES,
} from "@/lib/api";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "history" | "insights">("dashboard");
  const [competitor, setCompetitor] = useState("Acme Cloud");
  const [question, setQuestion] = useState("What changed in their strategy?");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IntelligenceResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<{ message: string; code?: string } | null>(null);

  // Agent Context Inputs
  const [attachments, setAttachments] = useState<AttachedDoc[]>([]);
  const [enableWebSearch, setEnableWebSearch] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Modals state
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleAddAttachment = (doc: AttachedDoc) => {
    setAttachments((prev) => [...prev, doc]);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((d) => d.id !== id));
  };

  const runAnalysis = useCallback(
    async (
      targetComp: string,
      targetQuestion: string,
      forceSeeded = false,
      targetAttachments = attachments,
      targetWebSearch = enableWebSearch
    ) => {
      setLoading(true);
      setErrorMsg(null);
      setHasSubmitted(true);
      try {
        const data = await analyzeCompetitor(targetComp, targetQuestion, {
          forceSeededArchive: forceSeeded,
          attachments: targetAttachments.map((a) => ({
            id: a.id,
            name: a.name,
          })),
          fileIds: targetAttachments.map((a) => a.id),
          enableWebSearch: targetWebSearch,
        });
        setResult(data);
      } catch (err: unknown) {
        console.error("Analysis request failed:", err);
        const code = (err as { code?: string })?.code;
        const msg =
          err instanceof Error
            ? err.message
            : "An unexpected error occurred during synthesis.";
        setErrorMsg({ message: msg, code });
      } finally {
        setLoading(false);
      }
    },
    [attachments, enableWebSearch]
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
        ? "What changed in Shopify's strategy?"
        : newComp === "HubSpot"
        ? "How has HubSpot's enterprise and pricing strategy evolved?"
        : newComp === "Slack"
        ? "What products and AI features did Slack prioritize recently?"
        : newComp === "Notion"
        ? "How has Notion evolved its positioning and AI packaging?"
        : `What changed in ${newComp}'s strategy?`;
    setQuestion(defaultQ);
  };

  const handleQuestionChange = (newQ: string) => {
    setQuestion(newQ);
  };

  const handleAnalyze = () => {
    runAnalysis(competitor, question);
  };

  const handleSelectFromHistory = (item: HistoryItem) => {
    setCompetitor(item.competitor);
    setQuestion(item.question);
    setResult(item.response);
    setHasSubmitted(true);
    setActiveTab("dashboard");
  };

  const handleSelectFromInsightsView = (newComp: string, promptQ: string) => {
    setCompetitor(newComp);
    setQuestion(promptQ);
    setActiveTab("dashboard");
    runAnalysis(newComp, promptQ);
  };

  const handleLoadSeededArchive = (targetComp: string) => {
    setCompetitor(targetComp);
    const defaultQ = SEEDED_ARCHIVES[targetComp]?.question || `What changed in ${targetComp}'s strategy?`;
    setQuestion(defaultQ);
    setActiveTab("dashboard");
    runAnalysis(targetComp, defaultQ, true);
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
          {/* SECTION 2 & 3: Hero Section with Centered Chatbox & Agent Workspace */}
          <HeroSection
            competitor={competitor}
            onCompetitorChange={handleCompetitorChange}
            question={question}
            onQuestionChange={handleQuestionChange}
            onAnalyze={handleAnalyze}
            loading={loading}
            attachments={attachments}
            onAddAttachment={handleAddAttachment}
            onRemoveAttachment={handleRemoveAttachment}
            enableWebSearch={enableWebSearch}
            onToggleWebSearch={setEnableWebSearch}
          />

          {/* SECTION 4: Intelligence Results (Shown ONLY AFTER user submits question) */}
          {hasSubmitted && (
            <main
              ref={resultsRef}
              id="intelligence-results"
              className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-8 py-12 pb-24 space-y-10 scroll-mt-6 animate-in fade-in duration-500"
            >
              {/* Error Banner with Explicit Pre-Seeded Option (Phase 3 requirement) */}
              {errorMsg && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 text-sm font-mono space-y-3">
                  <div className="flex items-center gap-2 text-rose-800 font-bold">
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                    <span>PIPELINE ALERT: {errorMsg.code || "REQUEST FAILED"}</span>
                  </div>
                  <p className="text-xs text-rose-700 leading-relaxed">
                    {errorMsg.message}
                  </p>

                  {SEEDED_ARCHIVES[competitor] && (
                    <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between flex-wrap gap-3">
                      <span className="text-xs text-rose-900 font-medium font-sans">
                        Would you like to inspect the pre-seeded benchmark memory archive for {competitor}?
                      </span>
                      <button
                        type="button"
                        onClick={() => handleLoadSeededArchive(competitor)}
                        className="px-4 py-2 rounded-lg bg-[#071824] hover:bg-black text-white text-xs font-mono font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Load Seeded Archive &rarr;
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Agent Active Thinking & Loading State */}
              {loading && (
                <div className="space-y-6">
                  <AgentActivity
                    competitor={competitor}
                    files={attachments}
                    isComplete={false}
                    enableWebSearch={enableWebSearch}
                  />
                  <LoadingState competitor={competitor} />
                </div>
              )}

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
                    status={result.status}
                    confidence={result.insight.confidence}
                    hasPriorObservation={result.hasPriorObservation}
                    attachments={attachments}
                    agentExecution={result.agentExecution}
                  />
                </div>
              )}
            </main>
          )}
        </>
      )}

      {/* TAB 2: HISTORY (Phase 12: REAL HISTORY) */}
      {activeTab === "history" && (
        <main className="flex-1 max-w-[1240px] w-full mx-auto px-4 sm:px-8 py-8 pb-24">
          <HistoryView
            onSelectHistoryItem={handleSelectFromHistory}
            onLoadSeededBenchmark={handleLoadSeededArchive}
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
