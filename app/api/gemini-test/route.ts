import { NextResponse } from "next/server";
import { generateGeminiContent } from "@/lib/gemini/client";

export async function GET() {
  try {
    const response = await generateGeminiContent(
      "In one sentence, explain why persistent memory matters for a competitive intelligence agent."
    );

    return NextResponse.json({
      success: true,
      response: response.text,
    });
  } catch (error) {
    console.error("Gemini test failed:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        code: (error as { code?: string })?.code || "GEMINI_UNAVAILABLE",
      },
      { status: 500 }
    );
  }
}