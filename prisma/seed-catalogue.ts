import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PRODUCTS } from "../src/data/products";
import { COURSES } from "../src/data/courses";

/**
 * One-off Catalogue Migration Script
 *
 * Migrates static PRODUCTS and COURSES from typescript data files into SQLite database.
 * Uses upsert by slug so the script is idempotent and safe to re-run.
 */
async function main() {
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || "file:./dev.db",
  });
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("\n📦 Starting Catalogue Migration to SQLite Database...\n");

    // 1. Migrate Products
    let productsCount = 0;
    for (const product of PRODUCTS) {
      await prisma.product.upsert({
        where: { slug: product.slug },
        update: {
          name: product.name,
          category: product.category,
          shortDescription: product.shortDescription,
          subtitle: product.subtitle ?? null,
          benefits: product.benefits ? JSON.stringify(product.benefits) : null,
          price: product.price,
          image: product.image,
          icon: product.icon,
          featured: product.featured,
          enabled: product.enabled,
          href: product.href ?? null,
          variantsNote: product.variantsNote ?? null,
        },
        create: {
          id: product.id,
          slug: product.slug,
          name: product.name,
          category: product.category,
          shortDescription: product.shortDescription,
          subtitle: product.subtitle ?? null,
          benefits: product.benefits ? JSON.stringify(product.benefits) : null,
          price: product.price,
          image: product.image,
          icon: product.icon,
          featured: product.featured,
          enabled: product.enabled,
          href: product.href ?? null,
          variantsNote: product.variantsNote ?? null,
        },
      });
      productsCount++;
    }
    console.log(`✅ Products: ${productsCount} products successfully upserted.`);

    // 2. Migrate Courses
    let coursesCount = 0;
    for (const course of COURSES) {
      await prisma.course.upsert({
        where: { slug: course.slug },
        update: {
          title: course.title,
          category: course.category ?? null,
          image: course.image,
          price: course.price,
          originalPrice: course.originalPrice ?? null,
          shortDescription: course.shortDescription,
          enrollHref: course.enrollHref,
          enabled: course.enabled,
        },
        create: {
          id: course.id,
          slug: course.slug,
          title: course.title,
          category: course.category ?? null,
          image: course.image,
          price: course.price,
          originalPrice: course.originalPrice ?? null,
          shortDescription: course.shortDescription,
          enrollHref: course.enrollHref,
          enabled: course.enabled,
        },
      });
      coursesCount++;
    }
    console.log(`✅ Courses:  ${coursesCount} courses successfully upserted.`);

    // 3. Summary & Verification
    const totalProducts = await prisma.product.count();
    const totalCourses = await prisma.course.count();

    console.log("\n========================================================");
    console.log("🎉 Catalogue Migration Completed Successfully!");
    console.log(`   Total Products in Database: ${totalProducts}`);
    console.log(`   Total Courses in Database:  ${totalCourses}`);
    console.log("========================================================\n");
  } catch (error) {
    console.error("❌ Catalogue migration failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
