import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

async function main() {
  const rawUrl = process.env.DATABASE_URL || "";
  const connectionString = rawUrl.trim().replace(/^["']|["']$/g, "");

  if (!connectionString) {
    console.error("❌ Error: DATABASE_URL environment variable is required.");
    process.exit(1);
  }

  const email = (process.env.SEED_ADMIN_EMAIL || "admin@vrikszon.com").toLowerCase().trim();
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME?.trim() || "Admin";

  if (!password) {
    console.error("❌ Error: SEED_ADMIN_PASSWORD environment variable is required.");
    console.error("   Example: SEED_ADMIN_PASSWORD=\"YourSecurePassword123!\" npm run seed:admin");
    process.exit(1);
  }

  console.log(`\n⏳ Connecting to PostgreSQL database...`);
  const pool = new Pool({
    connectionString,
    ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false },
  });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log(`⏳ Hashing password for admin user: ${email}...`);
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

    console.log("✅ Admin user configured successfully in database!");
    console.log(`   ID:    ${admin.id}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name:  ${admin.name}`);
    console.log(`   Updated: ${admin.createdAt.toISOString()}\n`);
  } catch (error) {
    console.error("❌ Failed to seed admin user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
