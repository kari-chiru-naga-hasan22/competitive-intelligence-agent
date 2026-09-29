export interface UploadedFileReference {
  id: string;
  name: string;
  size: number;
  type: string;
  text: string;
  snippet: string;
  charCount: number;
  uploadedAt: string;
}

// Global in-memory cache for uploaded files across API routes
const fileCache = new Map<string, UploadedFileReference>();

export async function processAndStoreFile(
  file: File | Blob,
  filename: string,
  mimeType: string
): Promise<UploadedFileReference> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const size = buffer.length;
  const id = "file_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9);
  const ext = filename.split(".").pop()?.toLowerCase() || "";

  let extractedText = "";

  try {
    if (ext === "pdf" || mimeType.includes("pdf")) {
      const pdfModule: any = await import("pdf-parse");
      // Support both v2 class-based and legacy function-based pdf-parse
      if (typeof pdfModule.PDFParse === "function") {
        const parser = new pdfModule.PDFParse({ data: buffer });
        const parsed = await parser.getText();
        extractedText = parsed.text || "";
        if (typeof parser.destroy === "function") {
          await parser.destroy();
        }
      } else if (typeof pdfModule.default === "function") {
        const data = await pdfModule.default(buffer);
        extractedText = data.text || "";
      } else if (typeof pdfModule === "function") {
        const data = await pdfModule(buffer);
        extractedText = data.text || "";
      } else {
        extractedText = buffer.toString("utf-8");
      }
    } else if (ext === "docx" || mimeType.includes("wordprocessingml") || mimeType.includes("docx")) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value || "";
    } else {
      // Plain text, CSV, markdown, JSON, etc.
      extractedText = buffer.toString("utf-8");
    }
  } catch (err) {
    console.warn(`[fileStore] Failed extracting rich text for ${filename}, falling back to utf-8 decode:`, err);
    try {
      extractedText = buffer.toString("utf-8");
    } catch {
      extractedText = `[Unable to extract textual content from ${filename}]`;
    }
  }

  // Clean and normalize text
  const cleanedText = extractedText
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Cap character length to protect context window (up to 40,000 characters)
  const cappedText =
    cleanedText.length > 40000
      ? cleanedText.slice(0, 40000) + "\n...[truncated document content]..."
      : cleanedText;

  const snippet = cappedText.slice(0, 300).trim() + (cappedText.length > 300 ? "..." : "");

  const fileRef: UploadedFileReference = {
    id,
    name: filename,
    size,
    type: mimeType || ext,
    text: cappedText,
    snippet,
    charCount: cappedText.length,
    uploadedAt: new Date().toISOString(),
  };

  fileCache.set(id, fileRef);

  // Prune cache if it exceeds 100 entries
  if (fileCache.size > 100) {
    const oldestKey = fileCache.keys().next().value;
    if (oldestKey) fileCache.delete(oldestKey);
  }

  return fileRef;
}

export function getFile(id: string): UploadedFileReference | undefined {
  return fileCache.get(id);
}

export function deleteFile(id: string): boolean {
  return fileCache.delete(id);
}
