interface LoadingStateProps {
  competitor: string;
}

export function LoadingState({ competitor }: LoadingStateProps) {
  return (
    <div className="bg-white border border-[#DDD8CE] rounded-2xl p-10 shadow-lg relative overflow-hidden max-w-2xl mx-auto">
      <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-5">
        {/* Pulsing Intelligence Indicator */}
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-[#F7F4ED] border border-[#DDD8CE]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C6A15B] animate-ping [animation-delay:-0.3s]"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#C6A15B] animate-ping [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 rounded-full bg-[#C6A15B] animate-ping"></span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#C6A15B]/15 border border-[#C6A15B]/30 text-[11px] font-mono font-bold text-[#8C6D2C]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B] animate-pulse"></span>
            NEURAL MEMORY RECALL IN PROGRESS
          </div>

          <h3 className="font-serif text-2xl font-light text-[#071824] tracking-tight uppercase">
            Analyzing {competitor}...
          </h3>

          <p className="text-xs text-[#2B3540] leading-relaxed font-light">
            Recalling longitudinal observations from Vectorize Hindsight memory bank and synthesizing strategic signals.
          </p>
        </div>

        <div className="w-full bg-[#F4F0E8] rounded-full h-1.5 overflow-hidden border border-[#DDD8CE]/60">
          <div className="bg-[#C6A15B] h-full w-2/3 rounded-full animate-pulse shadow-xs"></div>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono text-[#687078] pt-1">
          <span className="flex items-center gap-1.5 text-[#182027]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            Hindsight Memory Recall
          </span>
          <span className="text-[#DDD8CE]">&bull;</span>
          <span className="flex items-center gap-1.5 text-[#182027]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B]"></span>
            Gemini Reflection
          </span>
        </div>
      </div>
    </div>
  );
}
