import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const root = process.cwd();
  const targetDir = path.join(root, "public", "images", "products");
  // Remove WhatsApp files in products
  const files = fs.readdirSync(targetDir);
  let removedCount = 0;
  for (const file of files) {
    if (file.startsWith("WhatsApp Image")) {
      fs.unlinkSync(path.join(targetDir, file));
      removedCount++;
    }
  }

  return NextResponse.json({ success: true, removedCount });
}
