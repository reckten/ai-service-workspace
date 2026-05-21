"use client";

import { promptRegistry } from "@/data/prompts";
import { Shield, Zap } from "lucide-react";

/** DeVry shield-book logomark — simplified SVG recreation */
function DeVryLogoMark({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shield background (blue) */}
      <rect width="36" height="36" rx="6" fill="#0033E1" />
      {/* Dark navy left panel */}
      <path d="M8 8 L18 8 L18 26 L11 30 L8 28 Z" fill="#001C8C" opacity="0.85" />
      {/* Medium blue center-left panel */}
      <path d="M18 8 L18 26 L13 29 L11 28 L18 26 Z" fill="#4d6ee8" opacity="0.7" />
      {/* White center-right panel */}
      <path d="M18 8 L26 10 L26 25 L18 26 Z" fill="white" opacity="0.9" />
      {/* Yellow gold right panel */}
      <path d="M26 10 L28 12 L28 27 L22 30 L18 26 L26 25 Z" fill="#FFD200" />
    </svg>
  );
}

export default function Header() {
  const activePrompt = promptRegistry.find((p) => p.status === "deployed");

  return (
    <header className="bg-[#0033E1] text-white flex-none">
      {/* Yellow accent stripe at top */}
      <div className="h-0.5 bg-[#FFD200]" />

      <div className="flex items-center justify-between px-5 h-13 py-2">
        {/* Logo + Wordmark */}
        <div className="flex items-center gap-3">
          <DeVryLogoMark size={34} />
          <div className="flex flex-col">
            <span className="text-white font-black text-sm tracking-tight leading-none">DeVry University</span>
            <span className="text-blue-200 text-xs font-medium tracking-widest uppercase leading-none mt-0.5">
              AI Operations Workspace
            </span>
          </div>
        </div>

        {/* Center: status pills */}
        <div className="hidden md:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 bg-[#001C8C] px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-blue-100">Student Services · {activePrompt?.version ?? "v2.0"} deployed</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#001C8C] px-3 py-1.5 rounded-full">
            <Shield size={10} className="text-blue-300" />
            <span className="text-blue-100">Safety: {activePrompt?.safetyProfile ?? "elevated"}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#001C8C] px-3 py-1.5 rounded-full">
            <Zap size={10} className="text-blue-300" />
            <span className="text-blue-100">gpt-4o-mini · OpenRouter</span>
          </div>
        </div>

        {/* Right: env badge with yellow accent */}
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full border border-[#FFD200] text-[#FFD200] font-mono font-semibold tracking-wide">
            prototype
          </span>
        </div>
      </div>
    </header>
  );
}
