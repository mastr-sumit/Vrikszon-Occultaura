import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const imagesDir = path.join(process.cwd(), "public", "images");
    const oldDir = path.join(imagesDir, "Products");
    const tempDir = path.join(imagesDir, "products_temp");
    const targetDir = path.join(imagesDir, "products");

    const dirsBefore = fs.readdirSync(imagesDir);
    const results: string[] = [];

    results.push(`Directories in public/images before: ${JSON.stringify(dirsBefore)}`);

    if (dirsBefore.includes("Products")) {
      fs.renameSync(oldDir, tempDir);
      fs.renameSync(tempDir, targetDir);
      results.push("Renamed Products -> products_temp -> products");
    } else if (dirsBefore.includes("products")) {
      results.push("Directory 'products' already exists");
    } else {
      results.push("Neither Products nor products directory found!");
    }

    // Delete duplicate file
    const dupFile = path.join(targetDir, "7-mukhi-rudraksha-citrine-bracelet-duplicate.jpg");
    if (fs.existsSync(dupFile)) {
      fs.unlinkSync(dupFile);
      results.push("Deleted 7-mukhi-rudraksha-citrine-bracelet-duplicate.jpg");
    } else {
      results.push("Duplicate file not found or already deleted");
    }

    const dirsAfter = fs.readdirSync(imagesDir);
    results.push(`Directories in public/images after: ${JSON.stringify(dirsAfter)}`);

    const filesInProducts = fs.readdirSync(targetDir);
    results.push(`Total files in public/images/products: ${filesInProducts.length}`);

    return NextResponse.json({ success: true, results, files: filesInProducts });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message, stack: err.stack }, { status: 500 });
  }
}
