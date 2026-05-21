"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send, ThumbsUp, ThumbsDown, Flag, AlertTriangle,
  BookOpen, ChevronRight, Loader2, User, Bot, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/cn";

interface RetrievedChunk {
  id: string;
  title: string;
  source: string;
  category: string;
  quality: "strong" | "moderate" | "weak";
  preview: string;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  retrievedChunks?: RetrievedChunk[];
  retrievalQuality?: "strong" | "moderate" | "weak" | "none";
  guardrails?: string[];
  timestamp: Date;
  feedback?: "positive" | "negative" | "flagged" | null;
}

const SUGGESTED_QUERIES = [
  "What IT programs does DeVry offer?",
  "How do I apply for financial aid?",
  "Can I transfer credits from my previous school?",
  "What happens if my GPA drops below 2.0?",
  "How much does tuition cost?",
];

const qualityConfig = {
  strong: { label: "Strong grounding", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  moderate: { label: "Moderate grounding", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  weak: { label: "Weak grounding", color: "text-red-600", bg: "bg-red-50 border-red-200" },
  none: { label: "No context retrieved", color: "text-gray-500", bg: "bg-gray-50 border-gray-200" },
};

function getGuardrailStyle(guardrail: string) {
  if (guardrail.includes("FERPA")) return "bg-amber-50 border-amber-300 text-amber-800";
  if (guardrail.includes("Escalation") || guardrail.includes("Legal")) return "bg-red-50 border-red-300 text-red-800";
  if (guardrail.includes("Off-topic")) return "bg-gray-50 border-gray-300 text-gray-700";
  return "bg-purple-50 border-purple-300 text-purple-800";
}

export default function ServiceWorkspace() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm DeVry's AI Service for student support. I can help you with program information, enrollment questions, financial aid, and academic policies. How can I assist you today?",
      retrievedChunks: [],
      retrievalQuality: "none",
      guardrails: [],
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedChunk, setSelectedChunk] = useState<RetrievedChunk | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text?: string) {
    const query = (text ?? input).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        retrievedChunks: data.retrievedChunks ?? [],
        retrievalQuality: data.retrievalQuality ?? "none",
        guardrails: data.guardrails ?? [],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I encountered an error processing your request. Please ensure the OPENROUTER_API_KEY is configured and try again.",
        retrievedChunks: [],
        retrievalQuality: "none",
        guardrails: [],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function setFeedback(msgId: string, feedback: Message["feedback"]) {
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, feedback } : m))
    );
  }

  const lastAssistantWithChunks = [...messages]
    .reverse()
    .find((m) => m.role === "assistant" && ((m.retrievedChunks?.length ?? 0) > 0 || (m.guardrails?.length ?? 0) > 0));

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: Chat */}
      <div className="flex flex-col flex-1 min-w-0 border-r border-gray-200">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F8F8]">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex gap-3 animate-fade-in", msg.role === "user" && "justify-end")}>
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-[#0033E1] flex items-center justify-center flex-none mt-0.5">
                  <Bot size={14} className="text-white" />
                </div>
              )}

              <div className={cn("max-w-[80%] space-y-2", msg.role === "user" && "items-end flex flex-col")}>
                {/* Guardrail alerts */}
                {msg.guardrails && msg.guardrails.length > 0 && (
                  <div className="space-y-1">
                    {msg.guardrails.map((g, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex items-center gap-2 text-xs px-3 py-1.5 rounded border font-medium",
                          getGuardrailStyle(g)
                        )}
                      >
                        <AlertTriangle size={11} />
                        {g}
                      </div>
                    ))}
                  </div>
                )}

                {/* Message bubble */}
                <div
                  className={cn(
                    "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-[#0033E1] text-white rounded-tr-sm"
                      : "bg-white border border-gray-200 text-[#333333] rounded-tl-sm shadow-sm"
                  )}
                >
                  {msg.content}
                </div>

                {/* Retrieval quality badge */}
                {msg.role === "assistant" && msg.id !== "welcome" && msg.retrievalQuality && (
                  <div className={cn(
                    "inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border",
                    qualityConfig[msg.retrievalQuality]?.bg
                  )}>
                    <BookOpen size={10} className={qualityConfig[msg.retrievalQuality]?.color} />
                    <span className={qualityConfig[msg.retrievalQuality]?.color}>
                      {qualityConfig[msg.retrievalQuality]?.label}
                    </span>
                    {msg.retrievedChunks && msg.retrievedChunks.length > 0 && (
                      <span className="text-gray-400">· {msg.retrievedChunks.length} source{msg.retrievedChunks.length !== 1 ? "s" : ""}</span>
                    )}
                  </div>
                )}

                {/* Feedback row */}
                {msg.role === "assistant" && msg.id !== "welcome" && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setFeedback(msg.id, "positive")}
                      className={cn(
                        "p-1.5 rounded hover:bg-emerald-50 transition-colors",
                        msg.feedback === "positive" ? "text-emerald-600" : "text-gray-400"
                      )}
                      title="Grounded response"
                    >
                      <ThumbsUp size={12} />
                    </button>
                    <button
                      onClick={() => setFeedback(msg.id, "negative")}
                      className={cn(
                        "p-1.5 rounded hover:bg-red-50 transition-colors",
                        msg.feedback === "negative" ? "text-red-600" : "text-gray-400"
                      )}
                      title="Hallucinated response"
                    >
                      <ThumbsDown size={12} />
                    </button>
                    <button
                      onClick={() => setFeedback(msg.id, "flagged")}
                      className={cn(
                        "p-1.5 rounded hover:bg-amber-50 transition-colors",
                        msg.feedback === "flagged" ? "text-amber-600" : "text-gray-400"
                      )}
                      title="Flag for review"
                    >
                      <Flag size={12} />
                    </button>
                    <span className="text-xs text-gray-300 ml-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-none mt-0.5">
                  <User size={14} className="text-gray-600" />
                </div>
              )}
            </div>
          ))}

          {/* Loading */}
          {isLoading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-7 h-7 rounded-full bg-[#0033E1] flex items-center justify-center flex-none">
                <Bot size={14} className="text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 bg-[#0033E1] rounded-full animate-pulse-dot"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested queries */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2 flex flex-wrap gap-2 bg-[#F8F8F8]">
            {SUGGESTED_QUERIES.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-xs px-3 py-1.5 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-[#0033E1] hover:text-[#0033E1] transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Ask about programs, enrollment, financial aid, or academic policies…"
              className="flex-1 px-4 py-2.5 bg-[#F8F8F8] border border-gray-200 rounded-xl text-sm text-[#333333] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0033E1]/20 focus:border-[#0033E1] transition-all"
              disabled={isLoading}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isLoading}
              className="px-4 py-2.5 bg-[#0033E1] text-white rounded-xl hover:bg-[#0026b0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
            <AlertCircle size={10} />
            <span>Grounded response system · Student Services · v2.0 deployed</span>
          </div>
        </div>
      </div>

      {/* Right: Knowledge Panel */}
      <div className="w-80 flex-none bg-white overflow-y-auto">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Knowledge Sources</h3>
        </div>

        {lastAssistantWithChunks?.retrievedChunks && lastAssistantWithChunks.retrievedChunks.length > 0 ? (
          <div className="p-3 space-y-2">
            {lastAssistantWithChunks.retrievedChunks.map((chunk) => {
              const q = qualityConfig[chunk.quality];
              return (
                <button
                  key={chunk.id}
                  onClick={() => setSelectedChunk(selectedChunk?.id === chunk.id ? null : chunk)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg border transition-all hover:shadow-sm",
                    selectedChunk?.id === chunk.id ? "border-[#0033E1] bg-[#e8eeff]" : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-semibold text-[#333333] leading-tight">{chunk.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{chunk.source}</div>
                    </div>
                    <ChevronRight size={12} className="text-gray-400 flex-none mt-0.5" />
                  </div>
                  <div className={cn("inline-flex items-center gap-1 mt-2 text-xs font-medium", q.color)}>
                    <div className={cn("w-1.5 h-1.5 rounded-full", chunk.quality === "strong" ? "bg-emerald-500" : chunk.quality === "moderate" ? "bg-amber-500" : "bg-red-500")} />
                    {q.label}
                  </div>
                  {selectedChunk?.id === chunk.id && (
                    <p className="text-xs text-gray-500 mt-2 leading-relaxed border-t border-gray-100 pt-2">
                      {chunk.preview}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center">
            <BookOpen size={24} className="mx-auto text-gray-300 mb-2" />
            <p className="text-xs text-gray-400">Send a message to see which knowledge sources were retrieved</p>
          </div>
        )}

        {/* Guardrail log */}
        {lastAssistantWithChunks?.guardrails && lastAssistantWithChunks.guardrails.length > 0 && (
          <div className="p-3 border-t border-gray-100">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Active Guardrails</h4>
            <div className="space-y-1.5">
              {lastAssistantWithChunks.guardrails.map((g, i) => (
                <div
                  key={i}
                  className={cn("text-xs px-3 py-1.5 rounded border font-medium flex items-center gap-1.5", getGuardrailStyle(g))}
                >
                  <AlertTriangle size={10} />
                  {g}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Static knowledge base list */}
        <div className="p-3 border-t border-gray-100">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Knowledge Base</h4>
          <div className="space-y-1">
            {[
              { name: "Academic Catalog 2025–2026", docs: 5 },
              { name: "Enrollment & Admissions Policy", docs: 3 },
              { name: "Financial Aid FAQ 2025", docs: 3 },
              { name: "Student Handbook 2025–2026", docs: 4 },
            ].map((kb) => (
              <div key={kb.name} className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-[#F8F8F8]">
                <div>
                  <div className="text-xs font-medium text-[#333333]">{kb.name}</div>
                  <div className="text-xs text-gray-400">{kb.docs} chunks</div>
                </div>
                <span className="text-xs text-emerald-600 font-medium">Active</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
