import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
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

    // Link or auto-create Category record
    let categoryId: string | null = null;
    if (data.category) {
      const cat = await prisma.category.findFirst({
        where: { name: { equals: data.category.trim(), mode: "insensitive" }, type: "COURSE" },
      });
      if (cat) {
        categoryId = cat.id;
      }
    }

    const t0 = Date.now();
    const course = await prisma.course.create({
      data: {
        slug: data.slug,
        title: data.title,
        category: data.category ?? null,
        categoryId,
        image: data.image,
        price: data.price ?? null,
        originalPrice: data.originalPrice ?? null,
        shortDescription: data.shortDescription,
        enrollHref: data.enrollHref,
        enabled: data.enabled ?? true,
      },
    });
    const tDb = Date.now();

    revalidatePath("/");
    revalidatePath("/courses");
    const tRevalidate = Date.now();
    console.log(`[PERF_TIMING] Course Create (${course.title}): DB=${tDb - t0}ms, Revalidate=${tRevalidate - tDb}ms, Total=${tRevalidate - t0}ms`);

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    return handleServerError(error, "POST /api/admin/courses", "Failed to create course.");
  }
}
