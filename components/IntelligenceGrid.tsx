interface IntelligenceGridProps {
  summary: string;
  strategicSignal: string;
  observedChanges: string[];
  watchNext: string[];
  competitor: string;
}

export function IntelligenceGrid({
  summary,
  strategicSignal,
  observedChanges,
  watchNext,
}: IntelligenceGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 1. Top-Left: STRATEGIC SUMMARY */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
        <div>
          <div className="pb-3.5 mb-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-mono">
              STRATEGIC SUMMARY
            </h3>
          </div>

          <p className="text-[14px] leading-relaxed text-slate-700 font-normal">
            {summary}
          </p>
        </div>
      </div>

      {/* 2. Top-Right: STRATEGIC SIGNAL */}
      <div className="bg-white border border-slate-900 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
        <div>
          <div className="pb-3.5 mb-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-mono">
              STRATEGIC SIGNAL
            </h3>
            <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold border border-slate-200">
              SIGNAL
            </span>
          </div>

          <blockquote className="text-[15px] font-medium leading-relaxed text-[#0F172A] border-l-2 border-[#0F172A] pl-4 py-1 italic">
            &ldquo;{strategicSignal}&rdquo;
          </blockquote>
        </div>
      </div>

      {/* 3. Bottom-Left: OBSERVED CHANGES */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
        <div>
          <div className="pb-3.5 mb-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-mono">
              OBSERVED CHANGES
            </h3>
          </div>

          <div className="space-y-3">
            {observedChanges.map((change, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="text-slate-900 font-bold mt-0.5 select-none font-mono">✓</span>
                <span className="leading-snug">{change}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Bottom-Right: WHAT TO WATCH NEXT */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col justify-between">
        <div>
          <div className="pb-3.5 mb-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-mono">
              WHAT TO WATCH NEXT
            </h3>
          </div>

          <div className="space-y-3">
            {watchNext.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="text-slate-900 font-bold mt-0.5 select-none font-mono">→</span>
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
