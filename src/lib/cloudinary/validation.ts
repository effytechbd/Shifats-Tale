if (process.env.NODE_ENV !== "test" && !process.env.NODE_TEST_CONTEXT) {
  require("server-only");
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates file headers/metadata on the server.
 */
export function validateUploadedFile(
  fileName: string,
  mimeType: string,
  fileSize: number,
  contentType: string
): FileValidationResult {
  if (fileSize <= 0) {
    return { isValid: false, error: "Empty files are rejected." };
  }

  const parts = fileName.split(".");
  const extension = parts.length > 1 ? parts.pop()?.toLowerCase() : "";
  if (!extension) {
    return { isValid: false, error: "File must have a valid extension." };
  }

  // Allowed lists
  const docExtensions = ["pdf", "doc", "docx"];
  const imageExtensions = ["jpg", "jpeg", "png", "webp"];

  // Match extension & mime
  let expectedMime = "";
  if (extension === "pdf") expectedMime = "application/pdf";
  else if (extension === "doc") expectedMime = "application/msword";
  else if (extension === "docx") expectedMime = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  else if (["jpg", "jpeg"].includes(extension)) expectedMime = "image/jpeg";
  else if (extension === "png") expectedMime = "image/png";
  else if (extension === "webp") expectedMime = "image/webp";

  if (!expectedMime) {
    return { isValid: false, error: `Unsupported file extension: .${extension}` };
  }

  // MIME and extension mismatch check
  if (mimeType !== expectedMime) {
    return { isValid: false, error: "MIME type and file extension mismatch." };
  }

  // Enforce size limits
  if (contentType === "IMAGE") {
    if (!imageExtensions.includes(extension)) {
      return { isValid: false, error: "Image file expected for content type IMAGE." };
    }
    const tenMB = 10 * 1024 * 1024;
    if (fileSize > tenMB) {
      return { isValid: false, error: "Image file exceeds 10 MB limit." };
    }
  } else if (["PDF", "DOC", "DOCX"].includes(contentType)) {
    if (contentType === "PDF" && extension !== "pdf") {
      return { isValid: false, error: "PDF file expected." };
    }
    if (contentType === "DOC" && extension !== "doc") {
      return { isValid: false, error: "DOC file expected." };
    }
    if (contentType === "DOCX" && extension !== "docx") {
      return { isValid: false, error: "DOCX file expected." };
    }
    const twentyFiveMB = 25 * 1024 * 1024;
    if (fileSize > twentyFiveMB) {
      return { isValid: false, error: "Document file exceeds 25 MB limit." };
    }
  } else {
    return { isValid: false, error: "Selected content type does not support file upload." };
  }

  return { isValid: true };
}

/**
 * Validates file magic bytes (signatures) for robust security.
 */
export function validateFileMagicBytes(buffer: Buffer, extension: string): boolean {
  if (buffer.length < 4) return false;
  const hex = buffer.toString("hex", 0, 4).toUpperCase();
  
  if (extension === "pdf") {
    return hex === "25504446"; // %PDF
  }
  if (extension === "png") {
    return hex === "89504E47"; // .PNG
  }
  if (extension === "jpg" || extension === "jpeg") {
    return hex.startsWith("FFD8FF"); // JPEG SOI (FFD8FF...)
  }
  if (extension === "docx") {
    return hex === "504B0304"; // PK zip header
  }
  if (extension === "doc") {
    return hex === "D0CF11E0"; // CFB header (doc)
  }
  if (extension === "webp") {
    const isRiff = hex === "52494646"; // RIFF
    if (!isRiff) return false;
    if (buffer.length < 12) return false;
    const webpHeader = buffer.toString("hex", 8, 12).toUpperCase();
    return webpHeader === "57454250"; // WEBP
  }
  return false;
}
