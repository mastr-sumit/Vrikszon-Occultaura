import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import fs from "fs";
import path from "path";

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("\n📦 Starting Testimonials Seeding to PostgreSQL (Supabase) Database...\n");

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
    await pool.end();
  }
}

main();
