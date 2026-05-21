"use client";

import { useState } from "react";
import { testSuite, precomputedResults } from "@/data/eval-suites";
import { promptRegistry } from "@/data/prompts";
import {
  Play, CheckCircle2, XCircle, ChevronDown, ChevronUp,
  Loader2, BarChart3, Shield, Check, X, Clock, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/cn";

type EvalResult = {
  testCaseId: string;
  category: string;
  query: string;
  expectedBehavior: string;
  promptVersionId: string;
  promptVersion: string;
  passed: boolean;
  groundingScore: "strong" | "moderate" | "weak" | "none";
  tonePass: boolean;
  escalationPass: boolean;
  policyPass: boolean;
  hallucinationDetected: boolean;
  responsePreview: string;
  fullResponse?: string;
  latencyMs?: number;
  ranAt: string;
  guardrailCheck?: string;
  retrievedSources?: string[];
};

type SummaryStats = {
  totalTests: number;
  passed: number;
  groundedResponseRate: number;
  toneCompliance: number;
  escalationAccuracy: number;
  policyAdherence: number;
  hallucinationCount: number;
  fallbackRate: number;
};

const groundingColors = {
  strong: "text-emerald-600 bg-emerald-50",
  moderate: "text-amber-600 bg-amber-50",
  weak: "text-red-600 bg-red-50",
  none: "text-gray-500 bg-gray-50",
};

const CATEGORIES = ["All", "Program Inquiry", "Enrollment", "Financial Aid", "Policy", "Escalation — FERPA", "Escalation — Distress", "Off-Topic Guardrail", "Insufficient Context"];

export default function EvalSuite() {
  const [selectedVersionId, setSelectedVersionId] = useState("pv-002");
  const [results, setResults] = useState<EvalResult[]>(
    precomputedResults["pv-002"]?.map((r, i) => ({
      ...r,
      category: testSuite[i]?.category ?? "",
      query: testSuite[i]?.query ?? "",
      expectedBehavior: testSuite[i]?.expectedBehavior ?? "",
      promptVersion: "v2.0",
      responsePreview: `[Pre-computed] ${testSuite[i]?.expectedBehavior ?? ""}`,
      ranAt: "2025-03-20T10:00:00Z",
    })) ?? []
  );
  const [summary, setSummary] = useState<SummaryStats | null>(() => {
    const r = precomputedResults["pv-002"];
    if (!r) return null;
    return {
      totalTests: 12,
      passed: r.filter((x) => x.passed).length,
      groundedResponseRate: 84,
      toneCompliance: 91,
      escalationAccuracy: 100,
      policyAdherence: 78,
      hallucinationCount: 3,
      fallbackRate: 12,
    };
  });
  const [isRunning, setIsRunning] = useState(false);
  const [expandedCase, setExpandedCase] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [compareVersionId, setCompareVersionId] = useState<string | null>("pv-003");

  async function runEvaluation() {
    setIsRunning(true);
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ promptVersionId: selectedVersionId }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data.results);
      setSummary(data.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  }

  function loadPrecomputed(versionId: string) {
    setSelectedVersionId(versionId);
    const pre = precomputedResults[versionId];
    const pv = promptRegistry.find((p) => p.id === versionId);
    if (pre && pv) {
      setResults(
        pre.map((r, i) => ({
          ...r,
          category: testSuite[i]?.category ?? "",
          query: testSuite[i]?.query ?? "",
          expectedBehavior: testSuite[i]?.expectedBehavior ?? "",
          promptVersion: pv.version,
          responsePreview: `[Pre-computed] ${testSuite[i]?.expectedBehavior ?? ""}`,
          ranAt: versionId === "pv-002" ? "2025-03-20T10:00:00Z" : "2025-05-14T09:00:00Z",
        }))
      );
      setSummary({
        totalTests: 12,
        passed: pre.filter((x) => x.passed).length,
        groundedResponseRate: pv.stats?.groundedResponseRate ?? 0,
        toneCompliance: pv.stats?.toneCompliance ?? 0,
        escalationAccuracy: pv.stats?.escalationAccuracy ?? 0,
        policyAdherence: pv.stats?.policyAdherence ?? 0,
        hallucinationCount: pv.stats?.hallucinationCount ?? 0,
        fallbackRate: pv.stats?.fallbackRate ?? 0,
      });
    }
  }

  const compareSummary = (() => {
    if (!compareVersionId) return null;
    const pv = promptRegistry.find((p) => p.id === compareVersionId);
    return pv?.stats ?? null;
  })();

  const filteredResults = filterCategory === "All"
    ? results
    : results.filter((r) => r.category === filterCategory);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: Test results */}
      <div className="flex-1 overflow-y-auto px-6 py-6 bg-[#F8F8F8]">
        {/* Controls */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-[#333333]">Evaluation Suite</h2>
            <p className="text-sm text-gray-500 mt-0.5">12 test cases · Student Services domain</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-500 font-medium">Test against:</label>
              <select
                value={selectedVersionId}
                onChange={(e) => loadPrecomputed(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-[#0033E1]/20"
              >
                {promptRegistry
                  .filter((p) => p.status !== "deprecated")
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.version} ({p.status})
                    </option>
                  ))}
              </select>
            </div>
            <button
              onClick={runEvaluation}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 bg-[#0033E1] text-white text-sm font-medium rounded-lg hover:bg-[#0026b0] disabled:opacity-50 transition-colors"
            >
              {isRunning ? (
                <><Loader2 size={14} className="animate-spin" /> Running…</>
              ) : (
                <><Play size={14} /> Run Suite</>
              )}
            </button>
          </div>
        </div>

        {/* Summary metrics */}
        {summary && (
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { label: "Grounded Response Rate", value: summary.groundedResponseRate, compare: compareSummary?.groundedResponseRate },
              { label: "Tone Compliance", value: summary.toneCompliance, compare: compareSummary?.toneCompliance },
              { label: "Escalation Accuracy", value: summary.escalationAccuracy, compare: compareSummary?.escalationAccuracy },
              { label: "Policy Adherence", value: summary.policyAdherence, compare: compareSummary?.policyAdherence },
            ].map((m) => {
              const delta = m.compare !== undefined ? m.compare - m.value : null;
              return (
                <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="text-2xl font-bold text-[#333333]">{m.value}%</div>
                  <div className="text-xs text-gray-500 mt-1">{m.label}</div>
                  {delta !== null && (
                    <div className={cn("text-xs font-semibold mt-1", delta > 0 ? "text-emerald-600" : delta < 0 ? "text-red-600" : "text-gray-400")}>
                      {delta > 0 ? "+" : ""}{delta}% in {promptRegistry.find((p) => p.id === compareVersionId)?.version}
                    </div>
                  )}
                  <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full", m.value >= 90 ? "bg-emerald-500" : m.value >= 75 ? "bg-amber-500" : "bg-red-500")}
                      style={{ width: `${m.value}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Secondary metrics */}
        {summary && (
          <div className="flex items-center gap-6 mb-5 px-1 text-sm">
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", summary.passed >= 10 ? "bg-emerald-500" : "bg-amber-500")} />
              <span className="text-gray-600">Pass rate: <strong className="text-[#333333]">{summary.passed}/{summary.totalTests}</strong></span>
            </div>
            <div className="text-gray-600">Hallucinations: <strong className="text-[#333333]">{summary.hallucinationCount}</strong></div>
            <div className="text-gray-600">Fallback rate: <strong className="text-[#333333]">{summary.fallbackRate}%</strong></div>
            {results[0] && (
              <div className="text-gray-400 text-xs ml-auto">
                Last run: {new Date(results[0].ranAt).toLocaleDateString()} · {promptRegistry.find((p) => p.id === selectedVersionId)?.version}
              </div>
            )}
          </div>
        )}

        {/* Category filter */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {CATEGORIES.slice(0, 6).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={cn(
                "text-xs px-3 py-1.5 rounded-full border whitespace-nowrap transition-colors",
                filterCategory === cat
                  ? "bg-[#0033E1] text-white border-[#0033E1]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#0033E1] hover:text-[#0033E1]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Test cases */}
        <div className="space-y-2">
          {filteredResults.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <BarChart3 size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Run the evaluation suite to see results</p>
            </div>
          )}

          {filteredResults.map((result) => {
            const tc = testSuite.find((t) => t.id === result.testCaseId);
            const isExpanded = expandedCase === result.testCaseId;

            return (
              <div
                key={result.testCaseId}
                className={cn(
                  "bg-white rounded-xl border transition-all",
                  result.passed ? "border-gray-200" : "border-red-200"
                )}
              >
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                  onClick={() => setExpandedCase(isExpanded ? null : result.testCaseId)}
                >
                  {result.passed ? (
                    <CheckCircle2 size={16} className="text-emerald-500 flex-none" />
                  ) : (
                    <XCircle size={16} className="text-red-500 flex-none" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-400 uppercase">{result.category}</span>
                      {tc?.guardrailCheck && (
                        <span className="text-xs px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-200">
                          Guardrail
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#333333] truncate mt-0.5">{result.query}</p>
                  </div>

                  <div className="flex items-center gap-3 flex-none">
                    <div className="flex gap-1">
                      <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", groundingColors[result.groundingScore])}>
                        {result.groundingScore === "none" ? "fallback" : result.groundingScore}
                      </span>
                      <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", result.tonePass ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50")}>
                        tone
                      </span>
                      <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", result.escalationPass ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50")}>
                        escalation
                      </span>
                      {result.hallucinationDetected && (
                        <span className="text-xs px-1.5 py-0.5 rounded font-medium text-red-600 bg-red-50">
                          hallucination
                        </span>
                      )}
                    </div>
                    {isExpanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-gray-100 px-4 py-3 space-y-3 bg-[#F8F8F8] rounded-b-xl">
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Expected Behavior</div>
                      <p className="text-sm text-gray-700">{result.expectedBehavior}</p>
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Response Preview</div>
                      <p className="text-sm text-gray-600 bg-white rounded-lg p-3 border border-gray-200 font-mono leading-relaxed">
                        {result.responsePreview}
                      </p>
                    </div>
                    {tc?.guardrailCheck && (
                      <div className="flex items-center gap-2 text-xs bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-amber-800">
                        <Shield size={11} />
                        Expected guardrail: {tc.guardrailCheck}
                      </div>
                    )}
                    {result.retrievedSources && result.retrievedSources.length > 0 && (
                      <div className="text-xs text-gray-400">
                        Sources: {result.retrievedSources.join(", ")}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Compare panel */}
      <div className="w-72 flex-none border-l border-gray-200 bg-white overflow-y-auto p-4 space-y-5">
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Compare Versions</h3>
          <select
            value={compareVersionId ?? ""}
            onChange={(e) => setCompareVersionId(e.target.value || null)}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none bg-[#F8F8F8]"
          >
            <option value="">No comparison</option>
            {promptRegistry
              .filter((p) => p.id !== selectedVersionId && p.stats)
              .map((p) => (
                <option key={p.id} value={p.id}>{p.version}</option>
              ))}
          </select>
        </div>

        {compareSummary && summary && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-400">
              {promptRegistry.find((p) => p.id === selectedVersionId)?.version} vs{" "}
              {promptRegistry.find((p) => p.id === compareVersionId)?.version}
            </h4>
            {[
              { label: "Grounded Response Rate", current: summary.groundedResponseRate, compare: compareSummary.groundedResponseRate },
              { label: "Tone Compliance", current: summary.toneCompliance, compare: compareSummary.toneCompliance },
              { label: "Escalation Accuracy", current: summary.escalationAccuracy, compare: compareSummary.escalationAccuracy },
              { label: "Policy Adherence", current: summary.policyAdherence, compare: compareSummary.policyAdherence },
              { label: "Fallback Rate", current: summary.fallbackRate, compare: compareSummary.fallbackRate, invert: true },
            ].map((m) => {
              const delta = m.compare - m.current;
              const improved = m.invert ? delta < 0 : delta > 0;
              return (
                <div key={m.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">{m.label}</span>
                    <span className={cn("font-bold", improved ? "text-emerald-600" : delta < 0 ? "text-red-600" : "text-gray-400")}>
                      {improved ? "+" : ""}{delta}%
                    </span>
                  </div>
                  <div className="flex gap-0.5">
                    <div className="flex-1 h-2 bg-gray-200 rounded-l-full overflow-hidden">
                      <div className="h-full bg-gray-400" style={{ width: `${m.current}%` }} />
                    </div>
                    <div className="flex-1 h-2 bg-gray-100 rounded-r-full overflow-hidden">
                      <div className="h-full bg-[#0033E1]" style={{ width: `${m.compare}%` }} />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{m.current}%</span>
                    <span>{m.compare}%</span>
                  </div>
                </div>
              );
            })}

            <div className="pt-2 border-t border-gray-100">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Hallucinations</span>
                <span className={cn("font-bold", compareSummary.hallucinationCount < summary.hallucinationCount ? "text-emerald-600" : "text-red-600")}>
                  {summary.hallucinationCount} → {compareSummary.hallucinationCount}
                </span>
              </div>
            </div>

            <div className="bg-[#e8eeff] border border-[#0033E1]/20 rounded-lg p-3">
              <div className="text-xs font-semibold text-[#0033E1] mb-1">
                {promptRegistry.find((p) => p.id === compareVersionId)?.version} Recommendation
              </div>
              <div className="text-xs text-[#333333]">
                {promptRegistry.find((p) => p.id === compareVersionId)?.evaluationGate === "pass"
                  ? "✅ Ready for deployment — all gates passing"
                  : "⏳ Pending evaluation gate"}
              </div>
            </div>
          </div>
        )}

        <div className="border-t border-gray-100 pt-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Test Suite Breakdown</h3>
          <div className="space-y-1">
            {[
              { cat: "Program Inquiry", count: 2 },
              { cat: "Enrollment", count: 2 },
              { cat: "Financial Aid", count: 2 },
              { cat: "Policy", count: 2 },
              { cat: "Escalation", count: 2 },
              { cat: "Guardrail / Fallback", count: 2 },
            ].map((c) => (
              <div key={c.cat} className="flex justify-between text-xs py-1">
                <span className="text-gray-600">{c.cat}</span>
                <span className="text-gray-400">{c.count} cases</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
