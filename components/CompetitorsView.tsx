interface CompetitorsViewProps {
  onSelectCompetitor: (competitor: string) => void;
  onOpenAddEvent: () => void;
}

const COMPETITOR_DATA = [
  {
    name: "Acme Cloud",
    category: "Cloud Analytics & Security",
    eventsCount: 5,
    lastUpdate: "Sep 27, 2026",
    summary: "Shifted toward AI-first analytics, advanced security package, and aggressive usage-based pricing ($49 → $39).",
    status: "Active Monitoring",
    keyMove: "Pro Plan price cut to $39/mo",
  },
  {
    name: "Nimbus Analytics",
    category: "Enterprise AI & Anomaly Detection",
    eventsCount: 5,
    lastUpdate: "Sep 12, 2026",
    summary: "Positioned around trusted enterprise AI, automated anomaly detection, and external business data integration partnerships.",
    status: "Active Monitoring",
    keyMove: "Strategic integration partnership",
  },
  {
    name: "Vertex Data",
    category: "PLG & Vertical Analytics",
    eventsCount: 5,
    lastUpdate: "Sep 15, 2026",
    summary: "Self-service workspaces and lower-cost starter tiers feeding into a rapidly expanding outbound enterprise sales organization.",
    status: "Active Monitoring",
    keyMove: "Enterprise sales team expansion",
  },
];

export function CompetitorsView({
  onSelectCompetitor,
  onOpenAddEvent,
}: CompetitorsViewProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#DDD8CE] gap-3">
        <div className="space-y-1">
          <p className="text-xs font-mono font-bold text-[#C6A15B] uppercase tracking-widest">
            PERSISTENT ENTITY REGISTRY
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#071824] tracking-tight uppercase">
            Tracked Competitors
          </h2>
          <p className="text-xs text-[#687078] font-light">
            Active competitor memory files and chronological event history
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddEvent}
          className="self-start sm:self-auto px-5 py-2.5 text-xs font-medium uppercase tracking-[0.14em] bg-[#071824] hover:bg-[#0c2336] text-white rounded-lg transition-all shadow-md cursor-pointer flex items-center gap-1.5"
        >
          <span>+ Add Event</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COMPETITOR_DATA.map((comp) => (
          <div
            key={comp.name}
            className="bg-white border border-[#DDD8CE] rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col justify-between hover:border-[#C6A15B] hover:shadow-md transition-all space-y-4"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#DDD8CE]/60 mb-3">
                <span className="text-[10px] font-mono font-bold uppercase bg-[#F7F4ED] text-[#8C6D2C] px-2 py-0.5 rounded border border-[#DDD8CE]">
                  {comp.eventsCount} EVENTS STORED
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  {comp.status}
                </span>
              </div>

              <h3 className="font-serif text-xl font-light text-[#071824] uppercase">
                {comp.name}
              </h3>
              <p className="text-xs font-medium text-[#C6A15B] mt-0.5 font-mono">
                {comp.category}
              </p>

              <p className="text-xs text-[#2B3540] mt-3 leading-relaxed font-light">
                {comp.summary}
              </p>

              <div className="mt-4 pt-3 border-t border-[#DDD8CE]/60 text-[11px] text-[#687078]">
                <span>Latest move: </span>
                <span className="font-semibold text-[#071824]">{comp.keyMove}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelectCompetitor(comp.name)}
              className="mt-4 w-full py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-white bg-[#071824] hover:bg-[#0c2336] rounded-lg transition-colors text-center cursor-pointer shadow-xs"
            >
              Analyze in Dashboard &rarr;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
