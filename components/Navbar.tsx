interface NavbarProps {
  activeTab: "dashboard" | "competitors" | "insights";
  onTabChange: (tab: "dashboard" | "competitors" | "insights") => void;
  onOpenSettings: () => void;
  onOpenAddEvent?: () => void;
}

export function Navbar({ activeTab, onTabChange, onOpenSettings }: NavbarProps) {
  return (
    <nav className="h-16 bg-black border-b border-white/[0.08] sticky top-0 z-40 transition-all">
      <div className="max-w-[1240px] mx-auto h-full px-4 sm:px-8 flex items-center justify-between">
        
        {/* Brand: CIA with Custom Designed Logo */}
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => onTabChange("dashboard")}>
          <div className="relative w-8 h-8 flex items-center justify-center">
            <img
              src="/cia-logo.png"
              alt="CIA Logo"
              className="w-8 h-8 object-contain drop-shadow-[0_0_12px_rgba(255,160,0,0.5)] group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-white text-base tracking-[0.24em] uppercase select-none">
              CIA
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B] shadow-[0_0_8px_#C6A15B]"></span>
          </div>
        </div>

        {/* Center: Sleek Segmented Pill Navigation */}
        <div className="hidden md:flex items-center p-1 rounded-full bg-white/[0.05] border border-white/10 backdrop-blur-md">
          <button
            type="button"
            onClick={() => onTabChange("dashboard")}
            className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                : "text-white/60 hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => onTabChange("competitors")}
            className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "competitors"
                ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                : "text-white/60 hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            History
          </button>
          <button
            type="button"
            onClick={() => onTabChange("insights")}
            className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "insights"
                ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                : "text-white/60 hover:text-white hover:bg-white/[0.06]"
            }`}
          >
            Insights
          </button>
        </div>

        {/* Right: Gold Status Node + Settings */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Active Intelligence Indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/90 font-mono text-[11px] tracking-wider uppercase select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C6A15B] shadow-[0_0_8px_#C6A15B] animate-pulse"></span>
            <span className="text-white/50">SYSTEM:</span>
            <span className="text-[#C6A15B] font-semibold">ACTIVE</span>
          </div>

          {/* Settings Button */}
          <button
            type="button"
            onClick={onOpenSettings}
            title="Intelligence Settings"
            className="w-9 h-9 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/15 hover:border-white/30 flex items-center justify-center text-white/80 hover:text-white transition-all cursor-pointer shadow-xs active:scale-95"
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
    </nav>
  );
}
