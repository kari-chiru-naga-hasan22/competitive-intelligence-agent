"use client";

import { useState } from "react";
import { checkDiagnostics } from "@/lib/api";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    gemini?: { status: string; message: string };
    hindsight?: { status: string; message: string };
  } | null>(null);

  if (!isOpen) return null;

  const handleRunDiagnostics = async () => {
    setLoading(true);
    const diag = await checkDiagnostics();
    setResults(diag);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] font-mono">
              SYSTEM CONFIGURATION & DIAGNOSTICS
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify connection to Vectorize Hindsight and Google Gemini
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-sm">
          {/* Service 1: Hindsight */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-[#0F172A]">Vectorize Hindsight</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                  Memory Bank: competitive-intelligence
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Temporal recall engine for chronological competitor events.
              </p>
            </div>
            {results?.hindsight && (
              <span
                className={`text-xs font-mono font-bold px-2 py-1 rounded ${
                  results.hindsight.status === "connected"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {results.hindsight.status.toUpperCase()}
              </span>
            )}
          </div>

          {/* Service 2: Gemini */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-[#0F172A]">Google Gemini</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                  Model: gemini-3.8-flash / 3.7-flash
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Strategic reasoning and event normalization engine.
              </p>
            </div>
            {results?.gemini && (
              <span
                className={`text-xs font-mono font-bold px-2 py-1 rounded ${
                  results.gemini.status === "connected"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
              >
                {results.gemini.status.toUpperCase()}
              </span>
            )}
          </div>

          {results && (
            <div className="p-3 rounded-lg bg-slate-100 text-xs font-mono text-slate-700 space-y-1">
              <div>Hindsight Message: {results.hindsight?.message || "N/A"}</div>
              <div>Gemini Message: {results.gemini?.message || "N/A"}</div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            type="button"
            disabled={loading}
            onClick={handleRunDiagnostics}
            className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-[#0F172A] rounded-lg transition-colors cursor-pointer border border-slate-200"
          >
            {loading ? "Testing APIs..." : "Run Live Diagnostics"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-[#0F172A] text-white rounded-lg hover:bg-black transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
