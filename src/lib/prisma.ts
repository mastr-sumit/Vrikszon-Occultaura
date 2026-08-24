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

function normalizeConnectionString(raw: string): string {
  const url = (raw || "").trim().replace(/^["']|["']$/g, "");
  if (!url) {
    return "postgresql://postgres.kqachpdbtvmarqfytxht:Administratio123@aws-0-ap-south-1.pooler.supabase.com:6543/postgres";
  }

  // Convert IPv6 direct Supabase host (db.[ref].supabase.co) to IPv4 Pooler host for serverless environments (Netlify/AWS Lambda)
  const match = url.match(/postgresql:\/\/([^:]+):([^@]+)@db\.([a-z0-9]+)\.supabase\.co(?::\d+)?\/(.*)/);
  if (match) {
    const [, user, pass, projectRef, dbName] = match;
    const poolerUser = user.includes(".") ? user : `${user}.${projectRef}`;
    return `postgresql://${poolerUser}:${pass}@aws-0-ap-south-1.pooler.supabase.com:6543/${dbName || "postgres"}`;
  }

  return url;
}

const connectionString = normalizeConnectionString(process.env.DATABASE_URL || "");

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
