"use client";

interface NavbarProps {
  activeTab: "dashboard" | "competitors" | "insights";
  onTabChange: (tab: "dashboard" | "competitors" | "insights") => void;
  onOpenSettings: () => void;
  onOpenAddEvent?: () => void;
}

export function Navbar({ activeTab, onTabChange, onOpenSettings, onOpenAddEvent }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 h-[58px] bg-[rgba(247,249,255,0.85)] backdrop-blur-xl border-b border-[#DDE3F5] transition-all">
      <div className="max-w-[1360px] mx-auto h-full px-4 sm:px-8 lg:px-12 flex items-center justify-between">
        
        {/* Brand: CIA Agent with Hindsight Visual Styling */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer group select-none" 
          onClick={() => onTabChange("dashboard")}
        >
          {/* Hexagonal Hindsight / CIA Mark */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg className="w-7 h-8 drop-shadow-sm group-hover:scale-105 transition-transform" viewBox="0 0 40 44" fill="none">
              <polygon 
                points="20,4 36,13 36,31 20,40 4,31 4,13" 
                fill="#4338F0" 
                stroke="#4338F0" 
                strokeWidth="4" 
                strokeLinejoin="round"
              />
              <polygon 
                points="20,12 29,17 29,27 20,32 11,27 11,17" 
                fill="none" 
                stroke="#ffffff" 
                strokeWidth="3.5" 
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-heading font-extrabold text-[#0B0D24] text-lg tracking-[-0.02em]">
              CIA
            </span>
            <span className="text-[10px] font-heading font-bold uppercase px-2 py-0.5 rounded-full bg-[#EEF1FB] text-[#4338F0] border border-[#DDE3F5]">
              Hindsight
            </span>
          </div>
        </div>

        {/* Center: Segmented Navigation Pills */}
        <nav className="flex items-center p-0.5 rounded-full bg-[#EEF1FB]/80 border border-[#DDE3F5] shadow-xs">
          <button
            type="button"
            onClick={() => onTabChange("dashboard")}
            className={`px-3.5 py-1 rounded-full text-xs font-heading font-semibold transition-all cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-white text-[#4338F0] shadow-[0_4px_12px_rgba(67,56,240,0.12)] border border-[#DDE3F5]"
                : "text-[#3F4463] hover:text-[#4338F0]"
            }`}
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => onTabChange("competitors")}
            className={`px-3.5 py-1 rounded-full text-xs font-heading font-semibold transition-all cursor-pointer ${
              activeTab === "competitors"
                ? "bg-white text-[#4338F0] shadow-[0_4px_12px_rgba(67,56,240,0.12)] border border-[#DDE3F5]"
                : "text-[#3F4463] hover:text-[#4338F0]"
            }`}
          >
            History
          </button>
          <button
            type="button"
            onClick={() => onTabChange("insights")}
            className={`px-3.5 py-1 rounded-full text-xs font-heading font-semibold transition-all cursor-pointer ${
              activeTab === "insights"
                ? "bg-white text-[#4338F0] shadow-[0_4px_12px_rgba(67,56,240,0.12)] border border-[#DDE3F5]"
                : "text-[#3F4463] hover:text-[#4338F0]"
            }`}
          >
            Insights
          </button>
        </nav>

        {/* Right: Status Pill & Actions */}
        <div className="flex items-center gap-3 sm:gap-3.5">
          {/* Memory Active Live Pulse Indicator */}
          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DDF8EE] border border-[#19C08B]/30 text-[#0D8F66] text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#19C08B] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#19C08B]"></span>
            </span>
            <span>MEMORY ACTIVE</span>
          </div>

          {/* Quick Add Event (if handler provided) */}
          {onOpenAddEvent && (
            <button
              type="button"
              onClick={onOpenAddEvent}
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#DDE3F5] bg-white hover:border-[#4338F0]/40 text-[#0B0D24] text-xs font-heading font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
            >
              <span>+ Log Event</span>
            </button>
          )}

          {/* Settings / Config Button */}
          <button
            type="button"
            onClick={onOpenSettings}
            title="Intelligence Settings"
            className="w-9 h-9 rounded-xl border border-[#DDE3F5] bg-white hover:bg-[#EEF1FB] hover:border-[#4338F0]/40 flex items-center justify-center text-[#3F4463] hover:text-[#4338F0] transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>
        </div>

      </div>
    </header>
  );
}
