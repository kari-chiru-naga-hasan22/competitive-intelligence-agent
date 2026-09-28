interface CompetitorSelectorProps {
  selected: string;
  onSelect: (competitor: string) => void;
  disabled?: boolean;
}

const COMPETITORS = [
  {
    name: "Acme Cloud",
    badge: "5 Events Tracked",
    description: "Cloud analytics assistant, usage pricing, security package",
  },
  {
    name: "Nimbus Analytics",
    badge: "5 Events Tracked",
    description: "Enterprise AI, executive reporting, anomaly detection",
  },
  {
    name: "Vertex Data",
    badge: "5 Events Tracked",
    description: "Self-service PLG, starter packages, sales team expansion",
  },
];

export function CompetitorSelector({
  selected,
  onSelect,
  disabled,
}: CompetitorSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono">
        Target Competitor
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {COMPETITORS.map((comp) => {
          const isSelected = selected === comp.name;
          return (
            <button
              key={comp.name}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(comp.name)}
              className={`p-3.5 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? "border-zinc-900 bg-white ring-1 ring-zinc-900 shadow-sm"
                  : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50/50"
              } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`font-semibold text-sm ${
                    isSelected ? "text-zinc-950" : "text-zinc-700"
                  }`}
                >
                  {comp.name}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 font-medium">
                  {comp.badge}
                </span>
              </div>
              <p className="text-xs text-zinc-500 line-clamp-1">
                {comp.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
