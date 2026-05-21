"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ServiceWorkspace from "@/components/ServiceWorkspace";
import PromptOpsCenter from "@/components/PromptOpsCenter";
import EvalSuite from "@/components/EvalSuite";
import GovernanceDashboard from "@/components/GovernanceDashboard";
import { MessageSquare, Settings2, FlaskConical, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/cn";

const TABS = [
  { id: "workspace", label: "AI Service Workspace", icon: MessageSquare },
  { id: "prompts", label: "Prompt Ops Center", icon: Settings2 },
  { id: "eval", label: "Evaluation Suite", icon: FlaskConical },
  { id: "governance", label: "Governance & Observability", icon: ShieldCheck },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("workspace");

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />

      {/* Tab Bar — yellow active underline, DeVry blue active text */}
      <div className="bg-white border-b border-gray-200 flex-none">
        <div className="flex overflow-x-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap",
                  isActive
                    ? "text-[#0033E1] border-[#FFD200] bg-[#e8eeff]"
                    : "text-gray-500 border-transparent hover:text-[#0033E1] hover:bg-[#e8eeff]"
                )}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "workspace" && <ServiceWorkspace />}
        {activeTab === "prompts" && <PromptOpsCenter />}
        {activeTab === "eval" && <EvalSuite />}
        {activeTab === "governance" && <GovernanceDashboard />}
      </div>
    </div>
  );
}
