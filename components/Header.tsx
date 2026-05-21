"use client";

import { promptRegistry } from "@/data/prompts";
import { Shield, Zap } from "lucide-react";

export default function Header() {
  const activePrompt = promptRegistry.find((p) => p.status === "deployed");

  return (
    <header className="bg-[#0033E1] text-white flex-none">
      <div className="flex items-center justify-between px-5 h-14">
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="bg-white rounded px-2 py-0.5">
              <span className="text-[#0033E1] font-black text-sm tracking-tight">DeVry</span>
            </div>
            <div className="h-4 w-px bg-blue-400 opacity-50" />
            <span className="text-sm font-semibold text-blue-100 tracking-wide">
              AI Operations Workspace
            </span>
          </div>
        </div>

        {/* Center: Active service info */}
        <div className="hidden md:flex items-center gap-4 text-xs text-blue-200">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Student Services · {activePrompt?.version ?? "v2.0"} deployed</span>
          </div>
          <div className="h-3 w-px bg-blue-500" />
          <div className="flex items-center gap-1">
            <Shield size={11} className="text-blue-300" />
            <span>Safety: {activePrompt?.safetyProfile ?? "elevated"}</span>
          </div>
          <div className="h-3 w-px bg-blue-500" />
          <div className="flex items-center gap-1">
            <Zap size={11} className="text-blue-300" />
            <span>openai/gpt-4o-mini via OpenRouter</span>
          </div>
        </div>

        {/* Right: Environment badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded border border-blue-400 text-blue-200 font-mono">
            prototype
          </span>
        </div>
      </div>
    </header>
  );
}
