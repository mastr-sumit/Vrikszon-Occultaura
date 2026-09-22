import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createTestimonialSchema } from "@/lib/validations/schemas";
import { parseAndValidateJson } from "@/lib/validations/validator";
import { handleServerError } from "@/lib/errors";

/**
 * GET /api/admin/testimonials — List all testimonials ordered by createdAt desc
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    return handleServerError(error, "GET /api/admin/testimonials", "Failed to fetch testimonials.");
  }
}

/**
 * POST /api/admin/testimonials — Create a new testimonial
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const validation = await parseAndValidateJson(request, createTestimonialSchema);
    if (!validation.success) {
      return validation.response;
    }

    const data = validation.data;

    const t0 = Date.now();
    const testimonial = await prisma.testimonial.create({
      data: {
        clientName: data.clientName,
        clientRoleOrLocation: data.clientRoleOrLocation ?? null,
        quote: data.quote ?? null,
        videoSrc: data.videoSrc ?? null,
        posterImage: data.posterImage ?? null,
        featured: data.featured ?? false,
        enabled: data.enabled ?? true,
      },
    });
    const tDb = Date.now();

    revalidatePath("/");
    const tRevalidate = Date.now();
    console.log(`[PERF_TIMING] Testimonial Create (${testimonial.clientName}): DB=${tDb - t0}ms, Revalidate=${tRevalidate - tDb}ms, Total=${tRevalidate - t0}ms`);

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    return handleServerError(error, "POST /api/admin/testimonials", "Failed to create testimonial.");
  }
}
