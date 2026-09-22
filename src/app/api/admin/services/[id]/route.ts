import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { handleServerError } from "@/lib/errors";

export const dynamic = "force-dynamic";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/&/g, "and")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

/**
 * GET /api/admin/services/[id] — Get single service by id
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
    const service = await prisma.service.findUnique({
      where: { id },
      include: { categoryRel: true },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error) {
    return handleServerError(error, "GET /api/admin/services/[id]", "Failed to fetch service.");
  }
}

/**
 * PATCH /api/admin/services/[id] — Update service by id
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
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const body = await request.json();

    // Check slug uniqueness if changed
    if (body.slug && body.slug !== existing.slug) {
      const conflict = await prisma.service.findUnique({ where: { slug: body.slug } });
      if (conflict) {
        return NextResponse.json({ error: `Service slug "${body.slug}" is already in use` }, { status: 409 });
      }
    }

    // Category update handling
    let categoryId: string | undefined = undefined;
    if (body.category !== undefined) {
      const catName = body.category?.trim() || "Numerology";
      let category = await prisma.category.findFirst({
        where: { name: { equals: catName, mode: "insensitive" }, type: "SERVICE" },
      });
      if (!category) {
        category = await prisma.category.create({
          data: {
            name: catName,
            slug: `service-${slugify(catName)}`,
            type: "SERVICE",
          },
        });
      }
      categoryId = category.id;
    }

    const updated = await prisma.service.update({
      where: { id },
      data: {
        ...(body.slug !== undefined && { slug: body.slug }),
        ...(body.name !== undefined && { name: body.name }),
        ...(body.category !== undefined && { category: body.category }),
        ...(categoryId !== undefined && { categoryId }),
        ...(body.shortDescription !== undefined && { shortDescription: body.shortDescription }),
        ...(body.longDescription !== undefined && { longDescription: body.longDescription }),
        ...(body.price !== undefined && {
          price: body.price !== null && body.price !== "" ? Number(body.price) : null,
        }),
        ...(body.durationMinutes !== undefined && {
          durationMinutes: body.durationMinutes !== null && body.durationMinutes !== "" ? Number(body.durationMinutes) : null,
        }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.featured !== undefined && { featured: !!body.featured }),
        ...(body.enabled !== undefined && { enabled: !!body.enabled }),
        ...(body.archived !== undefined && { archived: !!body.archived }),
        ...(body.displayOrder !== undefined && { displayOrder: Number(body.displayOrder) }),
        ...(body.href !== undefined && { href: body.href }),
      },
      include: {
        categoryRel: true,
      },
    });

    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath("/book-consultation");

    return NextResponse.json(updated);
  } catch (error) {
    return handleServerError(error, "PATCH /api/admin/services/[id]", "Failed to update service.");
  }
}

/**
 * DELETE /api/admin/services/[id] — Delete service by id
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
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    await prisma.service.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/services");
    revalidatePath("/book-consultation");

    return NextResponse.json({ success: true, message: `Service "${existing.name}" deleted successfully` });
  } catch (error) {
    return handleServerError(error, "DELETE /api/admin/services/[id]", "Failed to delete service.");
  }
}
