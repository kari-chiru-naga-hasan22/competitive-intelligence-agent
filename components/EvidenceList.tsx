import { IntelligenceEvidence } from "@/lib/api";

interface EvidenceListProps {
  observedChanges: string[];
  evidence: IntelligenceEvidence[];
}

const CATEGORY_STYLES: Record<string, string> = {
  product: "bg-blue-50 text-blue-700 border-blue-200",
  pricing: "bg-amber-50 text-amber-700 border-amber-200",
  messaging: "bg-purple-50 text-purple-700 border-purple-200",
  enterprise: "bg-emerald-50 text-emerald-700 border-emerald-200",
  packaging: "bg-indigo-50 text-indigo-700 border-indigo-200",
  partnership: "bg-cyan-50 text-cyan-700 border-cyan-200",
  hiring: "bg-rose-50 text-rose-700 border-rose-200",
  other: "bg-zinc-50 text-zinc-700 border-zinc-200",
};

export function EvidenceList({ observedChanges, evidence }: EvidenceListProps) {
  // Map evidence items for rich display
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 font-mono">
            What Changed (Verified Historical Moves)
          </h3>
        </div>
        <span className="text-[11px] font-mono text-zinc-400">
          Directly grounded in memory
        </span>
      </div>

      <div className="divide-y divide-zinc-100">
        {evidence && evidence.length > 0
          ? evidence.map((item, idx) => {
              const catKey = (item.category || "other").toLowerCase();
              const badgeStyle = CATEGORY_STYLES[catKey] || CATEGORY_STYLES.other;

              return (
                <div
                  key={idx}
                  className="py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 text-sm"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`text-[10px] uppercase font-mono font-semibold px-2 py-0.5 rounded border ${badgeStyle} shrink-0 mt-0.5`}
                    >
                      {item.category}
                    </span>
                    <span className="text-zinc-800 leading-snug">
                      {item.event}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 sm:pl-4">
                    <span className="text-xs font-mono text-zinc-400">
                      {item.date}
                    </span>
                    {item.source && (
                      <span className="text-[10px] text-zinc-400 bg-zinc-50 border border-zinc-200 px-1.5 py-0.5 rounded font-mono">
                        {item.source}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          : observedChanges.map((change, idx) => (
              <div key={idx} className="py-2.5 flex items-start gap-2 text-sm text-zinc-800">
                <span className="text-zinc-400 mt-1">•</span>
                <span>{change}</span>
              </div>
            ))}
      </div>
    </div>
  );
}
