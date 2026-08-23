import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { PRODUCTS } from "@/data/products";

export async function GET() {
  try {
    const imagesDir = path.join(process.cwd(), "public", "images");
    const readdirEntries = fs.readdirSync(imagesDir);

    const hasExactLowercase = readdirEntries.includes("products");
    const hasUppercase = readdirEntries.includes("Products");

    const targetDir = path.join(imagesDir, "products");
    const actualFilesOnDisk = fs.existsSync(targetDir) ? fs.readdirSync(targetDir) : [];

    const fileMap = new Set(actualFilesOnDisk);

    const productChecks = PRODUCTS.map((product) => {
      const imgPath = product.image || `/images/products/${product.slug}.jpg`;
      const fileName = imgPath.split("/").pop() || "";
      const existsOnDisk = fileMap.has(fileName);
      return {
        id: product.id,
        name: product.name,
        imgPath,
        fileName,
        existsOnDisk,
      };
    });

    const missingFiles = productChecks.filter((p) => !p.existsOnDisk);

    return NextResponse.json({
      success: missingFiles.length === 0 && hasExactLowercase && !hasUppercase,
      hasExactLowercase,
      hasUppercase,
      totalProductsInTs: PRODUCTS.length,
      filesOnDiskCount: actualFilesOnDisk.length,
      missingFiles,
      readdirEntries,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
