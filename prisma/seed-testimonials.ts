import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import fs from "fs";
import path from "path";

async function main() {
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || "file:./dev.db",
  });
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("\n📦 Starting Testimonials Seeding to SQLite Database...\n");

    const posterPath = path.join(process.cwd(), "public", "images", "testimonials", "chetan-poster.jpg");
    const posterExists = fs.existsSync(posterPath);

    const chetanTestimonial = {
      id: "testimonial-chetan",
      clientName: "Chetan",
      clientRoleOrLocation: null,
      quote: null,
      videoSrc: "/videos/testimonials/chetan.mp4",
      posterImage: posterExists ? "/images/testimonials/chetan-poster.jpg" : null,
      featured: true,
      enabled: true,
    };

    await prisma.testimonial.upsert({
      where: { id: chetanTestimonial.id },
      update: {
        clientName: chetanTestimonial.clientName,
        clientRoleOrLocation: chetanTestimonial.clientRoleOrLocation,
        quote: chetanTestimonial.quote,
        videoSrc: chetanTestimonial.videoSrc,
        posterImage: chetanTestimonial.posterImage,
        featured: chetanTestimonial.featured,
        enabled: chetanTestimonial.enabled,
      },
      create: chetanTestimonial,
    });

    console.log("✅ Seeded Chetan's testimonial successfully!");

    const totalTestimonials = await prisma.testimonial.count();
    console.log(`   Total Testimonials in Database: ${totalTestimonials}\n`);
  } catch (error) {
    console.error("❌ Testimonial seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
