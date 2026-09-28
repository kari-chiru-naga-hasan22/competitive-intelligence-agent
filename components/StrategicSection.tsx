interface StrategicSectionProps {
  summary: string;
  strategicSignal: string;
  competitor: string;
}

export function StrategicSection({
  summary,
  strategicSignal,
  competitor,
}: StrategicSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left: Strategic Summary */}
      <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0F172A]"></span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-mono">
                STRATEGIC SUMMARY
              </h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Pattern Synthesized
            </span>
          </div>

          <p className="text-[15px] leading-relaxed text-slate-700 font-normal">
            {summary}
          </p>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Scope: 90-day trajectory</span>
          <span className="text-slate-800 font-semibold">{competitor}</span>
        </div>
      </div>

      {/* Right: Strategic Signal */}
      <div className="lg:col-span-5 bg-white border border-slate-900 rounded-2xl p-6 sm:p-7 shadow-[0_4px_25px_rgba(0,0,0,0.05)] flex flex-col justify-between relative overflow-hidden">
        <div>
          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-sm">⚡</span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-mono">
                STRATEGIC SIGNAL
              </h3>
            </div>
            <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold border border-slate-200">
              AI INFERENCE
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold font-mono mb-2.5 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Pattern detected
          </div>

          <blockquote className="text-[14px] leading-relaxed text-[#0F172A] italic border-l-2 border-[#0F172A] pl-3.5 py-1">
            &ldquo;{strategicSignal}&rdquo;
          </blockquote>
        </div>

        <p className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
          * Strategic inference based on sequential competitor actions.
        </p>
      </div>
    </div>
  );
}
