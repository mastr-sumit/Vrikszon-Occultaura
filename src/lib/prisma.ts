import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

/**
 * Prisma Client singleton.
 *
 * Prisma 7 removed the built-in query engine — every provider now needs a
 * driver adapter. For SQLite that's @prisma/adapter-better-sqlite3.
 *
 * Next.js dev mode hot-reloads modules on every file save, which would
 * normally create a new PrismaClient (and a new DB connection) each time.
 * Stashing the instance on `globalThis` in development avoids exhausting
 * the connection pool.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./dev.db",
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
