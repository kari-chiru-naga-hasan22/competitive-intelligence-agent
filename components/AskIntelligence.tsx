interface AskIntelligenceProps {
  competitor: string;
  question: string;
  onQuestionChange: (q: string) => void;
  onAnalyze: () => void;
  loading: boolean;
}

const SUGGESTIONS: Record<string, { label: string; query: string }[]> = {
  "Acme Cloud": [
    { label: "Pricing changes", query: "What are Acme Cloud's recent pricing and packaging changes?" },
    { label: "Product strategy", query: "How has Acme Cloud evolved its core product and AI assistant features?" },
    { label: "Messaging evolution", query: "How has Acme Cloud's positioning and messaging shifted toward AI?" },
    { label: "Enterprise strategy", query: "What enterprise security and access capabilities has Acme Cloud introduced?" },
  ],
  "Nimbus Analytics": [
    { label: "Enterprise strategy", query: "What is Nimbus Analytics' enterprise and customer success strategy?" },
    { label: "Product strategy", query: "How has Nimbus Analytics expanded anomaly detection and reporting?" },
    { label: "Messaging evolution", query: "How is Nimbus positioning itself around trusted enterprise AI?" },
    { label: "Partnerships", query: "What partnerships has Nimbus announced for external business data?" },
  ],
  "Vertex Data": [
    { label: "Pricing changes", query: "How has Vertex Data structured its starter package and pricing?" },
    { label: "Product strategy", query: "What self-service workspace features has Vertex Data released?" },
    { label: "Messaging evolution", query: "How has Vertex Data emphasized deployment speed and time to value?" },
    { label: "Enterprise hiring", query: "What hiring moves indicate Vertex Data is scaling upmarket sales?" },
  ],
};

export function AskIntelligence({
  competitor,
  question,
  onQuestionChange,
  onAnalyze,
  loading,
}: AskIntelligenceProps) {
  const currentSuggestions = SUGGESTIONS[competitor] || SUGGESTIONS["Acme Cloud"];

  const handleSuggestionClick = (query: string) => {
    onQuestionChange(query);
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#0F172A] font-mono">
          ASK ABOUT {competitor.toUpperCase()}
        </h3>
        <span className="text-[11px] font-mono text-slate-400">
          Persistent Memory + Gemini Reasoning
        </span>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <textarea
            rows={2}
            value={question}
            disabled={loading}
            onChange={(e) => onQuestionChange(e.target.value)}
            placeholder={`How has ${competitor}'s strategy changed over the last 90 days?`}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-[#0F172A] transition-all resize-none font-medium"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          {/* Suggested Questions Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-400 font-medium mr-1">
              Try asking:
            </span>
            {currentSuggestions.map((item) => (
              <button
                key={item.label}
                type="button"
                disabled={loading}
                onClick={() => handleSuggestionClick(item.query)}
                className="text-xs bg-slate-100 hover:bg-slate-200/80 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/70 transition-all font-medium cursor-pointer"
              >
                [ {item.label} ]
              </button>
            ))}
          </div>

          {/* Analyze Button */}
          <button
            type="button"
            disabled={loading || !question.trim()}
            onClick={onAnalyze}
            className={`inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F172A] hover:bg-black text-white px-6 py-2.5 text-sm font-semibold transition-all shadow-xs shrink-0 cursor-pointer ${
              loading || !question.trim() ? "opacity-60 cursor-not-allowed" : "active:scale-[0.98]"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Analyzing Strategy...</span>
              </>
            ) : (
              <>
                <span>Analyze Strategy</span>
                <span className="font-mono text-slate-300">→</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
