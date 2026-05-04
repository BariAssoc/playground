# BariAccess AI Agentic Architecture
### Ollie & AskABA — Complete Design & Build Specification

---

## Table of Contents

1. [Conceptual Roles](#1-conceptual-roles)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Agent Internals — The Four-Layer Model](#3-agent-internals--the-four-layer-model)
4. [Trigger Architecture](#4-trigger-architecture)
5. [Handoff Protocol](#5-handoff-protocol-ollie--askaba)
6. [Guardrails & Safety Layer](#6-guardrails--safety-layer)
7. [Cosmos DB Schema](#7-cosmos-db-schema-for-agent-interactions)
8. [Azure AI Search — RAG Index Design](#8-azure-ai-search--rag-index-design)
9. [Implementation Roadmap](#9-implementation-roadmap)
10. [Key Architectural Decisions](#10-key-architectural-decisions-summary)
11. [How to Build the Stack — Layer by Layer](#11-how-to-build-the-stack--layer-by-layer)
12. [How RAG Works](#12-how-rag-works)
13. [What Changes vs What Stays Fixed](#13-what-changes-vs-what-stays-fixed)
14. [Where Vector Storage Lives](#14-where-vector-storage-lives)
15. [Complete Services & LLM Inventory](#15-complete-services--llm-inventory)

---

## 1. Conceptual Roles

Ollie and AskABA are two distinct agents with clearly separated responsibilities.

| Dimension | **Ollie** | **AskABA** |
|---|---|---|
| Persona | Warm, encouraging companion | Clinical, behavioral knowledge engine |
| Primary user | Patient (client app) | Patient + Provider (both surfaces) |
| Mode | Proactive nudge, emotional support, habit coaching | Reactive Q&A, data-grounded answers |
| Tone | Conversational, motivational, playful | Precise, evidence-based, calm |
| Context window | Behavioral state, Daily Routine Segments, streaks, mood | ABAEMR data, biometrics, visit notes, tier progress |
| Trigger | Time-based, event-based, gamification events | User-initiated query |
| Memory type | Short-term behavioral memory + longitudinal habit trends | Clinical + behavioral long-term memory via RAG |

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   BariAccess Client/Provider App         │
│          (React Native / React Web)                      │
└────────────┬────────────────────────┬───────────────────┘
             │                        │
       Ollie SDK                 AskABA SDK
     (client app)           (client + provider)
             │                        │
             ▼                        ▼
┌─────────────────────────────────────────────────────────┐
│              Azure API Gateway / Function Layer          │
│         (auth, rate limiting, session routing)           │
└────────────┬────────────────────────┬───────────────────┘
             │                        │
    ┌────────▼────────┐     ┌─────────▼──────────┐
    │  Ollie Agent    │     │   AskABA Agent      │
    │  Service        │     │   Service           │
    │  (Azure Func)   │     │   (Azure Func)      │
    └────────┬────────┘     └─────────┬───────────┘
             │                        │
    ┌────────▼────────────────────────▼───────────┐
    │           Shared Cognitive Layer             │
    │  ┌─────────────┐   ┌───────────────────┐   │
    │  │ Cosmos DB   │   │ Azure AI Search   │   │
    │  │ (ABAEMR +   │   │ (RAG index over   │   │
    │  │  behavioral │   │  clinical notes,  │   │
    │  │  events)    │   │  guidelines, EMR) │   │
    │  └─────────────┘   └───────────────────┘   │
    │  ┌─────────────┐   ┌───────────────────┐   │
    │  │ Azure Blob  │   │ Spike API Bridge  │   │
    │  │ (long-term  │   │ (Garmin, Oura,    │   │
    │  │  summaries) │   │  Withings, Whoop) │   │
    │  └─────────────┘   └───────────────────┘   │
    └─────────────────────────────────────────────┘
```

---

## 3. Agent Internals — The Four-Layer Model

Each agent is built with four stacked layers.

### Layer 1: System Prompt (Identity + Guardrails)

The static constitution of each agent — defines persona, scope, tone, what it will and won't do, and how it should fail gracefully.

**Ollie System Prompt skeleton:**
```
You are Ollie, the behavioral wellness companion inside BariAccess.
Your role: proactively encourage, coach habits, celebrate milestones,
and gently redirect when patients slip. You speak warmly, briefly, and
always in the patient's frame of reference. You have access to today's
Daily Routine Segments, recent ABA Score trends, CPIE/CCIE credits,
current tier, and wearable signals.

You NEVER provide medical advice. If a patient asks a clinical question,
you hand off to AskABA or tell them to contact their care team.
You NEVER fabricate biometric data. If data is missing, say so.
You maintain a consistent, caring personality across sessions.
```

**AskABA System Prompt skeleton:**
```
You are AskABA, the clinical and behavioral knowledge engine inside
BariAccess. You answer patient and provider questions grounded in
their actual data: ABAEMR records, wearable biometrics, visit notes,
medication logs, and evidence-based bariatric guidelines.

You are precise, calm, and thorough. You cite sources when relevant
(visit dates, biometric values, published guidelines). You flag
uncertainty explicitly. You NEVER guess about medication dosing —
always defer to the clinical record or the provider.
```

---

### Layer 2: Tool Set

#### Ollie's Tool Set

| Tool | Description |
|---|---|
| `get_daily_routine_segments()` | Fetch today's segment structure for the patient |
| `get_aba_score_trend(days=7)` | Retrieve recent ABA Score history |
| `get_cpie_ccie_balance()` | Get current credit balance and recent events |
| `get_active_tier()` | Return patient's current tier (Foundation Core → Ascend) |
| `get_wearable_snapshot()` | Latest HRV, steps, sleep score from Spike API |
| `log_behavioral_event(type, value)` | Record a behavioral event (e.g., mood check-in) |
| `send_nudge(message, delivery_type)` | Schedule or deliver a push notification |
| `get_streak_status()` | Return habit streak data across tracked behaviors |
| `get_pulse_responses(date)` | Retrieve Daily Pulses input for a given day |
| `escalate_to_askaba(query)` | Hand off a clinical question to AskABA |

#### AskABA's Tool Set

| Tool | Description |
|---|---|
| `search_clinical_notes(query)` | RAG search over visit notes and ABAEMR |
| `get_medication_log(patient_id)` | Retrieve medication history (GLP-1 dosing, titration) |
| `get_biometric_history(metric, days)` | Pull time-series from Cosmos DB (weight, HRV, etc.) |
| `get_lab_results(patient_id)` | Retrieve lab values from EMR integration |
| `get_tier_progress_summary()` | Summarize CPIE/CCIE progress and tier position |
| `get_fibroscan_seca_data()` | Retrieve body composition and liver scan records |
| `search_clinical_guidelines(query)` | RAG search over uploaded clinical reference docs |
| `get_wearable_longitudinal(device, metric, days)` | Long-range biometric trend via Spike API |
| `flag_for_provider_review(reason)` | Create a flag in the provider dashboard |
| `get_visit_summary(visit_id)` | Pull structured summary of a specific visit |

---

### Layer 3: Memory Architecture

AI agents are stateless by default — all memory must be injected at call time. BariAccess uses a three-tier memory model.

```
┌──────────────────────────────────────────────┐
│  Tier A: In-Context (Injected per call)       │
│  - Today's segment, last pulse responses      │
│  - Last 3 Ollie interactions (for continuity) │
│  - Current ABA Score + tier                   │
└──────────────────────────────────────────────┘
         ↓ retrieved at call time
┌──────────────────────────────────────────────┐
│  Tier B: Short-Term (Cosmos DB, rolling 30d) │
│  - Behavioral event log                       │
│  - Wearable snapshot history                 │
│  - Nudge/interaction history                 │
│  - Daily Pulses log                          │
└──────────────────────────────────────────────┘
         ↓ retrieved on demand via tools
┌──────────────────────────────────────────────┐
│  Tier C: Long-Term (Azure AI Search RAG)     │
│  - Clinical visit notes (all visits)         │
│  - Medication titration history              │
│  - ABAEMR structured records                 │
│  - Clinical guideline documents              │
│  - FibroScan / SECA scan history             │
└──────────────────────────────────────────────┘
```

At every agent call, construct a **context bundle** — a JSON payload injected into the system/user messages containing the Tier A data relevant to that patient's session. Never rely on the model to "remember" prior turns unless they are explicitly in the message array.

---

### Layer 4: Orchestration Engine (Agentic Loop)

```python
# Pseudocode — agentic loop for Ollie
def run_ollie_agent(patient_id: str, trigger: dict) -> AgentResponse:
    context = build_context_bundle(patient_id)        # Tier A data
    messages = [build_initial_message(trigger, context)]
    tools = OLLIE_TOOL_DEFINITIONS                    # Layer 2 tools

    while True:
        response = anthropic.messages.create(
            model="claude-sonnet-4-20250514",
            system=OLLIE_SYSTEM_PROMPT,               # Layer 1
            messages=messages,
            tools=tools,
            max_tokens=1000
        )

        if response.stop_reason == "end_turn":
            return format_agent_response(response)

        if response.stop_reason == "tool_use":
            tool_results = []
            for tool_call in get_tool_calls(response):
                result = execute_tool(tool_call, patient_id)
                tool_results.append(build_tool_result(tool_call.id, result))

            messages.append({"role": "assistant", "content": response.content})
            messages.append({"role": "user", "content": tool_results})
            # Loop continues — model sees tool results, decides next step
```

---

## 4. Trigger Architecture

### Ollie — Proactive Triggers

| Category | Trigger Examples |
|---|---|
| Time-based | Morning segment start (7 AM), pre-meal window (12 PM, 6 PM), wind-down segment (9 PM), streak milestone (Day 7, 14, 30) |
| Event-based | ABA Score drops >15% in 48h, Daily Pulse missed 2+ days, new tier unlocked, CPIE/CCIE threshold crossed, wearable HRV below Beacon Corridor, weight measurement recorded |
| Patient-initiated | Tap Ollie button in app, complete a Daily Pulse, log a food/mood entry |

Each trigger carries a **trigger payload** — structured metadata passed to the agent so it can contextualize its response.

### AskABA — Reactive Triggers

AskABA is purely user-initiated. The orchestration layer determines:

1. Is this a clinical question → AskABA handles it
2. Is this a behavioral coaching question → Ollie handles it
3. Does this require both → Ollie responds with warm framing, AskABA provides the data layer

---

## 5. Handoff Protocol (Ollie ↔ AskABA)

```python
# Inside Ollie's tool execution
def execute_tool(tool_call, patient_id):
    if tool_call.name == "escalate_to_askaba":
        query = tool_call.input["query"]
        askaba_response = run_askaba_agent(patient_id, query)
        return {
            "source": "AskABA",
            "response": askaba_response.text,
            "confidence": askaba_response.confidence
        }
```

On the UI side, this surfaces as a visual handoff — Ollie's bubble says *"That's a great question for AskABA — let me pull that up for you"* and the AskABA interface slides in with the answer.

---

## 6. Guardrails & Safety Layer

### System Prompt Level
- Hard stops on medication dosing recommendations
- No fabrication of biometric values
- Required escalation phrases for crisis-adjacent conversations
- Never impersonate Dr. Andrei or the clinical team

### Code Level (Pre/Post-Processing)

```python
class AgentGuardrails:

    BLOCKED_TOPICS = [
        "suicide", "self-harm", "eating disorder behaviors",
        "medication overdose", "laxative abuse"
    ]

    def pre_process(self, user_input: str) -> SafetyResult:
        for topic in self.BLOCKED_TOPICS:
            if topic in user_input.lower():
                return SafetyResult(
                    blocked=True,
                    redirect_to="crisis_resources",
                    escalate_to_provider=True
                )
        return SafetyResult(blocked=False)

    def post_process(self, agent_output: str) -> SafetyResult:
        # Check model output for hallucinated clinical claims
        # Flag responses containing specific dosing numbers
        # Ensure no PII leakage across patient accounts
        pass
```

### Audit Layer

Every agent interaction logs to Cosmos DB:
- Patient ID, timestamp, trigger type
- Full message array (for compliance)
- Tool calls made + results returned
- Final output delivered
- Any guardrail flags triggered

---

## 7. Cosmos DB Schema for Agent Interactions

**Container: `agent_sessions`**
```json
{
  "id": "session_uuid",
  "patient_id": "pt_001",
  "agent": "ollie",
  "trigger_type": "aba_score_drop",
  "trigger_payload": { },
  "messages": [ ],
  "tool_calls": [ ],
  "final_output": "...",
  "guardrail_flags": [],
  "created_at": "2026-04-20T08:30:00Z",
  "duration_ms": 1840
}
```

**Container: `agent_memory_summaries`**
```json
{
  "id": "memory_uuid",
  "patient_id": "pt_001",
  "agent": "ollie",
  "summary_type": "behavioral_weekly",
  "period_start": "2026-04-13",
  "period_end": "2026-04-20",
  "summary_text": "Patient showed strong Morning Segment adherence...",
  "key_signals": { },
  "generated_at": "2026-04-20T00:00:00Z"
}
```

---

## 8. Azure AI Search — RAG Index Design

```
Index: bari-clinical-rag
├── Source 1: Visit Notes (Cosmos DB → indexed nightly)
│   Fields: patient_id, visit_date, provider, full_text,
│           medications_mentioned, chief_complaint, plan
│
├── Source 2: ABAEMR Records (structured → text converted)
│   Fields: patient_id, record_type, date, values, notes
│
├── Source 3: Clinical Guidelines (static PDFs → chunked)
│   Fields: guideline_name, version, section, chunk_text
│   Examples: ASMBS guidelines, GLP-1 prescribing info,
│             BariAccess F.A.C.T.S. framework docs
│
└── Source 4: Medication Reference (static)
    Fields: drug_name, class, dosing_schedule,
            side_effects, contraindications
```

RAG retrieval strategy for AskABA:
1. Embed the user query (Azure OpenAI `text-embedding-3-small`)
2. Hybrid search: vector similarity + keyword BM25
3. Filter by `patient_id` for personal records; no filter for guidelines
4. Return top-5 chunks, inject into context window
5. Model cites source and date in its response

---

## 9. Implementation Roadmap

### Phase 1 — Foundation (Weeks 1–3)
- [ ] Define and register all tool function signatures in Azure Functions
- [ ] Build context bundle constructor (Tier A data assembly)
- [ ] Implement agentic loop for Ollie (no tools yet — test persona only)
- [ ] Implement agentic loop for AskABA (no tools yet — test RAG only)
- [ ] Set up `agent_sessions` Cosmos DB container and audit logging

### Phase 2 — Tool Integration (Weeks 4–6)
- [ ] Connect Spike API bridge tools (wearable snapshot, longitudinal)
- [ ] Connect Cosmos DB read tools (behavioral history, ABA Scores)
- [ ] Connect Azure AI Search (clinical notes RAG for AskABA)
- [ ] Implement guardrails pre/post-processing layer
- [ ] Build handoff protocol (Ollie → AskABA escalation)

### Phase 3 — Trigger Infrastructure (Weeks 7–8)
- [ ] Build trigger event bus (Azure Service Bus or Event Grid)
- [ ] Implement time-based triggers (Azure Timer Functions)
- [ ] Implement event-based triggers (Cosmos DB change feed)
- [ ] Connect push notification delivery via `send_nudge` tool

### Phase 4 — UI Integration (Weeks 9–10)
- [ ] Connect Ollie agent to client app chat surface
- [ ] Connect AskABA agent to both client and provider surfaces
- [ ] Build visual handoff animation (Ollie → AskABA transition)
- [ ] Stream responses to UI (Anthropic streaming API)
- [ ] QA: test all trigger types end-to-end

### Phase 5 — Memory & Personalization (Weeks 11–12)
- [ ] Implement weekly behavioral summary generation (background job)
- [ ] Build Tier B memory injection into context bundles
- [ ] Tune system prompts based on real interaction logs
- [ ] Build provider-facing agent interaction review dashboard

---

## 10. Key Architectural Decisions Summary

| Decision | Choice | Rationale |
|---|---|---|
| LLM | Claude Sonnet (`claude-sonnet-4-20250514`) | Best tool-use reliability, appropriate cost |
| Agent framework | Native Anthropic tool use loop (no LangChain) | Full control, lower latency, no abstraction overhead |
| Memory | Three-tier (in-context + Cosmos + RAG) | Covers immediacy, recent history, and deep clinical recall |
| Trigger bus | Azure Service Bus | Durable, ordered, exactly-once delivery |
| RAG | Azure AI Search hybrid | Already in Azure stack, HIPAA-eligible, supports patient_id filtering |
| Handoff | Tool-mediated escalation | Keeps conversation continuity in single UI surface |
| Safety | Multi-layer (prompt + code + audit) | Defense in depth for clinical context |
| Streaming | Anthropic streaming API | Real-time response feel for chat surfaces |

---

## 11. How to Build the Stack — Layer by Layer

### Layer 1 — The SDKs (React Native + React Web)

The SDK is a thin TypeScript module that lives in your client app. It handles auth headers, session IDs, and streaming.

**`src/sdk/OllieSDK.ts`:**
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OllieTrigger {
  type: 'time_based' | 'event_based' | 'user_initiated';
  event?: string;
  payload?: Record<string, unknown>;
  userMessage?: string;
}

export interface AgentMessage {
  role: 'assistant' | 'user';
  content: string;
  timestamp: string;
  toolCallsMade?: string[];
}

class OllieSDK {
  private baseUrl: string;
  private sessionId: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async getAuthHeader(): Promise<Record<string, string>> {
    const token = await AsyncStorage.getItem('bari_access_token');
    const patientId = await AsyncStorage.getItem('patient_id');
    return {
      'Authorization': `Bearer ${token}`,
      'X-Patient-ID': patientId ?? '',
      'X-Session-ID': this.sessionId ?? crypto.randomUUID(),
      'Content-Type': 'application/json',
    };
  }

  async invoke(trigger: OllieTrigger): Promise<AgentMessage> {
    const headers = await this.getAuthHeader();
    const res = await fetch(`${this.baseUrl}/api/ollie/invoke`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ trigger }),
    });
    if (!res.ok) throw new Error(`Ollie invoke failed: ${res.status}`);
    return res.json();
  }

  async *stream(trigger: OllieTrigger): AsyncGenerator<string> {
    const headers = await this.getAuthHeader();
    const res = await fetch(`${this.baseUrl}/api/ollie/stream`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ trigger }),
    });
    if (!res.ok || !res.body) throw new Error('Stream failed');
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const lines = decoder.decode(value).split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));
          if (data.type === 'content_block_delta') {
            yield data.delta.text ?? '';
          }
        }
      }
    }
  }
}

export const ollieSDK = new OllieSDK(process.env.EXPO_PUBLIC_API_URL!);
```

**`src/sdk/AskABASDK.ts`:**
```typescript
class AskABASDK {
  private baseUrl: string;
  constructor(baseUrl: string) { this.baseUrl = baseUrl; }

  async *ask(question: string, context?: Record<string, unknown>): AsyncGenerator<string> {
    const token = await AsyncStorage.getItem('bari_access_token');
    const patientId = await AsyncStorage.getItem('patient_id');
    const res = await fetch(`${this.baseUrl}/api/askaba/stream`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Patient-ID': patientId ?? '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, context }),
    });
    if (!res.ok || !res.body) throw new Error('AskABA stream failed');
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      for (const line of decoder.decode(value).split('\n')) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));
          if (data.type === 'content_block_delta') yield data.delta.text ?? '';
        }
      }
    }
  }
}

export const askABASDK = new AskABASDK(process.env.EXPO_PUBLIC_API_URL!);
```

---

### Layer 2 — Azure API Management (APIM)

**Bicep definition (`apim.bicep`):**
```bicep
resource apim 'Microsoft.ApiManagement/service@2023-05-01-preview' = {
  name: 'bariacccess-apim'
  location: resourceGroup().location
  sku: { name: 'Consumption', capacity: 0 }
  properties: {
    publisherEmail: 'andrei@bariassociates.com'
    publisherName: 'Bariatric Associates'
  }
}

resource ollieApi 'Microsoft.ApiManagement/service/apis@2023-05-01-preview' = {
  parent: apim
  name: 'ollie-api'
  properties: {
    displayName: 'Ollie Agent API'
    path: 'api/ollie'
    protocols: ['https']
    serviceUrl: 'https://bari-ollie-func.azurewebsites.net'
  }
}

resource askABAApi 'Microsoft.ApiManagement/service/apis@2023-05-01-preview' = {
  parent: apim
  name: 'askaba-api'
  properties: {
    displayName: 'AskABA Agent API'
    path: 'api/askaba'
    protocols: ['https']
    serviceUrl: 'https://bari-askaba-func.azurewebsites.net'
  }
}
```

**JWT validation policy (inbound policy XML):**
```xml
<policies>
  <inbound>
    <validate-jwt header-name="Authorization" failed-validation-httpcode="401">
      <openid-config url="https://login.microsoftonline.com/{tenant}/.well-known/openid-configuration"/>
      <required-claims>
        <claim name="aud"><value>bariacccess-api</value></claim>
      </required-claims>
    </validate-jwt>
    <rate-limit-by-key calls="60" renewal-period="60"
      counter-key="@(context.Request.Headers.GetValueOrDefault("X-Patient-ID","anon"))"/>
    <set-header name="X-Verified-Patient-ID" exists-action="override">
      <value>@(context.Request.Headers.GetValueOrDefault("X-Patient-ID",""))</value>
    </set-header>
    <base/>
  </inbound>
</policies>
```

---

### Layer 3 — Azure Function Agent Services

**`bari-ollie-func/function_app.py`:**
```python
import azure.functions as func
import json, os, logging
from azure.cosmos import CosmosClient
from anthropic import Anthropic

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)
anthropic_client = Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])
cosmos_client = CosmosClient(os.environ["COSMOS_URI"], os.environ["COSMOS_KEY"])
db = cosmos_client.get_database_client("bariacccess")

OLLIE_SYSTEM_PROMPT = """
You are Ollie, the behavioral wellness companion inside BariAccess.
You speak warmly and briefly. You have access to tools for today's
Daily Routine Segments, ABA Scores, CPIE/CCIE credits, tier status,
wearable snapshots, and behavioral event logging.

Rules:
- Never provide medication dosing advice — always defer to AskABA or the care team.
- Never fabricate biometric values. If data is missing, say so clearly.
- Keep responses to 2-4 sentences unless the patient asks a detailed question.
- If a clinical question arises, call the escalate_to_askaba tool.
- Maintain a warm, encouraging tone at all times.
"""

@app.route(route="invoke", methods=["POST"])
async def ollie_invoke(req: func.HttpRequest) -> func.HttpResponse:
    patient_id = req.headers.get("X-Verified-Patient-ID")
    if not patient_id:
        return func.HttpResponse("Unauthorized", status_code=401)

    body = req.get_json()
    trigger = body.get("trigger", {})

    try:
        context_bundle = await build_context_bundle(patient_id)
        response_text = await run_ollie_agent(patient_id, trigger, context_bundle)
        await log_agent_session(patient_id, "ollie", trigger, response_text)
        return func.HttpResponse(
            json.dumps({"role": "assistant", "content": response_text}),
            mimetype="application/json"
        )
    except Exception as e:
        logging.error(f"Ollie agent error: {e}")
        return func.HttpResponse("Agent error", status_code=500)
```

---

### Layer 4 — The Agentic Loop Engine

**`shared/agent_loop.py`:**
```python
import json, logging
from anthropic import Anthropic
from typing import Any

client = Anthropic()

async def run_agent_loop(
    system_prompt: str,
    tool_definitions: list[dict],
    tool_executor,
    initial_messages: list[dict],
    patient_id: str,
    max_iterations: int = 8
) -> tuple[str, list[dict]]:
    messages = list(initial_messages)
    tool_calls_audit = []

    for iteration in range(max_iterations):
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            system=system_prompt,
            messages=messages,
            tools=tool_definitions,
        )

        if response.stop_reason == "end_turn":
            final_text = " ".join(
                block.text for block in response.content
                if hasattr(block, "text")
            )
            return final_text, tool_calls_audit

        if response.stop_reason == "tool_use":
            messages.append({"role": "assistant", "content": response.content})
            tool_results = []
            for block in response.content:
                if block.type == "tool_use":
                    tool_calls_audit.append({
                        "tool": block.name,
                        "input": block.input,
                        "iteration": iteration
                    })
                    result = await tool_executor(block.name, block.input, patient_id)
                    tool_results.append({
                        "type": "tool_result",
                        "tool_use_id": block.id,
                        "content": json.dumps(result)
                    })
            messages.append({"role": "user", "content": tool_results})
        else:
            break

    return "I'm having trouble right now. Please try again.", tool_calls_audit
```

**Context bundle builder (`shared/context_bundle.py`):**
```python
async def build_context_bundle(patient_id: str) -> dict:
    import asyncio
    (aba, tier, credits, segments, pulses, events, wearables) = await asyncio.gather(
        get_aba_score_today(patient_id),
        get_active_tier(patient_id),
        get_cpie_balance(patient_id),
        get_todays_segments(patient_id),
        get_daily_pulse_responses(patient_id),
        get_recent_behavioral_events(patient_id, days=3),
        get_wearable_snapshot(patient_id),
        return_exceptions=True
    )

    return {
        "patient_id": patient_id,
        "today_aba_score": aba if not isinstance(aba, Exception) else None,
        "active_tier": tier if not isinstance(tier, Exception) else "unknown",
        "cpie_ccie_balance": credits if not isinstance(credits, Exception) else {},
        "todays_segments": segments if not isinstance(segments, Exception) else [],
        "daily_pulse_responses": pulses if not isinstance(pulses, Exception) else [],
        "recent_behavioral_events": events if not isinstance(events, Exception) else [],
        "wearable_snapshot": wearables if not isinstance(wearables, Exception) else {},
        "data_freshness_utc": datetime.utcnow().isoformat()
    }
```

**Ollie tool definitions (`agents/ollie/tools.py`):**
```python
OLLIE_TOOL_DEFINITIONS = [
    {
        "name": "get_aba_score_trend",
        "description": "Get the patient's ABA Score trend for the past N days.",
        "input_schema": {
            "type": "object",
            "properties": {
                "days": {"type": "integer", "description": "Number of days to look back", "default": 7}
            },
            "required": []
        }
    },
    {
        "name": "get_streak_status",
        "description": "Get current habit streak data across all tracked behaviors.",
        "input_schema": {"type": "object", "properties": {}, "required": []}
    },
    {
        "name": "log_behavioral_event",
        "description": "Log a behavioral event for the patient.",
        "input_schema": {
            "type": "object",
            "properties": {
                "event_type": {"type": "string"},
                "value": {"type": "object"}
            },
            "required": ["event_type", "value"]
        }
    },
    {
        "name": "get_wearable_snapshot",
        "description": "Get latest wearable signals: HRV, steps, sleep score, resting HR.",
        "input_schema": {"type": "object", "properties": {}, "required": []}
    },
    {
        "name": "escalate_to_askaba",
        "description": "Escalate a clinical or medication question to AskABA.",
        "input_schema": {
            "type": "object",
            "properties": {
                "question": {"type": "string"}
            },
            "required": ["question"]
        }
    }
]
```

**Ollie tool executor (`agents/ollie/tool_executor.py`):**
```python
async def execute_ollie_tool(tool_name: str, tool_input: dict, patient_id: str) -> Any:
    match tool_name:
        case "get_aba_score_trend":
            return await cosmos_queries.get_aba_score_trend(patient_id, tool_input.get("days", 7))
        case "get_streak_status":
            return await cosmos_queries.get_streak_status(patient_id)
        case "log_behavioral_event":
            return await cosmos_queries.log_behavioral_event(
                patient_id, tool_input["event_type"], tool_input["value"]
            )
        case "get_wearable_snapshot":
            return await spike_bridge.get_wearable_snapshot(patient_id)
        case "escalate_to_askaba":
            from agents.askaba.agent import run_askaba_agent
            askaba_response = await run_askaba_agent(
                patient_id=patient_id,
                question=tool_input["question"]
            )
            return {"source": "AskABA", "answer": askaba_response}
        case _:
            return {"error": f"Unknown tool: {tool_name}"}
```

---

### Layer 5 — Cognitive Layer Connections

**Cosmos DB queries (`shared/cosmos_queries.py`):**
```python
async def get_aba_score_trend(patient_id: str, days: int) -> list[dict]:
    async with CosmosClient(COSMOS_URI, COSMOS_KEY) as client:
        container = client.get_database_client("bariacccess") \
                          .get_container_client("behavioral_events")
        cutoff = (datetime.utcnow() - timedelta(days=days)).isoformat()
        query = """
            SELECT c.timestamp, c.aba_score, c.domain_scores
            FROM c
            WHERE c.patient_id = @pid
              AND c.event_type = 'aba_score_computed'
              AND c.timestamp >= @cutoff
            ORDER BY c.timestamp ASC
        """
        params = [{"name": "@pid", "value": patient_id},
                  {"name": "@cutoff", "value": cutoff}]
        return [item async for item in container.query_items(query, parameters=params)]
```

**Azure AI Search RAG bridge (`agents/askaba/rag.py`):**
```python
async def search_clinical_notes(patient_id: str, query: str, top: int = 5) -> list[dict]:
    embedding_resp = await openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=query
    )
    query_vector = embedding_resp.data[0].embedding

    vector_query = VectorizedQuery(
        vector=query_vector,
        k_nearest_neighbors=top,
        fields="content_vector"
    )

    results = []
    async for result in await search_client.search(
        search_text=query,
        vector_queries=[vector_query],
        filter=f"patient_id eq '{patient_id}' or source_type eq 'clinical_guideline'",
        select=["chunk_text", "source_type", "visit_date", "document_title"],
        top=top
    ):
        results.append({
            "text": result["chunk_text"],
            "source": result["source_type"],
            "date": result.get("visit_date"),
            "title": result.get("document_title"),
            "score": result["@search.score"]
        })

    return results
```

**Spike API bridge (`shared/spike_bridge.py`):**
```python
async def get_wearable_snapshot(patient_id: str) -> dict:
    headers = {"Authorization": f"Bearer {SPIKE_KEY}"}
    async with httpx.AsyncClient() as http:
        spike_user_id = await get_spike_user_id(patient_id)
        if not spike_user_id:
            return {"error": "No wearable devices connected"}

        import asyncio
        tasks = {
            "hrv": http.get(f"{SPIKE_BASE}/users/{spike_user_id}/hrv/latest", headers=headers),
            "steps": http.get(f"{SPIKE_BASE}/users/{spike_user_id}/steps/latest", headers=headers),
            "sleep_score": http.get(f"{SPIKE_BASE}/users/{spike_user_id}/sleep/latest", headers=headers),
            "resting_hr": http.get(f"{SPIKE_BASE}/users/{spike_user_id}/heart_rate/resting", headers=headers),
        }

        responses = await asyncio.gather(*tasks.values(), return_exceptions=True)
        snapshot = {}
        for key, resp in zip(tasks.keys(), responses):
            if isinstance(resp, Exception):
                snapshot[key] = None
            elif resp.status_code == 200:
                snapshot[key] = resp.json().get("value")
            else:
                snapshot[key] = None

        return snapshot
```

---

### Deployment: `azure.yaml`

```yaml
name: bariacccess-ai-agents
services:
  ollie-agent:
    project: ./bari-ollie-func
    language: python
    host: function
  askaba-agent:
    project: ./bari-askaba-func
    language: python
    host: function
  apim:
    project: ./infrastructure
    host: bicep
```

---

### Build Order Summary

| Step | What | Tool |
|---|---|---|
| 1 | Create two Azure Function Apps (Python 3.11) | Azure Portal / `azd up` |
| 2 | Deploy APIM with JWT policy and rate limiting | Bicep |
| 3 | Wire Cosmos DB with `agent_sessions` + `behavioral_events` containers | Azure Portal |
| 4 | Create Azure AI Search index `bari-clinical-rag` with semantic config | Azure Portal |
| 5 | Add Spike API key + Anthropic API key to Function App env vars | Azure Portal |
| 6 | Deploy `shared/` lib + `agents/ollie/` + `agents/askaba/` | `azd up` |
| 7 | Add `OllieSDK.ts` + `AskABASDK.ts` to React Native app | Cursor |
| 8 | Wire SDK calls to chat UI components | Cursor |
| 9 | Set up Azure Service Bus for proactive trigger events | Azure Portal |
| 10 | Configure timer triggers in `function_app.py` for time-based nudges | Code |

**Critical path:** Steps 1 → 3 → 5 → 6 → 7. You can have Ollie talking to the app without APIM, RAG, or Spike in place. Add those in subsequent sprints once the core loop is verified working end-to-end.

---

## 12. How RAG Works

RAG (Retrieval-Augmented Generation) solves a fundamental problem with LLMs: they only know what they were trained on. For AskABA, the system needs to answer questions grounded in actual patient data — specific visit notes, real medication history, real biometric trends — none of which was in any training set.

**Core intuition:** Instead of asking the AI to remember everything, build a library, search it at question time, and hand the relevant pages to the AI right before it answers.

### Phase 1 — Indexing (runs nightly)

```
Raw docs → Chunker → Embedding model → Search index
(visit notes,   (300–500       (text-embedding-   (chunk_text +
 labs, PDFs,     token           3-small)           metadata +
 ABAEMR)         passages)       text→[0.12,−0.87…] content_vector)
```

Each record stored in the index contains three fields:

| Field | Content |
|---|---|
| `chunk_text` | Raw passage text (300–500 tokens) |
| `metadata` | `patient_id`, `visit_date`, `source_type`, `document_title` |
| `content_vector` | 1536 floating point numbers encoding the passage's meaning |

The embedding model converts any passage of text into a list of ~1536 numbers that encodes its *meaning* in mathematical space. Passages about similar topics end up as vectors that are geometrically close to each other, even if they use completely different words. "Tirzepatide dose increase" and "Zepbound titration adjustment" become nearby points in that space.

### Phase 2 — Retrieval + Generation (every query)

```
Patient question
      ↓
Embed query (same model as index)
      ↓
Vector search (cosine similarity, top 5)
      ↓
Top 5 chunks retrieved
      ↓
Context window assembled:
  [System prompt] + [Retrieved chunks] + [Patient question]
      ↓
Claude generates grounded answer
```

### Chunking strategy for clinical notes

Visit notes shouldn't be split mid-sentence or mid-assessment. Chunk by semantic unit — one chunk per visit section (HPI, Assessment, Plan) — rather than a fixed token count. A 400-token hard split will slice through "Assessment: Patient reports nausea on Wegovy 1mg — Plan: reduce to 0.5mg," losing the connection between observation and decision.

### patient_id filtering (HIPAA-critical)

Every query to the index must include a filter so AskABA only retrieves chunks belonging to the patient currently in session. A missing filter is a HIPAA incident:

```python
filter=f"patient_id eq '{patient_id}' or source_type eq 'clinical_guideline'"
```

Clinical guidelines are shared across all patients; personal records are not.

### Hybrid search

Hybrid search (vector + keyword BM25) outperforms pure vector search for clinical data. If a patient asks "what did you find on my InBody scan," the word "InBody" is a proper noun that vector similarity may score weakly. BM25 keyword matching catches exact terminology that embeddings sometimes diffuse. Azure AI Search runs both simultaneously and merges the scores.

---

## 13. What Changes vs What Stays Fixed

| | Does NOT change on use | DOES change on use |
|---|---|---|
| | Fixed, controlled by Anthropic | Controlled by BariAccess, in your stack |
| | Claude model weights (frozen) | RAG index (Azure AI Search) — new docs indexed nightly |
| | Anthropic training runs (Anthropic's schedule) | Cosmos DB behavioral events — every interaction logged live |
| | General medical knowledge (baked in at training time) | Agent session audit log — feeds Tier B memory summaries |

**Key principle:** AskABA gets smarter because your data grows — not because Claude's weights change.

Every visit note Dr. Andrei documents gets chunked and indexed into Azure AI Search — so the next time a patient asks about their history, there's more to retrieve. Every behavioral event, Daily Pulse response, wearable reading, and agent session gets written to Cosmos DB — so Ollie's context bundle gets richer. Every AskABA session gets logged, and those logs can be summarized into the Tier B memory layer, so future responses are informed by patterns across weeks and months of interactions.

The practical effect is the same as the AI "learning" — AskABA's answers about a specific patient become dramatically more specific and accurate over 6 months of use than they are on day one — but the mechanism is different. The AI's capability is constant; the *library it reads from* grows.

**Fine-tuning (future consideration):** If Anthropic offers it, you could train a version of Claude on de-identified BariAccess clinical interactions to make it inherently better at bariatric medicine concepts, tone, and terminology. That would change the weights. For the foreseeable BariAccess roadmap, the RAG + Cosmos memory approach gives most of that benefit without the complexity, cost, and HIPAA surface area of fine-tuning.

---

## 14. Where Vector Storage Lives

Vector storage lives in **Azure AI Search**, inside the `bari-clinical-rag` index.

Each record in the index holds three things together: the raw text of the passage, the metadata about where it came from, and the vector — a list of 1536 floating point numbers (~6KB per record) that encodes the meaning of that passage mathematically.

Azure AI Search uses an algorithm called **HNSW** (Hierarchical Navigable Small World graphs) that lets it find the closest vectors to a query without brute-forcing a comparison against every single record.

### Vector database options considered

| Option | What it is | BariAccess fit |
|---|---|---|
| **Azure AI Search** ✓ | Microsoft-managed, hybrid vector + keyword | Already in Azure stack, HIPAA-eligible, supports `patient_id` filtering |
| Pinecone | Dedicated vector DB, cloud-native | Great product but adds a third-party vendor to HIPAA chain |
| pgvector | Postgres extension for vectors | Good if already on Postgres; adds ops burden on Azure |
| Cosmos DB for MongoDB | Has vector search built in | Could consolidate with existing Cosmos DB but less mature for RAG |
| Weaviate / Qdrant | Dedicated open-source vector DBs | Best-in-class vector features but another service to manage |

Azure AI Search is the right call because it keeps everything inside the Azure trust boundary already established — same subscription, same private networking, same compliance posture as Cosmos DB and Blob storage.

---

## 15. Complete Services & LLM Inventory

### LLMs
- **Claude Sonnet** (`claude-sonnet-4-6`) — Ollie and AskABA agentic loops
- **Azure OpenAI `text-embedding-3-small`** — embedding documents and queries for RAG

### Azure Services
- **Azure API Management (APIM)** — gateway, JWT auth, rate limiting, session routing
- **Azure Functions** (Python 3.11) — Ollie agent service and AskABA agent service
- **Azure Cosmos DB** — ABAEMR, behavioral events, agent sessions, memory summaries
- **Azure AI Search** — vector + keyword RAG index (`bari-clinical-rag`)
- **Azure Blob Storage** — long-term summaries, PDFs, onboarding documents
- **Azure Service Bus** — event bus for proactive Ollie triggers
- **Azure OpenAI Service** — hosts the embedding model
- **Azure Active Directory (Entra ID)** — JWT token issuance and validation

### Third-Party Services
- **Spike API** — wearable data bridge (Garmin, Oura, Withings, Whoop, Apple Health, Polar, Eight Sleep, Freestyle Libre, InBody)
- **Anthropic API** — Claude model access for the agentic loops
- **Apple App Store Connect / TestFlight** — iOS client app deployment
- **ElevenLabs** — narration for patient onboarding video series

### Client App Infrastructure
- **React Native (Expo)** — iOS and Android client app
- **React Web** — provider and admin web app
- **AsyncStorage** — local token and patient ID storage on device

### Development & Deployment
- **Azure Developer CLI (`azd`)** — infrastructure-as-code deployment
- **Bicep** — APIM and infrastructure definitions
- **Cursor** — primary IDE for BariAccess development

**Total: 19 distinct services + 2 LLMs.**

The critical HIPAA-sensitive chain is everything in the Azure group — those all need to be provisioned within a single Azure subscription with private networking and Business Associate Agreements in place before any patient data flows through them.

---

*BariAccess AI Agentic Architecture — Ollie & AskABA Design Specification*
*Bariatric Associates · Generated May 2026*
