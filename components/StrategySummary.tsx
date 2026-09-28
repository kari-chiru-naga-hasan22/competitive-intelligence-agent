interface StrategySummaryProps {
  summary: string;
  strategicSignal: string;
  competitor: string;
}

export function StrategySummary({
  summary,
  strategicSignal,
  competitor,
}: StrategySummaryProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Strategic Summary */}
      <div className="lg:col-span-7 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 font-mono">
                Strategic Summary
              </h3>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">
              Synthesized Pattern
            </span>
          </div>

          <p className="text-sm leading-relaxed text-zinc-700">
            {summary}
          </p>
        </div>

        <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <span>Target: {competitor}</span>
          <span>Temporal Analysis</span>
        </div>
      </div>

      {/* Strategic Signal */}
      <div className="lg:col-span-5 rounded-2xl border border-zinc-900 bg-zinc-950 p-6 shadow-xs text-white flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200 font-mono">
                Strategic Signal
              </h3>
            </div>
            <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded uppercase">
              Inference
            </span>
          </div>

          <blockquote className="text-sm leading-relaxed text-zinc-200 italic border-l-2 border-emerald-500 pl-3 my-2">
            &ldquo;{strategicSignal}&rdquo;
          </blockquote>
        </div>

        <p className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400 font-mono">
          Derived from temporal multi-event correlation.
        </p>
      </div>
    </div>
  );
}
