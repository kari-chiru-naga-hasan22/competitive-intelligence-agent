# Technical Article Publishing & Submission Checklist

This step-by-step checklist guides you through publishing **ARTICLE.md** to a public platform and obtaining the verified public URL required for the project submission form.

---

## Phase 1: Pre-Publishing Review

- [ ] **Review ARTICLE.md:** Confirm all technical explanations, code blocks, and diagrams accurately match your project.
- [ ] **Word Count Verified:** Confirmed at ~1,480 words (comfortably within the 1,200–1,500 word target).
- [ ] **Zero Disallowed Terminology:** Confirmed zero occurrences of the word "hackathon" in the article text.
- [ ] **Review Visual Assets:** Refer to `ARTICLE_ASSETS.md` for recommended screenshot placements and captions.

---

## Phase 2: Choose a Publishing Platform

Select one primary public platform for your technical article:

| Platform | Recommended For | Formatting Notes |
| :--- | :--- | :--- |
| **Dev.to** *(Recommended)* | Developer audience, instant Markdown rendering | Direct Markdown copy-paste; supports code syntax highlighting |
| **Hashnode** | Engineering blogs, developer community | Direct Markdown import; excellent code block support |
| **Medium** | Broad tech audience, publication visibility | Paste rich text or import Markdown; clean visual styling |
| **LinkedIn Article** | Professional network visibility | Rich text editor (click "Write article" from LinkedIn home) |
| **Substack** | Direct subscribers and newsletter format | Clean web publishing format |

---

## Phase 3: Publishing Steps (Dev.to / Hashnode / Medium)

1. **Log In** to your chosen publishing platform account.
2. **Create New Article / Post:**
   - On **Dev.to**: Click **Write Post** in the top right.
   - On **Hashnode**: Click **Write** or **New Story**.
   - On **Medium**: Click **Write**.
3. **Set the Title:**
   ```text
   Building a Competitive Intelligence Agent with Persistent Memory: Why the Next Question Shouldn't Start from Zero
   ```
4. **Paste the Content:**
   - Copy the complete text of `ARTICLE.md` and paste it into the editor.
5. **Insert Images & Captions (from `ARTICLE_ASSETS.md`):**
   - Add a cover/hero image at the top (`public/hero-agent.png` or a screenshot of the app).
   - Insert Screenshot A (Strategic Intelligence Dossier) in the Fact vs. Inference section.
   - Insert Screenshot B (Trajectory & Living Memory table) in the Living Company Memory section.
   - Insert Screenshot C (Evidence Cards) in the Recalling & Sanitizing History section.
6. **Verify Hyperlinks Before Publishing:**
   - [ ] Vectorize Hindsight Documentation: `https://hindsight.vectorize.io/`
   - [ ] Vectorize Agent Memory Overview: `https://vectorize.io/what-is-agent-memory`
   - [ ] Vectorize Hindsight GitHub Repository: `https://github.com/vectorize-io/hindsight`
   - [ ] Project Live Demo: `https://competitive-intelligence-agent-sandy.vercel.app/`
   - [ ] Project GitHub Repository: `https://github.com/kari-chiru-naga-hasan22/competitive-intelligence-agent`
7. **Add Relevant Tags (3–5 tags):**
   - `ai`, `agents`, `llm`, `softwarearchitecture`, `typescript`
8. **Publish Publicly:**
   - Ensure the article visibility is set to **Public** (not Draft or Unlisted).
   - Click **Publish**.

---

## Phase 4: Obtain & Submit the Public Article Link

1. **Copy the Public Article URL:**
   - Open your published article in an incognito/private browser window to verify public readability without requiring a login.
   - Copy the browser URL (e.g., `https://dev.to/username/building-a-competitive-intelligence-agent-...`).
2. **Add to Submission Form:**
   - Paste this URL into the **Article Link** field in the official submission form.

---

## Phase 5: Social Sharing (LinkedIn & Reddit)

### LinkedIn Promotion
- [ ] Open `ARTICLE_LINKEDIN_POST.md`.
- [ ] Replace `[ARTICLE_URL]` with your published article URL.
- [ ] Publish the post on your LinkedIn profile.
- [ ] Ensure no disallowed hashtags (e.g., no `#Hackathon`) are included.

### Reddit Community Post
The submission guidelines recommend sharing your published technical article as a link post in an appropriate technical community.

- **Recommended Subreddits:**
  - `r/llmdevs`
  - `r/sideproject`
  - `r/aiagents`
  - `r/aimemory`
- **Post Type:** Link post linking to your published article URL.
- **Suggested Reddit Title:**
  ```text
  Building an AI competitive intelligence agent with persistent memory: why the next query shouldn't start from zero
  ```
- **Note:** Do NOT post until you have published the article and have the live public URL ready.
