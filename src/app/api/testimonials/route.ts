import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { handleServerError } from "@/lib/errors";

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
    return handleServerError(
      error,
      "GET /api/testimonials",
      "Unable to fetch testimonials at this time."
    );
  }
}
