import { IntelligenceEvidence } from "@/lib/api";

interface StrategyTimelineProps {
  evidence: IntelligenceEvidence[];
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  product: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-600" },
  pricing: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-600" },
  messaging: { bg: "bg-purple-50", text: "text-purple-700", dot: "bg-purple-600" },
  enterprise: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-600" },
  packaging: { bg: "bg-indigo-50", text: "text-indigo-700", dot: "bg-indigo-600" },
  partnership: { bg: "bg-cyan-50", text: "text-cyan-700", dot: "bg-cyan-600" },
  hiring: { bg: "bg-rose-50", text: "text-rose-700", dot: "bg-rose-600" },
  other: { bg: "bg-zinc-50", text: "text-zinc-700", dot: "bg-zinc-600" },
};

function formatShortDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split("-");
    if (!month || !day) return dateStr;
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const mIdx = parseInt(month, 10) - 1;
    return `${months[mIdx] || month} ${day}`;
  } catch {
    return dateStr;
  }
}

export function StrategyTimeline({ evidence }: StrategyTimelineProps) {
  if (!evidence || evidence.length === 0) return null;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-zinc-900"></span>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 font-mono">
            Strategy Evolution Timeline
          </h3>
        </div>
        <span className="text-[11px] font-mono text-zinc-400">
          {evidence.length} sequential memory milestones
        </span>
      </div>

      {/* Horizontal timeline view on md+, clean scrollable on smaller screens */}
      <div className="overflow-x-auto pb-3 pt-2">
        <div className="min-w-[640px] relative px-4">
          {/* Connecting line */}
          <div className="absolute top-5 left-8 right-8 h-0.5 bg-zinc-200 -z-0"></div>

          <div className="flex items-start justify-between relative z-10">
            {evidence.map((item, idx) => {
              const catKey = (item.category || "other").toLowerCase();
              const style = CATEGORY_COLORS[catKey] || CATEGORY_COLORS.other;
              const shortDate = formatShortDate(item.date);

              return (
                <div
                  key={idx}
                  className="flex flex-col items-center text-center max-w-[120px] group"
                >
                  {/* Date badge */}
                  <span className="text-[11px] font-mono font-medium text-zinc-500 mb-1.5">
                    {shortDate}
                  </span>

                  {/* Marker node */}
                  <div
                    className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-110 ${style.bg} ${style.dot}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-white"></span>
                  </div>

                  {/* Category Pill */}
                  <span
                    className={`mt-2 text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-semibold ${style.bg} ${style.text}`}
                  >
                    {item.category}
                  </span>

                  {/* Event snippet */}
                  <p className="mt-1.5 text-[11px] text-zinc-600 line-clamp-2 leading-tight">
                    {item.event}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
