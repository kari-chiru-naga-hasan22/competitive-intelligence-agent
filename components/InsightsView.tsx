interface InsightsViewProps {
  onAnalyzeCompetitor: (competitor: string, question: string) => void;
}

export function InsightsView({ onAnalyzeCompetitor }: InsightsViewProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="pb-5 border-b border-[#DDD8CE] space-y-1">
        <p className="text-xs font-mono font-bold text-[#C6A15B] uppercase tracking-widest">
          CROSS-ENTITY ANALYSIS
        </p>
        <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#071824] tracking-tight uppercase">
          Cross-Competitor Market Signals
        </h2>
        <p className="text-xs text-[#687078] font-light">
          Longitudinal strategic patterns synthesized across the 90-day observation window
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Signal 1: AI Race */}
        <div className="bg-white border border-[#DDD8CE] rounded-2xl p-6 sm:p-7 shadow-sm space-y-4 hover:border-[#C6A15B] hover:shadow-md transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-[#DDD8CE]/60">
            <span className="text-xs font-mono font-bold uppercase text-[#8C6D2C] bg-[#C6A15B]/15 border border-[#C6A15B]/30 px-2 py-0.5 rounded">
              MARKET THEME
            </span>
            <span className="text-[11px] font-mono text-[#687078]">All 3 Competitors</span>
          </div>

          <h3 className="font-serif text-xl font-light text-[#071824] uppercase">
            The AI-First Repositioning Wave
          </h3>

          <p className="text-xs text-[#2B3540] leading-relaxed font-light">
            Every tracked competitor shifted core positioning to include AI between July and August. Acme launched an AI assistant, Nimbus deployed automated anomaly detection, and Vertex introduced automated vertical dashboards.
          </p>

          <button
            type="button"
            onClick={() => onAnalyzeCompetitor("Acme Cloud", "How has AI repositioning changed Acme Cloud's market strategy?")}
            className="text-xs font-semibold text-[#071824] hover:text-[#C6A15B] uppercase tracking-wider pt-2 block cursor-pointer transition-colors font-mono"
          >
            Probe Acme AI Strategy &rarr;
          </button>
        </div>

        {/* Signal 2: Enterprise Barricades */}
        <div className="bg-white border border-[#DDD8CE] rounded-2xl p-6 sm:p-7 shadow-sm space-y-4 hover:border-[#C6A15B] hover:shadow-md transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-[#DDD8CE]/60">
            <span className="text-xs font-mono font-bold uppercase text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              GO-TO-MARKET
            </span>
            <span className="text-[11px] font-mono text-[#687078]">Nimbus &bull; Vertex</span>
          </div>

          <h3 className="font-serif text-xl font-light text-[#071824] uppercase">
            Upmarket Enterprise Consolidation
          </h3>

          <p className="text-xs text-[#2B3540] leading-relaxed font-light">
            While Acme lowered Pro pricing ($49 to $39), Nimbus and Vertex actively fortified upmarket tiers with dedicated customer success managers and enterprise sales expansion.
          </p>

          <button
            type="button"
            onClick={() => onAnalyzeCompetitor("Nimbus Analytics", "What is Nimbus Analytics' enterprise and AI strategy?")}
            className="text-xs font-semibold text-[#071824] hover:text-[#C6A15B] uppercase tracking-wider pt-2 block cursor-pointer transition-colors font-mono"
          >
            Probe Nimbus Strategy &rarr;
          </button>
        </div>

        {/* Signal 3: Pricing Experimentation */}
        <div className="bg-white border border-[#DDD8CE] rounded-2xl p-6 sm:p-7 shadow-sm space-y-4 hover:border-[#C6A15B] hover:shadow-md transition-all">
          <div className="flex items-center justify-between pb-3 border-b border-[#DDD8CE]/60">
            <span className="text-xs font-mono font-bold uppercase text-[#8C6D2C] bg-[#C6A15B]/15 border border-[#C6A15B]/30 px-2 py-0.5 rounded">
              MONETIZATION
            </span>
            <span className="text-[11px] font-mono text-[#687078]">Acme &bull; Vertex</span>
          </div>

          <h3 className="font-serif text-xl font-light text-[#071824] uppercase">
            Self-Serve Land &amp; Expand Squeeze
          </h3>

          <p className="text-xs text-[#2B3540] leading-relaxed font-light">
            Both Acme and Vertex introduced lower-friction pricing tiers (Acme $39 price point and Vertex self-service workspace starter packages) to capture early user intent.
          </p>

          <button
            type="button"
            onClick={() => onAnalyzeCompetitor("Vertex Data", "How has Vertex Data positioned its products and pricing?")}
            className="text-xs font-semibold text-[#071824] hover:text-[#C6A15B] uppercase tracking-wider pt-2 block cursor-pointer transition-colors font-mono"
          >
            Probe Vertex Strategy &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}
