import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
  const diagnostics: Record<string, unknown> = {
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasAuthSecret: !!process.env.AUTH_SECRET,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    authTrustHost: process.env.AUTH_TRUST_HOST,
    nodeEnv: process.env.NODE_ENV,
  };

  try {
    const rawUrl = process.env.DATABASE_URL || "";
    diagnostics.rawDbUrlPreview = rawUrl ? rawUrl.replace(/:[^:@]+@/, ":***@") : "EMPTY";

    const email = "admin@vrikszon.com";
    const testPassword = "Vrikszon@Auth2026!";

    // Query Prisma AdminUser
    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin) {
      diagnostics.adminFound = false;
      diagnostics.message = "No admin user found with email admin@vrikszon.com";
      return NextResponse.json(diagnostics, { status: 200 });
    }

    diagnostics.adminFound = true;
    diagnostics.adminEmail = admin.email;
    diagnostics.adminName = admin.name;
    diagnostics.hasHash = !!admin.passwordHash;
    diagnostics.hashLength = admin.passwordHash ? admin.passwordHash.length : 0;
    diagnostics.hashPrefix = admin.passwordHash ? admin.passwordHash.substring(0, 7) : "NONE";

    // Test bcrypt compare
    const match = await bcrypt.compare(testPassword, admin.passwordHash);
    diagnostics.passwordMatch = match;
    diagnostics.status = match ? "SUCCESS" : "PASSWORD_MISMATCH";

    return NextResponse.json(diagnostics, { status: 200 });
  } catch (error: unknown) {
    const err = error as Error;
    diagnostics.error = {
      message: err?.message || String(err),
      name: err?.name,
      stack: err?.stack,
    };
    diagnostics.status = "ERROR";
    return NextResponse.json(diagnostics, { status: 500 });
  }
}
