/**
 * File Upload Security & Magic-Byte Validation
 *
 * Verifies file contents against actual binary signatures (magic bytes) to prevent
 * MIME spoofing, polyglot files, executable payloads, and SVG XSS attacks.
 */

interface FileValidationResult {
  valid: boolean;
  mimeType?: string;
  extension?: string;
  error?: string;
}

export function validateImageMagicBytes(buffer: Buffer): FileValidationResult {
  if (!buffer || buffer.length < 8) {
    return { valid: false, error: "File buffer is too small to be a valid image." };
  }

  // 1. JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, mimeType: "image/jpeg", extension: ".jpg" };
  }

  // 2. PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, mimeType: "image/png", extension: ".png" };
  }

  // 3. GIF: GIF87a (47 49 46 38 37 61) or GIF89a (47 49 46 38 39 61)
  if (
    buffer.length >= 6 &&
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38 &&
    (buffer[4] === 0x37 || buffer[4] === 0x39) &&
    buffer[5] === 0x61
  ) {
    return { valid: true, mimeType: "image/gif", extension: ".gif" };
  }

  // 4. WebP: RIFF .... WEBP
  // Offset 0-3: 52 49 46 46 ("RIFF"), Offset 8-11: 57 45 42 50 ("WEBP")
  if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return { valid: true, mimeType: "image/webp", extension: ".webp" };
  }

  // 5. AVIF / HEIC (ISOBMFF image formats)
  if (buffer.length >= 12 && buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70) {
    const brand = buffer.subarray(8, 12).toString("latin1").toLowerCase();
    if (brand.startsWith("avif") || brand.startsWith("avis")) {
      return { valid: true, mimeType: "image/avif", extension: ".avif" };
    }
    if (brand.startsWith("heic") || brand.startsWith("heix") || brand.startsWith("mif1")) {
      return { valid: true, mimeType: "image/heic", extension: ".heic" };
    }
  }

  // 6. SVG: Must be clean XML/SVG without script injection, event handlers, or entity injection
  const sample = buffer.subarray(0, Math.min(buffer.length, 8192)).toString("utf-8");
  const isSvgHeader =
    sample.includes("<svg") ||
    (sample.trim().startsWith("<?xml") && sample.includes("<svg"));

  if (isSvgHeader) {
    const fullText = buffer.toString("utf-8");
    // Strict SVG XSS / XXE inspection: disallow script tags, event handlers, foreignObject, iframe, javascript: URIs, <!ENTITY
    const dangerousPatterns = [
      /<script\b/i,
      /<\/script>/i,
      /javascript:/i,
      /data:\s*text\/html/i,
      /onload\s*=/i,
      /onerror\s*=/i,
      /onclick\s*=/i,
      /onmouseover\s*=/i,
      /<foreignObject\b/i,
      /<iframe\b/i,
      /<!ENTITY\b/i,
      /<!DOCTYPE\b[^>]*\[/i, // DTD external entity declarations
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(fullText)) {
        console.warn(`[IMAGE_VALIDATION_REJECTED] SVG failed security pattern check: ${pattern}`);
        return {
          valid: false,
          error: "SVG file contains prohibited or executable content (scripts/event handlers/entities).",
        };
      }
    }

    return { valid: true, mimeType: "image/svg+xml", extension: ".svg" };
  }

  const hexSignature = buffer.subarray(0, 32).toString("hex");
  const asciiHeader = buffer.subarray(0, 32).toString("latin1").replace(/[^\x20-\x7E]/g, ".");
  console.warn(
    `[IMAGE_VALIDATION_REJECTED] Unknown image format. Buffer size: ${buffer.length} bytes. Hex: [${hexSignature}]. ASCII: "${asciiHeader}"`
  );

  return {
    valid: false,
    error: "File content does not match any allowed image format (JPEG, PNG, WebP, GIF, SVG, AVIF).",
  };
}

export function validateVideoMagicBytes(buffer: Buffer): FileValidationResult {
  if (!buffer || buffer.length < 8) {
    return { valid: false, error: "File buffer is too small to be a valid video." };
  }

  // 1. WebM / Matroska (MKV): EBML header (1A 45 DF A3)
  if (
    buffer[0] === 0x1a &&
    buffer[1] === 0x45 &&
    buffer[2] === 0xdf &&
    buffer[3] === 0xa3
  ) {
    return { valid: true, mimeType: "video/webm", extension: ".webm" };
  }

  // 2. ISOBMFF / MP4 / QuickTime (MOV) / M4V / 3GP
  // Search for the "ftyp" box within the first 1024 bytes (handles leading wide, free, skip, pnot atoms)
  const headerWindow = buffer.subarray(0, Math.min(buffer.length, 1024));
  const ftypIndex = headerWindow.indexOf(Buffer.from("ftyp"));

  if (ftypIndex >= 4) {
    // Read the major brand (4 bytes following 'ftyp')
    let brand = "";
    if (ftypIndex + 8 <= buffer.length) {
      brand = buffer.subarray(ftypIndex + 4, ftypIndex + 8).toString("latin1").trim().toLowerCase();
    }

    // QuickTime MOV brand codes
    const isMov = brand.startsWith("qt");

    return {
      valid: true,
      mimeType: isMov ? "video/quicktime" : "video/mp4",
      extension: isMov ? ".mov" : ".mp4",
    };
  }

  // 3. MP4 / MOV container starting directly with common ISOBMFF box types (moov, mdat, styp, wide, free)
  if (buffer.length >= 8) {
    const firstBoxType = buffer.subarray(4, 8).toString("latin1").toLowerCase();
    if (["moov", "mdat", "styp", "wide", "free", "skip", "pnot"].includes(firstBoxType)) {
      return {
        valid: true,
        mimeType: "video/mp4",
        extension: ".mp4",
      };
    }
  }

  // 4. AVI format: Offset 0..3 = "RIFF", Offset 8..11 = "AVI "
  if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x41 &&
    buffer[9] === 0x56 &&
    buffer[10] === 0x49 &&
    buffer[11] === 0x20
  ) {
    return { valid: true, mimeType: "video/x-msvideo", extension: ".avi" };
  }

  // 5. OGG Video format: Offset 0..3 = "OggS"
  if (
    buffer.length >= 4 &&
    buffer[0] === 0x4f &&
    buffer[1] === 0x67 &&
    buffer[2] === 0x67 &&
    buffer[3] === 0x53
  ) {
    return { valid: true, mimeType: "video/ogg", extension: ".ogv" };
  }

  // Diagnostic logging on rejection
  const hexSignature = buffer.subarray(0, 32).toString("hex");
  const asciiHeader = buffer.subarray(0, 32).toString("latin1").replace(/[^\x20-\x7E]/g, ".");
  console.warn(
    `[VIDEO_VALIDATION_REJECTED] Unknown video format. Buffer size: ${buffer.length} bytes. Hex: [${hexSignature}]. ASCII: "${asciiHeader}"`
  );

  return {
    valid: false,
    error: "File content does not match any allowed video format (MP4, WebM, QuickTime MOV).",
  };
}
