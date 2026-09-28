"use client";

import { useState } from "react";
import { ingestEvent, IngestEventResponse } from "@/lib/api";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventAdded: (competitor: string) => void;
  defaultCompetitor?: string;
}

export function AddEventModal({
  isOpen,
  onClose,
  onEventAdded,
  defaultCompetitor = "Acme Cloud",
}: AddEventModalProps) {
  const [competitor, setCompetitor] = useState(defaultCompetitor);
  const [eventText, setEventText] = useState("");
  const [category, setCategory] = useState("product");
  const [source, setSource] = useState("Company website");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<IngestEventResponse | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!competitor.trim() || !eventText.trim()) return;

    setSubmitting(true);
    setResult(null);

    const res = await ingestEvent({
      competitor,
      event: eventText,
      category,
      source,
      date,
    });

    setSubmitting(false);
    setResult(res);

    if (res.success) {
      setTimeout(() => {
        onEventAdded(competitor);
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 relative animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] font-mono">
              INGEST COMPETITOR EVENT
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Normalizes via Gemini and stores in Hindsight memory bank
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Target Company
            </label>
            <input
              type="text"
              required
              list="competitor-presets"
              value={competitor}
              onChange={(e) => setCompetitor(e.target.value)}
              placeholder="E.g. Acme Cloud, Shopify, HubSpot..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            <datalist id="competitor-presets">
              <option value="Acme Cloud" />
              <option value="Nimbus Analytics" />
              <option value="Vertex Data" />
              <option value="Shopify" />
              <option value="HubSpot" />
              <option value="Slack" />
              <option value="Notion" />
            </datalist>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Event Description
            </label>
            <textarea
              rows={2}
              required
              value={eventText}
              onChange={(e) => setEventText(e.target.value)}
              placeholder="E.g. Launched new usage-based pricing tier for high-volume enterprise users..."
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 resize-none font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="product">Product</option>
                <option value="pricing">Pricing</option>
                <option value="messaging">Messaging</option>
                <option value="enterprise">Enterprise</option>
                <option value="packaging">Packaging</option>
                <option value="partnership">Partnership</option>
                <option value="hiring">Hiring</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Event Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Source
            </label>
            <input
              type="text"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="E.g. Company announcement / Pricing page"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          {result && (
            <div
              className={`p-3 rounded-lg text-xs font-mono ${
                result.success
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              {result.success
                ? "✓ Event successfully normalized & stored in Hindsight memory!"
                : `Error: ${result.error || "Ingestion failed"}`}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-semibold bg-[#0F172A] hover:bg-black text-white rounded-lg transition-colors cursor-pointer"
            >
              {submitting ? "Ingesting..." : "Ingest Event →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
