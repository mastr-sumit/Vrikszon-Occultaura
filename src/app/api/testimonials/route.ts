import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/testimonials — Public endpoint to fetch all enabled testimonials
 */
export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { enabled: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("GET /api/testimonials error:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}
