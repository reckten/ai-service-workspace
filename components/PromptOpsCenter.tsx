"use client";

import { useState } from "react";
import { promptRegistry, PromptVersion } from "@/data/prompts";
import {
  CheckCircle2, Clock, AlertCircle, XCircle, ChevronDown, ChevronUp,
  Edit3, RotateCcw, Rocket, GitBranch, Shield, Target, Layers, Check, X
} from "lucide-react";
import { cn } from "@/lib/cn";

const statusConfig: Record<PromptVersion["status"], { label: string; color: string; bg: string; icon: React.ElementType }> = {
  deployed: { label: "Deployed", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
  staged: { label: "Staged", color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: Clock },
  draft: { label: "Draft", color: "text-gray-600", bg: "bg-gray-50 border-gray-200", icon: Edit3 },
  deprecated: { label: "Deprecated", color: "text-gray-400", bg: "bg-gray-50 border-gray-200", icon: XCircle },
};

const evalConfig = {
  pass: { label: "PASS", color: "text-emerald-600", icon: Check },
  fail: { label: "FAIL", color: "text-red-600", icon: X },
  pending: { label: "Pending", color: "text-amber-600", icon: Clock },
  "not-run": { label: "Not run", color: "text-gray-400", icon: AlertCircle },
};

function StatusBadge({ status }: { status: PromptVersion["status"] }) {
  const cfg = statusConfig[status];
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border", cfg.bg, cfg.color)}>
      <Icon size={10} />
      {cfg.label}
    </span>
  );
}

function EvalBadge({ gate }: { gate: PromptVersion["evaluationGate"] }) {
  const cfg = evalConfig[gate];
  const Icon = cfg.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium", cfg.color)}>
      <Icon size={10} />
      {cfg.label}
    </span>
  );
}

function MetricBar({ value, label }: { value: number; label: string }) {
  const color = value >= 90 ? "bg-emerald-500" : value >= 75 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-xs font-semibold text-gray-700">{value}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function PromptOpsCenter() {
  const [expanded, setExpanded] = useState<string | null>("pv-002");
  const [editing, setEditing] = useState<string | null>(null);
  const [editedPrompt, setEditedPrompt] = useState("");

  function toggleExpand(id: string) {
    setExpanded(expanded === id ? null : id);
  }

  function startEdit(pv: PromptVersion) {
    setEditing(pv.id);
    setEditedPrompt(pv.systemPrompt);
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: Registry */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Prompt Registry</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Deployment target: <span className="font-medium text-gray-700">Student Services</span>
              </p>
            </div>
            <button className="flex items-center gap-2 px-3 py-2 bg-[#f47920] text-white text-sm font-medium rounded-lg hover:bg-[#c45e10] transition-colors">
              <GitBranch size={14} />
              New Version
            </button>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-[80px_1fr_110px_100px_100px_80px] gap-3 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
            <span>Version</span>
            <span>Changelog</span>
            <span>Status</span>
            <span>Regression</span>
            <span>Eval Gate</span>
            <span>Actions</span>
          </div>

          {/* Prompt rows */}
          {[...promptRegistry].reverse().map((pv) => {
            const isExpanded = expanded === pv.id;
            const isEditing = editing === pv.id;
            const isActive = pv.status === "deployed";

            return (
              <div
                key={pv.id}
                className={cn(
                  "rounded-xl border transition-all",
                  isActive ? "border-[#f47920] shadow-sm" : "border-gray-200",
                  isExpanded && "shadow-md"
                )}
              >
                {/* Row */}
                <div
                  className={cn(
                    "grid grid-cols-[80px_1fr_110px_100px_100px_80px] gap-3 items-center px-3 py-3 cursor-pointer rounded-xl",
                    isActive ? "bg-orange-50" : "bg-white hover:bg-gray-50"
                  )}
                  onClick={() => toggleExpand(pv.id)}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-sm text-gray-800">{pv.version}</span>
                    {isActive && <div className="w-1.5 h-1.5 bg-[#f47920] rounded-full animate-pulse" />}
                  </div>
                  <span className="text-xs text-gray-500 truncate">{pv.changelog}</span>
                  <StatusBadge status={pv.status} />
                  <EvalBadge gate={pv.regressionSuite} />
                  <EvalBadge gate={pv.evaluationGate} />
                  <div className="flex items-center gap-1">
                    {isExpanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                  </div>
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div className="border-t border-gray-100 px-4 py-4 space-y-4 bg-white rounded-b-xl">
                    {/* Config grid */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                          <Shield size={10} />
                          Safety Profile
                        </div>
                        <span className="text-sm font-semibold text-gray-800 capitalize">{pv.safetyProfile}</span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                          <Layers size={10} />
                          Retrieval
                        </div>
                        <span className="text-sm font-semibold text-gray-800 capitalize">{pv.retrievalStrictness}</span>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                          <Target size={10} />
                          Escalation
                        </div>
                        <span className="text-sm font-semibold text-gray-800 capitalize">{pv.escalationThreshold} threshold</span>
                      </div>
                    </div>

                    {/* Metrics */}
                    {pv.stats && (
                      <div className="space-y-2 bg-gray-50 rounded-lg p-3">
                        <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Evaluation Metrics</h4>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                          <MetricBar value={pv.stats.groundedResponseRate} label="Grounded Response Rate" />
                          <MetricBar value={pv.stats.toneCompliance} label="Tone Compliance" />
                          <MetricBar value={pv.stats.escalationAccuracy} label="Escalation Accuracy" />
                          <MetricBar value={pv.stats.policyAdherence} label="Policy Adherence" />
                        </div>
                        <div className="flex gap-4 pt-1 text-xs text-gray-500">
                          <span>Fallback rate: <strong className="text-gray-700">{pv.stats.fallbackRate}%</strong></span>
                          <span>Hallucinations: <strong className="text-gray-700">{pv.stats.hallucinationCount}/{pv.stats.totalTests}</strong></span>
                        </div>
                      </div>
                    )}

                    {/* System Prompt */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">System Prompt</h4>
                        {pv.status !== "deployed" && pv.status !== "deprecated" && (
                          <button
                            onClick={(e) => { e.stopPropagation(); isEditing ? setEditing(null) : startEdit(pv); }}
                            className="text-xs text-[#f47920] hover:underline flex items-center gap-1"
                          >
                            <Edit3 size={10} />
                            {isEditing ? "Cancel" : "Edit"}
                          </button>
                        )}
                      </div>
                      {isEditing ? (
                        <div className="space-y-2">
                          <textarea
                            value={editedPrompt}
                            onChange={(e) => setEditedPrompt(e.target.value)}
                            className="w-full h-48 font-mono text-xs bg-gray-900 text-gray-100 p-3 rounded-lg border border-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-[#f47920]/50"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex gap-2">
                            <button className="px-3 py-1.5 bg-[#f47920] text-white text-xs rounded-lg hover:bg-[#c45e10]">
                              Save Draft
                            </button>
                            <button onClick={() => setEditing(null)} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <pre className="text-xs bg-gray-900 text-gray-300 p-3 rounded-lg overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono max-h-48 overflow-y-auto">
                          {pv.systemPrompt}
                        </pre>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-gray-400 pt-1 border-t border-gray-100">
                      <span>Created {new Date(pv.createdAt).toLocaleDateString()}</span>
                      {pv.approvedBy && <span>Approved by: <strong>{pv.approvedBy}</strong></span>}
                      {!pv.approvedBy && pv.status !== "deprecated" && pv.status !== "deployed" && (
                        <span className="text-amber-600">Pending approval</span>
                      )}

                      {/* Action buttons */}
                      <div className="ml-auto flex gap-2">
                        {pv.status === "staged" && (
                          <button className="flex items-center gap-1 px-2.5 py-1.5 bg-[#f47920] text-white text-xs rounded-lg hover:bg-[#c45e10]">
                            <Rocket size={10} />
                            Deploy
                          </button>
                        )}
                        {pv.status === "deployed" && (
                          <button className="flex items-center gap-1 px-2.5 py-1.5 bg-gray-100 text-gray-600 text-xs rounded-lg hover:bg-gray-200">
                            <RotateCcw size={10} />
                            Rollback to v2.0
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Deployment info */}
      <div className="w-72 flex-none border-l border-gray-200 bg-white overflow-y-auto p-4 space-y-5">
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Deployment Status</h3>
          <div className="space-y-2">
            {promptRegistry.map((pv) => {
              const cfg = statusConfig[pv.status];
              const Icon = cfg.icon;
              return (
                <div key={pv.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2">
                    <Icon size={12} className={cfg.color} />
                    <span className="text-xs font-mono font-semibold text-gray-700">{pv.version}</span>
                  </div>
                  <StatusBadge status={pv.status} />
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">v2.0 vs v3.0 Comparison</h3>
          <div className="space-y-2">
            {[
              { label: "Grounded Response Rate", v2: 84, v3: 93 },
              { label: "Tone Compliance", v2: 91, v3: 95 },
              { label: "Policy Adherence", v2: 78, v3: 89 },
              { label: "Fallback Rate", v2: 12, v3: 6, invert: true },
            ].map((m) => {
              const delta = m.v3 - m.v2;
              const improved = m.invert ? delta < 0 : delta > 0;
              return (
                <div key={m.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">{m.label}</span>
                    <span className={cn("font-semibold", improved ? "text-emerald-600" : "text-red-600")}>
                      {improved ? "+" : ""}{delta}%
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-400 rounded-full" style={{ width: `${m.v2}%` }} />
                    </div>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#f47920] rounded-full" style={{ width: `${m.v3}%` }} />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>v2: {m.v2}%</span>
                    <span>v3: {m.v3}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Lifecycle Gates</h3>
          <div className="space-y-1.5 text-xs text-gray-600">
            {["Edit → Test", "Test → Stage", "Stage → Deploy", "Deploy → Rollback"].map((gate, i) => (
              <div key={gate} className="flex items-center gap-2 py-1">
                <div className={cn("w-1.5 h-1.5 rounded-full", i < 2 ? "bg-emerald-500" : i === 2 ? "bg-blue-500" : "bg-gray-300")} />
                {gate}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
