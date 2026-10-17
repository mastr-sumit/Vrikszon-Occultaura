import "dotenv/config";
import { Pool } from "pg";

async function run() {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) {
    console.error("DATABASE_URL is not defined in environment");
    process.exit(1);
  }

  const connectionString = rawUrl.replace(":6543", ":5432");
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });

  try {
    const client = await pool.connect();
    console.log("Connected to PostgreSQL!");

    // Check Course columns
    await client.query(`
      ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "livePrice" INTEGER;
      ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "liveOriginalPrice" INTEGER;
      ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "nextBatch" TEXT;
    `);
    console.log("Course columns ensured.");

    // Remove problematic 'mode' column if present and add 'purchase_mode'
    await client.query(`
      ALTER TABLE "OrderItem" DROP COLUMN IF EXISTS "mode";
      ALTER TABLE "Payment" DROP COLUMN IF EXISTS "mode";
      ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "purchase_mode" TEXT;
      ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "purchase_mode" TEXT;
    `);
    console.log("OrderItem & Payment purchase_mode columns ensured.");

    // Test a sample SELECT on OrderItem
    const res = await client.query(`SELECT id, "purchase_mode" FROM "OrderItem" LIMIT 1`);
    console.log("Test SELECT on OrderItem succeeded, rows:", res.rowCount);

    // Test a sample SELECT on Course
    const resCourse = await client.query(`SELECT id, "livePrice", "liveOriginalPrice", "nextBatch" FROM "Course" LIMIT 1`);
    console.log("Test SELECT on Course succeeded, rows:", resCourse.rowCount);

    client.release();
  } catch (err: any) {
    console.error("Database script error:", err.message);
  } finally {
    await pool.end();
  }
}

run();
