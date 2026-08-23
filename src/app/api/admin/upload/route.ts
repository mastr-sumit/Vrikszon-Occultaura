import { NextResponse } from "next/server";
import { auth } from "@/auth";
import path from "path";
import fs from "fs";

export const dynamic = "force-dynamic";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
];

const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".svg", ".gif"];

const ALLOWED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
];

const ALLOWED_VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov"];

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
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    if (!file || !(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "No valid file uploaded." }, { status: 400 });
    }

    const typeParam = (formData.get("type") as string) || searchParams.get("type") || "image";
    const uploadType = typeParam.toLowerCase() === "video" ? "video" : "image";

    const rawFolder =
      (formData.get("folder") as string) ||
      searchParams.get("folder") ||
      (uploadType === "video" ? "videos/testimonials" : "images/products");

    // Prevent directory traversal attacks
    const sanitizedFolder = rawFolder
      .replace(/\\/g, "/")
      .replace(/\.\./g, "")
      .replace(/^\/+/, "")
      .replace(/\/+$/, "");

    // Validate allowed folder namespace
    if (!sanitizedFolder.startsWith("images") && !sanitizedFolder.startsWith("videos")) {
      return NextResponse.json(
        { error: "Invalid target upload folder. Must start with 'images' or 'videos'." },
        { status: 400 }
      );
    }

    const rawExtension = path.extname(file.name).toLowerCase();
    const mimeType = file.type.toLowerCase();

    if (uploadType === "image") {
      const isAllowedExt = ALLOWED_IMAGE_EXTENSIONS.includes(rawExtension);
      const isAllowedMime = ALLOWED_IMAGE_TYPES.includes(mimeType);

      if (!isAllowedExt && !isAllowedMime) {
        return NextResponse.json(
          {
            error:
              "Invalid image file format. Supported formats: JPG, PNG, WebP, SVG, GIF.",
          },
          { status: 400 }
        );
      }

      if (file.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          {
            error: `Image file is too large (${(file.size / (1024 * 1024)).toFixed(
              1
            )}MB). Maximum allowed size is 10MB.`,
          },
          { status: 400 }
        );
      }
    } else {
      const isAllowedExt = ALLOWED_VIDEO_EXTENSIONS.includes(rawExtension);
      const isAllowedMime = ALLOWED_VIDEO_TYPES.includes(mimeType);

      if (!isAllowedExt && !isAllowedMime) {
        return NextResponse.json(
          {
            error: "Invalid video file format. Supported formats: MP4, WebM.",
          },
          { status: 400 }
        );
      }

      if (file.size > MAX_VIDEO_SIZE) {
        return NextResponse.json(
          {
            error: `Video file is too large (${(file.size / (1024 * 1024)).toFixed(
              1
            )}MB). Maximum allowed size is 100MB.`,
          },
          { status: 400 }
        );
      }
    }

    // Generate clean sanitized filename with random collision avoidance
    const extension = rawExtension || (uploadType === "image" ? ".jpg" : ".mp4");
    const baseSlug = slugifyFileName(file.name);
    const randomSuffix = `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const finalFilename = `${baseSlug}-${randomSuffix}${extension}`;

    // Target directory inside public/
    const targetDir = path.join(process.cwd(), "public", sanitizedFolder);
    await fs.promises.mkdir(targetDir, { recursive: true });

    // Save file buffer to target directory
    const targetFilePath = path.join(targetDir, finalFilename);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await fs.promises.writeFile(targetFilePath, buffer);

    const publicUrl = `/${sanitizedFolder}/${finalFilename}`;

    return NextResponse.json(
      {
        success: true,
        url: publicUrl,
        filename: finalFilename,
        size: file.size,
        type: file.type,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/admin/upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file. Please try again." },
      { status: 500 }
    );
  }
}
