import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export const dynamic = "force-dynamic";

const MIME_MAP: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".avi": "video/x-msvideo",
  ".ogv": "video/ogg",
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: segments } = await params;
    if (!segments || segments.length === 0) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Prevent path traversal
    const safeSegments = segments.map((s) => s.replace(/\.\./g, "").replace(/[/\\?%*:|"<>]/g, ""));
    const filePath = path.join(process.cwd(), "public", ...safeSegments);

    if (!fs.existsSync(filePath)) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const stat = await fs.promises.stat(filePath);
    if (!stat.isFile()) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_MAP[ext] || "application/octet-stream";
    const fileSize = stat.size;

    // HTTP Range Requests for videos
    const rangeHeader = request.headers.get("range");
    if (rangeHeader) {
      const parts = rangeHeader.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

      if (start >= fileSize || end >= fileSize) {
        return new NextResponse(null, {
          status: 416,
          headers: {
            "Content-Range": `bytes */${fileSize}`,
          },
        });
      }

      const chunkSize = end - start + 1;
      const fileStream = fs.createReadStream(filePath, { start, end });

      const responseStream = new ReadableStream({
        start(controller) {
          fileStream.on("data", (chunk) => controller.enqueue(chunk));
          fileStream.on("end", () => controller.close());
          fileStream.on("error", (err) => controller.error(err));
        },
      });

      return new NextResponse(responseStream, {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": String(chunkSize),
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    const fileStream = fs.createReadStream(filePath);
    const responseStream = new ReadableStream({
      start(controller) {
        fileStream.on("data", (chunk) => controller.enqueue(chunk));
        fileStream.on("end", () => controller.close());
        fileStream.on("error", (err) => controller.error(err));
      },
    });

    return new NextResponse(responseStream, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(fileSize),
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("[API_MEDIA_ROUTE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
