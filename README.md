# OomniEye Crystal Ball Command Centre — Sr. Fullstack Developer MERN + AI Assignment

Production-grade implementation of the **OomniEye Digital Twin Approvals Assistant & Command Centre**, recreating the reference digital-twin approvals dashboard, backing all five interactive actions with real LLM reasoning, schema validation, streaming responses, and resilient deterministic offline fallbacks.

---

## 1. Project Overview & Implemented Features

### The 5 Functional Assistant Entry Points
1. **Present me Summary**: Summarizes pending approvals in the operator's operational language, automatically prioritizes items by safety urgency, and returns strictly typed JSON validated via Zod.
2. **Talk to me**: Multi-turn conversational co-pilot maintaining session context over the active approvals queue with incremental token streaming.
3. **Help me**: Policy-grounded Q&A implementing an in-memory RAG retrieval mechanism over multi-chunk operational guidelines (SLAs, OSHA checklists, flight boundaries).
4. **Teach me**: Adaptive 5-step interactive operator training workflow that dynamically responds to follow-up questions and explains compliance checkpoints.
5. **Replay Greeting**: Context-aware dynamic greeting generator analyzing current queue counts and highlighting pending high-urgency items rather than returning static text.

### Platform Architecture & Dashboard
- **Digital Twin Approval Queue**: Matches the reference layout with queue hierarchy views, submitter roles (`Sam HelpAdmin`, `Alex HelpAdmin`, `Elena HelpAdmin`), file types (`Folder`, `Video`, `PDF`, `Image`), and live SLA urgency badges.
- **Screen Snapshot Target**: Interactive 3D scene coordinate inspector simulating spatial anchoring and digital twin validation.
- **Approvals Assistant Widget**: Floating modal with collapse, expand, minimize, and back affordances matching OomniEye UX.

---

## 2. Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript (Strict Mode), Tailwind CSS, Lucide icons.
- **State Management**: Zustand store (`useAssistantStore`) managing session history, streaming status, active modal modes, and error states without prop-drilling.
- **API Contracts & Validation**: Zod schemas (`src/lib/schemas.ts`) enforcing input/output contracts with structured validation.
- **LLM Integration**: Direct server-side multi-provider client supporting both **Anthropic Claude 3.5 Sonnet** and **OpenAI GPT-4o** over HTTPS with zero client exposure.
- **Streaming**: Server-Sent Events (SSE) providing token-by-token rendering.
- **Reliability & Throttling**: 8-second hard timeout per LLM request with in-memory sliding-window rate limiting (30 req/min per session).
- **Testing**: Built-in test suites covering unit assertions, schema validation, prompt generation, RAG chunk retrieval, rate limiting, and endpoint fallback integration.

---

## 3. Engineering Judgment on AI Usage & Fallback Design

### AI-Necessary vs. AI-Unnecessary Architecture
| Feature | Execution Type | Engineering Justification |
| :--- | :--- | :--- |
| **Talk to me** | **AI-Necessary** | Natural language reasoning across multi-turn operator inquiries cannot be expressed through deterministic logic without degrading UX into brittle decision trees. |
| **Teach me (Follow-ups)** | **AI-Necessary** | Adapting training explanations to unique operator misconceptions requires semantic synthesis. |
| **Help me (RAG)** | **Hybrid (AI + Deterministic Retrieval)** | Keyword/similarity retrieval over policy chunks is deterministic, fast, and repeatable. The LLM is used solely to synthesize the matched chunks into concise answers without hallucinations. |
| **Present me Summary** | **Hybrid / Structurally Enforced** | Urgency scoring uses deterministic heuristics (safety keywords, submitter roles, SLA limits) as an authoritative boundary, while the LLM provides natural operational language summaries validated via Zod. |
| **Approval Actions / Queue State** | **Deterministic Only** | Approvals, rejections, coordinate validation, and queue counts must never depend on non-deterministic model output. |

### Fallback Design
Every server-side AI invocation is wrapped in a strict **8-second timeout** (`AbortController`). If the provider API key is absent, rate-limited, timed out, or returns invalid JSON:
1. The endpoint catches the condition cleanly without returning raw 500s or crashing the UI.
2. A deterministic rule-based response is generated immediately.
3. For streaming endpoints (`/chat`, `/help`, `/teach`), fallback text is sliced into token chunks and streamed via SSE to maintain seamless UX.
4. The UI displays an explicit **"Offline Rule Fallback"** badge so operators always know whether information was synthesized by the live model or generated deterministically.

### What Would Be Done Differently With More Time
With more time, I would implement persistent vector embeddings using pgvector/libsql with hybrid BM25 + dense semantic reranking, alongside WebRTC audio streaming to allow operators to converse with the assistant hands-free while reviewing 3D point clouds.

---

## 4. Setup & Running Instructions

### Requirements
- Node.js `v20.x` or `v22.x`
- npm `v10.x`

### Installation
```bash
# Clone the repository and navigate into the crystal-ball project directory
cd crystal-ball

# Create environment file from template
cp .env.example .env.local
```

### Environment Variables Setup
Edit `.env.local`:
```env
# Optional: Provide Anthropic or OpenAI API key.
# If omitted, the entire application functions flawlessly in offline fallback mode!
ANTHROPIC_API_KEY=your_anthropic_api_key_here
# or
OPENAI_API_KEY=your_openai_api_key_here

LLM_TIMEOUT_MS=8000
```

### Running the Application
```bash
# Run Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Automated Tests & Type Checks

Run the automated test suites:
```bash
# Run all unit and integration test suites
npm test

# Run TypeScript strict type-checking
npm run type-check
```

### Test Suite Summary:
- **Unit Tests (`tests/unit.test.ts`)**:
  - Fixture validation: 4 records, correct types, exact submitters.
  - Zod schema validation: `SummaryResponseSchema`, `GreetingResponseSchema`, `ChatRequestSchema`.
  - Prompt versioning: Version 1.0.0 templates under `src/prompts/*.ts`.
  - RAG retrieval: Keyword matching for SLA policies and drone inspection boundaries.
  - Rate limiting: 30-request window threshold enforcement.
- **Integration Tests (`tests/integration.test.ts`)**:
  - `POST /api/assistant/summary`: Validates structured JSON and graceful offline fallback.
  - `POST /api/assistant/greeting`: Dynamic context-aware greeting without raw crashes.
  - `POST /api/assistant/chat`: Incremental SSE stream parsing and `[DONE]` event propagation.
  - Input validation: Returns HTTP 400 with Zod error details on malformed requests.

---

## 6. AI Tool Usage Disclosure

In compliance with the assignment instructions, AI coding assistance was utilized during this implementation:
- Used for scaffolding initial boilerplate and formulating test cases.
- Architecture, prompt engineering, RAG logic, Zod schemas, fallback resilience, and streaming integration were designed and verified end-to-end to meet the Wave 2 technical standards.
