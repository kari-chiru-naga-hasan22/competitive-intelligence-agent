import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

// Load environment from .env.local without exposing secrets
const envPath = path.join(root, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split(/\r?\n/).forEach(line => {
    const idx = line.indexOf('=');
    if (idx > 0) {
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim();
      process.env[key] = val;
    }
  });
}

async function run() {
  const { HindsightClient } = await import('@vectorize-io/hindsight-client');
  const { GoogleGenAI } = await import('@google/genai');

  const hindsight = new HindsightClient({
    baseUrl: process.env.HINDSIGHT_BASE_URL || 'https://api.hindsight.vectorize.io',
    apiKey: process.env.HINDSIGHT_API_KEY
  });

  console.log('Recalling from Hindsight bank "competitive-intelligence"...');
  const recallResult = await hindsight.recall(
    'competitive-intelligence',
    "Acme Cloud: How has Acme Cloud's strategy changed over the last 90 days?",
    {
      maxTokens: 1800,
      budget: 'low'
    }
  );

  const rawMemories = recallResult.results || [];
  console.log(`Recalled ${rawMemories.length} historical memories from Hindsight.`);

  // Load dataset
  const dataset = JSON.parse(fs.readFileSync(path.join(root, 'data/competitors.json'), 'utf-8'));
  const acmeEvents = dataset.filter(d => d.competitor === 'Acme Cloud');

  // Reason with Gemini
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const evidenceContext = acmeEvents
    .map((item, index) => `Evidence ${index + 1}:\nDate: ${item.date}\nCategory: ${item.category}\nEvent: ${item.event}`)
    .join('\n\n');

  const prompt = `
You are a senior competitive intelligence analyst.

Analyze the historical competitor evidence below.

Competitor:
Acme Cloud

User question:
How has Acme Cloud's strategy changed over the last 90 days?

Historical evidence:
${evidenceContext}

Return ONLY valid JSON using exactly this structure:

{
  "summary": "A concise 2-3 sentence summary of the observed strategic evolution.",
  "observed_changes": [
    "A concrete historical change supported directly by the evidence.",
    "Another concrete historical change supported directly by the evidence."
  ],
  "strategic_signal": "A cautious inference about what the combined pattern may indicate.",
  "watch_next": [
    "A specific future development worth monitoring.",
    "Another specific development worth monitoring."
  ]
}

Rules:

1. Separate facts from inference.
2. observed_changes must contain ONLY things directly supported by the evidence.
3. strategic_signal is an inference, so use cautious language such as:
   "may indicate", "could suggest", or "appears consistent with".
4. Do not invent competitors, dates, products, prices, customers, or outcomes.
5. Focus on change over time rather than describing isolated events.
6. Identify relationships between multiple events when the evidence supports them.
7. Keep the response concise and useful to a business decision-maker.
`;

  const models = ['gemini-3.7-flash', 'gemini-3.8-flash'];
  let geminiResponse;
  for (let attempt = 1; attempt <= 3; attempt++) {
    for (const model of models) {
      try {
        console.log(`[Attempt ${attempt}] Trying Gemini model: ${model}...`);
        geminiResponse = await ai.models.generateContent({
          model,
          contents: prompt
        });
        if (geminiResponse?.text) break;
      } catch (e) {
        console.warn(`Model ${model} failed on attempt ${attempt}: ${e.message}`);
      }
    }
    if (geminiResponse) break;
    console.log('Waiting 4s before next attempt...');
    await new Promise(r => setTimeout(r, 4000));
  }

  if (!geminiResponse) {
    throw new Error('All Gemini models failed after retries');
  }

  const rawText = geminiResponse.text?.trim()
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  const insight = JSON.parse(rawText);

  const outputDoc = {
    query: {
      competitor: 'Acme Cloud',
      question: "How has Acme Cloud's strategy changed over the last 90 days?"
    },
    hindsight: {
      bank_id: 'competitive-intelligence',
      status: 'active',
      recalled_memories_count: rawMemories.length
    },
    insight,
    evidence_count: acmeEvents.length,
    evidence: acmeEvents
  };

  const docsDir = path.join(root, 'docs');
  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
  fs.writeFileSync(path.join(docsDir, 'live-demo-output.json'), JSON.stringify(outputDoc, null, 2));

  console.log('Successfully captured live backend output in docs/live-demo-output.json!');
  console.log('Summary:', insight.summary);
  console.log('Strategic Signal:', insight.strategic_signal);
}

run().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
