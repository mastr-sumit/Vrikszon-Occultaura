import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

/**
 * One-off Admin Seeding Script (PostgreSQL / Supabase)
 *
 * Creates or updates an AdminUser record from environment variables.
 * Usage:
 *   SEED_ADMIN_EMAIL="admin@example.com" SEED_ADMIN_PASSWORD="YourSecurePassword" npm run seed:admin
 */
async function main() {
  const email = process.env.SEED_ADMIN_EMAIL?.toLowerCase().trim() || "admin@vrikszon.com";
  const password = process.env.SEED_ADMIN_PASSWORD || "Admin@123";
  const name = process.env.SEED_ADMIN_NAME?.trim() || "Admin";

  if (!email || !password) {
    console.error("\n========================================================");
    console.error("❌ Missing required environment variables.");
    console.error("Please provide both SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD.");
    console.error("========================================================\n");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("❌ Password must be at least 8 characters long.");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log(`\n⏳ Hashing password for admin user: ${email}...`);
    const passwordHash = await bcrypt.hash(password, 12);

    const admin = await prisma.adminUser.upsert({
      where: { email },
      update: {
        passwordHash,
        name,
      },
      create: {
        email,
        passwordHash,
        name,
      },
    });

    console.log("✅ Admin user configured successfully!");
    console.log(`   ID:    ${admin.id}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name:  ${admin.name}`);
    console.log(`   Created/Updated: ${admin.createdAt.toISOString()}\n`);
  } catch (error) {
    console.error("❌ Failed to seed admin user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
