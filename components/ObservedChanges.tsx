import { IntelligenceEvidence } from "@/lib/api";

interface ObservedChangesProps {
  evidence: IntelligenceEvidence[];
  observedChanges: string[];
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

export function ObservedChanges({ evidence }: ObservedChangesProps) {
  if (!evidence || evidence.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-mono">
            OBSERVED CHANGES
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified chronological events recalled from persistent memory
          </p>
        </div>
        <span className="text-[11px] font-mono text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded">
          GROUNDED EVIDENCE
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {evidence.map((item, idx) => {
          const indexNumber = (idx + 1).toString().padStart(2, "0");
          const shortDate = formatShortDate(item.date);
          const catKey = (item.category || "product").toLowerCase();
          const badgeClass = CATEGORY_BADGES[catKey] || CATEGORY_BADGES.product;

          return (
            <div
              key={idx}
              className="py-4 first:pt-2 last:pb-2 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-sm group"
            >
              <div className="flex items-start gap-4">
                {/* Index number */}
                <span className="font-mono text-xs font-bold text-slate-400 w-6 shrink-0 pt-0.5">
                  {indexNumber}
                </span>

                <div className="space-y-1.5">
                  {/* Subtle category badge */}
                  <span
                    className={`inline-block text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-0.5 rounded border ${badgeClass}`}
                  >
                    {item.category}
                  </span>

                  {/* Event text */}
                  <p className="text-sm font-medium text-[#0F172A] leading-snug">
                    {item.event}
                  </p>
                </div>
              </div>

              {/* Date & Source Metadata */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1 shrink-0 pl-10 sm:pl-4 text-xs font-mono text-slate-500">
                <span className="font-bold text-[#0F172A] sm:text-right">
                  {shortDate}
                </span>
                <span className="text-[11px] text-slate-400 sm:text-right">
                  {item.source || "Company website"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
