# DeVry AI Operations Workspace

An enterprise AI reliability and lifecycle management platform demonstrating prompt engineering, RAG pipelines, evaluation frameworks, and governance tooling — built for DeVry University's Student Services domain.

## What it demonstrates

| Capability | Implementation |
|---|---|
| **Prompt lifecycle governance** | 4-version registry with Deploy → Stage → Draft → Deprecated states, rollback controls |
| **RAG pipeline** | BM25 keyword retrieval across 15 knowledge chunks (programs, enrollment, financial aid, policies) |
| **Evaluation suite** | 12 structured test cases with rubrics across grounding, tone, escalation accuracy, and policy adherence |
| **Governance & observability** | 7-day metrics, incident log, coverage gap detection, evaluation drift alerts |
| **Enterprise guardrails** | FERPA detection, escalation routing, off-topic handling, legal matter flagging |

## Getting started

### 1. Clone & install

```bash
git clone https://github.com/reckten/devry-ai-ops
cd devry-ai-ops
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your OpenRouter API key:
```
OPENROUTER_API_KEY=sk-or-...
```

Get a free key at [openrouter.ai/keys](https://openrouter.ai/keys).

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Workspace tabs

### 💬 AI Service Workspace
The deployed student-facing service. Chat with the AI advisor — see real-time retrieval quality indicators, guardrail triggers, and source attribution on every response.

### 🔧 Prompt Ops Center
The engineer's control plane. Browse the prompt registry, compare version metrics, edit drafts, view system prompts, and manage the deployment lifecycle (Edit → Test → Stage → Deploy → Rollback).

### 📊 Evaluation Suite
Structured quality assurance. Run the 12-case test suite against any prompt version. Compare grounded response rate, tone compliance, escalation accuracy, policy adherence, and hallucination frequency across versions.

### 🛡️ Governance & Observability
Operational intelligence. 7-day metric trends (sparklines), source confidence distribution, retrieval coverage gaps, incident log, guardrail summary, and evaluation drift alerts.

## Tech stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + custom design tokens
- **LLM**: OpenRouter → `openai/gpt-4o-mini` (model-flexible)
- **RAG**: In-process BM25 keyword retrieval (no external vector DB)
- **Storage**: Static TypeScript data files (zero infrastructure)
- **Deploy**: Vercel (one-click)

## Deploying to Vercel

1. Push this repo to GitHub
2. Import to Vercel at vercel.com/new
3. Add `OPENROUTER_API_KEY` in Vercel environment variables
4. Deploy

## Architecture

```
app/
├── api/chat/          → RAG retrieval + OpenRouter LLM call
├── api/evaluate/      → Automated test suite runner
components/
├── ServiceWorkspace   → Student chat interface + knowledge panel
├── PromptOpsCenter    → Prompt registry + lifecycle management
├── EvalSuite          → Test runner + version comparison
└── GovernanceDashboard → Observability + incident log
data/
├── knowledge-base.ts  → 15 knowledge chunks (programs, policies, FAQs)
├── prompts.ts         → 4-version prompt registry
└── eval-suites.ts     → 12 structured test cases
```

---

Built as a portfolio prototype demonstrating AI Solutions Engineer competencies for DeVry University.
