"use client";

import React, { useEffect, useRef, useState } from "react";

export function IntelligenceProcessVisual() {
  const stageRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const parRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Viewport-aware intelligence flow animation state
  const [inView, setInView] = useState(false);
  const [activeStep, setActiveStep] = useState(1); // 1: DISCOVER, 2: RETAIN, 3: RECALL, 4: REASON
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Viewport intersection observer: start when visible, pause when leaving, restart from DISCOVER when re-entering
  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          setActiveStep(1); // restart from DISCOVER
        } else {
          setInView(false); // pause
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 3-second continuous intelligence-flow cycle:
  // DISCOVER (3s) -> RETAIN (3s) -> RECALL (3s) -> REASON (3s) -> repeat
  useEffect(() => {
    if (!inView || reducedMotion) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev >= 4 ? 1 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [inView, reducedMotion]);

  // Subtle mouse-based 3D tilt
  useEffect(() => {
    if (reducedMotion) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return;
      targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    const updateParallax = () => {
      currentX += (targetX - currentX) * 0.07;
      currentY += (targetY - currentY) * 0.07;

      if (stackRef.current) {
        stackRef.current.style.transform = `perspective(1600px) rotateX(${(-currentY * 1.5).toFixed(3)}deg) rotateY(${(currentX * 2.0).toFixed(3)}deg)`;
      }

      parRefs.current.forEach((el) => {
        if (!el) return;
        const depth = parseFloat(el.getAttribute("data-d") || "0.5");
        el.style.transform = `translate3d(${(-currentX * 6 * depth).toFixed(2)}px, ${(-currentY * 4.5 * depth).toFixed(2)}px, 0)`;
      });

      animId = requestAnimationFrame(updateParallax);
    };

    animId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [reducedMotion]);

  return (
    <div 
      ref={stageRef}
      className="relative w-full max-w-[430px] sm:max-w-[460px] lg:max-w-[390px] xl:max-w-[450px] 2xl:max-w-[490px] h-[250px] xs:h-[275px] sm:h-[310px] md:h-[340px] lg:h-[330px] xl:h-[365px] 2xl:h-[395px] flex items-center justify-center lg:justify-end select-none overflow-visible"
    >
      {/* Scaled Visual Stage — Index1 Light Glass Palette (approx 20-25% larger cards) */}
      <div className="relative w-[840px] h-[660px] scale-[0.39] xs:scale-[0.43] sm:scale-[0.48] md:scale-[0.53] lg:scale-[0.52] xl:scale-[0.58] 2xl:scale-[0.63] origin-center lg:origin-right flex-shrink-0">
        
        <div 
          ref={stackRef} 
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{ transformOrigin: "420px 330px" }}
        >
          {/* LAYER 0: Ambient Luminous Glow & Blobs */}
          <div 
            ref={(el) => { parRefs.current[0] = el; }} 
            data-d="0.15" 
            className="absolute inset-0 pointer-events-none will-change-transform"
          >
            {/* Primary Indigo/Lavender Radial Core */}
            <div className="absolute left-[280px] top-[100px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(closest-side,rgba(90,100,255,0.18),transparent)] blur-2xl pointer-events-none" />
            <div className="absolute left-[80px] top-[280px] w-[420px] h-[360px] rounded-full bg-[radial-gradient(closest-side,rgba(196,186,255,0.55),transparent)] blur-2xl pointer-events-none" />
          </div>

          {/* LAYER 1: Floating Translucent Slabs / Drift Plates */}
          <div 
            ref={(el) => { parRefs.current[1] = el; }} 
            data-d="0.3" 
            className="absolute inset-0 pointer-events-none will-change-transform"
          >
            <div 
              className="absolute left-[300px] top-[50px] w-[300px] h-[150px] rounded-[36px] vis-slab-light [animation:vis-drift_12s_ease-in-out_infinite]" 
            />
            <div 
              className="absolute left-[190px] top-[220px] w-[320px] h-[240px] rounded-[36px] vis-slab-light [animation:vis-drift_14s_ease-in-out_-4s_infinite]" 
            />
            <div 
              className="absolute left-[480px] top-[60px] w-[240px] h-[260px] rounded-[36px] vis-slab-light [animation:vis-drift_10s_ease-in-out_-2s_infinite] opacity-60" 
            />
          </div>

          {/* LAYER 2: CARD 1 — DISCOVER: Signals Found */}
          <div 
            ref={(el) => { parRefs.current[2] = el; }} 
            data-d="0.5" 
            className="absolute inset-0 pointer-events-none will-change-transform z-10"
          >
            <div className="absolute inset-0 [animation:vis-enter_0.95s_cubic-bezier(0.2,0.8,0.2,1)_both] [animation-delay:0.2s]">
              {/* Ghost plate */}
              <div 
                className="absolute [animation:vis-fg_7.4s_ease-in-out_-2s_infinite]"
                style={{ inset: 0 }}
              >
                <div 
                  className="vis-gh-light absolute left-[432px] top-[55px] w-[385px] h-[140px] rounded-[24px]" 
                />
              </div>

              {/* Foreground Card */}
              <div 
                className="absolute [animation:vis-fl_6.5s_ease-in-out_-1s_infinite]"
                style={{ inset: 0 }}
              >
                <div 
                  className={`vis-card-light absolute left-[400px] top-[35px] w-[385px] h-[140px] rounded-[24px] flex items-center gap-6 px-7 cursor-default group transition-all duration-500 ease-out ${
                    activeStep === 1
                      ? "border-[#4338F0]/40 ring-2 ring-[#4338F0]/20 shadow-[0_24px_50px_rgba(67,56,240,0.22)] scale-[1.025] z-30"
                      : "hover:border-[#4338F0]/30"
                  }`}
                >
                  {/* Tile / Icon (Blue / Indigo Theme) */}
                  <div className={`w-[76px] h-[76px] rounded-[20px] flex items-center justify-center flex-shrink-0 transition-all duration-500 bg-[#E6EAFB] border border-[#DDE3F5] ${
                    activeStep === 1
                      ? "shadow-[0_4px_16px_rgba(67,56,240,0.25)] border-[#4338F0]/40"
                      : ""
                  }`}>
                    <svg 
                      className={`w-10 h-10 text-[#4338F0] transition-transform duration-500 ${activeStep === 1 ? "scale-110" : ""} [animation:vis-spin_10s_linear_infinite]`} 
                      viewBox="0 0 48 48" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="4" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M9 22a15 15 0 0 1 26-8" />
                      <path d="M35 5v10H25" />
                      <path d="M39 26a15 15 0 0 1-26 8" />
                      <path d="M13 43V33h10" />
                    </svg>
                  </div>

                  {/* Text Description */}
                  <div className="flex flex-col">
                    <small className="flex items-center gap-2 font-heading text-[12px] font-bold uppercase tracking-[0.1em] text-[#6B7190] mb-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full bg-[#4338F0] ${activeStep === 1 ? "animate-ping" : ""}`} />
                      STAGE 1 &bull; DISCOVER
                    </small>
                    <b className="text-[#0B0D24] font-heading text-[21px] font-extrabold tracking-[-0.015em] leading-snug whitespace-nowrap">
                      Signal Found
                    </b>
                    <em className="text-[#7A7F99] not-italic text-[14px] font-normal mt-0.5">
                      27 competitor signals
                    </em>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LAYER 3: CARD 2 — RETAIN: Memory Updated */}
          <div 
            ref={(el) => { parRefs.current[3] = el; }} 
            data-d="0.7" 
            className="absolute inset-0 pointer-events-none will-change-transform z-20"
          >
            <div className="absolute inset-0 [animation:vis-enter_0.95s_cubic-bezier(0.2,0.8,0.2,1)_both] [animation-delay:0.35s]">
              {/* Ghost plate */}
              <div 
                className="absolute [animation:vis-fg_8s_ease-in-out_-4s_infinite]"
                style={{ inset: 0 }}
              >
                <div 
                  className="vis-gh-light absolute left-[322px] top-[200px] w-[375px] h-[140px] rounded-[24px]" 
                />
              </div>

              {/* Foreground Card */}
              <div 
                className="absolute [animation:vis-fl_7.2s_ease-in-out_-3s_infinite]"
                style={{ inset: 0 }}
              >
                <div 
                  className={`vis-card-light absolute left-[290px] top-[180px] w-[375px] h-[140px] rounded-[24px] flex items-center gap-6 px-7 cursor-default group transition-all duration-500 ease-out ${
                    activeStep === 2
                      ? "border-[#19C08B]/50 ring-2 ring-[#19C08B]/20 shadow-[0_24px_50px_rgba(25,192,139,0.22)] scale-[1.025] z-30"
                      : "hover:border-[#19C08B]/30"
                  }`}
                >
                  {/* Tile / Icon (Mint Theme) */}
                  <div className={`w-[76px] h-[76px] rounded-[20px] flex items-center justify-center flex-shrink-0 transition-all duration-500 bg-[#DDF8EE] border border-[#BCEEDA] ${
                    activeStep === 2
                      ? "shadow-[0_4px_16px_rgba(25,192,139,0.25)] border-[#19C08B]/50"
                      : ""
                  }`}>
                    <svg 
                      className={`w-10 h-10 text-[#19C08B] transition-transform duration-500 ${activeStep === 2 ? "scale-110" : ""}`} 
                      viewBox="0 0 48 48" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="4" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <rect x="8" y="9" width="32" height="34" rx="7" />
                      <rect x="17" y="4" width="14" height="8" rx="3" fill="#DDF8EE" />
                      <path 
                        className="[animation:vis-ck_6s_ease-in-out_infinite]"
                        strokeDasharray="30"
                        stroke="#19C08B" 
                        strokeWidth="4" 
                        d="M16 27l6 6 11-12" 
                      />
                    </svg>
                  </div>

                  {/* Text Description */}
                  <div className="flex flex-col">
                    <small className="flex items-center gap-2 font-heading text-[12px] font-bold uppercase tracking-[0.1em] text-[#6B7190] mb-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full bg-[#19C08B] ${activeStep === 2 ? "animate-ping" : ""}`} />
                      STAGE 2 &bull; RETAIN
                    </small>
                    <b className="text-[#0B0D24] font-heading text-[21px] font-extrabold tracking-[-0.015em] leading-snug whitespace-nowrap">
                      Memory Updated
                    </b>
                    <em className="text-[#7A7F99] not-italic text-[14px] font-normal mt-0.5">
                      15 observations retained
                    </em>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LAYER 4: CARD 3 — RECALL: History Retrieved */}
          <div 
            ref={(el) => { parRefs.current[4] = el; }} 
            data-d="0.9" 
            className="absolute inset-0 pointer-events-none will-change-transform z-30"
          >
            <div className="absolute inset-0 [animation:vis-enter_0.95s_cubic-bezier(0.2,0.8,0.2,1)_both] [animation-delay:0.5s]">
              {/* Ghost plate */}
              <div 
                className="absolute [animation:vis-fg_7s_ease-in-out_-1.5s_infinite]"
                style={{ inset: 0 }}
              >
                <div 
                  className="vis-gh-light absolute left-[212px] top-[345px] w-[380px] h-[140px] rounded-[24px]" 
                />
              </div>

              {/* Foreground Card */}
              <div 
                className="absolute [animation:vis-fl_7.8s_ease-in-out_-5s_infinite]"
                style={{ inset: 0 }}
              >
                <div 
                  className={`vis-card-light absolute left-[180px] top-[325px] w-[380px] h-[140px] rounded-[24px] flex items-center gap-6 px-7 cursor-default group transition-all duration-500 ease-out ${
                    activeStep === 3
                      ? "border-[#F59A2A]/50 ring-2 ring-[#F59A2A]/20 shadow-[0_24px_50px_rgba(245,154,42,0.22)] scale-[1.025] z-30"
                      : "hover:border-[#F59A2A]/30"
                  }`}
                >
                  {/* Tile / Icon (Amber / Orange Theme) */}
                  <div className={`w-[76px] h-[76px] rounded-[20px] flex items-center justify-center flex-shrink-0 transition-all duration-500 bg-[#FFF0DD] border border-[#FADBB3] ${
                    activeStep === 3
                      ? "shadow-[0_4px_16px_rgba(245,154,42,0.25)] border-[#F59A2A]/50"
                      : ""
                  }`}>
                    <svg 
                      className={`w-10 h-10 transition-transform duration-500 ${activeStep === 3 ? "scale-110" : ""}`} 
                      viewBox="0 0 48 48" 
                      fill="#F59A2A"
                    >
                      <rect 
                        className="[animation:vis-bar_2.8s_ease-in-out_infinite] origin-[50%_100%]"
                        style={{ animationDelay: "-0.4s" }}
                        x="8" 
                        y="22" 
                        width="8" 
                        height="20" 
                        rx="3" 
                        fill="#F59A2A"
                        opacity="0.6"
                      />
                      <rect 
                        className="[animation:vis-bar_2.8s_ease-in-out_infinite] origin-[50%_100%]"
                        style={{ animationDelay: "-1.2s" }}
                        x="20" 
                        y="8" 
                        width="8" 
                        height="34" 
                        rx="3" 
                        fill="#F59A2A"
                      />
                      <rect 
                        className="[animation:vis-bar_2.8s_ease-in-out_infinite] origin-[50%_100%]"
                        style={{ animationDelay: "-2.0s" }}
                        x="32" 
                        y="16" 
                        width="8" 
                        height="26" 
                        rx="3" 
                        fill="#E68A1A"
                      />
                    </svg>
                  </div>

                  {/* Text Description */}
                  <div className="flex flex-col">
                    <small className="flex items-center gap-2 font-heading text-[12px] font-bold uppercase tracking-[0.1em] text-[#6B7190] mb-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full bg-[#F59A2A] ${activeStep === 3 ? "animate-ping" : ""}`} />
                      STAGE 3 &bull; RECALL
                    </small>
                    <b className="text-[#0B0D24] font-heading text-[21px] font-extrabold tracking-[-0.015em] leading-snug whitespace-nowrap">
                      History Retrieved
                    </b>
                    <em className="text-[#7A7F99] not-italic text-[14px] font-normal mt-0.5">
                      5 relevant signals
                    </em>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* LAYER 5: CARD 4 — REASON: Strategy Detected */}
          <div 
            ref={(el) => { parRefs.current[5] = el; }} 
            data-d="1.1" 
            className="absolute inset-0 pointer-events-none will-change-transform z-40"
          >
            <div className="absolute inset-0 [animation:vis-enter_0.95s_cubic-bezier(0.2,0.8,0.2,1)_both] [animation-delay:0.65s]">
              {/* Ghost plate */}
              <div 
                className="absolute [animation:vis-fg_8.4s_ease-in-out_-3s_infinite]"
                style={{ inset: 0 }}
              >
                <div 
                  className="vis-gh-light absolute left-[102px] top-[490px] w-[390px] h-[140px] rounded-[24px]" 
                />
              </div>

              {/* Foreground Card */}
              <div 
                className="absolute [animation:vis-fl_6.9s_ease-in-out_-2.5s_infinite]"
                style={{ inset: 0 }}
              >
                <div 
                  className={`vis-card-light absolute left-[70px] top-[470px] w-[390px] h-[140px] rounded-[24px] flex items-center gap-6 px-7 cursor-default group transition-all duration-500 ease-out ${
                    activeStep === 4
                      ? "border-[#7C5CF0]/50 ring-2 ring-[#7C5CF0]/20 shadow-[0_24px_50px_rgba(124,92,240,0.22)] scale-[1.025] z-30"
                      : "hover:border-[#7C5CF0]/30"
                  }`}
                >
                  {/* Tile / Icon (Purple Theme) */}
                  <div className={`w-[76px] h-[76px] rounded-[20px] flex items-center justify-center flex-shrink-0 transition-all duration-500 bg-[#EDE8FF] border border-[#D5C7FC] ${
                    activeStep === 4
                      ? "shadow-[0_4px_16px_rgba(124,92,240,0.25)] border-[#7C5CF0]/50"
                      : ""
                  }`}>
                    <svg 
                      className={`w-10 h-10 text-[#7C5CF0] transition-transform duration-500 ${activeStep === 4 ? "scale-110" : ""} [animation:vis-spin_8s_linear_infinite]`} 
                      viewBox="0 0 48 48" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="4" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M9 22a15 15 0 0 1 26-8" />
                      <path d="M35 5v10H25" />
                      <path d="M39 26a15 15 0 0 1-26 8" />
                      <path d="M13 43V33h10" />
                    </svg>
                  </div>

                  {/* Text Description */}
                  <div className="flex flex-col">
                    <small className="flex items-center gap-2 font-heading text-[12px] font-bold uppercase tracking-[0.1em] text-[#6B7190] mb-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full bg-[#7C5CF0] ${activeStep === 4 ? "animate-ping" : ""}`} />
                      STAGE 4 &bull; REASON
                    </small>
                    <b className="text-[#0B0D24] font-heading text-[20px] font-extrabold tracking-[-0.015em] leading-snug whitespace-nowrap">
                      Strategy Detected
                    </b>
                    <em className="text-[#7A7F99] not-italic text-[14px] font-normal mt-0.5 flex items-center gap-1.5">
                      <span>3 recurring patterns</span>
                      <span className="text-[#7C5CF0] font-semibold text-xs">(grounded)</span>
                    </em>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
