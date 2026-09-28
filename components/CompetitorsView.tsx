"use client";

import { useState, useMemo } from "react";
import competitorsData from "@/data/competitors.json";

interface CompetitorsViewProps {
  onSelectCompetitor: (competitor: string) => void;
  onOpenAddEvent: () => void;
}

interface StoredEvent {
  competitor: string;
  date: string;
  category: string;
  event: string;
  source: string;
}

const COMPETITOR_DATA = [
  {
    name: "Acme Cloud",
    category: "Cloud Analytics & Security",
    eventsCount: 15,
    lastUpdate: "Sep 27, 2026",
    summary: "Shifted toward AI-first analytics, advanced security package, and aggressive usage-based pricing ($49 → $39).",
    status: "Active Monitoring",
    keyMove: "Pro Plan price cut to $39/mo",
    color: "#E6EAFB",
    iconColor: "#4338F0",
  },
  {
    name: "Nimbus Analytics",
    category: "Enterprise BI & Governance",
    eventsCount: 15,
    lastUpdate: "Sep 26, 2026",
    summary: "Positioned around trusted enterprise AI, automated anomaly detection, and external business data integration partnerships.",
    status: "Active Monitoring",
    keyMove: "Strategic integration partnership",
    color: "#DDF8EE",
    iconColor: "#19C08B",
  },
  {
    name: "Vertex Data",
    category: "PLG & Data Infrastructure",
    eventsCount: 15,
    lastUpdate: "Sep 27, 2026",
    summary: "Self-service workspaces and lower-cost starter tiers feeding into a rapidly expanding outbound enterprise sales organization.",
    status: "Active Monitoring",
    keyMove: "Enterprise sales team expansion",
    color: "#FFF0DD",
    iconColor: "#F59A2A",
  },
  {
    name: "Shopify",
    category: "E-Commerce & Retail",
    eventsCount: 15,
    lastUpdate: "Sep 27, 2026",
    summary: "Expanding unified B2B commerce, embedding Sidekick conversational AI merchant tools, and adjusting enterprise Plus contracts.",
    status: "Active Monitoring",
    keyMove: "Unified B2B wholesale platform launch",
    color: "#E8F5E9",
    iconColor: "#2E7D32",
  },
  {
    name: "HubSpot",
    category: "CRM & Customer Platform",
    eventsCount: 15,
    lastUpdate: "Sep 26, 2026",
    summary: "Transitioned to seat-based pricing with zero seat minimums, deployed Breeze AI agents, and integrated Breeze Intelligence enrichment.",
    status: "Active Monitoring",
    keyMove: "Seat-based pricing overhaul & Breeze AI",
    color: "#FFF3E0",
    iconColor: "#E65100",
  },
  {
    name: "Slack",
    category: "Workplace Collaboration",
    eventsCount: 15,
    lastUpdate: "Sep 27, 2026",
    summary: "Evolving into a conversational AI agent hub with Slack Lists, $10/user AI add-on tier, and Salesforce Agentforce integration.",
    status: "Active Monitoring",
    keyMove: "Salesforce Agentforce & Slack Lists",
    color: "#F3E5F5",
    iconColor: "#7B1FA2",
  },
  {
    name: "Notion",
    category: "Connected Workspace",
    eventsCount: 15,
    lastUpdate: "Sep 28, 2026",
    summary: "Integrating cross-tool Enterprise Search connectors, Notion Calendar, Custom AI Agents, and API credit-based compute tiers.",
    status: "Active Monitoring",
    keyMove: "Enterprise Search connectors & Custom Agents",
    color: "#EDE7F6",
    iconColor: "#512DA8",
  },
];

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  pricing: { bg: "bg-[#FEF3C7]", text: "text-[#B45309]", border: "border-[#FDE68A]" },
  product: { bg: "bg-[#EEF1FB]", text: "text-[#4338F0]", border: "border-[#DDE3F5]" },
  enterprise: { bg: "bg-[#D1FAE5]", text: "text-[#047857]", border: "border-[#A7F3D0]" },
  messaging: { bg: "bg-[#EDE9FE]", text: "text-[#6D28D9]", border: "border-[#DDD6FE]" },
  partnership: { bg: "bg-[#E0F2FE]", text: "text-[#0369A1]", border: "border-[#BAE6FD]" },
  hiring: { bg: "bg-[#FFE4E6]", text: "text-[#BE123C]", border: "border-[#FECDD3]" },
};

export function CompetitorsView({
  onSelectCompetitor,
  onOpenAddEvent,
}: CompetitorsViewProps) {
  const [expandedComp, setExpandedComp] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const typedEvents = competitorsData as StoredEvent[];

  const filteredCompetitors = useMemo(() => {
    return COMPETITOR_DATA.filter((comp) => {
      const matchesSearch =
        comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comp.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [searchQuery]);

  const getEventsForCompetitor = (name: string) => {
    return typedEvents
      .filter((e) => e.competitor.toLowerCase() === name.toLowerCase())
      .filter((e) => (selectedCategory === "all" ? true : e.category === selectedCategory))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#DDE3F5] gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="eb">
              <i></i>
              <span>Entity Registry &bull; Longitudinal Memory Bank</span>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B0D24] tracking-tight">
            Tracked Competitors
          </h2>
          <p className="text-sm text-[#7A7F99]">
            Active competitor memory files, chronological timeline streams, and historical intelligence
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenAddEvent}
            className="self-start sm:self-auto px-5 py-2.5 text-xs font-semibold uppercase tracking-wider bg-gradient-to-b from-[#4B41F4] to-[#3F35EB] hover:-translate-y-0.5 text-white rounded-xl transition-all shadow-[0_8px_20px_rgba(67,56,240,0.25)] cursor-pointer flex items-center gap-2"
          >
            <span>+ Add Historical Event</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-white/70 border border-[#DDE3F5]">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search competitor, capability, or strategy..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 text-xs font-medium bg-[#F7F9FF] border border-[#DDE3F5] rounded-xl text-[#0B0D24] placeholder-[#7A7F99] focus:outline-none focus:border-[#4338F0]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold uppercase text-[#7A7F99] mr-1">Filter Events:</span>
          {["all", "pricing", "product", "enterprise", "messaging"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg font-semibold capitalize cursor-pointer transition-all ${
                selectedCategory === cat
                  ? "bg-[#4338F0] text-white"
                  : "bg-[#EEF1FB] text-[#3F4463] hover:text-[#4338F0]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Competitor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompetitors.map((comp) => {
          const isExpanded = expandedComp === comp.name;
          const events = getEventsForCompetitor(comp.name);

          return (
            <div
              key={comp.name}
              className={`gl p-6 sm:p-7 shadow-[0_16px_36px_rgba(80,90,220,0.08)] flex flex-col justify-between transition-all space-y-4 ${
                isExpanded ? "md:col-span-2 lg:col-span-3 border-2 border-[#4338F0]/30" : "hover:-translate-y-1"
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[#EEF1FB] mb-3">
                  <span className="text-[11px] font-bold uppercase bg-[#EEF1FB] text-[#4338F0] px-2.5 py-1 rounded-full border border-[#DDE3F5]">
                    {comp.eventsCount} EVENTS STORED IN HINDSIGHT
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#0d8f66] font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#19C08B] animate-pulse"></span>
                    {comp.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold"
                    style={{ background: comp.color, color: comp.iconColor }}
                  >
                    {comp.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-[#0B0D24]">
                      {comp.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#4338F0]">
                      {comp.category}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#3F4463] mt-3 leading-relaxed">
                  {comp.summary}
                </p>

                <div className="mt-4 pt-3 border-t border-[#EEF1FB] text-xs text-[#7A7F99] flex items-center justify-between">
                  <div>
                    <span>Latest move: </span>
                    <span className="font-bold text-[#0B0D24]">{comp.keyMove}</span>
                  </div>
                  <span className="text-[11px] text-[#7A7F99]">{comp.lastUpdate}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => setExpandedComp(isExpanded ? null : comp.name)}
                  className={`flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all text-center cursor-pointer border ${
                    isExpanded
                      ? "bg-[#0B0D24] text-white border-[#0B0D24]"
                      : "bg-white text-[#3F4463] hover:text-[#4338F0] border-[#DDE3F5] hover:border-[#4338F0]"
                  }`}
                >
                  {isExpanded ? "Hide Memory Stream ▲" : `Inspect Memory Bank (${events.length}) ▼`}
                </button>

                <button
                  type="button"
                  onClick={() => onSelectCompetitor(comp.name)}
                  className="flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-[#4338F0] to-[#3B3FF0] hover:from-[#3B3FF0] hover:to-[#312E81] rounded-xl transition-all text-center cursor-pointer shadow-[0_4px_12px_rgba(67,56,240,0.2)]"
                >
                  Synthesize Dossier &rarr;
                </button>
              </div>

              {/* Expanded Longitudinal Memory Timeline */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-[#DDE3F5] space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-heading font-extrabold uppercase text-[#0B0D24] tracking-wider">
                        Longitudinal Observation Log &bull; {comp.name}
                      </span>
                      <span className="text-[10px] font-mono bg-[#EEF1FB] text-[#4338F0] px-2 py-0.5 rounded-full font-bold">
                        {events.length} Records Retrieved
                      </span>
                    </div>
                    <span className="text-xs text-[#7A7F99] italic">
                      Sorted chronologically (July &ndash; September 2026)
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto rounded-xl border border-[#DDE3F5] bg-white divide-y divide-[#EEF1FB]">
                    {events.map((evt, idx) => {
                      const style = CATEGORY_STYLES[evt.category] || {
                        bg: "bg-[#EEF1FB]",
                        text: "text-[#4338F0]",
                        border: "border-[#DDE3F5]",
                      };
                      return (
                        <div key={idx} className="p-3.5 hover:bg-[#F7F9FF] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-start sm:items-center gap-3">
                            <span className="text-[11px] font-mono font-bold text-[#7A7F99] shrink-0 bg-[#F7F9FF] px-2 py-1 rounded border border-[#DDE3F5]">
                              {evt.date}
                            </span>
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border shrink-0 ${style.bg} ${style.text} ${style.border}`}
                            >
                              {evt.category}
                            </span>
                            <p className="text-xs font-semibold text-[#0B0D24]">
                              {evt.event}
                            </p>
                          </div>
                          <span className="text-[11px] text-[#7A7F99] shrink-0 self-end sm:self-auto italic">
                            Source: {evt.source}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#EEF1FB]/60 border border-[#DDE3F5]">
                    <div className="text-xs text-[#3F4463]">
                      <span className="font-bold text-[#4338F0]">Ready for Reasoning:</span> Hindsight uses this chronological stream to contrast prior July baseline with recent September moves.
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectCompetitor(comp.name)}
                      className="px-4 py-1.5 text-xs font-heading font-bold uppercase text-white bg-[#4338F0] hover:bg-[#3730A3] rounded-lg transition-colors cursor-pointer"
                    >
                      Run Intelligence Synthesis &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
