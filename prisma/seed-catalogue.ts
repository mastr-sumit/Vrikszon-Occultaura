import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PRODUCTS } from "../src/data/products";
import { COURSES } from "../src/data/courses";

/**
 * One-off Catalogue Migration Script (PostgreSQL / Supabase)
 *
 * Migrates static PRODUCTS and COURSES from typescript data files into PostgreSQL database.
 * Uses upsert by slug so the script is idempotent and safe to re-run.
 */
async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("\n📦 Starting Catalogue Migration to PostgreSQL (Supabase) Database...\n");

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
    console.log(`✅ Migrated ${productsCount} Products successfully.`);

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
    console.log(`✅ Migrated ${coursesCount} Courses successfully.\n`);

    const totalProducts = await prisma.product.count();
    const totalCourses = await prisma.course.count();
    console.log(`📊 Current DB Totals -> Products: ${totalProducts}, Courses: ${totalCourses}\n`);
  } catch (error) {
    console.error("❌ Catalogue migration failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
