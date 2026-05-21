import { NextRequest, NextResponse } from "next/server";
import { testSuite } from "@/data/eval-suites";
import { retrieveChunks } from "@/data/knowledge-base";
import { getPromptById, getActivePrompt } from "@/data/prompts";

export async function POST(req: NextRequest) {
  try {
    const { promptVersionId } = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OPENROUTER_API_KEY not configured" }, { status: 500 });
    }

    const promptVersion = promptVersionId
      ? getPromptById(promptVersionId) ?? getActivePrompt()
      : getActivePrompt();

    const results = [];

    for (const tc of testSuite) {
      const chunks = retrieveChunks(tc.query, 3);
      const context =
        chunks.length > 0
          ? chunks.map((r) => `Source: ${r.chunk.source}\n${r.chunk.content}`).join("\n\n")
          : "No relevant context found.";

      const userMessage = `Student query: ${tc.query}\n\nKnowledge context:\n${context}\n\nAnswer the student's question based on the context provided.`;

      let responseText = "";
      let latencyMs = 0;

      try {
        const start = Date.now();
        const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://devry-ai-ops.vercel.app",
            "X-Title": "DeVry AI Operations Workspace — Eval",
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini",
            messages: [
              { role: "system", content: promptVersion.systemPrompt },
              { role: "user", content: userMessage },
            ],
            max_tokens: 300,
            temperature: 0.1,
          }),
        });
        latencyMs = Date.now() - start;
        const data = await res.json();
        responseText = data.choices?.[0]?.message?.content ?? "";
      } catch {
        responseText = "[Error calling LLM]";
      }

      // Heuristic scoring
      const responseLower = responseText.toLowerCase();

      const groundingScore = evaluateGrounding(responseText, chunks);
      const tonePass = evaluateTone(responseText);
      const escalationPass = evaluateEscalation(responseText, tc);
      const policyPass = evaluatePolicy(responseText, tc, chunks);
      const hallucinationDetected = detectHallucination(responseText, chunks, tc);

      const passed = groundingScore !== "none" || tc.expectedFallback
        ? tonePass && escalationPass && policyPass && !hallucinationDetected
        : false;

      results.push({
        testCaseId: tc.id,
        category: tc.category,
        query: tc.query,
        expectedBehavior: tc.expectedBehavior,
        promptVersionId: promptVersion.id,
        promptVersion: promptVersion.version,
        passed,
        groundingScore,
        tonePass,
        escalationPass,
        policyPass,
        hallucinationDetected,
        responsePreview: responseText.slice(0, 200),
        fullResponse: responseText,
        latencyMs,
        ranAt: new Date().toISOString(),
        guardrailCheck: tc.guardrailCheck,
        retrievedSources: chunks.map((c) => c.chunk.source),
      });
    }

    const summary = {
      totalTests: results.length,
      passed: results.filter((r) => r.passed).length,
      groundedResponseRate: Math.round(
        (results.filter((r) => r.groundingScore === "strong" || r.groundingScore === "moderate").length /
          results.length) * 100
      ),
      toneCompliance: Math.round((results.filter((r) => r.tonePass).length / results.length) * 100),
      escalationAccuracy: Math.round((results.filter((r) => r.escalationPass).length / results.length) * 100),
      policyAdherence: Math.round((results.filter((r) => r.policyPass).length / results.length) * 100),
      hallucinationCount: results.filter((r) => r.hallucinationDetected).length,
      fallbackRate: Math.round(
        (results.filter((r) => r.groundingScore === "none").length / results.length) * 100
      ),
    };

    return NextResponse.json({ results, summary, promptVersion: promptVersion.version });
  } catch (err) {
    console.error("Eval route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function evaluateGrounding(response: string, chunks: ReturnType<typeof retrieveChunks>): "strong" | "moderate" | "weak" | "none" {
  if (chunks.length === 0) return "none";
  const topQuality = chunks[0]?.quality;
  if (topQuality === "strong") return "strong";
  if (topQuality === "moderate") return "moderate";
  return "weak";
}

function evaluateTone(response: string): boolean {
  const negativeTone = ["i don't know", "cannot help", "no idea", "not my problem"];
  return !negativeTone.some((t) => response.toLowerCase().includes(t));
}

function evaluateEscalation(response: string, tc: (typeof testSuite)[0]): boolean {
  if (!tc.expectedEscalate) return true;
  const escalationSignals = ["contact", "reach out", "advisor", "registrar", "services", "directly", "human", "escalat"];
  return escalationSignals.some((s) => response.toLowerCase().includes(s));
}

function evaluatePolicy(response: string, tc: (typeof testSuite)[0], chunks: ReturnType<typeof retrieveChunks>): boolean {
  if (tc.expectedFallback) {
    const fallbackSignals = ["contact", "reach out", "could not", "unable to", "please contact"];
    return fallbackSignals.some((s) => response.toLowerCase().includes(s));
  }
  return chunks.length > 0;
}

function detectHallucination(
  response: string,
  chunks: ReturnType<typeof retrieveChunks>,
  tc: (typeof testSuite)[0]
): boolean {
  // Simple heuristic: check if response makes up specific numbers not in the knowledge base
  const fakeNumbers = /\$[\d,]+(?!\s*(per credit|\/credit|technology fee|scholarship|discount))/i;
  if (fakeNumbers.test(response) && chunks.length === 0) return true;

  // Check for obviously wrong facts
  const suspiciousPatterns = [
    /(\d+)\s*year program/i, // may fabricate duration
    /campus in \w+/i, // may fabricate campus locations
  ];

  if (chunks.length === 0 && tc.expectedFallback === false) {
    return suspiciousPatterns.some((p) => p.test(response));
  }

  return false;
}
