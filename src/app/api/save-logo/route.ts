import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { z } from "zod";
import { parseAndValidateJson } from "@/lib/validations/validator";
import { auth } from "@/auth";
import { handleServerError } from "@/lib/errors";
import { validateImageMagicBytes } from "@/lib/validations/file-security";

const saveLogoSchema = z
  .object({
    dataUrl: z
      .string()
      .trim()
      .min(10, "Base64 data URL too short")
      .max(15 * 1024 * 1024, "Image data URL exceeds maximum limit (15MB)")
      .regex(/^data:image\/(png|jpeg|webp|jpg);base64,[A-Za-z0-9+/=]+$/, "Invalid base64 image format"),
  })
  .strict();

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const validation = await parseAndValidateJson(req, saveLogoSchema);
    if (!validation.success) {
      return validation.response;
    }

    const { dataUrl } = validation.data;
    const base64Data = dataUrl.replace(/^data:image\/[a-zA-Z]+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Validate binary magic bytes to prevent masquerading scripts
    const contentValidation = validateImageMagicBytes(buffer);
    if (!contentValidation.valid) {
      return NextResponse.json(
        { error: contentValidation.error || "Invalid image binary content." },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), "public/images/logo.png");
    fs.writeFileSync(filePath, buffer);
    return NextResponse.json({ success: true, path: "/images/logo.png" });
  } catch (err: unknown) {
    return handleServerError(err, "POST /api/save-logo", "Failed to save logo.");
  }
}
