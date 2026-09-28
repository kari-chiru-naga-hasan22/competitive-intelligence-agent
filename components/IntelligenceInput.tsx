interface IntelligenceInputProps {
  question: string;
  onChange: (q: string) => void;
  onSubmit: () => void;
  loading: boolean;
  competitor: string;
}

const PRESETS: Record<string, string[]> = {
  "Acme Cloud": [
    "How has Acme Cloud's strategy changed over the last 90 days?",
    "What are Acme Cloud's recent pricing and packaging moves?",
    "How is Acme Cloud positioning its AI features?",
  ],
  "Nimbus Analytics": [
    "What is Nimbus Analytics' enterprise and AI strategy?",
    "How is Nimbus differentiating from competitors?",
    "What partnership and product moves has Nimbus made?",
  ],
  "Vertex Data": [
    "How has Vertex Data positioned its products and pricing?",
    "What signals indicate Vertex Data is expanding upmarket?",
    "How has Vertex Data's messaging evolved?",
  ],
};

export function IntelligenceInput({
  question,
  onChange,
  onSubmit,
  loading,
  competitor,
}: IntelligenceInputProps) {
  const currentPresets = PRESETS[competitor] || PRESETS["Acme Cloud"];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label
          htmlFor="intel-question"
          className="text-xs font-semibold uppercase tracking-wider text-zinc-500 font-mono"
        >
          Ask the Intelligence Agent
        </label>
        <span className="text-[11px] text-zinc-400 font-mono">
          Recalls historical memory & reasons
        </span>
      </div>

      <div className="relative rounded-xl border border-zinc-200 bg-white p-2.5 focus-within:border-zinc-900 focus-within:ring-1 focus-within:ring-zinc-900 transition-all shadow-xs">
        <textarea
          id="intel-question"
          rows={2}
          value={question}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`E.g. How has ${competitor}'s strategy changed over the last 90 days?`}
          disabled={loading}
          className="w-full resize-none bg-transparent px-2 py-1 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none"
        />

        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 mt-1">
          <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
            <span>Press Analyze to synthesize</span>
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={loading || !question.trim()}
            className={`inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition-all shadow-sm ${
              loading || !question.trim()
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-zinc-800 active:scale-[0.98] cursor-pointer"
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-3.5 w-3.5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
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
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <span>Analyze Intelligence</span>
                <span className="font-mono text-zinc-400">→</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preset prompt pills */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] font-mono text-zinc-400 mr-1">
          Quick queries:
        </span>
        {currentPresets.map((preset) => (
          <button
            key={preset}
            type="button"
            disabled={loading}
            onClick={() => onChange(preset)}
            className="text-[11px] bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 px-2.5 py-1 rounded-full transition-colors font-sans cursor-pointer text-left"
          >
            {preset}
          </button>
        ))}
      </div>
    </div>
  );
}
