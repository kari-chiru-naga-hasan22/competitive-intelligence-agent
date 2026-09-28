# Competitive Intelligence Agent

> **Longitudinal Competitive Intelligence Powered by Persistent Memory and Generative Reasoning.**  
> *Transform scattered competitor observations into structured, evidence-backed strategic intelligence.*

---

## Overview

In competitive intelligence, a single event rarely reveals the full picture. A price reduction, an enterprise security update, or a new marketing tagline can look like tactical noise in isolation. Real strategic shifts emerge only when observations are tracked, preserved, and analyzed **across time**.

Standard AI agents operate statelessly: they ingest a query, perform a point-in-time lookup, and summarize the latest headline. Without persistent memory, they miss the underlying trajectory.

The **Competitive Intelligence Agent** solves this by pairing **Vectorize Hindsight** (for longitudinal persistent memory) with **Google Gemini** (for strategic reasoning). The agent captures continuous competitor signals, remembers competitive history over months, and synthesizes multi-event trends with concrete evidentiary backing.

---

## Core Architecture

```
[ Competitor Observations ]
            │
            ▼
┌─────────────────────────┐
│     Hindsight RETAIN     │  Stores structured [Competitor, Category, Event, Source, Date]
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Persistent Memory Bank  │  Maintains longitudinal competitive history across 90+ days
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│     Hindsight RECALL    │  Retrieves relevant multi-event history for a competitor & question
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│      Gemini Reason      │  Synthesizes strategic signals; separates facts from inferences
└───────────┬─────────────┘
            │
            ▼
[ Evidence-Backed Intelligence ]
- Summary
- Observed Changes (Grounded Facts)
- Strategic Signal (Cautious Inference)
- Watch Next (Leading Indicators)
- Evidence Timeline (Audit Trail)
```

### The 4-Step Pipeline:
1. **Capture**: Competitor events are parsed into structured observations without pre-baked subjective conclusions.
2. **Remember (`Hindsight RETAIN`)**: Canonical memory blocks are stored in the `competitive-intelligence` memory bank with timestamps and category metadata.
3. **Recall (`Hindsight RECALL`)**: Queries retrieve relevant longitudinal memories across products, pricing, packaging, partnerships, and hiring.
4. **Reason (`Gemini 3.7/3.8 Flash`)**: The LLM synthesizes historical changes, distinguishing factual observations from strategic inferences.

---

## Synthetic Benchmark Dataset

> ⚠️ **Disclaimer:** All competitor names, events, pricing changes, announcements, and timelines in this repository are **strictly synthetic** and created solely for demonstration and evaluation purposes. They do not represent real-world companies or events.

The benchmark dataset is located at [`data/competitors.json`](data/competitors.json) and contains **exactly 45 events** spanning a 90-day window (`2026-07-01` to `2026-09-27`):

| Competitor | Focus Area | 90-Day Strategic Arc | Event Count |
| :--- | :--- | :--- | :--- |
| **Acme Cloud** *(Primary Demo)* | Cloud Analytics & AI | Evolves from initial AI features to enterprise security & governance, culminating in a **barbell monetization strategy** (lowering Pro pricing to $39 while locking enterprise accounts into premium AI tiers). | 15 |
| **Nimbus Analytics** | Enterprise BI & Data Infra | Establishes a **compliance and trust moat** with automated schema health, audit trails, SOC2/HIPAA certifications, and data governance partnerships. | 15 |
| **Vertex Data** | Self-Service Analytics | Follows a **product-led growth (PLG)** motion, starting with freemium templates and retail/Stripe workflows before moving upmarket into mid-market SCIM provisioning. | 15 |

### Allowed Categories:
- `product`, `enterprise`, `messaging`, `pricing`, `partnership`, `hiring`, `packaging`

---

## The Key Demo Question

```text
"How has Acme Cloud's strategy changed over the last 90 days?"
```

### Without Memory vs. With Persistent Memory:
- **Without Memory (Stateless LLM):**  
  Sees only the September 27 price drop ($49 → $39).  
  *Output:* "Acme Cloud recently dropped prices on their Pro plan, which may indicate price cutting." (Shallow, misleading).
- **With Hindsight Persistent Memory:**  
  Recalls the full sequence from July 1 to September 27.  
  *Output:* Identifies a coordinated **barbell go-to-market strategy**—reducing entry-tier friction ($39/mo) to capture high-volume users while gating advanced AI and enterprise governance into high-margin tiers.

---

## Getting Started

### Prerequisites
- Node.js 18+ (Node 20+ recommended)
- Vectorize Hindsight API Key
- Google Gemini API Key

### Installation
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables in `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Add your credentials to `.env.local`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   HINDSIGHT_API_KEY=your_hindsight_api_key
   HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
   ```

3. Validate the synthetic dataset:
   ```bash
   npm run validate:data
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Reference

### 1. Seed Demo Data
Populates the Hindsight memory bank with the 45-event synthetic dataset:
```bash
curl -X POST http://localhost:3000/api/seed/fast
```
*Response:*
```json
{
  "success": true,
  "count": 45,
  "results": [...]
}
```

### 2. Query Strategic Intelligence
Analyzes longitudinal strategy for a competitor:
```bash
curl -X POST http://localhost:3000/api/intelligence \
  -H "Content-Type: application/json" \
  -d '{
    "competitor": "Acme Cloud",
    "question": "How has Acme Cloud'\''s strategy changed over the last 90 days?"
  }'
```

*Response Structure:*
```json
{
  "success": true,
  "competitor": "Acme Cloud",
  "question": "How has Acme Cloud's strategy changed over the last 90 days?",
  "insight": {
    "summary": "Over the past 90 days, Acme Cloud has strategically pivoted toward an AI-first analytics positioning while systematically building out enterprise readiness...",
    "observed_changes": [
      "Pivoted product focus and marketing messaging toward AI-first analytics...",
      "Strengthened enterprise governance by adding SSO and advanced access controls...",
      "Bifurcated pricing and packaging by reducing Pro plan pricing to $39/mo while introducing usage-based tiers..."
    ],
    "strategic_signal": "This coordinated pattern could suggest a barbell go-to-market strategy...",
    "watch_next": [
      "Further gating or tiering of core versus advanced AI features...",
      "Additional enterprise compliance announcements..."
    ]
  },
  "evidence": [
    {
      "date": "2026-07-01",
      "category": "product",
      "event": "Launched an AI-powered analytics assistant",
      "source": "Synthetic product announcement"
    }
  ]
}
```

### 3. Ingest Live Competitor Event
Ingests a single new event into memory:
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "competitor": "Acme Cloud",
    "category": "enterprise",
    "event": "Introduced FedRAMP compliance support for public sector analytics",
    "source": "Synthetic product announcement",
    "date": "2026-10-05"
  }'
```

---

## Project Structure

```text
├── app/
│   ├── api/
│   │   ├── events/route.ts       # Live event ingestion (normalize & retain)
│   │   ├── intelligence/route.ts # Recall memories, deduplicate, reason with Gemini
│   │   ├── seed/fast/route.ts    # Direct bulk memory seeding from competitors.json
│   │   ├── seed/ingest/route.ts  # Normalized seed ingestion with deduplication
│   │   └── seed/route.ts         # Dataset inspection endpoint
│   ├── globals.css               # Tailwind CSS styling
│   ├── layout.tsx                # Next.js root layout
│   └── page.tsx                  # Web interface for competitive intelligence
├── content/
│   ├── article.md                # In-depth technical engineering article
│   ├── demo-video-script.md      # 2-5 minute timed demo video script
│   └── social-post.md            # Concise technical social announcement
├── data/
│   └── competitors.json          # 45-event canonical synthetic dataset
├── docs/
│   ├── demo-data.md              # Dataset design & memory pipeline documentation
│   ├── demo-screenshots.md       # UI capture and visual asset checklist
│   ├── demo-story.md             # 60-second executive presentation narrative
│   ├── live-demo-output.json     # Verified live output from Hindsight + Gemini
│   ├── member-3-completion.md    # Handoff and verification report
│   └── presentation-update.md    # Slide-by-slide PPT update specification
├── lib/
│   ├── gemini/client.ts          # Google GenAI client with model fallback
│   └── hindsight.ts              # Hindsight client & canonical memory builder
└── scripts/
    ├── test-live-query.mjs       # Live backend validation runner
    └── validate-data.mjs         # Dataset integrity test suite
```

---

## Limitations

1. **Synthetic Data Scope:** The events in this demo are synthetic observations. Real-world ingestion requires active scrapers, RSS ingestion, and newsfeed filtering.
2. **Context Budgets:** Hindsight recall limits are configured for standard token budgets (`maxTokens: 1800`); extremely high-volume historical banks benefit from layered temporal partitioning.
3. **Probabilistic Inferences:** Strategic signals are model-generated inferences. The pipeline explicitly isolates inferences into `strategic_signal` while preserving concrete historical facts in `observed_changes` and `evidence`.
