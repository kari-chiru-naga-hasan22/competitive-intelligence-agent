import { NextResponse } from "next/server";
import { processAndStoreFile } from "@/lib/fileStore";

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
const ALLOWED_EXTENSIONS = ["pdf", "docx", "txt", "csv", "md", "json"];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided", code: "NO_FILE" },
        { status: 400 }
      );
    }

    const filename = file.name || "unnamed_document";
    const ext = filename.split(".").pop()?.toLowerCase() || "";

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file format (.${ext}). Supported formats: ${ALLOWED_EXTENSIONS.join(", ")}`,
          code: "UNSUPPORTED_FORMAT",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds 15MB limit (${(file.size / 1024 / 1024).toFixed(1)}MB)`,
          code: "FILE_TOO_LARGE",
        },
        { status: 400 }
      );
    }

    console.log(`[upload] Processing document upload: ${filename} (${(file.size / 1024).toFixed(1)} KB)`);

    const fileRef = await processAndStoreFile(file, filename, file.type);

    return NextResponse.json({
      success: true,
      file: {
        id: fileRef.id,
        name: fileRef.name,
        size: fileRef.size,
        type: fileRef.type,
        snippet: fileRef.snippet,
        charCount: fileRef.charCount,
        uploadedAt: fileRef.uploadedAt,
      },
    });
  } catch (error) {
    console.error("[upload] File upload processing failed:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to parse and process uploaded document.",
        code: "UPLOAD_PARSE_ERROR",
      },
      { status: 500 }
    );
  }
}
