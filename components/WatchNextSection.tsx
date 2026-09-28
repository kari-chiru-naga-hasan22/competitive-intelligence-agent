interface WatchNextSectionProps {
  watchNext: string[];
  competitor: string;
}

export function WatchNextSection({
  watchNext,
  competitor,
}: WatchNextSectionProps) {
  if (!watchNext || watchNext.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-4">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-base text-slate-700">👁</span>
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-mono">
            WHAT TO WATCH NEXT
          </h2>
        </div>
        <span className="text-[11px] font-mono text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-full">
          FORWARD RADAR
        </span>
      </div>

      <div className="space-y-3 pt-1">
        {watchNext.map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/80 text-sm text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all group"
          >
            <span className="text-[#0F172A] font-bold text-sm select-none font-mono group-hover:translate-x-0.5 transition-transform">
              →
            </span>
            <span className="leading-relaxed font-medium text-slate-800">
              {item}
            </span>
          </div>
        ))}
      </div>

      <div className="pt-2 text-right">
        <span className="text-[11px] font-mono text-slate-400">
          Continuous radar monitoring suggested for {competitor}
        </span>
      </div>
    </div>
  );
}
