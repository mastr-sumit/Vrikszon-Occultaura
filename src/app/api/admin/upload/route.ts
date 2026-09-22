import { NextResponse } from "next/server";
import { auth } from "@/auth";
import path from "path";
import fs from "fs";
import { checkRouteRateLimit } from "@/lib/rate-limit";
import { handleServerError } from "@/lib/errors";
import {
  validateImageMagicBytes,
  validateVideoMagicBytes,
} from "@/lib/validations/file-security";

export const dynamic = "force-dynamic";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

function slugifyFileName(rawName: string): string {
  const nameWithoutExt = rawName.substring(0, rawName.lastIndexOf(".")) || rawName;
  const clean = nameWithoutExt
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return clean || "upload";
}

export async function POST(request: Request) {
  try {
    // 1. Authentication check
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Rate limit check for authenticated admin file uploads
    const rateLimit = checkRouteRateLimit(request, "authenticated");
    if (!rateLimit.allowed && rateLimit.response) {
      return rateLimit.response;
    }

    const { searchParams } = new URL(request.url);
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    if (!file || !(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "No valid file uploaded." }, { status: 400 });
    }

    const typeParam = (formData.get("type") as string) || searchParams.get("type") || "image";
    const uploadType = typeParam.toLowerCase() === "video" ? "video" : "image";

    // 3. File size limit enforcement
    const maxSize = uploadType === "image" ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    if (file.size > maxSize) {
      const maxMb = (maxSize / (1024 * 1024)).toFixed(0);
      const fileMb = (file.size / (1024 * 1024)).toFixed(2);
      console.warn(`[UPLOAD_SIZE_EXCEEDED] File "${file.name}" size ${fileMb}MB exceeds maximum limit of ${maxMb}MB.`);
      return NextResponse.json(
        { error: `File size (${fileMb}MB) exceeds the maximum allowed limit of ${maxMb}MB.` },
        { status: 400 }
      );
    }

    // 4. Read file buffer for binary content inspection
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 5. Binary Magic Bytes & Content Inspection (prevent MIME spoofing and executable uploads)
    const contentValidation =
      uploadType === "image"
        ? validateImageMagicBytes(buffer)
        : validateVideoMagicBytes(buffer);

    if (!contentValidation.valid || !contentValidation.extension) {
      console.warn(`[UPLOAD_REJECTED] /api/admin/upload security check failed:`, {
        fileName: file.name,
        browserMimeType: file.type,
        fileSize: file.size,
        uploadType,
        validationError: contentValidation.error,
        headerHex: buffer.subarray(0, 32).toString("hex"),
        headerAscii: buffer.subarray(0, 32).toString("latin1").replace(/[^\x20-\x7E]/g, "."),
      });
      return NextResponse.json(
        {
          error:
            contentValidation.error ||
            "File content failed security inspection or format is unsupported.",
        },
        { status: 400 }
      );
    }

    // 6. Path Traversal & Folder Isolation Protection
    const rawFolder =
      (formData.get("folder") as string) ||
      searchParams.get("folder") ||
      (uploadType === "video" ? "videos/testimonials" : "images/products");

    const sanitizedFolder = rawFolder
      .replace(/\\/g, "/")
      .replace(/\.\./g, "")
      .replace(/^\/+/, "")
      .replace(/\/+$/, "");

    if (!sanitizedFolder.startsWith("images") && !sanitizedFolder.startsWith("videos")) {
      return NextResponse.json(
        { error: "Invalid target upload folder. Must start with 'images' or 'videos'." },
        { status: 400 }
      );
    }

    // 7. Secure Filename Generation (Using verified extension, never trusting client extension)
    const secureExtension = contentValidation.extension;
    const baseSlug = slugifyFileName(file.name);
    const randomSuffix = `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
    const finalFilename = `${baseSlug}-${randomSuffix}${secureExtension}`;

    // 8. Write to isolated storage directory
    const targetDir = path.join(process.cwd(), "public", sanitizedFolder);
    await fs.promises.mkdir(targetDir, { recursive: true });

    const targetFilePath = path.join(targetDir, finalFilename);
    await fs.promises.writeFile(targetFilePath, buffer);

    const publicUrl = `/${sanitizedFolder}/${finalFilename}`;

    console.info(`[UPLOAD_SUCCESS] /api/admin/upload:`, {
      filename: finalFilename,
      url: publicUrl,
      size: file.size,
      mimeType: contentValidation.mimeType,
      type: uploadType,
    });

    return NextResponse.json(
      {
        success: true,
        url: publicUrl,
        filename: finalFilename,
        size: file.size,
        mimeType: contentValidation.mimeType,
      },
      { status: 201 }
    );
  } catch (error) {
    return handleServerError(error, "POST /api/admin/upload", "Failed to upload file safely. Please try again.");
  }
}
