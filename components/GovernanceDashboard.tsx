"use client";

import {
  Shield, AlertTriangle, TrendingUp, TrendingDown,
  Clock, AlertCircle, CheckCircle2, XCircle, ArrowUpRight, BookOpen
} from "lucide-react";
import { cn } from "@/lib/cn";

const METRICS = [
  { label: "Grounded Response Rate", value: "91%", trend: "+3%", direction: "up" as const, spark: [78, 82, 81, 85, 88, 89, 91], description: "% of responses backed by retrieved context" },
  { label: "Retrieval Coverage", value: "87%", trend: "+5%", direction: "up" as const, spark: [76, 78, 80, 82, 83, 85, 87], description: "% of queries with at least one strong hit" },
  { label: "Unresolved Escalations", value: "4", trend: "-2", direction: "down-good" as const, spark: [9, 7, 8, 6, 6, 5, 4], description: "Open escalations awaiting human resolution" },
  { label: "Hallucination Frequency", value: "2.1%", trend: "-1.4%", direction: "down-good" as const, spark: [5.8, 5.2, 4.1, 3.8, 3.2, 2.8, 2.1], description: "% of responses with unsupported claims" },
  { label: "Fallback Response Usage", value: "8%", trend: "-4%", direction: "down-good" as const, spark: [18, 16, 14, 13, 11, 10, 8], description: "% of queries returning fallback message" },
  { label: "Avg Response Latency", value: "1.4s", trend: "-0.3s", direction: "down-good" as const, spark: [2.1, 2.0, 1.9, 1.8, 1.7, 1.5, 1.4], description: "Average end-to-end response time" },
];

const INCIDENT_LOG = [
  { id: "inc-001", timestamp: "2025-05-19 14:23", type: "FERPA-sensitive query detected", query: "Can you pull my academic records?", action: "Routed to Registrar", severity: "medium" as const, resolved: true },
  { id: "inc-002", timestamp: "2025-05-19 11:07", type: "Escalation confidence: High", query: "I'm feeling overwhelmed and don't know if I can go on", action: "Routed to human advisor", severity: "high" as const, resolved: true },
  { id: "inc-003", timestamp: "2025-05-18 16:45", type: "Policy ambiguity detected", query: "What if I withdraw after the deadline?", action: "Escalation recommended", severity: "low" as const, resolved: true },
  { id: "inc-004", timestamp: "2025-05-18 09:12", type: "Off-topic query — outside service scope", query: "What's the best crypto to buy right now?", action: "Graceful decline, no escalation", severity: "low" as const, resolved: true },
  { id: "inc-005", timestamp: "2025-05-17 15:30", type: "Source grounding insufficient", query: "What are the parking rules at the Naperville campus?", action: "Fallback message returned", severity: "low" as const, resolved: true },
  { id: "inc-006", timestamp: "2025-05-17 10:55", type: "Legal matter detected — escalation required", query: "I want to file a discrimination complaint", action: "Routed to Dean of Academic Affairs", severity: "high" as const, resolved: false },
];

const COVERAGE_GAPS = [
  { topic: "Campus parking & facilities", queryCount: 8, coverage: "None" },
  { topic: "International student visas", queryCount: 5, coverage: "Weak" },
  { topic: "Disability accommodations", queryCount: 4, coverage: "None" },
  { topic: "Military activation leave", queryCount: 3, coverage: "Weak" },
];

const SOURCE_CONFIDENCE = [
  { label: "Strong", value: 61, color: "bg-emerald-500" },
  { label: "Moderate", value: 26, color: "bg-amber-500" },
  { label: "Weak", value: 8, color: "bg-red-400" },
  { label: "None / Fallback", value: 5, color: "bg-gray-300" },
];

function Sparkline({ values }: { values: number[] }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const width = 60;
  const height = 24;
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline points={points} fill="none" stroke="#0033E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle
        cx={(values.length - 1) / (values.length - 1) * width}
        cy={height - ((values[values.length - 1] - min) / range) * height}
        r="2.5"
        fill="#0033E1"
      />
    </svg>
  );
}

const severityConfig = {
  high: { color: "text-red-700 bg-red-50 border-red-200", dot: "bg-red-500" },
  medium: { color: "text-amber-700 bg-amber-50 border-amber-200", dot: "bg-amber-500" },
  low: { color: "text-gray-600 bg-gray-50 border-gray-200", dot: "bg-gray-400" },
};

export default function GovernanceDashboard() {
  return (
    <div className="flex h-full overflow-hidden">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-[#F8F8F8]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#333333]">Governance & Observability</h2>
            <p className="text-sm text-gray-500 mt-0.5">Last 7 days · Student Services · v2.0 deployed</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span>Live monitoring active</span>
          </div>
        </div>

        {/* Metric grid */}
        <div className="grid grid-cols-3 gap-4">
          {METRICS.map((m) => (
            <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-2xl font-bold text-[#333333]">{m.value}</div>
                  <div className="text-xs text-gray-500 mt-1">{m.label}</div>
                </div>
                <Sparkline values={m.spark} />
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                {m.direction === "up" || m.direction === "down-good"
                  ? m.direction === "up"
                    ? <TrendingUp size={12} className="text-emerald-500" />
                    : <TrendingDown size={12} className="text-emerald-500" />
                  : null}
                <span className="font-semibold text-emerald-600">{m.trend}</span>
                <span className="text-gray-400">vs last week</span>
              </div>
            </div>
          ))}
        </div>

        {/* Source confidence distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-[#333333] mb-4">Source Confidence Distribution</h3>
          <div className="space-y-3">
            {SOURCE_CONFIDENCE.map((s) => (
              <div key={s.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">{s.label}</span>
                  <span className="font-semibold text-[#333333]">{s.value}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", s.color)} style={{ width: `${s.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">Based on 1,247 queries over the last 7 days.</p>
        </div>

        {/* Coverage gaps */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#333333]">Retrieval Coverage Gaps</h3>
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">4 gaps detected</span>
          </div>
          <div className="space-y-2">
            {COVERAGE_GAPS.map((gap) => (
              <div key={gap.topic} className="flex items-center justify-between py-2 px-3 rounded-lg bg-[#F8F8F8] border border-gray-100">
                <div>
                  <div className="text-sm font-medium text-[#333333]">{gap.topic}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{gap.queryCount} queries with no strong source match</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-xs px-2 py-0.5 rounded font-medium", gap.coverage === "None" ? "text-red-600 bg-red-50" : "text-amber-600 bg-amber-50")}>
                    {gap.coverage} coverage
                  </span>
                  <ArrowUpRight size={12} className="text-gray-400" />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">Recommend adding documentation for these topics to improve grounded response rate.</p>
        </div>
      </div>

      {/* Right: Incident log */}
      <div className="w-80 flex-none border-l border-gray-200 bg-white overflow-y-auto">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Incident Log</h3>
            <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200 font-medium">1 open</span>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {INCIDENT_LOG.map((inc) => {
            const cfg = severityConfig[inc.severity];
            return (
              <div key={inc.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className={cn("flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded border", cfg.color)}>
                    <div className={cn("w-1.5 h-1.5 rounded-full flex-none", cfg.dot)} />
                    <span className="truncate">{inc.type}</span>
                  </div>
                  {inc.resolved
                    ? <CheckCircle2 size={14} className="text-emerald-500 flex-none mt-0.5" />
                    : <AlertCircle size={14} className="text-red-500 flex-none mt-0.5 animate-pulse" />}
                </div>
                <p className="text-xs text-gray-500 italic truncate">"{inc.query}"</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Clock size={10} />
                  <span>{inc.timestamp}</span>
                </div>
                <div className="text-xs text-gray-600 bg-[#F8F8F8] rounded px-2 py-1.5">Action: {inc.action}</div>
                {!inc.resolved && (
                  <div className="text-xs text-red-600 font-medium flex items-center gap-1">
                    <AlertCircle size={10} />
                    Awaiting resolution
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Guardrail summary */}
        <div className="p-4 border-t border-gray-100">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Guardrail Summary (7d)</h4>
          <div className="space-y-2">
            {[
              { label: "FERPA-sensitive queries", count: 12, icon: Shield },
              { label: "Escalations triggered", count: 8, icon: AlertTriangle },
              { label: "Off-topic declines", count: 31, icon: XCircle },
              { label: "Legal matter routes", count: 2, icon: AlertCircle },
            ].map((g) => {
              const Icon = g.icon;
              return (
                <div key={g.label} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#F8F8F8]">
                  <div className="flex items-center gap-2">
                    <Icon size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-600">{g.label}</span>
                  </div>
                  <span className="text-xs font-bold text-[#333333]">{g.count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Drift alert */}
        <div className="p-4 border-t border-gray-100">
          <div className="bg-[#e8eeff] border border-[#0033E1]/20 rounded-lg p-3 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0033E1]">
              <AlertTriangle size={11} />
              Evaluation Drift Detected
            </div>
            <p className="text-xs text-[#333333]">
              Live grounded response rate (91%) is 7% above the last test suite run (84%). Consider re-running evaluation suite on v2.0 to confirm drift.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
