import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createCourseSchema } from "@/lib/validations/schemas";
import { parseAndValidateJson } from "@/lib/validations/validator";
import { handleServerError } from "@/lib/errors";

/**
 * GET /api/admin/courses — List all courses ordered by createdAt desc
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(courses);
  } catch (error) {
    return handleServerError(error, "GET /api/admin/courses", "Failed to fetch courses.");
  }
}

/**
 * POST /api/admin/courses — Create a new course
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const validation = await parseAndValidateJson(request, createCourseSchema);
    if (!validation.success) {
      return validation.response;
    }

    const data = validation.data;

    // Check slug uniqueness
    const existing = await prisma.course.findUnique({
      where: { slug: data.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: `Course slug "${data.slug}" is already in use` },
        { status: 409 }
      );
    }

    const course = await prisma.course.create({
      data: {
        slug: data.slug,
        title: data.title,
        category: data.category ?? null,
        image: data.image,
        price: data.price ?? null,
        originalPrice: data.originalPrice ?? null,
        shortDescription: data.shortDescription,
        enrollHref: data.enrollHref,
        enabled: data.enabled ?? true,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    return handleServerError(error, "POST /api/admin/courses", "Failed to create course.");
  }
}
