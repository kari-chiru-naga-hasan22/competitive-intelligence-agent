"use client";

import { useEffect, useState } from "react";
import { getHistoryItems, clearHistoryItems, deleteHistoryItem, HistoryItem, IntelligenceResponse } from "@/lib/api";

interface HistoryViewProps {
  onSelectHistoryItem: (item: HistoryItem) => void;
  onLoadSeededBenchmark: (competitor: string) => void;
}

export function HistoryView({ onSelectHistoryItem, onLoadSeededBenchmark }: HistoryViewProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(getHistoryItems());
  }, []);

  const handleClear = () => {
    if (confirm("Clear all recorded intelligence history?")) {
      clearHistoryItems();
      setHistory([]);
    }
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteHistoryItem(id);
    setHistory(updated);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#DDD8CE] gap-3">
        <div className="space-y-1">
          <p className="text-xs font-mono font-bold text-[#C6A15B] uppercase tracking-widest">
            TEMPORAL INTELLIGENCE LOG
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#071824] tracking-tight uppercase">
            Analysis History
          </h2>
          <p className="text-xs text-[#687078] font-light">
            Chronological audit log of synthesized competitor intelligence questions and strategic conclusions
          </p>
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="self-start sm:self-auto px-4 py-2 text-xs font-mono text-[#888888] hover:text-rose-600 border border-[#DDD8CE] hover:border-rose-300 rounded-lg transition-colors cursor-pointer"
          >
            Clear Log
          </button>
        )}
      </div>

      {/* History Feed */}
      {history.length === 0 ? (
        <div className="bg-white border border-[#DDD8CE] rounded-2xl p-10 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#F7F4ED] border border-[#DDD8CE] flex items-center justify-center mx-auto text-[#C6A15B]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="font-mono font-bold text-sm text-[#071824] uppercase tracking-wider">
              No Previous Analyses on Record
            </h3>
            <p className="text-xs text-[#687078] mt-1 max-w-md mx-auto">
              Run an intelligence query on the Dashboard or explore a pre-seeded benchmark memory archive below.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => onLoadSeededBenchmark("Acme Cloud")}
              className="px-4 py-2 rounded-lg bg-[#071824] text-white text-xs font-mono font-semibold uppercase tracking-wider hover:bg-[#132c3f] transition-colors cursor-pointer"
            >
              Inspect Acme Cloud Benchmark &rarr;
            </button>
            <button
              type="button"
              onClick={() => onLoadSeededBenchmark("Nimbus Analytics")}
              className="px-4 py-2 rounded-lg border border-[#DDD8CE] bg-white text-[#071824] text-xs font-mono font-semibold uppercase tracking-wider hover:bg-[#F7F4ED] transition-colors cursor-pointer"
            >
              Inspect Nimbus Analytics &rarr;
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectHistoryItem(item)}
              className="bg-white border border-[#DDD8CE] rounded-xl p-5 sm:p-6 shadow-xs hover:border-[#C6A15B] hover:shadow-md transition-all cursor-pointer group space-y-3"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-mono font-bold text-base sm:text-lg text-[#071824] uppercase tracking-tight group-hover:text-[#C6A15B] transition-colors">
                    {item.competitor}
                  </h3>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D97724]"></span>
                  <span className="font-mono text-xs text-[#888888]">
                    {item.timestamp}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`font-mono text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                      item.status === "LIVE"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-[#F7F4ED] text-[#8C6D2C] border-[#DDD8CE]"
                    }`}
                  >
                    {item.status === "LIVE" ? "LIVE INTELLIGENCE" : "SEEDED ARCHIVE"}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(item.id, e)}
                    title="Remove entry"
                    className="text-[#999999] hover:text-rose-600 text-xs p-1"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Question */}
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] font-mono uppercase text-[#C6A15B] font-bold">Query:</span>
                <p className="text-xs sm:text-sm font-sans font-medium text-[#111111]">
                  &ldquo;{item.question}&rdquo;
                </p>
              </div>

              {/* Summary snippet */}
              <p className="text-xs text-[#444444] font-sans leading-relaxed line-clamp-2">
                {item.summary}
              </p>

              <div className="pt-2 flex items-center justify-between text-xs font-mono text-[#C6A15B]">
                <span className="group-hover:translate-x-1 transition-transform inline-block">
                  Reopen Intelligence Dossier &rarr;
                </span>
                <span className="text-[11px] text-[#888888]">
                  {item.response.evidence.length} evidence records
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
