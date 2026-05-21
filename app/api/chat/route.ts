import { NextRequest, NextResponse } from "next/server";
import { retrieveChunks } from "@/data/knowledge-base";
import { getActivePrompt, getPromptById } from "@/data/prompts";

export async function POST(req: NextRequest) {
  try {
    const { message, promptVersionId } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OPENROUTER_API_KEY not configured" }, { status: 500 });
    }

    // Retrieve relevant knowledge chunks
    const retrievedChunks = retrieveChunks(message, 3);

    // Detect guardrail triggers
    const guardrails = detectGuardrails(message);

    // Get prompt version
    const promptVersion = promptVersionId
      ? getPromptById(promptVersionId) ?? getActivePrompt()
      : getActivePrompt();

    // Build context from retrieved chunks
    const context =
      retrievedChunks.length > 0
        ? retrievedChunks
            .map(
              (r, i) =>
                `[Context ${i + 1}] Source: ${r.chunk.source}\nTitle: ${r.chunk.title}\n${r.chunk.content}`
            )
            .join("\n\n")
        : "No relevant context found in knowledge base.";

    const userMessage = `Student query: ${message}\n\n---\nKnowledge context:\n${context}\n---\n\nIf the context is insufficient to answer the question completely, use the fallback message from your instructions.`;

    // Call OpenRouter
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://devry-ai-ops.vercel.app",
        "X-Title": "DeVry AI Operations Workspace",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          { role: "system", content: promptVersion.systemPrompt },
          { role: "user", content: userMessage },
        ],
        max_tokens: 512,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("OpenRouter error:", errText);
      return NextResponse.json({ error: "LLM request failed" }, { status: 500 });
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content ?? "";

    // Determine overall retrieval quality
    const topQuality = retrievedChunks[0]?.quality ?? "weak";
    const retrievalQuality =
      retrievedChunks.length === 0 ? "none" : topQuality;

    return NextResponse.json({
      response: assistantMessage,
      retrievedChunks: retrievedChunks.map((r) => ({
        id: r.chunk.id,
        title: r.chunk.title,
        source: r.chunk.source,
        category: r.chunk.category,
        quality: r.quality,
        preview: r.chunk.content.slice(0, 120) + "…",
      })),
      retrievalQuality,
      guardrails,
      promptVersion: promptVersion.version,
      model: "openai/gpt-4o-mini",
      latencyMs: Date.now(),
    });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function detectGuardrails(query: string): string[] {
  const q = query.toLowerCase();
  const triggers: string[] = [];

  const ferpaTerms = ["transcript", "gpa", "grade", "record", "my file", "my account", "my information"];
  if (ferpaTerms.some((t) => q.includes(t))) {
    triggers.push("FERPA-sensitive query detected");
  }

  const distressTerms = ["struggle", "overwhelm", "can't continue", "give up", "stressed", "depressed", "anxious", "crisis"];
  if (distressTerms.some((t) => q.includes(t))) {
    triggers.push("Escalation confidence: High — routing to human advisor");
  }

  const offTopicTerms = ["stock", "invest", "bitcoin", "crypto", "politics", "sports", "weather", "recipe", "movie"];
  if (offTopicTerms.some((t) => q.includes(t))) {
    triggers.push("Off-topic query — outside DeVry service scope");
  }

  const legalTerms = ["sue", "lawsuit", "lawyer", "attorney", "legal action", "discrimination"];
  if (legalTerms.some((t) => q.includes(t))) {
    triggers.push("Legal matter detected — escalation required");
  }

  const ambiguityScore = query.split(" ").length < 4 ? 1 : 0;
  if (ambiguityScore) {
    triggers.push("Policy ambiguity — escalation recommended");
  }

  return triggers;
}
