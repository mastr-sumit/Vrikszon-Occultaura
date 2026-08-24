import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { z } from "zod";
import { parseAndValidateJson } from "@/lib/validations/validator";
import { auth } from "@/auth";
import { handleServerError } from "@/lib/errors";
import { validateImageMagicBytes } from "@/lib/validations/file-security";

const saveWheelSchema = z
  .object({
    base64: z
      .string()
      .trim()
      .min(10, "Base64 image data too short")
      .max(20 * 1024 * 1024, "Image base64 exceeds maximum limit (20MB)"),
    filename: z
      .string()
      .trim()
      .min(1, "Filename cannot be empty")
      .max(100, "Filename cannot exceed 100 characters")
      .regex(/^[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\.(png|jpg|jpeg|webp)$/, "Invalid filename format")
      .optional(),
  })
  .strict();

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Endpoint not available in production." }, { status: 403 });
  }

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ success: true, message: "Maintenance completed." });
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const validation = await parseAndValidateJson(req, saveWheelSchema);
    if (!validation.success) {
      return validation.response;
    }

    const { base64, filename } = validation.data;
    const cleanBase64 = base64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(cleanBase64, "base64");

    // Validate binary magic bytes
    const contentValidation = validateImageMagicBytes(buffer);
    if (!contentValidation.valid) {
      return NextResponse.json(
        { error: contentValidation.error || "Invalid image binary content." },
        { status: 400 }
      );
    }

    const targetFileName = filename || "about/numerology-wheel.png";
    const sanitizedRelPath = targetFileName
      .replace(/\\/g, "/")
      .replace(/\.\./g, "")
      .replace(/^\/+/, "");

    const finalRelPath = sanitizedRelPath.includes("/")
      ? sanitizedRelPath
      : `about/${sanitizedRelPath}`;
    const targetPath = path.join(process.cwd(), "public", "images", finalRelPath);
    const targetDir = path.dirname(targetPath);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.writeFileSync(targetPath, buffer);
    return NextResponse.json({ success: true, url: `/images/${finalRelPath}` });
  } catch (err) {
    return handleServerError(err, "POST /api/save-wheel", "Failed to save wheel image.");
  }
}
