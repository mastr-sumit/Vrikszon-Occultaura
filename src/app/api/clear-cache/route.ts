import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const projectRoot = process.cwd();
  const nextDir = path.join(projectRoot, ".next");
  const wheelPath = path.join(projectRoot, "public", "images", "about", "numerology-wheel.png");

  const deletedPaths: string[] = [];

  function removeDirRecursive(dirPath: string) {
    if (fs.existsSync(dirPath)) {
      const items = fs.readdirSync(dirPath);
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          if (item === "cache" || item === "images" || item === "fetch-cache") {
            fs.rmSync(fullPath, { recursive: true, force: true });
            deletedPaths.push(fullPath);
          } else {
            removeDirRecursive(fullPath);
          }
        }
      }
    }
  }

  try {
    removeDirRecursive(nextDir);

    let fileInfo = null;
    if (fs.existsSync(wheelPath)) {
      const stats = fs.statSync(wheelPath);
      fileInfo = {
        exists: true,
        sizeBytes: stats.size,
        lastModified: stats.mtime,
      };
    }

    return NextResponse.json({
      success: true,
      deletedPaths,
      fileInfo,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
