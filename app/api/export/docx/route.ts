import { NextResponse } from "next/server";
import { generateDocxReport, DocxReportInput } from "@/lib/exportDocx";

export async function POST(request: Request) {
  try {
    const body: DocxReportInput = await request.json().catch(() => null);

    if (!body || !body.competitor) {
      return NextResponse.json(
        { success: false, error: "Invalid intelligence report payload for DOCX generation" },
        { status: 400 }
      );
    }

    const docBuffer = await generateDocxReport(body);
    const safeCompetitorName = body.competitor.replace(/[^\w-]/g, "_").toLowerCase();
    const filename = `${safeCompetitorName}_intelligence_report_${new Date().toISOString().slice(0, 10)}.docx`;

    return new NextResponse(new Uint8Array(docBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": docBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("[export/docx] Failed generating DOCX document:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate DOCX document" },
      { status: 500 }
    );
  }
}
