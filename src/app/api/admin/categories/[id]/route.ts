import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

// PUT /api/admin/categories/[id] - Rename category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const name = body.name?.trim();

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Category name must be at least 2 characters" },
        { status: 400 }
      );
    }

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    // Generate updated slug if name changed
    let slug = existing.slug;
    if (existing.name !== name) {
      let baseSlug =
        existing.type === "COURSE"
          ? `course-${slugify(name)}`
          : existing.type === "SERVICE"
          ? `service-${slugify(name)}`
          : slugify(name);
      if (!baseSlug) baseSlug = `category-${Date.now()}`;
      slug = baseSlug;
      let counter = 1;
      while (true) {
        const conflict = await prisma.category.findUnique({ where: { slug } });
        if (!conflict || conflict.id === id) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    // Execute in transaction to update Category and cascade string updates to linked Products/Courses/Services
    const updated = await prisma.$transaction(async (tx) => {
      const cat = await tx.category.update({
        where: { id },
        data: { name, slug },
        include: {
          _count: {
            select: { products: true, courses: true, services: true },
          },
        },
      });

      // Update product category strings
      await tx.product.updateMany({
        where: { categoryId: id },
        data: { category: name },
      });

      // Update course category strings
      await tx.course.updateMany({
        where: { categoryId: id },
        data: { category: name },
      });

      // Update service category strings
      await tx.service.updateMany({
        where: { categoryId: id },
        data: { category: name },
      });

      return cat;
    });

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/courses");
    revalidatePath("/services");
    revalidatePath("/book-consultation");

    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      slug: updated.slug,
      type: updated.type,
      productCount: updated._count.products,
      courseCount: updated._count.courses,
      serviceCount: updated._count.services,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  } catch (error: any) {
    console.error("PUT /api/admin/categories/[id] error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/categories/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true, courses: true, services: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const assignedCount = category._count.products + category._count.courses + category._count.services;
    if (assignedCount > 0) {
      const typeLabel =
        category.type === "COURSE"
          ? "courses"
          : category.type === "SERVICE"
          ? "services"
          : "products";
      return NextResponse.json(
        {
          error: `Cannot delete "${category.name}" because it is currently assigned to ${assignedCount} ${typeLabel}. Please reassign or delete those items first.`,
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({ where: { id } });

    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/courses");
    revalidatePath("/services");
    revalidatePath("/book-consultation");

    return NextResponse.json({ success: true, message: `Category "${category.name}" deleted successfully` });
  } catch (error: any) {
    console.error("DELETE /api/admin/categories/[id] error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}
