import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { COURSES, type Course } from "@/data/courses";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET /api/courses — Public endpoint to fetch all active courses and masterclasses
 */
export async function GET() {
  try {
    const dbCourses = await prisma.course.findMany({
      where: {
        enabled: true,
      },
      include: {
        categoryRel: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formatted: Course[] = dbCourses.map((c) => ({
      id: c.id,
      slug: c.slug,
      title: c.title,
      category: c.categoryRel?.name || c.category || "Uncategorized",
      categoryId: c.categoryId || undefined,
      categorySlug:
        c.categoryRel?.slug ||
        (c.category ? c.category.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "uncategorized"),
      image: c.image,
      price: c.price,
      originalPrice: c.originalPrice,
      shortDescription: c.shortDescription,
      enrollHref: c.enrollHref || "/book-consultation",
      enabled: c.enabled,
    }));

    return NextResponse.json(formatted, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  } catch (error) {
    console.error("[PUBLIC_COURSES_GET_ERROR]", error);
    return NextResponse.json([], {
      status: 500,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  }
}
