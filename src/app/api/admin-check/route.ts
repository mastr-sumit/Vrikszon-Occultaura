import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  // 1. Strictly block diagnostic information in production environments
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Diagnostics endpoint is disabled in production." },
      { status: 403 }
    );
  }

  // 2. In development, require admin session or return sanitized environment status
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({
      status: "DEVELOPMENT_MODE",
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasAuthSecret: !!(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET),
      authenticated: false,
    });
  }

  const diagnostics: Record<string, unknown> = {
    status: "DEVELOPMENT_DIAGNOSTICS",
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasAuthSecret: !!process.env.AUTH_SECRET,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    authTrustHost: process.env.AUTH_TRUST_HOST,
    nodeEnv: process.env.NODE_ENV,
    user: session.user.email,
  };

  try {
    const adminCount = await prisma.adminUser.count();
    diagnostics.adminUsersCount = adminCount;

    return NextResponse.json(diagnostics, { status: 200 });
  } catch (error: unknown) {
    const err = error as Error;
    diagnostics.error = {
      message: err?.message || String(err),
      name: err?.name,
    };
    diagnostics.status = "ERROR";
    return NextResponse.json(diagnostics, { status: 500 });
  }
}
