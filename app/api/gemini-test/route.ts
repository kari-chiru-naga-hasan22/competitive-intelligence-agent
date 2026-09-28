import { NextResponse } from "next/server";
import { getGeminiClient } from "@/lib/gemini/client";

export async function GET() {
  try {
    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents:
        "In one sentence, explain why persistent memory matters for a competitive intelligence agent.",
    });

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
      },
      { status: 500 }
    );
  }
}