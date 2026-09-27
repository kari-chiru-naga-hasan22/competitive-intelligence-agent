import { NextResponse } from "next/server";

const EVENTS = [
  {
    competitor: "Acme Cloud",
    event: "Acme Cloud launched an AI-powered analytics assistant for business users.",
    category: "product",
    source: "Company product announcement",
    date: "2026-07-01",
  },
  {
    competitor: "Acme Cloud",
    event: "Acme Cloud introduced an enterprise security package with advanced access controls.",
    category: "product",
    source: "Company website",
    date: "2026-07-15",
  },
  {
    competitor: "Acme Cloud",
    event: "Acme Cloud began emphasizing AI-first analytics in its product messaging.",
    category: "messaging",
    source: "Company website",
    date: "2026-08-05",
  },
  {
    competitor: "Acme Cloud",
    event: "Acme Cloud introduced a usage-based pricing option for high-volume customers.",
    category: "pricing",
    source: "Company pricing page",
    date: "2026-08-22",
  },
  {
    competitor: "Acme Cloud",
    event: "Acme Cloud reduced its Pro plan from $49 to $39 per month.",
    category: "pricing",
    source: "Company website",
    date: "2026-09-27",
  },

  {
    competitor: "Nimbus Analytics",
    event: "Nimbus Analytics launched automated anomaly detection for its analytics platform.",
    category: "product",
    source: "Company product announcement",
    date: "2026-07-04",
  },
  {
    competitor: "Nimbus Analytics",
    event: "Nimbus Analytics expanded its enterprise plan with dedicated customer success support.",
    category: "packaging",
    source: "Company website",
    date: "2026-07-20",
  },
  {
    competitor: "Nimbus Analytics",
    event: "Nimbus Analytics began positioning its platform around trusted enterprise AI.",
    category: "messaging",
    source: "Company website",
    date: "2026-08-10",
  },
  {
    competitor: "Nimbus Analytics",
    event: "Nimbus Analytics added AI-generated executive reports to its platform.",
    category: "product",
    source: "Company product announcement",
    date: "2026-08-28",
  },
  {
    competitor: "Nimbus Analytics",
    event: "Nimbus Analytics announced a partnership focused on integrating external business data.",
    category: "partnership",
    source: "Company announcement",
    date: "2026-09-12",
  },

  {
    competitor: "Vertex Data",
    event: "Vertex Data launched a self-service analytics workspace for smaller teams.",
    category: "product",
    source: "Company product announcement",
    date: "2026-07-08",
  },
  {
    competitor: "Vertex Data",
    event: "Vertex Data introduced a lower-cost starter package for growing businesses.",
    category: "pricing",
    source: "Company pricing page",
    date: "2026-07-25",
  },
  {
    competitor: "Vertex Data",
    event: "Vertex Data increased its messaging around ease of deployment and faster time to value.",
    category: "messaging",
    source: "Company website",
    date: "2026-08-12",
  },
  {
    competitor: "Vertex Data",
    event: "Vertex Data added pre-built industry dashboards for retail and financial services.",
    category: "product",
    source: "Company product announcement",
    date: "2026-08-30",
  },
  {
    competitor: "Vertex Data",
    event: "Vertex Data announced additional hiring for its enterprise sales organization.",
    category: "hiring",
    source: "Company careers page",
    date: "2026-09-15",
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    count: EVENTS.length,
    events: EVENTS,
  });
}