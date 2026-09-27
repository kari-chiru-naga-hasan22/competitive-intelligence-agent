# Demo Data Documentation

> **Notice:** This dataset is synthetic and created solely for demonstration purposes. All competitor names, events, pricing changes, announcements, and timelines are fictional constructs designed to showcase longitudinal reasoning in AI agents.

---

## 1. Why the Dataset is Synthetic
Competitive intelligence in real enterprise environments involves sensitive, proprietary, or rapidly changing web data that cannot be reliably cited or scraped in an isolated evaluation environment. To evaluate an AI agent's capacity for **pattern recognition over time**, we constructed a strictly controlled 90-day synthetic benchmark. 

This guarantees:
1. **Zero Hallucination Anchoring:** The reasoning engine is evaluated strictly against documented, reproducible observations.
2. **Clean Baseline:** Eliminates web-scraping noise, paywalls, and ephemeral marketing campaigns.
3. **Reproducible Evaluation:** Any engineer or judge can seed the database and observe the exact same longitudinal pattern emergence.

---

## 2. The Three Fictional Competitors

| Competitor | Focus Area | 90-Day Strategic Arc | Total Events |
| :--- | :--- | :--- | :--- |
| **Acme Cloud** *(Primary Demo)* | Cloud Analytics & AI | Evolves from basic AI features into an aggressive enterprise security and barbell pricing model (entry discount + enterprise premium lock-in). | 15 |
| **Nimbus Analytics** | Enterprise BI & Data Infra | Focuses on trusted enterprise AI, automated schema verification, HIPAA/SOC2 compliance, and governance partnerships (Snowflake/Databricks). | 15 |
| **Vertex Data** | Self-Service Analytics | Bottom-up adoption model: freemium onboarding, retail/Stripe integrations, pre-built templates, moving upmarket to mid-market teams. | 15 |
| **Total** | | | **45 Events** |

---

## 3. Dataset Specification
- **Storage Location:** [`data/competitors.json`](file:///C:/Education/vs/hackathon/competitive-intelligence-agent/data/competitors.json)
- **Validation Script:** [`scripts/validate-data.mjs`](file:///C:/Education/vs/hackathon/competitive-intelligence-agent/scripts/validate-data.mjs) (`npm run validate:data`)
- **Date Range:** `2026-07-01` to `2026-09-27` (~90-day window)
- **Allowed Categories:**
  - `product` — Features, assistant launches, core capabilities.
  - `enterprise` — Security, SSO, RBAC, compliance certifications.
  - `messaging` — Positioning changes, taglines, marketing themes.
  - `pricing` — Plan adjustments, discounts, usage-based metering.
  - `partnership` — Integrations with CRMs, data warehouses, payment providers.
  - `hiring` — Sales roles, engineering specialists, customer success capacity.
  - `packaging` — Plan bundling, sovereign cloud tiers, team packages.

---

## 4. Why Competitors Have Distinct Strategic Patterns
To test that the AI agent does not apply generic, boilerplate conclusions to every company, each competitor exhibits a fundamentally different business motion:
- **Acme Cloud:** Executes a classic **Barbell GTM Motion** (low-end price drop combined with high-end enterprise monetization).
- **Nimbus Analytics:** Executes a **Compliance & Trust Moat** (audit trails, HIPAA validation, sovereign cloud tiers for regulated industries).
- **Vertex Data:** Executes a **Product-Led Growth (PLG) Motion** (freemium, zero-setup onboarding, ecommerce templates, followed by mid-market SCIM provisioning).

---

## 5. Memory Pipeline: How Events Become Intelligence

### Step 1: Canonical Observation Storage (Hindsight RETAIN)
When events are ingested via [`app/api/seed/fast/route.ts`](file:///C:/Education/vs/hackathon/competitive-intelligence-agent/app/api/seed/fast/route.ts) or [`app/api/events/route.ts`](file:///C:/Education/vs/hackathon/competitive-intelligence-agent/app/api/events/route.ts), they are converted into a standardized 5-field text block using `buildMemoryContent` in [`lib/hindsight.ts`](file:///C:/Education/vs/hackathon/competitive-intelligence-agent/lib/hindsight.ts):

```text
Competitor: Acme Cloud
Category: product
Event: Launched an AI-powered analytics assistant
Source: Synthetic product announcement
Date: 2026-07-01
```

This text is sent to Hindsight's `retain` method with an associated timestamp and context tag. Crucially, **no subjective strategic conclusions are stored as facts**.

### Step 2: Context Retrieval (Hindsight RECALL)
When an executive asks:  
*"How has Acme Cloud's strategy changed over the last 90 days?"*  
The backend calls Hindsight's `recall` API with the competitor name and strategic prompt. Hindsight searches semantic memory and returns all matching historical observations.

### Step 3: Normalization & Deduplication
In [`app/api/intelligence/route.ts`](file:///C:/Education/vs/hackathon/competitive-intelligence-agent/app/api/intelligence/route.ts):
- Competitor names are matched using fuzzy token overlap and Levenshtein distance (e.g. matching "Acme" to "Acme Cloud").
- Genuinely distinct events on the same date/category are preserved, while near-identical duplicate text representations are collapsed.
- Dates are strictly validated, and memories are sorted chronologically.

### Step 4: Structured Reasoning (Gemini)
Gemini receives the clean chronological evidence and is instructed to separate facts from inferences:
```json
{
  "summary": "Concise 2-3 sentence strategic summary",
  "observed_changes": ["Fact 1", "Fact 2"],
  "strategic_signal": "Cautious inference (e.g. barbell strategy)",
  "watch_next": ["Leading indicators to monitor"]
}
```

### Step 5: UI & API Presentation
The frontend receives:
1. `evidence`: The concrete historical timeline cards with category badges and sources.
2. `insight`: The structured executive briefing separated into facts, strategic inferences, and next actions.
