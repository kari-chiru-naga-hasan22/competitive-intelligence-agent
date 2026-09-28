import { IntelligenceEvidence } from "@/lib/api";

interface EvidenceSectionProps {
  evidence: IntelligenceEvidence[];
}

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

const CATEGORY_BADGES: Record<string, string> = {
  product: "bg-slate-100 text-slate-800 border-slate-200",
  pricing: "bg-amber-50 text-amber-800 border-amber-200/80",
  messaging: "bg-indigo-50 text-indigo-800 border-indigo-200/80",
  enterprise: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
  packaging: "bg-purple-50 text-purple-800 border-purple-200/80",
  partnership: "bg-teal-50 text-teal-800 border-teal-200/80",
  hiring: "bg-rose-50 text-rose-800 border-rose-200/80",
};

export function EvidenceSection({ evidence }: EvidenceSectionProps) {
  if (!evidence || evidence.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-mono">
            EVIDENCE CITATIONS
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified competitor events from 90-day window
          </p>
        </div>
        <span className="text-xs font-mono text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded">
          {evidence.length} verified records
        </span>
      </div>

      <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl overflow-hidden">
        {evidence.map((item, idx) => {
          const shortDate = formatShortDate(item.date);
          const catKey = (item.category || "product").toLowerCase();
          const badgeClass = CATEGORY_BADGES[catKey] || CATEGORY_BADGES.product;

          return (
            <div
              key={idx}
              className="p-4 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 text-sm"
            >
              <div className="flex items-start gap-4">
                {/* Date */}
                <span className="font-mono text-xs font-bold text-[#0F172A] w-14 shrink-0 pt-0.5">
                  {shortDate}
                </span>

                <div className="space-y-1">
                  {/* Category Pill */}
                  <span
                    className={`inline-block text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${badgeClass}`}
                  >
                    {item.category}
                  </span>

                  {/* Event Text */}
                  <p className="text-sm font-medium text-[#0F172A] leading-snug">
                    {item.event}
                  </p>
                </div>
              </div>

              {/* Source Tag */}
              <div className="shrink-0 pl-18 sm:pl-4 text-xs font-mono text-slate-400">
                <span>Source: {item.source || "Company website"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
