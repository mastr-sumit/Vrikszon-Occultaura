import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

async function main() {
  const rawUrl = process.env.DATABASE_URL || "";
  const connectionString = rawUrl.trim().replace(/^["']|["']$/g, "");

  const email = (process.env.SEED_ADMIN_EMAIL || "admin@vrikszon.com").toLowerCase().trim();
  const password = process.env.SEED_ADMIN_PASSWORD || "Vrikszon@Auth2026!";
  const name = process.env.SEED_ADMIN_NAME?.trim() || "Admin";

  console.log(`\n⏳ Connecting to Supabase database...`);
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
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

    console.log("✅ Admin user configured successfully in Supabase!");
    console.log(`   ID:    ${admin.id}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Name:  ${admin.name}`);
    console.log(`   Updated: ${admin.createdAt.toISOString()}`);
    console.log(`\n🔐 Verified Login Credentials:`);
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}\n`);
  } catch (error) {
    console.error("❌ Failed to seed admin user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
