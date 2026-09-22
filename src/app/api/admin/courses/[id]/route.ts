import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateCourseSchema, resourceIdSchema } from "@/lib/validations/schemas";
import { parseAndValidateJson, validateInput } from "@/lib/validations/validator";
import { handleServerError } from "@/lib/errors";

/**
 * GET /api/admin/courses/[id] — Get single course by id
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const idValidation = validateInput(resourceIdSchema, id);
    if (!idValidation.success) {
      return idValidation.response;
    }

    const course = await prisma.course.findUnique({
      where: { id: idValidation.data },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    return handleServerError(error, "GET /api/admin/courses/[id]", "Failed to fetch course.");
  }
}

/**
 * PATCH /api/admin/courses/[id] — Update course by id
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const idValidation = validateInput(resourceIdSchema, id);
    if (!idValidation.success) {
      return idValidation.response;
    }

    const existingCourse = await prisma.course.findUnique({
      where: { id: idValidation.data },
    });

    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const validation = await parseAndValidateJson(request, updateCourseSchema);
    if (!validation.success) {
      return validation.response;
    }

    const data = validation.data;

    // Check slug uniqueness if slug is being updated
    if (data.slug && data.slug !== existingCourse.slug) {
      const slugConflict = await prisma.course.findUnique({
        where: { slug: data.slug },
      });

      if (slugConflict) {
        return NextResponse.json(
          { error: `Course slug "${data.slug}" is already in use` },
          { status: 409 }
        );
      }
    }

    // Link or auto-create Category record if category changed
    let categoryId: string | null | undefined = undefined;
    if (data.category !== undefined) {
      if (data.category) {
        const cat = await prisma.category.findFirst({
          where: { name: { equals: data.category.trim(), mode: "insensitive" }, type: "COURSE" },
        });
        if (cat) {
          categoryId = cat.id;
        }
      } else {
        categoryId = null;
      }
    }

    const t0 = Date.now();
    const updated = await prisma.course.update({
      where: { id: idValidation.data },
      data: {
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.category !== undefined && { category: data.category }),
        ...(categoryId !== undefined && { categoryId }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.originalPrice !== undefined && { originalPrice: data.originalPrice }),
        ...(data.shortDescription !== undefined && { shortDescription: data.shortDescription }),
        ...(data.enrollHref !== undefined && { enrollHref: data.enrollHref }),
        ...(data.enabled !== undefined && { enabled: data.enabled }),
      },
    });
    const tDb = Date.now();

    revalidatePath("/");
    revalidatePath("/courses");
    const tRevalidate = Date.now();
    console.log(`[PERF_TIMING] Course Update (${updated.title}): DB=${tDb - t0}ms, Revalidate=${tRevalidate - tDb}ms, Total=${tRevalidate - t0}ms`);

    return NextResponse.json(updated);
  } catch (error) {
    return handleServerError(error, "PATCH /api/admin/courses/[id]", "Failed to update course.");
  }
}

/**
 * DELETE /api/admin/courses/[id] — Delete course by id
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const idValidation = validateInput(resourceIdSchema, id);
    if (!idValidation.success) {
      return idValidation.response;
    }

    const existingCourse = await prisma.course.findUnique({
      where: { id: idValidation.data },
    });

    if (!existingCourse) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const t0 = Date.now();
    await prisma.course.delete({
      where: { id: idValidation.data },
    });
    const tDb = Date.now();

    revalidatePath("/");
    revalidatePath("/courses");
    const tRevalidate = Date.now();
    console.log(`[PERF_TIMING] Course Delete (${existingCourse.title}): DB=${tDb - t0}ms, Revalidate=${tRevalidate - tDb}ms, Total=${tRevalidate - t0}ms`);

    return NextResponse.json({
      success: true,
      message: `Course "${existingCourse.title}" deleted successfully`,
    });
  } catch (error) {
    return handleServerError(error, "DELETE /api/admin/courses/[id]", "Failed to delete course.");
  }
}
