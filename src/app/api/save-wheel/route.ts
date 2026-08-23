import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const tempFiles = [
    path.join(process.cwd(), "src", "app", "api", "get-user-base64", "route.ts"),
    path.join(process.cwd(), "src", "app", "api", "inspect-images", "route.ts"),
    path.join(process.cwd(), "src", "app", "api", "ref-image", "route.ts"),
    path.join(process.cwd(), "src", "app", "process-user-image", "page.tsx"),
    path.join(process.cwd(), "src", "app", "process-philosophy-wheel", "page.tsx"),
    path.join(process.cwd(), "src", "app", "generate-sacred-wheel", "page.tsx"),
    path.join(process.cwd(), "src", "app", "generate-zodiac-icons", "page.tsx"),
  ];

  for (const f of tempFiles) {
    if (fs.existsSync(f)) {
      fs.unlinkSync(f);
    }
  }

  const tempDirs = [
    path.join(process.cwd(), "src", "app", "api", "get-user-base64"),
    path.join(process.cwd(), "src", "app", "api", "inspect-images"),
    path.join(process.cwd(), "src", "app", "api", "ref-image"),
    path.join(process.cwd(), "src", "app", "process-user-image"),
    path.join(process.cwd(), "src", "app", "process-philosophy-wheel"),
    path.join(process.cwd(), "src", "app", "generate-sacred-wheel"),
    path.join(process.cwd(), "src", "app", "generate-zodiac-icons"),
  ];
  for (const d of tempDirs) {
    if (fs.existsSync(d)) {
      fs.rmdirSync(d);
    }
  }

  return NextResponse.json({ success: true, message: "Cleaned temporary files" });
}

export async function POST(req: Request) {
  try {
    const { base64, filename } = await req.json();
    if (!base64) {
      return NextResponse.json({ error: "Missing base64 data" }, { status: 400 });
    }

    const cleanBase64 = base64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(cleanBase64, "base64");

    const targetFileName = filename || "about/numerology-wheel.png";
    const relPath = targetFileName.includes("/") ? targetFileName : `about/${targetFileName}`;
    const targetPath = path.join(process.cwd(), "public", "images", relPath);
    const targetDir = path.dirname(targetPath);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.writeFileSync(targetPath, buffer);
    return NextResponse.json({ success: true, path: targetPath, bytesWritten: buffer.length });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
