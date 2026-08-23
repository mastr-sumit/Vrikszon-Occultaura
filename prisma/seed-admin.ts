import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

/**
 * One-off Admin Seeding Script
 *
 * Creates or updates an AdminUser record from environment variables.
 * Usage:
 *   SEED_ADMIN_EMAIL="admin@example.com" SEED_ADMIN_PASSWORD="YourSecurePassword" npm run seed:admin
 */
async function main() {
  const email = process.env.SEED_ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME?.trim() || "Admin";

  if (!email || !password) {
    console.error("\n========================================================");
    console.error("❌ Missing required environment variables.");
    console.error("Please provide both SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD.");
    console.error("\nExample (PowerShell):");
    console.error('  $env:SEED_ADMIN_EMAIL="admin@example.com"; $env:SEED_ADMIN_PASSWORD="YourPassword"; npm run seed:admin');
    console.error("\nExample (Bash / macOS / Linux):");
    console.error('  SEED_ADMIN_EMAIL="admin@example.com" SEED_ADMIN_PASSWORD="YourPassword" npm run seed:admin');
    console.error("========================================================\n");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("❌ Password must be at least 8 characters long.");
    process.exit(1);
  }

  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || "file:./dev.db",
  });
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
  }
}

main();
