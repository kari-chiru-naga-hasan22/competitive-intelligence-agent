# Competitive Intelligence Agent: Demo Video Script

**Target Duration:** 3:30 – 4:00 Minutes  
**Tone:** Professional, clear, engineering-focused  
**Visual Style:** Screen share with camera inset / slide transitions  
**Primary Demo Question:** *"How has Acme Cloud's strategy changed over the last 90 days?"*

---

### [0:00 – 0:20] Introduce the Problem
**[Visual: Speaker on camera or Slide 2: "Competitive intelligence is scattered"]**

> **Speaker:**  
> "In business, understanding what your competitors are doing is critical. But competitive moves don't arrive neatly packaged in a single announcement.  
> 
> They happen gradually over weeks and months—scattered across a minor product update in July, an enterprise security tweak in August, subtle changes to marketing messaging, and a pricing discount in September. For strategy and product marketing teams, manually piecing these fragments together is time-consuming and error-prone."

---

### [0:20 – 0:45] Why a Normal Point-in-Time AI Answer is Insufficient
**[Visual: Slide 8 or split screen showing stateless LLM prompt]**

> **Speaker:**  
> "Naturally, people turn to AI. But conventional AI agents suffer from a fundamental blindspot: they operate **point-in-time**.  
> 
> When you ask a standard stateless LLM, 'What is our competitor doing with their pricing?', the model searches for the most recent document. It finds a headline from yesterday where Acme Cloud dropped their Pro plan price from $49 to $39.  
> 
> The AI concludes: *'Acme Cloud is discounting their product to compete on price.'*  
> 
> That conclusion is not just shallow—it completely misses the strategy. In isolation, a price drop looks like discounting. Across time, it might be something entirely different."

---

### [0:45 – 1:15] System Architecture: Capture → Remember → Recall → Reason
**[Visual: Slide 3 & Slide 4: Architecture diagram]**

> **Speaker:**  
> "To solve this, we built the **Competitive Intelligence Agent**. It bridges the gap between real-time signal capture and long-term strategic reasoning.  
> 
> The architecture follows a disciplined four-step loop:
> 1. **Capture:** The system continuously ingests competitor observations—product launches, enterprise features, pricing adjustments, and hiring changes.
> 2. **Remember:** Using **Hindsight's RETAIN API**, every observation is stored as structured memory in a persistent memory bank, tagged with timestamps and categories.
> 3. **Recall:** When an analyst asks a strategic question, **Hindsight's RECALL API** surfaces the entire historical trajectory relevant to that competitor and topic.
> 4. **Reason:** Finally, **Google Gemini** analyzes the accumulated evidence, deliberately separating concrete historical facts from strategic inferences."

---

### [1:15 – 2:15] Running the Live Demo Query
**[Visual: Switch to Web UI / Terminal running the application at `http://localhost:3000` or API call]**

> **Speaker:**  
> "Let's see this in action with our primary evaluation question.  
> 
> We select our synthetic competitor, **Acme Cloud**, and submit our core inquiry:  
> *'How has Acme Cloud's strategy changed over the last 90 days?'*  
> 
> Notice what happens behind the scenes.  
> 
> The backend makes a single call to Hindsight. Hindsight scans its persistent memory bank and retrieves 43 relevant historical memories spanning the entire 90-day window from July through September 2026.  
> 
> Our backend normalizes and deduplicates these memories, sorts them chronologically, and sends the clean evidence context to Gemini for strategic synthesis."

---

### [2:15 – 3:00] Examining the Historical Evidence
**[Visual: Zoom into the Evidence Timeline on the screen]**

> **Speaker:**  
> "Look at the evidence timeline the agent reconstructs:
> 
> - On **July 1st**, Acme Cloud launched an AI-powered analytics assistant.
> - On **July 15th and 22nd**, they added enterprise security access controls and single sign-on.
> - In **late July**, they opened multiple enterprise account executive roles.
> - On **August 5th**, their messaging shifted to 'AI-first analytics'.
> - In **late August**, they introduced usage-based pricing for high-volume customers.
> - And in **September**, they bundled advanced AI into higher-tier enterprise plans, right before dropping their Pro plan price to $39 on September 27th.
> 
> This is a complete audit trail. Every single assertion the agent makes is grounded in verifiable historical observations."

---

### [3:00 – 3:30] Strategic Signal and Watch-Next Output
**[Visual: Highlight the Executive Summary, Strategic Signal, and Watch Next cards]**

> **Speaker:**  
> "Now examine how Gemini structures the intelligence:
> 
> - **Observed Changes:** Lists the exact chronological facts directly supported by the evidence—AI product launches, enterprise governance hardening, and dual-track pricing.
> - **Strategic Signal:** Here is the strategic breakthrough. The agent recognizes a **barbell go-to-market strategy**. Acme Cloud is lowering friction at the low end with a $39 tier to drive mass user adoption, while simultaneously locking in high-value accounts through enterprise security controls and premium AI bundling.
> - **Watch Next:** The agent gives actionable guidance on what to monitor next—such as upcoming enterprise compliance certifications or usage-tier thresholds."

---

### [3:30 – 4:00] The Core Distinction & Conclusion
**[Visual: Return to Slide 8 or Speaker on camera]**

> **Speaker:**  
> "Let's reflect on the difference.  
> 
> A stateless AI saw only the latest event: a $39 price drop. It told you Acme was cutting prices.  
> 
> An AI agent equipped with **Hindsight persistent memory** saw the entire 90-day arc: product, security, messaging, hiring, and pricing. It correctly identified an aggressive, coordinated market offensive.  
> 
> Competitive intelligence is not about reacting to isolated headlines.  
> 
> **The key is not just answering the question. It's remembering what happened before.**"

---
*(End of video)*
