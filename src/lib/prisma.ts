import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

/**
 * Prisma Client singleton with PostgreSQL (Supabase) driver adapter.
 *
 * Configures robust connection handling, trimming, quotes sanitization,
 * and SSL support across serverless environments.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

const rawConnectionString = process.env.DATABASE_URL || "";
const connectionString = rawConnectionString.trim().replace(/^["']|["']$/g, "");

const isLocalhost = connectionString.includes("localhost") || connectionString.includes("127.0.0.1");

const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString,
    max: process.env.NODE_ENV === "production" ? 10 : 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    ssl: isLocalhost ? false : { rejectUnauthorized: false },
  });

const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}
