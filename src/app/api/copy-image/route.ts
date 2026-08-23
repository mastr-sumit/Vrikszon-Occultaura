import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const tempFiles = [
    path.join(process.cwd(), "src", "app", "api", "user-image", "route.ts"),
    path.join(process.cwd(), "src", "app", "api", "process-wheel", "route.ts"),
    path.join(process.cwd(), "src", "app", "process-user-image", "page.tsx"),
  ];

  const results: string[] = [];
  for (const f of tempFiles) {
    if (fs.existsSync(f)) {
      fs.unlinkSync(f);
      results.push(`Deleted ${f}`);
    }
  }

  // Remove empty directories if present
  const tempDirs = [
    path.join(process.cwd(), "src", "app", "api", "user-image"),
    path.join(process.cwd(), "src", "app", "api", "process-wheel"),
    path.join(process.cwd(), "src", "app", "process-user-image"),
  ];
  for (const d of tempDirs) {
    if (fs.existsSync(d)) {
      fs.rmdirSync(d);
      results.push(`Removed dir ${d}`);
    }
  }

  return NextResponse.json({ success: true, results });
}
