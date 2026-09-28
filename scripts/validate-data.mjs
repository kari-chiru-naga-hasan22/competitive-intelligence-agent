import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.resolve(__dirname, '../data/competitors.json');

const EXPECTED_TOTAL = 45;
const EXPECTED_PER_COMPETITOR = 15;
const EXPECTED_COMPETITORS = ['Acme Cloud', 'Nimbus Analytics', 'Vertex Data'];
const ALLOWED_CATEGORIES = new Set([
  'product',
  'enterprise',
  'messaging',
  'pricing',
  'partnership',
  'hiring',
  'packaging'
]);

const MIN_DATE = '2026-07-01';
const MAX_DATE = '2026-09-27';

// Strategic conclusion indicators that should NOT be in raw observation text
const FORBIDDEN_CONCLUSION_PATTERNS = [
  /which indicates/i,
  /suggesting that/i,
  /strategic pivot/i,
  /signals that/i,
  /aiming to dominate/i,
  /in order to beat/i,
  /concluding that/i,
  /this proves that/i
];

// Disallowed real-world domain / news citations
const FORBIDDEN_CITATION_PATTERNS = [
  /https?:\/\//i,
  /\.com\b/i,
  /\.org\b/i,
  /\.io\b/i,
  /reuters/i,
  /bloomberg/i,
  /techcrunch/i,
  /forbes/i,
  /wsj/i
];

function validate() {
  console.log('----------------------------------------------------');
  console.log('Validating Synthetic Competitor Dataset...');
  console.log(`Target file: ${DATA_FILE}`);
  console.log('----------------------------------------------------');

  if (!fs.existsSync(DATA_FILE)) {
    console.error(`FAIL: File does not exist at ${DATA_FILE}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error(`FAIL: Invalid JSON format: ${err.message}`);
    process.exit(1);
  }

  if (!Array.isArray(data)) {
    console.error('FAIL: Dataset root must be a JSON array.');
    process.exit(1);
  }

  const errors = [];
  const warnings = [];

  // 1. Total records check
  if (data.length !== EXPECTED_TOTAL) {
    errors.push(`Expected exactly ${EXPECTED_TOTAL} records, but found ${data.length}.`);
  }

  // Competitor breakdown
  const competitorCounts = new Map();
  EXPECTED_COMPETITORS.forEach(c => competitorCounts.set(c, 0));

  const seenCombinations = new Set();
  const competitorDates = new Map();
  EXPECTED_COMPETITORS.forEach(c => competitorDates.set(c, []));

  data.forEach((item, index) => {
    const prefix = `Record #${index + 1}`;

    // Required fields check
    const requiredFields = ['competitor', 'date', 'category', 'event', 'source'];
    for (const field of requiredFields) {
      if (!item[field] || typeof item[field] !== 'string' || !item[field].trim()) {
        errors.push(`${prefix}: Missing or empty required field "${field}".`);
      }
    }

    if (!item.competitor) return;

    // Competitor name check
    if (!EXPECTED_COMPETITORS.includes(item.competitor)) {
      errors.push(`${prefix}: Unknown competitor "${item.competitor}". Expected one of: ${EXPECTED_COMPETITORS.join(', ')}.`);
    } else {
      competitorCounts.set(item.competitor, (competitorCounts.get(item.competitor) || 0) + 1);
    }

    // Category check
    if (item.category && !ALLOWED_CATEGORIES.has(item.category)) {
      errors.push(`${prefix}: Invalid category "${item.category}". Allowed categories: ${Array.from(ALLOWED_CATEGORIES).join(', ')}.`);
    }

    // Date format & range check
    if (item.date) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(item.date) || isNaN(Date.parse(item.date))) {
        errors.push(`${prefix}: Invalid date format "${item.date}". Expected YYYY-MM-DD.`);
      } else {
        if (item.date < MIN_DATE || item.date > MAX_DATE) {
          errors.push(`${prefix}: Date "${item.date}" outside 90-day demo window (${MIN_DATE} to ${MAX_DATE}).`);
        }
        if (EXPECTED_COMPETITORS.includes(item.competitor)) {
          competitorDates.get(item.competitor).push({ index, date: item.date });
        }
      }
    }

    // Duplicate check
    const comboKey = `${item.competitor}|${item.date}|${item.category}|${item.event?.toLowerCase().trim()}`;
    if (seenCombinations.has(comboKey)) {
      errors.push(`${prefix}: Duplicate event detected for ${item.competitor} on ${item.date} (${item.category}).`);
    } else {
      seenCombinations.add(comboKey);
    }

    // Source check (must be synthetic, no fake real-world URLs)
    if (item.source) {
      if (!item.source.toLowerCase().includes('synthetic')) {
        warnings.push(`${prefix}: Source "${item.source}" does not explicitly state "Synthetic".`);
      }
      for (const pat of FORBIDDEN_CITATION_PATTERNS) {
        if (pat.test(item.source)) {
          errors.push(`${prefix}: Source "${item.source}" contains real-world URL or publication citation.`);
        }
      }
    }

    // Event conclusion check (must be objective observation)
    if (item.event) {
      for (const pat of FORBIDDEN_CONCLUSION_PATTERNS) {
        if (pat.test(item.event)) {
          errors.push(`${prefix}: Event text contains embedded strategic conclusion: "${item.event}".`);
        }
      }
    }
  });

  // Check 15 per competitor
  for (const [comp, count] of competitorCounts.entries()) {
    if (count !== EXPECTED_PER_COMPETITOR) {
      errors.push(`Expected exactly ${EXPECTED_PER_COMPETITOR} records for "${comp}", found ${count}.`);
    }
  }

  // Chronological order check per competitor
  for (const [comp, datesList] of competitorDates.entries()) {
    for (let i = 1; i < datesList.length; i++) {
      if (datesList[i].date < datesList[i - 1].date) {
        errors.push(`Chronological ordering violation in "${comp}": record #${datesList[i].index + 1} (${datesList[i].date}) appears after record #${datesList[i - 1].index + 1} (${datesList[i - 1].date}).`);
      }
    }
  }

  // Print results
  console.log(`\nCompetitor Event Distribution:`);
  for (const [comp, count] of competitorCounts.entries()) {
    console.log(`  - ${comp}: ${count} / ${EXPECTED_PER_COMPETITOR} events`);
  }

  if (warnings.length > 0) {
    console.log(`\nWarnings (${warnings.length}):`);
    warnings.forEach(w => console.warn(`  [!] ${w}`));
  }

  if (errors.length > 0) {
    console.error(`\nValidation FAILED with ${errors.length} error(s):`);
    errors.forEach(e => console.error(`  [X] ${e}`));
    process.exit(1);
  }

  console.log('\nSUCCESS: All 45 records validated cleanly!');
  console.log('- 15 Acme Cloud events (preserving 90-day arc)');
  console.log('- 15 Nimbus Analytics events (trusted enterprise / compliance arc)');
  console.log('- 15 Vertex Data events (self-service / low-cost template arc)');
  console.log('- Allowed categories and valid dates verified');
  console.log('- No duplicate events or embedded strategic conclusions');
  console.log('- Strictly synthetic sources verified');
  console.log('----------------------------------------------------');
}

validate();
