# Demo Screenshots and UI Capture Checklist

This document provides a precise checklist of all screenshots, API outputs, and UI views required for demonstrating the **Competitive Intelligence Agent**.

---

## 1. Verified Live Output Data Reference
The live response has been verified against the production backend and recorded in [`docs/live-demo-output.json`](file:///C:/Education/vs/hackathon/competitive-intelligence-agent/docs/live-demo-output.json).

- **Query Competitor:** `Acme Cloud`
- **Query Question:** *"How has Acme Cloud's strategy changed over the last 90 days?"*
- **Hindsight Bank:** `competitive-intelligence` (Status: Active, 43+ memories indexed)
- **Live Strategic Signal:**
  > *"This coordinated pattern could suggest a barbell go-to-market strategy: reducing entry-level friction to drive top-of-funnel user adoption while monetizing high-value accounts through enterprise-grade security controls, dedicated sales support, and premium AI packaging."*

---

## 2. Screenshot Capture Checklist

### Screenshot 1: Application Landing & Query Interface
- **Route / URL:** `http://localhost:3000`
- **Element to Focus On:**
  - The competitor selection input set to `Acme Cloud`.
  - The query input set to `"How has Acme Cloud's strategy changed over the last 90 days?"`.
  - The "Run Intelligence Analysis" / submit button.
- **Purpose:** Demonstrates the user entry point and intuitive query framing.
- **Caption:** *Figure 1: Querying the competitive intelligence agent for a longitudinal 90-day strategy review.*

### Screenshot 2: Evidence Audit Trail (Chronological Memory Cards)
- **Route / URL:** `http://localhost:3000` (or `POST /api/intelligence` response view)
- **Element to Focus On:**
  - The chronological evidence timeline showing dated observations from `2026-07-01` through `2026-09-27`.
  - Category badges (`product`, `enterprise`, `messaging`, `pricing`, `partnership`, `hiring`, `packaging`).
  - Source annotations (`Synthetic product announcement`, `Synthetic enterprise announcement`, etc.).
- **Purpose:** Proves that the intelligence is strictly grounded in verifiable, factual historical observations retrieved from Hindsight.
- **Caption:** *Figure 2: Historical evidence timeline reconstructed from Hindsight persistent memory.*

### Screenshot 3: Executive Strategic Insight & Synthesis Cards
- **Route / URL:** `http://localhost:3000`
- **Element to Focus On:**
  - **Summary Card:** High-level narrative of Acme Cloud's AI repositioning and pricing shift.
  - **Observed Changes Card:** Bulleted factual changes (AI Assistant, SSO/access controls, $49 → $39 price drop).
  - **Strategic Signal Card:** Highlighted inference box displaying the barbell GTM strategy deduction.
  - **Watch Next Card:** Recommended leading indicators for ongoing monitoring.
- **Purpose:** Highlights the clear separation between verified facts and probabilistic inferences.
- **Caption:** *Figure 3: Multi-dimensional strategic intelligence synthesized by Gemini across retrieved memories.*

### Screenshot 4: Without Memory vs. With Memory Side-by-Side
- **Context:** Slide 8 or UI comparison view.
- **Left Panel (Without Memory):**
  - Shows an isolated single-event answer: *"Acme Cloud reduced its Pro plan to $39 on Sep 27. They may be cutting prices."*
- **Right Panel (With Hindsight Memory):**
  - Shows full longitudinal context: *"The $39 price drop is the lower tier of a barbell strategy, preceded by enterprise security bundling and usage-based monetization."*
- **Purpose:** Clearly proves the core value proposition of Hindsight.
- **Caption:** *Figure 4: Direct comparison of point-in-time stateless response vs. longitudinal persistent memory.*

### Screenshot 5: Terminal / Developer API Verification
- **Command:** `curl -X POST http://localhost:3000/api/intelligence -H "Content-Type: application/json" -d "{\"competitor\":\"Acme Cloud\",\"question\":\"How has Acme Cloud's strategy changed over the last 90 days?\"}"`
- **Element to Focus On:**
  - Clean `200 OK` JSON response containing `success: true`, `insight`, and `evidence`.
- **Purpose:** Technical verification for engineers and technical judges.
- **Caption:** *Figure 5: Direct REST API response from the Next.js intelligence route.*

---

## 3. How to Capture
1. Start local development server: `npm run dev`
2. Navigate to `http://localhost:3000` in browser.
3. Submit the Acme Cloud 90-day strategy query.
4. Use standard OS snipping tool (`Win + Shift + S` on Windows) to capture figures 1–4.
5. Save captured images into an `assets/` or `docs/images/` folder if adding to presentations or docs.
