interface WatchNextProps {
  watchNext: string[];
  competitor: string;
}

export function WatchNext({ watchNext, competitor }: WatchNextProps) {
  if (!watchNext || watchNext.length === 0) return null;

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 font-mono">
            Watch Next (Future Strategic Indicators)
          </h3>
        </div>
        <span className="text-[11px] font-mono text-zinc-400">
          Proactive monitoring cues
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {watchNext.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-xl border border-zinc-200/80 bg-zinc-50/60 flex items-start gap-2.5"
          >
            <span className="text-xs font-mono font-bold text-zinc-400 mt-0.5">
              0{idx + 1}
            </span>
            <p className="text-xs text-zinc-700 leading-relaxed">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
